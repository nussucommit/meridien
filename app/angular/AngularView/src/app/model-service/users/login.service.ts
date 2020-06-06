import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Token } from './tokens';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDetail } from './login-details';
import { User } from './users';
import { setupMaster } from 'cluster';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginApiUrl = 'http://localhost:8000/api/token';
  private refreshApiUrl = 'http://localhost:8000/api/token/refresh';

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(credentials: LoginDetail) {
    return this.http.post<Token>(this.loginApiUrl, credentials)
      .pipe(
        map<Token, boolean>((receivedToken: Token) => {
          const user = {
            username: credentials.username,
            token: receivedToken
          };
          this.storeUser(user);
          return true;
        }),
        catchError(this.handleError)
      );
  }

  get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  private storeUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
