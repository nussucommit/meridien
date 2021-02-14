import { environment } from './../../../environments/environment';
import { ConfirmationTemplate } from './confirmationtemplates';
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

  private baseUrlTemplates = environment.apiUrl + 'confirmation_templates';
  private baseUrlTemplate = environment.apiUrl + 'confirmation_template';

  constructor(private http: HttpClient) { }

  getConfirmationTemplateList(): Observable<any> {
    return this.http.get(`${this.baseUrlTemplates}`);
  }

  getConfirmationTemplateById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrlTemplate}/${id}`);
  }

  updateConfirmationTemplate(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrlTemplate}/${id}`, value);
  }

  createConfirmationTemplate(template: ConfirmationTemplate): Observable<Object> {
    return this.http.post(`${this.baseUrlTemplates}`, template);
  }

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
