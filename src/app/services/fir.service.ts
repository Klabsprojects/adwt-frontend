import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class FirService {
  getVictimDetailsByFirId(firId: string) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = environment.apiUrl+'fir';
  // Adjust this to your actual API base URL

  constructor(private http: HttpClient) {}



  // Get user details by user ID
  getUserDetails(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user-details`, { userId });
  }


  getPoliceStations(district: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/police-stations?district=${district}`);
  }



  // Get police division details by district
  getPoliceDivision(district: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/police-division?district=${district}`);
  }

  // Get offence options
  getOffences(): Observable<any> {
    //console.log("Requesting FIR list from backend");
    return this.http.get(`${this.baseUrl}/offences`);
  }

  // Get offence acts
 getOffenceActs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/offence-acts`);
  }

  getPoliceRevenue(): Observable<any> {
    return this.http.get(`${this.baseUrl}/police-revenue`);
  }

  // Get SC/ST sections
  getCastes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/scst-sections`);
  }


  getAllAccusedCommunities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/accused-communities`);
  }

  getAccusedCastesByCommunity(community: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/accused-castes-by-community?community=${community}`);
  }

  getCourtDivisions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/court-divisions`);
  }

  getCourtRangesByDivision(division: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/court-ranges?division=${division}`);
  }

  getDistricts(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/districts`);
  }


  getAllCommunities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/communities`);
  }

  getCastesByCommunity(community: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/castes-by-community?community=${community}`);
  }


 // Step 1 handling in service
handleStepOne(firId: string | null, firData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/handle-step-one`, { firId, firData });
}

  // Method to handle step 2
  handleStepTwo(firId: string | null, firData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/handle-Step-Two`, { firId, firData });
  }


  // Save Step 3 as Draft
saveStepThreeAsDraft(firData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/handle-step-three`, firData);
}


// step 4 has been changed api payload
saveStepFourAsDraft(firData: any): Observable<any> {
  const formData = new FormData();

  formData.append('firId', firData.firId);
  formData.append('numberOfAccused', firData.numberOfAccused.toString()); 


  formData.append('accuseds', JSON.stringify(firData.accuseds || []));


  firData.accuseds.forEach((accused: any, index: number) => {
    if (accused.uploadFIRCopy && accused.uploadFIRCopy.length > 0) {
      accused.uploadFIRCopy.forEach((file: File) => {
        formData.append(`uploadFIRCopy[]`, file, file.name);
      });
    }
  });
  return this.http.post(`${this.baseUrl}/handle-step-four`, formData);
}


  // Save Step 5 as draft
  // saveStepFiveAsDraft(firData: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/handle-step-five`, firData);
  // }


  saveStepFiveAsDraft(firData: any): Observable<any> {
    const formData = new FormData();
  

    formData.append('firId', firData.firId || '');
    formData.append('totalCompensation', firData.totalCompensation || '0.00');
    formData.append('proceedingsFileNo', firData.proceedingsFileNo || '');
    formData.append('proceedingsDate', firData.proceedingsDate || '');
  

    if (firData.proceedingsFile) {
      formData.append('proceedingsFile', firData.proceedingsFile);
    }
 
    if (firData.victimsRelief && firData.victimsRelief.length) {
      formData.append('victimsRelief', JSON.stringify(firData.victimsRelief));
    }
 
    if (firData.attachments && firData.attachments.length > 0) {
      firData.attachments.forEach((attachment:any) => {
        // console.log(attachment,"firData.filefilefile")

        
        if (attachment.file) {
          formData.append('attachments', attachment.file); // Correct key: 'attachments'
        }
      });
    }
    
  // console.log(firData.attachments,"firData.attachments")
    return this.http.post(`${this.baseUrl}/handle-step-five`, formData);
  }
  




  updatestep5(firData: any): Observable<any> {
    const formData = new FormData();
  

    formData.append('firId', firData.firId || '');
    formData.append('totalCompensation', firData.totalCompensation || '0.00');
    formData.append('proceedingsFileNo', firData.proceedingsFileNo || '');
    formData.append('proceedingsDate', firData.proceedingsDate || '');
  

    if (firData.proceedingsFile) {
      formData.append('proceedingsFile', firData.proceedingsFile);
    }
 
    if (firData.victimsRelief && firData.victimsRelief.length) {
      formData.append('victimsRelief', JSON.stringify(firData.victimsRelief));
    }
 
    if (firData.attachments && firData.attachments.length > 0) {
      firData.attachments.forEach((attachment:any) => {
        // console.log(attachment,"firData.filefilefile")

        
        if (attachment.file) {
          formData.append('attachments', attachment.file); // Correct key: 'attachments'
        }
      });
    }
    
  // console.log(firData.attachments,"firData.attachments")
    return this.http.post(`${this.baseUrl}/save-step-fiveedit`, formData);
  }

  saveStepSixAsDraft(firData: any): Observable<any> {
  
    const formData = new FormData();
  
    formData.append('firId', firData.firId);
    formData.append('chargesheetDetails', JSON.stringify(firData.chargesheetDetails));
    formData.append('victimsRelief', JSON.stringify(firData.victimsRelief));
    formData.append('status', firData.status);
  

    if (firData.uploadProceedingsPath) {

      formData.append('proceedingsFile', firData.uploadProceedingsPath); 
    }
  

    if (firData.attachments && firData.attachments.length > 0) {
      firData.attachments.forEach((attachment: any, index: number) => {
        if (attachment.file_1) {
    
   
          formData.append(`attachments`, attachment.file); 
        }
      });
    }
  console.log(formData,"formDataformData")

    return this.http.post(`${this.baseUrl}/save-step-six`, formData);
  }
  

 updateStep6(firData: any): Observable<any> {
  
    const formData = new FormData();
  
    formData.append('firId', firData.firId);
    formData.append('chargesheet_id', firData.chargesheet_id);
    formData.append('chargesheetDetails', JSON.stringify(firData.chargesheetDetails));
    formData.append('victimsRelief', JSON.stringify(firData.victimsRelief));
    formData.append('status', firData.status);
  

    if (firData.uploadProceedingsPath) {

      formData.append('proceedingsFile', firData.uploadProceedingsPath); 
    }
  

    if (firData.attachments && firData.attachments.length > 0) {
      firData.attachments.forEach((attachment: any, index: number) => {
        if (attachment) {
    
   
          formData.append(`attachments`, attachment); 
        }
      });
    }
  

    return this.http.post(`${this.baseUrl}/save-step-sixedit`, formData);
  }



  
  // saveStepSixAsDraft(firData: any): Observable<any> {
  //   console.log(firData,"firDatafirData")
  //   return this.http.post(`${this.baseUrl}/save-step-six`, firData);
  // }
  editStepSevenAsDraft(firData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save-step-sevenedit`, firData);
  }


  updateFirStatus(firId: string, status: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-status`, { firId, status });
  }

  getVictimsReliefDetails(firId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/victims-details/${firId}`);
  }




  getFirDetails(firId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/details`, {
      params: { fir_id: firId },
    });
  }

  saveReliefDetails(reliefData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/victims-details`, reliefData);
  }


  // updateFirStatus_1(firId: string, status: number): Observable<any> {
  //   const url = `${this.baseUrl}/update-fir-status_1/${firId}`;
  //   return this.http.post(url, { status });
  // }


  updateFirStatus_1(firId: string, status: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/update-status_1`, { firId, status });
  }


  getFirStatus(firId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/status/${firId}`);
  }


  uploadFile(formData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}FileUpload`, formData);
  }
  

  UpdateStepSevenAsDraft(firData : any) :Observable<any> {
    return this.http.post(`${this.baseUrl}/save-step-sevenedit`, firData)
  }

  // saveStepSevenAsDraft(firData : any) :Observable<any> {
    
  //   return this.http.post(`${this.baseUrl}/save-step-seven`, firData)
  // }


  saveStepSevenAsDraft(firData: any, hearingdetail: any): Observable<any> {
    // Add hearingdetail directly to firData
    firData.hearingdetail = hearingdetail;
  
    return this.http.post(`${this.baseUrl}/save-step-seven`, firData);
  }
  


}
