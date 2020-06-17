import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ItemsService } from '../model-service/items/items.service';
import { BookingsService } from '../model-service/bookings/bookings.service';

import { Items } from '../model-service/items/items';
import { BookedItem } from '../model-service/items/items';

import { ItemDetailsComponent } from '../item-details/item-details.component';

import { ComParentChildService } from '../model-service/callchildtoparent.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import dayGridPlugin from '@fullcalendar/daygrid';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  items = new MatTableDataSource<Items>();
  tableColumns: string[] = ['id', 'name', 'category', 'quantity', 'deposit', 'status', 'remark'];

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
    private service: ComParentChildService,
    ) { }

  ngOnInit() {
    this.reloadData();
    this.items.paginator = this.paginator;
    this.items.sort = this.sort;

    this.filterForm = this.formBuilder.group({
      name: ['', ''],
      category: ['', '']
    });

    this.subscription = this.service.on('reloadData').subscribe(() => { this.reloadData() });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deleteItems() {
    this.itemsService.deleteAll()
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log('ERROR: ' + error));
  }

  reloadData() {
    this.itemsService.getItemsList()
      .subscribe(
        data => {
          this.items.data = data;
        });
  }

  onSubmit() {
    this.items.filterPredicate = this.itemFilterPredicate;
    this.items.filter = this.filterForm.value;
  }

  itemFilterPredicate(data: Items, filter: any): boolean {
    for (let value in filter) {
      if (!data[value].includes(filter[value])) {
        return false;
      }
    }
    return true;
  }

  openDialog(row: { [x: string]: any; }) {
    this.bookingsService.getBookersbyBookedItem(row['id'])
      .subscribe(
        (data: BookedItem[]) => {
          if (!this.itemDialogOpened) {
            this.itemDialogOpened = true;
            let dialogRef = this.dialog.open(ItemListDialog, { width: '1200px', data: { item: row, people: data } });
            dialogRef.afterClosed().subscribe(() => { this.itemDialogOpened = false; });
          }
        }
      );
  }

  openCreateForm() {
    if (!this.formDialogOpened) {
      this.formDialogOpened = true;
      let dialogRef = this.dialog.open(ItemDetailsComponent, { data: { mode: 'create' } });
      dialogRef.afterClosed().subscribe(() => {
        this.formDialogOpened = false;
        this.reloadData();
      });
    }
  }
}

@Component({
  selector: 'item-list-dialog',
  templateUrl: './item-list-dialog.html',
})
export class ItemListDialog implements OnInit {
  calendarPlugins = [dayGridPlugin];
  calendarEvents = [];

  tableColumns_dialog = ['name', 'loan_start_time', 'loan_end_time', 'quantity'];

  editFormOpened = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ItemListDialog>,
    private service: ComParentChildService,
    private _snackbar: MatSnackBar,
    private itemsService: ItemsService,
    @Inject(MAT_DIALOG_DATA) public item_data: any
  ) { }

  ngOnInit() {
    for (var events of this.item_data.people) {
      this.calendarEvents.push(
        {
          title: events['booking_source']['name'] + ' - ' + events['quantity'] + ' items',
          start: events['booking_source']['loan_start_time'],
          //substr(0,10) is to extract the date only, 86400001 is added to include the return date
          end: new Date(new Date(events['booking_source']['loan_end_time']).getTime() + 86400000).toISOString().substr(0, 10)
        }
      );
    }
    console.log(this.calendarEvents);
  }

  openEditForm() {
    this.dialogRef.close();
    if (!this.editFormOpened) {
      this.editFormOpened = true;
      let dialogRefs = this.dialog.open(ItemDetailsComponent, { data: { mode: 'edit', item: this.item_data.item } });
      dialogRefs.afterClosed().subscribe(() => {
        this.editFormOpened = false;
        this.service.publish('reloadData');
      });
    }
  }

  deleteItem(){
    this.dialogRef.close();
    this.itemsService.deleteItem(this.item_data.item.id).subscribe(()=>{
      this.service.publish('reloadData');
      this._snackbar.open("Item "+this.item_data.item.id+" deleted", 'OK', {duration: 5000});
    });
  }
}
