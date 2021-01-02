import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ConfirmationTemplatesService {
  private getUrl = environment.apiUrl + 'get_confirmation';
  private postUrl = environment.apiUrl + 'update_confirmation';
  private resendUrl = environment.apiUrl + 'resend_confirmation';

  constructor(private http: HttpClient) { }

  getConfirmationTemplate(): Observable<any> {
    return this.http.get(`${this.getUrl}`);
  }

  updateTemplate(value: any): Observable<Object> {
    return this.http.post(`${this.postUrl}`, value);
  }

  resendConfirmation(value: any): Observable<any> {
    return this.http.post(`${this.resendUrl}`, value);
  }
}
