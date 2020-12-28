import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  private baseUrl = 'http://localhost:8000/api/issues';

  constructor(private http: HttpClient) { }

  getIssueList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  getIssue(id: number): Observable<Object> {
    return this.http.get(`${this.baseUrl}/${id}/`);
  }

  createIssue(issue: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/`, issue);
  }

  updateIssue(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}/`, value);
  }

  deleteIssue(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/`);
  }

}
