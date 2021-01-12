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

import { CalendarOptions, formatDate } from '@fullcalendar/angular';
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
  tableColumns: string[] = ['id', 'name', 'category', 'quantity', 'deposit'];

  filterForm: FormGroup;

  itemDialogOpened = false;
  formDialogOpened = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  subscription: Subscription;

  isUserLogin: boolean;

  constructor(
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
    this.isUserLogin = this.lc.loginStatus.value;
    if (this.isUserLogin) {
      this.tableColumns.push('status');
    }
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
          this.items.data = this.isUserLogin
            ? data
            : data.filter(item => item.item_status === 'Active');
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
    if (!this.itemDialogOpened) {
      this.itemDialogOpened = true;
      const dialogRef = this.dialog.open(ItemListDialog, { width: '1200px', height: '650px', data: { item: row } });
      dialogRef.afterClosed().subscribe(() => { this.itemDialogOpened = false; });
    }
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
    locale: 'en-sg',
    height: '400px',
    events: this.putEventsCurry(this.bookingsService),
    rerenderDelay: 150
  };

  // tslint:disable-next-line: variable-name
  tableColumns_dialog = ['date', 'quantity'];

  editFormOpened = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  bookers = new MatTableDataSource<any>();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ItemListDialog>,
    private service: ComponentBridgingService,
    private snackbar: MatSnackBar,
    private bookingsService: BookingsService,
    private itemsService: ItemsService,
    @Inject(MAT_DIALOG_DATA) public itemData: any,
    public lc: LogoutComponent
  ) { }

  ngOnInit() {
  }

  /**
  * Helper method to circumvent the problem that this.bookingService is undefined.
  * @param bookingService BookingService object.
  */
  putEventsCurry(bookingService: BookingsService) {
    return (args, successCallback, failureCallback) =>
      this.putEvents(args, successCallback, failureCallback, bookingService);
  }

  /**
   * Returns the events to be put in the calendar. This method also populates the estimated quantity
   * of items at a given date.
   * @param args Current configuration of the calendar
   * @param successCallback Callback method if the data retrieval is successful.
   * @param failureCallback Callback method if the data retrieval is not successful.
   * @param bookingsService BookingService object
   */
  putEvents(args: any, successCallback, failureCallback, bookingsService: BookingsService) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', locale: 'en-ca' }
    const start = formatDate(args.start, options);
    const end = formatDate(args.end - 86400000, options);
    bookingsService.getBookersbyBookedItem(this.itemData.item.id, { start, end }).subscribe(
      (bookingData: BookedItem[]) => {
        this.bookers.data = this.populateAvailability(bookingData, args.start, args.end);
        successCallback(bookingData.filter((element) => element.status !== 'REJ').map((element) => {
          let title = `${element.booking_source.organization} - ${element.quantity}`;
          if (element.status === 'PEN'){
            title += ' (Pending)';
          }
          return {
            title,
            start: element.booking_source.loan_start_time,
            end: new Date(new Date(element.booking_source.loan_end_time).getTime() + 86400000)
              .toISOString()
              .substr(0, 10),
            color: element.status === 'ACC' ? '#0dd186' : '#ebb134'
          };
        }));
      },
      failureCallback
    );
  }

  populateAvailability(bookingData: BookedItem[], start: Date, end: Date) {
    let result = [];
    while (start < end) {
      let initialQuantity = this.itemData.item.quantity;
      for (const booking of bookingData) {
        const loan_start_time = new Date(booking.booking_source.loan_start_time);
        const loan_end_time = new Date(booking.booking_source.loan_end_time);
        if (start >= loan_start_time && start <= loan_end_time && booking.status === 'ACC') {
          initialQuantity -= booking.quantity;
        }
      }
      result.push({ date: start, quantity: initialQuantity });
      start = new Date(start.getTime() + 86400000);
    }
    return result;
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
