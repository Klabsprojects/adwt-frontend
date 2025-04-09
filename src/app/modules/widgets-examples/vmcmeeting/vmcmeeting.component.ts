import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VmcMeetingService } from 'src/app/services/vmc-meeting.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vmcmeeting',
  templateUrl: './vmcmeeting.component.html',
  styleUrls: ['./vmcmeeting.component.scss'],
})
export class VmcmeetingComponent implements OnInit {
  committees = [
    { name: 'DLVMC', meetings: ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'] },
    { name: 'SDLVMC', meetings: ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'] },
    { name: 'SLVMC', meetings: ['1st Meeting', '2nd Meeting'] },
  ];
  getMeetingKey(index: number): string {
    const meetingKeys = ['1st Meeting', '2nd Meeting', '3rd Meeting', '4th Meeting'];
    return meetingKeys[index] || '';
  }
  
  districts: any;
  subdivisionsMap: { [key: string]: string[] } = {};
  filteredAttendees: any[] = [];
  formState: { [key: string]: any } = {};
  selectedCommittee: any = this.committees[0];
  selectedMeeting: string = this.selectedCommittee.meetings[0];
  selectedYear: string = ''; // Fiscal year in format "YYYY-YYYY"
  availableYears: string[] = []; // List of fiscal years
  meetingsData: any;
  selectedDistrict = '';
  selectedSubdivision = '';
  selectedSubdivisionList : any;
  meeting_Quarter : any = [];
  exisiting_record = false;
  location_based_vmc_member_detail :any;
  today: string = new Date().toISOString().split('T')[0];
  view = 'LIST';
  filteredMeeting: any[] = [];
  MeetingList: any[] = [];
  searchText: string = '';
  page: number = 1;
  Parsed_UserInfo : any;
  existingFilePath: string | null;
  file_access = environment.file_access;
  showFileInput: boolean = true;
  RemoveFormUpload : any;
  public isDialogVisible: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private vmcMeeting: VmcMeetingService,
    private cdr: ChangeDetectorRef
  ) {
    const UserInfo : any = sessionStorage.getItem('user_data');
    this.Parsed_UserInfo = JSON.parse(UserInfo)
  }

  ngOnInit(): void {
    this.initializeFiscalYears();
    this.selectedYear = this.availableYears[0]; // Default to the first fiscal year
    this.selectedCommittee = this.committees.find(
      (committee) => committee.name === 'DLVMC'
    );
    this.selectedMeeting = this.selectedCommittee?.meetings[0];
  
    
    if(this.Parsed_UserInfo.role == '4'){

      this.committees = [
        { name: 'DLVMC', meetings: ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'] },
        { name: 'SDLVMC', meetings: ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'] },
      ];
      this.selectedCommittee = this.committees[0];

      this.vmcMeeting.getDistricts().subscribe((data) => {
        this.subdivisionsMap = data;
        this.cdr.detectChanges();
      });
      // this.vmcMeeting.getUserBasedDistrict(this.Parsed_UserInfo.id).subscribe((data) => {
        this.districts = [this.Parsed_UserInfo.district];
        this.cdr.detectChanges();
      // });

    } else {
      this.committees = [
        { name: 'DLVMC', meetings: ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'] },
        { name: 'SDLVMC', meetings: ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'] },
        { name: 'SLVMC', meetings: ['1st Meeting', '2nd Meeting'] },
      ];
      this.selectedCommittee = this.committees[0];

      this.vmcMeeting.getDistricts().subscribe((data) => {
        this.districts = Object.keys(data);
        this.subdivisionsMap = data;
        this.cdr.detectChanges();
      });
    }


    this.loadMeeting();
    this.initializeFormState(this.selectedMeeting);
  
    // Select the committee based on the quarter
    const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)

    const quarterMap: { [key: number]: string } = {
      1: 'Jan-Mar', 2: 'Jan-Mar', 3: 'Jan-Mar',
      4: 'Apr-Jun', 5: 'Apr-Jun', 6: 'Apr-Jun',
      7: 'Jul-Sep', 8: 'Jul-Sep', 9: 'Jul-Sep',
      10: 'Oct-Dec', 11: 'Oct-Dec', 12: 'Oct-Dec'
    };
    this.selectMeeting(quarterMap[currentMonth]);

  }
  
    loadMeeting() {

      if(this.Parsed_UserInfo.role == '4'){
        this.vmcMeeting.getDistrictLevelMeeting(this.Parsed_UserInfo.district).subscribe(
          (results: any) => {
            this.MeetingList = results.Data;
            this.filteredMeeting = this.MeetingList;
            console.log(this.filteredMeeting)
            this.cdr.detectChanges();
          },
          () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to load members. Please try again later.',
              confirmButtonColor: '#d33',
            });
          }
        );
      } else {
        this.vmcMeeting.getAllMeeting().subscribe(
          (results: any) => {
            this.MeetingList = results.Data;
            this.filteredMeeting = this.MeetingList;
            console.log(this.filteredMeeting)
            this.cdr.detectChanges();
          },
          () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to load members. Please try again later.',
              confirmButtonColor: '#d33',
            });
          }
        );
      }
    }
  
    // Filter members based on search text
    filterMembers() {
      this.filteredMeeting = this.MeetingList.filter((meeting) =>
        (meeting.name ? meeting.name.toLowerCase() : '').includes(
          this.searchText.toLowerCase()
        )
      );
    }

  // initializeFiscalYears(): void {
  //   const currentYear = new Date().getFullYear();
  //   const endYear = currentYear + 5; // Extend to show up to 5 years in the future
  //   console.log('Initializing fiscal years:');

  //   for (let year = currentYear; year <= endYear; year++) {
  //     const fiscalYear = `${year}-${year + 1}`; // Format "YYYY-YYYY"
  //     this.availableYears.push(fiscalYear);
  //   }

  //   console.log('Available fiscal years:', this.availableYears);
  // }

  initializeFiscalYears(): void {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 5; // Extend to show up to 5 years in the future
    console.log('Initializing fiscal years:');

    for (let year = currentYear; year <= endYear; year++) {
      const fiscalYear = `${year}`; // Format "YYYY-YYYY"
      this.availableYears.push(fiscalYear);
    }

    console.log('Available fiscal years:', this.availableYears);
  }

  selectYear(year: string): void {
    this.selectedYear = year;
  }

  selectCommittee(committee: any): void {

    this.filteredAttendees = [];
    this.cdr.detectChanges();
    console.log(this.filteredAttendees,'filteredAttendeesfilteredAttendeesfilteredAttendeesfilteredAttendees')
    this.selectedCommittee = committee;
    this.selectedMeeting = committee.meetings[0];
    this.initializeFormState(this.selectedMeeting);
    // this.fetchAttendees();
    if(committee.name == 'SLVMC'){
      this.getAttendeesByDistrictbysk();
    }
    if(committee.name == 'SDLVMC'){
      this.onDistrictChange()
    }
  }



  // resetForm(): void {
  //   Object.keys(this.formState).forEach((meeting) => {
  //     this.formState[meeting] = {
  //       selectedDistrict: '',
  //       subdivisions: [],
  //       meetingDetails: { subdivision: '', meetingDate: '', meetingTime: '' },
  //       uploadedFile: null,
  //     };
  //   });

  //   this.filteredAttendees = [];
  //   this.cdr.detectChanges();
  // }

  initializeFormState(meeting: string): void {
    console.log('initialize')
    if (!this.formState[meeting]) {
      this.formState[meeting] = {
        selectedDistrict: this.selectedDistrict,
        subdivisions: this.selectedSubdivisionList,
        meetingDetails: { subdivision: this.selectedSubdivision, meetingDate: '', meetingTime: '' },
        uploadedFile: null,
      };
    } else { 
      this.formState[meeting].selectedDistrict = this.selectedDistrict
      this.formState[meeting].meetingDetails.subdivision ? this.selectedSubdivision : null;
      this.formState[meeting].subdivisions ? this.selectedSubdivisionList : null;
      this.formState[meeting].meetingDetails.meetingDate ? this.formState[meeting].meetingDetails.meetingDate : null;
      this.formState[meeting].meetingDetails.meetingTime ? this.formState[meeting].meetingDetails.meetingTime : null;
      this.formState[meeting].uploadedFile = null;
    }

    this.formState[this.selectedMeeting].selectedDistrict = this.Parsed_UserInfo.district
    if(this.selectedCommittee.name == 'DLVMC' && this.formState[this.selectedMeeting].selectedDistrict){
      this.getAttendeesByDistrictbysk();
    }
    this.exisiting_record = false;
    this.filteredAttendees = [];
    // this.filteredAttendees = this.location_based_vmc_member_detail;
    this.cdr.detectChanges();
  }

  appendformstate(meeting: any, currentmeeting : any){
    console.log('apped')
    console.log(meeting)
    this.filteredAttendees = [];
  //   if (!Array.isArray(this.filteredAttendees)) {
  //   this.filteredAttendees = [];
  // }

  // Append the meeting data to filteredAttendees
  this.filteredAttendees = [...meeting];

  // Set existing_record to true
  this.exisiting_record = true;

  console.log('Updated filteredAttendees:', this.filteredAttendees);

  if (!this.formState[currentmeeting]) {
    this.formState[currentmeeting] = {
      selectedDistrict: this.selectedDistrict,
      subdivisions: this.selectedSubdivisionList,
      meetingDetails: { subdivision: this.selectedSubdivision, meetingDate: this.filteredAttendees[0].meeting_date, meetingTime: this.filteredAttendees[0].meeting_time },
      uploadedFile: null,
    };
  } else { 
    this.formState[currentmeeting].selectedDistrict = this.selectedDistrict
    this.formState[currentmeeting].meetingDetails.subdivision ? this.selectedSubdivision : null;
    this.formState[currentmeeting].subdivisions ? this.selectedSubdivisionList : null;
    this.formState[currentmeeting].meetingDetails.meetingDate = this.filteredAttendees[0].meeting_date ? this.filteredAttendees[0].meeting_date : null;
    this.formState[currentmeeting].meetingDetails.meetingTime = this.filteredAttendees[0].meeting_time ? this.filteredAttendees[0].meeting_time : null;
    this.formState[currentmeeting].uploadedFile = null;
  }
  this.cdr.detectChanges();

}

  onDistrictChange(): void {
    this.filteredAttendees = [];
    const state = this.formState[this.selectedMeeting];
    this.selectedDistrict = this.formState[this.selectedMeeting].selectedDistrict
    
    if (!state || !state.selectedDistrict) {
      Swal.fire('Error', 'Please select a district.', 'error');
      return;
    }
  
    if (this.selectedCommittee.name === 'SDLVMC') {
      state.subdivisions = this.subdivisionsMap[state.selectedDistrict] || [];
      state.meetingDetails.subdivision = ''; // Clear subdivision on district change
    }
  
    console.log('Selected District:', state.selectedDistrict);
    this.selectedDistrict = state.selectedDistrict;
    this.cdr.detectChanges();
    // this.fetchAttendees(); 
    if (this.selectedCommittee.name === 'DLVMC') {
      this.getAttendeesByDistrictbysk();
    }
  }

  getAttendeesByDistrictbysk(){
    let uiobject = {
      committee : this.selectedCommittee.name,
      district : this.formState[this.selectedMeeting].selectedDistrict,
      subdivision : this.selectedSubdivision
    }
    this.vmcMeeting.getAttendeesByDistrictbysk(uiobject).subscribe(
        (data) => {
          console.log('Fetched meeting data:', data); // Debug fetched data
          this.filteredAttendees = [];
          this.location_based_vmc_member_detail = data.Data;
          this.filteredAttendees = data.Data;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching attendees:', error);
          Swal.fire('Error', 'Failed to fetch meeting data.', 'error');
        }
      );
  }
  
  
  fetchAttendees(): void {
    const state = this.formState[this.selectedMeeting];
    const district = state?.selectedDistrict;
    const subdivision = state?.meetingDetails?.subdivision;
    this.selectedSubdivision = state?.meetingDetails?.subdivision;
  
    if (!this.selectedYear) {
      Swal.fire('Error', 'Please select a fiscal year.', 'error');
      return;
    }
  
    console.log('Fetching attendees for:', {
      district,
      subdivision,
      committee: this.selectedCommittee.name,
      year: this.selectedYear,
    });
  
    this.vmcMeeting
      .getAttendees(district, subdivision || '', this.selectedCommittee.name, this.selectedYear)
      .subscribe(
        (data) => {
          this.meeting_Quarter = data;
          console.log('Fetched meeting data:', data); // Debug fetched data
          this.updateMeetingStatuses(data); // Update meeting statuses
        },
        (error) => {
          console.error('Error fetching attendees:', error);
          Swal.fire('Error', 'Failed to fetch meeting data.', 'error');
        }
      );
      this.getAttendeesByDistrictbysk();
  }
  
  
  
  
  updateMeetingStatuses(data: any): void {
    console.log('Updating meeting statuses with:', data);
  
    Object.keys(data).forEach((meetingKey) => {
      const meetingArray = data[meetingKey];
      if (Array.isArray(meetingArray) && meetingArray.length > 0) {
        const meeting = meetingArray[0];
        const isCompleted = meeting.meeting_status === 'Completed';
  
        if (!this.formState[meetingKey]) {
          this.formState[meetingKey] = {};
        }
  
        // this.formState[meetingKey].color = isCompleted ? 'green' : 'red';
      } else {
        if (!this.formState[meetingKey]) {
          this.formState[meetingKey] = {};
        }
        // this.formState[meetingKey].color = 'red'; // Default to red if no data
      }
    });
  
    console.log('Updated formState with colors:', this.formState);
    this.cdr.detectChanges(); // Force Angular to detect changes
  }
  

  selectedSudivision(){
  this.filteredAttendees = [];
  this.selectedSubdivision = this.formState[this.selectedMeeting].meetingDetails.subdivision;
  this.selectedSubdivisionList = this.formState[this.selectedMeeting].subdivisions;
  this.getAttendeesByDistrictbysk();
  }
  
  
  
  selectMeeting(meeting: string): void {
    this.selectedMeeting = meeting;
    console.log(meeting,'committee.................................................')
    console.log(meeting)

    var exisingmeetingdata : any;
    if(meeting == 'Jan-Mar'){
      exisingmeetingdata = this.meeting_Quarter["1st Meeting"]
    } else if(meeting == 'Apr-Jun'){
      exisingmeetingdata = this.meeting_Quarter["2nd Meeting"]
    } else if(meeting == 'Jul-Sep'){
      exisingmeetingdata = this.meeting_Quarter["3rd Meeting"]
    } else if(meeting == 'Oct-Dec'){
      exisingmeetingdata = this.meeting_Quarter["4th Meeting"]
    } else if(meeting == '1st Meeting'){
      exisingmeetingdata = this.meeting_Quarter["1st Meeting"]
    } else if(meeting == '2nd Meeting'){
      exisingmeetingdata = this.meeting_Quarter["2nd Meeting"]
    }
    
    // if(exisingmeetingdata && exisingmeetingdata.length > 0){
    //   this.appendformstate(exisingmeetingdata, meeting);
    // } else {
      this.initializeFormState(meeting);
    // }
  }
  

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
      this.formState[this.selectedMeeting].uploadedFile = file;
    } else {
      Swal.fire('Error', 'Please upload a valid PDF file under 5MB.', 'error');
    }
  }

  async submitForm(): Promise<void> {
    const state = this.formState[this.selectedMeeting];
    const { selectedDistrict, meetingDetails } = state;

    if (!selectedDistrict && this.selectedCommittee.name !== 'SLVMC') {
      Swal.fire('Error', 'Please select a district.', 'error');
      return;
    }
    if (!meetingDetails.meetingDate || !meetingDetails.meetingTime) {
      Swal.fire('Error', 'Please fill out all required fields.', 'error');
      return;
    }
    if (!this.selectedFile) {
      Swal.fire('Error', 'Please upload the minutes.', 'error');
      return;
    }

    const attendees = this.filteredAttendees.map((attendee) => ({
      id: attendee.id,
      attended: attendee.attended || false,
    }));

    let minutesUpload_Path: string | undefined;
      if (this.selectedFile) {
        const paths = await this.uploadMultipleFiles([this.selectedFile]);
        minutesUpload_Path = paths[0];
      }

    const meetingData = {
      committee: this.selectedCommittee.name,
      meeting: this.selectedMeeting,
      district: selectedDistrict,
      subdivision: meetingDetails.subdivision || '',
      meetingDate: meetingDetails.meetingDate,
      meetingTime: meetingDetails.meetingTime,
      attendees: attendees,
      Year: this.selectedYear,
      uploaded_minutes : minutesUpload_Path || this.existingFilePath || null,
    };

    console.log(meetingData,'meetingData')

    this.vmcMeeting.submitMeeting(meetingData).subscribe(
      (response: any) => {
        console.log('Form submission successful:', response);

        if (response.message === 'Meeting already exists!') {
          // Show warning popup if meeting already exists
          Swal.fire({
            icon: 'warning',
            title: 'Meeting Already Exists',
            text: `A meeting for ${this.selectedMeeting} has already been submitted for this year.`,
            confirmButtonColor: '#d33',
          });
        } else {

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Form for ${this.selectedMeeting} submitted successfully.`,
          confirmButtonColor: '#3085d6',
        });
        this.Back();
      }
      },
      (error: any) => {
        console.error('Form submission failed:', error);
        Swal.fire('Error', 'Failed to submit the form.', 'error');
      }
    );
  }


  resetForm(): void {
    this.selectedCommittee = null;
    this.selectedYear = '';
    this.selectedMeeting = '';
    
    this.filteredAttendees = [];
    const fileInput = document.getElementById('minutesUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.ngOnInit();
    this.cdr.detectChanges();
  }

  Add(){
    this.view = 'ADD';
  }


  Back(){
    this.view = 'LIST';
    this.resetForm();
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

      this.vmcMeeting.uploadFile(formData).subscribe({
        next: (response : any) => resolve(response.filePath),
        error: (error : any) => reject(error)
      });
    });
  }

  getFileName(): string {
    return this.existingFilePath ? this.existingFilePath.split('/').pop() || '' : '';
  }

  viewFile(): void {
    if (this.existingFilePath) {
      window.open(this.file_access+this.existingFilePath, '_blank');
    }
  }

  clearFile(): void {
    this.existingFilePath = null;
    this.showFileInput = true;
    const fileInput = document.getElementById('minutesUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';  // Correct way to reset a file input
    } 
    if(this.selectedFile){
      this.selectedFile = null;
    }
  }

  openDialog(form:any): void {
    // this.dialogMessage = 'This is a dialog message!';
    this.RemoveFormUpload = form;
    this.isDialogVisible = true;
  }

  closeDialog(): void {
    this.isDialogVisible = false;
  }

  confirmClear(result: any) {
    if (this.RemoveFormUpload == '1') {
      this.clearFile();
    }
    this.closeDialog();
  }

  uploadMinutes(event: any): void {
    const file = event.target.files[0];  

    if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
      this.selectedFile = file;
      console.log('File selected:', file.name,this.selectedFile,);
    } else {
      Swal.fire('Error', 'Please upload a valid PDF file under 5MB.', 'error');
    }
  }


}
