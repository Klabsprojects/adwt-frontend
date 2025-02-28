import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class CourtService {

  private baseUrl = environment.apiUrl+'court';  
  // private baseUrl = 'http://localhost:3010/court';

  constructor(private http: HttpClient) {}

  // Get all police divisions
  getAllCourt(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Get all districts for dropdown selection
  // getAllDistricts(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/districts`);
  // }

  // Add a new police division
  addCourt(court: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, court);
  }

  // Update a police division
  updateCourt(id: number, court: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, court);
  }

  // Delete a police division
  deleteCourt(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
