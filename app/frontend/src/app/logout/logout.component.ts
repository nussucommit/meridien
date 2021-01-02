import { LoginService } from './../model-service/users/login.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Component for the logout feature.
 */
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  public loginStatus: BehaviorSubject<boolean>;

  /**
   * Changes the status of user to logout.
   * @param loginService LoginService object.
   */
  constructor(
    private loginService: LoginService,
  ) {
    this.loginStatus = new BehaviorSubject<boolean>(false);
    this.loginService.observableUser.subscribe({
      next: (user) => this.loginStatus.next(user != null),
    });
  }

  ngOnInit(): void {

  }

  /**
   * Logs user out.
   */
  logout() {
    this.loginService.logout();
  }

}
