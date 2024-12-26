import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdditionalReliefService {

  // private apiUrl = 'http://104.254.244.178/api/fir-relief';
  private apiUrl = 'http://104.254.244.178/api/fir-additional-relief';

  private baseUrl = 'http://104.254.244.178/api/';

  constructor(private http: HttpClient) {}



  getFIRAdditionalReliefList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  getVictimsByFirId(firId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://104.254.244.178/api/victims?fir_id=${firId}`);
  }

  saveAdditionalRelief(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save-additional-relief`, data);
  }

}

