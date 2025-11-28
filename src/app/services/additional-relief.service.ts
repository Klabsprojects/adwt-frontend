import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
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

  getFIRAdditionalReliefList_By_Victim(filters: any = {},sortField?: string,
    sortOrder?: string): Observable<any[]> {
      let params = new HttpParams()
      Object.keys(filters).forEach(key => {
      params = params.set(key, filters[key]);
    });
    if (sortField) {
      params = params
        .set('sortFlag', 'true')
        .set('sortField', sortField)
        .set('sortOrder', sortOrder || 'ASC');
    }
    return this.http.get<any[]>(this.baseUrl+`fir-additional-relief-ByVictim`, { params });
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
  updateAdditionalReliefDetails(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/additionalReliefReportReason`, data);
  }

}

