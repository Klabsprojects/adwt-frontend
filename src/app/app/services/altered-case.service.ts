import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlteredCaseService {

  private baseUrl = 'http://104.254.244.178/api'; // Adjust the base URL as per your Node.js server

  constructor(private http: HttpClient) {}

  getNatureOfOffenceOptions(): Observable<{ offence_name: string }[]> {
    return this.http.get<{ offence_name: string }[]>(`${this.baseUrl}/natureOfOffenceOptions`);
  }

  getSCSTSectionsOptions(): Observable<{ offence_act_name: string }[]> {
    return this.http.get<{ offence_act_name: string }[]>(`${this.baseUrl}/scstSectionsOptions`);
  }

  getOffenceActsBySections(selectedSections: string[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/offence-acts_victim`, { selectedSections });
  }


  addAlteredCase(firId: string, data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/altered-case/${firId}`, data);
  }

  getVictimsByFirId(firId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/victims_new`, { params: { fir_id: firId } });
  }

  updateVictims(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update-victims`, payload);
  }
  updateVictimCountAndDetails(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update-victim-count-and-details`, payload);
  }

  getVictimNamesByFirId(firId: string): Observable<{ name: string; isSelected: number }[]> {
    return this.http.get<{ name: string; isSelected: number }[]>(`${this.baseUrl}/get-victim-names/${firId}`);
  }


  saveAccusedData(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save-accused-data`, data);
  }



}