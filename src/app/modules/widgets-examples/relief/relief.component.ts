import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FirService } from 'src/app/services/fir.service';
import { ReliefService } from 'src/app/services/relief.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// import { forkJoin } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of, forkJoin, Observable } from 'rxjs';

import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-relief',
  templateUrl: './relief.component.html',
  styleUrls: ['./relief.component.scss'],
  // standalone: true,
  // imports: [CommonModule, ReactiveFormsModule],
})
export class ReliefComponent implements OnInit {
  tabs: string[] = ['First Installment', 'Second Installment', 'Third Installment'];
  currentTab: number = 0;
  reliefForm!: FormGroup;
  firId: string | undefined;
  firDetails: any;

  file_access = environment.file_access;

  form: FormGroup;
  existingFilePath: string | null;
  existingFilePath_relief_2: string | null;
  existingFilePath_relief_3: string | null;
  showFileInput: boolean = true;
  showFileInput_2: boolean = true;
  showFileInput_3: boolean = true;

  enabledTabs: boolean[] = [false, false, false]; // Dynamic enabling of tabs
  public isDialogVisible: boolean = false;
  victimsReliefDetails: any = [];
  secondFormVictimInformation: any = [];
  trialReliefDetails: any = [];
  RemoveFormUpload: any;

  constructor(
    private fb: FormBuilder,
    private firService: FirService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ReliefService: ReliefService,
    private modalService: NgbModal,
  ) {
    this.form = this.fb.group({
      firstInstallmentUploadDocument: ['']
    });
  }
  loading = true;
  userData: any;
  isDisable: boolean = false;
  ngOnInit(): void {
    const JsonData = sessionStorage.getItem('user_data');
    this.userData = JsonData ? JSON.parse(JsonData) : {};
    this.isDisable = this.userData.role == 3;
    this.initializeForm();
    if (this.isDisable) {
      this.disableEntireForm();
    }
    this.firId = this.getFirIdFromRouter();
    if (this.firId) {
      this.fetchFirStatus(this.firId); // Fetch status

      forkJoin([
        this.fetchFirDetails(this.firId), // Fetch FIR details
        this.fetchVictimDetails(this.firId),
        this.fetchSecondInstallmentDetails(this.firId), // Fetch victim details
        this.fetchThirdInstallmentDetails(this.firId)
      ]).subscribe({
        next: () => {
          this.loading = false; // Mark loading as complete
          this.cdr.detectChanges(); // Ensure UI updates
        },
        error: (err) => {
          console.log(err)
          console.error('Error fetching initial data:', err);
          this.loading = false;
        },
      });
      this.GetInstallmemtList(this.firId);
    } else {
      console.error('No FIR ID found.');
      this.router.navigate(['/']); // Redirect if FIR ID is missing
    }
  }

  disableEntireForm(): void {
    this.reliefForm.disable();

    // // Also explicitly disable any nested FormArrays if needed
    // const victimArrays = ['victims', 'secondInstallmentVictims', 'thirdInstallmentVictims'];
    // victimArrays.forEach(arrayName => {
    //   const formArray = this.reliefForm.get(arrayName) as FormArray;
    //   formArray.controls.forEach(group => group.disable());
    // });
  }





  // Get FIR ID from Router State or Query Params
  private getFirIdFromRouter(): string | undefined {
    const navigation = this.router.getCurrentNavigation();
    return navigation?.extras?.state?.['firId'] || this.activatedRoute.snapshot.queryParams['fir_id'];
  }

  // Fetch FIR Details based on FIR ID
  // private fetchFirDetails(firId: string): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.firService.getFirDetails(firId).subscribe({
  //       next: (details: any) => {
  //         this.firDetails = details;
  //         this.patchFirDetailsToForm(this.firDetails);
  //         resolve();
  //       },
  //       error: (err: any) => {
  //         console.error('Error fetching FIR details:', err);
  //         reject(err);
  //       },
  //     });
  //   });
  // }


  private fetchFirStatus(firId: string): void {
    this.firService.getFirStatus(firId).subscribe({
      next: (response: any) => {
        const status = response.status;

        // if (status >= 5) this.enabledTabs[0] = true;
        // if (status >= 6) this.enabledTabs[1] = true;
        // if (status >= 7) this.enabledTabs[2] = true;
      },
      error: (err: any) => {
        console.error('Error fetching FIR status:', err);
      },
    });
  }
  // Patch FIR details to the form
  private patchFirDetailsToForm(details: any): void {
    this.reliefForm.patchValue({
      firNumber: details.fir_number || 'N/A',
      policeStationDetails: details.police_station || 'N/A',
      dateOfReporting: details.date_of_registration || '',
      dateOfOccurrence: details.date_of_occurrence || '',
      natureOfOffence: details.nature_of_offence || 'N/A',
      placeOfOccurrence: details.place_of_occurrence || 'N/A',
      numberOfVictims: details.number_of_victim || '0',
      numberOfAccused: details.number_of_accused || '0',
    });
  }

  initializeForm(): void {
    this.reliefForm = this.fb.group({
      firNumber: ['', Validators.required],
      policeStationDetails: ['', Validators.required],
      placeOfOccurrence: ['', Validators.required],
      numberOfVictims: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      numberOfAccused: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      victims: this.fb.array([this.createVictimFormGroup()]),
      secondInstallmentVictims: this.fb.array([]),
      firstInstallmentUploadDocument: ['', Validators.required],
      firstInstallmentDateOfDisbursement: ['', Validators.required],
      firstInstallmentProceedingsFileDate: [null, Validators.required],
      firstInstallmentProceedingsFileNumber: ['', Validators.required],
      firstInstallmentPfmsPortalUploaded: ['', Validators.required],
      // proceedingsReceiptDate: ['', Validators.required],
      secondInstallmentProceedingsFileNumber: ['', Validators.required],
      secondInstallmentProceedingsFileDate: ['', Validators.required],
      secondInstallmentUploadDocument: ['', Validators.required],
      secondInstallmentPfmsPortalUploaded: ['', Validators.required],
      secondInstallmentDateOfDisbursement: ['', Validators.required],
      thirdInstallmentProceedingsFileNumber: ['', Validators.required],
      thirdInstallmentProceedingsFileDate: ['', Validators.required],
      thirdInstallmentUploadDocument: ['', Validators.required],
      thirdInstallmentPfmsPortalUploaded: ['', Validators.required],
      thirdInstallmentDateOfDisbursement: ['', Validators.required],
      thirdInstallmentVictims: this.fb.array([]),
    });
  }


  // private fetchVictimDetails(firId: string): void {
  //   this.ReliefService.getVictimsReliefDetails_1(firId).subscribe({
  //     next: (response: any) => {
  //       console.log('Fetched Victim Details:', response);

  //       if (response?.victimsReliefDetails) {
  //         this.populateVictimFields(response.victimsReliefDetails);
  //       } else {
  //         console.error('Invalid response structure:', response);
  //       }
  //     },
  //     error: (err: any) => {
  //       console.error('Error fetching victim details:', err);
  //     },
  //   });
  // }



  // private fetchSecondInstallmentDetails(firId: string): void {
  //   this.ReliefService.getSecondInstallmentDetails(firId).subscribe({
  //     next: (response: any) => {
  //       console.log('Fetched Second Installment Victim Details:', response);

  //       // Adjusted to handle the correct key
  //       if (response?.victims && Array.isArray(response.victims)) {
  //         this.populateSecondInstallmentVictimFields(response.victims);
  //       } else {
  //         console.error('Invalid response structure:', response);
  //       }
  //     },
  //     error: (err: any) => {
  //       console.error('Error fetching second installment details:', err);
  //     },
  //   });
  // }
  // private fetchThirdInstallmentDetails(firId: string): void {
  //   this.ReliefService.getThirdInstallmentDetails(firId).subscribe({
  //     next: (response: any) => {
  //       console.log('Raw Third Installment Response:', response);

  //       // Updated the key to match the actual response structure
  //       const trialReliefDetails = response?.trialReliefDetails || [];
  //       console.log('Resolved trialReliefDetails:', trialReliefDetails);

  //       if (Array.isArray(trialReliefDetails)) {
  //         this.populateThirdInstallmentVictimFields(trialReliefDetails);
  //       } else {
  //         console.error('Invalid response structure for Third Installment:', response);
  //       }
  //     },
  //     error: (err: any) => {
  //       console.error('Error fetching third installment details:', err);
  //     },
  //   });
  // }





  get secondInstallmentVictimsArray(): FormArray {
    return this.reliefForm.get('secondInstallmentVictims') as FormArray;
  }

  get thirdInstallmentVictimsArray(): FormArray {
    return this.reliefForm.get('thirdInstallmentVictims') as FormArray;
  }



  private populateVictimFields(victims: any[]): void {
    const victimsArray = this.victimsArray;
    victimsArray.clear(); // Clear existing controls

    victims.forEach((victim) => {
      victimsArray.push(this.createVictimFormGroup(victim)); // Add each victim to FormArray
    });

    this.cdr.detectChanges(); // Trigger UI updates
  }






  private populateSecondInstallmentVictimFields(victims: any[]): void {
    const victimControls = this.secondInstallmentVictimsArray;

    // Clear existing controls and repopulate with new data
    victimControls.clear();

    victims.forEach((victim) => {
      const group = this.createVictimFormGroup({
        victimId: victim.victim_id, // Map victim_id
        chargesheetId: victim.chargesheet_id, // Map chargesheet_id
        secondInstallmentVictimName: victim.secondInstallmentVictimName || '',
        secondInstallmentReliefScst: parseFloat(victim.q1 || victim.secondInstallmentReliefScst) || 0,
        secondInstallmentReliefExGratia: parseFloat(victim.q2 || victim.secondInstallmentReliefExGratia) || 0,
        secondInstallmentTotalRelief: parseFloat(victim.q3 || victim.secondInstallmentTotalRelief) || 0,
      });
      victimControls.push(group);
    });

    this.cdr.detectChanges(); // Trigger UI update
  }

  private populateThirdInstallmentVictimFields(trialReliefDetails: any[]): void {
    console.log('Resolved trialReliefDetails:', trialReliefDetails); // Log extracted data

    const victimControls = this.thirdInstallmentVictimsArray;
    victimControls.clear(); // Clear any existing controls

    trialReliefDetails.forEach((victim) => {
      console.log('Mapping victim data:', victim); // Log victim data

      victimControls.push(
        this.createVictimFormGroup({
          victimId: victim.victimId,
          trialId: victim.trialId,
          thirdInstallmentVictimName: victim.victimName,
          thirdInstallmentReliefAct: parseFloat(victim.r1 || victim.reliefAmountAct) || 0,
          thirdInstallmentReliefGovernment: parseFloat(victim.r2 || victim.reliefAmountGovernment) || 0,
          thirdInstallmentReliefTotal: parseFloat(victim.r3 || victim.reliefAmountFinalStage) || 0,
        })
      );
    });

    console.log('Populated Third Installment Victim Fields:', victimControls.controls);
    this.cdr.detectChanges(); // Trigger UI updates
  }















  private createVictimFormGroup(victim: any = {}): FormGroup {
    const scstValue = parseFloat(victim.p1 || victim.firstInstallmentReliefScst || '0'); // First Installment Relief
    const exGratiaValue = parseFloat(victim.p2 || victim.firstInstallmentReliefExGratia || '0');
    const totalRelief = this.calculateTotal(scstValue, exGratiaValue);

    const secondReliefScst = parseFloat(victim.q2 || victim.secondInstallmentReliefScst || '0'); // Second Installment Relief
    const secondReliefExGratia = parseFloat(victim.q2 || victim.secondInstallmentReliefExGratia || '0');
    const secondTotalRelief = this.calculateTotal(secondReliefScst, secondReliefExGratia);

    const thirdReliefAct = parseFloat(victim.thirdInstallmentReliefAct || '0'); // Third Installment Relief
    const thirdReliefGovernment = parseFloat(victim.thirdInstallmentReliefGovernment || '0');
    const thirdTotalRelief = this.calculateTotal(thirdReliefAct, thirdReliefGovernment);

    const group = this.fb.group({
      victimId: [victim.victimId || null],
      reliefId: [victim.reliefId || null],
      chargesheetId: [victim.chargesheetId || null],
      trialId: [victim.trialId || null],

      // First Installment
      firstInstallmentBankAccountNumber: [victim.firstInstallmentBankAccountNumber || '', Validators.required],
      firstInstallmentIfscCode: [victim.firstInstallmentIfscCode || '', Validators.required],
      firstInstallmentBankName: [victim.firstInstallmentBankName || '', Validators.required],
      firstInstallmentVictimName: [{ value: victim.victimName || '', disabled: true }, Validators.required],
      firstInstallmentReliefScst: [scstValue, Validators.required],
      firstInstallmentReliefExGratia: [exGratiaValue, Validators.required],
      firstInstallmentTotalRelief: [{ value: totalRelief, disabled: true }, Validators.required],

      // Second Installment
      secondInstallmentVictimName: [{ value: victim.secondInstallmentVictimName || '', disabled: true }, Validators.required],
      secondInstallmentReliefScst: [secondReliefScst, Validators.required],
      secondInstallmentReliefExGratia: [secondReliefExGratia, Validators.required],
      secondInstallmentTotalRelief: [{ value: secondTotalRelief, disabled: true }, Validators.required],

      // Third Installment
      thirdInstallmentVictimName: [{ value: victim.thirdInstallmentVictimName || '', disabled: true }, Validators.required],
      thirdInstallmentReliefAct: [thirdReliefAct, Validators.required],
      thirdInstallmentReliefGovernment: [thirdReliefGovernment, Validators.required],
      thirdInstallmentReliefTotal: [{ value: thirdTotalRelief, disabled: true }, Validators.required],
    });

    // Add dynamic listeners for calculating totals
    this.addDynamicListeners(group);
    if (this.isDisable) {
      group.disable()
    }
    return group;
  }











  private calculateTotal(amount1: number, amount2: number): number {
    return (amount1 || 0) + (amount2 || 0);
  }






  // Get the victims FormArray
  get victimsArray(): FormArray {
    return this.reliefForm.get('victims') as FormArray;
  }

  // Select a tab
  selectTab(index: number): void {
    if (this.enabledTabs[index]) {
      this.currentTab = index;
    } else {
      alert('This tab is not enabled yet!');
    }
  }



  private addDynamicListeners(group: FormGroup): void {
    // Listener for First Installment Total
    group.get('firstInstallmentReliefScst')?.valueChanges.subscribe(() => {
      const scstValue = parseFloat(group.get('firstInstallmentReliefScst')?.value || '0');
      const exGratiaValue = parseFloat(group.get('firstInstallmentReliefExGratia')?.value || '0');
      const total = this.calculateTotal(scstValue, exGratiaValue);

      console.log('Updated First Installment Relief Amount (SC/ST):', { scstValue, exGratiaValue, total });
      group.get('firstInstallmentTotalRelief')?.setValue(total.toFixed(2), { emitEvent: false });
    });

    group.get('firstInstallmentReliefExGratia')?.valueChanges.subscribe(() => {
      const scstValue = parseFloat(group.get('firstInstallmentReliefScst')?.value || '0');
      const exGratiaValue = parseFloat(group.get('firstInstallmentReliefExGratia')?.value || '0');
      const total = this.calculateTotal(scstValue, exGratiaValue);

      console.log('Updated First Installment Relief Amount (Ex-Gratia):', { scstValue, exGratiaValue, total });
      group.get('firstInstallmentTotalRelief')?.setValue(total.toFixed(2), { emitEvent: false });
    });

    // Listener for Second Installment Total
    group.get('secondInstallmentReliefScst')?.valueChanges.subscribe(() => {
      const secondScstValue = parseFloat(group.get('secondInstallmentReliefScst')?.value || '0');
      const secondExGratiaValue = parseFloat(group.get('secondInstallmentReliefExGratia')?.value || '0');
      const secondTotal = this.calculateTotal(secondScstValue, secondExGratiaValue);

      console.log('Updated Second Installment Relief Amount (SC/ST):', { secondScstValue, secondExGratiaValue, secondTotal });
      group.get('secondInstallmentTotalRelief')?.setValue(secondTotal.toFixed(2), { emitEvent: false });
    });

    group.get('secondInstallmentReliefExGratia')?.valueChanges.subscribe(() => {
      const secondScstValue = parseFloat(group.get('secondInstallmentReliefScst')?.value || '0');
      const secondExGratiaValue = parseFloat(group.get('secondInstallmentReliefExGratia')?.value || '0');
      const secondTotal = this.calculateTotal(secondScstValue, secondExGratiaValue);

      console.log('Updated Second Installment Relief Amount (Ex-Gratia):', { secondScstValue, secondExGratiaValue, secondTotal });
      group.get('secondInstallmentTotalRelief')?.setValue(secondTotal.toFixed(2), { emitEvent: false });
    });

    // Listener for Third Installment Total
    group.get('thirdInstallmentReliefAct')?.valueChanges.subscribe(() => {
      const thirdReliefAct = parseFloat(group.get('thirdInstallmentReliefAct')?.value || '0');
      const thirdReliefGovernment = parseFloat(group.get('thirdInstallmentReliefGovernment')?.value || '0');
      const thirdTotal = this.calculateTotal(thirdReliefAct, thirdReliefGovernment);

      console.log('Updated Third Installment Relief Amount (Act):', { thirdReliefAct, thirdReliefGovernment, thirdTotal });
      group.get('thirdInstallmentReliefTotal')?.setValue(thirdTotal.toFixed(2), { emitEvent: false });
    });

    group.get('thirdInstallmentReliefGovernment')?.valueChanges.subscribe(() => {
      const thirdReliefAct = parseFloat(group.get('thirdInstallmentReliefAct')?.value || '0');
      const thirdReliefGovernment = parseFloat(group.get('thirdInstallmentReliefGovernment')?.value || '0');
      const thirdTotal = this.calculateTotal(thirdReliefAct, thirdReliefGovernment);

      console.log('Updated Third Installment Relief Amount (Government):', { thirdReliefAct, thirdReliefGovernment, thirdTotal });
      group.get('thirdInstallmentReliefTotal')?.setValue(thirdTotal.toFixed(2), { emitEvent: false });
    });

  }




  private getInvalidFields(target: string): string[] {
    const invalidFields: string[] = [];

    // Map technical field names to user-friendly names
    const fieldLabels: { [key: string]: string } = {
      firstInstallmentProceedingsFileNumber: 'File Number',
      firstInstallmentProceedingsFileDate: 'File Date',
      firstInstallmentUploadDocument: 'Upload Document',
      firstInstallmentPfmsPortalUploaded: 'PFMS Portal Uploaded',
      firstInstallmentDateOfDisbursement: 'Date of Disbursement',
      secondInstallmentProceedingsFileNumber: 'Second Installment File Number',
      secondInstallmentProceedingsFileDate: 'Second Installment File Date',
      secondInstallmentUploadDocument: 'Second Installment Upload Document',
      secondInstallmentPfmsPortalUploaded: 'Second Installment PFMS Portal Uploaded',
      secondInstallmentDateOfDisbursement: 'Second Installment Date of Disbursement',
      firstInstallmentVictimName: 'Victim Name',
      firstInstallmentReliefScst: 'Relief Amount (SC/ST)',
      firstInstallmentReliefExGratia: 'Relief Amount (Ex-Gratia)',
      secondInstallmentVictimName: 'Second Installment Victim Name',
      secondInstallmentReliefScst: 'Second Installment Relief Amount (SC/ST)',
      secondInstallmentReliefExGratia: 'Second Installment Relief Amount (Ex-Gratia)',
      thirdInstallmentProceedingsFileNumber: 'Third Installment File Number',
      thirdInstallmentProceedingsFileDate: 'Third Installment File Date',
      thirdInstallmentUploadDocument: 'Third Installment Upload Document',
      thirdInstallmentPfmsPortalUploaded: 'Third Installment PFMS Portal Uploaded',
      thirdInstallmentDateOfDisbursement: 'Third Installment Date of Disbursement',
      thirdInstallmentVictimName: 'Third Installment Victim Name',
      thirdInstallmentReliefAct: 'Relief Amount (Act)',
      thirdInstallmentReliefGovernment: 'Relief Amount (Government)',
      thirdInstallmentReliefTotal: 'Total Relief Amount',
    };

    if (target === 'firstInstallment') {
      // Validate top-level fields for the First Installment
      const firstInstallmentFields = [
        'firstInstallmentProceedingsFileNumber',
        'firstInstallmentProceedingsFileDate',
        // 'firstInstallmentUploadDocument',
        'firstInstallmentPfmsPortalUploaded',
        'firstInstallmentDateOfDisbursement',
      ];

      firstInstallmentFields.forEach((field) => {
        if (this.reliefForm.get(field)?.invalid) {
          invalidFields.push(fieldLabels[field] || field); // Use user-friendly name
        }
      });

      // Validate the Victims Array for the First Installment
      const victims = this.reliefForm.get('victims') as FormArray;
      victims.controls.forEach((group, index) => {
        const groupControls = (group as FormGroup).controls;
        ['firstInstallmentVictimName', 'firstInstallmentReliefScst', 'firstInstallmentReliefExGratia'].forEach((key) => {
          if (groupControls[key]?.invalid) {
            invalidFields.push(`Victim ${index + 1} - ${fieldLabels[key] || key}`);
          }
        });
      });
    } else if (target === 'secondInstallment') {
      // Validate top-level fields for the Second Installment
      const secondInstallmentFields = [
        'secondInstallmentProceedingsFileNumber',
        'secondInstallmentProceedingsFileDate',
        'secondInstallmentUploadDocument',
        'secondInstallmentPfmsPortalUploaded',
        'secondInstallmentDateOfDisbursement',
      ];

      secondInstallmentFields.forEach((field) => {
        if (this.reliefForm.get(field)?.invalid) {
          invalidFields.push(fieldLabels[field] || field); // Use user-friendly name
        }
      });

      // Validate the Victims Array for the Second Installment
      const victims = this.reliefForm.get('secondInstallmentVictims') as FormArray;
      victims.controls.forEach((group, index) => {
        const groupControls = (group as FormGroup).controls;
        ['secondInstallmentVictimName', 'secondInstallmentReliefScst', 'secondInstallmentReliefExGratia'].forEach((key) => {
          if (groupControls[key]?.invalid) {
            invalidFields.push(`Victim ${index + 1} - ${fieldLabels[key] || key}`);
          }
        });
      });
    } else if (target === 'thirdInstallment') {
      // Validate top-level fields for the Third Installment
      const thirdInstallmentFields = [
        'thirdInstallmentProceedingsFileNumber',
        'thirdInstallmentProceedingsFileDate',
        'thirdInstallmentUploadDocument',
        'thirdInstallmentPfmsPortalUploaded',
        'thirdInstallmentDateOfDisbursement',
      ];

      thirdInstallmentFields.forEach((field) => {
        if (this.reliefForm.get(field)?.invalid) {
          invalidFields.push(fieldLabels[field] || field); // Use user-friendly name
        }
      });

      // Validate the Victims Array for the Third Installment
      const victims = this.reliefForm.get('thirdInstallmentVictims') as FormArray;
      victims.controls.forEach((group, index) => {
        const groupControls = (group as FormGroup).controls;
        ['thirdInstallmentVictimName', 'thirdInstallmentReliefAct', 'thirdInstallmentReliefGovernment'].forEach((key) => {
          if (groupControls[key]?.invalid) {
            invalidFields.push(`Victim ${index + 1} - ${fieldLabels[key] || key}`);
          }
        });
      });
    }

    return invalidFields;
  }

  steps = {
  step1: false,
  step2: false,
  step3: false,
};

// onInstallmentSubmitSave(step: 'step1' | 'step2' | 'step3') {
//   this.steps[step] = true;
//   console.log(this.steps);
//   const submitMethods = {
//     step1: () => this.onFirstInstallmentSubmit(),
//     step2: () => this.onSecondInstallmentSubmit(),
//     step3: () => this.onThirdInstallmentSubmit(),
//   };

//   submitMethods[step]();
// }

  async onFirstInstallmentSubmit(saveDraft: boolean): Promise<void> {
    if (!saveDraft && !this.steps.step1) {
      const invalidFields = this.getInvalidFields('firstInstallment');
      if (invalidFields.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Incomplete Form',
          text: `Please fill in all required fields:\n${invalidFields.join(', ')}`,
        });
        return;
      }
    }
    this.steps.step1 = false;

    // Enable victimName temporarily
    this.victimsArray.controls.forEach((control) => {
      control.get('firstInstallmentVictimName')?.enable();
    });

    this.victimsArray.controls.forEach((control) => {
      control.get('firstInstallmentTotalRelief')?.enable();
    });

    let firstInstallmentUploadDocumentPath: string | undefined;
    const firstInstallmentUploadDocument = this.reliefForm.get('firstInstallmentUploadDocument')?.value;
    if (firstInstallmentUploadDocument) {
      const paths = await this.uploadMultipleFiles([firstInstallmentUploadDocument]);
      firstInstallmentUploadDocumentPath = paths[0];
    }

    // Prepare the data to send to the backend
    const firstInstallmentData = {
      firId: this.firId,
      saveDraft,
      firstInstallmentStatus: saveDraft ? 0 : 1,
      victims: this.victimsArray.value.map((victim: any, index: number) => ({
        victimReliefId: this.victimsReliefDetails?.[index]?.victim_relif_id || null, // Ensure index exists before accessing
        victimId: victim.victimId || null,
        reliefId: victim.reliefId || null,
        victimName: victim.firstInstallmentVictimName,
        reliefAmountScst: victim.firstInstallmentReliefScst,
        reliefAmountExGratia: victim.firstInstallmentReliefExGratia,
        reliefAmountFirstStage: victim.firstInstallmentTotalRelief,
        bankAccountNumber: victim.firstInstallmentBankAccountNumber,
        ifscCode: victim.firstInstallmentIfscCode,
        bankName: victim.firstInstallmentBankName,
      })),
      proceedings: {
        fileNo: this.reliefForm.get('firstInstallmentProceedingsFileNumber')?.value,
        fileDate: this.reliefForm.get('firstInstallmentProceedingsFileDate')?.value,
        uploadDocument: firstInstallmentUploadDocumentPath || this.existingFilePath || null, // Simplified ternary
        pfmsPortalUploaded: this.reliefForm.get('firstInstallmentPfmsPortalUploaded')?.value,
        dateOfDisbursement: this.reliefForm.get('firstInstallmentDateOfDisbursement')?.value,
      },
    };

    console.log('First Installment Data going:', firstInstallmentData);

    // Save data using the service
    this.ReliefService.saveFirstInstallmentDetails(firstInstallmentData).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'First Installment Details Saved Successfully!',
        });
        console.log(response);
      },
      error: (err: any) => {
        console.error('Error saving First Installment Details:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while saving the data. Please try again.',
        });
      },
    });

    // Disable victimName again
    this.victimsArray.controls.forEach((control) => {
      control.get('firstInstallmentVictimName')?.disable();
    });
  }

  async onSecondInstallmentSubmit(saveDraft:boolean): Promise<void> {
    if (!saveDraft && !this.steps.step2) {
    const invalidFields = this.getInvalidFields('secondInstallment');
    if (invalidFields.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete Form',
        text: `Please fill in all required fields:\n${invalidFields.join(', ')}`,
      });
      return;
    }
  }
  this.steps.step2 = false;

    // Enable victimName temporarily for submission
    this.secondInstallmentVictimsArray.controls.forEach((control) => {
      control.get('secondInstallmentVictimName')?.enable();
    });

    this.secondInstallmentVictimsArray.controls.forEach((control) => {
      control.get('secondInstallmentTotalRelief')?.enable();
    });

    let secondInstallmentUploadDocumentPath: string | undefined;
    const secondInstallmentUploadDocument = this.reliefForm.get('secondInstallmentUploadDocument')?.value;
    if (secondInstallmentUploadDocument) {
      const paths = await this.uploadMultipleFiles([secondInstallmentUploadDocument]);
      secondInstallmentUploadDocumentPath = paths[0];
    }

    // Prepare the data for the backend
    const secondInstallmentData = {
      firId: this.firId,
      saveDraft,
      secondInstallmentStatus: saveDraft ? 0 : 1,
      victims: this.secondInstallmentVictimsArray.value.map((victim: any, index: number) => ({
        victimId: victim.victimId || null,
        victimChargesheetId: this.secondFormVictimInformation?.[index]?.victim_chargesheet_id || null,
        chargesheetId: victim.chargesheetId || null,
        victimName: victim.secondInstallmentVictimName,
        secondInstallmentReliefScst: victim.secondInstallmentReliefScst,
        secondInstallmentReliefExGratia: victim.secondInstallmentReliefExGratia,
        secondInstallmentTotalRelief: victim.secondInstallmentTotalRelief,
      })),
      proceedings: {
        fileNumber: this.reliefForm.get('secondInstallmentProceedingsFileNumber')?.value,
        fileDate: this.reliefForm.get('secondInstallmentProceedingsFileDate')?.value,
        uploadDocument: secondInstallmentUploadDocumentPath || this.existingFilePath_relief_2 || null,
        pfmsPortalUploaded: this.reliefForm.get('secondInstallmentPfmsPortalUploaded')?.value,
        dateOfDisbursement: this.reliefForm.get('secondInstallmentDateOfDisbursement')?.value,
      },
    };

    console.log('Second Installment Data:', secondInstallmentData);

    // Call service to save the second installment details
    this.ReliefService.saveSecondInstallmentDetails(secondInstallmentData).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Second Installment Details Saved Successfully!',
        });
        console.log(response);
      },
      error: (err: any) => {
        console.error('Error saving Second Installment Details:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while saving the data. Please try again.',
        });
      },
    });

    // Disable victimName again
    this.secondInstallmentVictimsArray.controls.forEach((control) => {
      control.get('secondInstallmentVictimName')?.disable();
    });
  }

  async onThirdInstallmentSubmit(saveDraft:boolean): Promise<void> {
    if(!saveDraft && !this.steps.step3){
      const invalidFields = this.getInvalidFields('thirdInstallment');
    if (invalidFields.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete Form',
        text: `Please fill in all required fields:\n${invalidFields.join(', ')}`,
      });
      return;
    }
    }
    this.steps.step3 = false;

    // Enable victimName and totalRelief fields temporarily for submission
    this.thirdInstallmentVictimsArray.controls.forEach((control) => {
      control.get('thirdInstallmentVictimName')?.enable();
      control.get('thirdInstallmentReliefTotal')?.enable();
    });

    let thirdInstallmentUploadDocumentPath: string | undefined;
    const thirdInstallmentUploadDocument = this.reliefForm.get('thirdInstallmentUploadDocument')?.value;
    if (thirdInstallmentUploadDocument) {
      const paths = await this.uploadMultipleFiles([thirdInstallmentUploadDocument]);
      thirdInstallmentUploadDocumentPath = paths[0];
    }

    // Prepare the data for the backend
    const thirdInstallmentData = {
      firId: this.firId,
      saveDraft,
      thirdInstallmentStatus: saveDraft ? 0 : 1,
      victims: this.thirdInstallmentVictimsArray.value.map((victim: any, index: number) => ({
        trialId: victim.trialId, // Use existing trial_id
        victimId: victim.victimId, // Use victim_id
        victimName: victim.thirdInstallmentVictimName,
        thirdInstallmentReliefAct: victim.thirdInstallmentReliefAct,
        thirdInstallmentReliefGovernment: victim.thirdInstallmentReliefGovernment,
        thirdInstallmentReliefTotal: victim.thirdInstallmentReliefTotal,
      })),
      proceedings: {
        trialId: this.thirdInstallmentVictimsArray.value[0]?.trialId, // Use the trial_id from the first victim
        fileNumber: this.reliefForm.get('thirdInstallmentProceedingsFileNumber')?.value,
        fileDate: this.reliefForm.get('thirdInstallmentProceedingsFileDate')?.value,
        uploadDocument: thirdInstallmentUploadDocumentPath || this.existingFilePath_relief_3 || null,
        pfmsPortalUploaded: this.reliefForm.get('thirdInstallmentPfmsPortalUploaded')?.value,
        dateOfDisbursement: this.reliefForm.get('thirdInstallmentDateOfDisbursement')?.value,
      },
    };

    console.log('Third Installment Data:', thirdInstallmentData);

    // Call service to save the third installment details and update FIR status
    this.ReliefService.saveThirdInstallmentDetails(thirdInstallmentData).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Third Installment Details Saved Successfully!',
        });
        console.log(response);
      },
      error: (err: any) => {
        console.error('Error saving Third Installment Details:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while saving the data. Please try again.',
        });
      },
    });

    // Disable victimName and totalRelief fields again
    this.thirdInstallmentVictimsArray.controls.forEach((control) => {
      control.get('thirdInstallmentVictimName')?.disable();
      control.get('thirdInstallmentReliefTotal')?.disable();
    });
  }


  private fetchFirDetails(firId: string): Observable<any> {
    return this.firService.getFirDetails(firId).pipe(
      tap((details: any) => {
        this.firDetails = details;
        if (this.firDetails && this.firDetails.data && this.firDetails.data.date_of_registration) {
          this.firDetails.data.date_of_registration = this.convertToNormalDate(this.firDetails.data.date_of_registration);
        }
        if (this.firDetails && this.firDetails.data && this.firDetails.data.date_of_occurrence) {
          this.firDetails.data.date_of_occurrence = this.convertToNormalDate(this.firDetails.data.date_of_occurrence);
        }
        this.patchFirDetailsToForm(this.firDetails);

        // if (this.firDetails && this.firDetails.data && this.firDetails.data.status) {
        //   console.log(this.firDetails.data.status,this.firDetails.data.HascaseMF);
        //   if (this.firDetails.data.status >= 5) this.enabledTabs[0] = true; 
        //   if (this.firDetails.data.status >= 6) this.enabledTabs[1] = true; 
        //   if (this.firDetails.data.status >= 7) this.enabledTabs[2] = true;
        // }

  if (this.firDetails && this.firDetails.data && this.firDetails.data.status) {
  const { status, HascaseMF } = this.firDetails.data;
  const case_type = this.firDetails.data4.case_type; // ✅ corrected key name
  console.log("Status:", status, "HascaseMF:", HascaseMF, "Case Type:", case_type);
  this.enabledTabs = [false, false, false];

  if (HascaseMF == 1) {
    if (status == 5) {
      this.enabledTabs = [false, false, false];
      // console.log("HascaseMF=1, status=5 → hide all");
    } 
    else if (status == 6 || status == 7) {
      this.enabledTabs = [true, false, false];
      // console.log("HascaseMF=1, status=6/7 → only first tab");
    }
  } 
  else if (HascaseMF == 0 || HascaseMF == null) {
    // Default enabling logic
    if (status >= 5) this.enabledTabs[0] = true;
    if (status >= 6) this.enabledTabs[1] = true;
    if (status >= 7) this.enabledTabs[2] = true;
    // console.log("HascaseMF=0 → normal enabling");
  }
  const restrictedTypes = ["referredChargeSheet", "sectionDeleted", "firQuashed"];
  if (restrictedTypes.includes(case_type) && status >= 6) {
    this.enabledTabs[1] = false;
    this.enabledTabs[2] = false;
    // console.log("Restricted case_type at stage 6+ → disable 2nd & 3rd tabs");
  }

  console.log("Enabled Tabs:", this.enabledTabs);
}



      }),
      catchError((err) => {
        console.error('Error fetching FIR details:', err);
        return of(null); // Ensures forkJoin doesn't fail
      })
    );
  }

  private fetchVictimDetails(firId: string): Observable<any> {
    return this.ReliefService.getVictimsReliefDetails_1(firId).pipe(
      tap((response: any) => {
        // console.log('Fetched Victim Details:', response);
        if (response?.victimsReliefDetails) {
          this.victimsReliefDetails = response.victimsReliefDetails;
          this.populateVictimFields(response.victimsReliefDetails);
        } else {
          console.error('Invalid response structure:', response);
        }
      }),
      catchError((err) => {
        console.error('Error fetching victim details:', err);
        return of(null);
      })
    );
  }

  private fetchSecondInstallmentDetails(firId: string): Observable<any> {
    return this.ReliefService.getSecondInstallmentDetails(firId).pipe(
      tap((response: any) => {
        // console.log('Fetched Second Installment Victim Details:', response);
        if (response?.victims && Array.isArray(response.victims)) {
          this.secondFormVictimInformation = response.victims;
          this.populateSecondInstallmentVictimFields(response.victims);
        } else {
          console.error('Invalid response structure:', response);
        }
      }),
      catchError((err) => {
        console.error('Error fetching second installment details:', err);
        return of(null);
      })
    );
  }

  private fetchThirdInstallmentDetails(firId: string): Observable<any> {
    return this.ReliefService.getThirdInstallmentDetails(firId).pipe(
      tap((response: any) => {
        // console.log('Raw Third Installment Response:', response);
        const trialReliefDetails = response?.trialReliefDetails || [];
        console.log('Resolved trialReliefDetails:', trialReliefDetails);
        this.trialReliefDetails = response?.trialReliefDetails || [];

        if (Array.isArray(trialReliefDetails)) {
          this.populateThirdInstallmentVictimFields(trialReliefDetails);
        } else {
          console.error('Invalid response structure for Third Installment:', response);
        }
      }),
      catchError((err) => {
        console.error('Error fetching third installment details:', err);
        return of(null);
      })
    );
  }

  convertToNormalDate(isoDate: string): string {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits
    const month = date.toLocaleString('en-US', { month: 'short' }); // Get short month (Jan, Feb, etc.)
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Format as DD-MMM-YYYY
  }


  getFileName(): string {
    return this.existingFilePath ? this.existingFilePath.split('/').pop() || '' : '';
  }

  viewFile(): void {
    if (this.existingFilePath) {
      window.open(this.file_access + this.existingFilePath, '_blank');
    }
  }

  getFileName_2(): string {
    return this.existingFilePath_relief_2 ? this.existingFilePath_relief_2.split('/').pop() || '' : '';
  }

  viewFile_2(): void {
    if (this.existingFilePath_relief_2) {
      window.open(this.file_access + this.existingFilePath_relief_2, '_blank');
    }
  }

  getFileName_3(): string {
    return this.existingFilePath_relief_3 ? this.existingFilePath_relief_3.split('/').pop() || '' : '';
  }

  viewFile_3(): void {
    if (this.existingFilePath_relief_3) {
      window.open(this.file_access + this.existingFilePath_relief_3, '_blank');
    }
  }


  confirmClear(result: any) {
    if (this.RemoveFormUpload == '1') {
      this.clearFileRelief_1();
    } else if (this.RemoveFormUpload == '2') {
      this.clearFileRelief_2();
    } else if (this.RemoveFormUpload == '3') {
      this.clearFileRelief_3();
    }
    this.closeDialog();
  }

  clearFileRelief_1(): void {
    this.existingFilePath = null;
    this.showFileInput = true;
    this.form.get('firstInstallmentUploadDocument')?.setValue(null);
  }

  clearFileRelief_2(): void {
    this.existingFilePath_relief_2 = null;
    this.showFileInput_2 = true;
    this.form.get('secondInstallmentUploadDocument')?.setValue(null);
  }

  clearFileRelief_3(): void {
    this.existingFilePath_relief_3 = null;
    this.showFileInput_3 = true;
    this.form.get('thirdInstallmentUploadDocument')?.setValue(null);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Handle your file upload logic here
      this.form.get('firstInstallmentUploadDocument')?.setValue(file);
    }
  }

  openDialog(form: any): void {
    // this.dialogMessage = 'This is a dialog message!';
    this.RemoveFormUpload = form;
    this.isDialogVisible = true;
  }

  closeDialog(): void {
    this.isDialogVisible = false;
  }

  GetInstallmemtList(firid: any) {
    const Fir_ID = {
      firId: firid,
    };
    this.ReliefService.FetchAllInstallmentDetails(Fir_ID).subscribe(
      (data: any) => {
        // console.log(data)
        if (data && data.firstInstallment && data.firstInstallment[0]) {
          this.FirstrelifDetails(data.firstInstallment[0])
        }
        if (data && data.secondInstallment && data.secondInstallment[0]) {
          this.SecondrelifDetails(data.secondInstallment[0])
        }
        if (data && data.trialProceedings && data.trialProceedings[0]) {
          this.ThirdrelifDetails(data.trialProceedings[0])
        }
      },
      (error: any) => {
        console.error(error)
      }
    );
  }


  FirstrelifDetails(InstallementDetails: any) {
    if (InstallementDetails.proceedings_file_no) {
      this.reliefForm.get('firstInstallmentProceedingsFileNumber')?.setValue(InstallementDetails.proceedings_file_no);
    }
    if (InstallementDetails.proceedings_date) {
      const formattedDate = InstallementDetails.proceedings_date.split('T')[0];
      this.reliefForm.get('firstInstallmentProceedingsFileDate')?.setValue(formattedDate);
    }
    if (InstallementDetails.pfms_portal_uploaded) {
      this.reliefForm.get('firstInstallmentPfmsPortalUploaded')?.setValue(InstallementDetails.pfms_portal_uploaded);
    }
    if (InstallementDetails.date_of_disbursement) {
      const formattedDate = InstallementDetails.date_of_disbursement.split('T')[0];
      this.reliefForm.get('firstInstallmentDateOfDisbursement')?.setValue(formattedDate);
    }
    if (InstallementDetails.proceedings_file) {
      this.existingFilePath = InstallementDetails.proceedings_file;
      this.showFileInput = false;
      // this.reliefForm.get('firstInstallmentUploadDocument')?.setValue(InstallementDetails.proceedings_file);
    }
  }

  SecondrelifDetails(InstallementDetails: any) {
    // console.log('function called')
    if (InstallementDetails.file_number) {
      this.reliefForm.get('secondInstallmentProceedingsFileNumber')?.setValue(InstallementDetails.file_number);
    }
    if (InstallementDetails.file_date) {
      const formattedDate = InstallementDetails.file_date.split('T')[0];
      this.reliefForm.get('secondInstallmentProceedingsFileDate')?.setValue(formattedDate);
    }
    if (InstallementDetails.pfms_portal_uploaded) {
      this.reliefForm.get('secondInstallmentPfmsPortalUploaded')?.setValue(InstallementDetails.pfms_portal_uploaded);
    }
    if (InstallementDetails.date_of_disbursement) {
      const formattedDate = InstallementDetails.date_of_disbursement.split('T')[0];
      this.reliefForm.get('secondInstallmentDateOfDisbursement')?.setValue(formattedDate);
    }
    if (InstallementDetails.upload_document) {
      this.existingFilePath_relief_2 = InstallementDetails.upload_document;
      this.showFileInput_2 = false;
      this.reliefForm.get('secondInstallmentUploadDocument')?.setValue(InstallementDetails.upload_document);
    }
  }

  ThirdrelifDetails(InstallementDetails: any) {
    // console.log('function called')
    if (InstallementDetails.file_number) {
      this.reliefForm.get('thirdInstallmentProceedingsFileNumber')?.setValue(InstallementDetails.file_number);
    }
    if (InstallementDetails.file_date) {
      const formattedDate = InstallementDetails.file_date.split('T')[0];
      this.reliefForm.get('thirdInstallmentProceedingsFileDate')?.setValue(formattedDate);
    }
    if (InstallementDetails.pfms_portal_uploaded) {
      this.reliefForm.get('thirdInstallmentPfmsPortalUploaded')?.setValue(InstallementDetails.pfms_portal_uploaded);
    }
    if (InstallementDetails.date_of_disbursement) {
      const formattedDate = InstallementDetails.date_of_disbursement.split('T')[0];
      this.reliefForm.get('thirdInstallmentDateOfDisbursement')?.setValue(formattedDate);
    }
    if (InstallementDetails.upload_document) {
      this.existingFilePath_relief_3 = InstallementDetails.upload_document;
      this.showFileInput_3 = false;
      this.reliefForm.get('thirdInstallmentUploadDocument')?.setValue(InstallementDetails.upload_document);
    }
  }


  uploadfirstInstallmentDocument(event: any): void {
    const file = event.target.files[0];  // Get the first selected file

    if (file) {

      // Patch the file into the form (this assumes you have the form control set up correctly)
      this.reliefForm.patchValue({
        firstInstallmentUploadDocument: file,  // Storing the file in the form control
      });

      // Optionally, display the file name
      console.log('File selected:', file.name);
    } else {
      console.log('No file selected');
    }
  }


  uploadSecondInstallmentDocument(event: any): void {
    const file = event.target.files[0];  // Get the first selected file

    if (file) {

      // Patch the file into the form (this assumes you have the form control set up correctly)
      this.reliefForm.patchValue({
        secondInstallmentUploadDocument: file,  // Storing the file in the form control
      });

      // Optionally, display the file name
      console.log('File selected:', file.name);
    } else {
      console.log('No file selected');
    }
  }

  uploadThirdInstallmentDocument(event: any): void {
    const file = event.target.files[0];  // Get the first selected file

    if (file) {

      // Patch the file into the form (this assumes you have the form control set up correctly)
      this.reliefForm.patchValue({
        thirdInstallmentUploadDocument: file,  // Storing the file in the form control
      });

      // Optionally, display the file name
      console.log('File selected:', file.name);
    } else {
      console.log('No file selected');
    }
  }

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

      if (!(file instanceof File)) {
        reject('Invalid file. Please upload a valid file.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      this.firService.uploadFile(formData).subscribe({
        next: (response: any) => resolve(response.filePath),
        error: (error: any) => reject(error)
      });
    });
  }


  goToFirViewForm() {

    this.router.navigate(['/widgets-examples/fir-list'], {
      queryParams: { shouldCallFunction: 'true', data: encodeURIComponent(JSON.stringify(this.firId)) }
    }).catch(err => {
      console.error('Navigation Error:', err);
    });

  }

}
