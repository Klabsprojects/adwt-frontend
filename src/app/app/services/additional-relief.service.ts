import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class AdditionalReliefService {

  private apiUrl = environment.apiUrl+'fir-additional-relief';
  //private apiUrl = 'http://localhost:3000/fir-additional-relief';

  constructor(private http: HttpClient) {}

  getFIRAdditionalReliefList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  getVictimsByFirId(firId: string): Observable<any[]> {
    return this.http.get<any[]>(environment.apiUrl+`/victims?fir_id=${firId}`);
  }

}

