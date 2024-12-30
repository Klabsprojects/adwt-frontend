import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class PermissionsRoleNavService {
  private apiUrl = environment.apiUrl+'permissions_role_nav'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  getPermissions(roleId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${roleId}`);
  }
}
