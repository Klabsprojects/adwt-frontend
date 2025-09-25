import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReliefService } from 'src/app/services/relief.service';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FirService } from 'src/app/services/fir.service';
import { VmcMeetingService } from 'src/app/services/vmc-meeting.service';
import { PoliceDivisionService } from 'src/app/services/police-division.service';
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-relief-list',
  templateUrl: './relief-list.component.html',
  styleUrls: ['./relief-list.component.scss'],
  standalone: true,
  imports: [CommonModule,DragDropModule,RouterModule,FormsModule,MatSelectModule,MatOptionModule,MatCheckboxModule,MatProgressSpinnerModule],

})
export class ReliefListComponent implements OnInit {
  firList: any[] = []; // Complete FIR list
  displayedFirList: any[] = []; // FIRs to show on current page
  page = 1; // Current page
  currentPage: number = 1;
  pageSize: number = 10;// Items per page
  totalPages: number = 0;
  totalRecords = 0;
  isLoading = true; // Loading indicator
  loader : boolean = false;
  searchText: string = '';
  dorf:any;
  dort:any;
  Parsed_UserInfo : any;
  policeStationlist : any;
  activeFilters:any[]=[];

  constructor(
    private reliefService: ReliefService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private firService: FirService,
    private firListService : FirListTestService,
    private vmcMeeting: VmcMeetingService,
    private policeDivisionService :PoliceDivisionService
  ) {
    const UserInfo : any = sessionStorage.getItem('user_data');
    this.Parsed_UserInfo = JSON.parse(UserInfo)
    this.vmcMeeting.getDistricts().subscribe((data) => {
    this.districts = Object.keys(data);
    this.cdr.detectChanges();
  });
  }

  filterFields = [
  { key: 'city', label: 'Police City', visible: false },
  { key: 'zone', label: 'Police Zone', visible: false },
  { key: 'range', label: 'Police Range', visible: false },
  { key: 'revenueDistrict', label: 'Revenue District', visible: false },
  { key: 'station', label: 'Police Station', visible: false },
  { key: 'community', label: 'Community', visible: false },
  { key: 'caste', label: 'Caste', visible: false },
  { key: 'registeredYear', label: 'Year of Registration', visible: false },
  { key: 'regDate', label: 'Reg. Date From - To', visible: false },
  { key: 'createdAt', label: 'Created At From - To', visible: false },
  { key: 'modifiedAt', label: 'Modified At From - To', visible: false },
  { key: 'status', label: 'Status of Case', visible: false },
  { key: 'dataEntryStatus', label: 'Data Entry Status', visible: false },
  { key: 'offenceGroup', label: 'Nature of Case', visible: false },
  { key: 'sectionOfLaw', label: 'Section of Law', visible: false },
  { key: 'court', label: 'Court', visible: false },
  { key: 'convictionType', label: 'Conviction Type', visible: false },
  { key: 'chargeSheetDate', label: 'Chargesheet Date From - To', visible: false },
  { key: 'legal', label: 'Legal Opinion', visible: false },
  { key: 'fitCase', label: 'Fit for Appeal', visible: false },
  { key: 'filedBy', label: 'Filed By', visible: false },
  { key: 'appealCourt', label: 'Appeal Court', visible: false },
  { key: 'selectedStatus', label: 'Relief Status', visible: false }
];

selectedStatus:string[]=[];
displayText : string = 'Select Status';
isOpen = false;
allStageOptions = [
  { value: 'firProposalNotYetReceived', label: 'FIR Proposal Not Yet Received' },
  { value: 'firReliefStageGiven', label: 'FIR Relief Stage Given' },
  { value: 'firReliefStagePending', label: 'FIR Relief Stage Pending' },
  { value: 'chargesheetReliefStageGiven', label: 'Chargesheet Relief Stage Given' },
  { value: 'chargesheetReliefStagePending', label: 'Chargesheet Relief Stage Pending' },
  { value: 'trialReliefStageGiven', label: 'Trial Relief Stage Given' },
  { value: 'trialReliefStagePending', label: 'Trial Relief Stage Pending' },
  { value: 'mistakeOfFact', label: 'Mistake of Fact' },
  { value: 'sectionDeleted', label: 'Section Deleted' },
  { value: 'firQuashed', label: 'FIR Quashed' },
  { value: 'acquitted', label: 'Acquitted' },
  { value: 'chargeAbated', label: 'Charge Abated' },
  { value: 'quashed', label: 'Quashed' }
];

  ngOnInit(): void {
     if (this.selectedDistrict) {
      this.loadPoliceStations(this.selectedDistrict);
    }
    this.updateSelectedColumns();
    this.fetchFIRList(1, this.pageSize);
    this.updateSelectedColumns();
    this.loadPoliceDivision();
    this.loadPoliceRanges();
    this.loadRevenue_district();
    this.generateYearOptions();
    this.loadCommunities();
    this.loadOptions();
    if (this.Parsed_UserInfo.access_type === 'District') {
    this.activeFilters = ['city', 'station', 'regDate', 'dataEntryStatus'];
    } else if (this.Parsed_UserInfo.access_type === 'State') {
      this.activeFilters = ['city', 'zone', 'range', 'revenueDistrict', 'station'];
    } else {
      this.activeFilters = this.filterFields.map(f => f.key);
    }
    this.updateFilterVisibility();
  }

   toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  toggleSelection(value: string) {
    const index = this.selectedStatus.indexOf(value);
    if (index > -1) {
      this.selectedStatus.splice(index, 1);
    } else {
      this.selectedStatus.push(value);
    }
    this.updateDisplayText();
  }

  

  isSelected(value: string): boolean {
    return this.selectedStatus.includes(value);
  }

  updateDisplayText() {
  if (this.selectedStatus.length === 0) {
    this.displayText = 'Select Status';
  } else {
    const selectedLabels = this.allStageOptions
      .filter(stage => this.selectedStatus.includes(stage.value))
      .map(stage => stage.label);

    this.displayText = selectedLabels.join(', ');
  }
}
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-multiselect')) {
      this.isOpen = false;
    }
  }
 
  

  paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.firList.slice(startIndex, startIndex + this.pageSize);
  }

  
previousPage() {
  if (this.currentPage > 1) {
      this.fetchFIRList(this.currentPage - 1);
    }
}

nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.fetchFIRList(this.currentPage + 1);
  }
}

 goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.fetchFIRList(page); // ADD THIS
  }
}
  goToFirstPage(): void {
    if (this.currentPage !== 1) {
      this.fetchFIRList(1);
    }
  }

    goToLastPage(): void {
    if (this.currentPage !== this.totalPages) {
      this.fetchFIRList(this.totalPages);
    }
  }

  
  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }


fetchFIRList(page: number = 1, pageSize: number = this.pageSize): void {
  this.isLoading = true;
  this.loader = true;
  this.currentPage = page;
  this.pageSize = pageSize;

  this.reliefService.getFIRReliefList(page, pageSize, this.getFilterParams())
    .subscribe({
      next: (response: any | any[]) => {
        if (Array.isArray(response)) {
          this.firList = response;
        } else if (response?.data && Array.isArray(response.data)) {
          this.firList = response.data;
          this.totalRecords = response.total
           this.totalPages = Math.ceil(this.totalRecords / this.pageSize);;
        } else if (response?.rows && Array.isArray(response.rows)) {
          this.firList = response.rows;
        } else {
          this.firList = [];
        }
        this.isLoading = false;
        this.loader = false;
        this.cdr.detectChanges(); // Ensure UI updates
      },
      error: (error) => {
        console.error("Error fetching FIR data:", error);
        this.isLoading = false;
        this.loader = false;
      }
    });
}

// ✅ No changes needed here, this just returns the list for the table
// paginatedFirList(): any[] {
//   return this.firList;
// }



getStatusBadgeClass(status: any): string {
  const badgeClassMap = {
    0: 'badge bg-warning text-dark',
    1: 'badge bg-warning text-dark',
    2: 'badge bg-warning text-dark',
    3: 'badge bg-warning text-dark',
    4: 'badge bg-warning text-dark',
    5: 'badge bg-success text-white',
    6: 'badge bg-success text-white',
    7: 'badge bg-success text-white',
    8: 'badge bg-danger text-white',
    9: 'badge bg-danger text-white',
    10:'badge bg-danger text-white',
  } as { [key: number]: string };

  return badgeClassMap[status] || 'badge bg-warning text-dark';
}

getStatusText(status: number, reliefStatus: number,selectedStatus?: any): string {
  // Handle frontend-only statuses
  if (selectedStatus) {
    const customStatusMap: { [key: string]: string } = {
      mistakeOfFact: 'Mistake of Fact',
      sectionDeleted: 'Section Deleted',
      firQuashed: 'FIR Quashed',
      acquitted: 'Acquitted',
      chargeAbated: 'Charge Abated',
      quashed: 'Quashed'
    };
    if (customStatusMap[selectedStatus]) {
      return customStatusMap[selectedStatus];
    }
  }

  // Normal flow (from API)
  if (status <= 4) {
    return 'FIR Proposal Not Yet Received';
  }

  const statusTextMap: { [key: number]: string } = {
    0: 'Just Starting',
    1: 'Pending | FIR Stage | Step 1 Completed',
    2: 'Pending | FIR Stage | Step 2 Completed',
    3: 'Pending | FIR Stage | Step 3 Completed',
    4: 'FIR Stage pending',
    5: 'FIR Stage pending',
    6: 'Chargesheet Stage pending',
    7: 'Trial Stage pending',
    11: 'FIR Stage Completed',
    12: 'Chargesheet Stage completed',
    13: 'Trial Completed',
  };

  // Custom rules
  if (status === 5 && reliefStatus === 0) return 'FIR Relief Stage Pending';
  if (status === 5 && reliefStatus === 1) return 'FIR Relief Stage Completed';
  if (status === 6 && reliefStatus === 1) return 'Chargesheet Stage Pending';
  if (status === 6 && reliefStatus === 2) return 'Chargesheet Stage Completed';
  if (status === 7 && reliefStatus === 3) return 'Appeal';
  if ((status === 5 || status === 6) && reliefStatus === 0) return 'FIR Stage pending | Chargesheet Stage Pending';
  if (status === 7 && (reliefStatus === 1 || reliefStatus === 2)) return 'Trial Stage pending';
  if ((status === 6 || status === 7) && reliefStatus === 1) return 'Chargesheet Stage Pending | Trial Stage Pending';
  if ((status === 5 || status === 6 || status === 7) && reliefStatus === 0) return 'FIR Stage pending | Charge sheet Stage Pending | Trial stage pending';
  if ((status === 5 || status === 6 || status === 7) && reliefStatus === 3) return 'Completed';

  if (status >= 4) return 'Proposal Not yet Received';

  return statusTextMap[status] || 'Unknown';
}


  navigateToRelief(firId: string): void {
  const filters = {
    selectedDistrict: this.selectedDistrict,
    policeStationName: this.policeStationName,
    dorf: this.dorf,
    dort: this.dort
  };
  localStorage.setItem('firFilters', JSON.stringify(filters));

  // Navigate with query param
  this.router.navigate(['widgets-examples/relief'], {
    queryParams: { fir_id: firId }
  });
}

// Filters
  selectedDistrict: string = '';
  selectedPoliceZone:string='';
  selectedPoliceRange: string = '';
  selectedRevenue_district: string = '';
  selectedPoliceStation:string = '';
  policeStationName : string = '';
  selectedNatureOfOffence: string = '';
  selectedStatusOfCase: string = '';
  selectedStatusOfRelief: string = '';
  selectedDataEntryStatus:string='';
  selectedOffenceGroup: string = '';
  selectedSectionOfLaw:string='';
  selectedCourt:string='';
  selectedConvictionType:string='';
  selectedCommunity:string='';
  selectedCaste:string='';
  selectedComplaintReceivedType: string = '';
  RegistredYear: string = '';
  startDate: string = '';
  endDate: string = '';
  CreatedATstartDate: string = '';
  CreatedATendDate: string = '';
  ModifiedATstartDate: string = '';
  ModifiedATDate: string = '';
  selectedUIPT: string = '';
  selectedChargeSheetFromDate:string='';
  selectedChargeSheetToDate:string='';
  selectedLegal:string='';
  selectedCase:string='';
  selectedFiled:string='';
  selectedAppeal:string='';

  // Filter options
  districts: any;
  policeZones: any;
  policeRanges: any;
  communitiesOptions: string[] = [];
  casteOptions:string[]=[];
  sectionOfLaw: any[] = [];
  courtList:any[]=[];
  revenueDistricts: any;
  years: number[] = [];

  naturesOfOffence: string[] = [
    'Theft',
    'Assault',
    'Fraud',
    'Murder',
    'Kidnapping',
    'Cybercrime',
    'Robbery',
    'Arson',
    'Cheating',
    'Extortion',
    'Dowry Harassment',
    'Rape',
    'Drug Trafficking',
    'Human Trafficking',
    'Domestic Violence',
    'Burglary',
    'Counterfeiting',
    'Attempt to Murder',
    'Hate Crime',
    'Terrorism'
  ];
  offenceGroupsList: string[] = [
    "Non GCR",
    "Murder",
    "Rape",
    "POCSO",
    "Other POCSO",
    "Gang Rape",
    "Rape by Cheating",
    "Arson",
    "Death",
    "GCR",
    "Attempt Murder",
    "Rape POCSO"
  ];

  statusesOfCase: string[] = ['Just Starting', 'Pending', 'Completed'];
  statusesOfRelief: string[] = ['FIR Stage', 'ChargeSheet Stage', 'Trial Stage'];

  // Visible Columns Management

  displayedColumns: { label: string; field: string; sortable: boolean; visible: boolean }[] = [
    { label: 'Sl.No', field: 'sl_no', sortable: false, visible: true },
    { label: 'FIR No.', field: 'fir_number', sortable: true, visible: true },
    { label: 'Police City', field: 'police_city', sortable: true, visible: true },
    { label: 'Police Station Name', field: 'police_station', sortable: true, visible: true },
    { label: 'Created By', field: 'created_by', sortable: true, visible: true },
    { label: 'Date Of Reporting', field : 'date_of_reporting', sortable: true, visible: true},
    { label: 'Created At', field: 'created_at', sortable: true, visible: true },
    { label: 'Status', field: 'status', sortable: false, visible: true },
    { label: 'Actions', field: 'actions', sortable: false, visible: true },

  ];

  selectedColumns: any[] = [...this.displayedColumns];

  // Sorting variables
  currentSortField: string = '';
  isAscending: boolean = true;

  updateSelectedColumns() {
    this.selectedColumns = this.displayedColumns.filter((col) => col.visible);
  }
  // Toggle column visibility
  toggleColumnVisibility(column: any) {
    column.visible = !column.visible; // Toggle visibility
    this.updateSelectedColumns(); // Update selected columns
  }

  // Drag and drop for rearranging columns
  dropColumn(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    this.updateSelectedColumns(); // Update selected columns after rearranging
  }


  // Apply filters to the FIR list
  applyFilters() {
    this.page = 1; // Reset pagination to the first page
    this.fetchFIRList(1); // Update displayed list
    this.cdr.detectChanges(); // Ensure UI updates
  }


  getFilterParams() {
 const params: any = {};

  const addParam = (key: string, value: any) => {
    if (value) params[key] = value;
  };

  addParam('search', this.searchText);
  addParam('district', this.selectedDistrict);
  addParam('police_zone', this.selectedPoliceZone);
  addParam('police_range', this.selectedPoliceRange);
  addParam('revenue_district', this.selectedRevenue_district);
  addParam('policeStation', this.selectedPoliceStation);
  addParam('community', this.selectedCommunity);
  addParam('caste', this.selectedCaste);
  addParam('year', this.RegistredYear);
  addParam('CreatedATstartDate', this.CreatedATstartDate);
  addParam('CreatedATendDate', this.CreatedATendDate);
  addParam('ModifiedATstartDate', this.ModifiedATstartDate);
  addParam('ModifiedATDate', this.ModifiedATDate);
  addParam('start_date', this.startDate);
  addParam('end_date', this.endDate);
  addParam('statusOfCase', this.selectedStatusOfCase);
  addParam('dataEntryStatus', this.selectedDataEntryStatus);
  addParam('sectionOfLaw', this.selectedSectionOfLaw);
  addParam('court', this.selectedCourt);
  addParam('convictionType', this.selectedConvictionType);
  addParam('chargesheetFromDate', this.selectedChargeSheetFromDate);
  addParam('chargesheetToDate', this.selectedChargeSheetToDate);
  addParam('hasLegalObtained', this.selectedLegal);
  addParam('caseFitForAppeal', this.selectedCase);
  addParam('filedBy', this.selectedFiled);
  addParam('appealCourt', this.selectedAppeal);
  addParam('OffenceGroup', this.selectedOffenceGroup);
  addParam('selectedStatus',this.selectedStatus.join(','));
  if(this.Parsed_UserInfo.role == '3'){
    params.district = this.Parsed_UserInfo.police_city
  } 
  else {
    if(this.Parsed_UserInfo.access_type == 'District'){
    params.revenue_district = this.Parsed_UserInfo.district;
    } 
  }

  
  return params;
}

   filteredFirList(page: number = 1, pageSize: number = this.pageSize) {
    this.isLoading = true;
    this.loader = true;
    this.currentPage = page;
    this.pageSize = pageSize;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.reliefService.getFIRReliefList(page, pageSize,this.getFilterParams()).subscribe(
      (data) => {
        this.firList = [];
        // this.firList = (data || []).filter((fir) => [4 ,5, 6, 7, 11, 12,13].includes(fir.status)); // Filter data
        this.firList  = data;
        this.isLoading = false;
        this.loader = false;
        this.cdr.detectChanges(); // Ensure the UI is updated immediately
      },
      (error) => {
        console.error('Error fetching FIR data:', error);
        this.isLoading = false;
      }
    );
  }

    loadPoliceStations(district: string): void {
    if (district) {
      this.firService.getPoliceStations(district).subscribe(
        (stations: string[]) => {
          this.policeStationlist = stations.map(station =>
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

    clearfilter(){
    // this.searchText = '';
    // this.selectedDistrict = '';
    // this.policeStationName = '';
    // this.dorf = '';
    // this.dort = '';
     this.searchText='';
 this.selectedDistrict='';
 this.selectedPoliceZone='';
  this.selectedPoliceRange='';
 this.selectedRevenue_district='';
 this.selectedPoliceStation='';
  this.selectedCommunity='';
  this.selectedCaste='';
  this.RegistredYear='';
  this.CreatedATstartDate='';
  this.CreatedATendDate='';
  this.ModifiedATstartDate='';
  this.ModifiedATDate='';
  this.startDate='';
  this.endDate='';
  this.selectedStatusOfCase='';
  this.selectedSectionOfLaw='';
  this.selectedCourt='';
  this.selectedConvictionType='';
  this.selectedChargeSheetFromDate='';
  this.selectedChargeSheetToDate='';
  this.selectedLegal='';
  this.selectedCase='';
  this.selectedFiled='';
  this.selectedAppeal='';
  this.selectedDataEntryStatus='';
  this.selectedStatus = [];
  this.displayText = 'Select Status';
    this.applyFilters();
    localStorage.removeItem('firFilters');

  }
  


      loadPolicecity() {
      this.policeDivisionService.getpoliceCity().subscribe(
        (data: any) => {
          this.districts = data.map((item: any) => item.district_division_name);
        },
        (error: any) => {
          // Swal.fire('Error', 'Failed to load division details.', 'error');
        }
      );
    }


  // Sorting logic
  sortTable(field: string) {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }

    this.firList.sort((a, b) => {
      const valA = a[field]?.toString().toLowerCase() || '';
      const valB = b[field]?.toString().toLowerCase() || '';
      return this.isAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  // Get the sort icon class
  getSortIcon(field: string): string {
    return this.currentSortField === field
      ? this.isAscending
        ? 'fa-sort-up'
        : 'fa-sort-down'
      : 'fa-sort';
  }




  paginatedFirList(): any[] {
    return this.firList;
}

updateFilterVisibility(): void {
  this.filterFields.forEach(f => {
    f.visible = this.activeFilters.includes(f.key);
  });
}

//   isVisible(key: string): boolean {
//   const field = this.filterFields.find(f => f.key === key);
//   return field ? field.visible : false;
// }

isVisible(key: string): boolean {
  const field = this.filterFields.find(f => f.key === key);
  if (!field) return false;

  // Default filters by login type
  let defaults: string[] = [];
  if (this.Parsed_UserInfo.access_type === 'District') {
    defaults = ['city', 'station', 'regDate', 'dataEntryStatus'];
  } else if (this.Parsed_UserInfo.access_type === 'State') {
    defaults = ['city', 'range', 'zone', 'revenueDistrict', 'station'];
  }

  // If it's part of defaults → always visible
  if (defaults.includes(key)) {
    return true;
  }

  // Otherwise → depends on dropdown selections
  return this.activeFilters.includes(key);
}


onFilterSelectionChange(event: any): void {
  this.activeFilters = event.value; // event.value gives the full selected array
  this.updateFilterVisibility();
}


  loadPoliceDivision() {
    this.policeDivisionService.getAllPoliceDivisions().subscribe(
      (data: any) => {

        this.districts = data.map((item: any) => item.district_division_name);
        this.policeZones = data.map((item: any) => item.police_zone_name);
        this.policeZones = [...new Set(this.policeZones)];
      },
      (error: any) => {
        console.error(error)
      }
    );
  }

  loadPoliceRanges() {
    this.firListService.getPoliceRanges().subscribe(
      (response: any) => {
        this.policeRanges = response;
      },
      (error: any) => {
        console.error('Error', 'Failed to load FIR data', 'error', error);
      }
    );
  }

  onDistrictChange(event:any){
   const selectedDivision = event.target.value;
   
       if (selectedDivision) {
         this.firService.getCourtRangesByDivision(selectedDivision).subscribe(
           (ranges: string[]) => {
             this.courtList = ranges; // Populate court range options based on division
           },
           (error) => {
             console.error('Error fetching court ranges:', error);
             Swal.fire('Error', 'Failed to load court ranges for the selected division.', 'error');
           }
         );
       }
  }

  loadCommunities(): void {
      this.firService.getAllCommunities().subscribe(
        (communities: any) => {
          this.communitiesOptions = communities; // Populate community options
        },
        (error) => {
          console.error('Error loading communities:', error);
          Swal.fire('Error', 'Failed to load communities.', 'error');
        }
      );
    }
  
  
  onCommunityChange(event: any): void {
    const selectedCommunity = event.target.value;
    console.log('Selected community:', selectedCommunity);
  
    if (selectedCommunity) {
      this.firService.getCastesByCommunity(selectedCommunity).subscribe(
        (res: string[]) => {
          console.log('API caste list:', res);
          this.casteOptions = [];
          res.forEach(caste => {
            this.casteOptions.push(caste);
          });
  
          // Optional: trigger change detection
          this.cdr.detectChanges();
        },
        (error:any) => {
          console.error('Error fetching castes:', error);
          Swal.fire('Error', 'Failed to load castes for the selected community.', 'error');
        }
      );
    } 
  }
  
  loadRevenue_district() {
    this.firListService.getRevenue_district().subscribe(
      (response: any) => {
        this.revenueDistricts = response;
      },
      (error: any) => {
        console.error('Error', 'Failed to load FIR data', 'error', error);
      }
    );
  }

  generateYearOptions(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1980; year--) {
      this.years.push(year);
    }
  }
  
  loadOptions() {
      this.firService.getOffences().subscribe(
        (offences: any) => {
          // console.log(offences);
          this.sectionOfLaw = offences
            .filter((offence: any) => offence.offence_act_name !== '3(2)(va)' && offence.offence_act_name !== '3(2)(v) , 3(2)(va)');
            this.sectionOfLaw.push(
                { offence_act_name: '3(2)(va)', offence_name: '3(2)(va)', id : 24 },
                { offence_act_name: '3(2)(v), 3(2)(va)', offence_name: '3(2)(v), 3(2)(va)', id: 25 }
            );
        },
        (error: any) => {
          Swal.fire('Error', 'Failed to load offence options.', 'error');
        }
      );
    }
  
SearchList() {
      this.applyFilters();
  }

  totalPagesArray(): number[] {
  const pages: number[] = [];
  const maxVisiblePages = 5;
  const startPage = Math.floor((this.currentPage - 1) / maxVisiblePages) * maxVisiblePages + 1;
  const endPage = Math.min(startPage + maxVisiblePages - 1, this.totalPages);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  } 

  return pages;
}

}
