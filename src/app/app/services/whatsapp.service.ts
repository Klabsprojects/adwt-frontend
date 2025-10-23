import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class WhatsappTriggerService {
   private baseUrl = environment.apiUrl+'whatsapp';

   constructor(private http: HttpClient) {}

   getUserList(page: number, pageSize: number,filters: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/pending`);
  }
}
