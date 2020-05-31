import { Component, OnInit, Inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BookingsService } from '../model-service/bookings/bookings.service';
import { Booking } from '../model-service/bookings/bookings';
import { BookedItem } from '../model-service/items/items';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  
  bookings = new MatTableDataSource<Booking>();
  tableColumns: string[] = ['id', 'name', 'email', 'organization', 'loan_start_time', 'loan_end_time', 'deposit_left', 'status'];

  constructor(private bookingsService: BookingsService, public dialog: MatDialog) { }

  ngOnInit() {
    this.reloadData();
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
