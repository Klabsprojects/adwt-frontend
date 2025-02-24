import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AdditionalReportService {
  // private baseUrl = 'https://adwatrocity.onlinetn.com/api/v1/additionalreport';
  private baseUrl = environment.apiUrl+'additionalreport';
  //private baseUrl = 'http://localhost:3010/additionalreport';

  constructor(private http: HttpClient) {}

  // Fetches all additional report details 
  getAdditionalReportDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-additional-report-details`);
  }
  
}
