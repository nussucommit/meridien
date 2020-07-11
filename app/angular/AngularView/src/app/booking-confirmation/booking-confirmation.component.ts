import { MatSnackBar } from '@angular/material/snack-bar';
import { Booking } from './../model-service/bookings/bookings';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../model-service/bookings/bookings.service';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {
  booking: Booking;
  token: string;

  constructor(
    private route: ActivatedRoute,
    private bookingsService: BookingsService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
  });
    console.log(this.token);
    this.bookingsService.getBookingByToken(this.token).subscribe(
      (booking: Booking) => {
        this.booking = booking;
      }
    );
  }

  confirm_booking() {
    this.bookingsService.confirmBookingByToken(this.token).subscribe(
      (success: any) => {
        this.snackbar.open('Booking confirmed', 'OK', {duration: 5000, });
      }
    );
  }

  delete_booking() {
    this.bookingsService.deleteBookingByToken(this.token).subscribe(
      (success: any) => {
        this.snackbar.open('Booking deleted', 'OK', {duration: 5000, });
      }
    );
  }

}
