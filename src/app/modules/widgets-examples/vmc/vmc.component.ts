import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Vmcservice } from 'src/app/services/Vmc.Service';
import { Router, NavigationEnd } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs/operators';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-vmc',
  templateUrl: './vmc.component.html',
  styleUrls: ['./vmc.component.scss'],
})
export class VmcComponent implements OnInit {
  @ViewChild('memberModalAdd', { static: true }) memberModalAdd: any;
  modalRef: NgbModalRef | undefined;
  editIndex: number | null = null;

  // Properties
  members: any[] = [];
  filteredMembers: any[] = [];
  member: any = {
    salutation: '',
    member_type: '',
    name: '',
    level_of_member: '',
    designation: '',
    other_designation: '',
    appointment_date: '',
    validityEndDate: '',
    status: '1',
    district: '',
    subdivision: '',
  };

  districts: any[] = [];
  subdivisions: any[] = [];
  filteredSubdivisions: any[] = [];
  searchText: string = '';
  page: number = 1;
  currentUser: any = {};
  Parsed_UserInfo: any;

  // Dropdown enable/disable states
  isDistrictDisabled: boolean = false;
  isSubdivisionDisabled: boolean = false;

  // new
  selectedDistrict: any;
  selectedSubDivision: any;
  distandsubdivs: any;
  selectedStatus: any;
  selectedMemberType: any;
  selectedDesignationMember: any;
  doa: any;
  selectedMemberLevel: any;
  subdivs: any[] = [];
  status: any[] = ['Active', 'Inactive']
  options = [
    "Hon'ble Chief Minister (Chairperson)",
    "Hon'ble Minister for Home Affairs",
    "Hon'ble Minister for Finance",
    "Hon'ble Minister for Adi Dravidar Welfare",
    "Member of Parliament (MP)",
    "Member of Legislative Assembly (MLA)",
    "Chief Secretary of the Government of Tamil Nadu",
    "Secretary, Home Department",
    "Director General of Police (DGP)",
    "Director, National Commission for the SCs and STs",
    "Deputy Director, National Commission for SCs and STs",
    "Secretary, Adi Dravidar and Tribal Welfare Department",
    "District Collector",
    "Superintendent of Police (SP)",
    "Deputy Superintendent of Police (DSP)",
    "DADTWO",
    "Sub-Divisional Magistrate (SDM)",
    "Member of Legislative Council (Councillor)",
    "Panchayat President",
    "Panchayat Vice-President",
    "Member of Panchayat",
    "Tahsildar",
    "Block Development Officer",
    "Others"
  ];
  filteredJson: any = {}


  constructor(
    private modalService: NgbModal,
    private vmcService: Vmcservice,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ds: DashboardService
  ) {
    const UserInfo: any = sessionStorage.getItem('user_data');
    this.Parsed_UserInfo = JSON.parse(UserInfo)
    // Reload members when navigating back to this component
    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     this.loadMembers();
    //   });
  }

  ngOnInit(): void {
    this.get_filter_json();
    this.loadUserFromSession();
    this.loadMembers();
    this.resetForm();
    // this.loadDistricts();
    this.getDisctricts();
  }

  // new
  getDisctricts() {
    this.ds.userGetMethod('vmcmeeting/districts').subscribe((res: any) => {
      this.distandsubdivs = res;
      this.districts = Object.keys(res);
    })
  }
  getSubdivisions() {
    if (this.selectedDistrict) {
      this.subdivs = this.distandsubdivs[this.selectedDistrict];
    }
    else {
      this.subdivs = [];
    }
  }

  get_filter_json(){
    return this.filteredJson = {
      member_type: this.selectedMemberType,
      name: this.searchText,
      level_of_member: this.selectedMemberLevel,
      district: this.selectedDistrict,
      subdivision: this.selectedSubDivision,
      designation: this.selectedDesignationMember,
      appointment_date: this.doa
    }
  }

  clear(){
    this.selectedMemberType = '';
    this.searchText = '';
    this.selectedMemberLevel = '';
    this.selectedDistrict = '';
    this.selectedSubDivision = '';
    this.selectedDesignationMember = '';
    this.doa = '';
    this.get_filter_json();
  }
  
  getFilteredTable(data: any[], filter: any) {
    return data.filter((item: any) =>
      Object.entries(filter).every(([key, value]) => {
        // Skip filtering for undefined, null, or empty string values
        if (value === undefined || value === null || value === '') {
          return true; // Ignore this filter key if not set
        }

        // Handle member_type (supports single value or array)
        if (key === 'member_type') {
          if (Array.isArray(value)) {
            return value.includes(item[key]);
          }
          return item[key] === value;
        }

        // Case-insensitive partial match for name
        if (key === 'name' && typeof value === 'string' && typeof item[key] === 'string') {
          return item[key].toLowerCase().includes(value.toLowerCase());
        }

        // Exact match for all other fields
        return item[key] === value;
      })
    );
  }

  // newend

  // Load logged-in user from session
  loadUserFromSession() {
    const userDataString = sessionStorage.getItem('user_data');
    if (userDataString) {
      this.currentUser = JSON.parse(userDataString);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  // Load all members
  loadMembers() {
    if (this.Parsed_UserInfo.role == '4') {
      this.vmcService.getDistrictLevelMember(this.Parsed_UserInfo.district).subscribe(
        (results: any[]) => {
          this.members = results;
          this.filteredMembers = this.members;
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
      this.vmcService.getAllMembers().subscribe(
        (results: any[]) => {
          this.members = results;
          this.filteredMembers = this.members;
          console.log('filteredMembers', this.filteredMembers);
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
    this.filteredMembers = this.members.filter((member) =>
      (member.name ? member.name.toLowerCase() : '').includes(
        this.searchText.toLowerCase()
      )
    );
  }

  formatDate(dateString: string): string {
    return dateString ? dateString.split("T")[0] : ''; // Extract only YYYY-MM-DD
  }

  // Open Add/Edit Modal
  openModal(member?: any): void {
    if (member) {
      this.member = { ...member }; // Pre-fill form for editing
      setTimeout(() => {
        this.member.subdivision = member.subdivision;
      }, 3000);
      this.editIndex = this.members.findIndex((m) => m.id === member.id);
      this.onLevelChange(this.member.level_of_member); // Set dropdown states based on level
    } else {
      this.resetForm(); // Reset form for new entry
    }
    this.modalRef = this.modalService.open(this.memberModalAdd, { centered: true });
  }

  onLevelChange(level: string): void {

    if (this.Parsed_UserInfo.role == '4') {
      console.log(this.districts)
      console.log(this.Parsed_UserInfo.district)
      this.member.district = this.Parsed_UserInfo.district;
    }

    // Update dropdown states based on the selected level
    this.isDistrictDisabled = level === 'State Level';
    this.isSubdivisionDisabled = level !== 'Subdivision';

    if (level === 'Subdivision') {
      // Populate subdivisions if district is selected
      if (this.member.district) {
        this.populateSubdivisions(this.member.district);
      } else {
        this.subdivisions = []; // Clear subdivisions if no district is selected
        this.member.subdivision = '';
      }
    }
  }

  populateSubdivisions(selectedDistrict: string): void {
    this.vmcService.getSubdivisionsByDistrict(selectedDistrict).subscribe(
      (results: any[]) => {
        this.subdivisions = results.map((item) => item.sub_division); // Map to get only subdivision names
        this.member.subdivision = ''; // Reset subdivision field
        console.log('Subdivisions loaded for district:', selectedDistrict, this.subdivisions);
      },
      (error) => {
        console.error('Error fetching subdivisions:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load subdivisions. Please try again later.',
        });
      }
    );
  }



  onSubmit(myForm: NgForm) {
    if (myForm.valid) {
      const formattedappointment_date = this.formatDateForBackend(this.member.appointment_date);
      const formattedValidityDate = this.formatDateForBackend(this.member.validityEndDate);

      if (!formattedappointment_date) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please enter valid dates.',
          confirmButtonColor: '#d33',
        });
        return;
      }

      if (this.isInvalidBasedOnLevel()) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please fill out all required fields based on the selected level.',
          confirmButtonColor: '#d33',
        });
        return;
      }

      this.member.meeting_date = formattedappointment_date;
      this.member.validity_end_date = formattedValidityDate;

      if (this.editIndex !== null) {
        this.updateMember();
      } else {
        this.addMember();
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill out all required fields.',
        confirmButtonColor: '#d33',
      });
    }
  }

  isInvalidBasedOnLevel(): boolean {
    if (this.member.level_of_member === 'District Level' && !this.member.district) {
      return true;
    }
    if (this.member.level_of_member === 'Subdivision' && (!this.member.district || !this.member.subdivision)) {
      return true;
    }
    return false;
  }


  addMember() {
    this.vmcService.addMember(this.member).subscribe(
      () => {
        this.showSuccessAlert('Member added successfully!');
        this.loadMembers();
        this.closeModal();
      },
      () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add the member. Please try again later.',
          confirmButtonColor: '#d33',
        });
      }
    );
  }

  updateMember() {
    console.log("Updating member:", this.member);

    if (!this.member.vmc_id) { // Ensure `vmc_id` is being passed
      console.error("Member ID is missing!");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Member ID is missing. Update cannot be performed.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    const formattedappointment_date = this.formatDateForBackend(this.member.appointment_date);
    const formattedValidityDate = this.formatDateForBackend(this.member.validityEndDate);

    this.member.meeting_date = formattedappointment_date;
    this.member.validity_end_date = formattedValidityDate;

    this.vmcService.updateMember(this.member.vmc_id, this.member).subscribe(
      (response: any) => {
        console.log("Update response:", response);
        this.showSuccessAlert('Member updated successfully!');
        this.loadMembers();
        this.closeModal();
      },
      (error: any) => {
        console.error("Error updating member:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update the member. Please try again later.',
          confirmButtonColor: '#d33',
        });
      }
    );
  }



  logDistrictChange(event: any) {
    console.log("District changed to:", event);
  }

  loadDistricts() {
    if (this.Parsed_UserInfo.role == '4') {
      this.districts.push({ district: this.Parsed_UserInfo.district });
      // this.member.district = this.Parsed_UserInfo.district;
      // setTimeout(() => {
      //   this.member.district = this.Parsed_UserInfo.district;
      //   console.log("After Timeout:", this.member.district);
      // });
      console.log(this.districts, this.Parsed_UserInfo.district, this.member.district)
    } else {
      this.vmcService.getAllDistricts().subscribe(
        (results: any[]) => {
          this.districts = results;
        },
        () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load districts. Please try again later.',
          });
        }
      );
    }
  }

  onDistrictChange(event: Event): void {
    const selectedDistrict = (event.target as HTMLSelectElement).value;

    if (selectedDistrict) {
      this.member.district = selectedDistrict;
      if (this.member.level_of_member === 'Subdivision') {
        this.populateSubdivisions(selectedDistrict);
      } else {
        this.subdivisions = []; // Clear subdivisions if not in "Subdivision Level"
        this.member.subdivision = '';
      }
    } else {
      this.subdivisions = []; // Clear subdivisions if no district is selected
      this.member.subdivision = '';
    }
  }



  // Delete member
  deleteMember(memberId: string): void {
    console.log("Deleting member with ID:", memberId); // Debugging log
    if (!memberId) {
      console.error("Member ID is missing!");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Member ID is missing. Deletion cannot proceed.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this member!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.vmcService.deleteMember(memberId).subscribe(
          () => {
            this.showSuccessAlert('Member deleted successfully!');
            this.loadMembers();
          },
          (error: any) => {
            console.error("Error deleting member:", error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete the member. Please try again later.',
              confirmButtonColor: '#d33',
            });
          }
        );
      }
    });
  }




  // Toggle member status
  toggleStatus(member: any): void {
    const newStatus = member.status == '1' ? '0' : '1';
    this.vmcService.toggleMemberStatus(member.id, newStatus).subscribe(
      () => {
        this.showSuccessAlert(
          `Member status changed to ${newStatus === '1' ? 'Active' : 'Inactive'}`
        );
        this.loadMembers();
      },
      () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update member status. Please try again later.',
          confirmButtonColor: '#d33',
        });
      }
    );

  }


  formatDateForBackend(date: string | Date): string | null {
    if (!date) {
      return null;
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toISOString().split('T')[0];
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.resetForm();
  }

  resetForm() {
    this.member = {
      salutation: '',
      member_type: '',
      name: '',
      designation: '',
      other_designation: '',
      appointment_date: '',
      validityEndDate: '',
      level_of_member: '',
      status: '1',
      district: '',
      subdivision: '',
    };
    this.isDistrictDisabled = false;
    this.isSubdivisionDisabled = false;
    this.editIndex = null;
  }

  showSuccessAlert(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6',
    });
  }

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

    disallowedPattern = /[<>"'*\/\\|()]/g;
allowOnlyValidCharacters(event: KeyboardEvent) {
  const char = event.key;

  if (this.disallowedPattern.test(char)) {
    event.preventDefault(); // Block the keypress
  }
}
// Optional cleanup if some invalid characters still get in (like from paste)
onInputChange(event: Event) {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(this.disallowedPattern, '');
}
}
