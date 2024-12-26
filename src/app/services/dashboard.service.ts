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
  private dadtwoapiUrl = 'http://104.254.244.178/api/dadtwo-dashboard-data';

  // private apiUrl1 = 'http://localhost:3000/getPTCases';

  // private apiUrl2 = 'http://localhost:3000/getUICases';

  // private apiUrl3 = 'http://localhost:3000/getCaseStatusCounts';

  // private apiUrl4 = 'http://localhost:3000/getCaseStatus1Counts';

  // private apiUrl5 = 'http://localhost:3000/chart-bar-data';

  // private apiUrl51 = 'http://localhost:3000/chart-bar-data';

  // private apiUrl6 = 'http://localhost:3000/chart-line-data';

  // private countApiUrl = 'http://localhost:3000/district-counts';

  // private countApiUrl1 = 'http://localhost:3000/district-counts1';

  constructor(private http: HttpClient) {}

  applyFilters(filters: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/apply-filters`, filters);
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }

  getFilterOptions(): Observable<any> {
    return this.http.get(this.filterapiUrl);
  }

  getDashboardCountData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getDadtwoDashboardCountData(): Observable<any> {
    return this.http.get<any>(this.dadtwoapiUrl);
  }

  applybarchartgivenDataFilters(filters: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/applybarchartgivenDataFilters`, filters);
  }

  applybarchartpendingDataFilters(filters: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/applybarchartpendingDataFilters`, filters);
  }

}
