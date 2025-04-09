import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class VmcMeetingService {
  // private baseUrl = 'https://adwatrocity.onlinetn.com/api/v1/vmcmeeting';
  // private baseUrl = 'http://localhost:3010/vmcmeeting';
  private baseUrl = environment.apiUrl+'vmcmeeting';

  constructor(private http: HttpClient) {}

  // Get districts and subdivisions
  getDistricts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/districts`);
  }

  getUserBasedDistrict(userId : any): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
    return this.http.get(`${this.baseUrl}/getUserBasedDistrict`, { params });
  }

  // Get attendees for SDLVMC or DLVMC
  getAttendees(
    district: string,
    subdivision: string,
    committee: string,
    year: string
  ): Observable<any> {

    const params = new HttpParams()
      .set('district', district)
      .set('subdivision', subdivision || '') // Allow empty subdivision for DLVMC
      .set('committee', committee)
      .set('year', year); // Include the selected year in the request
    //console.log(params);
    return this.http.get(`${this.baseUrl}/attendees`, { params });
  }
  

  // Get attendees for SLVMC
  getAttendeesStateLevel(): Observable<any> {
    const params = new HttpParams().set('committee', 'SLVMC');
    return this.http.get(`${this.baseUrl}/attendees`, { params });
  }

  // getMeetingStatuses(committee: string, year: string): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/statuses`, { params: { committee, year } });
  // }

  // submitMeeting(meetingData: any): Observable<any> {
  //   let params = new HttpParams()
  //   .set("committee", meetingData.committee)
  //   .set("meeting", meetingData.meeting)
  //   .set("district", meetingData.district)
  //   .set("meetingDate", meetingData.meetingDate)
  //   .set("meetingTime", meetingData.meetingTime)
  //   .set("Year", meetingData.Year)
  //   .set("uploaded_minutes", meetingData.uploaded_minutes)
  //   .set("attendees", JSON.stringify(meetingData.attendees));
  
  // if (meetingData.subdivision) {
  //   params = params.set("subdivision", meetingData.subdivision); // Add conditionally
  // }
  //   return this.http.post(`${this.baseUrl}/submit-meeting`, params);
  // }

  submitMeeting(meetingData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/submit-meeting`, meetingData);
  }


  getAttendeesByDistrictbysk(Data: any): Observable<any> {
    let body = Data;
    return this.http.post(`${this.baseUrl}/getAttendeesByDistrictbysk`, body);
  }


  getAllMeeting(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAllMeeting`);
  }
  
  getDistrictLevelMeeting(district : any): Observable<any> {
    const params = new HttpParams()
    .set('district', district)
    return this.http.get(`${this.baseUrl}/getDistrictLevelMeeting`, { params });
  }

  uploadFile(formData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}FileUpload`, formData);
  }
  
}
