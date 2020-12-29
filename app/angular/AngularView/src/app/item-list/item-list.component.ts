import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ItemsService } from '../model-service/items/items.service';
import { BookingsService } from '../model-service/bookings/bookings.service';

import { Items } from '../model-service/items/items';
import { BookedItem } from '../model-service/items/items';

import { LogoutComponent } from '../logout/logout.component';
import { ItemDetailsComponent } from '../item-details/item-details.component';

import { ComponentBridgingService } from '../model-service/componentbridging.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { CalendarOptions } from '@fullcalendar/angular';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

/**
 * Component for the page displaying the list of items.
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {

  items = new MatTableDataSource<Items>();
  tableColumns: string[] = ['id', 'name', 'category', 'quantity', 'deposit', 'status'];

  filterForm: FormGroup;

  itemDialogOpened = false;
  formDialogOpened = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  subscription: Subscription;

  constructor(
    private bookingsService: BookingsService,
    private itemsService: ItemsService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private service: ComponentBridgingService,
    public lc: LogoutComponent
  ) { }

  /**
   * Initializes the data, table configuration and the filter form.
   */
  ngOnInit() {
    this.reloadData();
    this.items.paginator = this.paginator;
    this.items.sort = this.sort;

    this.filterForm = this.formBuilder.group({
      name: ['', ''],
      category: ['', '']
    });

    this.subscription = this.service.on('reloadData').subscribe(() => { this.reloadData(); });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Purges all items.
   */
  deleteItems() {
    this.itemsService.deleteAll()
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log('ERROR: ' + error));
  }

  /**
   * Reloads the data.
   */
  reloadData() {
    this.itemsService.getItemsList()
      .subscribe(
        data => {
          this.items.data = data;
        });
  }

  /**
   * Set the filter parameters.
   */
  onSubmit() {
    this.items.filterPredicate = this.itemFilterPredicate;
    this.items.filter = this.filterForm.value;
  }

  /**
   * Updates the page index on user input.
   * @param pageNumber Page number.
   */
  onInputPageChange(pageNumber: number) {
    this.paginator.pageIndex = Math.min(pageNumber - 1, this.paginator.getNumberOfPages() - 1);
  }

  /**
   * Method to filter the data.
   * @param data List of items.
   * @param filter Filter parameters.
   */
  itemFilterPredicate(data: Items, filter: any): boolean {
    for (const value in filter) {
      if (!data[value].toLowerCase().includes(filter[value].toLowerCase())) {
        return false;
      }
    }
    return true;
  }

  /**
   * Opens a dialog with item description and availability when a table row is clicked.
   * @param row Table row.
   */
  openDialog(row: { [x: string]: any; }) {
    this.bookingsService.getBookersbyBookedItem(row.id)
      .subscribe(
        (data: BookedItem[]) => {
          if (!this.itemDialogOpened) {
            this.itemDialogOpened = true;
            const dialogRef = this.dialog.open(ItemListDialog, { width: '1200px', height: '600px', data: { item: row, people: data } });
            dialogRef.afterClosed().subscribe(() => { this.itemDialogOpened = false; });
          }
        }
      );
  }

  /**
   * Opens a form to allow users to create an item.
   */
  openCreateForm() {
    if (!this.formDialogOpened) {
      this.formDialogOpened = true;
      const dialogRef = this.dialog.open(ItemDetailsComponent, { data: { mode: 'create' } });
      dialogRef.afterClosed().subscribe(() => {
        this.formDialogOpened = false;
        this.reloadData();
      });
    }
  }
}

/**
 * Component for the item detail dialog.
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'item-list-dialog',
  templateUrl: './item-list-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class ItemListDialog implements OnInit {
  calendarEvents = [];

  /**
   * Initializes the calendar component.
   */
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridWeek',
    locale: 'en-au',
    height: '500px',
    events: []
  };

  // tslint:disable-next-line: variable-name
  tableColumns_dialog = ['orgs', 'loan_start_time', 'loan_end_time', 'quantity'];

  editFormOpened = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  bookers = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ItemListDialog>,
    private service: ComponentBridgingService,
    private snackbar: MatSnackBar,
    private itemsService: ItemsService,
    @Inject(MAT_DIALOG_DATA) public itemData: any,
    public lc: LogoutComponent
  ) { }

  /**
   * Initializes the bookings for each item.
   */
  ngOnInit() {
    this.bookers.data = this.itemData.people;
    this.bookers.paginator = this.paginator;
    this.bookers.sort = this.sort;

    for (const events of this.itemData.people) {
      this.calendarEvents.push(
        {
          title: `${events.booking_source.organization} - ${events.quantity} items`,
          start: events.booking_source.loan_start_time,
          // substr(0,10) is to extract the date only, 86400000 is added to include the return date
          end: new Date(new Date(events.booking_source.loan_end_time).getTime() + 86400000).toISOString().substr(0, 10)
        }
      );
    }
    this.calendarOptions.events = this.calendarEvents;
  }

  /**
   * Opens a form filled with item data so that users can edit the item details.
   * After the dialog is closed, a message will be broadcasted to reload the table.
   */
  openEditForm() {
    this.dialogRef.close();
    if (!this.editFormOpened) {
      this.editFormOpened = true;
      const dialogRefs = this.dialog.open(ItemDetailsComponent, { data: { mode: 'edit', item: this.itemData.item } });
      dialogRefs.afterClosed().subscribe(() => {
        this.editFormOpened = false;
        this.service.publish('reloadData');
      });
    }
  }

  /**
   * Deletes the item.
   */
  deleteItem() {
    this.dialogRef.close();
    this.itemsService.deleteItem(this.itemData.item.id).subscribe(() => {
      this.service.publish('reloadData');
      this.snackbar.open(`Item #${this.itemData.item.id} deleted`, 'OK', { duration: 5000 });
    });
  }

  /**
   * Opens a confirmation dialog when the user decides to delete the item.
   */
  confirmDelete() {
    const dialogR = this.dialog.open(ConfirmationDialogComponent, { data: `item # ${this.itemData.item.id}` });
    dialogR.afterClosed().subscribe(
      (result) => {
        if (result.event === 'yes') {
          this.deleteItem();
        }
      }
    );
  }
}
