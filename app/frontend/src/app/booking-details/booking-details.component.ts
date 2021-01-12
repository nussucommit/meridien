import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationTemplatesService } from './../model-service/confirmationtemplates/confirmationtemplates.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { BookingsService } from '../model-service/bookings/bookings.service';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { Items, BookedItem } from '../model-service/items/items';
import { ItemsService } from '../model-service/items/items.service';
import { Booking } from '../model-service/bookings/bookings';
import { Router } from '@angular/router';
import { Dictionary } from '@fullcalendar/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentBridgingService } from '../model-service/componentbridging.service';

/**
 * Main component for the booking form.
 */
@Component({
  selector: 'app-booking-details',
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
  itemGroups = [];

  inputGroup1: any;
  inputGroup2: any;

  itemColumns = ['item', 'quantity'];

  editMode: boolean;
  bookingSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private bookingsService: BookingsService,
    private itemsService: ItemsService,
    private service: ComponentBridgingService,
    private router: Router
  ) {
    this.itemsService.getItemsList().subscribe((data) => {
      this.itemArray = data.filter((item) => item.item_status === 'Active');
      this.itemGroups = this.parseItems(this.itemArray);
    });
  }

  /**
   * Initializes the booking form based on whether the user is editing a booking or creating a new booking.
   */
  ngOnInit() {
    this.editMode = history.state.edit ? true : false;

    this.detailsForm = this.formBuilder.group({
      name: [history.state.source ? history.state.source.name : '', Validators.required],
      email: [history.state.source ? history.state.source.email : '', [Validators.required, this.emailCheck]],
      organization: [history.state.source ? history.state.source.organization : '', Validators.required],
      phone_no: [history.state.source ? history.state.source.phone_no : '', [Validators.required, this.phoneCheck]],
      reason: [history.state.source ? history.state.source.reason : '', Validators.required],
      loan_start_time: [history.state.source ? history.state.source.loan_start_time : '', [Validators.required, this.dateCheck]],
      loan_end_time: [history.state.source ? history.state.source.loan_end_time : '', [Validators.required, this.dateCheck]],
    });
    this.itemsForm = this.formBuilder.group({
      items: history.state.booked_items ?
        new FormArray(this.initialItemInput(history.state.booked_items),
          [this.checkForRepeat], ExceedAmountValidator.createExceedAmountValidator(this.itemsService)) :
        new FormArray([this.newItemInput()],
          [this.checkForRepeat], ExceedAmountValidator.createExceedAmountValidator(this.itemsService))
    });

    this.checkout();
  }

  parseItems(itemArray: Items[]) {
    const itemDict: Dictionary = {};
    itemArray.forEach((item) => {
      if (!itemDict[item.category]) {
        itemDict[item.category] = []
      }
      itemDict[item.category].push({ value: item.id, viewValue: item.name });
    });
    const result = [];
    for (const category in itemDict) {
      result.push({ name: category, items: itemDict[category] });
    }
    return result;
  }

  filterItems(search: string) {
    this.itemGroups = this.parseItems(this.itemArray.filter(
      (item) => item.name.toLowerCase().includes(search.toLowerCase())
    ));
  }

  /**
   * Checks if the date is of correct format.
   * @param control Date input.
   */
  dateCheck(control: AbstractControl): any {
    return moment(control.value).isValid() ? null : { date: true };
  }

  /**
   * Checks if the phone number is of correct format.
   * @param control Phone number input.
   */
  phoneCheck(control: AbstractControl): any {
    return new RegExp('^(8[1-8][0-9]{6}|9[0-8][0-9]{6})$').test(control.value) ? null : { phone: true };
  }

  /**
   * Checks if the email follows the NUS email format.
   * @param control Email input.
   */
  emailCheck(control: AbstractControl): any {
    return new RegExp('^e[0-9]{7}@u\.nus\.edu$').test(control.value) ? null : { email: true };
  }

  /**
   * Returns a new row.
   */
  newItemInput(): FormGroup {
    return this.formBuilder.group({
      item: [2, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  /**
   * Parses the booking data from <code>history.state.source</code> into an array.
   * @param data Booking data.
   */
  initialItemInput(data: any) {
    const result = [];
    data.forEach((element: BookedItem) => {
      result.push(this.createItemInputWithData(element));
    });
    return result;
  }

  /**
   * Returns filled rows when the user is editing a booking.
   * @param bookedItem Initial booked items.
   */
  createItemInputWithData(bookedItem: BookedItem): FormGroup {
    return this.formBuilder.group({
      item: [bookedItem.item.id, Validators.required],
      quantity: [bookedItem.quantity, [Validators.required, Validators.min(1)]]
    });
  }

  /**
   * Returns the list of items to be booked.
   */
  getItemInputForm(): FormArray {
    return this.itemsForm.get('items') as FormArray;
  }

  /**
   * Adds a new row to the form when the user presses add row button.
   */
  addBlankItem() {
    this.getItemInputForm().push(this.newItemInput());
  }

  /**
   * Removes the i-th row when the user presses the delete button.
   * @param i Row number.
   */
  removeItemInput(i: number) {
    this.getItemInputForm().removeAt(i);
  }

  /**
   * Updates the current form input.
   */
  checkout() {
    this.inputGroup1 = this.detailsForm.value;
    this.inputGroup2 = this.itemsForm.value;
  }

  /**
   * Returns the item given the item id.
   * @param id Item id.
   */
  returnItemGivenId(id: number) {
    return this.itemArray.filter(element => element.id === id)[0];
  }

  /**
   * Returns the total deposit payable.
   */
  getTotalDeposit() {
    return this.itemArray ? Math.min(200, this.inputGroup2.items.reduce((acc: number, currentItem: any) =>
      acc + this.returnItemGivenId(currentItem.item).deposit * currentItem.quantity
      , 0)) : 0;
  }

  /**
   * Helper method to allow user to navigate the stepper back and forth 
   * while at the same time updating the form contents for use in the checkout page
   * @param event Page change event
   */
  selectionChange(event) {
    if (event.selectedIndex === 2) {
      this.checkout();
    }
  }

  /**
   * Helper method to check if there are duplicate items in the form.
   * @param formArray Item input form.
   */
  checkForRepeat(formArray: FormArray) {
    const itemDict: Dictionary = {};
    formArray.value.forEach((ele) => {
      if (itemDict[ele.item]) {
        itemDict[ele.item] += 1;
      } else {
        itemDict[ele.item] = 1;
      }
    });
    for (const key in itemDict) {
      if (itemDict[key] > 1) {
        return { duplicate: true };
      }
    }
  }

  /**
   * Checks if the form returns duplicate error.
   */
  checkForErrors() {
    const controlErrors: ValidationErrors = this.itemsForm.get('items').errors;
    return controlErrors ? controlErrors : { duplicate: false, exceed: false };
  }

  /**
   * Prints the current page.
   */
  print() {
    window.print();
  }

  /**
   * Parses the data to be sent to the backend.
   */
  onSubmit() {
    this.service.publish('progressBarOn');
    const bookingDataCopy = { ...this.inputGroup1 };
    const finalData: Booking = Object.assign(bookingDataCopy,
      {
        time_booked: (history.state.source ? history.state.source.time_booked : new Date()),
        status: 'PEN',
        deposit_left: this.getTotalDeposit(),
        amount_paid: 0
      }) as Booking;
    if (!history.state.edit) {
      bookingDataCopy.loan_start_time = bookingDataCopy.loan_start_time.format('YYYY-MM-DD');
      bookingDataCopy.loan_end_time = bookingDataCopy.loan_end_time.format('YYYY-MM-DD');
      this.bookingsService.createBooking(finalData).subscribe(
        (data: any) => {
          this.inputGroup2.items.forEach(element => {
            const finalItemData = { booking_source: data.id, item: element.item, quantity: element.quantity, status: 'PEN' };
            this.bookingsService.createBookedItem(finalItemData).subscribe();
          });
          this.router.navigate(['/edit/confirmed'], { state: { id: data.id, name: data.name, email: data.email, submitted: true } });
          this.service.publish('progressBarOff');
        });
    } else if (history.state.edit === true) { // touchwood condition lol
      this.bookingsService.updateBooking(history.state.source.id, finalData).subscribe(
        (data: any) => {
          // reason for deletion: I don't bother to check whether the booked item exists or not
          this.bookingsService.deleteBookedItemsByBooker(data.id).subscribe();
          this.inputGroup2.items.forEach(element => {
            const finalItemData = { booking_source: data.id, item: element.item, quantity: element.quantity, status: 'PEN' };
            this.bookingsService.createBookedItem(finalItemData).subscribe();
          });
          this.router.navigate(['/edit/confirmed'], { state: { id: data.id, name: data.name, email: data.email, submitted: true } });
          this.service.publish('progressBarOff');
        });
    }
  }
}

/**
 * After the user submits a booking, the user will be redirected to a page saying that their booking request has been received.
 */
@Component({
  selector: 'app-booking-confirm',
  templateUrl: './booking-confirm.component.html',
})
export class BookingConfirmComponent implements OnInit {

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private confirmationTemplatesService: ConfirmationTemplatesService
  ) { }

  /**
   * If the form is not submitted, the user will be redirected to the page.
   */
  ngOnInit(): void {
    if (!history.state.submitted) {
      this.router.navigate(['/edit']);
    }
  }

  /**
   * Resends the confirmation email.
   */
  resend(): void {
    this.confirmationTemplatesService.resendConfirmation({
      id: history.state.id,
      email: history.state.email
    }).subscribe(
      (success: any) => {
        this.snackbar.open('Email resent. Please wait...', 'OK', { duration: 5000, });
      }
    );
  }
}

/**
 * Helper class to check if the number of items booked exceeds the number available in the database.
 */
export class ExceedAmountValidator {
  /**
   * Returns a method to carry out the validation.
   * @param itemsService <code>ItemsService</code> object.
   */
  static createExceedAmountValidator(itemsService: ItemsService): AsyncValidatorFn {
    return (formArray: FormArray): Observable<ValidationErrors> => {
      return itemsService.getItemsList().pipe(map((items) => {
        for (const element of formArray.value) {
          if (element.quantity > items.filter(ele => ele.id === element.item)[0].quantity) {
            return { exceed: true };
          }
        }
      }));
    };
  }
}
