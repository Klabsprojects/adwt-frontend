import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import Swal from 'sweetalert2';
import { AlteredCaseService } from 'src/app/services/altered-case.service';
import { FirService } from 'src/app/services/fir.service';

import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { catchError, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-altered-case',
  templateUrl: './altered-case.component.html',
  styleUrls: ['./altered-case.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    NgSelectModule
  ],
})
export class AlteredCaseComponent implements OnInit {
  
offenceOptions: any[] = [];
offenceOptionData:any[]=[];
firDetails : any;
fir_id : any;
// victims : FormArray
firForm: FormGroup;
victimNames: string[] = [];
Parsed_UserInfo : any;
victim_relif_section_values = ['Rape, etc., or unnatural Offences', 'Gang rape', 'Murder or Death','100 percent incapacitation','Where incapacitation is less than 100 percent, but more than 50 percent','Where incapacitation is less than 50 percent'];
  constructor(
    private fb: FormBuilder,
    private alteredCaseService: AlteredCaseService,
    private firService: FirService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
   const UserInfo: any = sessionStorage.getItem('user_data');
  this.Parsed_UserInfo = JSON.parse(UserInfo)
    
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
       this.initializeForm();
        this.loadOptions();
      const firId = params['fir_id']; 
      this.fir_id = firId;
       this.loadfirdetails(this.fir_id);
    });
  }

  get victims(): FormArray {
  return this.firForm.get('victims') as FormArray;
}
  get victims2(): FormArray {
  return this.firForm.get('victims2') as FormArray;
}

 initializeForm() {
   this.firForm = this.fb.group({
   victims2: this.fb.array([this.createVictimGroup2()]),
   victims: this.fb.array([this.createVictimGroup()])
   });
 }

   createVictimGroup(): FormGroup {
    return this.fb.group({
      victim_id: [''],
      victimName : [''],
      offenceCommitted: ['', Validators.required],
      scstSections:  ['', Validators.required],
      sectionDetails: this.fb.array([this.createSection()]),
    });
  }

  createVictimGroup2(): FormGroup {
    return this.fb.group({
      victim_id2: [''],
     victimName2 : [''],
      offenceCommitted2: ['', Validators.required],
      scstSections2:  ['', Validators.required],
      sectionDetails2: this.fb.array([this.createSection2()]),
    });
  }

  createSection2(): FormGroup {
    return this.fb.group({
      SectionType2: [''],
      Section2: ['']
    });
  }

    createSection(): FormGroup {
    return this.fb.group({
      SectionType: [''],
      Section: ['']
    });
  }
  getSectionDetails(victimIndex: number): FormArray {
    return this.victims.at(victimIndex).get('sectionDetails') as FormArray;
  }
  getSectionDetails2(victimIndex: number): FormArray {
    return this.victims2.at(victimIndex).get('sectionDetails2') as FormArray;
  }
  addSection2(victimIndex: number): void {
    const sectionDetails2 = this.getSectionDetails2(victimIndex);
    sectionDetails2.push(this.createSection2());
  }
  addSection(victimIndex: number): void {
    const sectionDetails = this.getSectionDetails(victimIndex);
    sectionDetails.push(this.createSection());
  }
  removeSection(victimIndex: number, sectionIndex: number): void {
    const sectionDetails = this.getSectionDetails(victimIndex);
    if (sectionDetails.length > 1) {
      sectionDetails.removeAt(sectionIndex);
    }
  }


    isActExcluded(act: string): boolean {
    const excluded = [
      '100 percent incapacitation',
      'Disability: Incapacitation greater than 50',
      'Disability: Incapacitation less than 50',
      'Rape',
      'Gang Rape',
      'Murder',
    ];
    return excluded.includes(act);
  }

  removeSelectedOffence(index: number, offenceName: string): void {
  const control = this.victims.at(index).get('offenceCommitted');
  const selected = control?.value || [];
  const updated = selected.filter((item: string) => item !== offenceName);

  control?.setValue(updated);
  control?.markAsDirty();
  control?.updateValueAndValidity();

  // Manually trigger the (change) handler
  this.onOffenceCommittedChange(index);
}


// onOffenceCommittedChange(index: number): void {
//   const victimGroup = this.victims.at(index) as FormGroup;

//   // Get the selected offence names (array of offence_name)
//   const selectedOffences: string[] = victimGroup.get('offenceCommitted')?.value || [];

//   // Filter the offence options that match selected offence names
//   const selectedActs = this.offenceOptions.filter((item: any) =>
//     selectedOffences.includes(item.offence_name)
//   );

//   // Get the offence_act_name of each matched item
//   const actNames = selectedActs.map(item => item.offence_act_name).filter(name => !!name);

//   // Patch scstSections with comma-separated act names
//   victimGroup.patchValue({
//     scstSections: actNames.join(', '),
//   });

//   this.cdr.detectChanges();
// }

  convertToNormalDate(isoDate: string): string {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits
    const month = date.toLocaleString('en-US', { month: 'short' }); // Get short month (Jan, Feb, etc.)
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Format as DD-MMM-YYYY
  }


  loadfirdetails(firId : any){
       this.firService.getFirDetails(firId).subscribe(
      (response) => {
        this.firDetails = response;
        if (this.firDetails && this.firDetails.data && this.firDetails.data.date_of_registration) {
          this.firDetails.data.date_of_registration = this.convertToNormalDate(this.firDetails.data.date_of_registration);
        }
        if (this.firDetails && this.firDetails.data && this.firDetails.data.date_of_occurrence) {
          this.firDetails.data.date_of_occurrence = this.convertToNormalDate(this.firDetails.data.date_of_occurrence);
        }

           if (response && response.data1 && response.data1.length > 0) {
              this.victimNames = response.data1.map((victim: any) => victim.victim_name);
              // Resetting the victims array in case of a previous value
              const victimsFormArray = this.firForm.get('victims') as FormArray;
              victimsFormArray.clear(); // Clear any existing victims data
              // console.log('arryresp',response.data1);
        
              response.data1.forEach((victim: any, index: number) => {
        
                const victimGroup = this.createVictimGroup();
                let offence_committed_data: any[] = [];
                let scst_sections_data: any[] = [];
        
                if (victim.offence_committed && this.isValidJSON(victim.offence_committed)) {
                  offence_committed_data = JSON.parse(victim.offence_committed);
                }
                if (victim.scst_sections && this.isValidJSON(victim.scst_sections)) {
                  scst_sections_data = JSON.parse(victim.scst_sections);
                }
            
                victimGroup.patchValue({
                  victim_id: victim.victim_id,
                  victimName : victim.victim_name,
                  offenceCommitted: offence_committed_data,
                  scstSections: scst_sections_data,
                  sectionsIPC: victim.sectionsIPC
                });
        
                victimsFormArray.push(victimGroup);
        
              });
        
              response.data1.forEach((victim: any, index: number) => {
        
              const sectionsArray = JSON.parse(victim.sectionsIPC_JSON);
        
              // Get the form array for the specific victim index (assuming index 0 for example)
              const victimIndex = index; // Adjust this based on your logic
              const sectionDetails = this.getSectionDetails(victimIndex);
        
              // Clear existing form array
              while (sectionDetails.length !== 0) {
                sectionDetails.removeAt(0);
              }
        
              // Populate form array with parsed data
              sectionsArray.forEach((section: any) => {
                sectionDetails.push(this.fb.group({
                  SectionType: [section.SectionType || ''],
                  Section: [section.Section || '']
                }));
              });   
               
              });
            }


             if (response && response.data1 && response.data1.length > 0) {
              // Resetting the victims array in case of a previous value
              const victimsFormArray = this.firForm.get('victims2') as FormArray;
              victimsFormArray.clear(); // Clear any existing victims data
              // console.log('arryresp',response.data1);
        
              response.data1.forEach((victim: any, index: number) => {
        
                const victimGroup = this.createVictimGroup2();
                let offence_committed_data: any[] = [];
                let scst_sections_data: any[] = [];
        
                if (victim.offence_committed && this.isValidJSON(victim.offence_committed)) {
                  offence_committed_data = JSON.parse(victim.offence_committed);
                }
                if (victim.scst_sections && this.isValidJSON(victim.scst_sections)) {
                  scst_sections_data = JSON.parse(victim.scst_sections);
                }
            
                victimGroup.patchValue({
                  victim_id2: victim.victim_id,
                  victimName2 : victim.victim_name,
                  offenceCommitted2: offence_committed_data,
                  scstSections2: scst_sections_data,
                  sectionsIPC2: victim.sectionsIPC
                });
        
                victimsFormArray.push(victimGroup);
        
              });
        
              response.data1.forEach((victim: any, index: number) => {
        
              const sectionsArray2 = JSON.parse(victim.sectionsIPC_JSON);
        
              // Get the form array for the specific victim index (assuming index 0 for example)
              const victimIndex = index; // Adjust this based on your logic
              const sectionDetails2 = this.getSectionDetails2(victimIndex);
        
              // Clear existing form array
              while (sectionDetails2.length !== 0) {
                sectionDetails2.removeAt(0);
              }
        
              // Populate form array with parsed data
              sectionsArray2.forEach((section: any) => {
                sectionDetails2.push(this.fb.group({
                  SectionType2: [section.SectionType || ''],
                  Section2: [section.Section || '']
                }));
              });   
               
              });
            }



      },
      (error) => {
        console.log(error)
      }
    )};

isValidJSON(str : any) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }


onOffenceCommittedChange(index: number): void {
  const victimGroup = this.victims.at(index) as FormGroup;
  const selectedOffences: string[] = victimGroup.get('offenceCommitted')?.value || [];
  
  const selectedActs = this.offenceOptions.filter((item: any) =>
    selectedOffences.includes(item.offence_name)
  );
  
  const actNames = selectedActs.map(item => item.offence_act_name).filter(name => !!name);
  
  victimGroup.patchValue({
    scstSections: actNames.join(', '),
  });
  
  // Remove this line unless you have specific issues
  // this.cdr.detectChanges();
}



  loadOptions() {
    this.firService.getOffences().subscribe(
      (offences: any) => {
        // console.log(offences);
        this.offenceOptions = offences
          // .filter((offence: any) => offence.offence_act_name !== '3(2)(va)' && offence.offence_act_name !== '3(2)(v) , 3(2)(va)');
          // this.offenceOptions.push(
          //   { offence_act_name: '3(2)(va)', offence_name: '3(2)(va)', id : 24 },
          // );
          this.offenceOptionData = offences.map((offence: any) => offence);
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load offence options.', 'error');
      }
    );
  }



  AlterSave(){

    const victimsArray = this.firForm.get('victims') as FormArray;
    const victims = [];
  
      // Loop through each victim and add to the array
      for (let i = 0; i < victimsArray.length; i++) {
        const victimControl = victimsArray.at(i);
        const victim = victimControl.value;
        
        victims.push({
          victim_id: victim.victim_id || null,
          offenceCommitted: victim.offenceCommitted || [],
          scstSections: victim.scstSections || [],
          sectionDetails: victim.sectionDetails || [],
          relief_applicable: (victim.offenceCommitted || []).some((offence : any) => this.victim_relif_section_values.includes(offence)) ? 1 : 0
        });
      }

        const firData = {
        firId: this.fir_id,
        victims: victims,
        user_id: this.Parsed_UserInfo.id
      };

      this.firService.AlterSave(firData).subscribe(
        (response: any) => {
  
          Swal.fire('Success', 'Informations saved Successfully.', 'success')
          .then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error saving details:', error);
          Swal.fire('Error', 'Failed to save Informations.', 'error');
        }
      );
  }


getVictimIndices(): number[] {
  const victimsLength = this.victims.length;
  const victims2Length = this.victims2.length;
  const maxLength = Math.max(victimsLength, victims2Length);
  
  return Array.from({ length: maxLength }, (_, index) => index);
}

}
