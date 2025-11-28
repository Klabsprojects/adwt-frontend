import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class Vmcservice {
  private baseUrl = environment.apiUrl+'vmc';
  // private baseUrl = 'http://localhost:3000'+'/vmc';
  //private baseUrl1 = 'http://localhost:3000/vmcadd';

  constructor(private http: HttpClient) {}

  // getAllMembers(): Observable<any> {
  //   return this.http.get(this.baseUrl);
  // }

  

  getAllMembers( filters: any = {}): Observable<any> {
    let params = new HttpParams()
    Object.keys(filters).forEach(key => {
      params = params.set(key, filters[key]);
    });
     return this.http.get(`${this.baseUrl}/getAllMembersV1`, { params });
  }

  getDistrictLevelMember(district : any): Observable<any> {
    const params = new HttpParams()
    .set('district', district)
    return this.http.get(`${this.baseUrl}/getDistrictLevelMember`, { params });
  }

  addMember(memberData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, memberData);
  }

  updateMember(memberId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${memberId}`, updatedData);
  }
  deleteMember(memberId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${memberId}`);
  }




  toggleMemberStatus(memberId: any, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${memberId}/status`, { status });
  }



  getAllDistricts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/districts`);
  }
  getSubdivisionsByDistrict(district: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/subdivisions?district=${district}`);
  }
  
  // getSubdivisionsByDistrict(district: string): Observable<any[]> {
  //   return this.http.get<any[]>(`/api/subdivisions?district=${district}`);
  // }




}

