import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class PoliceDivisionService {
  private baseUrl = environment.apiUrl+'police-division';  // Update to match the route definition

  constructor(private http: HttpClient) {}

  // Get all police divisions
  getAllPoliceDivisions(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Get all districts for dropdown selection
  getAllDistricts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/districts`);
  }

  // Add a new police division
  addPoliceDivision(division: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, division);
  }

  // Update a police division
  updatePoliceDivision(id: number, division: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, division);
  }

  // Delete a police division
  deletePoliceDivision(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
