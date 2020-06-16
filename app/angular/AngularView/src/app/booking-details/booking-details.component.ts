import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { BookingsService } from '../model-service/bookings/bookings.service';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';

@Component({
  selector: 'booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class BookingDetailsComponent implements OnInit {

  detailsForm: FormGroup;
  itemsForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private bookingsService: BookingsService) { }

  ngOnInit() {
    this.detailsForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, this.emailCheck]],
      organization: ['', Validators.required],
      reason: ['', Validators.required],
      loan_start_time: ['', [Validators.required, this.dateCheck]],
      loan_end_time: ['', [Validators.required, this.dateCheck]],
    });
  }

  dateCheck(control: AbstractControl): any {
    return moment(control.value).isValid() ? null : { date: true };
  }

  emailCheck(control: AbstractControl): any {
    let regex = new RegExp('e[0-9]{7}@u\.nus\.edu');
    return regex.test(control.value) ? null : { email: true };
  }

  step1() {

  }

  step2() {

  }
}
