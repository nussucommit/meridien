import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ItemsService } from '../model-service/items/items.service';
import { BookingsService } from '../model-service/bookings/bookings.service';

import { Items } from '../model-service/items/items';
import { BookedItem } from '../model-service/items/items';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  
  items = new MatTableDataSource<Items>();
  tableColumns: string[] = ['id', 'name', 'category', 'quantity', 'deposit', 'status', 'remark'];
  
  filterForm: FormGroup;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private bookingsService: BookingsService, private itemsService: ItemsService, public dialog: MatDialog, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.reloadData();
    this.items.paginator = this.paginator;
    this.items.sort=this.sort;

    this.filterForm = this.formBuilder.group({
      name: ['',''],
      category: ['','']
    });
  }
  
  deleteItems() {
    this.itemsService.deleteAll()
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log('ERROR: '+error));
  }
  
  reloadData() {
    this.itemsService.getItemsList()
      .subscribe(
        data => {
          this.items.data = data;
        });
  }
  
  onSubmit(){
    this.items.filterPredicate = this.itemFilterPredicate;
    this.items.filter=this.filterForm.value;
  }

  itemFilterPredicate(data: Items, filter: any): boolean{
    for(let value in filter){
      if(!data[value].includes(filter[value])){
        return false;
      }
    }
    return true;
  }
  
  openDialog(row){
    this.bookingsService.getBookersbyBookedItem(row['id'])
      .subscribe(
        (data: BookedItem[]) => {
          this.dialog.open(ItemListDialog, {width: '1200px', data: {name: row['name'], people: data}});
        }
      );
  }
}

@Component({
  selector: 'item-list-dialog',
  templateUrl: './item-list-dialog.html',
})
export class ItemListDialog implements OnInit{
  calendarPlugins = [dayGridPlugin];
  calendarEvents = [];

  tableColumns_dialog = ['name', 'loan_start_time', 'loan_end_time', 'quantity'];

  constructor(public dialogRef: MatDialogRef<ItemListDialog>, @Inject(MAT_DIALOG_DATA) public item_data: any) {}

  ngOnInit(){
    for(var events of this.item_data.people){
      this.calendarEvents.push(
        {
          title: events['booking_source']['name']+' - '+events['quantity']+' items',
          start: events['booking_source']['loan_start_time'],
          end: events['booking_source']['loan_end_time']
        }
      );
    }
    console.log(this.calendarEvents);
  }
}
