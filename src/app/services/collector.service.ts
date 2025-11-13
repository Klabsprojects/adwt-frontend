import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class CollectorService {

  private baseUrl = environment.apiUrl+'collectors';

  constructor(private http: HttpClient) {}

  addCollector(values: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, values);
  }

  // Get all police Station
  getAllCollector(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Update a police Station
  updateCollector(id: number, values: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, values);
  }

  // Delete a police Station
  deleteCollector(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
