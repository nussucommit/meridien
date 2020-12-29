import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogoutComponent } from './logout/logout.component';
import { ComponentBridgingService } from './model-service/componentbridging.service';
import { Subscription } from 'rxjs';

/**
 * Component for the page layout.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'NUSSU Logistics Management System';
  progressBarVisible = false;
  bookingSubmittedSubscription: Subscription;
  bookingRecordedSubscription: Subscription;

  constructor(
    public lc: LogoutComponent,
    public service: ComponentBridgingService
  ) { }

  /**
   * Initializes the behaviour of progress bar.
   */
  ngOnInit(): void {
    this.bookingSubmittedSubscription = this.service.on('progressBarOn').subscribe(() => this.showProgressBar());
    this.bookingRecordedSubscription = this.service.on('progressBarOff').subscribe(() => this.hideProgressBar());
  }

  /**
   * Unsubscribe from the broadcasts.
   */
  ngOnDestroy(): void {
    this.bookingSubmittedSubscription.unsubscribe();
    this.bookingRecordedSubscription.unsubscribe();
  }

  /**
   * Shows the progress bar.
   */
  showProgressBar() {
    this.progressBarVisible = true;
  }

  /**
   * Hides the progress bar.
   */
  hideProgressBar() {
    this.progressBarVisible = false;
  }
}
