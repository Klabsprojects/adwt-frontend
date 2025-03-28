import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = environment.apiUrl;

  private filterapiUrl = environment.apiUrl+'filter-options';

  private backendUrl = environment.apiUrl;

  private apiUrl = environment.apiUrl+'dashboard-data';

  private apiUrl1 = environment.apiUrl+'getPTCases';

  private apiUrl2 = environment.apiUrl+'getUICases';

  private apiUrl3 = environment.apiUrl+'getCaseStatusCounts';

  private apiUrl4 = environment.apiUrl+'getCaseStatus1Counts';

  private apiUrl5 = environment.apiUrl+'chart-bar-data';

  private apiUrl6 = environment.apiUrl+'chart-line-data';

  private apiUrl7 = environment.apiUrl+'districtsmap';

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
