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
  getBeforeAbstract(): Observable<any> {
    const requestBody = {
    district: '',
    community: '',
    caste: '',
    police_city: '',
    Status_Of_Case: '',
    police_zone: '',
    Filter_From_Date: '',
    Filter_To_Date: ''
  };
    return this.http.post(`${this.baseUrl}/addtionalReport/bf/abstract`,requestBody);
  }


  getAfterAbstract(): Observable<any> {
    const requestBody = {
    district: '',
    community: '',
    caste: '',
    police_city: '',
    Status_Of_Case: '',
    police_zone: '',
    Filter_From_Date: '',
    Filter_To_Date: ''
  };
    return this.http.post(`${this.baseUrl}/addtionalReport/af/abstract`,requestBody);
  }

    getAdditionalRelief(): Observable<any> {
    const requestBody = {
    district: '',
    community: '',
    caste: '',
    police_city: '',
    Status_Of_Case: '',
    police_zone: '',
  };
    return this.http.post(`${this.baseUrl}/additionalReliefData`,requestBody);
  }

  
}
