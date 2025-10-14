import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AdditionalAbstractReportService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Fetches all monetary report details 
  getBeforeAbstract(payload:any): Observable<any> {
    const defaultPayload = {
    district: '',
    community: '',
    caste: '',
    police_city: '',
    Status_Of_Case: '',
    police_zone: '',
    Filter_From_Date: '',
    Filter_To_Date: ''
  };
    const requestBody = { ...defaultPayload, ...payload };

    return this.http.post(`${this.baseUrl}/addtionalReport/bf/abstract`,requestBody);
  }


  getAfterAbstract(payload:any): Observable<any> {
    const defaultPayload = {
    district: '',
    community: '',
    caste: '',
    police_city: '',
    Status_Of_Case: '',
    police_zone: '',
    Filter_From_Date: '',
    Filter_To_Date: ''
  };
  const requestBody = { ...defaultPayload, ...payload };
    return this.http.post(`${this.baseUrl}/addtionalReport/af/abstract`,requestBody);
  }

getAdditionalRelief(payload: any): Observable<any> {
  const defaultPayload = {
    district: '',
    community: '',
    caste: '',
    police_city: '',
    Status_Of_Case: '',
    police_zone: '',
    Filter_From_Date: '',
    Filter_To_Date: '',
    search:''
  };

  // Merge defaults with payload (to ensure all keys are present)
  const requestBody = { ...defaultPayload, ...payload };

  return this.http.post(`${this.baseUrl}/additionalReliefData`, requestBody);
}
updateAdditionalReliefReason(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/additionalreport/additionalReliefReportReason`, data);
  }

  
}
