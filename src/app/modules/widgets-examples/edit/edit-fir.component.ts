import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
// import { ActivatedRoute, Router, NavigationStart, Event as RouterEvent } from '@angular/router';
// import { FormControl, AbstractControl } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
// import {
//   FormsModule,
//   ReactiveFormsModule,
//   FormBuilder,
//   FormGroup,
//   Validators,
//   FormArray,
// } from '@angular/forms';
import { CommonModule,formatDate  } from '@angular/common';
// import { MatSelectModule } from '@angular/material/select';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { FirService } from 'src/app/services/fir.service';
import { Router, ActivatedRoute, RouterEvent, NavigationStart} from '@angular/router';


import Swal from 'sweetalert2';
// import { MatRadioModule } from '@angular/material/radio';
import Tagify from '@yaireo/tagify';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { FirServiceAPI } from './editfir.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { PoliceDivisionService } from 'src/app/services/police-division.service';
import { NgSelectModule } from '@ng-select/ng-select';


declare var $: any;

interface HearingDetail {
  nextHearingDate?: string;  // The date for the next hearing
  reasonNextHearing?: string;  // The reason for the next hearing
}


// Define the Officer interface
interface Officer {
  officer_id?: string; // optional because it might not exist initially
  name: string;
  designation: string;
  phone: string;
}
interface FileWithPreview extends File {
  previewUrl: string;  // Add previewUrl for images
}
interface FileWithPreview1 extends File {
  previewUrl: string;  // Add previewUrl for images
}
interface FileWithPreview2 extends File {
  previewUrl: string;  // Add previewUrl for images
}
interface ImagePreview {
  file: File;
  url: string;
  index: number;
}

@Component({
  selector: 'app-edit-fir',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    NgxDropzoneModule,
    NgSelectModule
  ],
  templateUrl: './edit-fir.component.html',
  styleUrl: './edit-fir.component.scss'
})
export class EditFirComponent implements OnInit, OnDestroy {

  private fileStorage: { [key: number]: File[] } = {};
  @ViewChild('fileInput') fileInput: any;
  imagePreviews: { url: string, file: File }[] = []; 
  imagePreviews3: { url: string, file: File }[] = []; 
  imagePreviews2: { url: string, file: File }[] = []; 
  imagePreviews1: ImagePreview[] = [];
  isClickTriggered = false;
  isClickTriggered1 = false;
  isClickTriggered2 = false; 
  allFiles: { chargesheet_attachment_id: number, file_path: string }[] = [];
  allFiles1: { chargesheet_attachment_id: number, file_path: string }[] = [];
  isFileOver: boolean = false; 
  communitiesOptions: string[] = [];
  isFileOver1: boolean = false; 
  isFileOver2: boolean = false; 
  files: FileWithPreview[] = [];   
  files1: FileWithPreview1[] = [];   
  files2: FileWithPreview2[] = [];   
  mainStep: number = 1;
  step: number = 1;
  firForm: FormGroup;
  firId: string | null = null;
  chargesheet_id: string | null = null;
  accusedCommunitiesOptions: string[] = []; // Stores all accused community options

  case_id: string | undefined = '';
        case_id1: string | undefined = '';
        case_id2: string | undefined = '';

  userId: string = '';
  loading: boolean = false;
  yearOptions: number[] = [];
  today: string = '';
  nextButtonDisabled: boolean = true;
  victimNames: string[] = [];
  nextButtonClicked: boolean = false; // Track if 'Next' was clicked
  tabNavigation: boolean = false; // Track if main tab is clicked
  numberOfVictims: number = 0;

  showJudgementCopy: boolean = false;
  showLegalOpinionObtained: boolean = false;
  showCaseFitForAppeal: boolean = false;
  showGovernmentApproval: boolean = false;
  showFiledBy: boolean = false;
  showDesignatedCourt: boolean = false;
  courtDivisions: string[] = [];
  courtRanges: string[] = [];

  showDuplicateSection_1: boolean = false;
  showLegalOpinionObtained_two: boolean = false;
  showFiledBy_two: boolean = false;
  showDesignatedCourt_two: boolean = false;
  showCaseFitForAppeal_two: boolean = false;

  hideCompensationSection: boolean = false;


  showDuplicateSection = false; // To show/hide the duplicate form section
  showLegalOpinionObtained_one = false;
  showFiledBy_one = false;
  showDesignatedCourt_one = false;
  showCaseFitForAppeal_one = false;

  image_access = environment.image_access;
  image_access2 = environment.image_access2;
  apiUrl = "http://localhost:3010/";
  apiUrl1 = "http://localhost:3010/uploads/";
  reliefValues: any;

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

  @ViewChild('tagifyInput', { static: false }) tagifyInput!: ElementRef;
  // sectionsIPC: string[] = []; // Array to store multiple tags


  // Dropdown options
  policeCities: string[] = [];
  policeZones: string[] = [];
  policeRanges: string[] = [];
  revenueDistricts: string[] = [];

  offenceReliefDetails: any[] = []; 
  offenceOptions: string[] = [];
  offenceActsOptions: string[] = [];
  scstSectionsOptions: any;
  // alphabetList: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  // stationNumbers: number[] = Array.from({ length: 99 }, (_, k) => k + 1);
  firNumberOptions: number[] = Array.from({ length: 99 }, (_, k) => k + 1);
  selectedAdditionalReliefs: string[] = [];
  policeStations: string[] = [];
  victimCountArray: number[] = [];
  i: number;
  specialCourtname: string[] = [];
  firCopyValue: any;
  uploadedFIRCopy: any;
  attachmentss_1: any;
  uploadProceedings_2_preview: string;
  filePath_attachment: any;
  demo_proceeecing: any;
  constructor(
    private fb: FormBuilder,
    private firService: FirService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private firServiceAPI : FirServiceAPI,
    private sanitizer: DomSanitizer,
    private police_district :PoliceDivisionService,
   
  
   ) {}
   private wasVictimSame: boolean = false; // Track the previous state of on Victim same as Complainant

  onDrop1(event: DragEvent): void {
    if (event.dataTransfer?.files) {
      const droppedFiles = Array.from(event.dataTransfer.files); // Convert FileList to File[] 
      droppedFiles.forEach(file => {
        // Ensure that only image files are processed
        if (file && file.type && file.type.startsWith('image/')) {
          const reader = new FileReader();

          reader.onload = (e: any) => {
            const fileWithPreview1: FileWithPreview1 = {
              ...file,
              previewUrl: e.target.result // Set the base64 URL for the preview
            };
            this.files1.push(fileWithPreview1);
            this.imagePreviews2.push({ file: file, url: e.target.result });

            // Manually trigger change detection to update the view immediately
            this.cdr.detectChanges();
          };

          reader.readAsDataURL(file); // Convert image to base64 data URL
        }
      });
      this.uploadFiles(droppedFiles);
    }
  }
  onDrop2(event: DragEvent): void {
    if (event.dataTransfer?.files) {
      const droppedFiles = Array.from(event.dataTransfer.files); // Convert FileList to File[] 
      droppedFiles.forEach(file => {
        // Ensure that only image files are processed
        if (file && file.type && file.type.startsWith('image/')) {
          const reader = new FileReader();

          reader.onload = (e: any) => {
            const fileWithPreview2: FileWithPreview2 = {
              ...file,
              previewUrl: e.target.result // Set the base64 URL for the preview
            };
            this.files2.push(fileWithPreview2);
            this.imagePreviews3.push({ file: file, url: e.target.result });

            // Manually trigger change detection to update the view immediately
            this.cdr.detectChanges();
          };

          reader.readAsDataURL(file); // Convert image to base64 data URL
        }
      });
      this.uploadFiles(droppedFiles);
    }
  }
  onDrop(event: DragEvent): void {
    if (event.dataTransfer?.files) {
      const droppedFiles = Array.from(event.dataTransfer.files); // Convert FileList to File[]

      droppedFiles.forEach(file => {
        // Ensure that only image files are processed
        if (file && file.type && file.type.startsWith('image/')) {
          const reader = new FileReader();

          reader.onload = (e: any) => {
            const fileWithPreview: FileWithPreview = {
              ...file,
              previewUrl: e.target.result // Set the base64 URL for the preview
            };
            this.files.push(fileWithPreview);
            this.imagePreviews.push({ file: file, url: e.target.result });

            // Manually trigger change detection to update the view immediately
            this.cdr.detectChanges();
          };

          reader.readAsDataURL(file); // Convert image to base64 data URL
        }
      });
      this.uploadFiles(droppedFiles);
    }
  }

  uploadFiles(files: File[]): void {
    const formData = new FormData();

  // Append each file to the form data
  files.forEach((file, index) => {
    formData.append('images', file, file.name); // 'images' is the key expected by the backend
  }); 
  }
  
  onFileOver1(event: Event): void {
    // Check if the event is related to the drag-over action
    this.isFileOver1 = event.type === 'dragenter'; // 'dragenter' indicates the drag is over the dropzone
  }

  removeFile1(index: number): void {
    this.files1.splice(index, 1);
    this.imagePreviews2.splice(index, 1);
  }

  removeFile2(index: any): void {
    const attachmentIdToDelete = this.allFiles[index].chargesheet_attachment_id;
   
    this.allFiles.splice(index, 1);  
    this.removeAttachmentFromBackend1(attachmentIdToDelete);
  }
  removeAttachmentFromBackend1(id: number): void {
    this.firServiceAPI.removeAttachmentFromBackend1(id).subscribe(
      response => {
        console.log('Attachment removed successfully:', response);
      },
      error => {
        console.error('Error removing attachment:', error);
      }
    );
  }
  removeAttachmentFromBackend(id: number): void {
    this.firServiceAPI.removeAttachmentFromBackend(id).subscribe(
      response => {
        console.log('Attachment removed successfully:', response);
      },
      error => {
        console.error('Error removing attachment:', error);
      }
    );
  }
  removeFile4(index: any): void {
    const attachmentIdToDelete = this.allFiles1[index].chargesheet_attachment_id;
   
    this.allFiles1.splice(index, 1);  
    this.removeAttachmentFromBackend(attachmentIdToDelete);
  }

  onFileOver2(event: Event): void {
    // Check if the event is related to the drag-over action
    this.isFileOver2 = event.type === 'dragenter'; // 'dragenter' indicates the drag is over the dropzone
  }

  removeFile3(index: number): void {
    this.files2.splice(index, 1);
    this.imagePreviews3.splice(index, 1);
  }
  
  onFileOver(event: Event): void {
    // Check if the event is related to the drag-over action
    this.isFileOver = event.type === 'dragenter'; // 'dragenter' indicates the drag is over the dropzone
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }
  selectedFiles:any
  onChange2(event: Event): void { 
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files) {
      const selectedFiles = Array.from(inputElement.files); 
   
  
  this.selectedFiles =selectedFiles
   
      console.log(selectedFiles,"selectedFiles")
       // Convert FileList to File[]
      this.processFiles2(selectedFiles);  // Process the selected files
    } else {
      console.log('No files selected or the input is empty');
    } 
    // Once files are processed, reset the flag to allow the next click
    this.isClickTriggered1 = false;
  }

loadAccusedCommunities(): void {
  this.firService.getAllAccusedCommunities().subscribe(
    (communities: string[]) => {
      this.accusedCommunitiesOptions = communities; 
      
      
      // Populate accused community options
    },
    (error) => {
      console.error('Error loading accused communities:', error);
      Swal.fire('Error', 'Failed to load accused communities.', 'error');
    }
  );
}

// onCommunityChange(event: any, index: number): void {
//   const selectedCommunity = event.target.value;
// onCommunityChange(selectedCommunity: string, index: number): void {
//  console.log(selectedCommunity,"wssss")
//     if (selectedCommunity) {
//       this.firService.getCastesByCommunity(selectedCommunity).subscribe(
//         (castes: string[]) => {
//           const victimGroup = this.victims.at(index) as FormGroup;
//           victimGroup.patchValue({ caste: '' }); // Reset caste selection
//           victimGroup.get('availableCastes')?.setValue(castes); // Dynamically update caste options
//           this.cdr.detectChanges();
//         },
//         (error) => {
//           console.error('Error fetching castes:', error);
//           Swal.fire('Error', 'Failed to load castes for the selected community.', 'error');
//         }
//       );
//     }
// }

// // onAccusedCommunityChange(event: any, index: number): void {
// //   const selectedCommunity = event.target.value;
// onAccusedCommunityChange(selectedCommunity: string, index: number): void {
//   if (selectedCommunity) {
//     this.firService.getAccusedCastesByCommunity(selectedCommunity).subscribe(
//       (castes: string[]) => {
//         const accusedGroup = this.accuseds.at(index) as FormGroup;
//         accusedGroup.patchValue({ caste: '' }); // Reset caste selection
//         accusedGroup.get('availableCastes')?.setValue(castes);
//         // console.log(accusedGroup.get('availableCastes')?.value,"datdadadadada"); 
//         this.cdr.detectChanges();
//       },
//       (error) => {
//         console.error('Error fetching accused castes:', error);
//         Swal.fire('Error', 'Failed to load castes for the selected accused community.', 'error');
//       }
//     );
//   }
// }

  // onFileSelect_1(event: any, index: number): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const attachmentGroup = this.attachments_1.at(index) as FormGroup;
  
  //     const simulatedFilePath = `/uploads/${file.name}`;
  
    
  //     attachmentGroup.patchValue({
  //       fileName: file.name,
  //    file
  //     });
  
  //     this.cdr.detectChanges();
  //   }
  // }

  onChange1(event: Event): void { 
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files) {
      const selectedFiles = Array.from(inputElement.files);  // Convert FileList to File[]
      this.processFiles1(selectedFiles);  // Process the selected files
    } else {
      console.log('No files selected or the input is empty');
    } 
    // Once files are processed, reset the flag to allow the next click
    this.isClickTriggered1 = false;
  }

  onChange(event: Event): void { 
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files) {
      const selectedFiles = Array.from(inputElement.files);  // Convert FileList to File[]
      this.processFiles(selectedFiles);  // Process the selected files
    } else {
      console.log('No files selected or the input is empty');
    } 
    // Once files are processed, reset the flag to allow the next click
    this.isClickTriggered = false;
  }

  

  triggerFileInputClick2(): void {
    if (!this.isClickTriggered2) { 
      this.isClickTriggered2 = true;  // Set flag to prevent further triggers
      this.fileInput.nativeElement.click();  // Simulate click on the file input
    }
  }
    triggerFileInputClick1(): void {
    if (!this.isClickTriggered1) { 
      this.isClickTriggered1 = true;  // Set flag to prevent further triggers
      this.fileInput.nativeElement.click();  // Simulate click on the file input
    }
  }
  
  triggerFileInputClick(): void {
    if (!this.isClickTriggered) { 
      this.isClickTriggered = true;  // Set flag to prevent further triggers
      this.fileInput.nativeElement.click();  // Simulate click on the file input
    }
  }
  
  processFiles1(files: File[]): void {

    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
  
        // Once the file is read, create a preview URL
        reader.onload = (e: any) => {
          const fileWithPreview1: FileWithPreview1 = {
            ...file,              // Spread the original file properties
            previewUrl: e.target.result  // Set the base64 URL for preview
          }; 
          this.files1.push(fileWithPreview1);  // Add the file with preview to the array
          this.imagePreviews2.push({ file: file, url: e.target.result }); 
          this.cdr.detectChanges(); 
        };
  
        reader.readAsDataURL(file);  // Convert image to base64 URL
      }
    });
    this.isClickTriggered1 = false;
  }
  processFiles2(files: File[]): void {

    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
  
        // Once the file is read, create a preview URL
        reader.onload = (e: any) => {
          const fileWithPreview2: FileWithPreview2 = {
            ...file,              // Spread the original file properties
            previewUrl: e.target.result  // Set the base64 URL for preview
          }; 
          this.files2.push(fileWithPreview2);  // Add the file with preview to the array
          this.imagePreviews3.push({ file: file, url: e.target.result }); 
          this.cdr.detectChanges(); 
        };
  
        reader.readAsDataURL(file);  // Convert image to base64 URL
      }
    });
    this.isClickTriggered1 = false;
  }

  // Helper method to process files and generate preview URL
  processFiles(files: File[]): void {

    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
  
        // Once the file is read, create a preview URL
        reader.onload = (e: any) => {
          const fileWithPreview: FileWithPreview = {
            ...file,              // Spread the original file properties
            previewUrl: e.target.result  // Set the base64 URL for preview
          };
          this.files.push(fileWithPreview);  // Add the file with preview to the array
          this.cdr.detectChanges(); 
        };
  
        reader.readAsDataURL(file);  // Convert image to base64 URL
      }
    });
    // this.isClickTriggered = false;
  }
  



  // onFileDrop(event: any): void { 
  //   if (event.files) {
  //     this.processFiles(event.files);  // Access the dropped files directly
  //   }
  // }

  // // Handle when a file is dragged over the drop zone
  // onFileOver(event: any): void {
  //   this.isFileOver = true;  // Set to true to show the drag-over effect
  // }

  // // Handle when a file is dragged out of the drop zone
  // onFileLeave(event: any): void {
  //   this.isFileOver = false;  // Reset the effect when file leaves
  // }

  // Process files for preview and upload
  // processFiles(files: FileList | File[]): void {
  //   const newFiles = Array.from(files);  // Convert FileList to an array if needed 
  //   newFiles.forEach(file => {
  //     if (file instanceof File) { 

  //       // Check if the file is an image
  //       if (!file.type.startsWith('image/')) {
  //         console.error('Invalid file type:', file.type);
  //         return;  // Skip non-image files
  //       }

  //       const reader = new FileReader();

  //       // Once file is loaded, push preview to the array
  //       reader.onload = (e: any) => {
  //         this.imagePreviews.push({ file: file, url: e.target.result });
  //       };

  //       // Handle errors in reading the file
  //       reader.onerror = (error) => {
  //         console.error('Error reading file:', error);
  //       };

  //       // Read file as a Data URL (base64 string)
  //       reader.readAsDataURL(file);
  //     }
  //   }); 
  // }

  // Remove an image from the preview array
  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }



  triggerChangeDetection() {
    this.cdr.detectChanges();
  }
  // victimData = [
  //   { communityCertificate: 'yes', reliefAmountScst: 1000, reliefAmountExGratia: 5000, reliefAmountFirstStage: 2000, totalCompensation: 8000 },
  //   { communityCertificate: 'no', reliefAmountScst: 1200, reliefAmountExGratia: 4000, reliefAmountFirstStage: 1800, totalCompensation: 7000 },
  // ];
  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      const firId = params['fir_id'];
      if (firId) {
        sessionStorage.setItem('firId', firId); // Save FIR ID to session storage
      }
    });



    this.generateVictimCount();  
    this.initializeForm();
    this.firId = this.getFirIdFromSession(); // Get FIR ID from session storage 
    if(!this.firId)
    { 
      this.clearSession();
    } 
    this.loadOptions();
    this.loadOffenceActs();
    // this.loadScstSections();
    this.generateYearOptions();
    // this.loadnativedistrict();
    this.loadVictimsDetails();

    this.loadCourtDivisions();
    this.loadCommunities();

    this.loadPoliceDivisionDetails();

    this.loadDistricts();
    this.updateValidationForCaseType(); 
    this.loadAllOffenceReliefDetails();
    if (this.firId) {
      console.log("aaaaaaaaaaaaaaaaaaaaaaa",this.firId)
      this.loadFirDetails(this.firId);
      this.loadVictimsReliefDetails();
      //console.log(`Using existing FIR ID: ${this.firId}`);
    } else {
      //console.log('Creating a new FIR entry');
    }

    // Listen for route changes
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationStart) {
          this.firId = this.getFirIdFromSession();
          if(!this.firId)
            { 
              this.clearSession();
            } 
        }
      });

    this.userId = sessionStorage.getItem('userId') || '';

    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];
    // if (this.userId) {
    //   this.loadUserData();
    // }
    this.ngAfterViewInit();
    this.trackStep1FormValidity();
    this.firForm.statusChanges.subscribe(() => {
      if (!this.tabNavigation) {
        // Only validate when not navigating tabs
        this.nextButtonDisabled = !this.isStepValid();
        this.cdr.detectChanges();
      }
    });


    const preFilledDistrict = this.firForm.get('policeCity')?.value; // Get pre-filled district
    if (preFilledDistrict) {
      this.loadPoliceStations(preFilledDistrict); // Load stations for the pre-filled district
    }

    // Watch for district changes and reload stations dynamically
    this.firForm.get('policeCity')?.valueChanges.subscribe((district) => {
      this.loadPoliceStations(district);
    });

    // Listen for changes in isVictimSameAsComplainant
    this.firForm.get('complainantDetails.isVictimSameAsComplainant')?.valueChanges.subscribe(isVictimSame => {
      this.onVictimSameAsComplainantChange(isVictimSame=== 'true');
      this.wasVictimSame = isVictimSame=== 'true'; // Update the previous state
      const victimGroup = this.victims.at(0) as FormGroup;
      const ageControl = victimGroup.get('age');
      const nameControl = victimGroup.get('name');
      this.updateVictimNames()
      if (Number(ageControl?.value?.toString().replace(/\D/g, '')) < 18) {
        nameControl?.disable({ emitEvent: false });
        nameControl?.reset();
      }
    });
    // Updates the victim's details if they are the same as the complainant.
    const updateVictimDetails = (field: string, value: any) => {
      const isVictimSame = this.firForm.get('complainantDetails.isVictimSameAsComplainant')?.value;
      const victimsArray = this.firForm.get('victims') as FormArray;
      if (isVictimSame && victimsArray.length > 0 && this.wasVictimSame) {
        victimsArray.at(0).get(field)?.setValue(value, { emitEvent: false });
      }
    };
    ['nameOfComplainant', 'mobileNumberOfComplainant'].forEach(field => {
      this.firForm.get(`complainantDetails.${field}`)?.valueChanges.subscribe(value => {
        updateVictimDetails(field === 'nameOfComplainant' ? 'name' : 'mobileNumber', value);
      });
    });

    // this.setVictimData();
  }

  // setVictimData() {
  //   this.victimData.forEach(victim => {
  //     const victimGroup = this.fb.group({
  //       communityCertificate: [victim.communityCertificate, Validators.required],
  //       reliefAmountScst: [victim.reliefAmountScst, Validators.required],
  //       reliefAmountExGratia: [victim.reliefAmountExGratia, Validators.required],
  //       reliefAmountFirstStage: [victim.reliefAmountFirstStage, Validators.required],
  //       totalCompensation: [victim.totalCompensation, Validators.required],
  //     });

  //     this.victimsRelief.push(victimGroup);
  //   });
  // }

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



  // Dynamically adjust validators based on caseType
  updateValidationForCaseType() {
    const caseType = this.firForm.get('caseType')?.value;

    if (caseType === 'chargeSheet') {
      // this.firForm.get('proceedingsFileNo_1')?.setValidators([Validators.required]);
      // this.firForm.get('proceedingsDate_1')?.setValidators([Validators.required]);
      // this.firForm.get('uploadProceedings_1')?.setValidators([Validators.required]);
      // this.firForm.get('attachments_1')?.setValidators([Validators.required]);

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

      // Add required validators for RCS fields
      // this.firForm.get('rcsFileNumber')?.setValidators([Validators.required]);
      // this.firForm.get('rcsFilingDate')?.setValidators([Validators.required]);
      // this.firForm.get('mfCopy')?.setValidators([Validators.required]);
    }

    // Update the form controls after changing validators
    this.firForm.get('proceedingsFileNo_1')?.updateValueAndValidity();
    this.firForm.get('proceedingsDate_1')?.updateValueAndValidity();
    this.firForm.get('uploadProceedings_1')?.updateValueAndValidity();
    this.firForm.get('attachments_1')?.updateValueAndValidity();
    this.firForm.get('rcsFileNumber')?.updateValueAndValidity();
    this.firForm.get('rcsFilingDate')?.updateValueAndValidity();
    this.firForm.get('mfCopy')?.updateValueAndValidity();
  }
  loadCourtDivisions(): void {
    this.firService.getCourtDivisions().subscribe(
      (divisions: string[]) => {
        this.courtDivisions = divisions; // Populate court division options
      },
      (error) => {
        console.error('Error loading court divisions:', error);
        Swal.fire('Error', 'Failed to load court divisions.', 'error');
      }
    );
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
  loadCommunities(): void {
    this.firService.getAllCommunities().subscribe(
      (communities: string[]) => {

        // console.log('Communities fetched:', communities);

        this.communitiesOptions = communities;
      },
      (error) => {
        console.error('Error loading communities:', error);
        Swal.fire('Error', 'Failed to load communities.', 'error');
      }
    );
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
    const selectedOffences = event.value; // Get selected values from the 30th field
    this.firService.onOffenceCommittedChange(
      selectedOffences,
      index,
      this.offenceReliefDetails,
      this.victims
    );
    this.cdr.detectChanges();
  }

  selectedCourtName: string = '';
  onCourtDivisionChange1(value: any): void {
    console.log(value, "dadadada");

    if (value) {
      this.firService.getCourtRangesByDivision(value).subscribe(
        (ranges: string[]) => {
          this.courtRanges = ranges; // Populate court range options based on division
          console.log(this.courtRanges, "xa");

          // Check if the selected court name exists in the fetched court ranges
          if (this.selectedCourtName && this.courtRanges.includes(this.selectedCourtName)) {
            // Set the court name value in the form
            this.firForm.get('courtName')?.setValue(this.selectedCourtName);
          } else {
            this.firForm.patchValue({ courtName: '' }); // Reset court name if not found in ranges
          }

          // Reset court range selection
          this.firForm.patchValue({ courtRange: '' });
        },
        (error) => {
          console.error('Error fetching court ranges:', error);
          Swal.fire('Error', 'Failed to load court ranges for the selected division.', 'error');
        }
      );
    }
  }


  // onCourtDivisionChange1(value: any): void {
  //   if (value) {
  //     this.firService.getCourtRangesByDivision(value).subscribe(
  //       (ranges: string[]) => {
  //         this.courtRanges = ranges; // Populate court range options based on division
  //         this.firForm.patchValue({ courtName: value }); // Reset court name selection
          
       
  //       },
  //       (error) => {
  //         console.error('Error fetching court ranges:', error);
  //         Swal.fire('Error', 'Failed to load court ranges for the selected division.', 'error');
  //       }
  //     );
  //   }
  // }
  // imagePaths: string[] = [];

  loadFirDetails(firId: string): void {

    this.firService.getFirDetails(firId).subscribe(
      (response) => {

        console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",response);

        this.showDuplicateSection = false;
        this.showDuplicateSection_1 = false;

        if (response.appeal_details && response.appeal_details.length > 0) {
          response.appeal_details.forEach((appealDetail:any) => {
            this.firForm.patchValue({
              judgementDetails: {
                judgementNature: appealDetail.judgementNature || '',
          legalOpinionObtained: appealDetail.legal_opinion_obtained || '',
          filedBy:appealDetail.filed_by || '',
          designatedCourt:appealDetail.designated_court || '',
          caseFitForAppeal:appealDetail.case_fit_for_appeal || '',

          governmentApprovalForAppeal: appealDetail.government_approval_for_appeal || '',
              }
              // trialCourtDistrict: appealDetail.court_district || '',
              // trialCaseNumber: appealDetail.trial_case_number || '',
              // publicProsecutor: appealDetail.public_prosecutor || '',
             
            });

            console.log(this.firForm.get('judgementDetails')?.value,"sasasasasasa");

            this.onLegalOpinionChange();
            this.onDesignatedCourtChange_demo();
            this.onJudgementNatureChange();
          });
      }
      

      if (response.casedetail_one && response.casedetail_one.length > 0) {
console.log(response.casedetail_one,"casedetail_onee")
        response.casedetail_one.forEach((item:any) => {

          this.firForm.patchValue({
            Court_one: item.court_name || '',
            courtDistrict_one: item.court_district || '',
            caseNumber_one: item.case_number || '',
            publicProsecutor_one: item.public_prosecutor || '',
            prosecutorPhone_one: item.prosecutor_phone || '',
            firstHearingDate_one: item.second_hearing_date ? formatDate(item.second_hearing_date, 'yyyy-MM-dd', 'en') : '',
            judgementAwarded_one: item.judgement_awarded || '',
            judgementNature_one:item.judgementNature || '',
          });

          
          // this.onJudgementNatureChange_two();
        });
      }
      if (response.appeal_details_one && response.appeal_details_one.length > 0) {
        console.log(response.appeal_details_one,"appeal_details_one")
                response.appeal_details_one.forEach((appealDetail:any) => {
        
                        this.firForm.patchValue({
                          judgementDetails_one: {
                judgementNature_one: appealDetail.judgementNature || '',
     

                legalOpinionObtained_one: appealDetail.legal_opinion_obtained || '',
                caseFitForAppeal_one:appealDetail.case_fit_for_appeal || '',
                filedBy_one: appealDetail.filed_by || '',
        
                designatedCourt_one: appealDetail.designated_court || '',
            
                governmentApprovalForAppeal_one:appealDetail.government_approval_for_appeal || '',

              }
            
             
            });
                  this.onJudgementNatureChange_one();
                  this.onLegalOpinionChange_one();
                  this.onDesignatedCourtChange_one_fromapi();
                });
              }


      if (response.casedetail_two && response.casedetail_two.length > 0) {
        console.log(response.casedetail_two,"casedetail_two")
                response.casedetail_two.forEach((item:any) => {
        
                  const judgementAwardedValue = item.judgement_awarded || '';
                  this.firForm.patchValue({
                    judgementAwarded3: judgementAwardedValue,

                    courtDistrict_two : item.court_district,
                    caseNumber_two:item.case_number,
                    publicProsecutor_two:item.public_prosecutor,
                    prosecutorPhone_two:item.prosecutor_phone,

                    firstHearingDate_two:item.second_hearing_date ? formatDate(item.second_hearing_date, 'yyyy-MM-dd', 'en') : '',
                  });
                  this.applyJudgementAwardedValidators(judgementAwardedValue);
                  
                });
              }


              if (response.compensation_details_2 && response.compensation_details_2.length > 0) {
                console.log(response.compensation_details_2,"compensation_details_2")
                        response.compensation_details_2.forEach((item:any) => {
                    
                        
                          this.firForm.patchValue({
                            totalCompensation_2: item.total_compensation,
                            proceedingsFileNo_2: item.proceedings_file_no,
                            proceedingsDate_2: item.proceedings_date  ? formatDate(item.proceedings_date, 'yyyy-MM-dd', 'en') : '',
                            uploadProceedings_2: item.upload_proceedings

                          });
                          if (item.upload_proceedings) {
                            this.uploadProceedings_2_preview = `${this.image_access2}${item.upload_proceedings}`;

                            console.log( this.uploadProceedings_2_preview," this.uploadProceedings_2_preview")
                          }
                          
                        });
                        
                      }



      if (response.hearingDetails_one && response.hearingDetails_one.length > 0) {
        console.log(response.hearingDetails_one, "response.hearingDetails_one");
      
        const hearingDetailsControl = this.firForm.get('hearingDetails_one') as FormArray;
      
        console.log(hearingDetailsControl, "hearingDetailsControl");
      
        hearingDetailsControl.clear(); 
      
        response.hearingDetails_one.forEach((hearing: any) => {
          const hearingGroup = this.createHearingDetailGroup_one();
      
          hearingGroup.patchValue({
            nextHearingDate_one: hearing.next_hearing_date ? formatDate(hearing.next_hearing_date, 'yyyy-MM-dd', 'en') : '',
            reasonNextHearing_one: hearing.reason_next_hearing,
          });
      
          hearingDetailsControl.push(hearingGroup);
        });
      }
      
      

        if (response.data5 && response.data5.length > 0) {

          response.data5.forEach((item: any, index: number) => {

            if (index === 0) {

              this.case_id = item.case_id || '';
              // Populate main section
              this.firForm.patchValue({
                Court_name1: item.court_name || '',
                trialCourtDistrict: item.court_district || '',
                trialCaseNumber: item.trial_case_number || '',
                publicProsecutor: item.public_prosecutor || '',
                prosecutorPhone: item.prosecutor_phone || '',
                firstHearingDate: item.first_hearing_date ? formatDate(item.first_hearing_date, 'yyyy-MM-dd', 'en') : '',
                judgementAwarded: item.judgement_awarded || '',
                CaseHandledBy:item.CaseHandledBy || '',
                judgementAwarded1:item.judgementAwarded1 ||'',
                judgementAwarded2:item.judgementAwarded2 ||'',
                judgementAwarded3:item.judgementAwarded3 ||'',
           
              });
      



              if (item.hearingDetails && Array.isArray(item.hearingDetails)) {



                const hearingDetailsControl = this.firForm.get('hearingDetails') as FormArray;

console.log(hearingDetailsControl,"hearingDetailsControl")


                hearingDetailsControl.clear();
                item.hearingDetails.forEach((hearing: HearingDetail) => {
                  hearingDetailsControl.push(this.createHearingDetailGroup());
                });
              }
            } else if (index === 1) {
              this.case_id1 = item.case_id || '';
              // Populate duplicate section 1
              this.showDuplicateSection = true;
              this.firForm.patchValue({
                Court_one: item.court_name || '',
                courtDistrict_one: item.court_district || '',
                caseNumber_one: item.trial_case_number || '',
                publicProsecutor_one: item.public_prosecutor || '',
                prosecutorPhone_one: item.prosecutor_phone || '',
                firstHearingDate_one: item.first_hearing_date ? formatDate(item.first_hearing_date, 'yyyy-MM-dd', 'en') : '',
                judgementAwarded_one: item.judgement_awarded || '',
              });
        
            
              if (item.hearingDetails_one && Array.isArray(item.hearingDetails_one)) {
                const hearingDetailsControl = this.firForm.get('hearingDetails_one') as FormArray;

                console.log(hearingDetailsControl,"hearingDetailsControl")
                hearingDetailsControl.clear();
                item.hearingDetails_one.forEach((hearing: HearingDetail) => {
                  hearingDetailsControl.push(this.createHearingDetailGroup_one());
                });
              }
            } else if (index === 2) {
              this.case_id2 = item.case_id || '';
          
              this.showDuplicateSection_1 = true;
              this.firForm.patchValue({
                Court_three: item.court_name || '',
                courtDistrict_two: item.court_district || '',
                caseNumber_two: item.trial_case_number || '',
                publicProsecutor_two: item.public_prosecutor || '',
                prosecutorPhone_two: item.prosecutor_phone || '',
                firstHearingDate_two: item.first_hearing_date ? formatDate(item.first_hearing_date, 'yyyy-MM-dd', 'en') : '',
                judgementAwarded_two: item.judgement_awarded || '',
              });
   
              if (item.hearingDetails_two && Array.isArray(item.hearingDetails_two)) {
                const hearingDetailsControl = this.firForm.get('hearingDetails_two') as FormArray;
                hearingDetailsControl.clear();
                item.hearingDetails_two.forEach((hearing: HearingDetail) => {
                  hearingDetailsControl.push(this.createHearingDetailGroup_two());
                });
              }
            }
          });



          // console.log('Case IDs:', { case_id, case_id1, case_id2 });
        }
        

        if (response.hearingDetails && response.hearingDetails.length > 0) {
          const hearingDetailsControl = this.firForm.get('hearingDetails') as FormArray;
          hearingDetailsControl.clear();
        
          response.hearingDetails.forEach((hearing: any) => {
            const hearingGroup = this.createHearingDetailGroup();
        
            hearingGroup.patchValue({
       
              nextHearingDate: hearing.next_hearing_date ? formatDate(hearing.next_hearing_date, 'yyyy-MM-dd', 'en') : '',
              reasonNextHearing: hearing.reason_next_hearing,
            });
        
            hearingDetailsControl.push(hearingGroup);
          });
        }
        
        


        // if(response.data.police_station)
        // {
        //   const str = response.data.police_station ?? ''; // Ensures that str is at least an empty string if null or undefined
        //   const result = str.split("-");
        //   this.firForm.get('alphabetSelection')?.setValue(result[0]);
        //   this.firForm.get('stationNumber')?.setValue(result[1]);
        //   this.firForm.get('stationName')?.setValue(result[2]);
        // }  

        // step 1
        if(response.data.police_city){
          this.firForm.get('policeCity')?.setValue(response.data.police_city);
        }
        if(response.data.police_range){
          this.firForm.get('policeRange')?.setValue(response.data.police_range); 
        }
        if(response.data.police_zone){
          this.firForm.get('policeZone')?.setValue(response.data.police_zone); 
        }
        if(response.data.revenue_district){
          this.firForm.get('revenueDistrict')?.setValue(response.data.revenue_district); 
        }
        if(response.data.police_station){
          this.firForm.get('stationName')?.setValue(response.data.police_station); 
        }
        if(response.data.officer_name){
          this.firForm.get('officerName')?.setValue(response.data.officer_name); 
        }
        if(response.data.officer_designation){
          this.firForm.get('officerDesignation')?.setValue(response.data.officer_designation); 
        }
        if(response.data.officer_phone){
          this.firForm.get('officerPhone')?.setValue(response.data.officer_phone); 
        }

        // step 2
        if(response.data.fir_number){
          this.firForm.get('firNumber')?.setValue(response.data.fir_number); 
        }
        if(response.data.fir_number_suffix){
          this.firForm.get('firNumberSuffix')?.setValue(response.data.fir_number_suffix); 
        }
        if(response.data.date_of_occurrence) { 
          const dateObj = new Date(response.data.date_of_occurrence);
          const formattedDate = dateObj.toISOString().split('T')[0];
          this.firForm.get('dateOfOccurrence')?.setValue(formattedDate);
        }
        if(response.data.time_of_occurrence){
          this.firForm.get('timeOfOccurrence')?.setValue(response.data.time_of_occurrence); 
        }
        if(response.data.place_of_occurrence){
          this.firForm.get('placeOfOccurrence')?.setValue(response.data.place_of_occurrence); 
        }
        if(response.data.date_of_registration){
          const dateObj1 = new Date(response.data.date_of_occurrence);
          const formattedDate1 = dateObj1.toISOString().split('T')[0];
          this.firForm.get('dateOfRegistration')?.setValue(formattedDate1); 
        }
        if(response.data.time_of_registration){
          this.firForm.get('timeOfRegistration')?.setValue(response.data.time_of_registration); 
        }

        // step 3
        // if(response.data.sections_ipc){
        //   this.firForm.get('sectionsIPC')?.setValue(response.data.sections_ipc); 
        // }
        // if (response.data.nature_of_offence) {
        //   // Split the comma-separated string into an array
        //   const selectedOffences = response.data.nature_of_offence.split(',').map((offence: string) => offence.trim()); 
        
        //   // Set the selected offences to the form control
        //   this.firForm.get('natureOfOffence')?.setValue(selectedOffences); 
        // }

        if(response.data.name_of_complainant){ 
          this.firForm.get('complainantDetails.nameOfComplainant')?.setValue(response.data.name_of_complainant); 
        }
        if(response.data.mobile_number_of_complainant){
          this.firForm.get('complainantDetails.mobileNumberOfComplainant')?.setValue(response.data.mobile_number_of_complainant); 
        }
        if(response.data.is_victim_same_as_complainant){
          const isVictimSameAsComplainant = response.data.is_victim_same_as_complainant === 1;
          this.firForm.get('complainantDetails.isVictimSameAsComplainant')?.setValue(isVictimSameAsComplainant);
        }




        if (response && response.data4 && response.data4.all_attachments) {
          try {
            // Split the concatenated string by commas to get each attachment's id and file path
            const allFilesArray: { chargesheet_attachment_id: number, file_path: string }[] = response.data4.all_attachments.split(',').map((attachment: string) => {
              const [attachmentId, filePath] = attachment.split('||'); // Split by colon to get id and path
              return { chargesheet_attachment_id: attachmentId, file_path: filePath };
            });
        
            this.allFiles1 = allFilesArray;
          } catch (error) {
            console.error('Error parsing all_attachments:', error);
            this.allFiles1 = [];
          }
        }
        
        if (response && response.data3 && response.data3.all_attachments) {
          try {
            // Split the concatenated string by commas to get each attachment's id and file path
            const allFilesArray: { chargesheet_attachment_id: number, file_path: string }[] = response.data3.all_attachments.split(',').map((attachment: string) => {
              const [attachmentId, filePath] = attachment.split('||'); // Split by colon to get id and path
              return { chargesheet_attachment_id: attachmentId, file_path: filePath };
            });
        
            this.allFiles = allFilesArray;

            console.log(response,"this.allFiles")
          } catch (error) {
            console.error('Error parsing all_attachments:', error);
            this.allFiles = [];
          }
        }
        
        // if (response.data3.all_files) {
        //   try {
        //     const allFilesArray = JSON.parse(response.data3.all_files);  // Assuming this is a JSON string
        //     this.allFiles = allFilesArray.map((fileUrl: string) => {
        //       // Check if the fileUrl is relative and prepend the base URL
        //       if (fileUrl) {
        //         return fileUrl;  // Prepend the base URL to the relative path
        //       }
        //       return fileUrl;  // Already an absolute URL
        //     }); 
        //   } catch (error) {
        //     console.error('Error parsing all_files:', error);
        //     this.allFiles = [];
        //   }
        // }

        if(response && response.data && response.data.number_of_victim){ 
          this.firForm.get('complainantDetails.numberOfVictims')?.setValue(response.data.number_of_victim); 
        }
        if(response && response.data && response.data.is_deceased){ 
          if(response.data.is_deceased == 1){
            this.firForm.get('isDeceased')?.setValue("yes");
          }
          else{
            this.firForm.get('isDeceased')?.setValue("no");
          }
        }

        if (response && response.data && response.data.deceased_person_names) {
          let deceased_person_names: any[] = [];
          if (typeof response.data.deceased_person_names === 'string') {
            try {
              deceased_person_names = JSON.parse(response.data.deceased_person_names);
            } catch (error) {
              console.error("Error parsing deceased_person_names:", error);
            }
          } else {
            deceased_person_names = response.data.deceased_person_names;
          }
          this.victimNames = response.data1
          .map((victim: any) => victim.victim_name);
          this.firForm.get('deceasedPersonNames')?.setValue(deceased_person_names);
        }

        if (response && response.data && response.data.number_of_accused) {
          this.firForm.get('numberOfAccused')?.setValue(response.data.number_of_accused);
        }

          // 1. Total Compensation
          if (response && response.data3 && response.data3.total_compensation) {
            this.firForm.get('totalCompensation')?.setValue(response.data3.total_compensation);
          }

          // 2. Proceedings File No.
          if (response && response.data3 && response.data3.proceedings_file_no) {
            this.firForm.get('proceedingsFileNo')?.setValue(response.data3.proceedings_file_no);
          }

          // 3. Proceeding File (judgement file URL)
          if (response && response.data3 && response.data3.proceedings_file) {


const data = response.data3.proceedings_file


this.firForm.get('proceedingsFile')?.setValue(data);


this.filePath_attachment = response.data3.file_paths?.length
? response.data3.file_paths.map((file:any) => `${this.apiUrl}uploads/${file}`)
: [];



if (!this.attachmentss_1) {
  this.attachmentss_1 = [];
}


this.filePath_attachment.forEach((filePath: any) => {
  this.attachmentss_1.push({ id: "", path: filePath, file: filePath });
});

console.log("Updated attachmentss_1:", this.attachmentss_1);



          }

          // 4. Proceedings Date
          if (response && response.data3 && response.data3.proceedings_date) {
            const dateObj = new Date(response.data3.proceedings_date);
            const formattedDate = dateObj.toISOString().split('T')[0]; // Format to 'yyyy-mm-dd'
            this.firForm.get('proceedingsDate')?.setValue(formattedDate);
          }

          const chargesheetDetails = response.data4;
          if (chargesheetDetails && chargesheetDetails.charge_sheet_filed) {
            if(chargesheetDetails && chargesheetDetails.charge_sheet_filed == "yes")
            {
              this.firForm.get('chargeSheetFiled')?.setValue("yes");
            }
            else{
              this.firForm.get('chargeSheetFiled')?.setValue("no");
            }
            
          }

          if(chargesheetDetails && chargesheetDetails.chargesheet_id){
            this.chargesheet_id = chargesheetDetails.chargesheet_id;


          }

        if (chargesheetDetails && chargesheetDetails.court_district) {
          
          this.firForm.get('courtDivision')?.setValue(chargesheetDetails.court_district);
        }
        if (chargesheetDetails && chargesheetDetails.court_name) { 
        
this.selectedCourtName = chargesheetDetails.court_name;
this.onCourtDivisionChange1(chargesheetDetails.court_district);

// Now, patch the form with the court name value
this.firForm.get('courtName')?.setValue(this.selectedCourtName);
          // this.firForm.get('courtName')?.setValue(chargesheetDetails.court_name);
          // this.firForm.patchValue({ courtName: chargesheetDetails.court_name });
        }
        if (chargesheetDetails && chargesheetDetails.case_type) {
          this.firForm.get('caseType')?.setValue(chargesheetDetails.case_type);
        }
        if (chargesheetDetails && chargesheetDetails.case_number) {
          this.firForm.get('caseNumber')?.setValue(chargesheetDetails.case_number);
        }

        // Set RCS file number and filing date
        if (chargesheetDetails && chargesheetDetails.rcs_file_number) {
          this.firForm.get('rcsFileNumber')?.setValue(chargesheetDetails.rcs_file_number);
        }
        if (chargesheetDetails && chargesheetDetails.rcs_filing_date) {
          const rcsFilingDate = new Date(chargesheetDetails.rcs_filing_date);
          const formattedDate = rcsFilingDate.toISOString().split('T')[0];
          this.firForm.get('rcsFilingDate')?.setValue(formattedDate);
        }

        if (response && response.data4 && response.data4.total_compensation_1) {
          this.firForm.get('totalCompensation_1')?.setValue(response.data4.total_compensation_1);
        } 
        if (response && response.data4 && response.data4.proceedings_file_no) {
          // console.log(response.data4.proceedings_file_no);
          // console.log("response.data4.proceedings_file_no");
          this.firForm.get('proceedingsFileNo_1')?.setValue(response.data4.proceedings_file_no);
        }

        if (response && response.data6 && response.data6.Commissionerate_file) {
          // console.log(response.data6.Commissionerate_file);
          // console.log("response.data6.Commissionerate_file");
          this.firForm.get('uploadProceedings')?.setValue(response.data6.Commissionerate_file);
        }

        if (response && response.data6 && response.data6.proceedings_file_no) {
          // console.log(response.data6.proceedings_file_no);
          // console.log("response.data6.proceedings_file_no");
          this.firForm.get('proceedingsFileNo')?.setValue(response.data6.proceedings_file_no);
        }

        if (response && response.data6 && response.data6.proceedings_date) {
          const dateObj = new Date(response.data6.proceedings_date);
          const formattedDate = dateObj.toISOString().split('T')[0]; // Format to 'yyyy-mm-dd'
          this.firForm.get('proceedingsDate')?.setValue(formattedDate);
        }

        if (response && response.data && response.data.nature_of_judgement) {
            this.firForm.get('judgementDetails.judgementNature')?.setValue(response.data.nature_of_judgement);
        }

        if (response && response.data && response.data.judgement_copy) {
          this.firForm.get('judgementDetails.uploadJudgement')?.setValue(response.data.judgement_copy);
      }

        // 3. Proceeding File (judgement file URL)
        if (response && response.data4 && response.data4.upload_proceedings_path) { 
          this.firForm.get('uploadProceedings_1')?.setValue(response.data4.upload_proceedings_path);
        }  if (response && response.data4 && response.data4.attachments) { 


          this.attachmentss_1 =  response.data4.attachments

          console.log(this.attachmentss_1," response.data4.attachments")
          // this.firForm.get('attachments')?.setValue(response.data4.attachments);
        }

          // 4. Proceedings Date
          if (response && response.data4 && response.data4.proceedings_date) {
            const dateObj = new Date(response.data4.proceedings_date);
            const formattedDate = dateObj.toISOString().split('T')[0]; // Format to 'yyyy-mm-dd'
            this.firForm.get('proceedingsDate_1')?.setValue(formattedDate);
          }
          
          
        if (response && response.data1 && response.data1 && response.data1.length > 0) {
          // Resetting the victims array in case of a previous value
          const victimsFormArray = this.firForm.get('victims') as FormArray;
          victimsFormArray.clear(); // Clear any existing victims data

          response.data1.forEach((victim: any, index: number) => {

            const victimGroup = this.createVictimGroup();
            let offence_committed_data: any[] = [];
            let scst_sections_data: any[] = [];

            if (victim.offence_committed) {
              offence_committed_data = JSON.parse(victim.offence_committed);
            }
            if (victim.scst_sections) {
              scst_sections_data = JSON.parse(victim.scst_sections);
            }
        
            victimGroup.patchValue({
              victim_id: victim.victim_id,
              name: victim.victim_name,
              age: victim.victim_age,
              gender: victim.victim_gender,
              mobileNumber: victim.mobile_number,
              address: victim.address,
              victimPincode: victim.victim_pincode,
              community: victim.community,
              caste: victim.caste,
              guardianName: victim.guardian_name,
              isNativeDistrictSame: victim.is_native_district_same,
              nativeDistrict: victim.native_district,
              offenceCommitted: offence_committed_data,
              scstSections: scst_sections_data,
              sectionsIPC: victim.sectionsIPC
            });
        
            this.firService.getCastesByCommunity(victim.community).subscribe(
              (castes: string[]) => {
                victimGroup.get('availableCastes')?.setValue(castes); // Dynamically update caste options
              },
              (error) => {
                console.error('Error fetching castes:', error);
                Swal.fire('Error', 'Failed to load castes for the selected community.', 'error');
              }
            );

            victimsFormArray.push(victimGroup);

            this.onVictimAgeChange(index)
          });       
        }
        const accusedFormArray = this.firForm.get('accuseds') as FormArray;

        if (response && response.data2 && response.data2.length > 0) {
          accusedFormArray.clear(); 
          this.firCopyValue = [];
          response.data2.forEach((accused: any,index:number) => {

            console.log(accused.upload_fir_copy,"uploadFIRCopy")
            

            const selectedCommunity = accused.community;
       


                       if (selectedCommunity) {
                    this.firService.getAccusedCastesByCommunity(selectedCommunity).subscribe(
                  (castes: string[]) => {
                     this.scstSectionsOptions = castes;

                       this.cdr.detectChanges();
                 },
                             (error) => {
                        console.error('Error fetching accused castes:', error);
                    Swal.fire('Error', 'Failed to load castes for the selected accused community.', 'error');
                       }
                       );
                         }


            const accusedGroup = this.createAccusedGroup();

            
            // console.log('accusedGroupaccusedGroup:', accusedGroup);

            accusedGroup.patchValue({
              accusedId: accused.accused_id,
              age: accused.age,
              name: accused.name,
              gender: accused.gender,
              address: accused.address,
              pincode: accused.pincode,
              community: accused.community,
              caste: accused.caste,
              guardianName: accused.guardian_name,
              previousIncident: accused.previous_incident == 1 ? "true" : "false",
              previousFIRNumber: accused.previous_fir_number,
              previousFIRNumberSuffix: accused.previous_fir_number_suffix,
              scstOffence: accused.scst_offence == 1 ? "true" : "false",
              scstFIRNumber: accused.scst_fir_number,
              scstFIRNumberSuffix: accused.scst_fir_number_suffix,
              antecedents: accused.antecedents,
              landOIssues: accused.land_o_issues,
              gistOfCurrentCase: accused.gist_of_current_case,
              uploadFIRCopy:accused.upload_fir_copy,

            });




            
            accusedFormArray.push(accusedGroup);


            console.log(accusedFormArray,"accusedFormArrayaccusedFormArrayaccusedFormArray")
          });
        }

      },
      (error) => {
        console.error('Error loading FIR details:', error);
      }
    );
  }
  applyJudgementAwardedValidators(value: string): void {
    if (value === 'yes') {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.clearValidators();
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.clearValidators();
    }
    this.firForm.get('judgementDetails_two.judgementNature_two')?.updateValueAndValidity();
    this.firForm.get('judgementDetails_two.uploadJudgement_two')?.updateValueAndValidity();
    this.cdr.detectChanges();
  }
  
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: any): void { 
    this.firId = this.getFirIdFromSession();
    if(!this.firId)
      { 
        this.clearSession();
      } 
  } 
  get accusedFormArray(): FormArray {
    return this.firForm.get('accuseds') as FormArray; // Getter for the FormArray
  }
  getFirIdFromSession(): string | null {

    // console.log("ppppppppppppppppppppppppppppppp",sessionStorage.getItem('firId'));

    return sessionStorage.getItem('firId');
  }

  






  clearSession(): void { 
    const currentUri = window.location.href;
     
    sessionStorage.removeItem('firId');
    sessionStorage.removeItem('officerIds');
  }

  ngOnDestroy(): void { 
    this.firId = this.getFirIdFromSession();
    if(!this.firId)
      { 
        this.clearSession();
      } 
  }

  getImagePath(path: string): string {
    if (!path) return '';
    return this.image_access + path.replace(/\\/g, '/');  
  }
  
  // Handle image load errors
 
    
  checkFormValidity() {
    // Enable the "Next" button only if the form is valid and it's Step 1
    this.nextButtonDisabled = !(this.firForm.valid && this.step === 1);
    this.cdr.detectChanges(); // Trigger change detection
  }




  courtNames: string[] = [
    'Chennai District Court',
    'Madurai Bench of Madras High Court',
    'Coimbatore District Court',
    'Salem District Court',
    'Trichy District Court'
  ];

  courtDistricts: string[] = [
    'Chennai',
    'Madurai',
    'Coimbatore',
    'Salem',
    'Trichy'
  ];


  // Save Step 1 and track officer IDs after the first save
  saveStepOneAsDraft() {
    const firData = {
      ...this.firForm.value,
    };

    this.firService.handleStepOne(this.firId, firData).subscribe(
      (response: any) => { 
        this.firId = response.fir_id;
        if (this.firId) {
          sessionStorage.setItem('firId', this.firId); 
        }
        const officerIds = response.officerIds || [];
        const savedOfficerIds: string[] = [];
        sessionStorage.setItem('officerIds', JSON.stringify(savedOfficerIds)); 

        Swal.fire('Success', 'FIR saved as draft for step 1.', 'success');
      },
      (error) => {
        console.error('Error saving FIR for step 1:', error);
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
      timeOfOccurrence: this.firForm.value.timeOfOccurrence,
      placeOfOccurrence: this.firForm.value.placeOfOccurrence,
      dateOfRegistration: this.firForm.value.dateOfRegistration,
      timeOfRegistration: this.firForm.value.timeOfRegistration,
      // natureOfOffence: this.firForm.value.natureOfOffence, // Array or single value
      // sectionsIPC: this.firForm.value.sectionsIPC,  // Convert to a comma-separated string
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
        console.error('Error saving FIR for step 2:', error);
        Swal.fire('Error', 'Failed to save FIR as draft for step 2.', 'error');
      }
    );
  }

  saveStepThreeAsDraft() {

    const firData = {
      firId: this.firId,
      complainantDetails: this.firForm.get('complainantDetails')?.value,
      victims: this.victims.value,
      isDeceased: this.firForm.get('isDeceased')?.value,
      deceasedPersonNames: this.firForm.get('deceasedPersonNames')?.value || [],
    };

    this.firService.saveStepThreeAsDraft(firData).subscribe(
      (response: any) => {
        this.firId = response.fir_id;
        if (this.firId) {
          sessionStorage.setItem('firId', this.firId);
        }
        Swal.fire('Success', 'FIR saved as draft for step 3.', 'success');
      },
      (error) => {
        console.error('Error saving FIR for step 3:', error);
        Swal.fire('Error', 'Failed to save FIR as draft for step 3.', 'error');
      }
    );
  }



  multipleFiles: any[][] = [];
  showImage: boolean[] = []; 
  
  uploadedFiles: { [key: number]: boolean } = {};

  fileUrls: { [key: number]: string } = {};
  onFileChange(event: any, i: number): void {
    const selectedFile = event.target.files[0]; 
    if (!selectedFile) return;

    this.accuseds.get('uploadFIRCopy')?.setValue(null);
  
    if (!this.multipleFiles[i]) {
      this.multipleFiles[i] = [];
    }
  
    this.multipleFiles[i].push(selectedFile);
  

    this.fileUrls[i] = URL.createObjectURL(selectedFile);
    
   
    this.uploadedFiles[i] = true;
  }
  
  onDeleteFile(i: number): void {

    this.multipleFiles[i] = [];
    this.fileUrls[i] = '';
    this.uploadedFiles[i] = false;

    this.accuseds.get('uploadFIRCopy')?.setValue(null);
  }

  sanitizeImage(base64Image: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(base64Image);
  }
 
 
  onFileChangee(event: any, index: number): void {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.attachmentss_1[index].path = e.target.result; // Direct Base64 conversion
      };
      reader.readAsDataURL(file); // Convert file to Base64 for direct preview
  
      if (!this.attachmentss_1) {
        this.attachmentss_1 = [];
      }
  
      while (this.attachmentss_1.length <= index) {
        this.attachmentss_1.push({ id: "", path: "", file: null });
      }
  
      this.attachmentss_1[index].file = file;
  
      // Update FormArray
      const attachmentsControl = this.firForm.get('attachments_1') as FormArray;
      if (attachmentsControl.length <= index) {
        attachmentsControl.push(this.fb.group({
          file: [null],
          filePath: [''],
          fileName: ['']
        }));
      }
  
      const attachmentControl = attachmentsControl.at(index);
      if (!attachmentControl) {
        console.error(`Form control at index ${index} is undefined`);
        return;
      }
  
      attachmentControl.patchValue({
        file: file,
        filePath: file,
        fileName: file.name
      });
    }
  }
  
  
  isImage(filePath: string | File | null): boolean {
    if (!filePath) return false;
    
    if (typeof filePath === 'string') {
      return filePath.match(/\.(jpeg|jpg|png|gif|bmp)$/i) !== null;
    }

    if (filePath instanceof File) {
      return filePath.type.startsWith('image/');
    }

    return false;
  }
  
  
  removeAttachment_1(index: number) {
    const attachmentsControl = this.firForm.get('attachments_1') as FormArray;
  
    if (!attachmentsControl || attachmentsControl.length <= index) {
      console.error("Attempted to remove an undefined attachment at index", index);
      return;
    }
  

    attachmentsControl.removeAt(index);
  
 
    if (this.attachmentss_1 && index < this.attachmentss_1.length) {
      this.attachmentss_1.splice(index, 1);
    }
  
   
    if (this.filePath_attachment && index < this.filePath_attachment.length) {
      this.filePath_attachment.splice(index, 1);
    }
  
   
    if (this.attachmentss_1.length > 0) {
      this.attachmentss_1 = this.attachmentss_1.map((item:any, i:any) => ({
        id: item.id,
        path: item.path,
        file: item.file,
      }));
  
    
      while (attachmentsControl.length > 0) {
        attachmentsControl.removeAt(0);
      }
  
      this.attachmentss_1.forEach((attachment:any, i:any) => {
        attachmentsControl.push(this.fb.group({
          filePath: [attachment.path]
        }));
      });
    }
  
    // Refresh UI
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }
  
  
  
  

  
  saveStepFourAsDraft(): void {
  
    const firData = {
      firId: this.firId,
      numberOfAccused: this.firForm.get('numberOfAccused')?.value,
      accuseds: this.firForm.get('accuseds')?.value.map((accused: any, index: number) => ({
        ...accused,
        accusedId: accused.accusedId || null,
        uploadFIRCopy: this.multipleFiles[index] || null
    
  
  
      })),
    };
console.log(firData,"firDatafirDatafirData")
console.log(this.multipleFiles ,"multipleFilesmultipleFiles")
    this.firService.saveStepFourAsDraft(firData).subscribe(
      (response: any) => {
        this.firId = response.fir_id;
        if (this.firId) {
          sessionStorage.setItem('firId', this.firId);
        }
        Swal.fire('Success', 'FIR saved as draft for step 4.', 'success');
      },
      (error) => {
        console.error('Error saving FIR for step 4:', error);
        Swal.fire('Error', 'Failed to save FIR as draft for step 4.', 'error');
      }
    );
  }


  saveStepFiveAsDraft(isSubmit: boolean = false): void {
    if (!this.firId) {
      Swal.fire('Error', 'FIR ID is missing. Unable to proceed.', 'error');
      return;
    }
    const attachmentsControl = this.firForm.get('attachments_1') as FormArray;
    const firData = {
      firId: this.firId,
      victimsRelief: this.victimsRelief.value.map((relief: any) => ({

        victimId:relief.victimId,
        victimName:relief.victimName,
        communityCertificate: relief.communityCertificate,
        // reliefAmountScst: relief.reliefAmountScst,
        // reliefAmountExGratia: relief.reliefAmountExGratia,
        // reliefAmountFirstStage: relief.reliefAmountFirstStage,
        additionalRelief: relief.additionalRelief,
      })),
      totalCompensation: this.firForm.get('totalCompensation')?.value,
      proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value,
      proceedingsDate: this.firForm.get('proceedingsDate')?.value,
      // uploadFIRCopy: this.multipleFiles[index] || null
      // this.multipleFilesForproceeding[i]
      proceedingsFile: this.multipleFilesForproceeding || '',
      attachments:this.attachmentss_1,
      status: isSubmit ? 5 : undefined,
    };
  console.log(firData,"firDatafirDatafirData")

    this.firService.updatestep5(firData).subscribe(
      (response) => {
        if (isSubmit) {
          Swal.fire({
            title: 'Success',
            text: 'FIR Stage Form Completed! Redirecting to Chargesheet...',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.navigateToChargesheetPage();
          });
        } else {
          Swal.fire('Success', 'Step 5 data saved as draft successfully', 'success');
        }
      },
      (error) => {
        console.error('Error saving Step 5 data:', error);
        Swal.fire('Error', 'Failed to save Step 5 data', 'error');
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
        // $(this.tagifyInput.nativeElement).on('itemAdded', (event: any) => {
        //   this.sectionsIPC.push(event.item);
        //   this.updateSectionsIPCControl();
        // });

        // $(this.tagifyInput.nativeElement).on('itemRemoved', (event: any) => {
        //   this.sectionsIPC = this.sectionsIPC.filter(tag => tag !== event.item);
        //   this.updateSectionsIPCControl();
        // });
      }
    }, 0);
  }

  // Update the form control for sectionsIPC
  // updateSectionsIPCControl(): void {
  //   this.firForm.get('sectionsIPC')?.setValue(this.sectionsIPC.join(', '));
  // }







  // Handle file selection
  onFileSelect1(event: any, index: number) {
    const files = event.target.files;
    const filesArray = Array.from(files); // Convert FileList to an array

    // Update the 'files' form control with the selected files
    this.attachments.at(index).get('files')?.setValue(filesArray);

    // Trigger change detection to update the UI
    this.cdr.detectChanges();
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
        nameControl?.reset();
      } else {
        nameControl?.enable({ emitEvent: false });
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
                this.policeStations = stations;
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
    }
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
  CaseHandledBy = [
    'Special Public Prosecutor',
    'Empanelled advocate',
    'Private advocate selected by the victim'
  ];


  initializeForm() {
    this.firForm = this.fb.group({
      
      // Step 1 Fields - Police Location Details
      policeCity: ['', Validators.required],
      caseType: ['', Validators.required], 
      proceedingsFileNo_1: ['', Validators.required], 
      totalCompensation_1: ['', Validators.required],  
      policeZone: ['', Validators.required],
      policeRange: ['', Validators.required],
      revenueDistrict: ['', Validators.required],
      // alphabetSelection: ['', Validators.required],
      // stationNumber: ['', Validators.required],
      stationName: ['', Validators.required],
      uploadProceedings_1: [''],
      proceedingsFile: ['', Validators.required],
      officerName: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]], // Name validation
      officerDesignation: ['', Validators.required], // Dropdown selection
      officerPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // 10-digit phone validation

      attachments_1: this.fb.array([this.createAttachmentGroup()]),
      attachments_2: this.fb.array([this.createAttachmentGroup_2()]),

      // Step 2 Fields - FIR Details
      firNumber: ['', Validators.required],
      firNumberSuffix: ['', Validators.required],
      dateOfOccurrence: ['', [Validators.required, this.maxDateValidator()]],
      timeOfOccurrence: ['', Validators.required],
      proceedingsDate_1: ['', Validators.required],
      placeOfOccurrence: ['', Validators.required],
      dateOfRegistration: ['', Validators.required],
      timeOfRegistration: ['', Validators.required],
      // natureOfOffence: [[], Validators.required],
      sectionsIPC: ['trerterterterter'],
      scstSections: [[]],

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

      // Step 5 Fields - Victim Relief and Compensation Details
      victimsRelief: this.fb.array([]) ,
      reliefAmountScst: ['', Validators.required],
      reliefAmountExGratia: ['', Validators.required],
      reliefAmountFirstStage: ['', Validators.required],
      reliefAmountSecondStage: [''],
      totalCompensation: ['', Validators.required],
      additionalRelief: [[], Validators.required],



      // Charge Sheet Details
      chargeSheetFiled: ['', Validators.required],
      courtDivision: ['', Validators.required],
      courtName: ['', Validators.required],
      caseNumber: ['', Validators.required],

      // Step 6 Fields - Case Trial and Court Details
      Court_name1: ['', Validators.required],
      trialCourtDistrict: ['', Validators.required],
      trialCaseNumber: ['', Validators.required],
      publicProsecutor: ['', Validators.required],
      prosecutorPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

      firstHearingDate: ['', Validators.required],
      judgementAwarded: ['', Validators.required],
      judgementAwarded1: ['', Validators.required],
      judgementAwarded2: ['', Validators.required],
      judgementAwarded3: ['', Validators.required],


      totalCompensation_2: [''],
      proceedingsFileNo_2: [''], 
      proceedingsDate_2: [''], 
      uploadProceedings_2: [''], 

      
   

      judgementDetails: this.fb.group({
        judgementNature: ['', Validators.required],
        uploadJudgement: [''],
        legalOpinionObtained: [''],
        caseFitForAppeal: [''],
        governmentApprovalForAppeal: [''],
        filedBy: [''],
        designatedCourt: [''],

      }),

      // New fields for the duplicated form

      Court_one: ['', Validators.required],
      courtDistrict_one: ['', Validators.required],
      caseNumber_one: ['', Validators.required],
      publicProsecutor_one: ['', Validators.required],
      prosecutorPhone_one: ['', Validators.required],
      firstHearingDate_one: ['', Validators.required],


      courtDistrict_two: ['', Validators.required],
      caseNumber_two: ['', Validators.required],
      publicProsecutor_two: ['', Validators.required],
      prosecutorPhone_two: ['', Validators.required],
      firstHearingDate_two: ['', Validators.required],



     // Top-level control
     judgementAwarded_one: ['', Validators.required],
      judgementDetails_one: this.fb.group({
        judgementNature_one: ['', Validators.required],
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
        uploadJudgement_two: [''],
        legalOpinionObtained_two: [''],
        caseFitForAppeal_two: [''],
        governmentApprovalForAppeal_two: [''],
        filedBy_two: [''],
      }),


      hearingDetails: this.fb.array([this.createHearingDetailGroup()]),
      hearingDetails_one: this.fb.array([this.createHearingDetailGroup_one()]),
      hearingDetails_two: this.fb.array([this.createHearingDetailGroup_two()]),

      CaseHandledBy:['',Validators.required],
      // b
      NameOfAdvocate:['',Validators.required],
      
      // c
      
      advocateMobNumber:['', Validators.required],
      
      
      // Victim Relief - 3rd Stage
      reliefAmountThirdStage: ['', Validators.required],
      totalCompensationThirdStage: ['', Validators.required],

      // Proceedings and Attachments
      proceedingsFileNo: ['', Validators.required],
      proceedingsDate: ['', Validators.required],
      uploadProceedings: ['', Validators.required],
      attachments: this.fb.array([]), // Dynamic attachments array


    });

    // Other setup functions
    this.trackStep1FormValidity();
    this.onNumberOfVictimsChange();
    this.onNumberOfAccusedChange();
    this.populateVictimsRelief([]);

    console.log(this.firForm.value,"firrrrrrrrrrrrrrrrrrrrrr");

  }

  show94BAnd94C = false;
  show95Onwards = false;
  show97Onwards = false;
uploadJudgementPreview: any | ArrayBuffer;
uploadedImageSrc: any | ArrayBuffer;
// filePreviews: { [key: number]: string | ArrayBuffer | null } = {}; 
  
  onCaseHandledByChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.show94BAnd94C = selectedValue === 'Empanelled advocate' || selectedValue === 'Private advocate selected by the victim';
    this.show95Onwards = selectedValue === 'Special Public Prosecutor';
    this.show97Onwards = selectedValue === 'Empanelled advocate' || selectedValue === 'Private advocate selected by the victim';
  }
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

  victimsReliefDetails: any[] = [];

  loadVictimsDetails(): void {
    if (!this.firId || this.firId !== sessionStorage.getItem('firId')) { 
      return;
    }

    this.firService.getVictimsReliefDetails(this.firId).subscribe(
      (response: any) => {
        console.log('Victim Relief Details:', response.victimsReliefDetails);
        this.numberOfVictims = response.numberOfVictims;
        this.victimNames = response.victimNames;
          this.victimsReliefDetails = response.victimsReliefDetails;
          // Initialize victimsRelief array based on the number of victims
        // this.populateVictimsRelief();
      },
      (error) => {
        console.error('Error fetching victim details:', error);
        Swal.fire('Error', 'Failed to load victim details', 'error');
      }
    );
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

  // Validates the FIR Number values using the firValidationService.
  isFirValid(fir: string, suffix: string): boolean {
    return this.firService.isFirValid(fir, suffix, this.firForm);
  }

  // This function checks the input field and hides/shows the warning text accordingly
  isInputValid(index: number, field: string): boolean {
    const inputValue = this.accuseds.at(index).get(field)?.value; // Get value properly from FormArray
    return !!inputValue && inputValue.trim() !== ''; // Returns true if input is filled
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
      this.showDuplicateSection_1 = false;

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


  onDesignatedCourtChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;

    this.showDuplicateSection = selectedValue === 'highCourt' || selectedValue === 'supremeCourt'; 
  }

  // 



  onDesignatedCourtChange_demo(){
    const data = this.firForm.get('judgementDetails.designatedCourt')?.value;


    this.showDuplicateSection = data === 'highCourt' || data === 'supremeCourt'; 
  }
  // /


  onDesignatedCourtChange_one_fromapi() {
    const selectedValue = this.firForm.get('judgementDetails_one.designatedCourt_one')?.value;

console.log(selectedValue,"selectedValue")
    this.showDuplicateSection_1 = selectedValue === 'highCourt_one' || selectedValue === 'supremeCourt'; 
  }
  onDesignatedCourtChange_one(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;

    this.showDuplicateSection_1 = selectedValue === 'highCourt_one' || selectedValue === 'supremeCourt_one'; 
  }


  onJudgementNatureChange(): void {
    const judgementNature = this.firForm.get('judgementDetails.judgementNature')?.value;

    if (judgementNature === 'Convicted') {
      // Show Upload Judgement Copy only
      this.showJudgementCopy = true;
      this.showLegalOpinionObtained = false;
      this.showFiledBy = false;
      this.showDesignatedCourt = false;
      this.showDuplicateSection = false;
      this.showDuplicateSection_1 = false;

      this.hideCompensationSection = false;

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
    }

    this.firForm.get('judgementDetails.judgementNature')?.updateValueAndValidity();
    this.firForm.get('judgementDetails.uploadJudgement')?.updateValueAndValidity();
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
    }

    this.firForm.get('judgementDetails.judgementNature')?.updateValueAndValidity();
    this.firForm.get('judgementDetails.uploadJudgement')?.updateValueAndValidity();
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


  onAdditionalReliefChange(event: Event, value: string, index: number): void {
    const checked = (event.target as HTMLInputElement).checked;
    const victimsReliefArray = this.firForm.get('victimsRelief') as FormArray;
    const victimGroup = victimsReliefArray.at(index) as FormGroup;
  
    let currentValues = victimGroup.get('additionalRelief')?.value || [];
  
    if (checked && !currentValues.includes(value)) {
      currentValues.push(value);
    } else if (!checked) {
      currentValues = currentValues.filter((item: string) => item !== value);
    }
  
    victimGroup.get('additionalRelief')?.setValue(currentValues);
  }


  onJudgementSelectionChange_two(event: any): void {
    const value = event.target.value;
    if (value === 'yes') {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.clearValidators();
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.clearValidators();
    }
    this.firForm.get('judgementDetails_two.judgementNature_two')?.updateValueAndValidity();
    this.firForm.get('judgementDetails_two.uploadJudgement_two')?.updateValueAndValidity();
  }

  onJudgementSelectionChangehearing2(event: any): void {
    const value = event.target.value;
    if (value === 'yes') {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.clearValidators();
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.clearValidators();
    }
    this.firForm.get('judgementDetails_two.judgementNature_two')?.updateValueAndValidity();
    this.firForm.get('judgementDetails_two.uploadJudgement_two')?.updateValueAndValidity();
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


  // populateVictimsRelief(): void {
  //   const victimsReliefArray = this.victimsRelief;
  //   victimsReliefArray.clear(); // Clear existing form controls

  //   // Populate the form array with victim names
  //   this.victimNames.forEach((victimName) => {
  //     const reliefGroup = this.createVictimReliefGroup();
  //     reliefGroup.patchValue({ name: victimName }); // Set victim name
  //     victimsReliefArray.push(reliefGroup); // Add to FormArray
  //   });

  //   this.cdr.detectChanges(); // Trigger change detection
  // }

  proceedingsFile: File | null = null;

  // onProceedingsFileChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.proceedingsFile = input.files[0];
  
  //     // console.log(this.proceedingsFile,"this.proceedingsFile")
      
      
  //     // Save the selected file
  //   }
  // }


  multipleFilesForproceeding1: any[][] = [];
  showImage_proceding1: boolean[] = []; 
  
  uploadedFiles_procedin1g: { [key: number]: boolean } = {};

  fileUrls_proceding1: { [key: number]: string } = {};

  onProceedingsFileChange_1(event: any, i: number): void {
    const selectedFile = event.target.files[0]; 
    if (!selectedFile) return;

    this.firForm.get('uploadProceedings_1')?.setValue(null);
  
    if (!this.multipleFilesForproceeding1[i]) {
      this.multipleFilesForproceeding1[i] = [];
    }
    this.multipleFilesForproceeding1[i].push(selectedFile);
  

    this.fileUrls_proceding1[i] = URL.createObjectURL(selectedFile);
    

    this.multipleFilesForproceeding1 = selectedFile

    console.log( this.multipleFilesForproceeding1)

   
    this.uploadedFiles_procedin1g[i] = true;
  }
  




  multipleFilesForproceeding: any[][] = [];
  showImage_proceding: boolean[] = []; 
  
  uploadedFiles_proceding: { [key: number]: boolean } = {};

  fileUrls_proceding: { [key: number]: string } = {};


  // onProceedingsFileChange_1(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.proceedingsFile_1 = input.files[0];
  
  //     console.log(this.proceedingsFile_1,"this.proceedingsFile")
      
      
  //     // Save the selected file
  //   }
  // }
  
  onProceedingsFileChange(event: any, i: number): void {
    const selectedFile = event.target.files[0]; 
    if (!selectedFile) return;

    this.firForm.get('proceedingsFile')?.setValue(null);
  
    if (!this.multipleFilesForproceeding[i]) {
      this.multipleFilesForproceeding[i] = [];
    }
    this.multipleFilesForproceeding[i].push(selectedFile);
  

    this.fileUrls_proceding[i] = URL.createObjectURL(selectedFile);
    
    this.multipleFilesForproceeding = selectedFile
   
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

  





  populateVictimsRelief(victimsReliefDetails: any[]): void {
    const victimsReliefArray = this.firForm.get('victimsRelief') as FormArray;
    victimsReliefArray.clear(); // Clear existing FormArray
  
    console.log(victimsReliefDetails, "victimsReliefDetails");
  
    let totalReliefFirstStage = 0; // Initialize total compensation calculation
  
    victimsReliefDetails.forEach((victimReliefDetail) => {
      const additionalRelief = victimReliefDetail.additional_relief
        ? JSON.parse(victimReliefDetail.additional_relief)
        : [];
  
      // Sum up relief_amount_first_stage for total compensation
      const reliefFirstStage = parseFloat(victimReliefDetail.relief_amount_first_stage) || 0;
      totalReliefFirstStage += reliefFirstStage;
  
      const victimGroup = this.fb.group({
        victimId: [victimReliefDetail.victim_id || ''],
        victimName: [victimReliefDetail.victim_name || ''],
        communityCertificate: [victimReliefDetail.community_certificate || ''],
        reliefAmountScst: [victimReliefDetail.relief_amount_scst || '0.00'],
        reliefAmountExGratia: [victimReliefDetail.relief_amount_exgratia || '0.00'],
        reliefAmountFirstStage: [reliefFirstStage.toFixed(2)], 
        additionalRelief: [additionalRelief]
      });
  
      victimsReliefArray.push(victimGroup);
    });
  
    // Set total compensation separately at form level
    this.firForm.patchValue({ totalCompensation: totalReliefFirstStage.toFixed(2) });
  
    console.log(`Total Compensation (Sum of relief_amount_first_stage): ${totalReliefFirstStage.toFixed(2)}`);
  }
  get totalCompensationControl(): FormControl {
    return this.firForm.get('totalCompensation') as FormControl;
  }
  


  updateTotalCompensation(): void {
    let total = 0;
    this.victimsRelief.controls.forEach((group) => {
      const firstStage = parseFloat(group.get('reliefAmountFirstStage')?.value || '0');
      total += firstStage;
    });
    this.firForm.patchValue({ totalCompensation: total.toFixed(2) });
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
    this.victimNames = this.victims.controls.map((victim) => victim.get('name')?.value).filter(name => name);
    // this.populateVictimsRelief();
    this.cdr.detectChanges(); // Trigger change detection
  }

  get victimsReliefArray(): FormArray {
    return this.firForm.get('victimsRelief') as FormArray;
  }
  
  onIsDeceasedChangeOutside(): void {
    const isDeceasedControl = this.firForm.get('isDeceased');
    const deceasedPersonNamesControl = this.firForm.get('deceasedPersonNames');

    if (isDeceasedControl?.value === 'yes') {
      // If "Yes", make the deceased person names field required
      deceasedPersonNamesControl?.setValidators([Validators.required]);
      deceasedPersonNamesControl?.enable();
    } else {
      // If "No", reset and disable the deceased person names field
      deceasedPersonNamesControl?.clearValidators();
      deceasedPersonNamesControl?.reset();
      deceasedPersonNamesControl?.disable();
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
      victim_id: [''],
      age: ['', Validators.required],
      name: [{ value: '', disabled: false }, [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]],
      gender: ['', Validators.required],
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')] // 10-digit validation
      ],
      address: [''],
      victimPincode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{6}$')] // 6-digit validation
      ],
      community: ['', Validators.required],
      caste: ['', Validators.required],
      guardianName: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]],
      isNativeDistrictSame: ['', Validators.required],
      nativeDistrict: [''],
      offenceCommitted: ['', Validators.required],
      scstSections:  ['', Validators.required], // Ensure this field exists for multi-select
      sectionsIPC:  ['',Validators.required],
      availableCastes: [[]],
    });
  }

  isPincodeInvalid(index: number): boolean {
    const pincodeControl = this.accuseds.at(index).get('pincode');
    return (pincodeControl?.touched ?? false) && !(pincodeControl?.valid ?? true);
  }


  createVictimReliefGroup(victimReliefDetail: any): FormGroup {

console.log(victimReliefDetail,"cretaieg")

    return this.fb.group({
      victimId: [victimReliefDetail.victim_id || ''],
      victimName: [victimReliefDetail.victim_name || ''],
      communityCertificate: [victimReliefDetail.community_certificate || ''],
      reliefAmountScst: [victimReliefDetail.relief_amount_scst || '0.00'],
      reliefAmountExGratia: [victimReliefDetail.relief_amount_exgratia || '0.00'],
      reliefAmountFirstStage: [victimReliefDetail.relief_amount_first_stage || '0.00'],
      totalCompensation: [victimReliefDetail.final_stage_as_per_act || '0.00'],
      additionalRelief: this.fb.array(
        victimReliefDetail.additional_relief 
          ? JSON.parse(victimReliefDetail.additional_relief).map((relief: string) => new FormControl(relief)) 
          : []
      )
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

  // Dropdown and option loading methods
  loadOptions() {
    this.firService.getOffences().subscribe(
      (offences: any) => {
        this.offenceOptions = offences.map((offence: any) => offence.offence_name);
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load offence options.', 'error');
      }
    );
  }

  // loadnativedistrict() {
  //   this.firService.getPoliceRevenue().subscribe(
  //     (Native: any) => {
  //       this.policeStations = Native.map((Native: any) => Native.revenue_district_name);
  //     },
  //     (error: any) => {
  //       Swal.fire('Error', 'Failed to load offence options.', 'error');
  //     }
  //   );
  // }

  loadOffenceActs() {
    this.firService.getOffenceActs().subscribe(
      (acts: any) => {
        this.offenceActsOptions = acts.map((act: any) => act.offence_act_name);
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load offence acts options.', 'error');
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

  onCommunityChange(event: any, index: number): void {
    const selectedCommunity = event.target.value;
  // console.log(selectedCommunity,"wssss")
      if (selectedCommunity) {
        this.firService.getCastesByCommunity(selectedCommunity).subscribe(
          (castes: string[]) => {
            const victimGroup = this.victims.at(index) as FormGroup;
            victimGroup.patchValue({ caste: '' }); // Reset caste selection
            victimGroup.get('availableCastes')?.setValue(castes); // Dynamically update caste options
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Error fetching castes:', error);
            Swal.fire('Error', 'Failed to load castes for the selected community.', 'error');
          }
        );
      }
  }

  onAccusedCommunityChange(event: any, index: number): void {
    const selectedCommunity = event.target.value;
    console.log(selectedCommunity)
  
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

  // loadUserData() {
  //   this.firService.getUserDetails(this.userId).subscribe(
  //     (user: any) => {
  //       if (user && user.district) {
  //         const district = user.district;
  //         this.firForm.patchValue({ policeCity: district });
  //         this.loadPoliceDivisionDetails(district);
  //       }
  //     },
  //     (error: any) => {
  //       Swal.fire('Error', 'Failed to load user details.', 'error');
  //     }
  //   );
  // }

  loadPoliceDivisionDetails() {
    this.firServiceAPI.getPoliceDivisionedit().subscribe(
      (data: any) => {
        console.log(data,"policeCities")
        this.policeCities = data.district_division_name || [];
        this.policeZones = data.police_zone_name || [];
        this.policeRanges = data.police_range_name || [];
        this.revenueDistricts = data.revenue_district_name || [];

        this.cdr.detectChanges();
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
      previousIncident: [],
      previousFIRNumber: [''],
      previousFIRNumberSuffix: [''],
      scstOffence: [],
      scstFIRNumber: [''],
      scstFIRNumberSuffix: [''],
      antecedents: ['', Validators.required],
      landOIssues: ['', Validators.required],
      gistOfCurrentCase: ['', Validators.required],
      uploadFIRCopy: ['', Validators.required],
      availableCastes: [[]],
    });
  }


  // Handle City Change
  onCityChange(event: any) {
    const selectedCity = event.target.value;
    // if (selectedCity) {
    //   this.loadPoliceDivisionDetails();
    // }
  }
  get attachments_1(): FormArray {
    return this.firForm.get('attachments_1') as FormArray;
  }
  
  get attachments_2(): FormArray {
    return this.firForm.get('attachments_2') as FormArray;
  }

   
    createAttachmentGroup(): FormGroup {
      return this.fb.group({
        fileName: [''], 
        file: [null, Validators.required],
        file_1: [null, Validators.required], 
        fileName_1: [''],
        file_2: [null, Validators.required], 
        fileName_2: [''],
      });
    }

    addAttachment_2(): void {
      this.attachments_2.push(this.createAttachmentGroup());
      
    } 

      
    addAttachment_1() {
      const attachmentsControl = this.firForm.get('attachments_1') as FormArray;
    
      if (!attachmentsControl) {
        console.error("attachments_1 FormArray is undefined.");
        return;
      }
    
      
      attachmentsControl.push(this.fb.group({
        file: [null],       
        filePath: [''],     
        fileName: ['']      
      }));
    
    
      if (!this.attachmentss_1) {
        this.attachmentss_1 = [];
      }
    
      this.attachmentss_1.push({ id: "", path: "", file: null });
    
      // console.log("Updated Attachments List:", this.attachmentss_1);
    }
    
  // isStep6Valid(): boolean { 

  //   const controls = [
  //     'chargeSheetFiled',
  //     'courtDivision',
  //     'courtName',
  //     'caseType',
  //     'caseNumber',
  //     'reliefAmountScst_1',
  //     'reliefAmountExGratia_1',
  //     'reliefAmountSecondStage',
  //     'totalCompensation_1',
  //     'proceedingsFileNo_1',   // Added fields for chargeSheet
  //     'proceedingsDate_1',      // Added fields for chargeSheet
  //     'uploadProceedings_1',    // Added fields for chargeSheet
  //     'file_1',                 // Added fields for chargeSheet
  //   ];

  //   let caseType = this.firForm.get('caseType')?.value;  // Get the selected case type 

  //   // Add conditional validation logic based on caseType
  //   if (caseType === 'chargeSheet') {
  //     // Add fields specific to chargeSheet case type
  //     controls.push(
  //       'chargeSheetFiled',
  //       'courtDivision',
  //       'courtName',
  //       'reliefAmountScst_1',
  //       'reliefAmountExGratia_1',
  //       'reliefAmountSecondStage',
  //       'totalCompensation_1',
  //       'proceedingsFileNo_1',
  //       'proceedingsDate_1',
  //       'uploadProceedings_1',
  //       'file_1'
  //     );
  //   } else if (caseType === 'referredChargeSheet') {
  //     // Add fields specific to referredChargeSheet case type
  //     controls.push('rcsFileNumber', 'rcsFilingDate', 'mfCopy');
  //   }

  //   // Perform validation for all fields based on the controls array
  //   let allValid = controls.every((controlName) => {
  //     const control = this.firForm.get(controlName);
  //     if (control) {
  //       // Mark control as touched to trigger validation
  //       control.markAsTouched();

  //       if (!control.valid) {
  //         // console.log(`${controlName} is invalid`, control.errors);  // Log specific errors for each control
  //       }
  //     }
  //     return control ? control.valid : true;
  //   });

  //   return allValid;
  // }

  isStep6Valid(): boolean { 
    const controls = [
      'chargeSheetFiled',
      'courtDivision',
      'courtName',
      'caseType',
      'caseNumber',               
    ];
  
    let caseType = this.firForm.get('caseType')?.value;  // Get the selected case type 
  
    // Add conditional validation logic based on caseType
    if (caseType === 'chargeSheet') {
      controls.push(
        'chargeSheetFiled',
        'courtDivision',
        'courtName',
      );
    } else if (caseType === 'referredChargeSheet') {
      controls.push('rcsFileNumber', 'rcsFilingDate', 'mfCopy');
    }
  
    let allValid = true;
  
    // Validate each field in the controls array
    controls.forEach((controlName) => {
      const control = this.firForm.get(controlName);
      if (control) {
        control.markAsTouched(); // Mark field as touched to trigger validation
  
        if (!control.valid) {
          console.log(`Invalid Field: ${controlName}`, control.errors); // Log errors for invalid fields
          allValid = false;
        }
      } else {
        console.log(`Missing control in form: ${controlName}`); // Log if a control is not found
        allValid = false;
      }
    });
  
    return allValid;
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

  
  onFileSelect_1(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const attachmentGroup = this.attachments_1.at(index) as FormGroup;
      attachmentGroup.patchValue({
        file,
        fileName: file.name,
      });
    }
  }
 
  

  filePreviews: string[] = []; 
  removeAttachment_2(index: number): void {
    if (this.attachments_2.length > 1) {
      this.attachments_2.removeAt(index);
      this.filePreviews.splice(index, 1); // Remove corresponding preview
    }
  }
  createAttachmentGroup_2(): FormGroup {
    return this.fb.group({
      file_2: [null, Validators.required], // File control
      fileName_2: [''], // File name
    });
  }

  addAttachment(): void {
    this.attachmentss_1.push(this.createAttachmentGroup());
  }

  removeAttachment(index: number): void {
    if (this.attachments.length > 1) {
      this.attachments.removeAt(index);
    }
  }

 

  // Getter for attachments FormArray
  get attachments(): FormArray {
    return this.firForm.get('attachments') as FormArray;
  }



  
   
  getImagePreviewForIndex(index: number) {
    return this.imagePreviews1.some(item => item.index === index);
  }
  
  getImagePreviewsForIndex(index: number) {
    return this.imagePreviews1.filter(item => item.index === index);
  }
  // onFileChange(event: Event, index: number): void { 
  //   const fileInput = event.target as HTMLInputElement;
  
  //   if (fileInput?.files?.length) {
  //     const file = fileInput.files[0];  // Get the first selected file
  
  //     // Find and remove the existing file object with the same index
  //     const existingFileIndex = this.imagePreviews1.findIndex(item => item.index === index);
  //     if (existingFileIndex !== -1) {
  //       // Remove the existing file object at that index
  //       this.imagePreviews1.splice(existingFileIndex, 1);
  //     }
  //     this.accuseds.at(index).get('uploadFIRCopy')?.setValue(null);
  //     // Push the new file object with the file, preview URL, and index
  //     this.imagePreviews1.push({
  //       file: file,
  //       url: URL.createObjectURL(file),
  //       index: index
  //     });
  //   }
  // } 
  
  
  // saveStepFourAsDraft(): void {
  //   const firData = {
  //     firId: this.firId,
  //     numberOfAccused: this.firForm.get('numberOfAccused')?.value,
  //     accuseds: this.accuseds.value // Accuseds array data (form values)
  //   };

    
  //   const formData = new FormData();
  //   // console.log(formData);
  
  //   // Append form fields to FormData (firData)
  //   Object.keys(firData).forEach((key) => {
  //     const value = firData[key as keyof typeof firData];
  //     if (Array.isArray(value)) {
  //       // If the value is an array (e.g., accuseds)
  //       value.forEach((val, index) => {
  //         // Handle nested objects inside the array (accuseds)
  //         if (typeof val === 'object') {
  //           // Iterate over object properties of each accused
  //           Object.keys(val).forEach((subKey) => {
  //             formData.append(`accuseds[${index}].${subKey}`, String(val[subKey]));
  //           });
  //         } else {
  //           formData.append(`${key}[${index}]`, String(val));
  //         }
  //       });
  //     } else {
  //       // If the value is not an array, just append directly
  //       formData.append(key, String(value));
  //     }
  //   });
  
  //   // Example: Appending image files (if any)
  //   this.imagePreviews1.forEach((image, index) => {
  //     formData.append(`images[${index}]`, image.file, image.file.name);
  //   });
  
  //   // You can inspect the FormData if needed
 
  
  //   // Call the service to save as draft

  //   // console.log("testing",formData);
  //   this.firService.saveStepFourAsDraft(formData).subscribe(
  //     (response: any) => {
  //       this.firId = response.fir_id;
  //       if (this.firId) {
  //         sessionStorage.setItem('firId', this.firId);
  //       }
  //       Swal.fire('Success', 'FIR saved as draft for step 4.', 'success');
  //     },
  //     (error) => {
  //       console.error('Error saving FIR for step 4:', error);
  //       Swal.fire('Error', 'Failed to save FIR as draft for step 4.', 'error');
  //     }
  //   );
  // }
  
  
  
  

  // saveStepFiveAsDraft(isSubmit: boolean = false): void {
  //   if (!this.firId) {
  //     Swal.fire('Error', 'FIR ID is missing. Unable to proceed.', 'error');
  //     return;
  //   }

  //   const firData = {
  //     firId: this.firId,
  //     victimsRelief: this.victimsRelief.value.map((relief: any) => ({
  //       communityCertificate: relief.communityCertificate,
  //       reliefAmountScst: relief.reliefAmountScst,
  //       reliefAmountExGratia: relief.reliefAmountExGratia,
  //       reliefAmountFirstStage: relief.reliefAmountFirstStage,
  //       additionalRelief: relief.additionalRelief,
  //     })),
  //     totalCompensation: this.firForm.get('totalCompensation')?.value,
  //     proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value,
  //     proceedingsDate: this.firForm.get('proceedingsDate')?.value,
  //     // proceedingsFile: this.firForm.get('proceedingsFile')?.value,
  //     // attachments: this.attachments.value.map((attachment: any) => ({
  //     //   fileName: attachment.fileName,
  //     //   filePath: attachment.filePath, // Adjust if file path is set after uploading
  //     // })),
  //     status: isSubmit ? 5 : undefined,
  //   };

  //   const formData = new FormData();

  //   Object.keys(firData).forEach((key) => {
  //     const value = firData[key as keyof typeof firData]; 
  //     formData.append(key, String(value));  // Convert value to string to avoid type issues 
  //   }); 
  //   this.imagePreviews2.forEach(image => {
  //     formData.append('images', image.file, image.file.name);
  //   });

  //   const files = this.getFiles('proceedingsFile');  
  //   if (files && files.length > 0) { 
  //     // Assuming you want to use the first file (files[0])
  //     formData.append('uploadJudgement', files[0], files[0].name);
  //   } else {
  //     console.error('No files selected or files are null/undefined');
  //   }

    
  //   this.firService.saveStepFiveAsDraft(formData).subscribe(
  //     (response) => {
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
  //     (error) => {
  //       console.error('Error saving Step 5 data:', error);
  //       Swal.fire('Error', 'Failed to save Step 5 data', 'error');
  //     }
  //   );
  // }

  submitStepSix(): void {
    if (!this.firId) {
      Swal.fire('Error', 'FIR ID is missing. Unable to proceed.', 'error');
      return;
    }

    // Directly update FIR status to 6 without form submission
    this.firService.updateFirStatus(this.firId, 6).subscribe(
      () => {
        Swal.fire({
          title: 'Success',
          text: 'FIR status updated to 6.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.navigateToNextStep(); // Move to the next step in your workflow
        });
      },
      (error) => {
        console.error('Error updating FIR status:', error);
        Swal.fire('Error', 'Failed to update FIR status.', 'error');
      }
    );
  }


  submitStepSeven(): void {
    if (!this.firId) {
      Swal.fire('Error', 'FIR ID is missing. Unable to proceed.', 'error');
      return;
    }

    // Directly update FIR status to 7 without form submission
    this.firService.updateFirStatus(this.firId, 7).subscribe(
      () => {
        Swal.fire({
          title: 'Success',
          text: 'FIR status updated to 7.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      },
      (error) => {
        console.error('Error updating FIR status:', error);
        Swal.fire('Error', 'Failed to update FIR status.', 'error');
      }
    );
  }




  // Helper function to navigate to the next step
  navigateToNextStep(): void {
    if (this.mainStep === 2 && this.step === 1) {
      this.mainStep = 3; // Move to Trial Stage if currently in Chargesheet Stage
      this.step = 1;      // Reset to Step 1 of the new stage
    } else if (this.mainStep === 1 && this.step < 5) {
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
    } else if (this.mainStep === 1 && this.step === 5) {
      this.mainStep = 2;  // Move to Chargesheet Stage after FIR Stage
      this.step = 1;      // Reset to Step 1 of Chargesheet Stage
    }
  }



  saveAsDraft(): void {

    if (this.step === 1) {
      this.saveStepOneAsDraft();
    } else if (this.step === 2) {
      this.saveStepTwoAsDraft();
    } else if (this.step === 3) {
      this.saveStepThreeAsDraft();
    } else if (this.step === 4) {
      this.saveStepFourAsDraft();
    } else if (this.step === 5) {
      this.saveStepFiveAsDraft();
    }
  }
  getFiles(inputId: string): FileList | null {
    const fileInput = document.getElementById(inputId) as HTMLInputElement; 
    return fileInput?.files && fileInput.files.length > 0 ? fileInput.files : null;
  }
  formDataToObject(formData: FormData): Record<string, any> {
    const obj: Record<string, any> = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  saveStepSevenAsDraft(isSubmit: boolean = false): void {

    const formFields = {
      trialDetails: {
        judgementAwarded1: [
          this.firForm.get('judgementAwarded1')?.value,
        
        ].filter(Boolean), 
        judgementAwarded2: [
          this.firForm.get('judgementAwarded2')?.value,
        
        ].filter(Boolean), 
        judgementAwarded3: [
          this.firForm.get('judgementAwarded3')?.value,
        
        ].filter(Boolean), 
      }
    }

console.log(formFields,"formFieldsformFields")

  //   const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
  
  //   // Check if the file input exists and has files
  //   if (fileInput && fileInput.files && fileInput.files[0]) {
  //     console.log(fileInput.files[0]);
  //   }
  //   const formData = new FormData();
  
  //   formData.append("name", String(true)); 
  //   formData.append("name1", String(72));   
  
  
  //   const allNames = formData.getAll("name");
  //   formData.forEach((value, key) => {
  //     console.log(key + ": " + value);
  //   });
  //   const hearingdetail = this.hearingDetails.value
  //   const formFields = {
  //     firId: this.firId,
  
  //     // Trial Details
  //     trialDetails: {
  //       courtName: this.firForm.get('Court_name')?.value,
  //       courtDistrict: this.firForm.get('courtDistrict')?.value,
  //       trialCaseNumber: this.firForm.get('caseNumber')?.value,
  //       publicProsecutor: this.firForm.get('publicProsecutor')?.value,
  //       prosecutorPhone: this.firForm.get('prosecutorPhone')?.value,
  //       firstHearingDate: this.firForm.get('firstHearingDate')?.value,
  
  
  
  //       CaseHandledBy:this.firForm.get('CaseHandledBy')?.value,
  // // b
  // NameOfAdvocate:this.firForm.get('NameOfAdvocate')?.value,
  
  // // c
  
  // advocateMobNumber:this.firForm.get('advocateMobNumber')?.value,
  
  
  //       judgementAwarded: [
  //         this.firForm.get('judgementAwarded')?.value,
        
  //       ].filter(Boolean), // Remove null values

        // judgementAwarded1: [
        //   this.firForm.get('judgementAwarded1')?.value,
        
        // ].filter(Boolean), 
        // judgementAwarded2: [
        //   this.firForm.get('judgementAwarded2')?.value,
        
        // ].filter(Boolean), 
        // judgementAwarded3: [
        //   this.firForm.get('judgementAwarded3')?.value,
        
        // ].filter(Boolean), 

  //       judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,
  //       uploadJudgement: this.firForm.get('uploadJudgement')?.value,
  //     },
      
  //     // Compensation Details
  //     compensationDetails: {
  //       totalCompensation: this.firForm.get('totalCompensation')?.value,
  //       proceedingsDate: this.firForm.get('proceedingsDate')?.value,
  //       proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value,
  //       uploadProceedings: this.firForm.get('uploadProceedings')?.value,
  //     },
      
  //     // Appeal Details
  //     appealDetails: {
  //       legalOpinionObtained: this.firForm.get('judgementDetails.legalOpinionObtained')?.value,
  //       caseFitForAppeal: this.firForm.get('judgementDetails.caseFitForAppeal')?.value,
  //       governmentApprovalForAppeal: this.firForm.get('judgementDetails.governmentApprovalForAppeal')?.value,
  //       filedBy: this.firForm.get('judgementDetails.filedBy')?.value,
  //       designatedCourt: this.firForm.get('judgementDetails.designatedCourt')?.value,
  //     },
      
  //     // Appeal Details One
  //     appealDetailsOne: {
  //       legalOpinionObtained: this.firForm.get('judgementDetails_one.legalOpinionObtained_one')?.value,
  //       caseFitForAppeal: this.firForm.get('judgementDetails_one.caseFitForAppeal_one')?.value,
  //       governmentApprovalForAppeal: this.firForm.get('judgementDetails_one.governmentApprovalForAppeal_one')?.value,
  //       filedBy: this.firForm.get('judgementDetails_one.filedBy_one')?.value,
  //       designatedCourt: this.firForm.get('judgementDetails_one.designatedCourt_one')?.value,
  //     },
      
  //     // Case Appeal Details Two
  //     caseAppealDetailsTwo: {
  //       legalOpinionObtained: this.firForm.get('judgementDetails_two.legalOpinionObtained_two')?.value,
  //       caseFitForAppeal: this.firForm.get('judgementDetails_two.caseFitForAppeal_two')?.value,
  //       governmentApprovalForAppeal: this.firForm.get('judgementDetails_two.governmentApprovalForAppeal_two')?.value,
  //       filedBy: this.firForm.get('judgementDetails_two.filedBy_two')?.value,
  //     },
      
  //     // Submission Status
  //     status: isSubmit ? 7 : undefined,
  //   };
    
  
  //   this.imagePreviews.forEach(image => {
  //     formData.append('images', image.file, image.file.name);
  //   });
  
  
  
  //   Object.keys(formFields).forEach((key) => {
  //     const value = formFields[key as keyof typeof formFields];
  //     if (value !== null && value !== undefined) { // Ensure value is valid before appending
  //       if (typeof value === 'object') {
  //         formData.append(key, JSON.stringify(value)); // Convert objects to JSON string
  //       } else {
  //         formData.append(key, String(value));  
  //       }
  //     }
  //   });
    
  
  
  //   const filesFields = ['uploadJudgement', 'uploadJudgement_one', 'uploadJudgement_two','uploadProceedings'];
  
  //   // Add files to FormData
  //   filesFields.forEach((field) => {
  //     const files = this.getFiles(field); 
  //     if (files && files.length > 0) { // Ensure files exist before appending
  //       for (let i = 0; i < files.length; i++) {
  //         formData.append(field, files[i]); 
  //       }
  //     }
  //   });
  
  //   const formDataObject = this.formDataToObject(formData);
  
  //   console.log(this.attachments, "formFieldsformFields");
  //   this.firServiceAPI.editStepSevenAsDraft(formFields,hearingdetail).subscribe({
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
    
  }


  // async  UpdateAsDraft_7() {
  //   if (!this.firId) {
  //       Swal.fire('Error', 'FIR ID is missing. Unable to save draft.', 'error');
  //       return;
  //   }
  //   const judgementNature = this.firForm.get('judgementDetails')?.value; 
  //   const judgementDetails_one = this.firForm.get('judgementDetails_one')?.value; 
  //   const judgementDetails_two = this.firForm.get('judgementDetails_two')?.value; 
  //   // console.log("Judgement Nature:", judgementNature);
  //   let uploadJudgementPath: string | undefined;
  //   const uploadJudgementFileFile = this.firForm.get('judgementDetails.uploadJudgement')?.value;
  //   if (uploadJudgementFileFile) {
  //     const paths = await this.uploadMultipleFiles([uploadJudgementFileFile]);
  //     uploadJudgementPath = paths[0];
  //   }
  //   const hearingdetail = this.hearingDetails.value

  //   console.log(hearingdetail,"hearingdetail")
  //     const trialDetails = {
  //         courtName: this.firForm.get('Court_name1')?.value,
  //         courtDistrict: this.firForm.get('trialCourtDistrict')?.value,
  //         trialCaseNumber: this.firForm.get('trialCaseNumber')?.value,
  //         publicProsecutor: this.firForm.get('publicProsecutor')?.value,
  //         prosecutorPhone: this.firForm.get('prosecutorPhone')?.value,
  //         firstHearingDate: this.firForm.get('firstHearingDate')?.value,
  //         judgementAwarded: this.firForm.get('judgementAwarded')?.value,
  //         judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,
  //         uploadJudgement: uploadJudgementPath,
  //         judgementAwarded1: 
  //           this.firForm.get('judgementAwarded1')?.value,
         
  //         judgementAwarded2: 
  //           this.firForm.get('judgementAwarded2')?.value,
       
  //         judgementAwarded3: 
  //           this.firForm.get('judgementAwarded3')?.value,
          
           
  //     };
  
  //     if (!trialDetails.judgementNature && trialDetails.judgementAwarded === 'yes') {
  //         Swal.fire('Error', 'Please select the nature of judgement.', 'error');
  //         return;
  //     }
  
  //     let uploadproceedingPath: string | undefined;
  //     const proceedingFile = this.firForm.get('uploadProceedings')?.value;
  //     if (proceedingFile) {
  //       const paths = await this.uploadMultipleFiles([proceedingFile]);
  //       uploadproceedingPath = paths[0];
  //     }
  //   const compensationDetails = {
  //       totalCompensation: this.firForm.get('totalCompensation')?.value ? this.firForm.get('totalCompensation')?.value : 0,
  //       proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value,
  //       proceedingsDate: this.firForm.get('proceedingsDate')?.value,
  //       uploadProceedings: uploadproceedingPath ? uploadproceedingPath : this.firForm.get('uploadProceedings')?.value
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
  //       caseId: this.case_id,
  //       trialDetails,
  //       compensationDetails,
  //       attachments,
  //       victimsDetails,
  //       judgementNature,
  //       judgementDetails_one,
  //       judgementDetails_two

  //   };
  

  //   console.log(formData,"formData")
  //   // this.firService.UpdateStepSevenAsDraft(formData).subscribe({
  //   //     next: (response : any) => {
  //   //         Swal.fire('Success', 'Draft data saved successfully.', 'success');
  //   //     },
  //   //     error: (error : any) => {
  //   //         console.error('Error saving draft data:', error);
  //   //         Swal.fire('Error', 'Failed to save draft data.', 'error');
  //   //     }
  //   // });
  // }


  fileObjects: { [index: number]: File[] } = {};
  uploadedPaths: { [key: string]: string } = {};
  
  onFileSelect_2(event: any, index: number): void {
    const files: FileList = event.target.files;
    console.log(files, "Selected Files");
  
    if (!files || files.length === 0) return;
  
    const attachmentGroup = this.attachments_2.at(index) as FormGroup;
    console.log(attachmentGroup);
  
    const selectedFiles: File[] = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log("File selected:", file.name, file);
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreviews[index] = e.target.result; // Store preview per index
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
  
      selectedFiles.push(file);
    }
  
    // ✅ Store actual files separately
    this.fileObjects[index] = selectedFiles;
  
    console.log(this.fileObjects, "Stored File Objects");

  }
  
 async UpdateAsDraft_7() {
  if (!this.firId) {
      Swal.fire('Error', 'FIR ID is missing. Unable to save draft.', 'error');
      return;
  }



  const formData = new FormData();
  const formDatavalues = this.firForm.value

  const formFields: any = {
    // data : this.fileObjects,
      firId: this.firId,
      trialDetails: {
          courtName: this.firForm.get('Court_name1')?.value,
          courtDistrict: this.firForm.get('trialCourtDistrict')?.value,
          trialCaseNumber: this.firForm.get('caseNumber')?.value,
          publicProsecutor: this.firForm.get('publicProsecutor')?.value,
          prosecutorPhone: this.firForm.get('prosecutorPhone')?.value,
          firstHearingDate: this.firForm.get('firstHearingDate')?.value,
          CaseHandledBy: this.firForm.get('CaseHandledBy')?.value,
          NameOfAdvocate: this.firForm.get('NameOfAdvocate')?.value,
          advocateMobNumber: this.firForm.get('advocateMobNumber')?.value,
          judgementAwarded: this.firForm.get('judgementAwarded')?.value,
          judgementAwarded1:this.firForm.get('judgementAwarded1')?.value,
      
          judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,
          uploadJudgement: this.firForm.get('judgementDetails.uploadJudgement')?.value,
      },
      // judgementAwarded_one
      trialDetails_one: {
        courtName: this.firForm.get('Court_name1')?.value,
        courtDistrict: this.firForm.get('courtDistrict_one')?.value,
        trialCaseNumber: this.firForm.get('caseNumber_one')?.value,
        publicProsecutor: this.firForm.get('publicProsecutor_one')?.value,
        prosecutorPhone: this.firForm.get('prosecutorPhone_one')?.value,
        firstHearingDate: this.firForm.get('firstHearingDate_one')?.value,

        judgementAwarded:this.firForm.get('judgementAwarded_one')?.value,
   
        judgementNature: this.firForm.get('judgementDetails_one.judgementNature_one')?.value,
        uploadJudgement: this.firForm.get('judgementDetails_one.uploadJudgement_one')?.value,
    },
    trialDetails_two: {
      courtName: this.firForm.get('Court_name1')?.value,
      courtDistrict: this.firForm.get('courtDistrict_two')?.value,
      trialCaseNumber: this.firForm.get('caseNumber_two')?.value,
      publicProsecutor: this.firForm.get('publicProsecutor_two')?.value,
      prosecutorPhone: this.firForm.get('prosecutorPhone_two')?.value,
      firstHearingDate: this.firForm.get('firstHearingDate_two')?.value,

   
      judgementAwarded:this.firForm.get('judgementAwarded2')?.value,
 
      judgementNature: this.firForm.get('judgementDetails_two.judgementNature_two')?.value,
      uploadJudgement: this.firForm.get('judgementDetails_two.uploadJudgement_two')?.value,
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
        uploadProceedings: this.firForm.get('uploadProceedings_1')?.value,
      },
      compensationDetails_2: {
        totalCompensation: this.firForm.get('totalCompensation_2')?.value,
        proceedingsDate: this.firForm.get('proceedingsDate_2')?.value,
        proceedingsFileNo: this.firForm.get('proceedingsFileNo_2')?.value,
        uploadProceedings: this.firForm.get('uploadProceedings_2')?.value,
      },


      hearingdetail : {
     
        hearingDetails: formDatavalues.hearingDetails,
        hearingDetails_one: formDatavalues.hearingDetails_one,
        hearingDetails_two: formDatavalues.hearingDetails_two,
  
      },
      appealDetails: {
        legal_opinion_obtained: this.firForm.get('judgementDetails.legalOpinionObtained')?.value,
        case_fit_for_appeal: this.firForm.get('judgementDetails.caseFitForAppeal')?.value,
        government_approval_for_appeal: this.firForm.get('judgementDetails.governmentApprovalForAppeal')?.value,
        filed_by: this.firForm.get('judgementDetails.filedBy')?.value,
        designated_court: this.firForm.get('judgementDetails.designatedCourt')?.value,
          judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,
      },
      appealDetailsOne: {
        legal_opinion_obtained: this.firForm.get('judgementDetails_one.legalOpinionObtained_one')?.value,
        case_fit_for_appeal: this.firForm.get('judgementDetails_one.caseFitForAppeal_one')?.value,
        government_approval_for_appeal: this.firForm.get('judgementDetails_one.governmentApprovalForAppeal_one')?.value,
        filed_by: this.firForm.get('judgementDetails_one.filedBy_one')?.value,
        designated_court: this.firForm.get('judgementDetails_one.designatedCourt_one')?.value,
          judgementNature: this.firForm.get('judgementDetails_one.judgementNature_one')?.value,
      },
      caseAppealDetailsTwo: {
        legal_opinion_obtained: this.firForm.get('judgementDetails_two.legalOpinionObtained_two')?.value,
        case_fit_for_appeal: this.firForm.get('judgementDetails_two.caseFitForAppeal_two')?.value,
        government_approval_for_appeal: this.firForm.get('judgementDetails_two.governmentApprovalForAppeal_two')?.value,
        filed_by: this.firForm.get('judgementDetails_two.filedBy_two')?.value,
          judgementNature: this.firForm.get('judgementDetails_two.judgementNature_two')?.value,
      },

attachment:this.attachments_2.value
   
      
  };
  Object.keys(formFields).forEach((key) => {
    const value = formFields[key as keyof typeof formFields];
    if (value !== null && value !== undefined) {
      formData.append(key, JSON.stringify(value));
    }
  });
  // this.attachments_2.value.forEach((attachmentGroup: any, index: number) => {
  //   const files = this.fileObjects[index];

  //   if (files && files.length > 0) {
  //     files.forEach((file: File) => {
  //       formData.append(`attachments[${index}]`, file); 
  //     });
  //   }
  // });
  console.log(this.attachments_2.value,"this.attachments_2.value")


    
  // ✅ Debugging: Convert FormData to an Object
  const formDataObject: any = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });
  
  

  console.log(formDataObject, '📝 Final formDataObject');
  this.firService.UpdateStepSevenAsDraft(formDataObject).subscribe({
      next: (response: any) => Swal.fire('Success', 'Draft data saved successfully.', 'success'),
      error: (error: any) => Swal.fire('Error', 'Failed to save draft data.', 'error')
  });
}

  onCourtDivisionChange(event: any): void {
    const selectedDivision = event.target.value; 
    if (selectedDivision) {
      this.firService.getCourtRangesByDivision(selectedDivision).subscribe(
        (ranges: string[]) => {
          this.courtRanges = ranges; 
          this.firForm.patchValue({ courtName: '' }); 
        },
        (error) => {
          console.error('Error fetching court ranges:', error);
          Swal.fire('Error', 'Failed to load court ranges for the selected division.', 'error');
        }
      );
    }
  }



  // saveAsDraft_6(isSubmit: boolean = false): void {
  //   if (!this.firId) {
  //     Swal.fire('Error', 'FIR ID is missing. Unable to save as draft.', 'error');
  //     return;
  //   }
  //   this.victimsRelief.controls.forEach((control) => {
  //     control.get('reliefAmountSecondStage')?.enable(); // Temporarily enable
  //   });
  //   // Prepare data to be sent to the backend
  //   const chargesheetData = {
  //       firId: this.firId, 

  //       chargesheetDetails: {
  //         chargesheet_id: this.chargesheet_id, 
  //         chargeSheetFiled: this.firForm.get('chargeSheetFiled')?.value || '',
  //         courtDivision: this.firForm.get('courtDivision')?.value || '',
  //         courtName: this.firForm.get('courtName')?.value || '',
  //         caseType: this.firForm.get('caseType')?.value || '',
  //         caseNumber: this.firForm.get('caseType')?.value === 'chargeSheet'
  //           ? this.firForm.get('caseNumber')?.value || ''
  //           : null,
  //         rcsFileNumber: this.firForm.get('caseType')?.value === 'referredChargeSheet'
  //           ? this.firForm.get('rcsFileNumber')?.value || ''
  //           : null,
  //         rcsFilingDate: this.firForm.get('caseType')?.value === 'referredChargeSheet'
  //           ? this.firForm.get('rcsFilingDate')?.value || null
  //           : null,
  //         mfCopyPath: this.firForm.get('mfCopy')?.value || '',
  //         totalCompensation: parseFloat(this.firForm.get('totalCompensation_1')?.value || '0.00').toFixed(2),
  //         proceedingsFileNo: this.firForm.get('proceedingsFileNo_1')?.value || '',
  //         proceedingsDate: this.firForm.get('proceedingsDate_1')?.value || null,
  //         // uploadProceedingsPath: this.firForm.get('uploadProceedings_1')?.value || '',
  //       },

  //       victimsRelief: this.victimsRelief.value.map((relief: any, index: number) => ({
  //         victimId: relief.victimId || null,
  //         victimName: this.victimNames[index] || '',
  //         reliefAmountScst: parseFloat(relief.reliefAmountScst_1 || '0.00').toFixed(2),
  //         reliefAmountExGratia: parseFloat(relief.reliefAmountExGratia_1 || '0.00').toFixed(2),
  //         reliefAmountSecondStage: parseFloat(relief.reliefAmountSecondStage || '0.00').toFixed(2),
  //       })),

  //       attachments: this.attachments_1.value.map((attachment: any) => ({
  //         fileName: attachment.fileName_1 || null,
  //         filePath: attachment.file_1 || null,
  //       })),
        
  //       status: 6, // Update status to 6 for the FIR
      
  //   };

  //   // const formData = new FormData(); 

  //   // Object.keys(chargesheetData).forEach((key) => {
  //   //   const value = chargesheetData[key as keyof typeof chargesheetData]; 
  //   //   formData.append(key, String(value));  // Convert value to string to avoid type issues 
  //   // }); 
  //   // this.imagePreviews3.forEach(image => {
  //   //   formData.append('images', image.file, image.file.name);
  //   // }); 

  //   // const files = this.getFiles('uploadProceedings_1');  
  //   // if (files && files.length > 0) { 
  //   //   formData.append('uploadProceedings_1', files[0], files[0].name);
  //   // } else {
  //   //   console.error('No files selected or files are null/undefined');
  //   // }

  //   // Call the service to send data to the backend

  //   console.log("rrrrrrrrrrrrrrrr",chargesheetData);

    
  //   this.firService.saveStepSixAsDraft(chargesheetData).subscribe(
  //     (response: any) => {
  //       Swal.fire({
  //         title: 'Success',
  //         text: 'Step 6 data saved and FIR status updated to 6 successfully.',
  //         icon: 'success',
  //       });
  //     },
  //     (error) => {
  //       console.error('Error saving Step 6 data:', error);
  //       Swal.fire('Error', 'Failed to save Step 6 data.', 'error');
  //     }
  //   );
  // }




  proceedingsFile_1: File | null = null;
  saveAsDraft_6(isSubmit: boolean = false): void {
    // if (!this.firId) {
    //   Swal.fire('Error', 'FIR ID is missing. Unable to save as draft.', 'error');
    //   return;
    // }
    // this.victimsRelief.controls.forEach((control) => {
    //   control.get('reliefAmountSecondStage')?.enable(); // Temporarily enable
    // });
    // Prepare data to be sent to the backend
    const chargesheetData = {
      firId: this.firId,
      chargesheet_id: this.chargesheet_id,
      chargesheetDetails: {
      
        chargeSheetFiled: this.firForm.get('chargeSheetFiled')?.value || '',
        courtDistrict: this.firForm.get('courtDivision')?.value || '',
        courtName: this.firForm.get('courtName')?.value || '',
        caseType: this.firForm.get('caseType')?.value || '',
        caseNumber: this.firForm.get('caseType')?.value === 'chargeSheet'
          ? this.firForm.get('caseNumber')?.value || ''
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
        reliefAmountScst: parseFloat(relief.reliefAmountScst || '0.00').toFixed(2),
        reliefAmountExGratia: parseFloat(relief.reliefAmountExGratia || '0.00').toFixed(2),
        reliefAmountSecondStage: parseFloat(relief.reliefAmountSecondStage || '0.00').toFixed(2),
      })),
      uploadProceedingsPath: this.multipleFilesForproceeding1,
      attachments: this.selectedFiles || '',
      status: 6, // Update status to 6 for the FIR
    };
  
    console.log(chargesheetData,"chargesheetData")
        console.log(this.victimsRelief.value,"this.victimsRelief.value")
  
    // Call the service to send data to the backend
    this.firService.updateStep6(chargesheetData).subscribe(
      (response: any) => {

        this.submitStepSix();
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


  saveAsDraft_7(): void {
    // this.saveStepSevenAsDraft();  
    this.UpdateAsDraft_7(); 
  }




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

    this.firService.handleStepOne(this.firId, firData).subscribe(
      (response: any) => { 

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
        console.error('Error handling Step 1:', error); // Log the error
        Swal.fire('Error', `Failed to handle Step 1`, 'error');
      }
    );
  }

  submitStepFive(): void {
    this.saveStepFiveAsDraft(true); // Calls Step 5 save with submission flag
  }



  navigateToChargesheetPage(): void {
    // Set mainStep to 2 for Chargesheet Stage, assuming 1 is for FIR Stage
    this.mainStep = 2;
    this.step = 1; // Reset to the first sub-step of Chargesheet Stage
  }





  // onSubmit(): void { 

  //   if (this.step === 1 || this.step === 2) {
  //     if (this.firForm.valid) { 
  //       this.handleStepOne('manual');
  //     } else {
  //       console.warn('Form is invalid. Please fill in all required fields.');
  //       Swal.fire('Error', 'Please fill in all required fields.', 'error');
  //     }
  //   } else if (this.step === 6) {
  //     // Skip validations for Step 6 and directly submit or update status 
  //     this.submitStepSix();
  //   } else { 
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
      return this.isSubmitButtonEnabled();
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
      // 'alphabetSelection',
      // 'stationNumber',
      'stationName',



    ];

    return controls.every((controlName) => this.firForm.get(controlName)?.valid === true);
  }

  // Check Step 2 validity
  isStep2Valid(): boolean {
    const controls = [
      'firNumber',
      'firNumberSuffix',
      'dateOfOccurrence',
      'timeOfOccurrence',
      'placeOfOccurrence',
      'dateOfRegistration',
      'timeOfRegistration',
      // 'natureOfOffence',
      // 'sectionsIPC',
    ];

    return controls.every((controlName) => this.firForm.get(controlName)?.valid === true);
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


  nextStep(): void {
    this.nextButtonClicked = true; // Indicate 'Next' button clicked

    // Check if the current step is valid before moving to the next
    if (this.step === 1 && this.isStep1Valid()) {
      this.saveStepOneAsDraft();
      this.updateFirStatus(1); // Update status for step 1
      this.step++;
    } else if (this.step === 2 && this.isStep2Valid()) {
      this.saveStepTwoAsDraft();
      this.updateFirStatus(2); // Update status for step 2
      this.step++;
    } else if (this.step === 3 && this.isStep3Valid()) {
      this.saveStepThreeAsDraft();
      this.updateFirStatus(3); // Update status for step 3
      this.step++;
    } else if (this.step === 4 && this.isStep4Valid()) {
      this.saveStepFourAsDraft();
      this.updateFirStatus(4); // Update status for step 4
      this.step++;
    } else if (this.step === 5 && this.isSubmitButtonEnabled()) {
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
          // console.log('FIR status updated to:', status);
        },
        (error) => {
          console.error('Error updating FIR status:', error);
          Swal.fire('Error', 'Failed to update FIR status.', 'error');
        }
      );
    }
  }



  navigateToStep(stepNumber: number): void {
    this.step = stepNumber; // Update the current step
    this.cdr.detectChanges(); // Trigger UI update
  }



  // isStep4Valid(): boolean {
  //   const numberOfAccusedValid = !!this.firForm.get('numberOfAccused')?.valid;
  //   const accusedsArray = this.firForm.get('accuseds') as FormArray;

  //   // Check if all accused form groups are valid
  //   const accusedsValid = accusedsArray.controls.every((accusedGroup) => !!accusedGroup.valid);

  //   // Return true only if both conditions are satisfied
  //   return numberOfAccusedValid && accusedsValid;
  // }

  isStep4Valid(): boolean {
    const numberOfAccusedControl = this.firForm.get('numberOfAccused');
    const accusedsArray = this.firForm.get('accuseds') as FormArray;
  
    let isValid = true;
    let isUploadFIRCopyFilled: boolean | null = null;
    // Check if 'numberOfAccused' control exists and is valid
    if (!numberOfAccusedControl || !numberOfAccusedControl.valid) {
      console.log('Invalid Field: numberOfAccused', numberOfAccusedControl?.errors);
      isValid = false;
    }
  
    // Ensure 'accuseds' is a FormArray before proceeding
    if (accusedsArray instanceof FormArray) {
      accusedsArray.controls.forEach((accusedControl, index) => {
        const accusedGroup = accusedControl as FormGroup; // Explicitly cast to FormGroup
        if (!accusedGroup.valid) {
          console.log(`Invalid Field in accuseds[${index}]:`, accusedGroup.errors);
          
          Object.keys(accusedGroup.controls).forEach((field) => {
            const fieldControl = accusedGroup.get(field);
            if (fieldControl && !fieldControl.valid) {
              console.log(`Invalid accuseds[${index}].${field}:`, fieldControl.errors);
            }
          });
  
          isValid = false;
        }
// mahiis check
        const uploadFIRCopyControl = accusedGroup.get('uploadFIRCopy');
        if (uploadFIRCopyControl) {
          const isFilled = uploadFIRCopyControl.value ? true : false;
  
          if (isUploadFIRCopyFilled === null) {
     
            isUploadFIRCopyFilled = isFilled;
          } else if (isUploadFIRCopyFilled !== isFilled) {
           
            console.log(`Error: Inconsistent 'uploadFIRCopy' values in accuseds[${index}]`);
            isValid = false;
          }
        }
      });
    } else {
      console.log('accuseds is not a FormArray');
      isValid = false;
    }
  
    return isValid;
  }
  

  // isStep5Valid(): boolean {
  //   const victimsReliefArray = this.victimsRelief as FormArray;

  //   // Helper function to check validity of each control, even if disabled
  //   const checkAllControlsValid = (group: FormGroup): boolean => {
  //     return Object.keys(group.controls).every((controlName) => {
  //       const control = group.get(controlName);
  //       return control?.disabled || control?.valid; // Allow disabled fields to be considered valid
  //     });
  //   };

  //   // Validate each FormGroup in victimsRelief array using the helper function
  //   const victimsReliefValid = victimsReliefArray.controls.every((reliefGroup) =>
  //     checkAllControlsValid(reliefGroup as FormGroup)
  //   );

  //   // Additional fields validation
  //   const isTotalCompensationValid = this.firForm.get('totalCompensation')?.valid || false;
  //   const isProceedingsFileNoValid = this.firForm.get('proceedingsFileNo')?.valid || false;
  //   const isProceedingsDateValid = this.firForm.get('proceedingsDate')?.valid || false;
  //   const isProceedingsFileValid = this.firForm.get('proceedingsFile')?.valid || false;
  //   const areAttachmentsValid = this.attachmentss_1.valid;

  //   // Ensure all conditions are true before enabling the button
  //   return (
  //     victimsReliefValid &&
  //     isTotalCompensationValid &&
  //     isProceedingsFileNoValid &&
  //     isProceedingsDateValid &&
  //     isProceedingsFileValid &&
  //     areAttachmentsValid
  //   );
  // }


  isStep5Valid(): boolean {
    const mandatoryFields = ['proceedingsFileNo', 'proceedingsDate'];
  
    const isFormValid = mandatoryFields.every((field) => {
      const control = this.firForm.get(field);
      const value = control?.value;
      const isValid = control?.disabled || (control?.valid && value !== null && value !== '');
  
      console.log(`Field: ${field}, Value: ${value}, Valid: ${isValid}`);
  
      return isValid;
    });
  
  
    const victimsReliefArray = this.firForm.get('victimsRelief') as FormArray;
    const isCommunityCertificateValid = victimsReliefArray.controls.every((victimGroup: any, index: any) => {
      const control = victimGroup.get('communityCertificate');
      const value = control?.value;
      const isValid = control?.disabled || (control?.valid && value !== null && value !== '');
  
      console.log(`Victim ${index + 1} - Community Certificate: ${value}, Valid: ${isValid}`);
  
      return isValid;
    });
  
  
    const hasAttachments = Array.isArray(this.attachments?.value) && this.attachments.value.length > 0;
  
   
    const hasProceedingsFile = this.proceedingsFile instanceof File;
  
    return isFormValid && isCommunityCertificateValid && hasAttachments && hasProceedingsFile;
  }
  


  isSubmitButtonEnabled(): boolean {
    return this.isStep5Valid();
  }
  


  previousStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  previousMainStep() {
    if (this.mainStep > 1) {
      this.mainStep -= 1;
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
      // accused.get('previousFIRNumber')?.setValidators(Validators.required);
      // accused.get('previousFIRNumberSuffix')?.setValidators(Validators.required);
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
      // accused.get('scstFIRNumber')?.setValidators(Validators.required);
      // accused.get('scstFIRNumberSuffix')?.setValidators(Validators.required);
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
    console.log(files,"filefile")
  
    // Upload each valid file
    const uploadPromises = validFiles.map(file => this.uploadFile(file));
  console.log(uploadPromises,"dskjdskdjsds")
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

  onuploadproceedSelect(event: any): void {
    const file = event.target.files[0];  // Get the first selected file
  
    if (file) {
   
      // Patch the file into the form (this assumes you have the form control set up correctly)
      this.firForm.patchValue({
        uploadProceedings: file,  // Storing the file in the form control
      });
  
      // Optionally, display the file name
      console.log('File selected:', file.name);
    } else {
      console.log('No file selected');
    }
  }

  // uploadJudgementSelect(event: any): void {
  //   const file = event.target.files[0];  
  
  //   if (file) {
   
    
  //     this.firForm.patchValue({
  //       uploadJudgement: file,  
  //     });
  
      
  //     console.log('File selected:', file.name,file);
  //   } else {
  //     console.log('No file selected');
  //   }
  // }

  // uploadJudgementPreview: string | null = null; // To store the image preview

  uploadJudgementSelect(event: any): void {
    const file = event.target.files?.[0];
  
    if (file) {
      console.log('File selected:', file.name, file);
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadJudgementPreview = e.target.result;
      };
      reader.readAsDataURL(file);
  
      this.uploadMultipleFiles(file)
        .then(paths => {
          console.log('Uploaded file path:', paths[0]);
  
          this.firForm.patchValue({
            judgementDetails: {
              uploadJudgement: paths[0]  
            }
          });
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        });
    } else {
      console.log('No file selected');
      this.uploadJudgementPreview = null; 
    }
  }
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
  // .... thisis for proceeeding file 
 uploadProceedings_2(event: any): void {
  const file = event.target.files?.[0];

  if (file) {
    console.log('File selected:', file.name, file);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.uploadProceedings_2_preview = e.target.result;  // Set preview from uploaded file
    };
    reader.readAsDataURL(file);

    this.uploadMultipleFiles(file)
      .then(paths => {
        console.log('Uploaded file path:', paths[0]);

        // Update form control and preview with uploaded file path
        this.firForm.patchValue({
          uploadProceedings_2: paths[0]
        });

        this.uploadProceedings_2_preview = paths[0]; // Set preview for uploaded file
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  } else {
    console.log('No file selected');
    this.uploadProceedings_2_preview = '';
  }
}
  
}
