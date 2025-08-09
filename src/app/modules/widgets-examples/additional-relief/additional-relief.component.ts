import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationStart, Event as RouterEvent } from '@angular/router';
import { FormControl, AbstractControl } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { AdditionalReliefService } from 'src/app/services/additional-relief.service';
import { environment } from 'src/environments/environment.prod';


import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import Swal from 'sweetalert2';
import { MatRadioModule } from '@angular/material/radio';
import { FirService } from 'src/app/services/fir.service';
import { CityService } from 'src/app/services/city.service';


@Component({
  selector: 'app-additional-relief',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
  ],
  templateUrl: './additional-relief.component.html',
  styleUrls: ['./additional-relief.component.scss']
})

export class AdditionalReliefComponent {
  firId: string = '';
  UnicVictimId: string = '';
  victims: any[] = [];
  additionalReliefForm: FormGroup;
  districts: any[] = [];

  notApplicableReasons = [
    { value: 'Deceased', label: 'Deceased' },
    { value: 'Not Eligible', label: 'Not Eligible' },
    { value: 'Others', label: 'Others' }
  ];

    relationships = [
    { value: 'Self', label: 'Self' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Son', label: 'Son' },
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'KithAndKin', label: 'Kith and Kin' },
  ];

  uploadProceedingsExisitingPath : string | null;
  uploadEmployeeProceedingsExisitingPath : string | null;
  uploadHouseProceedingsExisitingPath : string | null;
  uploadEducationProceedingsExisitingPath : string | null;
  uploadcompensationProceedingsExisitingPath : string | null;
  uploadDocumentExisitingPath : string | null;
  uploadedEducationFiles: any[] = [];
  showFileInput = true;
  showEmployeeInput = true;
  showHouseInput = true;
  showEducationInput = true;
  showFileInput1 = true;
  file_access = environment.file_access;

  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private additionalReliefService: AdditionalReliefService,
    private router: Router,
    private firService: FirService,
    private cityService: CityService
  ) {
    this.additionalReliefForm = this.fb.group({
      fir_id: [''],
      victimName: this.fb.array([]),
      victimId: this.fb.array([]),
      sectionValue: this.fb.array([]),
      pensionStatus: [''],
      notApplicableReason: [''],
      otherReason: [''],
      relationship: [[]],
      pensionAmount: [0, [Validators.min(0)]],
      dearnessAllowance: [0, [Validators.min(0)]],
      totalPensionAmount: [''],
      fileNumber: [''],
      proceedingsDate: [''],
      uploadProceedings: [''],

      // Employment Details
      employmentStatus: [''],
      notApplicableEmploymentReason: [''],
      employmentOtherReason: [''],
      relationshipToVictim: [''],
      educationalQualification: [''],
      departmentName: [''],
      officeName: [''],
      designation: [''],
      officeAddress: [''],
      officeDistrict: [''],
      appointmentOrderDate: [''],
      providingOrderDate: [''],
      employmentProceedingsFileNumber:[''],
      employmentProceedingsDate:[''],
      employmentProceedingsDocument:[''],

      // House Site Patta Details
      houseSitePattaStatus: [''],
      notApplicableHouseSitePattaReason: [''],
      houseSitePattaOtherReason: [''],
      houseSitePattaRelationship: [''],
      houseSitePattaAddress: [''],
      talukName: [''],
      districtName: [''],
      pinCode: [''],
      houseSitePattaIssueDate: [''],
      houseSitePattaProceedingsFileNumber:[''],
      houseSitePattaProceedingsDate:[''],
      houseSitePattaProceedingsDocument:[''],

      // Education Concession
      educationConcessionStatus: [''],
      notApplicableReasonEducation: [''],
      otherReasonEducation: [''],
      numberOfChildren: [''],
      children: this.fb.array([]),

      

      // Provisions Given
      provisionsGivenStatus: [''],
      reasonNotApplicable: [''],
      othersReason: [''],
      beneficiaryRelationship: [''],
      provisionsfileNumber: [''],
      dateOfProceedings: [''],
      uploadFile: [''],

      // Compensation Given
      compensationGivenStatus: [''],
      compensationnotApplicableReason: [''],
      compensationotherReason: [''],
      compensationestimatedAmount: [''],
      proceedingsFileNumber: [''],
      compensationdateOfProceedings: [''],
      compensationuploadProceedings: [''],
    });
  }

  loadDistricts() {
    this.cityService.getAllDistricts().subscribe(
      (data) => {
        
        this.districts = data; // Assign the fetched districts to the dropdown
        // console.log(this.districts)
      },
      (error) => {
        console.error('error on retrive district')
      }
    );
  }
  

  // Get children FormArray
  get children() {
    return (this.additionalReliefForm.get('children') as FormArray);
  }

  get victimNameArray() {
    return (this.additionalReliefForm.get('victimName') as FormArray);
  }

  get victimSecArray() {
    return (this.additionalReliefForm.get('sectionValue') as FormArray);
  }

  get victimIdArray(): FormArray {
    return this.additionalReliefForm.get('victimId') as FormArray;
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const numberOfChildren = Number(inputElement.value);
  
    while (this.children.length < numberOfChildren) {
      this.addChild();
    }
    while (this.children.length > numberOfChildren) {
      this.children.removeAt(this.children.length - 1);
    }
  }
  
  addChild() {
    const childFormGroup = this.fb.group({
      gender: ['', Validators.required],
      age: ['', Validators.required],
      studyStatus: ['', Validators.required],
      institution: [''],
      standard: [''],
      course: [''],
      courseYear: [''],
      amountDisbursed: ['', Validators.required],
      proceedingsFileNumber: ['', Validators.required],
      dateOfProceedings: ['', Validators.required],
      educationConcessionDocument: ['', Validators.required],
    });
    this.children.push(childFormGroup);
    this.uploadedEducationFiles.push(null); // Reserve slot for file
  }

  
  removeChild(index: number) {
    this.children.removeAt(index);
  }


  getChildrenJson() {
    const childrenValue = this.children.getRawValue(); 
    console.log(childrenValue);
    return JSON.stringify(childrenValue);
  }
  

    calculateTotal(): number {
      const pensionAmount = parseFloat(this.additionalReliefForm.get('pensionAmount')?.value) || 0;
      const dearnessAllowance = parseFloat(this.additionalReliefForm.get('dearnessAllowance')?.value) || 0;
      return pensionAmount + dearnessAllowance;
    }

    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length) {
        const file = input.files[0];
      }
    }

    triggerChangeDetection() {
      this.cdr.detectChanges();
    }

    updateTotalPensionAmount() {
      const pensionAmount = parseFloat(this.additionalReliefForm.get('pensionAmount')?.value) || 0;
      const dearnessAllowance = parseFloat(this.additionalReliefForm.get('dearnessAllowance')?.value) || 0;
      const totalPensionAmount = pensionAmount + dearnessAllowance;
      this.additionalReliefForm.get('totalPensionAmount')?.setValue(totalPensionAmount, { emitEvent: false });
    }
    userData:any;
  isDisable:boolean = false;

    ngOnInit(): void {
      const JsonData = sessionStorage.getItem('user_data');
    this.userData = JsonData ? JSON.parse(JsonData) : {};
    this.isDisable = this.userData.role == 3;
    if(this.isDisable){
      this.additionalReliefForm.disable();
    }
      this.loadDistricts()
      this.route.queryParams.subscribe((params) => {
        this.firId = params['fir_id'];
        this.UnicVictimId = params['victim_id'];

        this.additionalReliefForm.patchValue({
          fir_id: this.firId
        });

        this.fetchVictims();
        this.cdr.detectChanges();
        this.editAdditionalRelief(this.firId,this.UnicVictimId);
      });

      this.additionalReliefForm.get('pensionAmount')?.valueChanges.subscribe(() => {
        this.updateTotalPensionAmount();
      });
    
      this.additionalReliefForm.get('dearnessAllowance')?.valueChanges.subscribe(() => {
        this.updateTotalPensionAmount();
      });
    }
  
    fetchVictims(): void {
      this.additionalReliefService.getVictimsByFirId(this.firId,this.UnicVictimId).subscribe((data) => {
        // console.log(data);
        this.victims = data;
        this.setFormControls();
        this.cdr.detectChanges();
      });
    }

    setFormControls() {
      const victimIdsArray = this.additionalReliefForm.get('victimId') as FormArray;
      victimIdsArray.clear();

      const victimNameArray = this.additionalReliefForm.get('victimName') as FormArray;
      victimNameArray.clear();

      const victimSecArray = this.additionalReliefForm.get('sectionValue') as FormArray;
      victimSecArray.clear();

      this.victims.forEach((victim, index) => { 
        const victimNameControl = this.fb.control(victim.victim_name);
        victimNameArray.push(victimNameControl);
        
        const victimIdControl = this.fb.control(victim.victim_id);
        victimIdsArray.push(victimIdControl);

        const victimSecControl = this.fb.control(victim.additional_relief);
        victimSecArray.push(victimSecControl);
      });
    }
    
  async onSubmit() {
  if (this.additionalReliefForm) {
    const formData = this.additionalReliefForm.value; 

    // Get children array
    const childrenValue = this.children.getRawValue(); 

    // Loop through each child and upload education document if it's a File
    if (childrenValue && Array.isArray(childrenValue)) {
      for (let i = 0; i < childrenValue.length; i++) {
        const child = childrenValue[i];
        const educationFile = child.educationConcessionDocument;

        if (educationFile && educationFile instanceof File) {
          const paths = await this.uploadMultipleFiles([educationFile]);
          child.educationConcessionDocument = paths[0]; // Replace file with uploaded path
        }
      }
    }

    // Convert children array to JSON string
    formData.children = JSON.stringify(childrenValue);

    // ---------------------- Other file uploads ----------------------
    let uploadProceedingsDocumentPath: string | undefined;
    const uploadProceedings = this.additionalReliefForm.get('uploadProceedings')?.value;
    if (uploadProceedings) {
      const paths = await this.uploadMultipleFiles([uploadProceedings]);
      uploadProceedingsDocumentPath = paths[0];
    }
    formData.uploadProceedings = uploadProceedingsDocumentPath || this.uploadProceedingsExisitingPath || null;

    let uploadEmployeeProceedingsDocumentPath: string | undefined;
    const uploadEmployeeProceedings = this.additionalReliefForm.get('employmentProceedingsDocument')?.value;
    if (uploadEmployeeProceedings) {
      const paths = await this.uploadMultipleFiles([uploadEmployeeProceedings]);
      uploadEmployeeProceedingsDocumentPath = paths[0];
    }
    formData.employmentProceedingsDocument = uploadEmployeeProceedingsDocumentPath || this.uploadEmployeeProceedingsExisitingPath || null;

    let uploadHouseProceedingsDocumentPath: string | undefined;
    const uploadHouseProceedings = this.additionalReliefForm.get('houseSitePattaProceedingsDocument')?.value;
    if (uploadHouseProceedings) {
      const paths = await this.uploadMultipleFiles([uploadHouseProceedings]);
      uploadHouseProceedingsDocumentPath = paths[0];
    }
    formData.houseSitePattaProceedingsDocument = uploadHouseProceedingsDocumentPath || this.uploadHouseProceedingsExisitingPath || null;  

    let uploadcompensationProceedingsDocumentPath: string | undefined;
    const uploadcompensationProceedings = this.additionalReliefForm.get('compensationuploadProceedings')?.value;
    if (uploadcompensationProceedings) {
      const paths = await this.uploadMultipleFiles([uploadcompensationProceedings]);
      uploadcompensationProceedingsDocumentPath = paths[0];
    }
    formData.compensationuploadProceedings = uploadcompensationProceedingsDocumentPath || this.uploadcompensationProceedingsExisitingPath || null;

    let uploadDocumentPath: string | undefined;
    const uploadFile = this.additionalReliefForm.get('uploadFile')?.value;
    if (uploadFile) {
      const paths = await this.uploadMultipleFiles([uploadFile]);
      uploadDocumentPath = paths[0];
    }
    formData.uploadFile = uploadDocumentPath || this.uploadDocumentExisitingPath || null;

    // ---------------------- API Call ----------------------
    this.additionalReliefService.saveAdditionalRelief(formData).subscribe({
      next: (response) => {
        console.log('Data saved successfully:', response);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Data saved successfully!',
        });
      },
      error: (err) => {
        console.error('Error saving data:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error saving data',
        });
      }
    });

  } else {
    console.log('Form is invalid');
  }
}

  editAdditionalRelief(firId: string,victimId: string) {
    this.additionalReliefService.getAdditionalReliefByFirId(firId,victimId).subscribe({
      next: (data : any) => {
        this.populateFormForEdit(data);
      },
      error: (error : any) => {
        console.error('Error fetching additional relief data:', error);
      }
    });
  }


  populateFormForEdit(responseData: any[]) {
    if (!responseData || responseData.length === 0) return;

    // Clear existing form arrays
    while (this.children.length) {
      this.children.removeAt(0);
    }

    const formData = responseData[0]; // Get first victim's data

    // Map API response fields to form fields
    const fieldMappings = {
      fir_id: 'fir_id',
      pension_status: 'pensionStatus',
      not_applicable_reason: 'notApplicableReason',
      other_reason: 'otherReason',
      relationship: 'relationship',
      pension_amount: 'pensionAmount',
      dearness_allowance: 'dearnessAllowance',
      total_pension_amount: 'totalPensionAmount',
      file_number: 'fileNumber',
      proceedings_date: 'proceedingsDate',
      // upload_proceedings: 'uploadProceedings',
      
      
      // Employment fields
      employment_status: 'employmentStatus',
      employment_not_applicable_reason: 'notApplicableEmploymentReason',
      employment_other_reason: 'employmentOtherReason',
      relationship_to_victim: 'relationshipToVictim',
      educational_qualification: 'educationalQualification',
      department_name: 'departmentName',
      office_name: 'officeName',
      designation: 'designation',
      office_address: 'officeAddress',
      office_district: 'officeDistrict',
      appointment_order_date: 'appointmentOrderDate',
      providing_order_date: 'providingOrderDate',
      employment_proceedings_file_number:'employmentProceedingsFileNumber',
      employment_proceedings_date:'employmentProceedingsDate',
      

      // House site fields
      house_site_patta_status: 'houseSitePattaStatus',
      house_site_patta_reason: 'notApplicableHouseSitePattaReason',
      house_site_patta_other_reason: 'houseSitePattaOtherReason',
      house_site_patta_relationship: 'houseSitePattaRelationship',
      house_site_patta_address: 'houseSitePattaAddress',
      taluk_name: 'talukName',
      district_name: 'districtName',
      pin_code: 'pinCode',
      house_site_patta_issue_date: 'houseSitePattaIssueDate',
      house_patta_proceedings_file_number:'houseSitePattaProceedingsFileNumber',
      house_patta_proceedings_date:'houseSitePattaProceedingsDate',


      // Education fields
      education_concession_status: 'educationConcessionStatus',
      education_concession_reason: 'notApplicableReasonEducation',
      education_other_reason: 'otherReasonEducation',
      number_of_children: 'numberOfChildren',

      // Provisions fields
      provisions_status: 'provisionsGivenStatus',
      provisions_not_applicable_reason: 'reasonNotApplicable',
      provisions_other_reason: 'othersReason',
      provisions_relationship: 'beneficiaryRelationship',
      provisions_file_number: 'provisionsfileNumber',
      provisions_date_of_document: 'dateOfProceedings',
      // upload_proceedings_document: 'uploadFile',

      // Burnt house fields
      burnt_house_status: 'compensationGivenStatus',
      burnt_house_reason: 'compensationnotApplicableReason',
      burnt_house_other_reason: 'compensationotherReason',
      burnt_house_estimated_amount: 'compensationestimatedAmount',
      burnt_house_file_number: 'proceedingsFileNumber',
      burnt_house_document_date: 'compensationdateOfProceedings',
      // burnt_house_document_upload: 'compensationuploadProceedings'
    };

    // Create form value object
    const formValues: any = {};
    
    // Map API values to form values
    Object.entries(fieldMappings).forEach(([apiField, formField]) => {
      if (formData[apiField] !== undefined && formData[apiField] !== null) {
        // Handle special case for relationship array
        if (apiField === 'relationship') {
          try {
            formValues[formField] = JSON.parse(formData[apiField]);
          } catch {
            formValues[formField] = formData[apiField];
          }
        } else {
          formValues[formField] = formData[apiField];
        }
      }
    });

    // Patch basic form values
    this.additionalReliefForm.patchValue(formValues);

    // Handle children array
    if (formData.child_details) {
      try {
        const sanitizedData = formData.child_details.replace(/\\/g, '\\\\');

        // Now safely parse the sanitized JSON string
        const childrenData = JSON.parse(sanitizedData);
        
        // Update number of children control
        this.additionalReliefForm.patchValue({
          numberOfChildren: childrenData.length
        });

        // Populate children form array
        childrenData.forEach((child: any) => {
          const childFormGroup = this.fb.group({
            gender: [child.gender || ''],
            age: [child.age || ''],
            studyStatus: [child.studyStatus || ''],
            institution: [child.institution || ''],
            standard: [child.standard || ''],
            course: [child.course || ''],
            courseYear: [child.courseYear || ''],
            amountDisbursed: [child.amountDisbursed || ''],
            proceedingsFileNumber: [child.proceedingsFileNumber || ''],
            educationConcessionDocument: [child.educationConcessionDocument || ''],
            dateOfProceedings: [child.dateOfProceedings || ''],
            uploadProceedings: [''] // File inputs can't be pre-populated
          });
          this.children.push(childFormGroup);
          console.log(childrenData);
          this.uploadedEducationFiles = childrenData.map((child: { educationConcessionDocument: any; }) => {
      return child.educationConcessionDocument ? child.educationConcessionDocument : null;
    });
        });
      } catch (error) {
        console.error('Error parsing child details:', error);
      }
    }

    // Handle victims data
    if (responseData.length > 0) {
      // Clear existing arrays
      this.victimNameArray.clear();
      this.victimIdArray.clear();
      this.victimSecArray.clear();

      // Populate victim arrays
      responseData.forEach(victim => {
        this.victimNameArray.push(this.fb.control(victim.victim_name));
        this.victimIdArray.push(this.fb.control(victim.victim_id));
        this.victimSecArray.push(this.fb.control(victim.section));
      });
    }

    if(formData.burnt_house_document_upload){
      this.uploadcompensationProceedingsExisitingPath = formData.burnt_house_document_upload;
    }

    if(formData.upload_proceedings_document){
      this.uploadDocumentExisitingPath = formData.upload_proceedings_document;
       this.showFileInput1 = false;
    }

    if(formData.upload_proceedings){
      this.uploadProceedingsExisitingPath = formData.upload_proceedings;
      this.showFileInput = false;
    }

    if(formData.upload_proceedings){
      this.uploadProceedingsExisitingPath = formData.upload_proceedings;
      this.showFileInput = false;
    }

    if(formData.employment_proceedings_document){
      this.uploadEmployeeProceedingsExisitingPath = formData.employment_proceedings_document;
      this.showEmployeeInput = false;
    }

    if(formData.house_patta_proceedings_document){
      this.uploadHouseProceedingsExisitingPath = formData.house_patta_proceedings_document;
      this.showHouseInput = false;
    }

    
    


    // Trigger calculations and UI updates
    this.updateTotalPensionAmount();
    this.cdr.detectChanges();
  }
  

  BackToList(){
    this.router.navigate(['widgets-examples/additional-relief-list'], {
      queryParams: {},
    });
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
        next: (response : any) => resolve(response.filePath),
        error: (error : any) => reject(error)
      });
    });
  }

  
  uploadProceedingsDocument(event: any): void {
    const file = event.target.files[0];  // Get the first selected file
  console.log('11111111111111111111111111111111111111111111111111111111111111111111111')
    if (file) {
   
      // Patch the file into the form (this assumes you have the form control set up correctly)
      this.additionalReliefForm.patchValue({
        uploadProceedings: file,  // Storing the file in the form control
      });
  
      // Optionally, display the file name
      console.log('File selected:', file.name);
    } else {
      console.log('No file selected');
    }
  }

  uploadEmployeeProceedingsDocument(event: any): void {
    const file = event.target.files[0];  // Get the first selected file
    if (file) {
   
      // Patch the file into the form (this assumes you have the form control set up correctly)
      this.additionalReliefForm.patchValue({
        employmentProceedingsDocument: file,  // Storing the file in the form control
      });
  
      // Optionally, display the file name
      console.log('File selected:', file.name);
    } else {
      console.log('No file selected');
    }
  }

   uploadHouseProceedingsDocument(event: any): void {
    const file = event.target.files[0];  // Get the first selected file
    if (file) {
   
      // Patch the file into the form (this assumes you have the form control set up correctly)
      this.additionalReliefForm.patchValue({
        houseSitePattaProceedingsDocument: file,  // Storing the file in the form control
      });
  
      // Optionally, display the file name
      console.log('File selected:', file.name);
    } else {
      console.log('No file selected');
    }
  }





  uploadProceedingsDocumentcompensation(event: any): void {
    const file = event.target.files[0];  // Get the first selected file
    console.log('2222222222222222222222222222222222222222222222222222222222222222222222222')
    if (file) {
   
      // Patch the file into the form (this assumes you have the form control set up correctly)
      this.additionalReliefForm.patchValue({
        compensationuploadProceedings: file,  // Storing the file in the form control
      });
  
      // Optionally, display the file name
      console.log('File selected:', file.name);
    } else {
      console.log('No file selected');
    }
  }

  uploadDocument(event: any): void {
    const file = event.target.files[0];  // Get the first selected file
    console.log('3333333333333333333333333333333333333333333333333333333333333333333333333')
    if (file) {
   
      // Patch the file into the form (this assumes you have the form control set up correctly)
      this.additionalReliefForm.patchValue({
        uploadFile: file,  // Storing the file in the form control
      });
  
      // Optionally, display the file name
      console.log('File selected:', file.name);
    } else {
      console.log('No file selected');
    }
  }




  getFileName(): string {
    return this.uploadProceedingsExisitingPath ? this.uploadProceedingsExisitingPath.split('/').pop() || '' : '';
  }

  getEmployeeFileName(): string {
    return this.uploadEmployeeProceedingsExisitingPath ? this.uploadEmployeeProceedingsExisitingPath.split('/').pop() || '' : '';
  }
  viewEmployeeFile(): void {
    if (this.uploadEmployeeProceedingsExisitingPath) {
      window.open(this.file_access+this.uploadEmployeeProceedingsExisitingPath, '_blank');
    }
  }
  getHouseFileName():string{
      return this.uploadHouseProceedingsExisitingPath ? this.uploadHouseProceedingsExisitingPath.split('/').pop() || '' : '';
  }
  viewHouseFile(): void {
    if (this.uploadHouseProceedingsExisitingPath) {
      window.open(this.file_access+this.uploadHouseProceedingsExisitingPath, '_blank');
    }
  }

getEducationFileName(index: number): string {
  const file = this.uploadedEducationFiles[index];
  console.log(file);
  if (!file) return '';

  if (file instanceof File) {
    return file.name; // Local file
  } else if (typeof file === 'string') {
    // Extract filename from a stored URL/path
    return file.substring(file.lastIndexOf('/') + 1);
  }

  return '';
}

  viewEducationFile(index: number) {
  const file = this.uploadedEducationFiles[index];
  if (!file) return;
  console.log(file,this.file_access);
  window.open(this.file_access+file, '_blank');

  // if (file instanceof File) {
  //   const fileURL = URL.createObjectURL(file);
  //   window.open(this.file_access+fileURL, '_blank');
  // } else {
  //   window.open(file, '_blank');
  // }
}

clearEducationFile(index: number) {
  this.uploadedEducationFiles[index] = null;
  this.children.at(index).get('educationConcessionDocument')?.reset();
}


  viewFile(): void {
    if (this.uploadProceedingsExisitingPath) {
      window.open(this.file_access+this.uploadProceedingsExisitingPath, '_blank');
    }
  }

  clearFile(): void {
    this.uploadProceedingsExisitingPath = null;
    this.showFileInput = true;
    const fileInput = document.getElementById('uploadProceedings') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';  // Correct way to reset a file input
    } 
    // if(this.selectedFile){
    //   this.selectedFile = null;
    // }
  }

  clearEmployeeFile(): void {
    this.uploadEmployeeProceedingsExisitingPath = null;
    this.showEmployeeInput = true;
    const fileInput = document.getElementById('employmentProceedingsDocument') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';  // Correct way to reset a file input
    } 
  }

  clearHouseFile():void{
    this.uploadHouseProceedingsExisitingPath = null;
    this.showHouseInput = true;
    const fileInput = document.getElementById('houseSitePattaProceedingsDocument') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';  // Correct way to reset a file input
    } 
  }


  getFileName1(): string {
    return this.uploadDocumentExisitingPath ? this.uploadDocumentExisitingPath.split('/').pop() || '' : '';
  }



  viewFile1(): void {
    if (this.uploadDocumentExisitingPath) {
      window.open(this.file_access+this.uploadDocumentExisitingPath, '_blank');
    }
  }

  clearFile1(): void {
    this.uploadDocumentExisitingPath = null;
    this.showFileInput1 = true;
    const fileInput = document.getElementById('uploadFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';  // Correct way to reset a file input
    } 
    // if(this.selectedFile){
    //   this.selectedFile = null;
    // }
  }

  onEducationFileChange(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB.');
        return;
      }

      this.uploadedEducationFiles[index] = file;

      // Optional: save to FormControl
      this.children.at(index).get('educationConcessionDocument')?.setValue(file);
    }
  }

  removeEducationFile(index: number): void {
    this.uploadedEducationFiles[index] = null;
  }
}

