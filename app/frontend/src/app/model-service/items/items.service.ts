import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private baseUrl = environment.apiUrl + 'items';

  constructor(private http: HttpClient) { }

  getItemsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`);
  }

  getItemCategoryList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/category/`);
  }

  getItem(id: number): Observable<Object> {
    return this.http.get(`${this.baseUrl}/${id}/`);
  }

  createItem(item: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/`, item);
  }

  updateItem(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}/`, value);
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/`);
  }
}
