import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VmcMeetingService } from 'src/app/services/vmc-meeting.service';
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
  
  districts: string[] = [];
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


  constructor(
    private vmcMeeting: VmcMeetingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeFiscalYears();
    this.selectedYear = this.availableYears[0]; // Default to the first fiscal year
    this.selectedCommittee = this.committees.find(
      (committee) => committee.name === 'DLVMC'
    );
    this.selectedMeeting = this.selectedCommittee?.meetings[0];
  
    this.vmcMeeting.getDistricts().subscribe((data) => {
      this.districts = Object.keys(data);
      this.subdivisionsMap = data;
      this.cdr.detectChanges();
    });
  
    this.initializeFormState(this.selectedMeeting);
  
    // Merge hardcoded colors into the formState

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

    this.selectedCommittee = committee;
    this.selectedMeeting = committee.meetings[0];
    this.initializeFormState(this.selectedMeeting);
    this.fetchAttendees();
    if(committee == 'SLVMC'){
      this.getAttendeesByDistrictbysk();
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

    this.exisiting_record = false;
    this.filteredAttendees = [];
    this.filteredAttendees = this.location_based_vmc_member_detail;
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

}

  onDistrictChange(): void {
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
    this.fetchAttendees(); // Fetch attendees based on updated district or subdivision
    this.getAttendeesByDistrictbysk();
  }

  getAttendeesByDistrictbysk(){
    let uiobject = {
      committee : this.selectedCommittee.name,
      district : this.selectedDistrict,
      subdivision : this.selectedSubdivision
    }
    this.vmcMeeting.getAttendeesByDistrictbysk(uiobject).subscribe(
        (data) => {
          console.log('Fetched meeting data:', data); // Debug fetched data
          this.filteredAttendees = [];
          this.location_based_vmc_member_detail = data.Data;
          this.filteredAttendees = data.Data;
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
  
        this.formState[meetingKey].color = isCompleted ? 'green' : 'red';
      } else {
        if (!this.formState[meetingKey]) {
          this.formState[meetingKey] = {};
        }
        this.formState[meetingKey].color = 'red'; // Default to red if no data
      }
    });
  
    console.log('Updated formState with colors:', this.formState);
    this.cdr.detectChanges(); // Force Angular to detect changes
  }
  

  selectedSudivision(){
  this.selectedSubdivision = this.formState[this.selectedMeeting].meetingDetails.subdivision;
  this.selectedSubdivisionList = this.formState[this.selectedMeeting].subdivisions;
  }
  
  
  
  selectMeeting(meeting: string): void {
    this.selectedMeeting = meeting;
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
    
    if(exisingmeetingdata && exisingmeetingdata.length > 0){
      this.appendformstate(exisingmeetingdata, meeting);
    } else {
      this.initializeFormState(meeting);
    }
  }
  

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
      this.formState[this.selectedMeeting].uploadedFile = file;
    } else {
      Swal.fire('Error', 'Please upload a valid PDF file under 5MB.', 'error');
    }
  }

  submitForm(): void {
    const state = this.formState[this.selectedMeeting];
    const { selectedDistrict, meetingDetails, uploadedFile } = state;

    if (!selectedDistrict && this.selectedCommittee.name !== 'SLVMC') {
      Swal.fire('Error', 'Please select a district.', 'error');
      return;
    }
    if (!meetingDetails.meetingDate || !meetingDetails.meetingTime) {
      Swal.fire('Error', 'Please fill out all required fields.', 'error');
      return;
    }
    if (!uploadedFile) {
      Swal.fire('Error', 'Please upload the minutes.', 'error');
      return;
    }

    const attendees = this.filteredAttendees.map((attendee) => ({
      id: attendee.id,
      attended: attendee.attended || false,
    }));

    const meetingData = {
      committee: this.selectedCommittee.name,
      meeting: this.selectedMeeting,
      district: selectedDistrict,
      subdivision: meetingDetails.subdivision || '',
      meetingDate: meetingDetails.meetingDate,
      meetingTime: meetingDetails.meetingTime,
      attendees: attendees,
      uploadedFile: uploadedFile,
    };

    console.log(meetingData,'meetingData')

    this.vmcMeeting.submitMeeting(meetingData).subscribe(
      (response: any) => {
        console.log('Form submission successful:', response);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Form for ${this.selectedMeeting} submitted successfully.`,
          confirmButtonColor: '#3085d6',
        });
        this.resetForm()
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
  }

}
