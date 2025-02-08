import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get<any[]>(`${this.baseUrl}/list`);
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
    return this.http.get(`${environment.apiUrl}/additionalreport/getadditionalreportdetail`);
  }
}
