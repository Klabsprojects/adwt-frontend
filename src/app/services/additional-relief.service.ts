import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class AdditionalReliefService {

  // private apiUrl = environment.apiUrl+'fir-relief';
  private apiUrl = environment.apiUrl+'fir-additional-relief';

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}



  getFIRAdditionalReliefList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getFIRAdditionalReliefList_By_Victim(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+`fir-additional-relief-ByVictim`);
  }

  getVictimsByFirId(firId: string, victimId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}victims?fir_id=${firId}&victim_id=${victimId}`);
  }
  saveAdditionalRelief(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}save-additional-relief`, data);
  }

  getAdditionalReliefByFirId(firId: string,victimId: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+`get-additional-relief-details?fir_id=${firId}&victim_id=${victimId}`);
  }

}

