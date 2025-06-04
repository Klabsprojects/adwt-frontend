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

  getalteredcasebasedID(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/alterd-case-detail?id=${id}`);
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

getOffenceActsWithId(offenceIds: any[]): Observable<any[]> {
  console.log(offenceIds,"idvalue");
  if (!offenceIds || offenceIds.length === 0) {
    return this.http.get<any[]>(`${this.baseUrl}/offence-acts`);
  }
  const queryParams = offenceIds.map(id => `offence[]=${id}`).join('&');
  const url = `${this.baseUrl}/offence-acts?${queryParams}`;
  return this.http.get<any[]>(url);
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
// saveStepFourAsDraft(firData: any): Observable<any> {
//   const formData = new FormData();

//   formData.append('firId', firData.firId);
//   formData.append('numberOfAccused', firData.numberOfAccused.toString()); 


//   formData.append('accuseds', JSON.stringify(firData.accuseds || []));

//   console.log("formData",formData);


//   // firData.accuseds.forEach((accused: any, index: number) => {
//   //   if (accused.uploadFIRCopy && accused.uploadFIRCopy.length > 0) {
//   //     accused.uploadFIRCopy.forEach((file: File) => {
//   //       formData.append(`uploadFIRCopy[]`, file, file.name);
//   //     });
//   //   }
//   // });
//   return this.http.post(`${this.baseUrl}/handle-step-four`, formData);
// }

saveStepFourAsDraft(firData: any): Observable<any> {
  let body = {firId :  firData.firId, numberOfAccused : firData.numberOfAccused.toString(), accuseds : JSON.stringify(firData.accuseds || []), gistOfCurrentCase : firData.gistOfCurrentCase, uploadFIRCopy : firData.uploadFIRCopy, accused_remarks : firData.accused_remarks}
  return this.http.post(`${this.baseUrl}/handle-step-four`, body);
}


  // Save Step 5 as draft
  // saveStepFiveAsDraft(firData: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/handle-step-five`, firData);
  // }


  // saveStepFiveAsDraft(firData: any): Observable<any> {
  //   const formData = new FormData();
  

  //   formData.append('firId', firData.firId || '');
  //   formData.append('totalCompensation', firData.totalCompensation || '0.00');
  //   formData.append('proceedingsFileNo', firData.proceedingsFileNo || '');
  //   formData.append('proceedingsDate', firData.proceedingsDate || '');
  

  //   if (firData.proceedingsFile) {
  //     formData.append('proceedingsFile', firData.proceedingsFile);
  //   }
 
  //   if (firData.victimsRelief && firData.victimsRelief.length) {
  //     formData.append('victimsRelief', JSON.stringify(firData.victimsRelief));
  //   }
 
  //   if (firData.attachments && firData.attachments.length > 0) {
  //     firData.attachments.forEach((attachment:any) => {
  //       // console.log(attachment,"firData.filefilefile")

        
  //       if (attachment.file) {
  //         formData.append('attachments', attachment.file); // Correct key: 'attachments'
  //       }
  //     });
  //   }
    
  // // console.log(firData.attachments,"firData.attachments")
  //   return this.http.post(`${this.baseUrl}/handle-step-five`, formData);
  // }
  saveStepFiveAsDraft(firData: any): Observable<any> {

  return this.http.post(`${this.baseUrl}/save-step-fiveedit`, firData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

  updatestep5(firData: any): Observable<any> {
   
  // console.log(firData.attachments,"firData.attachments")
    return this.http.post(`${this.baseUrl}/save-step-fiveedit`, firData);
  }

  // saveStepSixAsDraft(firData: any): Observable<any> {
  
  //   const formData = new FormData();
  
  //   formData.append('firId', firData.firId);
  //   formData.append('chargesheetDetails', JSON.stringify(firData.chargesheetDetails));
  //   formData.append('victimsRelief', JSON.stringify(firData.victimsRelief));
  //   formData.append('status', firData.status);
  

  //   if (firData.uploadProceedingsPath) {

  //     formData.append('proceedingsFile', firData.uploadProceedingsPath); 
  //   }
  

  //   if (firData.attachments && firData.attachments.length > 0) {
  //     firData.attachments.forEach((attachment: any, index: number) => {
  //       if (attachment.file) {
    
   
  //         formData.append(`attachments`, attachment.file); 
  //       }
  //     });
  //   }
  //   console.log(formData,"formDataformData")

  //   return this.http.post(`${this.baseUrl}/save-step-six`, formData);
  // }
//   saveStepSixAsDraft(firData: any): Observable<any> {
//   const payload: any = {
//     firId: firData.firId || '',
//     chargesheetDetails: firData.chargesheetDetails || {},
//     victimsRelief: firData.victimsRelief || [],
//     status: firData.status || '',
//     proceedingsFile: firData.uploadProceedingsPath || '', // file path as string
//     attachments: []
//   };

//   if (firData.attachments && firData.attachments.length > 0) {
//     payload.attachments = firData.attachments.map((attachment: any) => {
//       return attachment.file || ''; // assuming `file` holds the file path
//     });
//   }

//   return this.http.post(`${this.baseUrl}/save-step-six`, payload, {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });
// }

  saveStepSixAsDraft(firData: any): Observable<any> {
    let body = firData;
  return this.http.post(`${this.baseUrl}/save-step-sixedit`, body, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
  

//  updateStep6(firData: any): Observable<any> {
  
//     const formData = new FormData();
  
//     formData.append('firId', firData.firId);
//     formData.append('chargesheet_id', firData.chargesheet_id);
//     formData.append('chargesheetDetails', JSON.stringify(firData.chargesheetDetails));
//     formData.append('victimsRelief', JSON.stringify(firData.victimsRelief));
//     formData.append('status', firData.status);
  

//     if (firData.uploadProceedingsPath) {

//       formData.append('proceedingsFile', firData.uploadProceedingsPath); 
//     }
  

//     if (firData.attachments && firData.attachments.length > 0) {
//       firData.attachments.forEach((attachment: any, index: number) => {
//         if (attachment) {
    
   
//           formData.append(`attachments`, attachment); 
//         }
//       });
//     }
  

//     return this.http.post(`${this.baseUrl}/save-step-sixedit`, formData);
//   }




 updateStep6(firData: any): Observable<any> {
  let body = firData;
    return this.http.post(`${this.baseUrl}/save-step-sixedit`, body);
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

  GetVictimInformationDetails(firId: any): Observable<any> {
    let body = {firId : firId}
    return this.http.post(`${this.baseUrl}/GetVictimDetail`, body );
  }

    Getstep5Detail(firId: any): Observable<any> {
    let body = {firId : firId}
    return this.http.post(`${this.baseUrl}/Getstep5Detail`, body );
  }

    GetChargesheetDetail(firId: any): Observable<any> {
    let body = {firId : firId}
    return this.http.post(`${this.baseUrl}/GetChargesheetDetail`, body );
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

    console.log(firData,"firData")
    return this.http.post(`${this.baseUrl}/save-step-sevenedit`, firData)
  }

  

  saveStepSevenAsDraft(firData : any) :Observable<any> {

    return this.http.post(`${this.baseUrl}/save-step-sevenedit`, firData)
  // saveStepSevenAsDraft(firData : any) :Observable<any> {
    
  //   return this.http.post(`${this.baseUrl}/save-step-seven`, firData)
  // }

  }

  // Updates the victim's name and mobileNumber fields based on whether the victim is the same as the complainant.
  onVictimSameAsComplainantChange(isVictimSame: boolean, firForm: FormGroup, wasVictimSame: boolean) {
    const victimsArray = firForm.get('victims') as FormArray;
    if (victimsArray && victimsArray.length > 0) {
      const firstVictim = victimsArray.at(0);
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
    victims: FormArray,
    victimsRelief:FormArray,
    getId:any
  ): void {
    const victimGroup = victims.at(index) as FormGroup; // Access the victim's FormGroup
    const victimsReliefGroup = victimsRelief.at(index) as FormGroup;
    console.log(victimsReliefGroup);
    // Filter to find matching poa_act_section values
    const matchingSections = offenceReliefDetails
      .filter(offence => selectedOffences.includes(offence.name_of_offence))
      .map(offence => offence.poa_act_section);
    if (matchingSections.length > 0) {
      this.getOffenceActsWithId(getId).subscribe(
        (response: any[]) => {
          console.log(response);
          let responseArray = Array.isArray(response) ? response : [response];
          const matchedActs = responseArray.filter((act) => {
            const actNamesArray = act.offence_act_names.split(',');
            console.log(actNamesArray, matchingSections);
            return actNamesArray.some((name: any) => matchingSections.includes(name)); 
          });
          if (matchedActs.length > 0) {
            // Update the victim's FormGroup with the fetched values
            victimGroup.patchValue({
              scstSections: matchedActs[0].offence_act_names || '',
             // scstSections: matchedActs.map(act => act.offence_act_name), // Auto-select field 31
              fir_stage_as_per_act: matchedActs[0].fir_stage_as_per_act || '',
              fir_stage_ex_gratia: matchedActs[0].fir_stage_ex_gratia || '',
              chargesheet_stage_as_per_act: matchedActs[0].chargesheet_stage_as_per_act || '',
              chargesheet_stage_ex_gratia: matchedActs[0].chargesheet_stage_ex_gratia || '',
              final_stage_as_per_act: matchedActs[0].final_stage_as_per_act || '',
              final_stage_ex_gratia: matchedActs[0].final_stage_ex_gratia || '',
            });
            victimsReliefGroup.patchValue({
              reliefAmountScst:matchedActs[0].fir_stage_as_per_act || '',
              reliefAmountExGratia:matchedActs[0].fir_stage_ex_gratia || '',
              reliefAmountFirstStage: (
                (parseFloat(matchedActs[0].fir_stage_as_per_act) || 0) +
                (parseFloat(matchedActs[0].fir_stage_ex_gratia) || 0)
              ).toFixed(2),
              reliefAmountScst_1:matchedActs[0].chargesheet_stage_as_per_act || '',
              reliefAmountExGratia_1:matchedActs[0].chargesheet_stage_ex_gratia || '',
              reliefAmountSecondStage : (
                (parseFloat(matchedActs[0].chargesheet_stage_as_per_act) || 0) +
                (parseFloat(matchedActs[0].chargesheet_stage_ex_gratia) || 0)
              ).toFixed(2),
              reliefAmountScst_2:matchedActs[0].final_stage_as_per_act || '',
              reliefAmountExGratia_2:matchedActs[0].final_stage_ex_gratia || '',
              reliefAmountThirdStage : (
                (parseFloat(matchedActs[0].final_stage_as_per_act) || 0) +
                (parseFloat(matchedActs[0].final_stage_ex_gratia) || 0)
              ).toFixed(2),
            })
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



  deleteAccused(accusedId: any, UserId : any, number_of_accused : any, fir_id : any): Observable<any> {
    let body = {accusedId , UserId , number_of_accused, fir_id}
    return this.http.post(`${this.baseUrl}/deleteAccused`, body);
  }

  deleteVictim(victim_id: any, UserId : any, number_of_victim : any, fir_id : any): Observable<any> {
  let body = {victim_id , UserId , number_of_victim, fir_id}
  return this.http.post(`${this.baseUrl}/deleteVictim`, body);
}

AlterSave(firData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/AlterSave`, firData);
}
  
}
