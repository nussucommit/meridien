import { Router } from '@angular/router';
import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { BookingsService } from '../model-service/bookings/bookings.service';
import { Booking } from '../model-service/bookings/bookings';
import { BookedItem } from '../model-service/items/items';
import { getStatus, addHyphen } from '../model-service/statustranslator';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

import moment from 'moment';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CalendarOptions } from '@fullcalendar/angular';
import { formatDate } from '@fullcalendar/core'
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ComponentBridgingService } from '../model-service/componentbridging.service';
import { animate, style, transition, trigger } from '@angular/animations';

/**
 * Main component for displaying the list of bookings.
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  animations: [
    trigger(
      'fade',
      [
        transition(
          ':enter',
          [ 
            style({opacity: 0}),
            animate('0.1s ease-out', style({opacity: 1}))
          ]
        ),
        transition(
          ':leave',
          [
            style({opacity: 1}),
            animate('0.1s ease-in', style({opacity: 0}))
          ]
        )
      ]
    )
  ]
})

export class BookingListComponent implements OnInit, AfterViewInit {

  bookings: Booking[];
  tableColumns: string[] = ['id', 'name', 'time_booked', 'loan_start_time', 'loan_end_time', 'deposit_left', 'status'];

  filterForm: FormGroup;

  bookingDialogOpened = false;
  summaryDialogOpened = false;

  isLoadingResults = true;
  resultsLength = 0;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private bookingsService: BookingsService,
    private dialog: MatDialog,
    private service: ComponentBridgingService,
    private snackbar: MatSnackBar,
    private formBuilder: FormBuilder
  ) { }

  /**
   * Initializes the filter form.
   */
  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      name: ['', ''],
      fromDate: ['', this.dateCheck],
      toDate: ['', this.dateCheck],
      status: ['', '']
    });
  }

  /**
   * Load the data after the component's view has been properly initialized.
   * It also initializes the behaviour when the sorting parameter changes.
   */
  ngAfterViewInit(): void {
    this.reloadData();
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  /**
   * Method to load data. When the data is loading, this method will broadcast a message
   * to turn on the progress bar, until the data is done loading, in which case the
   * progress bar is turned off and the bookings data are updated.
   */
  reloadData() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.service.publish('progressBarOn');
          return this.bookingsService.filterBookings(this.parseFilterForm(this.filterForm));
        }),
        map(data => {
          this.isLoadingResults = false;
          this.service.publish('progressBarOff');
          this.resultsLength = data.count;
          return data.results
        }),
        catchError((err) => {
          console.log(err);
          this.isLoadingResults = false;
          this.service.publish('progressBarOff');
          this.snackbar.open("An error occured.", "OK", { duration: 5000 });
          return of([]);
        })
      ).subscribe(data => { this.bookings = data; });
  }

  /**
   * Process the filter form so that the data format can be parsed by the backend.
   * @param filterForm Filter form
   */
  parseFilterForm(filterForm: FormGroup) {
    const sortCriterion = addHyphen(this.sort.active, this.sort.direction);
    let filterParams = { ...this.filterForm.value }
    if (filterForm.value.fromDate) {
      filterParams.fromDate = filterParams.fromDate.format("YYYY-MM-DD HH:mm");
    }
    if (filterForm.value.toDate) {
      filterParams.toDate = filterParams.toDate.format("YYYY-MM-DD HH:mm");
    }
    filterParams = Object.assign(filterParams,
      {
        ordering: sortCriterion ? sortCriterion : '-time_booked',
        page: this.paginator.pageIndex + 1,
        page_size: this.paginator.pageSize
      });
    return filterParams;
  }

  /**
   * Clears the filter form.
   */
  clearFilter() {
    this.filterForm.reset();
    this.reloadData();
  }

  /**
   * Checks if the form contains at least one input.
   */
  checkAtLeastOneInput() {
    return Object.values(this.filterForm.value).some(val => !!val);
  }

  /**
   * Reload the data after the page number has changed.
   * @param pageNumber Page number.
   */
  onInputPageChange(pageNumber: number) {
    this.paginator.pageIndex = Math.min(pageNumber - 1, this.paginator.getNumberOfPages() - 1);
    this.reloadData();
  }

  /**
   * Opens a dialog with booking details when a row of table is clicked.
   * @param row Table row
   */
  openDialog(row: { [x: string]: number; }) {
    this.bookingsService.getBookedItemsByBooker(row.id)
      .subscribe(
        (bookedItemData: BookedItem[]) => {
          if (!this.bookingDialogOpened) {
            this.bookingDialogOpened = true;
            const dialogRef = this.dialog.open(
              BookingListDialog,
              { width: '600px', data: { source: row, booked_items: bookedItemData } });
            dialogRef.afterClosed().subscribe(() => {
              this.reloadData();
              this.bookingDialogOpened = false;
            });
          }
        }
      );
  }

  /**
   * Opens a dialog with weekly summary of bookings.
   */
  openWeeklySummary() {
    if (!this.summaryDialogOpened) {
      this.summaryDialogOpened = true;
      const dialogRef = this.dialog.open(
        BookingSummaryDialog,
        { width: '1200px', height: '600px' }
      );
      dialogRef.afterClosed().subscribe(
        () => { this.summaryDialogOpened = false; }
      );
    }
  }

  /**
   * Checks if the date format is correct.
   * @param control Date input
   */
  dateCheck(control: AbstractControl): any {
    const d = control.value;
    return (d === null || (typeof d === 'string') &&
      d.length === 0 || moment(d).isValid()) ? null : { date: true };
  }

  /**
   * Reloads the data after the filter form is submitted.
   */
  onSubmit() {
    this.reloadData();
  }

  /**
   * Returns the full string given the status code.
   * @param code Status code
   */
  returnStatusString(code: string) {
    return getStatus(code);
  }
}

/**
 * Dialog with each booking details.
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'booking-list-dialog',
  templateUrl: './booking-list-dialog.html',
})
// tslint:disable-next-line: component-class-suffix
export class BookingListDialog {
  tableColumnsBookedItems: string[] = ['name', 'quantity', 'status'];
  constructor(
    private bookingsService: BookingsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BookingListDialog>,
    @Inject(MAT_DIALOG_DATA) public bookingData: any,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  /**
   * Updates the status of the booking.
   * @param status New status
   */
  updateStatus(status: string) {
    const bookingDataCopy = { ...this.bookingData.source };
    delete bookingDataCopy.id;
    bookingDataCopy.status = status;
    this.bookingData.source.status = status;
    if (status === 'GET' || status === 'RET') {
      bookingDataCopy.deposit_paid = true;
    } else {
      bookingDataCopy.deposit_paid = false;
    }
    this.bookingsService.updateBooking(this.bookingData.source.id, bookingDataCopy).subscribe();
    this.dialogRef.close();
    this.printSnackBarStatus(status);
  }

  /**
   * Opens a snackbar stating the status of booking has changed.
   * @param status New status
   */
  printSnackBarStatus(status: string) {
    this.snackbar.open(
      `Status of Booking #${this.bookingData.source.id} changed to: ${getStatus(status)}`,
      'OK',
      { duration: 5000, }
    );
  }

  /**
   * Returns the full string given the status code.
   * @param code Status code
   */
  returnStatusString(code: string) {
    return getStatus(code);
  }

  /**
   * Processes the booking and redirect user to choose an email template.
   */
  processAndEmail() {
    this.updateStatus('PRO');
    this.router.navigate(['/templates'], { state: { booking: this.bookingData } });
  }

  /**
   * Revokes the approval.
   */
  revoke() {
    this.updateStatus('PEN');
    this.bookingData.booked_items.forEach((ele) => {
      this.bookingsService.updateBookedItem(ele.id,
        {
          booking_source: ele.booking_source.id,
          item: ele.item.id,
          quantity: ele.quantity,
          status: 'PEN'
        }).subscribe();
    });
  }

  /**
   * Called when the logistics booked are loaned.
   */
  getLogistics() {
    this.updateStatus('GET');
  }

  disableRetrieve(): boolean {
    for (let item of this.bookingData.booked_items) {
      if (item.status === 'PEN') {
        return true;
      } else if (item.status === 'ACC') {
        return false;
      }
    }
    return true;
  }

  /**
   * Called when the logistics are returned.
   */
  returnLogistics() {
    this.updateStatus('RET');
  }

  undoRetrieve() {
    this.updateStatus('PRO');
  }

  undoReturn() {
    this.getLogistics();
  }

  /**
   * Deletes the booking.
   */
  deleteBooking() {
    this.bookingsService.deleteBooking(this.bookingData.source.id).subscribe();
    this.dialogRef.close();
    this.snackbar.open(`Booking #${this.bookingData.source.id} deleted`, 'OK', { duration: 5000 });
  }

  /**
   * Opens a confirmation dialog to ensure that the user really wants to delete the booking.
   */
  confirmDelete() {
    const dialogR = this.dialog.open(ConfirmationDialogComponent,
      { data: `booking #${this.bookingData.source.id}` });
    dialogR.afterClosed().subscribe(
      (result) => {
        if (result.event === 'yes') {
          this.deleteBooking();
        }
      });
  }

  /**
   * Navigates the user to edit the booking.
   */
  editBooking() {
    this.dialogRef.close();
    this.router.navigate(['/edit'],
      {
        state:
        {
          source: this.bookingData.source,
          booked_items: this.bookingData.booked_items,
          edit: true
        }
      }
    );
  }
}

/**
 * Component for the weekly summary table.
 */
@Component({
  selector: 'booking-summary-dialog',
  templateUrl: './booking-summary-dialog.html',
})
export class BookingSummaryDialog {

  /**
   * Initializes the calendar component.
   */
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridWeek',
    height: '500px',
    locale: 'en-sg',
    events: this.putEventsCurry(this.bookingsService),
    // delay (ms) is here so that events can be rendered properly on initial load
    rerenderDelay: 100
  };

  constructor(
    public dialogRef: MatDialogRef<BookingSummaryDialog>,
    public bookingsService: BookingsService
  ) { }

  /**
   * Helper method to circumvent the problem that this.bookingService is undefined.
   * @param bookingService BookingService object.
   */
  putEventsCurry(bookingService: BookingsService) {
    return (args, successCallback, failureCallback) =>
      this.putEvents(args, successCallback, failureCallback, bookingService);
  }

  /**
   * Returns the events to be put in the calendar.
   * @param args Current configuration of the calendar
   * @param successCallback Callback method if the data retrieval is successful.
   * @param failureCallback Callback method if the data retrieval is not successful.
   * @param bookingsService BookingService object
   */
  putEvents(args: any, successCallback, failureCallback, bookingsService: BookingsService) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', locale: 'en-ca' }
    const startDate = formatDate(args.start, options);
    const endDate = formatDate(args.end - 86400000, options);
    bookingsService.getBookingsByDateRange(startDate, endDate).subscribe(
      (bookingData: Booking[]) => {
        successCallback(bookingData.map((element) => {
          return {
            title: `#${element.id} - ${element.name}`,
            start: element.loan_start_time,
            end: new Date(new Date(element.loan_end_time).getTime() + 86400000)
              .toISOString()
              .substr(0, 10),
            color: this.getColour(element.id)
          };
        }));
      },
      failureCallback
    );
  }

  /**
   * Returns a colour based on the booking id
   * @param num Booking id.
   */
  getColour(num: number) {
    switch (num % 4) {
      case 0:
        return '#3c78b5';
      case 1:
        return '#54a8ff';
      case 2:
        return '#10b336';
      case 3:
        return '#0dd186';
    }
  }
}
