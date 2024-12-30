// revenueDistrict.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class RevenueDistrictService {
  private baseUrl = environment.apiUrl+'revenue-districts';
  private districtsUrl = environment.apiUrl+'districts';

  constructor(private http: HttpClient) {}

  // Get all revenue districts
  getAllRevenueDistricts(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Add a new revenue district
  addRevenueDistrict(district: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, district);
  }

  // Get all districts for dropdown selection
  getAllDistricts(): Observable<any> {
    return this.http.get(`${this.districtsUrl}`);
  }

  // Update a revenue district
  updateRevenueDistrict(id: number, district: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, district);
  }

  // Delete a revenue district
  deleteRevenueDistrict(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
