import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractControl, FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

import { BookingsService } from '../model-service/bookings/bookings.service';
import { Booking } from '../model-service/bookings/bookings';
import { BookedItem } from '../model-service/items/items';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';

import moment from 'moment';

@Component({
  selector: 'booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})

export class BookingListComponent implements OnInit {
  
  bookings = new MatTableDataSource<Booking>();
  tableColumns: string[] = ['id', 'name', 'email', 'organization', 'time_booked', 'loan_start_time', 'loan_end_time', 'deposit_left', 'status'];
  
  filterForm: FormGroup;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private bookingsService: BookingsService, public dialog: MatDialog, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.reloadData();
    this.bookings.paginator = this.paginator;
    
    this.filterForm = this.formBuilder.group({
      name: ['',''],
      fromDate: ['', this.dateCheck],
      toDate: ['', this.dateCheck],
      status: ['','']
    });
  }
  
  reloadData() {
    this.bookingsService.getBookingList()
      .subscribe(
        (data: Booking[]) => {
          this.bookings.data = data;
        }
      );
  }
  
  openDialog(row) {
    this.bookingsService.getBookedItemList()
      .subscribe(
        (data: BookedItem[]) => {
          var bookedItemByID: BookedItem[] = [];
          for(var bookedItem of data) {
            if(bookedItem.booking_source==row['id']) {
              bookedItemByID.push(bookedItem);
            }
          }
          var final_data: Object = Object.assign({}, row, {booked_items: bookedItemByID});
          this.dialog.open(BookingListDialog, {width: '600px', data: final_data});
        }
      );
  }
  
  filterByName(filterValue: string) {
    this.bookings.filterPredicate = 
      (data: Booking, filter: string) => data.name.indexOf(filter) != -1;
    this.bookings.filter = filterValue.trim().toLowerCase();
  }
  
  dateCheck(control: AbstractControl): any {
    var d = control.value;
    if(d!==null && d.length>0){
      return moment(d);
    }
    return null;
  }
  
  onSubmit(){
    this.bookings.filterPredicate = this.bookingFilterPredicate;
    this.bookings.filter=this.filterForm.value;
  }
  
  bookingFilterPredicate(data: Booking, filter: any): boolean {
    for(let value in filter){
      if (filter[value]!==''&&filter[value]!==0) {
        if (value === 'fromDate') {
          if(Date.parse(data.time_booked)<Date.parse(filter[value])){
            return false;
          }
        } else if (value === 'toDate') {
          if(Date.parse(data.time_booked)>Date.parse(filter[value])+86399999){ //86399999 milliseconds is added to include the end point date
            return false;
          }
        } else {
          if(!data[value].includes(filter[value])){
            return false;
          }
        }
      }
    }
    return true;
  }

}

@Component({
  selector: 'booking-list-dialog',
  templateUrl: './booking-list-dialog.html',
})
export class BookingListDialog {
  tableColumnsBookedItems: string[] = ['name', 'quantity', 'status'];
  constructor(public dialogRef: MatDialogRef<BookingListDialog>, @Inject(MAT_DIALOG_DATA) public booking_data: any) {}
  
  onOkClicked(): void {
    this.dialogRef.close();
  }
}
