import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class MonetaryReliefService {
  // private baseUrl = 'https://adwatrocity.onlinetn.com/api/v1/monetaryRelief';
  private baseUrl = environment.apiUrl+'monetaryRelief';
  //private baseUrl = 'http://localhost:3010/monetaryRelief';

  constructor(private http: HttpClient) {}

  // Fetches all monetary report details 
  getMonetaryReliefDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-monetary-relief-details`);
  }

 getMonetaryReliefData(page: number, pageSize: number,filters: any = {}): Observable<any> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());
    Object.keys(filters).forEach(key => {
        params = params.set(key, filters[key]);
      });

  return this.http.get(`${this.baseUrl}/getmonetaryReliefDatav1`, { params });
}

getMonetaryReliefDownload(): Observable<any> {
  return this.http.get(`${this.baseUrl}/getmonetaryReliefDatav1?download=yes`);
}

  
  // Update status and reason for current month to given fir report details
  updateMonetaryReliefDetails(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-monetary-relief-details`, data);
  }
}
