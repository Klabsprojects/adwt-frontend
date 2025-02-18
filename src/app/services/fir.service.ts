import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { FormArray, FormGroup } from '@angular/forms';
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

  // Get offence relief details
  getOffenceReliefDetails(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/offence/relief/details`);
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
    if (accused.uploadFIRCopy && accused.uploadFIRCopy.length > 0 && Array.isArray(accused.uploadFIRCopy)) {
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
  
  // Updates the victim's name and mobileNumber fields based on whether the victim is the same as the complainant.
  onVictimSameAsComplainantChange(isVictimSame: boolean, firForm: FormGroup, wasVictimSame: boolean) {
    const victimsArray = firForm.get('victims') as FormArray;
    if (victimsArray && victimsArray.length > 0) {
      const firstVictim = victimsArray.at(0);
      console.log('firstVictim.get(mobileNumber) ',firstVictim.get('mobileNumber'));
      if (isVictimSame) {
        const complainantName = firForm.get('complainantDetails.nameOfComplainant')?.value;
        const complainantMobile = firForm.get('complainantDetails.mobileNumberOfComplainant')?.value;
        console.log('complainantMobile ',complainantMobile);
        firstVictim.get('name')?.setValue(complainantName, { emitEvent: false });
        firstVictim.get('name')?.disable(); // Disable the first control
        firstVictim.get('mobileNumber')?.setValue(complainantMobile, { emitEvent: false });
        firstVictim.get('mobileNumber')?.disable(); // Disable the first control
      } else if (wasVictimSame) {
        // Only reset the name if switching from "Yes" to "No"
        firstVictim.get('name')?.reset();
        firstVictim.get('name')?.enable(); // Enable the first control
        firstVictim.get('mobileNumber')?.reset();
        firstVictim.get('mobileNumber')?.enable(); // Enable the first control
      }
    }
  }

  // Validates if both the FIR number and its corresponding year are selected for the given field.
  isFirValid(fir: string, suffix: string, firForm: FormGroup): boolean {
    // If fir and suffix are 'firNumber' and 'firNumberSuffix', check directly in form values
    if (fir === 'firNumber' && suffix === 'firNumberSuffix') {
      return !!(firForm.get(fir)?.value && firForm.get(suffix)?.value);
    }
    // Extract numeric index as string
    const index = fir.match(/\d+$/)?.[0]; 
    if (!index) return false; // Return false if no index is found
    // Convert index to number for array access
    const accused = firForm.value.accuseds?.[parseInt(index, 10)];
    if (!accused) return false;
    // Remove index from keys
    const firKey = fir.replace(index, ''); 
    const suffixKey = suffix.replace(index, '');
    return !!(accused[firKey] && accused[suffixKey]); // Check if both values exist
  }

  // Checks if a given field in the FormArray at a specific index has a valid (non-empty) value.
  isInputValid(index: number, field: string, formArray: FormArray): boolean {
    const inputValue = formArray.at(index).get(field)?.value; // Retrieve the field value from FormArray
    return !!inputValue && inputValue.trim() !== ''; // Returns true if input is filled
  }

  /**
  * Handles offence selection changes by updating victim details with relevant SC/ST sections, 
  * FIR stages, and relief amounts based on selected offences.
  */
  onOffenceCommittedChange(
    selectedOffences: any[],
    index: number,
    offenceReliefDetails: any[],
    victims: FormArray
  ): void {
    const victimGroup = victims.at(index) as FormGroup; // Access the victim's FormGroup
    // Filter to find matching poa_act_section values
    const matchingSections = offenceReliefDetails
      .filter(offence => selectedOffences.includes(offence.name_of_offence))
      .map(offence => offence.poa_act_section);
    // Set the 31st field with matching sections
    if (matchingSections.length > 0) {
      this.getOffenceActs().subscribe(
        (response: any[]) => {
          // Filter the offence acts based on selected values
          const matchedActs = response.filter((act) =>
            matchingSections.includes(act.offence_act_name)
          );
          if (matchedActs.length > 0) {
            // Update the victim's FormGroup with the fetched values
            victimGroup.patchValue({
              scstSections: matchedActs.map(act => act.offence_act_name), // Auto-select field 31
              fir_stage_as_per_act: matchedActs[0].fir_stage_as_per_act || '',
              fir_stage_ex_gratia: matchedActs[0].fir_stage_ex_gratia || '',
              chargesheet_stage_as_per_act: matchedActs[0].chargesheet_stage_as_per_act || '',
              chargesheet_stage_ex_gratia: matchedActs[0].chargesheet_stage_ex_gratia || '',
              final_stage_as_per_act: matchedActs[0].final_stage_as_per_act || '',
              final_stage_ex_gratia: matchedActs[0].final_stage_ex_gratia || '',
            });
            // Calculate and update the 1st stage relief amount
            const reliefAmountFirstStage =
              parseFloat(matchedActs[0].fir_stage_as_per_act || '0') +
              parseFloat(matchedActs[0].fir_stage_ex_gratia || '0');
            victimGroup.patchValue({
              reliefAmountFirstStage: reliefAmountFirstStage.toFixed(2),
            });
          } else {
            // Reset the fields if no matched acts are found
            victimGroup.patchValue({
              scstSections: [],
              fir_stage_as_per_act: '',
              fir_stage_ex_gratia: '',
              chargesheet_stage_as_per_act: '',
              chargesheet_stage_ex_gratia: '',
              final_stage_as_per_act: '',
              final_stage_ex_gratia: '',
              reliefAmountFirstStage: '', // Reset the 1st stage relief amount
            });
          }
        },
        (error) => {
          console.error('Error fetching offence acts:', error);
        }
      );
    } else {
      // Reset the fields if no sections are selected
      victimGroup.patchValue({
        scstSections: [],
        fir_stage_as_per_act: '',
        fir_stage_ex_gratia: '',
        chargesheet_stage_as_per_act: '',
        chargesheet_stage_ex_gratia: '',
        final_stage_as_per_act: '',
        final_stage_ex_gratia: '',
        reliefAmountFirstStage: '', // Reset the 1st stage relief amount
      });
    }
  }  
}
