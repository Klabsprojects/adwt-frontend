import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, TemplateRef, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationStart, RouterEvent } from '@angular/router';
// import { FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';
import { VmcMeetingService } from 'src/app/services/vmc-meeting.service';
// import {
//   FormsModule,
//   ReactiveFormsModule,
//   FormBuilder,
//   FormGroup,
//   Validators,
//   FormArray,

// } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FirService } from 'src/app/services/fir.service';

import Swal from 'sweetalert2';
import { MatRadioModule } from '@angular/material/radio';
import Tagify from '@yaireo/tagify';
declare var $: any;


import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PoliceDivisionService } from 'src/app/services/police-division.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../../../environments/environment';
import { environment as env } from 'src/environments/environment.prod';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-fir',
  templateUrl: './add-fir.component.html',
  styleUrls: ['./add-fir.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    NgxFileDropModule,
    NgSelectModule
  ],
})
export class AddFirComponent implements OnInit, OnDestroy {

  private fileStorage: { [key: number]: File[] } = {};

  selectedFile: File | null = null;

 
  victimChangeSubscription: any;
  complainantChangeSubscription: Subscription | undefined;
  remainingCharacters: number[] = [];
  showOtherGender: boolean[] = [];
  mainStep: number = 1;
  step: number = 1;
  firForm: FormGroup;
  firId: string | null = null;
  userId: string = '';
  loading: boolean = false;
  yearOptions: number[] = [];
  today: string = '';
  nextButtonDisabled: boolean = true;
  victimNames: string[] = [];
  nextButtonClicked: boolean = false; // Track if 'Next' was clicked
  tabNavigation: boolean = false; // Track if main tab is clicked
  numberOfVictims: number = 0;
  scstDetails: any = null;
  showJudgementCopy: boolean = false;
  showLegalOpinionObtained: boolean = false;
  showCaseFitForAppeal: boolean = false;
  showGovernmentApproval: boolean = false;
  showFiledBy: boolean = false;
  showDesignatedCourt: boolean = false;
  courtDivisions: string[] = [];
  courtRanges: string[] = [];
  proceedingsFile: File | null = null;
  proceedingsFile_1: any | null = null;
  showDuplicateSection_1: boolean = false;
  showLegalOpinionObtained_two: boolean = false;
  showFiledBy_two: boolean = false;
  showDesignatedCourt_two: boolean = false;
  showCaseFitForAppeal_two: boolean = false;
  showOtherVictimGender: boolean[] = [];
  hideCompensationSection: boolean = false;
  accusedCommunitiesOptions: string[] = []; // Stores all accused community options
  natureOfOffenceOptions: string[] = [];
  scstSectionsOptions: string[] = [];
  showSubCaste = true;
  showSubCasteText = false;
  showDuplicateSection = false; // To show/hide the duplicate form section
  showLegalOpinionObtained_one = false;
  showFiledBy_one = false;
  showDesignatedCourt_one = false;
  showCaseFitForAppeal_one = false;
  imagePreviews: any[] = [];
  isFileOver: boolean = false;
  communitiesOptions: string[] = [];
  isSticky: boolean = false;
  additionalReliefOptions = [
    { value: 'Pension', label: 'Pension' },
    { value: 'Employment / Job', label: 'Employment / Job' },
    { value: 'Education concession', label: 'Education concession' },
    { value: 'Provisions', label: 'Provisions' },
    { value: 'House site Patta', label: 'House site Patta' }
  ];

  // Tabs for step navigation
  tabs = [
    { label: 'Basic Information' },
    { label: 'Offence Information' },
    { label: 'Victim Information' },
    { label: 'Accused Information' },
    { label: 'FIR Stage(MRF) Details' },
  ];
  showOtherDesignation = false;
  otherDesignation: string = "";
  showRelief = false;
  CaseHandledBy = [
    'Special Public Prosecutor',
    'Empanelled advocate',
    'Private advocate selected by the victim'
  ];


  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const element = document.getElementById('sticky-tabs');
    if (element) {
      this.isSticky = window.scrollY > element.offsetTop;
    }
  }

  @ViewChild('tagifyInput', { static: false }) tagifyInput!: ElementRef;
  sectionsIPC: string[] = []; // Array to store multiple tags

  image_access = environment.image_access;

  // Dropdown options
  policeCities: string[] = [];
  policeZones: string[] = [];
  policeRanges: any[] = [];
  revenueDistricts: any[] = [];
  offenceOptions: any[] = [];
  offenceActsOptions: { offence_act_name: string; [key: string]: any }[] = [];
  courtDistricts: string[] = [];
  offenceReliefDetails: any[] = []; 
  alphabetList: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  stationNumbers: number[] = Array.from({ length: 99 }, (_, k) => k + 1);
  firNumberOptions: number[] = Array.from({ length: 99 }, (_, k) => k + 1);
  selectedAdditionalReliefs: string[] = [];
  policeStations: string[] = [];
  victimCountArray: number[] = [];
  show94BAnd94C = false;
  show95Onwards = false;
  show97Onwards = false;
i: number;
isStepOneModified = false;
isStepTwoModified = false; 
isStepThreeModified = false;
sectionFields: string[] = [''];
  constructor(
    private fb: FormBuilder,
    private firService: FirService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private policeDivisionService :PoliceDivisionService,
    private vmcSerive:VmcMeetingService
  ) {}
  private wasVictimSame: boolean = false; // Track the previous state of on Victim same as Complainant


  triggerChangeDetection() {
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    this.generateVictimCount();
    this.clearSession();
    //console.log('Session cleared on component initialization');
    this.initializeForm();
    this.trackStepOneChanges();
    this.trackStepTwoChanges();
    this.trackStepThreeChanges();
    this.firId = this.getFirIdFromSession(); // Get FIR ID from session storage
    this.loadOptions();
    // this.loadOffenceActs();
    this.loadAccusedCommunities();
    // this.loadScstSections();
    this.generateYearOptions();
    this.loadnativedistrict();
    //this.loadCourtDistricts();
    this.loadCourtDivisions();
    this.loadCommunities();
    this.loadDistricts();
    this.updateValidationForCaseType();
    this.loadAllOffenceReliefDetails();

    // Listen for input changes and trigger UI update
    this.firForm.valueChanges.subscribe(() => {
      this.cdr.detectChanges(); // Manually trigger UI update
    });

    const preFilledDistrict = this.firForm.get('policeCity')?.value; // Get pre-filled district
    if (preFilledDistrict) {
      this.loadPoliceStations(preFilledDistrict); // Load stations for the pre-filled district
    }

    // Watch for district changes and reload stations dynamically
    this.firForm.get('policeCity')?.valueChanges.subscribe((district) => {
      this.loadPoliceStations(district);
    });

    // this.loadVictimsDetails();

    this.firForm.get('caseType')?.valueChanges.subscribe(() => {
       this.handleCaseTypeChange();
    });

    // Listen for route changes
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        this.clearSession();
      }
    });

    this.userId = sessionStorage.getItem('userId') || '';
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];
    if (this.userId) {
      this.loadUserData();
    }
    this.ngAfterViewInit();
    this.trackStep1FormValidity();
    this.firForm.statusChanges.subscribe(() => {
      if (!this.tabNavigation) {
        // Only validate when not navigating tabs
        this.nextButtonDisabled = !this.isStepValid();
        this.cdr.detectChanges();
      }
    });

this.loadPoliceDivision();


  this.firForm.get('complainantDetails.isVictimSameAsComplainant')?.valueChanges.subscribe(isVictimSame => {
    const isSame = isVictimSame === 'true';
    this.onVictimSameAsComplainantChange(isSame);
    this.wasVictimSame = isSame;
    this.updateAllVictims();
  });
  
  ['nameOfComplainant', 'mobileNumberOfComplainant'].forEach(field => {
    this.firForm.get(`complainantDetails.${field}`)?.valueChanges.subscribe(value => {
      this.updateAllVictims();
    });
  });
  this.firForm.get('antecedentsOption')?.valueChanges.subscribe(value => {
    this.updateAntecedentsValidation(value);
  });
  }

  updateAntecedentsValidation(value: string): void {
    const antecedentsControl = this.firForm.get('antecedents');
    if (value === 'Yes') {
      antecedentsControl?.setValidators([Validators.required]);
    } else {
      antecedentsControl?.setValidators([]);
    }
    antecedentsControl?.updateValueAndValidity();
  }

  updateAllVictims() {
    const isVictimSame = this.firForm.get('complainantDetails.isVictimSameAsComplainant')?.value === 'true';
    const complainantDetails = this.firForm.get('complainantDetails')?.value || {};
    const victimsArray = this.firForm.get('victims') as FormArray;
  
    victimsArray.controls.forEach((victimGroup: AbstractControl) => {
      victimGroup.patchValue({
        name: isVictimSame ? complainantDetails.nameOfComplainant : victimGroup.get('name')?.value,
        mobileNumber: isVictimSame ? complainantDetails.mobileNumberOfComplainant : victimGroup.get('mobileNumber')?.value
      }, { emitEvent: false });
  
     
      if (isVictimSame) {
        victimGroup.get('name')?.disable({ emitEvent: false });
        victimGroup.get('mobileNumber')?.disable({ emitEvent: false });
      } else {
        victimGroup.get('name')?.enable({ emitEvent: false });
        victimGroup.get('mobileNumber')?.enable({ emitEvent: false });
      }
    });
  }
  
  
  // Handles the change in victim status relative to the complainant and updates the form accordingly.
  onVictimSameAsComplainantChange(isVictimSame: boolean) {
    this.firService.onVictimSameAsComplainantChange(isVictimSame, this.firForm, this.wasVictimSame);
    this.wasVictimSame = isVictimSame; // Update the previous state
  }

  navigateToMainStep(stepNumber: number): void {
    this.mainStep = stepNumber; // Update mainStep
    this.step = 1; // Reset sub-step to 1 when switching main steps
    this.cdr.detectChanges(); // Trigger UI update
}


  generateVictimCount(): void {
    this.victimCountArray = Array.from({ length: 50 }, (_, i) => i + 1);
}

loadCommunities(): void {
  this.firService.getAllCommunities().subscribe(
    (communities: string[]) => {
      this.communitiesOptions = communities; // Populate community options
    },
    (error) => {
      console.error('Error loading communities:', error);
      Swal.fire('Error', 'Failed to load communities.', 'error');
    }
  );
}

onCommunityChange(selectedCommunity: any, index: number): void {
  if (selectedCommunity) {
    this.firService.getCastesByCommunity(selectedCommunity).subscribe(
      (castes: string[]) => {
        const victimGroup = this.victims.at(index) as FormGroup;
        victimGroup.patchValue({ caste: '' }); 
        victimGroup.get('availableCastes')?.setValue(castes); 
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching castes:', error);
        Swal.fire('Error', 'Failed to load castes for the selected community.', 'error');
      }
    );
  }
}


loadDistricts(): void {
  this.firService.getDistricts().subscribe(
    (districts: string[]) => {
      this.courtDistricts = districts; // Populate district options
    },
    (error) => {
      console.error('Error loading districts:', error);
      Swal.fire('Error', 'Failed to load district details.', 'error');
    }
  );
}
loadAccusedCommunities(): void {
  this.firService.getAllAccusedCommunities().subscribe(
    (communities: string[]) => {
      this.accusedCommunitiesOptions = communities; 
      this.accusedCommunitiesOptions.push('General','Others');
      
      // Populate accused community options
    },
    (error) => {
      console.error('Error loading accused communities:', error);
      Swal.fire('Error', 'Failed to load accused communities.', 'error');
    }
  );
}
antecedents: { [key: number]: string } = {};

onInputChange(index: number, event: Event) {
  const inputValue = (event.target as HTMLInputElement).value.trim();
  this.antecedents[index] = inputValue; 
}

landOIssues: { [key: number]: string } = {};

onInputChangeee(index: number, event: Event) {
  const inputValue = (event.target as HTMLInputElement).value.trim();
  this.landOIssues[index] = inputValue; 
}


onAccusedCommunityChange(event: any, index: number): void {
  const selectedCommunity = event;
  console.log(selectedCommunity);
  if(selectedCommunity == "General" || selectedCommunity == "Others"){
    this.showSubCaste = false;
    this.showSubCasteText = true;
  }
  else{
    this.showSubCaste = true;
    this.showSubCasteText = false;
  }
  if (selectedCommunity) {
    this.firService.getAccusedCastesByCommunity(selectedCommunity).subscribe(
      (castes: string[]) => {
        const accusedGroup = this.accuseds.at(index) as FormGroup;
        accusedGroup.patchValue({ caste: '' }); // Reset caste selection
        accusedGroup.get('availableCastes')?.setValue(castes);
        // console.log(accusedGroup.get('availableCastes')?.value,"datdadadadada"); 
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching accused castes:', error);
        Swal.fire('Error', 'Failed to load castes for the selected accused community.', 'error');
      }
    );
  }
}

loadCourtDivisions(): void {
  this.firService.getCourtDivisions().subscribe(
    (divisions: string[]) => {
      this.courtDivisions = divisions.sort((a, b) => a.localeCompare(b));// Populate court division options
    },
    (error) => {
      console.error('Error loading court divisions:', error);
      Swal.fire('Error', 'Failed to load court divisions.', 'error');
    }
  );
}

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: any): void {
    this.clearSession();
  }

  getFirIdFromSession(): string | null {
    return sessionStorage.getItem('firId');
  }

  onCourtDivisionChange(event: any): void {
    const selectedDivision = event;

    if (selectedDivision) {
      this.firService.getCourtRangesByDivision(selectedDivision).subscribe(
        (ranges: string[]) => {
          this.courtRanges = ranges; // Populate court range options based on division
          this.firForm.patchValue({ courtRange: '' }); // Reset court range selection
        },
        (error) => {
          console.error('Error fetching court ranges:', error);
          Swal.fire('Error', 'Failed to load court ranges for the selected division.', 'error');
        }
      );
    }
  }

// Dynamically adjust validators based on caseType
updateValidationForCaseType() {
  const caseType = this.firForm.get('caseType')?.value;

  if (caseType === 'chargeSheet') {
    this.firForm.get('proceedingsFileNo_1')?.setValidators([Validators.required]);
    this.firForm.get('proceedingsDate_1')?.setValidators([Validators.required]);
    this.firForm.get('uploadProceedings_1')?.setValidators([Validators.required]);
    this.firForm.get('attachments_1')?.setValidators([Validators.required]);
    this.firForm.get('chargeSheetDate')?.setValidators([Validators.required]);
    // Disable RCS specific fields if it's a chargeSheet
    this.firForm.get('rcsFileNumber')?.clearValidators();
    this.firForm.get('rcsFilingDate')?.clearValidators();
    this.firForm.get('mfCopy')?.clearValidators();
  } else if (caseType === 'referredChargeSheet') {
    // Clear required validators for chargeSheet fields
    this.firForm.get('proceedingsFileNo_1')?.clearValidators();
    this.firForm.get('proceedingsDate_1')?.clearValidators();
    this.firForm.get('uploadProceedings_1')?.clearValidators();
    this.firForm.get('attachments_1')?.clearValidators();
    this.firForm.get('chargeSheetDate')?.clearValidators();
    // Add required validators for RCS fields
    this.firForm.get('rcsFileNumber')?.setValidators([Validators.required]);
    this.firForm.get('rcsFilingDate')?.setValidators([Validators.required]);
    this.firForm.get('mfCopy')?.setValidators([Validators.required]);
  }

  // Update the form controls after changing validators
  this.firForm.get('proceedingsFileNo_1')?.updateValueAndValidity();
  this.firForm.get('proceedingsDate_1')?.updateValueAndValidity();
  this.firForm.get('uploadProceedings_1')?.updateValueAndValidity();
  this.firForm.get('attachments_1')?.updateValueAndValidity();
  this.firForm.get('rcsFileNumber')?.updateValueAndValidity();
  this.firForm.get('rcsFilingDate')?.updateValueAndValidity();
  this.firForm.get('chargeSheetDate')?.updateValueAndValidity();
  this.firForm.get('mfCopy')?.updateValueAndValidity();
}

loadAllOffenceReliefDetails(): void {
  this.firService.getOffenceReliefDetails().subscribe(
    (offence_relief: any[]) => {
      this.offenceReliefDetails = offence_relief; // Store data
      console.log('Offence Relief Details:', this.offenceReliefDetails);
    },
    (error) => {
      console.error('Error loading districts:', error);
      Swal.fire('Error', 'Failed to load offence relief details.', 'error');
    }
  );
}

// Calls firService to update victim details based on selected offences
onOffenceCommittedChange(event: any, index: number): void {
  // const selectedOffences = event.value; // Get selected values from the 30th field
  let selectedOffences: string[] = [];

  // If the items are objects, extract the offence_name
  if (Array.isArray(event) && event.length && typeof event[0] === 'object') {
    selectedOffences = event.map((item: any) => item.offence_name);
  } else {
    // If already strings, use as is
    selectedOffences = event;
  }
  console.log(this.victimsRelief);
  // const getId = selectedOffences.map((ele:any)=>ele.id);
  const getId = this.offenceOptions
    .filter(option => selectedOffences.includes(option.offence_name))
    .map(option => option.id);
  this.firService.onOffenceCommittedChange(
    selectedOffences,
    index,
    this.offenceReliefDetails,
    this.victims,
    this.victimsRelief,
    getId
  );
  selectedOffences.forEach((ele:any) => {
    const selectedValue = ele.trim(); 
    const validValues = ['Rape, etc., or unnatural Offences', 'Gang rape', 'Murder or Death'];
  
  if (validValues.includes(selectedValue)) {
    this.showRelief = true;
  }
  else{
    this.showRelief = false;
  }
  });
  this.cdr.detectChanges();
  this.cdr.detectChanges();
}

onCaseTypeChange() {
  this.updateValidationForCaseType(); // Update validations whenever caseType is changed
}


  clearSession(): void {
    //console.log('Clearing session data for FIR and officer IDs');
    sessionStorage.removeItem('firId');
    sessionStorage.removeItem('officerIds');
  }

  ngOnDestroy(): void {
    this.clearSession();
  }


  checkFormValidity() {
    // Enable the "Next" button only if the form is valid and it's Step 1
    this.nextButtonDisabled = !(this.firForm.valid && this.step === 1);
    this.cdr.detectChanges(); // Trigger change detection
  }







  // Save Step 1 and track officer IDs after the first save
  saveStepOneAsDraft() {
    this.firForm.enable();
    const firData = {
      ...this.firForm.value,
    };
    this.firService.handleStepOne(this.firId, firData).subscribe(
      (response: any) => {
        this.firId = response.fir_id;
        if (this.firId) {
          sessionStorage.setItem('firId', this.firId);
        }
        Swal.fire('Success', 'FIR saved as draft for step 1.', 'success');
      },
      (error) => {
        Swal.fire('Error', 'Failed to save FIR as draft for step 1.', 'error');
      }
    );
  }

// Method to save step 2 as draft
saveStepTwoAsDraft() {
  const firData = {
    firNumber: this.firForm.value.firNumber,
    firNumberSuffix: this.firForm.value.firNumberSuffix,
    dateOfOccurrence: this.firForm.value.dateOfOccurrence,
    date_of_occurrence_to: this.firForm.value.date_of_occurrence_to,
    timeOfOccurrence: this.firForm.value.timeOfOccurrence,
    time_of_occurrence_to: this.firForm.value.time_of_occurrence_to,
    placeOfOccurrence: this.firForm.value.placeOfOccurrence,
    dateOfRegistration: this.firForm.value.dateOfRegistration,
    is_case_altered: this.firForm.value.is_case_altered,
    altered_date: this.firForm.value.altered_date,
    timeOfRegistration: this.firForm.value.timeOfRegistration,

  };

  this.firService.handleStepTwo(this.firId, firData).subscribe(
    (response: any) => {
      this.firId = response.fir_id; // Update FIR ID from backend response
      if (this.firId) {
        sessionStorage.setItem('firId', this.firId); // Save FIR ID in session
      }
      Swal.fire('Success', 'FIR saved as draft for step 2.', 'success');
    },
    (error) => {
      Swal.fire('Error', 'Failed to save FIR as draft for step 2.', 'error');
    }
  );
}

ngAfterViewInit(): void {
  setTimeout(() => {
    if (this.tagifyInput && this.tagifyInput.nativeElement) {
      $(this.tagifyInput.nativeElement).tagsinput({
        maxTags: 10,
        trimValue: true,
      });

      // Listen to the 'itemAdded' and 'itemRemoved' events for sectionsIPC
      $(this.tagifyInput.nativeElement).on('itemAdded', (event: any) => {
        this.sectionsIPC.push(event.item);
        this.updateSectionsIPCControl();
      });

      $(this.tagifyInput.nativeElement).on('itemRemoved', (event: any) => {
        this.sectionsIPC = this.sectionsIPC.filter(tag => tag !== event.item);
        this.updateSectionsIPCControl();
      });
    }
  }, 0);
}

// Update the form control for sectionsIPC
updateSectionsIPCControl(): void {
  this.firForm.get('sectionsIPC')?.setValue(this.sectionsIPC.join(', '));
}



onFileSelect_3(event: Event, controlName: string): void {
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (files && files.length > 0) {
    this.firForm.get(controlName)?.setValue(files[0]);
  } else {
    this.firForm.get(controlName)?.setValue(null);
  }
}




  // Handle file selection
  onFileSelect(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const attachmentGroup = this.attachments.at(index) as FormGroup;

      const simulatedFilePath = `/uploads/${file.name}`;

    
      attachmentGroup.patchValue({
        fileName: file.name,
        filePath: simulatedFilePath, 
      });

      this.cdr.detectChanges();
    }
  }



  // onVictimAgeChange(index: number): void {
  //   const victimGroup = this.victims.at(index) as FormGroup;
  //   const ageControl = victimGroup.get('age');
  //   const nameControl = victimGroup.get('name');

  //   if (ageControl) {
  //     const ageValue = ageControl.value;

  //     // If age is below 18, disable the name field
  //     if (ageValue < 18) {
  //       nameControl?.disable({ emitEvent: false });
  //       nameControl?.reset();
  //     } else {
  //       nameControl?.enable({ emitEvent: false });
  //     }

  //     this.cdr.detectChanges(); // Trigger change detection
  //   }
  // }


  onVictimAgeChange(index: number): void {
    const victimGroup = this.victims.at(index) as FormGroup;
    const ageControl = victimGroup.get('age');
    const nameControl = victimGroup.get('name');

    if (ageControl) {
      let ageValue = ageControl.value || ''; // Ensure it's always a string

      // Remove any non-numeric characters
      ageValue = ageValue.toString().replace(/\D/g, '');

      // If input exceeds 3 digits, reset it
      if (ageValue.length > 3) {
          ageControl.setValue('');
      } else {
          ageControl.setValue(ageValue);
        }
      // If age is below 18, disable the name field
      if (ageValue < 18) {
        nameControl?.disable({ emitEvent: false });
        nameControl?.setValue('Minor', { emitEvent: false });
      } else {
        nameControl?.enable({ emitEvent: false });
        if (nameControl?.value === 'Minor') {
          nameControl.setValue('', { emitEvent: false });
        }
        if(index===0){
          this.onVictimSameAsComplainantChange(this.wasVictimSame);
          this.wasVictimSame && nameControl?.disable({ emitEvent: false });
        }
      }

      this.cdr.detectChanges(); // Trigger change detection
    }
  }
  getAgeErrorMessage(index: number): string {
    const ageControl = this.victims.at(index).get('age');
  
    if (ageControl?.hasError('required')) {
      return 'Age is required.';
    }
    if (ageControl?.hasError('min')) {
      return 'Age must be at least 1.';
    }
    // if (ageControl?.hasError('max')) {
    //   return 'Age cannot exceed 120.';
    // }
    // if (ageControl?.hasError('invalidAge')) {
    //   return 'Invalid age format. Only numbers between 1 and 120 are allowed.';
    // }
    return '';
  }
  
  loadPoliceStations(district: string): void {
    if (district) {
      this.firService.getPoliceStations(district).subscribe(
        (stations: string[]) => {
          this.policeStations = stations.map(station =>
            station.replace(/\s+/g, '-')); // Replace spaces with "-"
          // this.firForm.get('stationName')?.setValue(''); // Reset selected station if district changes
          this.cdr.detectChanges(); // Trigger UI update
        },
        (error) => {
          console.error('Error fetching police stations:', error);
        }
      );
    }
  }



  onAccusedAgeChange(index: number): void {
    const accusedGroup = this.accuseds.at(index) as FormGroup;
    const ageControl = accusedGroup.get('age');
    const nameControl = accusedGroup.get('name');

    if (ageControl) {
      let ageValue = ageControl.value || ''; // Ensure it's always a string

      // Remove any non-numeric characters
      ageValue = ageValue.toString().replace(/\D/g, '');

      // If input exceeds 3 digits, reset it
      if (ageValue.length > 3) {
          ageControl.setValue('');
      } else {
          ageControl.setValue(ageValue);
        }// Update the age value in the form group

      // If age is below 18, disable the name field
      if (ageValue < 18) {
        nameControl?.disable({ emitEvent: false });
        nameControl?.reset();
      } else {
        nameControl?.enable({ emitEvent: false });
      }

      this.cdr.detectChanges(); // Trigger change detection
    }
  }



  initializeForm() {
    this.firForm = this.fb.group({
      // Step 1 Fields - Police Location Details
      policeCity: ['', Validators.required],
      policeZone: ['', Validators.required],
      policeRange: ['', Validators.required],
      revenueDistrict: ['', Validators.required],
      //alphabetSelection: ['', Validators.required],
      //stationNumber: ['', Validators.required],
      stationName: ['', Validators.required],
      officerName: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]], // Name validation
      complaintReceivedType:[''],
      complaintRegisteredBy:[''],
      complaintReceiverName:[''],
      officerDesignation: ['', Validators.required], // Dropdown selection
      officerPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // 10-digit phone validation

      attachments_1: this.fb.array([this.createNewAttachmentGroup()]),
      attachments_2: this.fb.array([this.createAttachmentGroup()]),
      // Step 2 Fields - FIR Details
      // firNumber: ['', Validators.required],
      firNumber: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]], 
      firNumberSuffix: ['', Validators.required],
      dateOfOccurrence: ['', [Validators.required, this.maxDateValidator()]],
      date_of_occurrence_to: ['', [Validators.required, this.maxDateValidator()]],
      timeOfOccurrence: ['', Validators.required],
      time_of_occurrence_to:[''],
      placeOfOccurrence: ['', Validators.required],
      dateOfRegistration: ['', Validators.required],
      is_case_altered: [''],
      altered_date: [''],
      timeOfRegistration: ['', Validators.required],


      scstSections: [[], Validators.required],



      // Step 3 Fields - Complainant and Victim Details
      complainantDetails: this.fb.group({
        nameOfComplainant: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]],
        mobileNumberOfComplainant: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        isVictimSameAsComplainant: [false],
        numberOfVictims: [1, Validators.required],
      }),
      victims: this.fb.array([this.createVictimGroup()]),
      isDeceased: ['', Validators.required],
      deceasedPersonNames: [[]],

      // Step 4 Fields - Accused Details
      numberOfAccused: [1, Validators.required],
      accuseds: this.fb.array([]),
      uploadFIRCopy: ['', Validators.required],

      // Step 5 Fields - Victim Relief and Compensation Details
      victimsRelief: this.fb.array([this.createVictimReliefGroup()]),

      reliefAmountScst: ['', Validators.required],
      reliefAmountExGratia: ['', Validators.required],
      reliefAmountFirstStage: ['', Validators.required],
      //reliefAmountSecondStage: ['', Validators.required],
      totalCompensation: ['', Validators.required],
      additionalRelief: [[]],

      totalCompensation_1: [''], // Example control
      proceedingsFileNo_1: [''], // Example control
      proceedingsDate_1: [''], // Example control
      uploadProceedings_1: [''], // Example control

      totalCompensation_2: [''], // Example control
      proceedingsFileNo_2: [''], // Example control
      proceedingsDate_2: [''], // Example control
      uploadProceedings_2: [''], // Example control

      // Charge Sheet Details
      chargeSheetFiled: ['', Validators.required],
      courtDistrict: ['', Validators.required],
      courtName: ['', Validators.required],
      caseType: ['', Validators.required], // Charge Sheet or Referred Charge Sheet
      caseNumber: [{ value: '', disabled: true }], // Dynamic field for Charge Sheet
      chargeSheetDate:[{ value: '', disabled: true }],
      rcsFileNumber: [{ value: '', disabled: true }], // Dynamic field for RCS
      rcsFilingDate: [{ value: '', disabled: true }], // Dynamic field for RCS
      mfCopy: [{ value: '', disabled: true }], // File upload field for RCS



      // Step 6 Fields - Case Trial and Court Details
      Court_name: ['', Validators.required],
      trialCourtDistrict: ['', Validators.required],
      trialCaseNumber: ['', Validators.required],
      publicProsecutor: ['', Validators.required],
      prosecutorPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

      firstHearingDate: ['', Validators.required],
      judgementAwarded: ['', Validators.required],
      judgementAwarded1: ['', Validators.required],
      judgementAwarded2: ['', Validators.required],
      judgementAwarded3: ['', Validators.required],


      judgementDetails: this.fb.group({
        judgementNature: ['', Validators.required],
        Conviction_Type : [''],
        uploadJudgement: [''],
        legalOpinionObtained: [''],
        caseFitForAppeal: [''],
        governmentApprovalForAppeal: [''],
        filedBy: [''],
        designatedCourt: [''],

      }),

      // New fields for the duplicated form

    courtDistrict_one: ['', Validators.required],
    caseNumber_one: ['', Validators.required],
    publicProsecutor_one: ['', Validators.required],
    prosecutorPhone_one: ['', Validators.required],
    firstHearingDate_one: ['', Validators.required],
    Court_one: ['', Validators.required],


    courtDistrict_two: ['', Validators.required],
    caseNumber_two: ['', Validators.required],
    publicProsecutor_two: ['', Validators.required],
    prosecutorPhone_two: ['', Validators.required],
    firstHearingDate_two: ['', Validators.required],



     // Top-level control
      judgementAwarded_one: ['', Validators.required],
      judgementDetails_one: this.fb.group({
      judgementNature_one: ['', Validators.required],
      Conviction_Type_one : [''],
      uploadJudgement_one: [''],
      legalOpinionObtained_one: [''],
      caseFitForAppeal_one: [''],
      filedBy_one: [''],

      designatedCourt_one: [''],
      prosecutorPhone_one: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      firstHearingDate_one: ['', Validators.required],
      governmentApprovalForAppeal_one:['', Validators.required],
    }),
    Court_three:[''],
    judgementAwarded_two: ['', Validators.required],
    judgementDetails_two: this.fb.group({
      judgementNature_two: [''],
      Conviction_Type_two : [''],
      uploadJudgement_two: [''],
      legalOpinionObtained_two: [''],
      caseFitForAppeal_two: [''],
      governmentApprovalForAppeal_two: [''],
      filedBy_two: [''],





    }),


    hearingDetails: this.fb.array([this.createHearingDetailGroup()]),
    hearingDetails_one: this.fb.array([this.createHearingDetailGroup_one()]),
    hearingDetails_two: this.fb.array([this.createHearingDetailGroup_two()]),


      // Victim Relief - 3rd Stage
      reliefAmountThirdStage: ['', Validators.required],
      totalCompensationThirdStage: ['', Validators.required],

      // Proceedings and Attachments
      proceedingsFileNo: ['', Validators.required],
      proceedingsFile: ['', Validators.required],
      proceedingsDate: ['', Validators.required],
      uploadProceedings: ['', Validators.required],
      // attachments: this.fb.array([]) 

      attachments: this.fb.array([this.createNewAttachmentGroup()]),
    },
    { validators: this.dateTimeValidator() }

  );

  this.firForm.get('is_case_altered')?.setValue('No');



    // Other setup functions
    this.trackStep1FormValidity();
    this.onNumberOfVictimsChange();
    this.onNumberOfAccusedChange();
    this.populateVictimsRelief([]); // Pass an empty array if there are no details
    this.handleCaseTypeChange();


  }


  validateFirNumber(event: KeyboardEvent) {
    const char = event.key;
    const inputValue = (event.target as HTMLInputElement).value;
  
   
    if (!/^\d$/.test(char) || (inputValue.length === 0 && char === '0')) {
      event.preventDefault();
    }
  }
  

  // Validates the FIR Number values using the firValidationService.
  isFirValid(fir: string, suffix: string): boolean {
    return this.firService.isFirValid(fir, suffix, this.firForm);
  }
  
  // This function checks the input field and hides/shows the warning text accordingly
  isInputValid(index: number, field: string): boolean {
    const inputValue = this.accuseds.at(index).get(field)?.value; // Get value properly from FormArray
    return !!inputValue && inputValue.trim() !== ''; // Returns true if input is filled
  }

  // Function to log user input and update UI validation
  checkInput(index: number, field: string) {  
    const control = this.accuseds.at(index).get(field); // Access form control correctly
    if (control) {
      const value = control.value?.trim() || '';
      console.log(`[INFO] Input detected - Field: ${field}, Index: ${index}, Value: "${value}"`);
      if (value !== '') {  
        console.log(`[SUCCESS] ${field} input filled for index ${index}: "${value}" - No error shown.`);
        control.setErrors(null); // Clear errors if input is valid
      } else {  
        console.log(`[ERROR] ${field} input is empty for index ${index} - Showing error.`);
        control.setErrors({ required: true }); // Set error if input is empty
      }  
      // Ensure UI updates properly
      control.markAsTouched();
      control.updateValueAndValidity(); // Force validation check
      this.cdr.detectChanges();
    }
  }

  get hearingDetails(): FormArray {
    return this.firForm.get('hearingDetails') as FormArray;
  }


  get hearingDetails_one(): FormArray {
    return this.firForm.get('hearingDetails_one') as FormArray;
  }


addHearingDetail(): void {
  this.hearingDetails.push(this.createHearingDetailGroup());
}

removeHearingDetail(index: number): void {
  this.hearingDetails.removeAt(index);
}

addHearingDetail_one(): void {
  this.hearingDetails_one.push(this.createHearingDetailGroup_one());
}

removeHearingDetail_one(index: number): void {
  if (this.hearingDetails_one.length > 1) {
    this.hearingDetails_one.removeAt(index);
  }
}




get attachments_1(): FormArray {
  return this.firForm.get('attachments_1') as FormArray;
}

get attachments_2(): FormArray {
  return this.firForm.get('attachments_2') as FormArray;
}


// onFileSelect_1(event: any, index: number): void {
//   const file = event.target.files[0];
//   if (file) {
//     const attachmentGroup = this.attachments_1.at(index) as FormGroup;
//     attachmentGroup.patchValue({
//       file,
//       fileName: file.name,
//     });
//   }
// }

onFileSelect_1(event: any, index: number): void {
  const file = event.target.files[0];
  if (file) {
    const attachmentGroup = this.attachments_1.at(index) as FormGroup;

    const simulatedFilePath = `/uploads/${file.name}`;

  
    attachmentGroup.patchValue({
      fileName: file.name,
   file
    });

    this.cdr.detectChanges();
  }
}

onFileSelect_1New(event: any, index: number, fileControl: string, fileNameControl: string): void {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    this.vmcSerive.uploadFile(formData).subscribe({
      next: (response: any) => {
        const uploadedFileReference = response.filePath;
        const attachment = this.attachments_1.at(index);
         attachment.patchValue({
          [fileControl]: uploadedFileReference,
          [fileNameControl]: selectedFile.name,
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('File upload failed:', err);
      }
    });
  }

// onFileSelect_2(event: any, index: number): void {
//   const file = event.target.files[0];
//   if (file) {
//     const attachmentGroup = this.attachments_2.at(index) as FormGroup;
//     attachmentGroup.patchValue({
//       file_2: file,
//       fileName_2: file.name,
//     });
//   }
// }

onFileSelect_2(event: any, index: number): void {
  const files = event.target.files;
  if (files && files.length > 0) {
    const attachmentGroup = this.attachments_2.at(index) as FormGroup;
    const fileArray = Array.from(files) as File[];

    // Store the actual files in our fileStorage
    this.fileStorage[index] = fileArray;

    // Only store the file names in the form
    attachmentGroup.patchValue({
      fileName_2: fileArray.map(file => file.name).join(', ')
    });
  }
}




updateRemainingCharacters(index: number) {
  const value = this.accuseds.at(index).get('gistOfCurrentCase')?.value || '';
  this.remainingCharacters[index] = 3000 - value.length; // Calculate remaining characters
}

removeAttachment_2(index: number): void {
  if (this.attachments_2.length > 1) {
    this.attachments_2.removeAt(index);
  }
}
createAttachmentGroup_2(): FormGroup {
  return this.fb.group({
    file_2: [null, Validators.required], // File control
    fileName_2: [''], // File name
  });
}




addAttachment_1(): void {
  this.attachments_1.push(this.createAttachmentGroup());
}

removeAttachment_1(index: number): void {
  if (this.attachments_1.length > 1) {
    this.attachments_1.removeAt(index);
  } else {
    this.attachments_1.at(0).reset();
    this.cdr.detectChanges();
  }
}
viewAttachment_1(index: number): void {
  const filePath = this.attachments_1.at(index).get('file')?.value;
  if (filePath) {
    const url = `${env.file_access}${filePath}`;
    window.open(url, '_blank');
  }
}




  onJudgementNatureChange_one(): void {
    const judgementNature = this.firForm.get('judgementDetails_one.judgementNature_one')?.value;

    if (judgementNature === 'Convicted_one') {
      // Show only Upload Judgement Copy
      this.showJudgementCopy = true;
      this.showLegalOpinionObtained_one = false;
      this.showFiledBy_one = false;
      this.showDesignatedCourt_one = false;
      this.hideCompensationSection = false;

      // Set validators for Upload Judgement Copy
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.setValidators(Validators.required);
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.updateValueAndValidity();
    } else if (judgementNature === 'Acquitted_one') {
      // Show Upload Judgement Copy and additional fields
      this.showJudgementCopy = true;
      this.showLegalOpinionObtained_one = true;
      this.showFiledBy_one = true;
      this.showDesignatedCourt_one = true;
      this.hideCompensationSection = true;

      // Set validators for Upload Judgement Copy
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.setValidators(Validators.required);
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.updateValueAndValidity();
    } else {
      // Reset visibility for all fields
      this.showJudgementCopy = false;
      this.showLegalOpinionObtained_one = false;
      this.showFiledBy_one = false;
      this.showDesignatedCourt_one = false;
      this.hideCompensationSection = false;
      // Clear validators for Upload Judgement Copy
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.clearValidators();
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.updateValueAndValidity();
    }
  }

  onLegalOpinionChange_one(): void {
    const legalOpinion = this.firForm.get('judgementDetails_one.legalOpinionObtained_one')?.value;

    // Show additional fields based on legal opinion value
    this.showCaseFitForAppeal_one = legalOpinion === 'yes';
  }

  public selectedCourtType:string="";
  onDesignatedCourtChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    this.selectedCourtType = target.value;

    this.showDuplicateSection = selectedValue === 'highCourt' || selectedValue === 'supremeCourt';

    // console.log('Selected Value:', selectedValue);
    // console.log('Show Duplicate Section:', this.showDuplicateSection);
  }

  onDesignatedCourtChange_one(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;

    this.showDuplicateSection_1 = selectedValue === 'highCourt_one' || selectedValue === 'supremeCourt_one';

    // console.log('Selected Value:', selectedValue);
    // console.log('Show Duplicate Section:', this.showDuplicateSection);
  }

  is_show_trail_details:boolean = false;
  onJudgementNatureChange(): void {
    const judgementNature = this.firForm.get('judgementDetails.judgementNature')?.value;

    if (judgementNature === 'Convicted') {
      // Show Upload Judgement Copy only
      this.showJudgementCopy = true;
      this.showLegalOpinionObtained = false;
      this.showFiledBy = false;
      this.showDesignatedCourt = false;

      this.hideCompensationSection = false;
      this.is_show_trail_details = false;

      // Set validators for Upload Judgement Copy
      this.firForm.get('judgementDetails.uploadJudgement')?.setValidators(Validators.required);
      this.firForm.get('judgementDetails.uploadJudgement')?.updateValueAndValidity();
    } else if (judgementNature === 'Acquitted') {
      // Show Upload Judgement Copy and other fields
      this.showJudgementCopy = true;
      this.showLegalOpinionObtained = true;
      this.showFiledBy = true;
      this.showDesignatedCourt = true;
      this.hideCompensationSection = true;
      this.is_show_trail_details = true
      // Set validators for Upload Judgement Copy
      this.firForm.get('judgementDetails.uploadJudgement')?.setValidators(Validators.required);
      this.firForm.get('judgementDetails.uploadJudgement')?.updateValueAndValidity();
    }
  }

  onLegalOpinionChange(): void {
    const legalOpinion = this.firForm.get('judgementDetails.legalOpinionObtained')?.value;

    // Show "Case Fit for Appeal" and "Government Approval" fields if legal opinion is "yes"
    this.showCaseFitForAppeal = legalOpinion === 'yes';
  }









  onJudgementSelectionChange(event: any): void {
    const value = event.target.value;

    if (value === 'yes') {
      this.firForm.get('judgementDetails.judgementNature')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails.uploadJudgement')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails.judgementNature')?.clearValidators();
      this.firForm.get('judgementDetails.uploadJudgement')?.clearValidators();
      this.hideCompensationSection = true;
    }

    this.firForm.get('judgementDetails.judgementNature')?.updateValueAndValidity();
    this.firForm.get('judgementDetails.uploadJudgement')?.updateValueAndValidity();
    this.hideCompensationSection = true;
  }









onAdditionalReliefChange(event: Event, value: string, index: number): void {
  const checked = (event.target as HTMLInputElement).checked;


  const additionalReliefControl = this.victimsRelief.at(index).get('additionalRelief') as FormControl;


  let currentValues = additionalReliefControl.value || [];

  if (checked) {

    if (!currentValues.includes(value)) {
      currentValues = [...currentValues, value];
    }
  } else {

    currentValues = currentValues.filter((item: string) => item !== value);
  }

  
  additionalReliefControl.setValue(currentValues);
  additionalReliefControl.markAsDirty(); 
console.log(additionalReliefControl,"additionalReliefControl")

  this.cdr.detectChanges();
}







  // onJudgementSelectionChange_two(event: any): void {
  //   const value = event.target.value;
  //   if (value === 'yes') {
  //     this.firForm.get('judgementDetails_two.judgementNature_two')?.setValidators([Validators.required]);
  //     this.firForm.get('judgementDetails_two.uploadJudgement_two')?.setValidators([Validators.required]);
  //   } else {
  //     this.firForm.get('judgementDetails_two.judgementNature_two')?.clearValidators();
  //     this.firForm.get('judgementDetails_two.uploadJudgement_two')?.clearValidators();
  //   }
  //   this.firForm.get('judgementDetails_two.judgementNature_two')?.updateValueAndValidity();
  //   this.firForm.get('judgementDetails_two.uploadJudgement_two')?.updateValueAndValidity();
  // }

  // onJudgementNatureChange_two(): void {
  //   const judgementNature = this.firForm.get('judgementDetails_two.judgementNature_two')?.value;
  //   if (judgementNature === 'Convicted_two') {
  //     this.showLegalOpinionObtained_two = false;
  //     this.showFiledBy_two = false;
  //     this.showDesignatedCourt_two = false;
  //     this.hideCompensationSection = false;
  //   } else if (judgementNature === 'Acquitted_two') {
  //     this.showLegalOpinionObtained_two = true;
  //     this.showFiledBy_two = true;
  //     this.showDesignatedCourt_two = true;
  //     this.hideCompensationSection = true;
  //   }
  // }

  onLegalOpinionChange_two(): void {
    const legalOpinion = this.firForm.get('judgementDetails_two.legalOpinionObtained_two')?.value;
    this.showCaseFitForAppeal_two = legalOpinion === 'yes';
  }


  get hearingDetails_two(): FormArray {
    return this.firForm.get('hearingDetails_two') as FormArray;
  }


  addHearingDetail_two(): void {
    this.hearingDetails_two.push(this.createHearingDetailGroup_two());
  }

  removeHearingDetail_two(index: number): void {
    if (this.hearingDetails_two.length > 1) {
      this.hearingDetails_two.removeAt(index);
    }
  }

  createHearingDetailGroup_two(): FormGroup {
    return this.fb.group({
      nextHearingDate_two: ['', Validators.required],
      reasonNextHearing_two: ['', Validators.required],
    });
  }

  // command it tem by surya for manual calcualte
  // populateVictimsRelief(victimsReliefDetails: any[]): void {
  //   const victimsReliefArray = this.victimsRelief;

  // // Ensure the value is retrieved as a number
  // let selectedVictimCount = Number(this.firForm.get('complainantDetails.numberOfVictims')?.value) || 0;
  // console.log("count ----------> ",selectedVictimCount);
  // console.log("Selected Number of Victims from Dropdown:", selectedVictimCount);

  // console.log("Before Clearing: victimsRelief.controls.length =", victimsReliefArray.controls.length);

  // victimsReliefArray.clear(); // Clear existing form controls

  // for (let i = 0; i < selectedVictimCount; i++) {
  //   const victim = victimsReliefDetails[i] || {}; // Use existing data if available
  //     console.log(`Adding victim #${i + 1}:`, victim);
  //     const reliefGroup = this.createVictimReliefGroup();

  //     // Set initial values for each victim
  //     reliefGroup.patchValue({
  //       victimId: victim.victim_id || '',
  //       communityCertificate: victim.communityCertificate || '',
  //       reliefAmountScst: victim.fir_stage_as_per_act || '0',
  //       reliefAmountExGratia: victim.fir_stage_ex_gratia || '0',
  //       reliefAmountFirstStage: (
  //         parseFloat(victim.fir_stage_as_per_act || '0') +
  //         parseFloat(victim.fir_stage_ex_gratia || '0')
  //       ).toFixed(2),
  //       reliefAmountScst_1: victim.chargesheet_stage_as_per_act || '0',
  //       reliefAmountExGratia_1: victim.chargesheet_stage_ex_gratia || '0',
  //       reliefAmountSecondStage: (
  //         parseFloat(victim.chargesheet_stage_as_per_act || '0') +
  //         parseFloat(victim.chargesheet_stage_ex_gratia || '0')
  //       ).toFixed(2),
  //       reliefAmountScst_2: victim.final_stage_as_per_act || '0',
  //       reliefAmountExGratia_2: victim.final_stage_ex_gratia || '0',
  //       reliefAmountThirdStage: (
  //         parseFloat(victim.final_stage_as_per_act || '0') +
  //         parseFloat(victim.final_stage_ex_gratia || '0')
  //       ).toFixed(2),
  //       totalCompensation: '0', // Start with 0 and calculate dynamically for each step
  //     });

  //     // Subscribe to value changes for each stage
  //     reliefGroup.get('reliefAmountScst')?.valueChanges.subscribe(() => {
  //       this.updateFirstStageRelief(reliefGroup);
  //       this.updateTotalCompensation(); // Update first stage totals
  //     });

  //     reliefGroup.get('reliefAmountExGratia')?.valueChanges.subscribe(() => {
  //       this.updateFirstStageRelief(reliefGroup);
  //       this.updateTotalCompensation(); // Update first stage totals
  //     });

  //     reliefGroup.get('reliefAmountScst_1')?.valueChanges.subscribe(() => {
  //       this.updateSecondStageRelief(reliefGroup);
  //       this.updateTotalCompensation_1(); // Update second stage totals
  //     });

  //     reliefGroup.get('reliefAmountExGratia_1')?.valueChanges.subscribe(() => {
  //       this.updateSecondStageRelief(reliefGroup);
  //       this.updateTotalCompensation_1(); // Update second stage totals
  //     });

  //     reliefGroup.get('reliefAmountScst_2')?.valueChanges.subscribe(() => {
  //       this.updateThirdStageRelief(reliefGroup);
  //       this.updateTotalCompensation_2(); // Update third stage totals
  //     });

  //     reliefGroup.get('reliefAmountExGratia_2')?.valueChanges.subscribe(() => {
  //       this.updateThirdStageRelief(reliefGroup);
  //       this.updateTotalCompensation_2(); // Update third stage totals
  //     });

  //     victimsReliefArray.push(reliefGroup); // Add the relief group to the FormArray
  //   }

  //   console.log("After Adding: victimsRelief.controls.length =", this.victimsRelief.controls.length);

  //   // Perform initial calculation
  //   this.updateTotalCompensation();
  //   this.updateTotalCompensation_1();
  //   this.updateTotalCompensation_2();

  //   this.cdr.detectChanges(); // Trigger UI updates
  // }

  
  populateVictimsRelief(victimsReliefDetails: any[]): void {
    const victimsReliefArray = this.victimsRelief;

  // Ensure the value is retrieved as a number
  let selectedVictimCount = Number(this.firForm.get('complainantDetails.numberOfVictims')?.value) || 0;
  console.log("count ----------> ",selectedVictimCount);
  console.log("Selected Number of Victims from Dropdown:", selectedVictimCount);

  console.log("Before Clearing: victimsRelief.controls.length =", victimsReliefArray.controls.length);

  victimsReliefArray.clear(); // Clear existing form controls

  for (let i = 0; i < selectedVictimCount; i++) {
    const victim = victimsReliefDetails[i] || {}; // Use existing data if available
      console.log(`Adding victim #${i + 1}:`, victim);
      const reliefGroup = this.createVictimReliefGroup();

      // Set initial values for each victim
      // reliefGroup.patchValue({
      //   victimId: victim.victim_id || '',
      //   communityCertificate: victim.communityCertificate || '',
      //   reliefAmountScst: victim.fir_stage_as_per_act || '0',
      //   reliefAmountExGratia: victim.fir_stage_ex_gratia || '0',
      //   reliefAmountFirstStage: (
      //     parseFloat(victim.fir_stage_as_per_act || '0') +
      //     parseFloat(victim.fir_stage_ex_gratia || '0')
      //   ).toFixed(2),
      //   reliefAmountScst_1: victim.chargesheet_stage_as_per_act || '0',
      //   reliefAmountExGratia_1: victim.chargesheet_stage_ex_gratia || '0',
      //   reliefAmountSecondStage: (
      //     parseFloat(victim.chargesheet_stage_as_per_act || '0') +
      //     parseFloat(victim.chargesheet_stage_ex_gratia || '0')
      //   ).toFixed(2),
      //   reliefAmountScst_2: victim.final_stage_as_per_act || '0',
      //   reliefAmountExGratia_2: victim.final_stage_ex_gratia || '0',
      //   reliefAmountThirdStage: (
      //     parseFloat(victim.final_stage_as_per_act || '0') +
      //     parseFloat(victim.final_stage_ex_gratia || '0')
      //   ).toFixed(2),
      //   totalCompensation: '0', // Start with 0 and calculate dynamically for each step
      // });

      reliefGroup.patchValue({
        victimId: victim.victim_id || '',
        communityCertificate: '',
        reliefAmountScst: '0',
        reliefAmountExGratia: '0',
        reliefAmountFirstStage: (
          parseFloat('0') +
          parseFloat('0')
        ).toFixed(2),
        reliefAmountScst_1: '0',
        reliefAmountExGratia_1: '0',
        reliefAmountSecondStage: (
          parseFloat('0') +
          parseFloat('0')
        ).toFixed(2),
        reliefAmountScst_2: '0',
        reliefAmountExGratia_2: '0',
        reliefAmountThirdStage: (
          parseFloat('0') +
          parseFloat('0')
        ).toFixed(2),
        totalCompensation: '0', // Start with 0 and calculate dynamically for each step
      });

      // Subscribe to value changes for each stage
      reliefGroup.get('reliefAmountScst')?.valueChanges.subscribe(() => {
        this.updateFirstStageRelief(reliefGroup);
        this.updateTotalCompensation(); // Update first stage totals
      });

      reliefGroup.get('reliefAmountExGratia')?.valueChanges.subscribe(() => {
        this.updateFirstStageRelief(reliefGroup);
        this.updateTotalCompensation(); // Update first stage totals
      });

      reliefGroup.get('reliefAmountScst_1')?.valueChanges.subscribe(() => {
        this.updateSecondStageRelief(reliefGroup);
        this.updateTotalCompensation_1(); // Update second stage totals
      });

      reliefGroup.get('reliefAmountExGratia_1')?.valueChanges.subscribe(() => {
        this.updateSecondStageRelief(reliefGroup);
        this.updateTotalCompensation_1(); // Update second stage totals
      });

      reliefGroup.get('reliefAmountScst_2')?.valueChanges.subscribe(() => {
        this.updateThirdStageRelief(reliefGroup);
        this.updateTotalCompensation_2(); // Update third stage totals
      });

      reliefGroup.get('reliefAmountExGratia_2')?.valueChanges.subscribe(() => {
        this.updateThirdStageRelief(reliefGroup);
        this.updateTotalCompensation_2(); // Update third stage totals
      });

      victimsReliefArray.push(reliefGroup); // Add the relief group to the FormArray
    }

    console.log("After Adding: victimsRelief.controls.length =", this.victimsRelief.controls.length);

    // Perform initial calculation
    this.updateTotalCompensation();
    this.updateTotalCompensation_1();
    this.updateTotalCompensation_2();

    this.cdr.detectChanges(); // Trigger UI updates
  }

  updateFirstStageRelief(reliefGroup: FormGroup): void {
    const scst = parseFloat(reliefGroup.get('reliefAmountScst')?.value || '0');
    const exGratia = parseFloat(reliefGroup.get('reliefAmountExGratia')?.value || '0');
    const total = scst + exGratia;
    reliefGroup.patchValue({ reliefAmountFirstStage: total.toFixed(2) }, { emitEvent: false });
  }

  updateSecondStageRelief(reliefGroup: FormGroup): void {
    const scst = parseFloat(reliefGroup.get('reliefAmountScst_1')?.value || '0');
    const exGratia = parseFloat(reliefGroup.get('reliefAmountExGratia_1')?.value || '0');
    const total = scst + exGratia;
    reliefGroup.patchValue({ reliefAmountSecondStage: total.toFixed(2) }, { emitEvent: false });
  }

  updateThirdStageRelief(reliefGroup: FormGroup): void {
    const scst = parseFloat(reliefGroup.get('reliefAmountScst_2')?.value || '0');
    const exGratia = parseFloat(reliefGroup.get('reliefAmountExGratia_2')?.value || '0');
    const total = scst + exGratia;
    reliefGroup.patchValue({ reliefAmountThirdStage: total.toFixed(2) }, { emitEvent: false });
  }

  updateTotalCompensation(): void {
    let total = 0;
    this.victimsRelief.controls.forEach((group) => {
      const firstStage = parseFloat(group.get('reliefAmountFirstStage')?.value || '0');
      total += firstStage;
    });
    this.firForm.patchValue({ totalCompensation: total.toFixed(2) });
  }

  updateTotalCompensation_1(): void {
    let total = 0;
    this.victimsRelief.controls.forEach((group) => {
      const secondStage = parseFloat(group.get('reliefAmountSecondStage')?.value || '0');
      total += secondStage;
    });
    this.firForm.patchValue({ totalCompensation_1: total.toFixed(2) });
  }

  updateTotalCompensation_2(): void {
    let total = 0;
    this.victimsRelief.controls.forEach((group) => {
      const thirdStage = parseFloat(group.get('reliefAmountThirdStage')?.value || '0');
      total += thirdStage;
    });
    this.firForm.patchValue({ totalCompensation_2: total.toFixed(2) });
  }




  /* handleSCSTSectionChange(event: any, index: number): void {
    const selectedValues = event.value; // Selected SC/ST sections
    const victimGroup = this.victims.at(index) as FormGroup; // Access the victim's FormGroup

    if (selectedValues.length > 0) {
      this.firService.getOffenceActs().subscribe(
        (response: any[]) => {
          // Filter the offence acts based on selected values
          const matchedActs = response.filter((act) =>
            selectedValues.includes(act.offence_act_name)
          );

          if (matchedActs.length > 0) {
            // Update the victim's FormGroup with the fetched values
            victimGroup.patchValue({
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
        fir_stage_as_per_act: '',
        fir_stage_ex_gratia: '',
        chargesheet_stage_as_per_act: '',
        chargesheet_stage_ex_gratia: '',
        final_stage_as_per_act: '',
        final_stage_ex_gratia: '',
        reliefAmountFirstStage: '', // Reset the 1st stage relief amount
      });
    }
  } */




  loadVictimsReliefDetails(): void {
    if (!this.firId) {
      console.error('FIR ID is missing.');
      return;
    }

    this.firService.getVictimsReliefDetails(this.firId).subscribe(
      (response: any) => {
        console.log('Victim Relief Details:', response.victimsReliefDetails); // Log response data
        if (response && response.victimsReliefDetails) {
          this.populateVictimsRelief(response.victimsReliefDetails);
        } else {
          console.warn('No victim relief details found.');
        }
      },
      (error) => {
        console.error('Failed to fetch victim relief details:', error);
      }
    );
  }

  onVictimGenderChange(event: Event, index: number) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'Other') {
      this.showOtherVictimGender[index] = true;
      this.victims.at(index).get('customGender')?.setValidators([Validators.required]);
    } else {
      this.showOtherVictimGender[index] = false;
      this.victims.at(index).get('customGender')?.clearValidators();
      this.victims.at(index).get('customGender')?.setValue('');
    }
    this.victims.at(index).get('customGender')?.updateValueAndValidity();
  }




  addVictimReliefFields(victimName: string): void {
    const victimsReliefArray = this.firForm.get('victimsRelief') as FormArray;
    const victimReliefGroup = this.fb.group({

      name: [victimName, Validators.required], // Auto-filled victim name
      reliefAmountScst: ['', Validators.required],
      reliefAmountExGratia: ['', Validators.required],
      reliefAmountFirstStage: ['', Validators.required],
      totalCompensation: ['', Validators.required],
      additionalRelief: [[]],
    });

    victimsReliefArray.push(victimReliefGroup); // Add to form array
  }



  // Create FormGroup for Investigating Officer
  createOfficerGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.pattern('^[A-Za-z\s]*$')],
      designation: ['', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
    });
  }
// Allow only letters for the name input
allowOnlyLetters(event: KeyboardEvent): void {
  const charCode = event.key.charCodeAt(0);
  // Allow only uppercase (A-Z), lowercase (a-z), and space (charCode 32)
  if (
    !(charCode >= 65 && charCode <= 90) && // A-Z
    !(charCode >= 97 && charCode <= 122) && // a-z
    charCode !== 32 // space
  ) {
    event.preventDefault(); // Prevent the character from being entered
  }
}

// Allow only numbers for the mobile number input
allowOnlyNumbers(event: KeyboardEvent): void {
  const charCode = event.key.charCodeAt(0);
  // Allow only numbers (0-9)
  if (charCode < 48 || charCode > 57) {
    event.preventDefault(); // Prevent the character from being entered
  }
}

// Check if the name field is invalid
isNameInvalid(): boolean {
  const nameControl = this.firForm.get('complainantDetails.nameOfComplainant');
  return !!(nameControl && nameControl.invalid && nameControl.touched);
}

isPhoneInvalid(index: number, type: string): boolean {
  if (type === 'complainant') {
    const phoneControl = this.firForm.get('complainantDetails.mobileNumberOfComplainant');
    return !!(
      phoneControl &&
      (phoneControl.invalid || phoneControl.value?.length !== 10) &&
      phoneControl.touched
    );
  }
  return false;
}




updateVictimNames(): void {
  this.victimNames = this.victims.controls
    .map((victim) => victim.get('name')?.value)
    .filter((name) => name); // Extract non-empty names

  if (this.victimNames.length > 0) {
    // Call the API to fetch relief details for each victim
    this.firService.getVictimsReliefDetails(this.firId).subscribe(
      (response: any) => {
        if (response.victimsReliefDetails) {
          this.populateVictimsRelief(response.victimsReliefDetails);
        } else {
          console.warn('No victim relief details found.');
        }
      },
      (error) => {
        console.error('Failed to fetch victims relief details:', error);
      }
    );


  }
}



onIsDeceasedChangeOutside(): void {
  const isDeceasedControl = this.firForm.get('isDeceased');
  const deceasedPersonNamesControl = this.firForm.get('deceasedPersonNames');

  if (isDeceasedControl?.value === 'yes') {
    // If "Yes", make the deceased person names field required
    deceasedPersonNamesControl?.setValidators([Validators.required]);
    deceasedPersonNamesControl?.enable();
    this.showRelief = true;
  } else {
    // If "No", reset and disable the deceased person names field
    deceasedPersonNamesControl?.clearValidators();
    deceasedPersonNamesControl?.reset();
    deceasedPersonNamesControl?.disable();
    this.showRelief = false;
  }

  deceasedPersonNamesControl?.updateValueAndValidity();
  this.updateNextButtonState(); // Update "Next" button state
}

// Update "Next" button state based on deceased person names
updateNextButtonState(): void {
  const isDeceased = this.firForm.get('isDeceased')?.value;
  const deceasedPersonNamesValid = this.firForm.get('deceasedPersonNames')?.valid;

  // Enable "Next" button only if conditions are met
  this.nextButtonDisabled = !(isDeceased === 'no' || (isDeceased === 'yes' && deceasedPersonNamesValid));
  this.cdr.detectChanges(); // Trigger change detection
}


  // Validator to restrict future dates
maxDateValidator() {
  return (control: any) => {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      return { maxDate: true };
    }
    return null;
  };
}

createVictimGroup(): FormGroup {
  return this.fb.group({
    victimId: [''], // Track existing victim IDs
    age: ['', Validators.required],
    name: [{ value: '', disabled: false }, [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]],
    gender: ['', Validators.required],
    mobileNumber: [
      '',
      [Validators.required, Validators.pattern('^[0-9]{10}$')] // 10-digit validation
    ],
    customGender: [''], // Add customGender field
    address: [''],
    victimPincode: [
      '',
      [Validators.required, Validators.pattern('^[0-9]{6}$')] // 6-digit validation
    ],
    community: ['', Validators.required],
    caste: ['', Validators.required],
    availableCastes: [[]],
    guardianName: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]],
    isNativeDistrictSame: ['', Validators.required],
    nativeDistrict: [''],
    offenceCommitted: ['', Validators.required],
    scstSections: ['', Validators.required],
    // sectionsIPC: ['', Validators.required],
    sectionDetails: this.fb.array([this.createSection()]),
    fir_stage_as_per_act: [''],
    fir_stage_ex_gratia: [''],
    chargesheet_stage_as_per_act: [''],
    chargesheet_stage_ex_gratia: [''],
    final_stage_as_per_act: [''],
    final_stage_ex_gratia: [''],
  });
}

createSection(): FormGroup {
  return this.fb.group({
    SectionType: ['', Validators.required],
    Section: ['', Validators.required]
  });
}

getSectionDetails(victimIndex: number): FormArray {
  return this.victims.at(victimIndex).get('sectionDetails') as FormArray;
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




isPincodeInvalid(index: number): boolean {
  const pincodeControl = this.accuseds.at(index).get('pincode');
  return (pincodeControl?.touched ?? false) && !(pincodeControl?.valid ?? true);
}



createVictimReliefGroup(initialValues: any = {}): FormGroup {
  return this.fb.group({

    victimId: [initialValues.victim_id  || null], // Add victim_id here

    communityCertificate: ['', Validators.required],

    reliefAmountScst: [
      { value: initialValues.reliefAmountScst || '0' },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountExGratia: [
      { value: initialValues.reliefAmountExGratia || '0' },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountFirstStage: [
      { value: initialValues.reliefAmountFirstStage || '0', disabled: true },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountScst_1: [
      { value: initialValues.reliefAmountScst_1 || '0' },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountExGratia_1: [
      { value: initialValues.reliefAmountExGratia_1 || '0' },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountSecondStage: [
      { value: initialValues.reliefAmountSecondStage || '0', disabled: true },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountScst_2: [
      { value: initialValues.reliefAmountScst_2 || '0' },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountExGratia_2: [
      { value: initialValues.reliefAmountExGratia_2 || '0' },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountThirdStage: [
      { value: initialValues.reliefAmountThirdStage || '0', disabled: true },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    totalCompensation: [initialValues.totalCompensation || '', Validators.required],
    additionalRelief: [initialValues.additionalRelief || []],
  });
}






createHearingDetailGroup(): FormGroup {
  return this.fb.group({
    nextHearingDate: ['', Validators.required],
    reasonNextHearing: ['', Validators.required]
  });
}

createHearingDetailGroup_one(): FormGroup {
  return this.fb.group({
    nextHearingDate_one: ['', Validators.required],
    reasonNextHearing_one: ['', Validators.required],
  });
}


handleCaseTypeChange() {
  const caseType = this.firForm.get('caseType')?.value;

  if (caseType === 'chargeSheet') {
    this.firForm.get('caseNumber')?.enable();
    this.firForm.get('chargeSheetDate')?.enable();
    this.firForm.get('rcsFileNumber')?.disable();
    this.firForm.get('rcsFilingDate')?.disable();
    this.firForm.get('mfCopy')?.disable();
  } else if (caseType === 'referredChargeSheet') {
    this.firForm.get('caseNumber')?.disable();
    this.firForm.get('chargeSheetDate')?.disable();
    this.firForm.get('rcsFileNumber')?.enable();
    this.firForm.get('rcsFilingDate')?.enable();
    this.firForm.get('mfCopy')?.enable();
  }
}





  onNativeDistrictSameChange(index: number) {
    const victim = this.victims.at(index);
    const isNativeDistrictSame = victim.get('isNativeDistrictSame')?.value;

    if (isNativeDistrictSame === 'yes') {
      // If "Yes", reset and disable the Native District field
      victim.get('nativeDistrict')?.reset();
      victim.get('nativeDistrict')?.clearValidators();
    } else if (isNativeDistrictSame === 'no') {
      // If "No", make Native District field required
      victim.get('nativeDistrict')?.setValidators(Validators.required);
    }

    victim.get('nativeDistrict')?.updateValueAndValidity(); // Update the validation state
  }




  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;

    for (let year = currentYear; year >= startYear; year--) {
      this.yearOptions.push(year); // Populate yearOptions array with years
    }
  }

  // temrorary command by surya because of new requirenment.
  // Dropdown and option loading methods
  // loadOptions() {
  //   this.firService.getOffences().subscribe(
  //     (offences: any) => {
  //       console.log(offences);
  //       this.offenceOptions = offences.map((offence: any) => offence);
  //     },
  //     (error: any) => {
  //       Swal.fire('Error', 'Failed to load offence options.', 'error');
  //     }
  //   );
  // }

  loadOptions() {
    this.firService.getOffences().subscribe(
      (offences: any) => {
        console.log(offences);
        this.offenceOptions = offences
          .filter((offence: any) => offence.offence_act_name !== '3(2)(va)' && offence.offence_act_name !== '3(2)(v) , 3(2)(va)');
          this.offenceOptions.push(
            { offence_act_name: '3(2)(va)', offence_name: '', id : 24 },
            { offence_act_name: '3(2)(v), 3(2)(va)', offence_name: '', id: 25 }
          );
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load offence options.', 'error');
      }
    );
  }

  loadnativedistrict() {
    this.firService.getPoliceRevenue().subscribe(
      (Native: any) => {
        this.policeStations = Native.map((Native: any) => Native.revenue_district_name);
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load offence options.', 'error');
      }
    );
  }




  loadOffenceActs() {
    this.firService.getOffenceActs().subscribe(
      (acts: any[]) => {
        this.offenceActsOptions = acts.map((act) => ({
          offence_act_name: act.offence_act_name,
          // Include additional fields if necessary
          ...act,
        }));
        //console.log('Offence Acts Options:', this.offenceActsOptions);
      },
      (error: any) => {
        console.error('Failed to load offence acts:', error);
      }
    );
  }






  // loadScstSections() {
  //   this.firService.getCastes().subscribe(
  //     (sections: any) => {
  //       this.scstSectionsOptions = sections.map((section: any) => section.caste_name);
  //     },
  //     (error: any) => {
  //       Swal.fire('Error', 'Failed to load SC/ST sections options.', 'error');
  //     }
  //   );
  // }

  loadUserData() {
    this.firService.getUserDetails(this.userId).subscribe(
      (user: any) => {
        if (user && user.district) {
          const district = user.district;
          // this.firForm.patchValue({ policeCity: district });
          // this.loadPoliceDivisionDetails(district);

          this.loadPoliceDivision();
        }
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load user details.', 'error');
      }
    );
  }

  loadPoliceDivisionDetails(district: string) {
    this.firService.getPoliceDivision(district).subscribe(
      (data: any) => {
        this.policeCities = [district];

        console.log(data,"this.policeCities")
        this.policeZones = data.map((item: any) => item.police_zone_name);
        // this.policeRanges = data.map((item: any) => item.police_range_name);
        // this.revenueDistricts = data.map((item: any) => item.revenue_district_name);
        this.policeRanges = data.map((item: any) => {
          return item.police_range_name ? item.police_range_name.split(',') : [];
        });
        this.revenueDistricts = data.map((item: any) => {
          return item.revenue_district_name ? item.revenue_district_name.split(',') : [];
        });

        const policeZoneValue = this.policeZones.length > 0 ? this.policeZones[0] : '';
        // const policeRangeValue = this.policeRanges.length > 0 ? this.policeRanges[0] : '';
        // const revenueDistrictValue = this.revenueDistricts.length > 0 ? this.revenueDistricts[0] : '';

        const policeRangeValue = this.policeRanges.length > 0 && this.policeRanges[0].length > 0 ? this.policeRanges[0][0] : '';
        const revenueDistrictValue = this.revenueDistricts.length > 0 && this.revenueDistricts[0].length > 0 ? this.revenueDistricts[0][0] : '';
          
        this.firForm.patchValue({
          policeZone: policeZoneValue,
          policeRange: policeRangeValue,
          revenueDistrict: revenueDistrictValue,
        });

        if (policeZoneValue) this.firForm.get('policeZone')?.disable();
        // if (policeRangeValue) this.firForm.get('policeRange')?.disable();
        // if (revenueDistrictValue) this.firForm.get('revenueDistrict')?.disable();
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load division details.', 'error');
      }
    );
  }

  police_Cities_data:any

  loadPoliceDivision() {
    this.policeDivisionService.getAllPoliceDivisions().subscribe(
      (data: any) => {
        // this.police_Cities_data =data;

        // this.police_Cities_data = data.map((item: any) => item.district_division_name);
        this.police_Cities_data = Array.from(
          new Set(data.map((item: any) => item.district_division_name as string))
        ).sort((a: any, b: any) => a.localeCompare(b));

        console.log( data)
        this.policeZones = data.map((item: any) => item.police_zone_name);
        this.policeRanges = data.map((item: any) => item.police_range_name);
        this.revenueDistricts = data.map((item: any) => item.revenue_district_name);
        // this.firForm.patchValue({
        //   policeZone: this.policeZones ,
        //   policeRange: this.policeRanges ,
        //   revenueDistrict: this.revenueDistricts,
        // });
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load division details.', 'error');
      }
    );
  }






  // Victim Information Methods
  get victims(): FormArray {
    return this.firForm.get('victims') as FormArray;
  }

  onNumberOfVictimsChange() {
    const currentVictimCount = this.victims.length; // Current number of victim entries
    const numberOfVictims = this.firForm.get('complainantDetails.numberOfVictims')?.value || 1;

    if (numberOfVictims > currentVictimCount) {
      // Add new victim fields
      for (let i = currentVictimCount; i < numberOfVictims; i++) {
        this.victims.push(this.createVictimGroup());
      }
    } else if (numberOfVictims < currentVictimCount) {
      // Remove excess victim fields
      for (let i = currentVictimCount - 1; i >= numberOfVictims; i--) {
        this.victims.removeAt(i);
      }
    }

    this.cdr.detectChanges(); // Ensure UI is updated
  }


  // Accused Information Methods
  get accuseds(): FormArray {
    return this.firForm.get('accuseds') as FormArray;
  }

  addAccused() {
    this.accuseds.push(this.createAccusedGroup());
    this.showOtherGender.push(false);
    this.remainingCharacters.push(3000); // Initialize "Other" visibility for the new accused
  }


  onGenderChange(event: Event, index: number) {
    const selectElement = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
    const selectedValue = selectElement.value;

    if (selectedValue === 'Other') {
      this.showOtherGender[index] = true;
      this.accuseds.at(index).get('customGender')?.setValidators([Validators.required]); // Enable validation
    } else {
      this.showOtherGender[index] = false;
      this.accuseds.at(index).get('customGender')?.clearValidators(); // Clear validation
      this.accuseds.at(index).get('customGender')?.setValue(''); // Clear value
    }
    this.accuseds.at(index).get('customGender')?.updateValueAndValidity(); // Update validity
  }



  onNumberOfAccusedChange(): void {
    const numberOfAccused = this.firForm.get('numberOfAccused')?.value || 1;
    const accusedsArray = this.firForm.get('accuseds') as FormArray;

    // Clear existing accused fields
    accusedsArray.clear();

    // Add new accused fields based on the selected number
    for (let i = 0; i < numberOfAccused; i++) {
      accusedsArray.push(this.createAccusedGroup());
    }

    this.cdr.detectChanges(); // Trigger change detection to update the UI
  }


  createAccusedGroup(): FormGroup {
    return this.fb.group({

      accusedId: [''],
      age: ['', Validators.required],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      community: ['', Validators.required],
      caste: ['', Validators.required],
      guardianName: ['', Validators.required],
      uploadFIRCopy: ['', Validators.required],
      previousIncident: [false],
      customGender: [''],
      previousFIRNumber: [''],
      previousFIRNumberSuffix: [''],
      scstOffence: [false, Validators.required],
      scstFIRNumber: [''],
      scstFIRNumberSuffix: [''],
      antecedentsOption:['',Validators.required],
      antecedents: [''],
      landOIssueOption: ['', Validators.required],
      landOIssues: [''],
      gistOfCurrentCase: ['', [Validators.required, Validators.maxLength(3000)]],
      availableCastes: [[]]

    });
  }

  // Handle City Change
  onCityChange(event: any) {
    const selectedCity = event.target.value;
    console.log(selectedCity);
    if(selectedCity == "Chennai City"){
      this.firForm.get('policeRange')?.enable();
    }
    else{
      this.firForm.get('policeRange')?.disable();
    }
    if (selectedCity) {
      this.loadPoliceDivisionDetails(selectedCity);
    } else {
      this.resetPoliceFields();
    }
    const citiesThatEnableRevenueDistrict = ["Chennai City", "Avadi City", "Tambaram City"];
  
    if (citiesThatEnableRevenueDistrict.includes(selectedCity)) {
      this.firForm.get('revenueDistrict')?.enable();
    } else {
      this.firForm.get('revenueDistrict')?.disable();
    }
  }
  resetPoliceFields() {
    this.firForm.patchValue({
      policeZone: '',
      policeRange: '',
      revenueDistrict: '',
    });
  
    this.firForm.get('policeZone')?.enable();
    this.firForm.get('policeRange')?.enable();
    this.firForm.get('revenueDistrict')?.enable();
  }
    // Create a FormGroup for a single attachment
    // createAttachmentGroup(): FormGroup {
    //   return this.fb.group({
    //     fileName: [''], // Holds the file name
    //     file: [null, Validators.required], // Holds the file itself
    //     file_1: [null, Validators.required], // File control
    //     fileName_1: [''],
    //     file_2: [null, Validators.required], // File control
    //     fileName_2: [''],
    //   });
    // }
    createAttachmentGroup(): FormGroup {
      return this.fb.group({
        file: [null, Validators.required],
        fileName: ['']
      });
    }


    createNewAttachmentGroup():FormGroup {
      return this.fb.group({
      file: ['', Validators.required],       // Stores uploaded file path
      fileName: ['', Validators.required],   // Stores original file name
    });
    }


    // Handle single file selection
  onSingleFileSelect(event: any, index: number): void {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      // Update the attachment FormGroup with the file and its name
      this.attachments.at(index).patchValue({
        fileName: file.name,
        file: file,
      });

      // Trigger change detection to update the UI
      this.cdr.detectChanges();
    }
  }

  addAttachment_2(): void {
    this.attachments_2.push(this.createAttachmentGroup());
  }
  // Add a new attachment entry
  addAttachment(): void {
    this.attachments.push(this.createNewAttachmentGroup());
  }

  // Remove an attachment entry
  removeAttachment(index: number): void {
   if (this.attachments.length > 1) {
    this.attachments.removeAt(index);
  } else {
    this.attachments.at(0).reset(); // Clear the values
  }
  }

  // Getter for attachments FormArray
  get attachments(): FormArray {
    return this.firForm.get('attachments') as FormArray;
  }

  onFileChange(event: any, index: number, fileControl: string, fileNameControl: string): void {
    const file = event.target.files[0];
    if (file) {
      const attachment = this.attachments.at(index);
      attachment.patchValue({
        [fileControl]: file,
        [fileNameControl]: file.name,
      });
    }
  }

  onFileChangeNew(event: any, index: number, fileControl: string, fileNameControl: string): void {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    this.vmcSerive.uploadFile(formData).subscribe({
      next: (response: any) => {
        const uploadedFileReference = response.filePath;
        const attachment = this.attachments.at(index);
         attachment.patchValue({
          [fileControl]: uploadedFileReference,
          [fileNameControl]: selectedFile.name,
        });
      },
      error: (err) => {
        console.error('File upload failed:', err);
      }
    });
  }
  view62(index: any): void {
    const filePath = this.attachments.at(index).get('file')?.value;
    if (filePath) {
      const url = `${env.file_access}${filePath}`;
      window.open(url, '_blank');
    }
  }

  

  saveStepThreeAsDraft() {
    const victimsArray = this.firForm.get('victims') as FormArray;

    const firFormValues = this.firForm.value;
const complainantDetails = firFormValues.complainantDetails || {};


console.log(complainantDetails,"sasa")
const isVictimSameAsComplainant = complainantDetails.isVictimSameAsComplainant === "true";

console.log(isVictimSameAsComplainant,"sasa")


    const firData = {
      firId: this.firId,
      complainantDetails: this.firForm.get('complainantDetails')?.value,

      victims: victimsArray.controls.map((victimControl: AbstractControl) => {
        const victim = victimControl.value; 
        return {
          victimId: victim.victimId || null,
          name: isVictimSameAsComplainant ? complainantDetails.nameOfComplainant : victim?.name?.trim() || '', 
          age: victim.age || '',
          gender: victim.gender || '',
          customGender: victim.gender === 'Other' ? victim.customGender || null : null,
          mobileNumber: isVictimSameAsComplainant ? complainantDetails.mobileNumberOfComplainant : victim?.mobileNumber?.trim() || '', 
          address: victim.address || null,
          victimPincode: victim.victimPincode || null,
          community: victim.community || '',
          caste: victim.caste || '',
          guardianName: victim.guardianName || '',
          isNativeDistrictSame: victim.isNativeDistrictSame || '',
          nativeDistrict: victim.nativeDistrict || null,
          offenceCommitted: victim.offenceCommitted || [],
          scstSections: victim.scstSections || [],
          // sectionsIPC: victim.sectionsIPC || '',
          sectionDetails:victim.sectionDetails || [],
          fir_stage_as_per_act: victim.fir_stage_as_per_act || null,
          fir_stage_ex_gratia: victim.fir_stage_ex_gratia || null,
          chargesheet_stage_as_per_act: victim.chargesheet_stage_as_per_act || null,
          chargesheet_stage_ex_gratia: victim.chargesheet_stage_ex_gratia || null,
          final_stage_as_per_act: victim.final_stage_as_per_act || null,
          final_stage_ex_gratia: victim.final_stage_ex_gratia || null,
        };
      }),
    
     
      isDeceased: this.firForm.get('isDeceased')?.value,
      deceasedPersonNames: this.firForm.get('deceasedPersonNames')?.value || [],
    };

    console.log("third step data",firData);
    this.firService.saveStepThreeAsDraft(firData).subscribe(
      (response: any) => {
        console.log("After api call",response);
        this.firId = response.fir_id;
        if (this.firId) {
          sessionStorage.setItem('firId', this.firId);
        }
        const updatedVictims = response.victims || [];
        updatedVictims.forEach((updatedVictim: any, index: number) => {
          if (this.victims.at(index)) {
            this.victims.at(index).patchValue({ victimId: updatedVictim.victimId });
          }
        });
        Swal.fire('Success', 'FIR saved as draft for step 3.', 'success');
      },
      (error) => {
        console.error('Error saving FIR for step 3:', error);
        Swal.fire('Error', 'Failed to save FIR as draft for step 3.', 'error');
      }
    );
  }








  multipleFilesForproceeding: any[][] = [];
  showImage_proceding: boolean[] = []; 
  
  uploadedFiles: { [key: number]: boolean } = {};
  fileUrls: { [key: number]: string } = {};
  uploadedFileNames: { [key: number]: string } = {};

  onFileSelected(event: any, i: number): void {
    // const selectedFile = event.target.files[0]; 
    // if (!selectedFile) return;

    // this.accuseds.get('uploadFIRCopy')?.setValue(null);
  
    // if (!this.multipleFiles[i]) {
    //   this.multipleFiles[i] = [];
    // }
  
    // this.multipleFiles[i].push(selectedFile);
  

    // this.fileUrls[i] = URL.createObjectURL(selectedFile);
    
   
    // this.uploadedFiles[i] = true;
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    this.vmcSerive.uploadFile(formData).subscribe({
      next: (response: any) => {
        const filePath = response.filePath;

        // Set value in accused FormArray at index `i`
        const accusedFormGroup = this.accuseds.at(i);
        accusedFormGroup.get('uploadFIRCopy')?.setValue(filePath);

        // Track upload visually
        this.uploadedFiles[i] = true;
        this.uploadedFileNames[i] = selectedFile.name;
        this.fileUrls[i] = URL.createObjectURL(selectedFile);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('File upload failed:', err);
      }
    });
  }

  uploadedFIRFileName: string = '';
  proceedingFileName: string = '';

  onFIRFileUpload(event: any): void {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    this.vmcSerive.uploadFile(formData).subscribe({
      next: (response: any) => {
        const uploadedFileReference = response.filePath;
        this.firForm.get('uploadFIRCopy')?.setValue(uploadedFileReference);
        this.uploadedFIRFileName = selectedFile.name;
      },
      error: (err) => {
        console.error('File upload failed:', err);
      }
    });
  }  
  viewFIRCopy(i: number): void {
  const accusedFormGroup = this.accuseds.at(i);
  const filePath = accusedFormGroup.get('uploadFIRCopy')?.value;
  if (filePath) {
    const url = `${env.file_access}${filePath}`;
    window.open(url, '_blank');
  }
}

removeFIRCopy(i: number): void {
  const accusedFormGroup = this.accuseds.at(i);
  accusedFormGroup.get('uploadFIRCopy')?.setValue('');
  this.uploadedFiles[i] = false;
  this.uploadedFileNames[i] = '';
  this.fileUrls[i] = '';
}

  onProceedingsFileUpload(event: any): void {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    console.log("selectedFile",selectedFile);
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    this.vmcSerive.uploadFile(formData).subscribe({
      next: (response: any) => {
        const uploadedFileReference = response.filePath;
        this.proceedingFileName = selectedFile.name;
        this.firForm.get('proceedingsFile')?.setValue(uploadedFileReference);
      },
      error: (err) => {
        console.error('File upload failed:', err);
      }
    });
  }  
  viewProceedingsCopy(): void {
    if (this.firForm.get('proceedingsFile')?.value) {
      const url = `${env.file_access}${this.firForm.get('proceedingsFile')?.value}`;
      window.open(url, '_blank');
    }
  }
  
  
  removeProceedingsCopy(): void {
    this.firForm.get('proceedingsFile')?.setValue(null);
    this.proceedingFileName = '';
  }
  
  onDeleteFile(i: number): void {

    this.multipleFiles[i] = [];
    this.fileUrls[i] = '';
    this.uploadedFiles[i] = false;

    this.accuseds.get('uploadFIRCopy')?.setValue(null);
  }





// Save Step 4 as Draft
saveStepFourAsDraft(): void {
  // const firData = {
  //   firId: this.firId,
  //   numberOfAccused: this.firForm.get('numberOfAccused')?.value || '',
  //   accuseds: this.firForm.get('accuseds')?.value.map((accused: any, index: number) => ({
  //     ...accused,
  //     accusedId: accused.accusedId || null,
  //     // uploadFIRCopy: this.multipleFiles[index] || null
  //     uploadFIRCopy: this.firForm.get('uploadFIRCopy')?.value || null
  //   })),
  // };

  const firData = {
  firId: this.firId,
  numberOfAccused: this.firForm.get('numberOfAccused')?.value || '',
  accuseds: this.firForm.get('accuseds')?.value.map((accused: any) => ({
    ...accused,
    accusedId: accused.accusedId || null,
    uploadFIRCopy: accused.uploadFIRCopy || null
  })),
};


  console.log('FIR Data 4:', firData);


  this.firService.saveStepFourAsDraft(firData).subscribe(
    (response: any) => this.handleSuccess(response),
    (error) => this.handleError(error)
  );
}
multipleFiles: any[][] = [];


handleSuccess(response: any) {
  this.firId = response.fir_id;
  if (this.firId) {
    sessionStorage.setItem('firId', this.firId);
  }
  const updatedAccuseds = response.accuseds || [];
  updatedAccuseds.forEach((updatedAccused: any, index: number) => {
    if (this.accuseds.at(index)) {
      this.accuseds.at(index).patchValue({ accusedId: updatedAccused.accusedId });
    }
  });

  Swal.fire('Success', 'FIR saved as draft for step 4.', 'success');
}


handleError(error: any) {
  console.error('Error saving FIR for step 4:', error);
  Swal.fire('Error', 'Failed to save FIR as draft for step 4.', 'error');
}

// onProceedingsFileChange(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   if (input.files && input.files.length > 0) {
//     this.proceedingsFile = input.files[0];

//     // console.log(this.proceedingsFile,"this.proceedingsFile")
    
    
//     // Save the selected file
//   }
// }




uploadedFiles_proceding: { [key: number]: boolean } = {};

fileUrls_proceding: { [key: number]: string } = {};


 onProceedingsFileChange(event: any, i: number): void {
    const selectedFile = event.target.files[0]; 
    if (!selectedFile) return;

    this.firForm.get('proceedingsFile')?.setValue(null);
  
    if (!this.multipleFilesForproceeding[i]) {
      this.multipleFilesForproceeding[i] = [];
    }
    this.multipleFilesForproceeding[i].push(selectedFile);
  

    this.fileUrls_proceding[i] = URL.createObjectURL(selectedFile);
    
    this.proceedingsFile= selectedFile
    this.firForm.get('proceedingsFile')?.setValue(selectedFile);
   
    this.uploadedFiles_proceding[i] = true;
  }
  
  onDeleteFile_proceding(i: number): void {

    this.multipleFilesForproceeding[i] = [];
    this.fileUrls_proceding[i] = '';
    this.uploadedFiles_proceding[i] = false;
    
    const existingFile = this.firForm.get('proceedingsFile')?.value;
    if (existingFile) {
      this.fileUrls_proceding[i] = this.image_access + existingFile;
    }
  }




saveStepFiveAsDraft(isSubmit: boolean = false): void {
  if (!this.firId) {
    Swal.fire('Error', 'FIR ID is missing. Unable to proceed.', 'error');
    return;
  }

  const firData = {
    firId: this.firId,
    victimsRelief: this.victimsRelief.value.map((relief: any, index: number) => ({
      victimId: relief.victimId || null,
      reliefId: relief.reliefId || null, 
      victimName: this.victimNames[index] || '',
      communityCertificate: relief.communityCertificate || 'no',
      reliefAmountScst: relief.reliefAmountScst || '0.00',
      reliefAmountExGratia: relief.reliefAmountExGratia || '0.00',
      reliefAmountFirstStage: (
        parseFloat(relief.reliefAmountScst || '0') +
        parseFloat(relief.reliefAmountExGratia || '0')
      ).toFixed(2),
      totalCompensation: relief.totalCompensation || '0.00',
      additionalRelief: relief.additionalRelief || [],
    })),
    totalCompensation: this.firForm.get('totalCompensation')?.value || '0.00',
    proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value || '',
    proceedingsDate: this.firForm.get('proceedingsDate')?.value || null,
    // proceedingsFile: this.proceedingsFile || '',
    proceedingsFile: this.firForm.get('proceedingsFile')?.value || '',
    attachments: this.attachments.value || '',
    status: isSubmit ? 5 : null, 
  };



console.log(firData, "firDatafirDatafirDatafirData")


  this.firService.saveStepFiveAsDraft(firData).subscribe(
    (response) => {
      if (isSubmit) {
   
        Swal.fire({
          title: 'Success',
          text: 'Step 5 data submitted successfully.',
          icon: 'success',
        }).then(() => {
          this.navigateToChargesheetPage();
        });
      } else {
       
        Swal.fire('Success', 'Step 5 data saved as draft.', 'success');
      }
    },
    (error) => {
     
      console.error('Error saving Step 5 data:', error);
      Swal.fire('Error', 'Failed to save Step 5 data.', 'error');
    }
  );
}








submitStepSeven(): void {
  if (!this.firId) {
      Swal.fire('Error', 'FIR ID is missing. Unable to proceed.', 'error');
      return;
  }

  // Call saveAsDraft_7 to save the draft data before updating the status
  this.saveAsDraft_7();

  // Update the FIR status to 7 after saving the draft
  this.firService.updateFirStatus(this.firId, 7).subscribe({
      next: () => {
          Swal.fire({
              title: 'Success',
              text: 'FIR status updated to 7.',
              icon: 'success',
              confirmButtonText: 'OK',
          }).then(() => {
              this.navigateToChargesheetPage(); // Redirect to the chargesheet page after successful update
          });
      },
      error: (error) => {
          console.error('Error updating FIR status:', error);
          Swal.fire('Error', 'Failed to update FIR status.', 'error');
      }
  });
}






// Helper function to navigate to the next step
navigateToNextStep(): void {
  if (this.mainStep === 2 && this.step === 1) {
    this.loadVictimsReliefDetails();
    this.mainStep = 3; // Move to Trial Stage if currently in Chargesheet Stage
    this.step = 1;      // Reset to Step 1 of the new stage
  }


  if (this.mainStep === 3 && this.step === 1) {
    this.loadVictimsReliefDetails();

  }

  else if (this.mainStep === 1 && this.step < 5) {
    this.step++;        // Go to the next step within the same main stage
  } else if (this.mainStep === 1 && this.step === 5) {
    this.mainStep = 2;  // Move to Chargesheet Stage after FIR Stage
    this.step = 1;      // Reset to Step 1 of Chargesheet Stage
  }
  this.cdr.detectChanges(); // Ensure UI updates after step change
}



// Get victimsRelief FormArray
get victimsRelief(): FormArray {
  return this.firForm.get('victimsRelief') as FormArray;
}

navigateToNextPage(): void {
  if (this.mainStep === 2 && this.step === 1) {
    this.mainStep = 3; // Move to Trial Stage if currently in Chargesheet Stage
    this.step = 1;      // Reset to Step 1 of the new stage
  } else if (this.mainStep === 1 && this.step < 5) {
    this.step++;        // Go to the next step within the same main stage
    this.loadVictimsReliefDetails();
  } else if (this.mainStep === 1 && this.step === 5) {
    this.mainStep = 2;  // Move to Chargesheet Stage after FIR Stage
    this.step = 1;      // Reset to Step 1 of Chargesheet Stage
    this.loadVictimsReliefDetails();
  }
}



// Update the saveAsDraft() method to include Step 4
saveAsDraft(): void {
  if (this.step === 1) {
    if (this.validateStepOne('draft')) {
      this.saveStepOneAsDraft();
    } else {
      Swal.fire('Error', 'Please fill at least one field to save as draft.', 'error');
    }
  } else if (this.step === 2) {
    if (this.validateStepTwo('draft')) {
      this.saveStepTwoAsDraft();
    } else {
      Swal.fire('Error', 'Please fill at least one field to save as draft.', 'error');
    }
  } else if (this.step === 3) {
    // if (this.validateStepThree('draft')) {
    this.saveStepThreeAsDraft();
    // }else {
    //   Swal.fire('Error', 'Please fill at least one field to save as draft.', 'error');
    // }
  } else if (this.step === 4) {
    this.saveStepFourAsDraft();
  } else if (this.step === 5) {
    this.saveStepFiveAsDraft();
  }
}

onProceedingsFileChange_1(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.proceedingsFile_1 = input.files[0];

    console.log(this.proceedingsFile_1,"this.proceedingsFile")
    
    
    // Save the selected file
  }
}

CommissionerateSPFile:string='';

uploadCommissionerateSPFile(event: any): void {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    this.vmcSerive.uploadFile(formData).subscribe({
      next: (response: any) => {
        const uploadedFileReference = response.filePath;
        this.proceedingsFile_1 = uploadedFileReference
        this.CommissionerateSPFile = selectedFile.name;
        this.cdr.detectChanges();
        console.log("CommissionerateSPFile",this.CommissionerateSPFile)
      },
      error: (err) => {
        console.error('File upload failed:', err);
      }
    });
  }  
  viewCommissionerateSPFile(): void {
    if (this.proceedingsFile_1) {
      const url = `${env.file_access}${this.proceedingsFile_1}`;
      window.open(url, '_blank');
    }
  }
  
  
  removeCommissionerateSPFile(): void {
    this.proceedingsFile_1 = ''
    this.CommissionerateSPFile = '';
  }

saveAsDraft_6(isSubmit: boolean = false): void {
  // if (!this.firId) {
  //   Swal.fire('Error', 'FIR ID is missing. Unable to save as draft.', 'error');
  //   return;
  // }
  this.victimsRelief.controls.forEach((control) => {
    control.get('reliefAmountSecondStage')?.enable(); // Temporarily enable
  });
  // Prepare data to be sent to the backend
  const chargesheetData = {
    firId: this.firId,
    chargesheetDetails: {
      chargeSheetFiled: this.firForm.get('chargeSheetFiled')?.value || '',
      courtDistrict: this.firForm.get('courtDistrict')?.value || '',
      courtName: this.firForm.get('courtName')?.value || '',
      caseType: this.firForm.get('caseType')?.value || '',
      caseNumber: this.firForm.get('caseType')?.value === 'chargeSheet'
        ? this.firForm.get('caseNumber')?.value || ''
        : null,
      chargeSheetDate: this.firForm.get('caseType')?.value === 'chargeSheet'
        ? this.firForm.get('chargeSheetDate')?.value || null
        : null,
      rcsFileNumber: this.firForm.get('caseType')?.value === 'referredChargeSheet'
        ? this.firForm.get('rcsFileNumber')?.value || ''
        : null,
      rcsFilingDate: this.firForm.get('caseType')?.value === 'referredChargeSheet'
        ? this.firForm.get('rcsFilingDate')?.value || null
        : null,
      mfCopyPath: this.firForm.get('mfCopy')?.value || '',
      totalCompensation: parseFloat(this.firForm.get('totalCompensation_1')?.value || '0.00').toFixed(2),
      proceedingsFileNo: this.firForm.get('proceedingsFileNo_1')?.value || '',
      proceedingsDate: this.firForm.get('proceedingsDate_1')?.value || null,
      // uploadProceedingsPath: this.proceedingsFile_1 || '',
    },
    victimsRelief: this.victimsRelief.value.map((relief: any, index: number) => ({
      victimId: relief.victimId || null,
      victimName: this.victimNames[index] || '',
      reliefAmountScst: parseFloat(relief.reliefAmountScst_1 || '0.00').toFixed(2),
      reliefAmountExGratia: parseFloat(relief.reliefAmountExGratia_1 || '0.00').toFixed(2),
      reliefAmountSecondStage: parseFloat(relief.reliefAmountSecondStage || '0.00').toFixed(2),
    })),
    uploadProceedingsPath: this.proceedingsFile_1 ,
    attachments: this.attachments_1.value || '',
    status: 6, // Update status to 6 for the FIR
  };

  console.log(chargesheetData,"chargesheetData")
  console.log(this.victimsRelief.value,"victimsReliefvictimsRelief")
  

  // Call the service to send data to the backend
  this.firService.saveStepSixAsDraft(chargesheetData).subscribe(
    (response: any) => {
      Swal.fire({
        title: 'Success',
        text: 'Step 6 data saved and FIR status updated to 6 successfully.',
        icon: 'success',
      });
    },
    (error) => {
      console.error('Error saving Step 6 data:', error);
      Swal.fire('Error', 'Failed to save Step 6 data.', 'error');
    }
  );
}

isFormValid(): boolean {
  const trialDetails: Record<string, any> = {
      courtName: this.firForm.get('Court_name1')?.value,
      courtDistrict: this.firForm.get('courtDistrict')?.value,
      trialCaseNumber: this.firForm.get('trialCaseNumber')?.value,
      publicProsecutor: this.firForm.get('publicProsecutor')?.value,
      prosecutorPhone: this.firForm.get('prosecutorPhone')?.value,
      firstHearingDate: this.firForm.get('firstHearingDate')?.value,
      judgementAwarded: this.firForm.get('judgementAwarded')?.value,
      judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,
  };
  const compensationDetails: Record<string, any> = {
      totalCompensation: this.firForm.get('totalCompensation_2')?.value,
      proceedingsFileNo: this.firForm.get('proceedingsFileNo_2')?.value,
      proceedingsDate: this.firForm.get('proceedingsDate_2')?.value,
      uploadProceedings: this.firForm.get('uploadProceedings_2')?.value
  };
  let missingFields: string[] = [];
  // Check Trial Details
  Object.entries(trialDetails).forEach(([key, value]) => {
      if (!value) {
          missingFields.push(`Trial Details: ${key} is missing`);
      }
  });
  // Check Compensation Details
  Object.entries(compensationDetails).forEach(([key, value]) => {
      if (!value) {
          missingFields.push(`Compensation Details: ${key} is missing`);
      }
  });
  // Check Victims Details
  const victimsMissing = this.victimsRelief.controls.some(control => !control.get('victimId')?.value);
  if (victimsMissing) {
      missingFields.push("At least one victim is missing victimId");
  }
  // Log missing fields
  if (missingFields.length > 0) {
      console.log("Missing Fields:", missingFields);
      return false;
  }
  return true;
}

// saveAsDraft_7(): void {
//   if (!this.firId) {
//       Swal.fire('Error', 'FIR ID is missing. Unable to save draft.', 'error');
//       return;
//   }



//     const trialDetails = {
//         courtName: this.firForm.get('Court_name')?.value,
//         courtDistrict: this.firForm.get('courtDistrict')?.value,
//         trialCaseNumber: this.firForm.get('trialCaseNumber')?.value,
//         publicProsecutor: this.firForm.get('publicProsecutor')?.value,
//         prosecutorPhone: this.firForm.get('prosecutorPhone')?.value,
//         firstHearingDate: this.firForm.get('firstHearingDate')?.value,
//         judgementAwarded: this.firForm.get('judgementAwarded')?.value,
//         judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,
//     };

//     if (!trialDetails.judgementNature && trialDetails.judgementAwarded === 'yes') {
//         Swal.fire('Error', 'Please select the nature of judgement.', 'error');
//         return;
//     }

//   const compensationDetails = {
//       totalCompensation: this.firForm.get('totalCompensation_2')?.value,
//       proceedingsFileNo: this.firForm.get('proceedingsFileNo_2')?.value,
//       proceedingsDate: this.firForm.get('proceedingsDate_2')?.value,
//       uploadProceedings: this.firForm.get('uploadProceedings_2')?.value
//   };

//   const attachments = (this.firForm.get('attachments_2')?.value || []).map((attachment: any) => ({
//       fileName: attachment.file_2
//   }));

//   const victimsDetails = this.victimsRelief.value.map((relief: any, index: number) => ({
//       victimId: relief.victimId || null,
//       victimName: this.victimNames[index] || '',
//       reliefAmountAct: parseFloat(relief.reliefAmountScst || '0.00'),
//       reliefAmountGovernment: parseFloat(relief.reliefAmountExGratia || '0.00'),
//       reliefAmountFinalStage: parseFloat(relief.reliefAmountThirdStage || '0.00')
//   }));

//   const formData = {
//       firId: this.firId,
//       trialDetails,
//       compensationDetails,
//       attachments,
//       victimsDetails
//   };

//   this.firService.saveStepSevenAsDraft(formData).subscribe({
//       next: (response) => {
//           Swal.fire('Success', 'Draft data saved successfully.', 'success');
//       },
//       error: (error) => {
//           console.error('Error saving draft data:', error);
//           Swal.fire('Error', 'Failed to save draft data.', 'error');
//       }
//   });
// }




// async  saveAsDraft_7() {
//   // if (!this.firId) {
//   //     Swal.fire('Error', 'FIR ID is missing. Unable to save draft.', 'error');
//   //     return;
//   // }

//   let uploadJudgementPath: string | undefined;
//   const uploadJudgementFileFile = this.firForm.get('judgementDetails.uploadJudgement')?.value;
//   if (uploadJudgementFileFile) {
//     const paths = await this.uploadMultipleFiles([uploadJudgementFileFile]);
//     uploadJudgementPath = paths[0];
//   }

//     const trialDetails = {
//         courtName: this.firForm.get('Court_name')?.value,
//         courtDistrict: this.firForm.get('courtDistrict')?.value,
//         trialCaseNumber: this.firForm.get('trialCaseNumber')?.value,
//         publicProsecutor: this.firForm.get('publicProsecutor')?.value,
//         prosecutorPhone: this.firForm.get('prosecutorPhone')?.value,
//         firstHearingDate: this.firForm.get('firstHearingDate')?.value,
//         judgementAwarded: this.firForm.get('judgementAwarded')?.value,
//         judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,
//         uploadJudgement: uploadJudgementPath
//     };

//     if (!trialDetails.judgementNature && trialDetails.judgementAwarded === 'yes') {
//         Swal.fire('Error', 'Please select the nature of judgement.', 'error');
//         return;
//     }

//     let uploadproceedingPath: string | undefined;
//     const proceedingFile = this.firForm.get('uploadProceedings_2')?.value;
//     if (proceedingFile) {
//       const paths = await this.uploadMultipleFiles([proceedingFile]);
//       uploadproceedingPath = paths[0];
//     }
//   const compensationDetails = {
//       totalCompensation: this.firForm.get('totalCompensation_2')?.value,
//       proceedingsFileNo: this.firForm.get('proceedingsFileNo_2')?.value,
//       proceedingsDate: this.firForm.get('proceedingsDate_2')?.value,
//       uploadProceedings: uploadproceedingPath
//   };

//   const allFiles: File[] = [];
//   Object.values(this.fileStorage).forEach(files => {
//     allFiles.push(...files);
//   });

//   let attachments: string[] = [];
//   if (allFiles.length > 0) {
//     try {
//       attachments = await this.uploadMultipleFiles(allFiles);
//       console.log('Uploaded Files:', attachments);
//     } catch (error) {
//       console.error('Error uploading files:', error);
//       Swal.fire('Error', 'Failed to upload one or more files.', 'error');
//       return;
//     }
//   }


//   const victimsDetails = this.victimsRelief.value.map((relief: any, index: number) => ({
//       victimId: relief.victimId || null,
//       victimName: this.victimNames[index] || '',
//       reliefAmountAct: parseFloat(relief.reliefAmountScst || '0.00'),
//       reliefAmountGovernment: parseFloat(relief.reliefAmountExGratia || '0.00'),
//       reliefAmountFinalStage: parseFloat(relief.reliefAmountThirdStage || '0.00')
//   }));

//   const formData = {
//       firId: this.firId,
//       trialDetails,
//       compensationDetails,
//       attachments,
//       victimsDetails
//   };
// console.log(formData,"formData")
//   // this.firService.saveStepSevenAsDraft(formData).subscribe({
//   //     next: (response) => {
//   //         Swal.fire('Success', 'Draft data saved successfully.', 'success');
//   //     },
//   //     error: (error) => {
//   //         console.error('Error saving draft data:', error);
//   //         Swal.fire('Error', 'Failed to save draft data.', 'error');
//   //     }
//   // });
// }


uploadJudgementPreview_one: any | ArrayBuffer;
uploadJudgementSelect_one(event: any): void {
  const file = event.target.files?.[0];

  if (file) {
    console.log('File selected:', file.name, file);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.uploadJudgementPreview_one = e.target.result;
    };
    reader.readAsDataURL(file);

    this.uploadMultipleFiles(file)
      .then(paths => {
        console.log('Uploaded file path:', paths[0]);

        this.firForm.patchValue({
          judgementDetails_one: {
            uploadJudgement_one: paths[0]  
          }
        });
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  } else {
    console.log('No file selected');
    this.uploadJudgementPreview_one = null; 
  }
}

JudgementSelect_oneNew:string='';
uploadJudgementSelect_oneNew(event:any){
  const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    this.vmcSerive.uploadFile(formData).subscribe({
      next: (response: any) => {
        const uploadedFileReference = response.filePath;
        this.firForm.get('judgementDetails_one.uploadJudgement_one')?.setValue(uploadedFileReference);
        this.JudgementSelect_oneNew = selectedFile.name;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('File upload failed:', err);
      }
    });
}

viewUploadJudgementSelect_oneNew(){
  if (this.firForm.get('judgementDetails_one.uploadJudgement_one')?.value) {
      const url = `${env.file_access}${this.firForm.get('judgementDetails_one.uploadJudgement_one')?.value}`;
      window.open(url, '_blank');
    }
}

removeuploadJudgementSelect_oneNew(){
this.firForm.get('judgementDetails_one.uploadJudgement_one')?.setValue(null);
    this.JudgementSelect_oneNew = '';
}


JudgementSelect_Two:string='';
uploadJudgementSelect_twoNew(event:any){
  const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    this.vmcSerive.uploadFile(formData).subscribe({
      next: (response: any) => {
        const uploadedFileReference = response.filePath;
        this.firForm.get('judgementDetails_one.uploadJudgement_two')?.setValue(uploadedFileReference);
        this.JudgementSelect_Two = selectedFile.name;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('File upload failed:', err);
      }
    });
}

viewUploadJudgementSelect_TwoNew(){
  if (this.firForm.get('judgementDetails_one.uploadJudgement_two')?.value) {
      const url = `${env.file_access}${this.firForm.get('judgementDetails_one.uploadJudgement_two')?.value}`;
      window.open(url, '_blank');
    }
}

removeuploadJudgementSelect_TwoNew(){
  this.firForm.get('judgementDetails_one.uploadJudgement_two')?.setValue(null);
  this.JudgementSelect_Two = '';
}


uploadJudgementPreview_two: any | ArrayBuffer;
uploadJudgementSelect_two(event: any): void {
  const file = event.target.files?.[0];

  if (file) {
    console.log('File selected:', file.name, file);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.uploadJudgementPreview_two = e.target.result;
    };
    reader.readAsDataURL(file);

    this.uploadMultipleFiles(file)
      .then(paths => {
        console.log('Uploaded file path:', paths[0]);

        this.firForm.patchValue({
          judgementDetails_two: {
            uploadJudgement_two: paths[0]  
          }
        });
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  } else {
    console.log('No file selected');
    this.uploadJudgementPreview_two = null; 
  }
}

judgementnew:string='';
uploadJudgementSelectNew(event:any){
  const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    this.vmcSerive.uploadFile(formData).subscribe({
      next: (response: any) => {
        const uploadedFileReference = response.filePath;
        this.firForm.get('judgementDetails.uploadJudgement')?.setValue(uploadedFileReference);
        this.judgementnew = selectedFile.name;
        console.log('judgementnew',this.judgementnew);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('File upload failed:', err);
      }
    });
}
  
viewjudgementnew(){
   if (this.firForm.get('judgementDetails.uploadJudgement')?.value) {
      const url = `${env.file_access}${this.firForm.get('judgementDetails.uploadJudgement')?.value}`;
      window.open(url, '_blank');
    }
}
removejudgementnew(){
  this.firForm.get('judgementDetails.uploadJudgement')?.setValue(null);
    this.judgementnew = '';
}
// .... thisis for proceeeding file 
uploadProceedings_2_preview: string | ArrayBuffer | null = null; 

uploadProceedings_2(event: any): void {
  const file = event.target.files?.[0];

  if (file) {
    console.log('File selected:', file.name, file);

 
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.uploadProceedings_2_preview = e.target.result;
    };
    reader.readAsDataURL(file);

    this.uploadMultipleFiles(file)
      .then(paths => {
        console.log('Uploaded file path:', paths[0]);

    
        this.firForm.patchValue({
          uploadProceedings: paths[0] 
        });
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  } else {
    console.log('No file selected');
    this.uploadProceedings_2_preview = null;
  }
}

// async saveAsDraft_7(isSubmit: boolean = false)  {
//    if (!this.firId) {
//       Swal.fire('Error', 'FIR ID is missing. Unable to save draft.', 'error');
//       return;
//    }

//    const formData = new FormData();
//    const formDatavalues = this.firForm.value
//   const judgementNature = this.firForm.get('judgementDetails')?.value; 
//   console.log("Judgement Nature:", judgementNature);
  
//   const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
  
//   // Check if the file input exists and has files
//   if (fileInput && fileInput.files && fileInput.files[0]) {
//     console.log(fileInput.files[0]);
//   }

//   let uploadJudgementPath: string | undefined;
//   const uploadJudgementFileFile = this.firForm.get('judgementDetails.uploadJudgement')?.value;
//   if (uploadJudgementFileFile) {
//     const paths = await this.uploadMultipleFiles([uploadJudgementFileFile]);
//     uploadJudgementPath = paths[0];
//   }

//     const trialDetails = {
//         courtName: this.firForm.get('Court_name1')?.value,
//         courtDistrict: this.firForm.get('courtDistrict')?.value,
//         trialCaseNumber: this.firForm.get('trialCaseNumber')?.value,
//         publicProsecutor: this.firForm.get('publicProsecutor')?.value,
//         prosecutorPhone: this.firForm.get('prosecutorPhone')?.value,
//         firstHearingDate: this.firForm.get('firstHearingDate')?.value,
//         judgementAwarded: this.firForm.get('judgementAwarded')?.value,
//         judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,
//         Conviction_Type: this.firForm.get('judgementDetails.Conviction_Type')?.value,
//         uploadJudgement: uploadJudgementPath
//     };

//     if (!trialDetails.judgementNature && trialDetails.judgementAwarded === 'yes') {
//         Swal.fire('Error', 'Please select the nature of judgement.', 'error');
//         return;
//     }

//     let uploadproceedingPath: string | undefined;
//     const proceedingFile = this.firForm.get('uploadProceedings_2')?.value;
//     if (proceedingFile) {
//       const paths = await this.uploadMultipleFiles([proceedingFile]);
//       uploadproceedingPath = paths[0];
//     }
//   const compensationDetails = {
//       totalCompensation: this.firForm.get('totalCompensation_2')?.value,
//       proceedingsFileNo: this.firForm.get('proceedingsFileNo_2')?.value,
//       proceedingsDate: this.firForm.get('proceedingsDate_2')?.value,
//       uploadProceedings: uploadproceedingPath
//   }
//   // const allNames = formData.getAll("name");
//   // formData.forEach((value, key) => {
//   //   console.log(key + ": " + value);
//   // });
//   // const hearingdetail = this.hearingDetails.value
//   // const formDatavalues = this.firForm.value
//   const formFields = {
//     firId: this.firId,

//     // Trial Details
//     trialDetails: {

   

// courtName: this.firForm.get('Court_name1')?.value,
// courtDistrict: this.firForm.get('courtDistrict')?.value,
// trialCaseNumber: this.firForm.get('caseNumber')?.value,
// publicProsecutor: this.firForm.get('publicProsecutor')?.value,
// prosecutorPhone: this.firForm.get('prosecutorPhone')?.value,
// firstHearingDate: this.firForm.get('firstHearingDate')?.value,
// CaseHandledBy: this.firForm.get('CaseHandledBy')?.value,
// NameOfAdvocate: this.firForm.get('NameOfAdvocate')?.value,
// advocateMobNumber: this.firForm.get('advocateMobNumber')?.value,
// judgementAwarded: this.firForm.get('judgementAwarded')?.value,
// judgementAwarded1:this.firForm.get('judgementAwarded1')?.value,

// judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,
// uploadJudgement: this.firForm.get('judgementDetails.uploadJudgement')?.value,
// Conviction_Type: this.firForm.get('judgementDetails.Conviction_Type')?.value,
//     },


//     trialDetails_one: {
//       courtName: this.firForm.get('Court_name1')?.value,
//       courtDistrict: this.firForm.get('courtDistrict_one')?.value,
//       trialCaseNumber: this.firForm.get('caseNumber_one')?.value,
//       publicProsecutor: this.firForm.get('publicProsecutor_one')?.value,
//       prosecutorPhone: this.firForm.get('prosecutorPhone_one')?.value,
//       firstHearingDate: this.firForm.get('firstHearingDate_one')?.value,

//       judgementAwarded:this.firForm.get('judgementAwarded_one')?.value,
 
//       judgementNature: this.firForm.get('judgementDetails_one.judgementNature_one')?.value,
//       uploadJudgement: this.firForm.get('judgementDetails_one.uploadJudgement_one')?.value,
//       Conviction_Type: this.firForm.get('judgementDetails_one.Conviction_Type_one')?.value,
//   },
//   trialDetails_two: {
//     courtName: this.firForm.get('Court_name1')?.value,
//     courtDistrict: this.firForm.get('courtDistrict_two')?.value,
//     trialCaseNumber: this.firForm.get('caseNumber_two')?.value,
//     publicProsecutor: this.firForm.get('publicProsecutor_two')?.value,
//     prosecutorPhone: this.firForm.get('prosecutorPhone_two')?.value,
//     firstHearingDate: this.firForm.get('firstHearingDate_two')?.value,

 
//     judgementAwarded:this.firForm.get('judgementAwarded2')?.value,

//     judgementNature: this.firForm.get('judgementDetails_two.judgementNature_two')?.value,
//     uploadJudgement: this.firForm.get('judgementDetails_two.uploadJudgement_two')?.value,
//     Conviction_Type: this.firForm.get('judgementDetails_two.Conviction_Type_two')?.value,
// },

    
//     // Compensation Details
//     compensationDetails: {
//       totalCompensation: this.firForm.get('totalCompensation')?.value,
//       proceedingsDate: this.firForm.get('proceedingsDate')?.value,
//       proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value,
//       uploadProceedings: this.firForm.get('uploadProceedings')?.value,
//     },

//     compensationDetails_1: {
//       totalCompensation: this.firForm.get('totalCompensation_1')?.value,
//       proceedingsDate: this.firForm.get('proceedingsDate_1')?.value,
//       proceedingsFileNo: this.firForm.get('proceedingsFileNo_1')?.value,
//       uploadProceedings: this.firForm.get('uploadProceedings_1')?.value,
//     },
//     compensationDetails_2: {
//       totalCompensation: this.firForm.get('totalCompensation_2')?.value,
//       proceedingsDate: this.firForm.get('proceedingsDate_2')?.value,
//       proceedingsFileNo: this.firForm.get('proceedingsFileNo_2')?.value,
//       uploadProceedings: this.firForm.get('uploadProceedings_2')?.value,
//     },
//     hearingdetail : {
     
//       hearingDetails: formDatavalues.hearingDetails,
//       hearingDetails_one: formDatavalues.hearingDetails_one,
//       hearingDetails_two: formDatavalues.hearingDetails_two,

//     },
//     // Appeal Details
//     appealDetails: {
//       legalOpinionObtained: this.firForm.get('judgementDetails.legalOpinionObtained')?.value,
//       caseFitForAppeal: this.firForm.get('judgementDetails.caseFitForAppeal')?.value,
//       governmentApprovalForAppeal: this.firForm.get('judgementDetails.governmentApprovalForAppeal')?.value,
//       filedBy: this.firForm.get('judgementDetails.filedBy')?.value,
//       designatedCourt: this.firForm.get('judgementDetails.designatedCourt')?.value,
//       judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,

//     },
    
   
//     // Appeal Details One
//     appealDetailsOne: {
//       legalOpinionObtained: this.firForm.get('judgementDetails_one.legalOpinionObtained_one')?.value,
//       caseFitForAppeal: this.firForm.get('judgementDetails_one.caseFitForAppeal_one')?.value,
//       governmentApprovalForAppeal: this.firForm.get('judgementDetails_one.governmentApprovalForAppeal_one')?.value,
//       filedBy: this.firForm.get('judgementDetails_one.filedBy_one')?.value,
//       designatedCourt: this.firForm.get('judgementDetails_one.designatedCourt_one')?.value,
//       judgementNature: this.firForm.get('judgementDetails.judgementNature_one')?.value,

//     },
    
//     // Case Appeal Details Two
//     caseAppealDetailsTwo: {
//       legalOpinionObtained: this.firForm.get('judgementDetails_two.legalOpinionObtained_two')?.value,
//       caseFitForAppeal: this.firForm.get('judgementDetails_two.caseFitForAppeal_two')?.value,
//       governmentApprovalForAppeal: this.firForm.get('judgementDetails_two.governmentApprovalForAppeal_two')?.value,
//       filedBy: this.firForm.get('judgementDetails_two.filedBy_two')?.value,
//       judgementNature: this.firForm.get('judgementDetails.judgementNature_two')?.value,

//     },

//     victimsRelief: this.victimsRelief.value.map((relief: any, index: number) => ({

//       victimId: relief.victimId || null,
//       victimName: this.victimNames[index] || '',
//       reliefAmountScst_2: parseFloat(relief.reliefAmountScst_2 || '0.00').toFixed(2),
//       reliefAmountExGratia_2: parseFloat(relief.reliefAmountExGratia_2 || '0.00').toFixed(2),
//       reliefAmountThirdStage: parseFloat(relief.reliefAmountThirdStage || '0.00').toFixed(2),
//     })),
    
//     // Submission Status
//     status: isSubmit ? 7 : undefined,
//   };

//   const allFiles: File[] = [];
//   Object.values(this.fileStorage).forEach(files => {
//     allFiles.push(...files);
//   });

//   let attachments: string[] = [];
//   if (allFiles.length > 0) {
//     try {
//       attachments = await this.uploadMultipleFiles(allFiles);
//       console.log('Uploaded Files:', attachments);
//     } catch (error) {
//       console.error('Error uploading files:', error);
//       Swal.fire('Error', 'Failed to upload one or more files.', 'error');
//       return;
//     }
//   }

//   Object.keys(formFields).forEach((key) => {
//     const value = formFields[key as keyof typeof formFields];
//     if (value !== null && value !== undefined) {
//       formData.append(key, JSON.stringify(value));
//     }
//   });
//   const formDataObject: any = {};
//   formData.forEach((value, key) => {
//     formDataObject[key] = value;
//   });
//   console.log(formDataObject, '📝 Final formDataObject');
  


//   this.firService.saveStepSevenAsDraft(formDataObject).subscribe({
//       next: (response) => {
//           Swal.fire('Success', 'Draft data saved successfully.', 'success');
//       },
//       error: (error) => {
//           console.error('Error saving draft data:', error);
//           Swal.fire('Error', 'Failed to save draft data.', 'error');
//       }
//   });
// }

async saveAsDraft_7(isSubmit: boolean = false) {
  if (!this.firId) {
    Swal.fire('Error', 'FIR ID is missing. Unable to save draft.', 'error');
    return;
  }

  const formDatavalues = this.firForm.value;

  // Upload judgement file if it exists
  let uploadJudgementPath: string | undefined;
  const uploadJudgementFile = this.firForm.get('judgementDetails.uploadJudgement')?.value;
  if (uploadJudgementFile) {
    const paths = await this.uploadMultipleFiles([uploadJudgementFile]);
    uploadJudgementPath = paths[0];
  }

  // Upload proceedings file if it exists
  let uploadProceedingPath: string | undefined;
  const proceedingFile = this.firForm.get('uploadProceedings_2')?.value;
  if (proceedingFile) {
    const paths = await this.uploadMultipleFiles([proceedingFile]);
    uploadProceedingPath = paths[0];
  }

  // Build the JSON payload
  const payload: any = {
    firId: this.firId,
    status: isSubmit ? 7 : undefined,

    trialDetails: {
      courtName: this.firForm.get('Court_name1')?.value,
      courtDistrict: this.firForm.get('courtDistrict')?.value,
      trialCaseNumber: this.firForm.get('caseNumber')?.value,
      publicProsecutor: this.firForm.get('publicProsecutor')?.value,
      prosecutorPhone: this.firForm.get('prosecutorPhone')?.value,
      firstHearingDate: this.firForm.get('firstHearingDate')?.value,
      CaseHandledBy: this.firForm.get('CaseHandledBy')?.value,
      NameOfAdvocate: this.firForm.get('NameOfAdvocate')?.value,
      advocateMobNumber: this.firForm.get('advocateMobNumber')?.value,
      judgementAwarded: this.firForm.get('judgementAwarded')?.value,
      judgementAwarded1: this.firForm.get('judgementAwarded1')?.value,
      judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,
      Conviction_Type: this.firForm.get('judgementDetails.Conviction_Type')?.value,
      uploadJudgement: uploadJudgementPath
    },

    trialDetails_one: {
      courtName: this.firForm.get('Court_name1')?.value,
      courtDistrict: this.firForm.get('courtDistrict_one')?.value,
      trialCaseNumber: this.firForm.get('caseNumber_one')?.value,
      publicProsecutor: this.firForm.get('publicProsecutor_one')?.value,
      prosecutorPhone: this.firForm.get('prosecutorPhone_one')?.value,
      firstHearingDate: this.firForm.get('firstHearingDate_one')?.value,
      judgementAwarded: this.firForm.get('judgementAwarded_one')?.value,
      judgementNature: this.firForm.get('judgementDetails_one.judgementNature_one')?.value,
      uploadJudgement: this.firForm.get('judgementDetails_one.uploadJudgement_one')?.value,
      Conviction_Type: this.firForm.get('judgementDetails_one.Conviction_Type_one')?.value
    },

    trialDetails_two: {
      courtName: this.firForm.get('Court_name1')?.value,
      courtDistrict: this.firForm.get('courtDistrict_two')?.value,
      trialCaseNumber: this.firForm.get('caseNumber_two')?.value,
      publicProsecutor: this.firForm.get('publicProsecutor_two')?.value,
      prosecutorPhone: this.firForm.get('prosecutorPhone_two')?.value,
      firstHearingDate: this.firForm.get('firstHearingDate_two')?.value,
      judgementAwarded: this.firForm.get('judgementAwarded2')?.value,
      judgementNature: this.firForm.get('judgementDetails_two.judgementNature_two')?.value,
      uploadJudgement: this.firForm.get('judgementDetails_two.uploadJudgement_two')?.value,
      Conviction_Type: this.firForm.get('judgementDetails_two.Conviction_Type_two')?.value
    },

    compensationDetails: {
      totalCompensation: this.firForm.get('totalCompensation')?.value,
      proceedingsDate: this.firForm.get('proceedingsDate')?.value,
      proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value,
      uploadProceedings: this.firForm.get('uploadProceedings')?.value
    },
    compensationDetails_1: {
      totalCompensation: this.firForm.get('totalCompensation_1')?.value,
      proceedingsDate: this.firForm.get('proceedingsDate_1')?.value,
      proceedingsFileNo: this.firForm.get('proceedingsFileNo_1')?.value,
      uploadProceedings: this.firForm.get('uploadProceedings_1')?.value
    },
    compensationDetails_2: {
      totalCompensation: this.firForm.get('totalCompensation_2')?.value,
      proceedingsDate: this.firForm.get('proceedingsDate_2')?.value,
      proceedingsFileNo: this.firForm.get('proceedingsFileNo_2')?.value,
      uploadProceedings: uploadProceedingPath
    },

    hearingdetail: {
      hearingDetails: formDatavalues.hearingDetails,
      hearingDetails_one: formDatavalues.hearingDetails_one,
      hearingDetails_two: formDatavalues.hearingDetails_two
    },

    appealDetails: {
      legalOpinionObtained: this.firForm.get('judgementDetails.legalOpinionObtained')?.value,
      caseFitForAppeal: this.firForm.get('judgementDetails.caseFitForAppeal')?.value,
      governmentApprovalForAppeal: this.firForm.get('judgementDetails.governmentApprovalForAppeal')?.value,
      filedBy: this.firForm.get('judgementDetails.filedBy')?.value,
      designatedCourt: this.firForm.get('judgementDetails.designatedCourt')?.value,
      judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value
    },

    appealDetailsOne: {
      legalOpinionObtained: this.firForm.get('judgementDetails_one.legalOpinionObtained_one')?.value,
      caseFitForAppeal: this.firForm.get('judgementDetails_one.caseFitForAppeal_one')?.value,
      governmentApprovalForAppeal: this.firForm.get('judgementDetails_one.governmentApprovalForAppeal_one')?.value,
      filedBy: this.firForm.get('judgementDetails_one.filedBy_one')?.value,
      designatedCourt: this.firForm.get('judgementDetails_one.designatedCourt_one')?.value,
      judgementNature: this.firForm.get('judgementDetails.judgementNature_one')?.value
    },

    caseAppealDetailsTwo: {
      legalOpinionObtained: this.firForm.get('judgementDetails_two.legalOpinionObtained_two')?.value,
      caseFitForAppeal: this.firForm.get('judgementDetails_two.caseFitForAppeal_two')?.value,
      governmentApprovalForAppeal: this.firForm.get('judgementDetails_two.governmentApprovalForAppeal_two')?.value,
      filedBy: this.firForm.get('judgementDetails_two.filedBy_two')?.value,
      judgementNature: this.firForm.get('judgementDetails.judgementNature_two')?.value
    },

    victimsRelief: this.victimsRelief.value.map((relief: any, index: number) => ({
      victimId: relief.victimId || null,
      victimName: this.victimNames[index] || '',
      reliefAmountScst_2: parseFloat(relief.reliefAmountScst_2 || '0.00').toFixed(2),
      reliefAmountExGratia_2: parseFloat(relief.reliefAmountExGratia_2 || '0.00').toFixed(2),
      reliefAmountThirdStage: parseFloat(relief.reliefAmountThirdStage || '0.00').toFixed(2)
    }))
  };

  // Upload all attachments
  const allFiles: File[] = [];
  Object.values(this.fileStorage).forEach(files => {
    allFiles.push(...files);
  });

  if (allFiles.length > 0) {
    try {
      const attachments = await this.uploadMultipleFiles(allFiles);
      payload.attachments = attachments; // Add file paths
    } catch (error) {
      console.error('Error uploading files:', error);
      Swal.fire('Error', 'Failed to upload one or more files.', 'error');
      return;
    }
  }

  console.log(payload, '📝 Final Payload');

  // Submit JSON payload
  this.firService.saveStepSevenAsDraft(payload).subscribe({
    next: (response) => {
      Swal.fire('Success', 'Draft data saved successfully.', 'success');
    },
    error: (error) => {
      console.error('Error saving draft data:', error);
      Swal.fire('Error', 'Failed to save draft data.', 'error');
    }
  });
}



getFiles(inputId: string): FileList | null {
  const fileInput = document.getElementById(inputId) as HTMLInputElement;
  // console.log(fileInput.files);
  return fileInput?.files && fileInput.files.length > 0 ? fileInput.files : null;
}
formDataToObject(formData: FormData): Record<string, any> {
  const obj: Record<string, any> = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}
// saveStepSevenAsDraft(isSubmit: boolean = false): void {
//   const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
//   if (fileInput.files && fileInput.files[0]) {
//     console.log(fileInput.files[0]);
//   }

//   const formData = new FormData();

//   // Check if a file is selected
//   // if (fileInput.files && fileInput.files[0]) {
//   //   // Append the file to FormData
//   //   formData.append("file", fileInput.files[0]);
//   // }

//   // Append other data (convert boolean and number to strings)
//   formData.append("name", String(true));  // Convert boolean to string
//   formData.append("name1", String(72));    // Convert number to string

//   // To get all the values associated with "name"
//   const allNames = formData.getAll("name");
//   formData.forEach((value, key) => {
//     console.log(key + ": " + value);
//   });

//   // Append non-file form fields to FormData
//   const formFields = {
//     firId: this.firId,
//     Court_name: this.firForm.get('Court_name')?.value,
//     courtDistrict: this.firForm.get('courtDistrict')?.value,
//     caseNumber: this.firForm.get('caseNumber')?.value,
//     publicProsecutor: this.firForm.get('publicProsecutor')?.value,
//     prosecutorPhone: this.firForm.get('prosecutorPhone')?.value,
//     firstHearingDate: this.firForm.get('firstHearingDate')?.value,
//     judgementAwarded: this.firForm.get('judgementAwarded')?.value,
//     judgementAwarded1: this.firForm.get('judgementAwarded1')?.value,
//     judgementAwarded2: this.firForm.get('judgementAwarded2')?.value,
//     judgementAwarded3: this.firForm.get('judgementAwarded3')?.value,
//     judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,
//     legalOpinionObtained: this.firForm.get('judgementDetails.legalOpinionObtained')?.value,
//     caseFitForAppeal: this.firForm.get('judgementDetails.caseFitForAppeal')?.value,
//     governmentApprovalForAppeal: this.firForm.get('judgementDetails.governmentApprovalForAppeal')?.value,
//     filedBy: this.firForm.get('judgementDetails.filedBy')?.value,
//     designatedCourt: this.firForm.get('judgementDetails.designatedCourt')?.value,
//     Court_one: this.firForm.get('Court_one')?.value,
//     courtDistrict_one: this.firForm.get('courtDistrict_one')?.value,
//     caseNumber_one: this.firForm.get('caseNumber_one')?.value,
//     publicProsecutor_one: this.firForm.get('publicProsecutor_one')?.value,
//     prosecutorPhone_one: this.firForm.get('prosecutorPhone_one')?.value,
//     firstHearingDate_one: this.firForm.get('firstHearingDate_one')?.value,
//     judgementAwarded_one: this.firForm.get('judgementAwarded_one')?.value,
//     judgementNature_one: this.firForm.get('judgementDetails_one.judgementNature_one')?.value,
//     caseFitForAppeal_one: this.firForm.get('judgementDetails_one.caseFitForAppeal_one')?.value,
//     governmentApprovalForAppeal_one: this.firForm.get('judgementDetails_one.governmentApprovalForAppeal_one')?.value,
//     legalOpinionObtained_one: this.firForm.get('judgementDetails_one.legalOpinionObtained_one')?.value,
//     filedBy_one: this.firForm.get('judgementDetails_one.filedBy_one')?.value,
//     designatedCourt_one: this.firForm.get('judgementDetails_one.designatedCourt_one')?.value,
//     Court_three: this.firForm.get('Court_three')?.value,
//     courtDistrict_two: this.firForm.get('courtDistrict_two')?.value,
//     caseNumber_two: this.firForm.get('caseNumber_two')?.value,
//     publicProsecutor_two: this.firForm.get('publicProsecutor_two')?.value,
//     prosecutorPhone_two: this.firForm.get('prosecutorPhone_two')?.value,
//     firstHearingDate_two: this.firForm.get('firstHearingDate_two')?.value,
//     judgementAwarded_two: this.firForm.get('judgementAwarded_two')?.value,
//     judgementNature_two: this.firForm.get('judgementDetails_two.judgementNature_two')?.value,
//     legalOpinionObtained_two: this.firForm.get('judgementDetails_two.legalOpinionObtained_two')?.value,
//     caseFitForAppeal_two: this.firForm.get('judgementDetails_two.caseFitForAppeal_two')?.value,
//     governmentApprovalForAppeal_two: this.firForm.get('judgementDetails_two.governmentApprovalForAppeal_two')?.value,
//     filedBy_two: this.firForm.get('judgementDetails_two.filedBy_two')?.value,
//     hearingDetails: JSON.stringify(this.firForm.get('hearingDetails')?.value),
//     hearingDetails_one: JSON.stringify(this.firForm.get('hearingDetails_one')?.value),
//     hearingDetails_two: JSON.stringify(this.firForm.get('hearingDetails_two')?.value),
//     totalCompensation: this.firForm.get('totalCompensation')?.value,
//     proceedingsDate: this.firForm.get('proceedingsDate')?.value,
//     proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value,
//     status: isSubmit ? 7 : undefined,
//   };

//   this.imagePreviews.forEach(image => {
//     formData.append('images', image.file, image.file.name);
//   });


//   // Append form fields to FormData
//   Object.keys(formFields).forEach((key) => {
//     const value = formFields[key as keyof typeof formFields];
//     formData.append(key, String(value));  // Convert value to string to avoid type issues
//   });




//   // List of fields that have file inputs
//   const filesFields = ['uploadJudgement', 'uploadJudgement_one', 'uploadJudgement_two','uploadProceedings'];

//   // Add files to FormData
//   filesFields.forEach((field) => {
//     const files = this.getFiles(field);  // Get the FileList for the file input field
//     console.log(field);
//     console.log(files);
//     if (files) {
//       for (let i = 0; i < files.length; i++) {
//         formData.append(field, files[i]);  // Append each file to FormData
//       }
//     }
//   });
//   const formDataObject = this.formDataToObject(formData);

//   console.log(formDataObject);
//   console.log("formFields");
//   // console.log(formData1);

//   // Now send the formData to the backend
//   this.firService.saveStepSevenAsDraft(formData).subscribe({
//     next: (response) => {
//       if (isSubmit) {
//         Swal.fire({
//           title: 'Success',
//           text: 'FIR Stage Form Completed! Redirecting to Chargesheet...',
//           icon: 'success',
//           confirmButtonText: 'OK',
//         }).then(() => {
//           this.navigateToChargesheetPage();
//         });
//       } else {
//         Swal.fire('Success', 'Step 5 data saved as draft successfully', 'success');
//       }
//     },
//     error: (error) => {
//       console.error('Error saving Step 5 data:', error);
//       Swal.fire('Error', 'Failed to save Step 5 data', 'error');
//     }
//   });

// }



  isVictimNameInvalid(index: number): boolean {
    const nameControl = this.victims.at(index).get('name');
    return nameControl?.invalid && nameControl?.touched ? true : false;
  }

  isVictimMobileInvalid(index: number): boolean {
    const mobileControl = this.victims.at(index)?.get('mobileNumber');
    return !!(mobileControl?.invalid && mobileControl?.touched);
  }

  isGuardianNameInvalid(index: number): boolean {
    const guardianNameControl = this.victims.at(index).get('guardianName');
    return guardianNameControl?.invalid && guardianNameControl?.touched ? true : false;
  }

  isDeceasedPersonNameInvalid(index: number): boolean {
    const deceasedNameControl = this.victims.at(index).get('deceasedPersonName');
    return deceasedNameControl?.invalid && deceasedNameControl?.touched ? true : false;
  }

  isVictimPincodeInvalid(index: number): boolean {
    const pincodeControl = this.victims.at(index)?.get('victimPincode');
    return !!(pincodeControl?.invalid && pincodeControl?.touched);
  }
  handleStepOne(type: string) {
    const firData = {
      ...this.firForm.value,


    };

    //console.log('Sending Step 1 Data:', firData); // Log data sent to backend

    this.firService.handleStepOne(this.firId, firData).subscribe(
      (response: any) => {
        //console.log('Response from backend:', response); // Log backend response

        if (!this.firId) {
          this.firId = response.fir_id; // Set FIR ID after initial creation
          if (this.firId) { // Ensure firId is not null
            localStorage.setItem('firId', this.firId.toString());
          }
        }


        if (type === 'manual') {
          this.step++;
        }
        Swal.fire('Success', `Step 1 handled successfully`, 'success');
      },
      (error) => {
        //console.error('Error handling Step 1:', error); // Log the error
        Swal.fire('Error', `Failed to handle Step 1`, 'error');
      }
    );
  }

  submitStepFive(): void {
    this.saveStepFiveAsDraft(true);
    this.updateFirStatus(5); // Calls Step 5 save with submission flag
  }

  submitStepSix(): void {
    const caseType = this.firForm.get('caseType')?.value;

    if (caseType === 'referredChargeSheet') {
      this.updateFirStatus_1();
    } else if (caseType === 'chargeSheet') {
      // Continue the process as usual
      this.saveAsDraft_6(true);
    } else {
      console.error('Invalid case type or case type not selected');
    }
  }

// Update FIR Status to 12 with SweetAlert
updateFirStatus_1(): void {
  if (!this.firId) {
    Swal.fire('Error', 'FIR ID is missing!', 'error');
    return;
  }

  this.firService.updateFirStatus_1(this.firId, 9).subscribe({
    next: (response) => {
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: 'This case is now marked as Mistake of Fact.',
      });
    },
    error: (error) => {
      Swal.fire('Error', 'Failed to update FIR status to Mistake of Fact.', 'error');
      console.error('Error updating FIR status:', error);
    },
  });
}



dateTimeValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
      const dateOfOccurrence = formGroup.get('dateOfOccurrence')?.value;
      const timeOfOccurrence = formGroup.get('timeOfOccurrence')?.value || '00:00';
      const dateOfRegistration = formGroup.get('dateOfRegistration')?.value;
      const timeOfRegistration = formGroup.get('timeOfRegistration')?.value || '00:00';

      if (dateOfOccurrence && dateOfRegistration) {
          const occurrenceDateTime = new Date(`${dateOfOccurrence}T${timeOfOccurrence}`);
          const registrationDateTime = new Date(`${dateOfRegistration}T${timeOfRegistration}`);

          if (registrationDateTime <= occurrenceDateTime) {
              return { invalidRegistrationDateTime: true };
          }
      }
      return null;
  };
}



  navigateToChargesheetPage(): void {
    // Set mainStep to 2 for Chargesheet Stage, assuming 1 is for FIR Stage
    this.mainStep = 2;
    this.step = 1; // Reset to the first sub-step of Chargesheet Stage
  }


  // onFileSelect1(event: any, index: number) {
  //   const files = event.target.files;
  //   const filesArray = Array.from(files); // Convert FileList to an array

  //   // Update the 'files' form control with the selected files
  //   this.attachments.at(index).get('files')?.setValue(filesArray);

  //   // Trigger change detection to update the UI
  //   this.cdr.detectChanges();
  // }


  // onSubmit(): void {
  //   console.log('Submitting form with step:', this.step); // Log current step

  //   if (this.step === 1 || this.step === 2) {
  //     if (this.firForm.valid) {
  //       console.log('Form is valid. Proceeding to handleStepOne.');
  //       this.handleStepOne('manual');
  //     } else {
  //       console.warn('Form is invalid. Please fill in all required fields.');
  //       Swal.fire('Error', 'Please fill in all required fields.', 'error');
  //     }
  //   } else if (this.step === 6) {
  //     // Skip validations for Step 6 and directly submit or update status
  //     console.log(`Submitting without validation for step ${this.step}.`);
  //     this.submitStepSix();
  //   } else {
  //     console.log(`Static form submission at step ${this.step}.`);
  //     Swal.fire('Info', `Step ${this.step} is a static form, no insertion.`, 'info');
  //     this.nextStep();
  //   }
  // }




  trackStep1FormValidity() {
    this.firForm.statusChanges.subscribe(() => {
      this.nextButtonDisabled = !this.isStep1Valid(); // Enable if Step 1 is valid
      this.cdr.detectChanges(); // Trigger change detection
    });
  }




// Check if the current step is valid
isStepValid(): boolean {
  if (this.step === 1) {
    return this.isStep1Valid();
  } else if (this.step === 2) {
    return this.isStep2Valid();
  } else if (this.step === 3) {
    return this.isStep3Valid();
  } else if (this.step === 4) {
    return this.isStep4Valid();
  } else if (this.step === 5) {
    return this.isStep5Valid();
  }
  return false;
}


isTabEnabled(stepNumber: number): boolean {
  // Enable only the current step or any previous step
  return stepNumber <= this.step;
}
// Check Step 1 validity
isStep1Valid(): boolean {
  const controls = [
    'policeCity',
    'policeZone',
    'policeRange',
    'revenueDistrict',

    'stationName',
    'officerName',
    'officerDesignation',
    'officerPhone',



  ];

  return controls.every((controlName) => this.firForm.get(controlName)?.valid === true);
}

isStep2Valid(): boolean {
  const controls = [
    'firNumber',
    'firNumberSuffix',
    'dateOfOccurrence',
    'timeOfOccurrence',
    'placeOfOccurrence',
    'dateOfRegistration',
    'timeOfRegistration',
  ];

  // Check if all required controls are valid
  const allControlsValid = controls.every((controlName) => this.firForm.get(controlName)?.valid === true);

  // Check for the custom validation error
  const noCustomErrors = !this.firForm.hasError('invalidRegistrationDateTime');

  // Return true only if all controls are valid and there are no custom errors
  return allControlsValid && noCustomErrors;
}



// Check Step 3 validity
isStep3Valid(): boolean {
  // Check if the complainant details section is valid
  const complainantDetails = this.firForm.get('complainantDetails');
  const isComplainantValid = complainantDetails ? complainantDetails.valid === true : false;

  // Check if the victims form array is valid
  const victimsValid = this.victims.controls.every(victim => victim.valid === true);

  // Check if the 'isDeceased' and 'deceasedPersonNames' fields are valid
  const isDeceased = this.firForm.get('isDeceased')?.value;
  const isDeceasedValid = isDeceased !== '' &&
                          (isDeceased === 'no' || (this.firForm.get('deceasedPersonNames')?.valid === true));
  const isValuePresent = this.firForm.get('deceasedPersonNames')?.value?.length !== 0;

  // Ensure all conditions return a boolean
  return Boolean(isComplainantValid && victimsValid && isDeceasedValid && isValuePresent);
}


isStep6Valid(): boolean {
  console.log('Form validity:', this.firForm.valid);

  const caseType = this.firForm.get('caseType')?.value;
  console.log('Selected caseType:', caseType);

  // Define fields to validate based on caseType
  let controls: string[] = [];

  if (caseType === 'chargeSheet') {
    // Validate fields specific to `chargeSheet`
    controls = [
      'caseNumber',
      'chargeSheetDate',
      'chargeSheetFiled',
      'courtDistrict',
      'courtName',
      'caseType',
      'reliefAmountScst_1',
      'reliefAmountExGratia_1',
      'reliefAmountSecondStage',
      'totalCompensation_1',
      'proceedingsFileNo_1',
      'proceedingsDate_1',
      'uploadProceedings_1',
    ];
    // Reset `referredChargeSheet` specific fields

  } else if (caseType === 'referredChargeSheet') {
    // Validate fields specific to `referredChargeSheet`
    controls = [
      'rcsFileNumber',
      'rcsFilingDate',
      'mfCopy',
      'chargeSheetFiled',
      'courtDistrict',
      'courtName',
      'caseType',
    ];


  } else {
    // If no caseType is selected, mark form as invalid
    console.error('Invalid caseType selected.');
    return false;
  }

  // Perform validation for all relevant fields
  const allValid = controls.every((controlName) => {
    const control = this.firForm.get(controlName);

    if (control) {
      control.markAsTouched(); // Trigger validation visuals
      if (!control.valid) {
        console.log(`${controlName} is invalid`, control.errors);
      }
    }

    return control ? control.valid : true;
  });

  return allValid;
}
resetFields(fields: string[]): void {
  fields.forEach((field) => {
    const control = this.firForm.get(field);
    if (control) {
      control.reset();
      control.clearValidators();
      control.updateValueAndValidity();
    }
  });
}








// validateStepOne(): boolean {
//   const stepOneFields = ['policeCity', 'policeZone', 'policeRange', 'revenueDistrict', 'stationName', 'officerName', 'officerDesignation', 'officerPhone'];
//   let isValid = true;
//   stepOneFields.forEach(field => {
//     if (this.firForm.get(field)?.invalid) {
//       this.firForm.get(field)?.markAsTouched();
//       isValid = false;
//     }
//   });
//   return isValid;
// }

validateStepOne(mode: 'next' | 'draft'): boolean {
  const stepOneFields = ['policeCity', 'policeZone', 'policeRange', 'revenueDistrict', 'stationName', 'officerName', 'officerDesignation', 'officerPhone'];

  if (mode === 'draft') {
    return stepOneFields.some(field => {
      const control = this.firForm.get(field);
      return control && control.value !== null && control.value !== undefined && control.value !== '';
    });
  } else {
    let isValid = true;
    stepOneFields.forEach(field => {
      if (this.firForm.get(field)?.invalid) {
        this.firForm.get(field)?.markAsTouched();
        isValid = false;
      }
    });
    return isValid;
  }
}

trackStepOneChanges() {
  const stepOneFields = ['policeCity', 'policeZone', 'policeRange', 'revenueDistrict', 'stationName', 'officerName', 'officerDesignation', 'officerPhone'];

  stepOneFields.forEach(field => {
    this.firForm.get(field)?.valueChanges.subscribe(() => {
      this.isStepOneModified = true;
    });
  });
}

validateStepTwo(mode: 'next' | 'draft'): boolean {
  const stepOneFields = ['firNumber', 'firNumberSuffix', 'dateOfOccurrence', 'timeOfOccurrence', 'placeOfOccurrence', 'dateOfRegistration', 'timeOfRegistration'];

  if (mode === 'draft') {
    return stepOneFields.some(field => {
      const control = this.firForm.get(field);
      return control && control.value !== null && control.value !== undefined && control.value !== '';
    });
  } else {
    let isValid = true;
    stepOneFields.forEach(field => {
      if (this.firForm.get(field)?.invalid) {
        this.firForm.get(field)?.markAsTouched();
        isValid = false;
      }
    });
    return isValid;
  }
}

trackStepTwoChanges() {
  const stepOneFields = ['firNumber', 'firNumberSuffix', 'dateOfOccurrence', 'timeOfOccurrence', 'placeOfOccurrence', 'dateOfRegistration', 'timeOfRegistration','is_case_altered','altered_date'];

  stepOneFields.forEach(field => {
    this.firForm.get(field)?.valueChanges.subscribe(() => {
      this.isStepTwoModified = true;
    });
  });
}

// validateStepThree(mode: 'next' | 'draft'): boolean {
//   const victimArray = this.firForm.get('victims') as FormArray;
//   console.log("victim array",victimArray);

//   if (!victimArray || !(victimArray instanceof FormArray)) {
//     return false; 
//   }

//   if (mode === 'draft') {
//     return victimArray.controls.some(control => 
//       Object.values(control.value).some(val => val !== null && val !== undefined && val !== '')
//     );
//   } else {
//     let isValid = true;

//     // Validate each victim
//     victimArray.controls.forEach((control) => {
//       if (control instanceof FormGroup) {
//         Object.keys(control.controls).forEach(field => {
//           const fieldControl = control.get(field);
//           if (fieldControl?.invalid) {
//             fieldControl.markAsTouched();
//             isValid = false;
//           }
//         });
//       }
//     });

//     return isValid;
//   }
// }

validateStepThree(mode: 'next' | 'draft'): boolean {
  const victimArray = this.firForm.get('victims') as FormArray;
  const complainantDetails = this.firForm.get('complainantDetails') as FormGroup;

  console.log("Victim Array:", victimArray);
  console.log("Complainant Details:", complainantDetails);

  if (!victimArray || !(victimArray instanceof FormArray) || !complainantDetails || !(complainantDetails instanceof FormGroup)) {
    return false; // Ensure both are valid
  }

  if (mode === 'draft') {
    // Check if at least one field in "victims" FormArray has a value
    const hasVictimData = victimArray.controls.some(control =>
      Object.values(control.value).some(val => val !== null && val !== undefined && val !== '')
    );

    // Check if at least one field in "complainantDetails" has a value
    const hasComplainantData = Object.values(complainantDetails.value).some(val =>
      val !== null && val !== undefined && val !== ''
    );

    return hasVictimData || hasComplainantData; // Allow draft if any field has a value
  } else {
    let isValid = true;

    // Validate each victim in the "victims" FormArray
    victimArray.controls.forEach((control) => {
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(field => {
          const fieldControl = control.get(field);
          if (fieldControl?.invalid) {
            fieldControl.markAsTouched();
            isValid = false;
          }
        });
      }
    });

    // Validate each field in "complainantDetails"
    Object.keys(complainantDetails.controls).forEach(field => {
      const fieldControl = complainantDetails.get(field);
      if (fieldControl?.invalid) {
        fieldControl.markAsTouched();
        isValid = false;
      }
    });

    return isValid;
  }
}

trackStepThreeChanges() {
  const victimArray = this.firForm.get('victims') as FormArray;
  const complainantDetails = this.firForm.get('complainantDetails') as FormGroup;

  if (!victimArray || !complainantDetails) {
    return;
  }

  // Unsubscribe previous subscriptions to avoid duplicate listeners
  if (this.victimChangeSubscription) {
    this.victimChangeSubscription.forEach((sub:any) => sub.unsubscribe());
  }
  this.complainantChangeSubscription?.unsubscribe();

  // Initialize subscription array
  this.victimChangeSubscription = [];

  // Track changes for each victim field individually
  victimArray.controls.forEach((control, index) => {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(field => {
        const sub = control.get(field)?.valueChanges.subscribe(() => {
          console.log(`Victim ${index} - Field ${field} changed`);
          this.isStepThreeModified = true;
        });
        this.victimChangeSubscription.push(sub);
      });
    }
  });

  // Track changes in complainantDetails FormGroup
  this.complainantChangeSubscription = complainantDetails.valueChanges.subscribe(() => {
    console.log(`ComplainantDetails changed`);
    this.isStepThreeModified = true;
  });
}



nextStep(): void {
  this.nextButtonClicked = true; 
  if (this.step === 1 ) {
    if (!this.validateStepOne('next')) {
      Swal.fire('Error', 'Please fill in all required fields before proceeding.', 'error');
      return;
    }
    if (this.isStepOneModified) {
      this.saveStepOneAsDraft();
      this.updateFirStatus(1);
      this.isStepOneModified = false;
    }
    this.step++;
  } else if (this.step === 2 && this.isStep2Valid()) {
    if (this.isStepTwoModified) {
    this.saveStepTwoAsDraft();
    this.updateFirStatus(2);
    this.isStepTwoModified = false;
    }
    this.step++;
  } else if (this.step === 3 && this.isStep3Valid()) {
    if (this.isStepThreeModified) {
    this.saveStepThreeAsDraft();
    this.updateFirStatus(3);
    this.isStepThreeModified = false;
    }
    this.step++;
  } else if (this.step === 4 && this.isStep4Valid()) {
    this.saveStepFourAsDraft();
    this.updateFirStatus(4); // Update status for step 4
    this.loadVictimsReliefDetails();

    this.step++;
  } else if (this.step === 5 && this.isStep5Valid()) {
    this.submitStepFive(); // Final submission for Step 5
    this.updateFirStatus(5); // Update status for step 5 on submission

  } else {
    // Show an error message if the required fields are not filled
    Swal.fire('Error', 'Please fill in all required fields before proceeding.', 'error');
  }

  this.nextButtonClicked = false; // Reset the flag after navigation
}





// Method to update FIR status
updateFirStatus(status: number): void {
  if (this.firId) {
    this.firService.updateFirStatus(this.firId, status).subscribe(
      (response: any) => {
      },
      (error) => {
        //console.error('Error updating FIR status:', error);
        Swal.fire('Error', 'Failed to update FIR status.', 'error');
      }
    );
  }
}



navigateToStep(stepNumber: number): void {
  this.step = stepNumber; // Update the current step
  this.cdr.detectChanges(); // Trigger UI update
  if (stepNumber === 5) {
    this.loadVictimsReliefDetails(); // Fetch victim relief details only for step 5
  }
}




isStep4Valid(): boolean {
  const numberOfAccusedValid = !!this.firForm.get('numberOfAccused')?.valid;
  const accusedsArray = this.firForm.get('accuseds') as FormArray;

 
  const accusedsValid = accusedsArray.controls.every((accusedGroup) => !!accusedGroup.valid);


  return numberOfAccusedValid && accusedsValid;
}



// mahi changes 
// isStep5Valid(): boolean {
//   const mandatoryFields = ['proceedingsFileNo', 'proceedingsDate'];

//   const isFormValid = mandatoryFields.every((field) => {
//     const control = this.firForm.get(field);
//     const value = control?.value;
//     const isValid = control?.disabled || (control?.valid && value !== null && value !== '');

//     console.log(`Field: ${field}, Value: ${value}, Valid: ${isValid}`);

//     return isValid;
//   });


//   const victimsReliefArray = this.firForm.get('victimsRelief') as FormArray;
//   const isCommunityCertificateValid = victimsReliefArray.controls.every((victimGroup: any, index: any) => {
//     const control = victimGroup.get('communityCertificate');
//     const value = control?.value;
//     const isValid = control?.disabled || (control?.valid && value !== null && value !== '');

//     console.log(`Victim ${index + 1} - Community Certificate: ${value}, Valid: ${isValid}`);

//     return isValid;
//   });


//   const hasAttachments = Array.isArray(this.attachments?.value) && this.attachments.value.length > 0;

 
//   const hasProceedingsFile = this.proceedingsFile instanceof File;

//   return isFormValid && isCommunityCertificateValid && hasAttachments && hasProceedingsFile;
// }
isStep5Valid(): boolean {
  const mandatoryFields = ['proceedingsFileNo', 'proceedingsDate'];

  const isFormValid = mandatoryFields.every((field) => {
    const control = this.firForm.get(field);
    const value = control?.value;
    const isValid = control?.disabled || (control?.valid && value !== null && value !== '');
    return isValid;
  });

  const victimsReliefArray = this.firForm.get('victimsRelief') as FormArray;
  const isCommunityCertificateValid = victimsReliefArray.controls.every((victimGroup: any) => {
    const control = victimGroup.get('communityCertificate');
    const value = control?.value;
    const isValid = control?.disabled || (control?.valid && value !== null && value !== '');
    return isValid;
  });

  const hasAttachments = Array.isArray(this.attachments?.value)
    && this.attachments.value.length > 0
    && this.attachments.controls.every(control => !!control.get('file')?.value);

  const hasProceedingsFile = !!this.firForm.get('proceedingsFile')?.value;

  return isFormValid && isCommunityCertificateValid && hasAttachments && hasProceedingsFile;
}



isSubmitButtonEnabled(): boolean {
  return this.isStep5Valid();
}















  // previousStep() {
  //   if (this.step > 1) {
  //     this.step--;
  //   }
  // }

  previousStep() {
    if (this.step > 1) {
      this.step--; 
      console.log("if");
    } else if (this.mainStep > 1 && this.step === 1) {
      this.mainStep--;
      this.step = this.getLastStepOfMainStep(this.mainStep);
      console.log("else");
    }
    this.cdr.detectChanges(); 
  }

  previousMainStep() {
    if (this.mainStep > 1) {
      this.mainStep -= 1;
    }
  }

  getLastStepOfMainStep(mainStep: number): number {
    switch (mainStep) {
      case 1: return 5; 
      case 2: return 1; 
      case 3: return 1;
      default: return 1;
    }
  }

  setStep(stepNumber: number) {
    this.step = stepNumber;
  }

  onIsDeceasedChange(index: number) {
    const victim = this.victims.at(index);
    const isDeceased = victim.get('isDeceased')?.value;

    if (isDeceased === 'yes') {
      // If "Yes", make the deceased person's name field required
      victim.get('deceasedPersonName')?.setValidators(Validators.required);
    } else {
      // If "No", reset and clear validators for the deceased person's name field
      victim.get('deceasedPersonName')?.reset();
      victim.get('deceasedPersonName')?.clearValidators();
    }

    victim.get('deceasedPersonName')?.updateValueAndValidity(); // Update the validation state
  }

  onIsArrestedChange(index: number) {
    const accused = this.accuseds.at(index);
    if (accused.get('isArrested')?.value) {
      accused.get('reasonForNonArrest')?.reset();
    }
  }

  onPreviousIncidentsChange(index: number) {
    const accused = this.accuseds.at(index);
    const previousIncident = accused.get('previousIncident')?.value;

    if (previousIncident) {
      // If "Yes", make the previous FIR fields required
      accused.get('previousFIRNumber')?.setValidators(Validators.required);
      accused.get('previousFIRNumberSuffix')?.setValidators(Validators.required);
    } else {
      // If "No", reset and clear validators for the previous FIR fields
      accused.get('previousFIRNumber')?.reset();
      accused.get('previousFIRNumber')?.clearValidators();
      accused.get('previousFIRNumberSuffix')?.reset();
      accused.get('previousFIRNumberSuffix')?.clearValidators();
    }

    accused.get('previousFIRNumber')?.updateValueAndValidity();
    accused.get('previousFIRNumberSuffix')?.updateValueAndValidity();
  }

  onScstOffencesChange(index: number) {
    const accused = this.accuseds.at(index);
    const scstOffence = accused.get('scstOffence')?.value;

    if (scstOffence) {
      // If "Yes", make the SC/ST FIR fields required
      accused.get('scstFIRNumber')?.setValidators(Validators.required);
      accused.get('scstFIRNumberSuffix')?.setValidators(Validators.required);
    } else {
      // If "No", reset and clear validators for the SC/ST FIR fields
      accused.get('scstFIRNumber')?.reset();
      accused.get('scstFIRNumber')?.clearValidators();
      accused.get('scstFIRNumberSuffix')?.reset();
      accused.get('scstFIRNumberSuffix')?.clearValidators();
    }

    accused.get('scstFIRNumber')?.updateValueAndValidity();
    accused.get('scstFIRNumberSuffix')?.updateValueAndValidity();
  }



  onFileDrop(event: any): void {
    this.processFiles(event);
  }
    // Handle when a file is dragged over the drop zone
    onFileOver(event: any): void {
      this.isFileOver = true; // You can change styling here for drag-over effect
    }
  onFileLeave(event: any): void {
    this.isFileOver = false; // Reset styling when file leaves the drop zone
  }



  // Process files for preview and upload
  processFiles(files: FileList | File[]): void {
    const newFiles = Array.from(files); // Convert to array if it's a FileList

    newFiles.forEach(file => {
      if (file instanceof File) { // Make sure it's a File (could be needed for type safety)

        // Optional: Check if the file is an image
        if (!file.type.startsWith('image/')) {
          console.error('Invalid file type:', file.type);
          return; // Skip non-image files
        }

        const reader = new FileReader();

        // Once file is loaded, push preview to the array
        reader.onload = (e: any) => {
          // Push the file and its Data URL to the imagePreviews array
          this.imagePreviews.push({ file: file, url: e.target.result });
        };

        // Handle errors in reading the file
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        // Read file as a Data URL (base64 string)
        reader.readAsDataURL(file);
      }
    });
  }


  // Remove an image from preview array
  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }



  onJudgementSelectionChangehearing(event: any): void {
    const value = event.target.value;
    console.log(value);
    if (value === 'yes') {
      this.firForm.get('judgementDetails.judgementNature')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails.uploadJudgement')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails.judgementNature')?.clearValidators();
      this.firForm.get('judgementDetails.uploadJudgement')?.clearValidators();
      this.hideCompensationSection = true;
    }

    this.firForm.get('judgementDetails.judgementNature')?.updateValueAndValidity();
    this.firForm.get('judgementDetails.uploadJudgement')?.updateValueAndValidity();
    this.hideCompensationSection = true;
  }

  onJudgementSelectionChange_one(event: any): void {
    const value = event.target.value;

    if (value === 'yes') {
      this.firForm.get('judgementDetails_one.judgementNature_one')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.setValidators([Validators.required]);

      // Clear validators for hearingDetails_one (if any)
      this.hearingDetails_one.controls.forEach((control) => {
        control.get('nextHearingDate_one')?.clearValidators();
        control.get('reasonNextHearing_one')?.clearValidators();
        control.get('nextHearingDate_one')?.updateValueAndValidity();
        control.get('reasonNextHearing_one')?.updateValueAndValidity();

      });
    } else if (value === 'no') {
      this.firForm.get('judgementDetails_one.judgementNature_one')?.clearValidators();
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.clearValidators();
      this.firForm.get('judgementDetails_one.judgementNature_one')?.updateValueAndValidity();
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.updateValueAndValidity();
      this.hideCompensationSection = true;
      // Set validators for hearingDetails_one
      this.hearingDetails_one.controls.forEach((control) => {
        control.get('nextHearingDate_one')?.setValidators([Validators.required]);
        control.get('reasonNextHearing_one')?.setValidators([Validators.required]);
        control.get('nextHearingDate_one')?.updateValueAndValidity();
        control.get('reasonNextHearing_one')?.updateValueAndValidity();
      });
    }

    this.cdr.detectChanges(); // Ensure UI updates
  }


  onJudgementSelectionChangehearing1(event: any): void {
    const value = event.target.value;

    if (value === 'yes') {
      this.firForm.get('judgementDetails_one.judgementNature_one')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.setValidators([Validators.required]);

      // Clear validators for hearingDetails_one (if any)
      this.hearingDetails_one.controls.forEach((control) => {
        control.get('nextHearingDate_one')?.clearValidators();
        control.get('reasonNextHearing_one')?.clearValidators();
        control.get('nextHearingDate_one')?.updateValueAndValidity();
        control.get('reasonNextHearing_one')?.updateValueAndValidity();

      });
    } else if (value === 'no') {
      this.firForm.get('judgementDetails_one.judgementNature_one')?.clearValidators();
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.clearValidators();
      this.firForm.get('judgementDetails_one.judgementNature_one')?.updateValueAndValidity();
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.updateValueAndValidity();
      this.hideCompensationSection = true;
      // Set validators for hearingDetails_one
      this.hearingDetails_one.controls.forEach((control) => {
        control.get('nextHearingDate_one')?.setValidators([Validators.required]);
        control.get('reasonNextHearing_one')?.setValidators([Validators.required]);
        control.get('nextHearingDate_one')?.updateValueAndValidity();
        control.get('reasonNextHearing_one')?.updateValueAndValidity();
      });
    }

    this.cdr.detectChanges(); // Ensure UI updates
  }


  onJudgementSelectionChange_two(event: any): void {
    const value = event.target.value;
    if (value === 'yes') {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.clearValidators();
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.clearValidators();
      this.hideCompensationSection = true;
    }
    this.firForm.get('judgementDetails_two.judgementNature_two')?.updateValueAndValidity();
    this.firForm.get('judgementDetails_two.uploadJudgement_two')?.updateValueAndValidity();
    this.hideCompensationSection = true;
  }

  onJudgementSelectionChangehearing2(event: any): void {
    const value = event.target.value;
    if (value === 'yes') {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.clearValidators();
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.clearValidators();
      this.hideCompensationSection = true;
    }
    this.firForm.get('judgementDetails_two.judgementNature_two')?.updateValueAndValidity();
    this.firForm.get('judgementDetails_two.uploadJudgement_two')?.updateValueAndValidity();
    this.hideCompensationSection = true;
  }

  onJudgementNatureChange_two(): void {
    const judgementNature = this.firForm.get('judgementDetails_two.judgementNature_two')?.value;
    if (judgementNature === 'Convicted_two') {
      this.showLegalOpinionObtained_two = false;
      this.showFiledBy_two = false;
      this.showDesignatedCourt_two = false;
      this.hideCompensationSection = false;
    } else if (judgementNature === 'Acquitted_two') {
      this.showLegalOpinionObtained_two = true;
      this.showFiledBy_two = true;
      this.showDesignatedCourt_two = true;
      this.hideCompensationSection = true;
    }
  }




  // async uploadMultipleFiles(files: File[]): Promise<string[]> {
  //   const uploadedPaths: string[] = [];

  //   for (const file of files) {
  //     try {
  //       const filePath = await this.uploadFile(file);
  //       uploadedPaths.push(filePath);
  //     } catch (error) {
  //       console.error('File upload failed:', error);
  //     }
  //   }

  //   return uploadedPaths;
  // }


  // uploadFile(file: File): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     if (!file) {
  //       reject('No file provided');
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append('file', file);

  //     this.firService.uploadFile(formData).subscribe(
  //       (response) => resolve(response.filePath),
  //       (error) => reject(error)
  //     );
  //   });
  // }


  // async uploadMultipleFiles(files: File | File[]): Promise<string[]> {
  //   // Ensure files is always an array
  //   const fileArray = Array.isArray(files) ? files : [files];
    
  //   const uploadPromises = fileArray.map(file => this.uploadFile(file));
  //   return Promise.all(uploadPromises);
  // }

  async uploadMultipleFiles(files: File | File[]): Promise<string[]> {
    // If no file is provided, return an empty array
    if (!files) return [];
  
    // Ensure files is always an array
    const fileArray = Array.isArray(files) ? files : [files];
  
    // Filter out any invalid file values (optional, to prevent processing invalid data)
    const validFiles = fileArray.filter(file => file instanceof File);
    
    // If no valid files remain, stop execution
    if (validFiles.length === 0) return [];
  
    // Upload each valid file
    const uploadPromises = validFiles.map(file => this.uploadFile(file));
  
    return Promise.all(uploadPromises);
  }

  uploadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('No file provided');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      this.firService.uploadFile(formData).subscribe({
        next: (response) => resolve(response.filePath),
        error: (error) => reject(error)
      });
    });
  }

  proceedingfile2:string='';

  onuploadproceedSelect(event: any): void {
    // const file = event.target.files[0];  // Get the first selected file
  
    // if (file) {
   
    //   // Patch the file into the form (this assumes you have the form control set up correctly)
    //   this.firForm.patchValue({
    //     uploadProceedings_2: file,  // Storing the file in the form control
    //   });
  
    //   // Optionally, display the file name
    //   console.log('File selected:', file.name);
    // } else {
    //   console.log('No file selected');
    // }
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    this.vmcSerive.uploadFile(formData).subscribe({
      next: (response: any) => {
        const uploadedFileReference = response.filePath;
        this.firForm.get('uploadProceedings_2')?.setValue(uploadedFileReference);
        this.proceedingfile2 = selectedFile.name;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('File upload failed:', err);
      }
    });
  }

  viewProceed2(): void {
    if (this.firForm.get('uploadProceedings_2')?.value) {
      const url = `${env.file_access}${this.firForm.get('uploadProceedings_2')?.value}`;
      window.open(url, '_blank');
    }
  }
  
  
  removeProceed2(): void {
    this.firForm.get('uploadProceedings_2')?.setValue(null);
    this.proceedingfile2 = '';
  }

  onFileSelect_2New(event: any, index: number, fileControl: string, fileNameControl: string): void {
  const selectedFile = event.target.files[0];
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append('file', selectedFile);

  this.vmcSerive.uploadFile(formData).subscribe({
    next: (response: any) => {
      const uploadedFileReference = response.filePath;
      const attachment = this.attachments_2.at(index);
      attachment.patchValue({
        [fileControl]: uploadedFileReference,
        [fileNameControl]: selectedFile.name,
      });
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('File upload failed:', err);
    }
  });
}
viewAttachment_2(index: number): void {
  const filePath = this.attachments_2.at(index)?.get('file')?.value;
  if (filePath) {
    const url = `${env.file_access}${filePath}`;
    window.open(url, '_blank');
  }
}


  uploadJudgementSelect(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0]; // Get the first selected file
      
      // Ensure the form control exists
      if (this.firForm.get('judgementDetails')) {
        this.firForm.get('judgementDetails.uploadJudgement')?.setValue(file); // Store the file object
      }
  
      // Optionally, display the file name
      console.log('File selected:', file.name);
    } else {
      console.log('No file selected');
    }
  }
  

  onCaseHandledByChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.show94BAnd94C = selectedValue === 'Empanelled advocate' || selectedValue === 'Private advocate selected by the victim';
    this.show95Onwards = selectedValue === 'Special Public Prosecutor';
    this.show97Onwards = selectedValue === 'Empanelled advocate' || selectedValue === 'Private advocate selected by the victim';
  }

  getDesignation(event:any){
    console.log(event.target.value);
    const designationValue = event.target.value;
    if(designationValue  == "Others"){
      this.showOtherDesignation = true;
    }
    else{
      this.showOtherDesignation = false;
    }
  }

  getDesignationName(event: any) {
    this.otherDesignation = event.target.value;
    // console.log(this.otherDesignation);
    this.firForm.patchValue({ officerDesignation: `Others - ${this.otherDesignation}` });
    // console.log(this.firForm.get('officerDesignation')?.value);
  }

  isActExcluded(act: string): boolean {
    const excluded = [
      '100 percent incapacitation',
      'Disability: Incapacitation greater than 50',
      'Disability: Incapacitation less than 50',
      'Rape',
      'Gang Rape',
      'Murder',
      '3(2)(v), 3(2)(va)',
      '3(2)(va)'
    ];
    return excluded.includes(act);
  }

  removeSelectedOffence(index: number, offenceName: string): void {
    const selected = this.victims.at(index).get('offenceCommitted')?.value || [];
    const updated = selected.filter((item: string) => item !== offenceName);
    this.victims.at(index).get('offenceCommitted')?.setValue(updated);
  }
}
  