import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class mrfAbstractService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

getMrfAbstractDetails(requestBody: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/getMRFAbstract`, requestBody);
}

getMrfAbstractDetailedData(requestBody: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/getMRFAbstractDetails`, requestBody);
}
  
  // Update status and reason for current month to given fir report details
  updateMonetaryReliefDetails(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-monetary-relief-details`, data);
  }
}
