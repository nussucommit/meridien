import { Component } from '@angular/core';
import { LogoutComponent } from './logout/logout.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'NUSSU Logistics Management System';
  constructor(public lc: LogoutComponent) {
  }
}
