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

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
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

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      name: ['', ''],
      fromDate: ['', this.dateCheck],
      toDate: ['', this.dateCheck],
      status: ['', '']
    });
  }

  ngAfterViewInit(): void {
    this.reloadData();
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

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
        catchError(() => {
          this.isLoadingResults = false;
          this.service.publish('progressBarOff');
          this.snackbar.open("An error occured.", "OK", { duration: 5000 });
          return of([]);
        })
      ).subscribe(data => { this.bookings = data; });
  }

  parseFilterForm(filterForm: FormGroup) {
    const sortCriterion = addHyphen(this.sort.active, this.sort.direction);
    let filterParams = { ...this.filterForm.value }
    if (filterForm.value.fromDate) {
      filterParams.fromDate = filterParams.fromDate.format("YYYY-MM-DD HH:mm");
    }
    if (filterForm.value.endDate) {
      filterParams.endDate = filterParams.endDate.format("YYYY-MM-DD HH:mm");
    }
    filterParams = Object.assign(filterParams,
      {
        ordering: sortCriterion ? sortCriterion : 'id',
        page: this.paginator.pageIndex + 1,
        page_size: this.paginator.pageSize
      });
    return filterParams;
  }

  onInputPageChange(pageNumber: number) {
    this.paginator.pageIndex = Math.min(pageNumber - 1, this.paginator.getNumberOfPages() - 1);
    this.reloadData();
  }

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

  dateCheck(control: AbstractControl): any {
    const d = control.value;
    return (d === null || (typeof d === 'string') &&
      d.length === 0 || moment(d).isValid()) ? null : { date: true };
  }

  onSubmit() {
    this.reloadData();
  }

  returnStatusString(code: string) {
    return getStatus(code);
  }
}

// dialog details for each booking
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

  updateStatus(status: string) {
    const bookingDataCopy = { ...this.bookingData.source };
    delete bookingDataCopy.id;
    bookingDataCopy.status = status;
    this.bookingData.source.status = status;
    if (status === 'GET') {
      bookingDataCopy.deposit_paid = true;
    }
    this.bookingsService.updateBooking(this.bookingData.source.id, bookingDataCopy).subscribe();
    this.dialogRef.close();
    this.printSnackBarStatus(status);
  }

  printSnackBarStatus(status: string) {
    this.snackbar.open(
      `Status of Booking #${this.bookingData.source.id} changed to: ${getStatus(status)}`,
      'OK',
      { duration: 5000, }
    );
  }

  returnStatusString(code: string) {
    return getStatus(code);
  }

  processAndEmail() {
    this.updateStatus('PRO');
    this.router.navigate(['/templates'], { state: { booking: this.bookingData } });
  }

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

  getLogistics() {
    this.updateStatus('GET');
  }

  returnLogistics() {
    this.updateStatus('RET');
  }

  deleteBooking() {
    this.bookingsService.deleteBooking(this.bookingData.source.id).subscribe();
    this.dialogRef.close();
    this.snackbar.open(`Booking #${this.bookingData.source.id} deleted`, 'OK', { duration: 5000 });
  }

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

// weekly summary
@Component({
  selector: 'booking-summary-dialog',
  templateUrl: './booking-summary-dialog.html',
})
export class BookingSummaryDialog {

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

  // this is to circumvent the problem that this.bookingService is undefined
  putEventsCurry(bookingService: BookingsService) {
    return (args, successCallback, failureCallback) =>
      this.putEvents(args, successCallback, failureCallback, bookingService);
  }

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
