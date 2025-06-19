import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class FirListTestService {
  private baseUrl = environment.apiUrl+'fir_list'; // Your backend URL
  // private baseUrl = 'https://adwatrocity.onlinetn.com/api/v1/fir_list';

  constructor(private http: HttpClient) {}

  // Fetch FIR list from the backend
  getFirList(): Observable<any[]> {
    console.log("Requesting FIR list from backend (FirListTestService)");
    return this.http.get<any[]>(`${this.baseUrl}/list`+'/chumma');
  }


   // Delete a FIR by ID
   deleteFir(firId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${firId}`);
  }

  // Update FIR status
  updateFirStatus(firId: number, status: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-status/${firId}`, { status });
  }

  getFirView(firId: number): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/view?fir_id=${firId}`);
  }

  // getReportdata(): Observable<any> {
  //   return this.http.get('http://localhost:3010/additionalreport/getadditionalreportdetail');
  // }
  getReportdata(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/additionalreport/getadditionalreportdetails`);
  }


  getPaginatedFirList(page: number, pageSize: number , filters: any = {}) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
      
      // Add all filters to params
      Object.keys(filters).forEach(key => {
        params = params.set(key, filters[key]);
      });
        // Add other filters as needed
    
    return this.http.get<any>(`${this.baseUrl}/list_paginated`, { params });
  }

  getLegacyPaginatedFirList(page: number, pageSize: number , filters: any = {}) {
    // https://adwatrocity.onlinetn.com/api/v1/fir_list/list_paginated?page=29&pageSize=10&district=Villupuram&legacy=yes
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('legacy','yes')
      
      // Add all filters to params
      Object.keys(filters).forEach(key => {
        params = params.set(key, filters[key]);
      });
        // Add other filters as needed
    
    return this.http.get<any>(`${this.baseUrl}/list_paginated`, { params });
  }


  getPoliceRanges() {
  return this.http.get<any>(`${this.baseUrl}/getPoliceRanges`);
  }

  getRevenue_district() {
    return this.http.get<any>(`${this.baseUrl}/getRevenue_district`);
    }
}
