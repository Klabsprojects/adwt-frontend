import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class WhatsappTriggerService {
  private baseUrl = environment.apiUrl + 'whatsapp';

  constructor(private http: HttpClient) {}

  // getUserList(page: number, pageSize: number, filters: any = {}): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/users`);
  // }
  getUserList(filters: any = {}): Observable<any> {
  let url = `${this.baseUrl}/users?`;
  if (filters.district) {
    url += `&district=${encodeURIComponent(filters.district)}`;
  }
  return this.http.get(url);
}

  sendUIPTCase(userIds: string, preview: boolean = false, payload: any = {}): Observable<any> {
  const url = `${this.baseUrl}/sendUIPTCase?userId=${encodeURIComponent(userIds)}${preview ? '&preview=true' : ''}`;
  return this.http.post(url, payload);
}

sendReliefCase(userIds: string, preview: boolean = false, payload: any = {}): Observable<any> {
  const url = `${this.baseUrl}/sendReliefCase?userId=${encodeURIComponent(userIds)}${preview ? '&preview=true' : ''}`;
  return this.http.post(url, payload);
}

sendAdditionalRelief(userIds: string, preview: boolean = false, payload: any = {}): Observable<any> {
  const url = `${this.baseUrl}/sendAdditionalRelief?userId=${encodeURIComponent(userIds)}${preview ? '&preview=true' : ''}`;
  return this.http.post(url, payload);
}

sendMeetingCase(userIds: string, preview: boolean = false, payload: any = {}): Observable<any> {
  const url = `${this.baseUrl}/sendMeetingCase?userId=${encodeURIComponent(userIds)}${preview ? '&preview=true' : ''}`;
  return this.http.post(url, payload);
}

}
