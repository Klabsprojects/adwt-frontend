import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class ReliefService {
  private apiUrl = environment.apiUrl+'fir-relief'; // Base URL

  constructor(private http: HttpClient) {}

  // Fetch FIR Relief List
  getFIRReliefList(filters: any = {}): Observable<any[]> {
  let params = new HttpParams()
    
      Object.keys(filters).forEach(key => {
        params = params.set(key, filters[key]);
      });
        // Add other filters as needed
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getAlteredList(filters: any = {}): Observable<any[]> {
  let params = new HttpParams()
    
      Object.keys(filters).forEach(key => {
        params = params.set(key, filters[key]);
      });
        // Add other filters as needed
    return this.http.get<any[]>(environment.apiUrl+'getAlteredList', { params });
  }

  // Save First Installment Details
  saveFirstInstallmentDetails(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save-first-installment`, data);
  }
  saveSecondInstallmentDetails(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save-second-installment`, data);
  }


  getVictimsReliefDetails_1(firId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/victims-details_1/${firId}`);
  }

  getSecondInstallmentDetails(firId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/second-installment/${firId}`);
  }

  getThirdInstallmentDetails(firId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/trial_relief/${firId}`);
  }

  saveThirdInstallmentDetails(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/trial_relief_save/`, data);
  }

  FetchAllInstallmentDetails(firId: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Fetch_relief_details/`, firId);
  }

}

