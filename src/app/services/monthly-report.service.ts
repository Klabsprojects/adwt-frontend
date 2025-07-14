import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class MonthlyReportService {
  // private baseUrl = 'https://adwatrocity.onlinetn.com/api/v1/monthlyreport';
  private baseUrl = environment.apiUrl+'monthlyreport';
  // private baseUrl = 'http://localhost:3010/monthlyreport';

  constructor(private http: HttpClient) {}

  // Get districts and subdivisions
  getDistricts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/districts`);
  }

  // Fetches all monthly report details 
  getMonthlyReportDetail(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-monthly-report-details`);
  }

  GetDistrictWisePendingUI( filters: any = {}): Observable<any> {
  let params = new HttpParams();
  
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    
    // Handle multiple districts as array
    if (key === 'districts' && Array.isArray(value)) {
      // For multiple districts, append each district separately
      value.forEach((district: string) => {
        params = params.append('districts', district);
      });
    } else if (key === 'districts' && value) {
      // For single district
      params = params.set(key, value);
    } else if (value !== null && value !== undefined && value !== '') {
      // Handle other parameters normally
      params = params.set(key, value);
    }
  });
    return this.http.get(`${this.baseUrl}/GetDistrictWisePendingUI`, { params });
  }

  GetReasonWisePendingUI(filters: any = {}): Observable<any> {
    let params = new HttpParams();
  
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    
    // Handle multiple districts as array
    if (key === 'districts' && Array.isArray(value)) {
      // For multiple districts, append each district separately
      value.forEach((district: string) => {
        params = params.append('districts', district);
      });
    } else if (key === 'districts' && value) {
      // For single district
      params = params.set(key, value);
    } else if (value !== null && value !== undefined && value !== '') {
      // Handle other parameters normally
      params = params.set(key, value);
    }
  });
    return this.http.get(`${this.baseUrl}/GetReasonWisePendingUI`, { params });
  }

  GetCommunity_Certificate_Report(filters: any = {}): Observable<any> {
      let params = new HttpParams();
  
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    
    // Handle multiple districts as array
    if (key === 'districts' && Array.isArray(value)) {
      // For multiple districts, append each district separately
      value.forEach((district: string) => {
        params = params.append('districts', district);
      });
    } else if (key === 'districts' && value) {
      // For single district
      params = params.set(key, value);
    } else if (value !== null && value !== undefined && value !== '') {
      // Handle other parameters normally
      params = params.set(key, value);
    }
  });
    return this.http.get(`${this.baseUrl}/GetCommunity_Certificate_Report`, { params });
  }

  GetDistrictWisePendingPT(filters: any = {}): Observable<any> {
  let params = new HttpParams();
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    
    // Handle multiple districts as array
    if (key === 'districts' && Array.isArray(value)) {
      // For multiple districts, append each district separately
      value.forEach((district: string) => {
        params = params.append('districts', district);
      });
    } else if (key === 'districts' && value) {
      // For single district
      params = params.set(key, value);
    } else if (value !== null && value !== undefined && value !== '') {
      // Handle other parameters normally
      params = params.set(key, value);
    }
  });
    return this.http.get(`${this.baseUrl}/GetDistrictWisePendingPT`, { params });
  }

  GetConvictionTypeRepot(filters: any = {}): Observable<any> {
    let params = new HttpParams();
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    
    // Handle multiple districts as array
    if (key === 'districts' && Array.isArray(value)) {
      // For multiple districts, append each district separately
      value.forEach((district: string) => {
        params = params.append('districts', district);
      });
    } else if (key === 'districts' && value) {
      // For single district
      params = params.set(key, value);
    } else if (value !== null && value !== undefined && value !== '') {
      // Handle other parameters normally
      params = params.set(key, value);
    }
  });
    return this.http.get(`${this.baseUrl}/GetConvictionTypeRepot`, { params });
  }

  MonnthlyUpdate(fir_id: any, Reason : any, remark:any): Observable<any[]> {
    const allDataUrl = `${this.baseUrl}/MonnthlyUpdate`;
    const body = {Reason : Reason, fir_id : fir_id, remarks:remark}
    return this.http.put<any[]>(allDataUrl, body); // 👈 Empty body, headers in 3rd param
  }

  // Update status and reason for current month to given fir report details
  updateMonthlyReportDetail(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-monthly-report-details`, data);
  }

  // Get attendees for SDLVMC or DLVMC
  getAttendees(
    district: string,
    subdivision: string,
    committee: string,
    year: string): Observable<any> {

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

  submitMeeting(meetingData: any): Observable<any> {
    const formData = new FormData();
  
    // Append meeting details
    formData.append("committee", meetingData.committee);
    formData.append("meeting", meetingData.meeting);
    formData.append("district", meetingData.district);
    if (meetingData.subdivision) {
      formData.append("subdivision", meetingData.subdivision); // Optional for SDLVMC
    }
    formData.append("meetingDate", meetingData.meetingDate);
    formData.append("meetingTime", meetingData.meetingTime);
  
    // Append attendees array as a single JSON string
    // if(meetingData.attendees.length > 0){
      formData.append("attendees", JSON.stringify(meetingData.attendees));
    // } else {
    //   formData.append("attendees", JSON.stringify([]));
    // }
  
    // Append the file
    if (meetingData.uploadedFile) {
      formData.append("uploadedFile", meetingData.uploadedFile);
    }
  
    // Post the FormData to the backend
    return this.http.post(`${this.baseUrl}/submit-meeting`, formData);
  }



  getAttendeesByDistrictbysk(Data: any): Observable<any> {
    let body = Data;
    return this.http.post(`${this.baseUrl}/getAttendeesByDistrictbysk`, body);
  }


  getReportdata(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getadditionalreportdetail`);
  }

  
}
