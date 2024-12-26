import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = 'http://104.254.244.178/api';

  private filterapiUrl = 'http://104.254.244.178/api/filter-options';

  private backendUrl = 'http://104.254.244.178/api';

  private apiUrl = 'http://104.254.244.178/api/dashboard-data';

  private apiUrl1 = 'http://104.254.244.178/api/getPTCases';

  private apiUrl2 = 'http://104.254.244.178/api/getUICases';

  private apiUrl3 = 'http://104.254.244.178/api/getCaseStatusCounts';

  private apiUrl4 = 'http://104.254.244.178/api/getCaseStatus1Counts';

  private apiUrl5 = 'http://104.254.244.178/api/chart-bar-data';

  private apiUrl6 = 'http://104.254.244.178/api/chart-line-data';

  private apiUrl7 = 'http://104.254.244.178/api/districtsmap';

  constructor(private http: HttpClient) {}


  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }

  getFilterOptions(): Observable<any> {
    return this.http.get(this.filterapiUrl);
  }


  getDashboardCountData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getCasesByYearRange(): Observable<any> {
    return this.http.get<any>(this.apiUrl1);
  }

  getCasesByMonthRange(): Observable<any> {
    return this.http.get<any>(this.apiUrl2);
  }

  getCaseStatusCounts(): Observable<any> {
    return this.http.get<any>(this.apiUrl3);
  }

  getCaseStatus1Counts(): Observable<any> {
    return this.http.get<any>(this.apiUrl4);
  }

  getBarChartData(): Observable<any> {
    return this.http.get<any>(this.apiUrl5);
  }

  getLineChartData(): Observable<any> {
    return this.http.get<any>(this.apiUrl6);
  }

  getDistricts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl7);
  }

  applyFilters(filters: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/apply-filters`, filters);
  }


}
