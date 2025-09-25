import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class VmcReportService {
  // private baseUrl = environment.apiUrl+'monetaryRelief';
  private baseUrl = environment.apiUrl+'vmcmeeting';
  constructor(private http: HttpClient) {}

  // Fetches all monetary report details 
  getVmcReportList(filters: any = {}): Observable<any> {
    let params = new HttpParams()
    Object.keys(filters).forEach(key => {
      params = params.set(key, filters[key]);
    });
    return this.http.get(`${this.baseUrl}/getVmcReportListV1`, { params });
  }
  
}
