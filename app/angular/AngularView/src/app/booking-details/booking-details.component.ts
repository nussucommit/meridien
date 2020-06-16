import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { BookingsService } from '../model-service/bookings/bookings.service';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { Items } from '../model-service/items/items';
import { ItemsService } from '../model-service/items/items.service';
import { Observable } from 'rxjs';

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

  itemArray: Items[];

  constructor(
    private formBuilder: FormBuilder,
    private bookingsService: BookingsService,
    private itemsService: ItemsService
  ) { }

  ngOnInit() {
    this.detailsForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, this.emailCheck]],
      organization: ['', Validators.required],
      reason: ['', Validators.required],
      loan_start_time: ['', [Validators.required, this.dateCheck]],
      loan_end_time: ['', [Validators.required, this.dateCheck]],
    });

    this.itemsForm = this.formBuilder.group({ items: this.formBuilder.array([this.newItemInput()]) });

    this.itemsService.getItemsList().subscribe(
      data => {
        this.itemArray = data;
      }
    );
  }

  dateCheck(control: AbstractControl): any {
    return moment(control.value).isValid() ? null : { date: true };
  }

  emailCheck(control: AbstractControl): any {
    let regex = new RegExp('e[0-9]{7}@u\.nus\.edu');
    return regex.test(control.value) ? null : { email: true };
  }

  newItemInput(): FormGroup {
    return this.formBuilder.group({
      item: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  getItemInputForm(): FormArray {
    return this.itemsForm.get('items') as FormArray;
  }

  addBlankItem() {
    this.getItemInputForm().push(this.newItemInput());
  }

  removeItemInput(i: number) {
    this.getItemInputForm().removeAt(i);
  }

  step1() {

  }

  step2() {

  }
}
