import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Booking } from './../model-service/bookings/bookings';
import { BookingsService } from '../model-service/bookings/bookings.service';
import { BookedItem } from '../model-service/items/items';
import { getStatus } from '../model-service/statustranslator';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

/**
 * After a user has made a booking, the user will receive a confirmation email that contains a link to confirm that the booking is indeed made by the user.
 * This is the component for the confirmation page.
 */
@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {
  booking: Booking;
  token: string;
  tableColumnsBookedItems: string[] = ['name', 'quantity', 'status'];
  bookedItems: BookedItem[];
  responded: boolean;

  constructor(
    private route: ActivatedRoute,
    private bookingsService: BookingsService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  /**
   * Initializes the booking based on the token.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params.token;
    });
    this.bookingsService.getBookingByToken(this.token).subscribe(
      (booking: Booking) => {
        this.booking = booking;
        this.bookingsService.getBookedItemsByBooker(booking.id).subscribe(
          (data: BookedItem[]) => {
            this.bookedItems = data;
          });
      }
    );
  }

  /**
   * Returns the full string given the status code.
   * @param code Status code.
   */
  returnStatusString(code: string){
    return getStatus(code);
  }

  /**
   * Prints the page.
   */
  print(){
    window.print();
  }

  /**
   * Called when the user presses confirm button.
   */
  confirm_booking() {
    this.bookingsService.confirmBookingByToken(this.token).subscribe(
      (success: any) => {
        this.responded = true; // order matters here, otherwise user can't do any actions then gg
        location.reload(); // force reload
        this.snackbar.open('Booking confirmed', 'OK', { duration: 5000, });
      }
    );
  }

  /**
   * Called when the user decides to revoke the booking by pressing the delete button.
   */
  delete_booking() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: 'this booking' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'yes') {
        this.bookingsService.deleteBookingByToken(this.token).subscribe(
          (success: any) => {
            this.responded = true;
            location.reload(); // force reload
            this.snackbar.open('Booking deleted', 'OK', { duration: 5000, });
          }
        );
      }
    });
  }
}
