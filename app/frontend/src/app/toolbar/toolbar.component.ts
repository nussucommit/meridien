import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogoutComponent } from '../logout/logout.component';
import { ComponentBridgingService } from '../model-service/componentbridging.service';
import { Subscription } from 'rxjs';

/**
 * Component for page toolbar
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  progressBarVisible = false;
  progressBarOnSubscription: Subscription;
  progressBarOffSubscription: Subscription;

  constructor(
    public lc: LogoutComponent,
    public service: ComponentBridgingService
  ) { }

  /**
   * Initializes the behaviour of progress bar.
   */
  ngOnInit(): void {
    this.progressBarOnSubscription = this.service.on('progressBarOn').subscribe(() => this.showProgressBar());
    this.progressBarOffSubscription = this.service.on('progressBarOff').subscribe(() => this.hideProgressBar());
  }

  /**
   * Unsubscribe from the broadcasts.
   */
  ngOnDestroy(): void {
    this.progressBarOnSubscription.unsubscribe();
    this.progressBarOffSubscription.unsubscribe();
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
