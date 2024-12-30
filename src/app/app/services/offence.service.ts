import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class OffenceService {
  private baseUrl = environment.apiUrl+'offences';

  constructor(private http: HttpClient) {}

  // Get all offences
  getAllOffences(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Add a new offence
  addOffence(offence: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, offence);
  }

  // Update a specific offence
  updateOffence(id: number, offence: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, offence);
  }

  // Delete a specific offence
  deleteOffence(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
