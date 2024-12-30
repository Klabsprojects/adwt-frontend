import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class OffenceActService {
  private apiUrl = environment.apiUrl+'offenceact';

  constructor(private http: HttpClient) {}

  getAllOffenceActs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  addOffenceAct(offenceAct: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}`, offenceAct);
  }

  updateOffenceAct(id: number, offenceAct: any): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, offenceAct);
  }

  deleteOffenceAct(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  toggleStatus(id: number): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${id}/toggle-status`, {});
  }
}
