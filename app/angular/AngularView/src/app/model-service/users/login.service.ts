import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Token } from './tokens';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDetail } from './login-details';
import { User } from './users';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginApiUrl = 'http://localhost:8000/api/token';
  private refreshApiUrl = 'http://localhost:8000/api/token/refresh';

  constructor(private http: HttpClient) { }

  login(credentials: LoginDetail): Observable<Token> {
    return this.http.post<Token>(this.loginApiUrl, credentials)
      .pipe(
        catchError(this.handleError)
      );
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
