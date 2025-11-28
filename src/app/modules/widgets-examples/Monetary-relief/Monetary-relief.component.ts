import { Component, HostListener, inject, OnInit, signal, TemplateRef, WritableSignal } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule,formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonetaryReliefService } from 'src/app/services/monetary-relief.service';
import { ReportsCommonService } from 'src/app/services/reports-common.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DashboardService } from 'src/app/services/dashboard.service';
import { FirService } from 'src/app/services/fir.service';
import { PoliceDivisionService } from 'src/app/services/police-division.service';
import { firstValueFrom, of } from 'rxjs';
import * as XLSX from 'xlsx';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-monetary-relief',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    DragDropModule,
    MatProgressSpinnerModule
  ],
  providers: [FirListTestService], // Provide the service here
  templateUrl: './monetary-relief.component.html',
  styleUrls: ['./monetary-relief.component.scss'],
})
export class MonetaryReliefComponent implements OnInit {
  private modalService = inject(NgbModal);
  closeResult: WritableSignal<string> = signal('');
  // Variable Declarations
  searchText: string = '';
  reportData: Array<any> = [];
  filteredData: Array<any> = [];
  page: number = 1;
  currentPage: number = 1;
itemsPerPage: number = 10;
  dropdownSettings = {
    singleSelection: false,
    idField: 'value',   // matches your object key
    textField: 'label', // matches your object key
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 2,
    allowSearchFilter: true
  };

isOpen = false;
selectedStages: string[] = [];
displayText = 'Select Status';
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
  
  isReliefLoading: boolean = true;
  loading: boolean = false;
  pendingReason : string = '';
  selectedData:any;
  // Filters
  selectedDistrict: string = '';
  selectedColumns: string[] = [];
  selectedNatureOfOffence: string = '';
  selectedStatusOfCase: string = '';
  selectedStatusOfRelief: string = '';
  selectedOffenceGroup:string = '';
  selectedPoliceRange:string='';
  policeZones:any;
  districts: string[] = [];
  naturesOfOffence: string[] = [];
  Parsed_UserInfo: any;
  statusesOfCase: string[] = ['Just Starting', 'Pending', 'Completed'];
   loader: boolean = false;
  statusesOfRelief: string[] = [
    'FIR Stage',
    'ChargeSheet Stage',
    'Trial Stage',
  ];
  communities:any[]=[];
  castes:any[]=[];
  zones:any[]=[];
  policeCities:any[]=[];
   status: any[]=[
    { key: 'UI', value: 'UI Stage' },
    { key: 'PT', value: 'PT Stage' },
  ]

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

  selectedUIPT:string='';
  selectedStatus:string[]=[];
  selectedDistricts:string='';
  selectedCommunity:string='';
  selectedCaste:string='';
  selectedZone:string='';
  selectedPoliceCity:string=''
  selectedFromDate:any="";
  selectedToDate:any="";

policeStations: string[] = [];
selectedPoliceStation:string='';
selectedProposal:string='';
selectedStage:string='';
selectedReliefStatus:string='';
selectedPoliceZone: string = '';
revenueDistricts:any;
policeRanges: any;
selectedRevenue_district:string='';
startDate: string = '';
endDate: string = '';
selectedSectionOfLaw:string='';
 
displayedColumns: DisplayedColumn[] = [
  // ✅ Ungrouped columns
  {
    label: 'Sl. No.',
    field: 'sl_no',
    group: null,
    sortable: false,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'FIR ID',
    field: 'fir_id',
    group: null,
    sortable: false,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'District',
    field: 'revenue_district',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Police Division',
    field: 'police_city',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Police Station',
    field: 'police_station',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'FIR Number',
    field: 'fir_number',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Register Date',
    field: 'FIR_date',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Nature of Offence',
    field: 'offence_committed',
    group: null,
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'Victim Name',
    field: 'victim_name',
    group: null,
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'Gender',
    field: 'victim_gender',
    group: null,
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'Caste',
    field: 'caste',
    group: null,
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'Sub Caste',
    field: 'community',
    group: null,
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'Relief Stage',
    field: 'relief_stage',
    group: null,
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'Relief Status',
    field: 'relief_status',
    group: null,
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  // ✅ Group: FIR
  {
    label: 'Proposal Sent to DC',
    field: 'fir_proposal_status',
    group: 'FIR',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Status',
    field: 'fir_status',
    group: 'FIR',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Pending Days',
    field: 'fir_pending_days',
    group: 'FIR',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Proposal Date',
    field: 'first_proceeding_date',
    group: 'FIR',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'As per the Act',
    field: 'relief_amount_scst',
    group: 'FIR',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'Ex-Gratia',
    field: 'relief_amount_exgratia',
    group: 'FIR',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'Total - FIR Stage',
    field: 'totalFirStageAmount',
    group: 'FIR',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: '1st Stage Disbursement Date',
    field: 'first_disbursement_date',
    group: 'FIR',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  
  // ✅ Group: CHARGESHEET
  {
    label: 'Proposal Sent to DC',
    field: 'chargesheet_proposal_status',
    group: 'Chargesheet',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Status',
    field: 'chargesheet_status',
    group: 'Chargesheet',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Pending Days',
    field: 'chargesheet_pending_days',
    group: 'Chargesheet',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Proposal Date',
    field: 'second_proceeding_date',
    group: 'Chargesheet',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'As per the Act',
    field: 'secondInstallmentReliefScst',
    group: 'Chargesheet',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'Ex-Gratia',
    field: 'secondInstallmentReliefExGratia',
    group: 'Chargesheet',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'Total - Chargesheet Stage',
    field: 'totalChargeSheetAmount',
    group: 'Chargesheet',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: '2nd Stage Disbursement Date',
    field: 'second_disbursement_date',
    group: 'Chargesheet',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  
  // ✅ Group: TRIAL Stage (spelling corrected from "TRAIL")
  {
    label: 'Proposal Sent to DC',
    field: 'trail_proposal_status',
    group: 'Trial',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Status',
    field: 'trial_status',
    group: 'Trial',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Pending Days',
    field: 'trial_pending_days',
    group: 'Trial',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Proposal Date',
    field: 'trial_proceeding_date',
    group: 'Trial',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'As per the Act',
    field: 'trial_reliefScst',
    group: 'Trial',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'Ex-Gratia',
    field: 'trial_reliefExGratia',
    group: 'Trial',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: 'Total - Final Stage',
    field: 'totalTrialAmount',
    group: 'Trial',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
  {
    label: '3rd Stage Disbursement Date',
    field: 'trial_disbursement_date',
    group: 'Trial',
    sortable: true,
    visible: false,
    sortDirection: null,
  },
// ✅ Ungrouped "No. of Days since" columns
// {
//   label: 'No. of Days since 1st Stage Relief',
//   field: 'days_since_first_relief',
//   group: null,
//   sortable: true,
//   visible: true,
//   sortDirection: null,
// },
// {
//   label: 'No. of Days since 2nd latest Relief',
//   field: 'days_since_second_relief',
//   group: null,
//   sortable: true,
//   visible: true,
//   sortDirection: null,
// },
// {
//   label: 'No. of Days since 3rd latest Relief',
//   field: 'days_since_trial_relief',
//   group: null,
//   sortable: true,
//   visible: true,
//   sortDirection: null,
// },
{
  label: 'Reason for Pending ',
  field: 'report_reason',
  group: null,
  sortable: true,
  visible: true,
  sortDirection: null,
},
];

  selectedCaseStatus: string = '';
  currentSortField: string = '';
  isAscending: boolean = true;
  communitiesOptions: string[] = [];
  casteOptions:string[]=[];
  sectionOfLaw: any[] = [];
  pageSize: number = 10;
  totalRecords: number = 0; // Total number of records
  totalPages: number = 0;
  isLoading: boolean = true;
  monetaryList:any[]=[];

  constructor(
    // private firService: FirListTestService,
    private policeDivisionService: PoliceDivisionService,
    private cdr: ChangeDetectorRef,
    private firGetService: FirService,
    private firService: FirListTestService,
    private reportsCommonService: ReportsCommonService,
    private monetaryReliefService: MonetaryReliefService,
    private router: Router,
     private dashboardService: DashboardService
  ) {
    this.loader = true;
  }

  groupedBySection: { [group: string]: DisplayedColumn[] } = {};
  groupOrder = ['FIR', 'Chargesheet', 'Trial'];

  // Initializes component data and fetches necessary information on component load.
 ngOnInit(): void {
  const UserInfo: any = sessionStorage.getItem('user_data');
  this.Parsed_UserInfo = JSON.parse(UserInfo);

  this.groupedBySection = this.groupOrder.reduce((acc, groupName) => {
    const cols = this.displayedColumns.filter(
      col => col.group === groupName && col.visible
    );
    if (cols.length > 0) {
      acc[groupName] = cols;
    }
    return acc;
  }, {} as { [group: string]: DisplayedColumn[] });

  this.reportsCommonService.getAllData().subscribe(({ districts, offences }) => {
    this.districts = districts;
    this.naturesOfOffence = offences;
    this.fetchMonetaryReliefDetails(1, this.pageSize);
  });

  this.getDropdowns();
  this.filteredData = [...this.reportData];

  // ✅ only visible:true columns selected by default
  this.selectedColumns = this.displayedColumns
    .filter(column => column.visible)
    .map(column => column.field);

  this.loadPoliceDivision();
  this.loadPoliceRanges();
  this.loadRevenue_district();
  this.loadCommunities();
  this.loadOptions();
}


// define two groups
firstGroup = this.allStageOptions.slice(0, 7).map(opt => opt.value);
lastGroup = this.allStageOptions.slice(7).map(opt => opt.value);

toggleDropdown() {
  this.isOpen = !this.isOpen;
}

isSelected(value: string): boolean {
  return this.selectedStages.includes(value);
}

isDisabled(value: string): boolean {
  // if any first group option selected -> disable last group
  if (this.selectedStages.some(v => this.firstGroup.includes(v))) {
    return this.lastGroup.includes(value);
  }
  // if any last group option selected -> disable first group
  if (this.selectedStages.some(v => this.lastGroup.includes(v))) {
    return this.firstGroup.includes(value);
  }
  return false;
}

toggleSelection(value: string) {
  const index = this.selectedStages.indexOf(value);
  if (index > -1) {
    this.selectedStages.splice(index, 1);
  } else {
    this.selectedStages.push(value);
  }
  this.selectedStatus = [...this.selectedStages];

  this.updateDisplayText();
}

updateDisplayText() {
  this.displayText =
    this.selectedStages.length > 0
      ? this.allStageOptions
          .filter(opt => this.selectedStages.includes(opt.value))
          .map(opt => opt.label)
          .join(', ')
      : 'Select Status';
}

//   get displayText(): string {
//   if (!this.selectedStatus.length) {
//     return 'Select Status';
//   }

//   const selectedLabels = this.allStageOptions
//     .filter(opt => this.selectedStages.includes(opt.value))
//     .map(opt => opt.label);

//   return selectedLabels.join(', ');
// }

  // Detect click outside to close dropdown
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-multiselect')) {
      this.isOpen = false;
    }
  }
  // Updates the visibility of columns based on user-selected columns.
  updateColumnVisibility(): void {
    this.displayedColumns.forEach((column) => {
      column.visible = this.selectedColumns.includes(column.field);
    });
  }

    getDropdowns() {
    // this.dashboardService.userGetMethod('districts').subscribe((res:any)=>{
    //   this.districts = res;
    // })
    this.dashboardService.userGetMethod('fir/communities').subscribe((res:any)=>{
      this.communities = res;
    })
    this.dashboardService.userGetMethod('Zone_Filter_Data').subscribe((res:any)=>{
      this.zones = res.data;
    })
    this.dashboardService.userGetMethod('Police_City_filtet_data').subscribe((res:any)=>{
      this.policeCities = res.data;
    })
  }
  getCaste(){
    if(this.selectedCommunity){
      this.dashboardService.userGetMethod(`fir/castes-by-community?community=${this.selectedCommunity}`).subscribe((res:any)=>{
        this.castes = res;
      })
    }
  }

  // Handles changes in column selection and updates column visibility.
onColumnSelectionChange(): void {
  // Update visible flags
  this.displayedColumns.forEach(col => {
    col.visible = this.selectedColumns.includes(col.field);
  });

  // Rebuild group headers based on visibility
  this.groupedBySection = this.groupOrder.reduce((acc, groupName) => {
    const cols = this.displayedColumns.filter(
      col => col.group === groupName && col.visible
    );
    if (cols.length > 0) {
      acc[groupName] = cols;
    }
    return acc;
  }, {} as { [group: string]: DisplayedColumn[] });
}
  // Load all monetaty relief reports details into UI


  // Applies filters, assigns serial numbers, and resets pagination
  // applyFilters(): void {
  //   this.filteredData = this.reportsCommonService.applyFilters(
  //     this.reportData,
  //     this.searchText,
  //     this.selectedDistrict,
  //     this.selectedNatureOfOffence,
  //     this.selectedStatusOfCase,
  //     this.selectedStatusOfRelief,
  //     'police_city',
  //     'nature_of_offence',
  //     'status'
  //   );
  //   this.filteredData = this.filteredData.map((report, index) => ({
  //     ...report,
  //     sl_no: index + 1,
  //   })); // Assign sl_no starting from 1
  //   this.page = 1; // Reset to the first page
  // }

  // Sorting logic
  sortTable(field: string) {
    const result = this.reportsCommonService.sortTable(
      this.filteredData,
      field,
      this.currentSortField,
      this.isAscending
    );
    this.filteredData = result.sortedData;
    this.currentSortField = result.newSortField;
    this.isAscending = result.newIsAscending;
  }

  // Get the sort icon class
  getSortIcon(field: string): string {
    return this.reportsCommonService.getSortIcon(
      field,
      this.currentSortField,
      this.isAscending
    );
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
 


    clearfilter(){
      this.searchText = '';
      this.selectedDistrict = '';
      this.selectedPoliceZone='';
      this.selectedRevenue_district='';
      this.selectedCommunity='';
      this.selectedCaste='';
      this.selectedSectionOfLaw=''; 
      this.selectedOffenceGroup='';
      this.startDate='';
      this.endDate = '';
      this.selectedStatusOfCase = '';
      this.selectedStage = '';
      this.selectedReliefStatus = '';
      this.selectedStatus = [];
      this.selectedStages=[];
      this.displayText = 'Select Status';
        this.fetchMonetaryReliefDetails();
  }

  
    getStatusTextUIPT(status: number): string {
    console.log(status,'statussssssss')
    const statusTextMap = {
      0: 'UI',
      1: 'UI',
      2: 'UI',
      3: 'UI',
      4: 'UI',
      5: 'UI',
      6: 'PT',
      7: 'PT',
      8: 'PT',
      9: 'PT',
    } as { [key: number]: string };

    return statusTextMap[status] || '';
  }


//   applyFilters() {
//   this.filteredData = this.reportData.filter(item => {

//     if (this.searchText && this.searchText.trim() !== '' && 
//     item.fir_number.toLowerCase() !== this.searchText.toLowerCase().trim()) {
//     return false;
//     }

//     // District filter
//     if (this.selectedDistrict && this.selectedDistrict !== '' && 
//         item.revenue_district !== this.selectedDistrict) {
//       return false;
//     }

//     // Police City filter
//     if (this.selectedPoliceCity && this.selectedPoliceCity !== '' && 
//         item.police_city !== this.selectedPoliceCity) {
//       return false;
//     }

//     // Police Zone filter
//     if (this.selectedZone && this.selectedZone !== '' && 
//         item.police_zone !== this.selectedZone) {
//       return false;
//     }

//     // Community filter
//     if (this.selectedCommunity && this.selectedCommunity !== '' && 
//         item.community !== this.selectedCommunity) {
//       return false;
//     }

//     // Caste filter
//     if (this.selectedCaste && this.selectedCaste !== '' && 
//         item.caste !== this.selectedCaste) {
//       return false;
//     }

//     // Status filter (UI: status <= 5, PT: status > 5)
//     if (this.selectedStatus && this.selectedStatus !== '') {
//       if (this.selectedStatus === 'UI' && item.filter_status > 5) {
//         return false;
//       }
//       if (this.selectedStatus === 'PT' && item.filter_status <= 5) {
//         return false;
//       }
//     }

//     // Date range filter
//     if (this.selectedFromDate || this.selectedToDate) {
//     const registrationDate = new Date(item.date_of_registration);
    
//     if (this.selectedFromDate && !this.selectedToDate) {
//       const fromDate = new Date(this.selectedFromDate);
//       if (registrationDate < fromDate) {
//         return false;
//       }
//     }
    
//     if (this.selectedToDate && !this.selectedFromDate) {
//       const toDate = new Date(this.selectedToDate);
//       if (registrationDate > toDate) {
//         return false;
//       }
//     }

//     if (this.selectedToDate && this.selectedFromDate) {
//       const fromDate = new Date(this.selectedFromDate);
//       const toDate = new Date(this.selectedToDate);
//       if (registrationDate < fromDate || registrationDate > toDate) {
//         return false;
//       }
//     }
//   }

//     return true;
//   });
// }

fetchMonetaryReliefDetails(page: number = 1, pageSize: number = this.pageSize):any {
    this.isLoading = true;
    this.currentPage = page;
    this.pageSize = pageSize;
    this.loader = true;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    this.monetaryReliefService.getMonetaryReliefData(page, pageSize,this.getFilterParams()).subscribe({
      next: (response: any) => {
        this.reportData = response.data;
         this.totalRecords = response.total;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.reportData = response.data.map((item: any, index: number) => ({
          sl_no: startIndex + index + 1,
          fir_id:item.fir_id,
          fir_number: item.fir_number === "NULL" || !item.fir_number ? '' : item.fir_number,
          FIR_date: formatDate(item.FIR_date, 'yyyy-MM-dd', 'en'),
          police_city: item.police_city,
          police_station: item.police_station,
          revenue_district: item.revenue_district,
          police_zone: item.police_zone,
          community: item.community,
          caste: item.caste,
          offence_committed: item.offence_committed === "NULL" ? '' : (item.offence_committed || '').replace(/["\[\]]/g, ''),
          victim_name: item.victim_name === "NULL" ? '' : (item.victim_name || ''),
          victim_gender: item.victim_gender === "NULL" ? '' : (item.victim_gender || ''),
          relief_stage: item.relief_stage,
          relief_status: item.relief_status,
          first_proceeding_date: item.first_proceeding_date ? formatDate(item.first_proceeding_date, 'yyyy-MM-dd', 'en') : '',
          relief_amount_scst: item.relief_amount_scst === "NULL" ? '' : item.relief_amount_scst,
          relief_amount_exgratia: item.relief_amount_exgratia === "NULL" ? '' : item.relief_amount_exgratia,
          totalFirStageAmount:
            (item.relief_amount_scst && item.relief_amount_scst !== "NULL" ? Number(item.relief_amount_scst) : 0) +
            (item.relief_amount_exgratia && item.relief_amount_exgratia !== "NULL" ? Number(item.relief_amount_exgratia) : 0),
          days_since_first_relief: item.days_since_first_relief === "NULL" ? '' : item.days_since_first_relief,
          first_disbursement_date: item.first_disbursement_date ? formatDate(item.first_disbursement_date, 'yyyy-MM-dd', 'en') : '',

          second_proceeding_date: item.second_proceeding_date ? formatDate(item.second_proceeding_date, 'yyyy-MM-dd', 'en') : '',
          secondInstallmentReliefScst: item.secondInstallmentReliefScst === "NULL" ? '' : item.secondInstallmentReliefScst,
          secondInstallmentReliefExGratia: item.secondInstallmentReliefExGratia === "NULL" ? '' : item.secondInstallmentReliefExGratia,
          days_since_second_relief: item.days_since_second_relief === "NULL" ? '' : item.days_since_second_relief,
          second_disbursement_date: item.second_disbursement_date ? formatDate(item.second_disbursement_date, 'yyyy-MM-dd', 'en') : '',
          totalChargeSheetAmount:
            (item.secondInstallmentReliefScst && item.secondInstallmentReliefScst !== "NULL" ? Number(item.secondInstallmentReliefScst) : 0) +
            (item.secondInstallmentReliefExGratia && item.secondInstallmentReliefExGratia !== "NULL" ? Number(item.secondInstallmentReliefExGratia) : 0),

          trial_proceeding_date: item.trial_proceeding_date ? formatDate(item.trial_proceeding_date, 'yyyy-MM-dd', 'en') : '',
          trial_reliefScst: item.trial_reliefScst === "NULL" ? '' : item.trial_reliefScst,
          trial_reliefExGratia: item.trial_reliefExGratia === "NULL" ? '' : item.trial_reliefExGratia,
          days_since_trial_relief: item.days_since_trial_relief === "NULL" ? '' : item.days_since_trial_relief,
          trial_disbursement_date: item.trial_disbursement_date ? formatDate(item.trial_disbursement_date, 'yyyy-MM-dd', 'en') : '',
          totalTrialAmount:
            (item.trial_reliefScst && item.trial_reliefScst !== "NULL" ? Number(item.trial_reliefScst) : 0) +
            (item.trial_reliefExGratia && item.trial_reliefExGratia !== "NULL" ? Number(item.trial_reliefExGratia) : 0),

          report_reason: item.report_reason === "NULL" ? '' : item.report_reason,
          filter_status: item.status,
          fir_status : item.fir_status,
          fir_pending_days: item.fir_status === 'Relief Given' ? '-' : item.fir_pending_days,
          chargesheet_status:item.chargesheet_status,
          chargesheet_pending_days:item.chargesheet_status === 'Relief Given' ? '-' : item.chargesheet_pending_days,
          trial_status:item.trial_status,
          trial_pending_days:item.chargesheet_status === 'Relief Given' ? '-' : item.trial_pending_days,
          fir_proposal_status:item.fir_proposal_status,
          chargesheet_proposal_status:item.chargesheet_proposal_status,
          trail_proposal_status:item.trail_proposal_status ,
          created_by: item.created_by
        }));
       
        this.filteredData = [...this.reportData];
        console.log("filter",this.filteredData)
        this.loader = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loader = false;
        console.error('Error fetching reports:', error);
      }
    });
  }



paginatedData(): any[] {
  return this.filteredData;
}


  goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.fetchMonetaryReliefDetails(page); // ADD THIS
  }
}


  previousPage() {
    if (this.currentPage > 1) {
      this.fetchMonetaryReliefDetails(this.currentPage - 1);
    }
  }

  nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.fetchMonetaryReliefDetails(this.currentPage + 1); // FIXED
  }
}


  goToFirstPage() {
    if (this.currentPage !== 1) {
      this.fetchMonetaryReliefDetails(1);
    }
  }
  goToLastPage(): void {
    if (this.currentPage !== this.totalPages) {
      this.fetchMonetaryReliefDetails(this.totalPages);
    }
  }


  

  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  

  get ungroupedColumns(): DisplayedColumn[] {
  return this.displayedColumns.filter(col => col.group === null && col.visible);
}

get preGroupedColumns(): DisplayedColumn[] {
  return this.displayedColumns.filter(
    col => col.group === null && col.visible && !this.isPostGroupColumn(col)
  );
}

get postGroupedColumns(): DisplayedColumn[] {
  return this.displayedColumns.filter(
    col => col.group === null && col.visible && this.isPostGroupColumn(col)
  );
}

// Helper function to detect ungrouped columns that come after the grouped sections
isPostGroupColumn(col: DisplayedColumn): boolean {
  const finalStageIndex = this.displayedColumns.findIndex(c =>
    c.group === 'Trial' &&
    c.label === '3rd Stage Disbursement Date'
  );

  const colIndex = this.displayedColumns.indexOf(col);
  return colIndex > finalStageIndex;
}

onCityChange(event: any)
{

  const district = event.target.value;
   if (district) {
      this.firGetService.getPoliceStations(district).subscribe(
        (stations: string[]) => {
          this.policeStations = stations.map(station =>
            station.replace(/\s+/g, '-')); // Replace spaces with "-"
          this.cdr.detectChanges(); // Trigger UI update
        },
        (error) => {
          console.error('Error fetching police stations:', error);
        }
      );
    }
      // this.loadPoliceStations(district);
}


loadOptions() {
    this.firGetService.getOffences().subscribe(
      (offences: any) => {
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



loadPoliceRanges() {
    this.firService.getPoliceRanges().subscribe(
      (response: any) => {
        this.policeRanges = response;
      },
      (error: any) => {
        console.error('Error', 'Failed to load FIR data', 'error', error);
      }
    );
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


 loadRevenue_district() {
    this.firService.getRevenue_district().subscribe(
      (response: any) => {
        this.revenueDistricts = response;
      },
      (error: any) => {
        console.error('Error', 'Failed to load FIR data', 'error', error);
      }
    );
  }

  onCommunityChange(event: any): void {
    const selectedCommunity = event.target.value;
    console.log('Selected community:', selectedCommunity);
  
    if (selectedCommunity) {
      this.firGetService.getCastesByCommunity(selectedCommunity).subscribe(
        (res: string[]) => {
          console.log('API caste list:', res);
          this.casteOptions = [];
          res.forEach(caste => {
            this.casteOptions.push(caste);
          });
  
          // Optional: trigger change detection
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching castes:', error);
          Swal.fire('Error', 'Failed to load castes for the selected community.', 'error');
        }
      );
    } 
  }
  

  loadCommunities(): void {
      this.firGetService.getAllCommunities().subscribe(
        (communities: any) => {
          this.communitiesOptions = communities; // Populate community options
        },
        (error) => {
          console.error('Error loading communities:', error);
          Swal.fire('Error', 'Failed to load communities.', 'error');
        }
      );
    }
  
  SearchList() {
      this.applyFilters();
  }

  getFilterParams() {
  const params: any = {};

  const addParam = (key: string, value: any) => {
    if (value) params[key] = value;
  };

  addParam('search', this.searchText);
  addParam('policeCity', this.selectedDistrict);
  addParam('policeZone', this.selectedPoliceZone);
  addParam('revenueDistrict', this.selectedRevenue_district);
  addParam('community', this.selectedCommunity);
  addParam('caste', this.selectedCaste);
  addParam('sectionOfLaw', this.selectedSectionOfLaw);
  addParam('startDate', this.startDate);
  addParam('endDate', this.endDate);
  addParam('selectedStatus',this.selectedStatus.join(','));
  // addParam('statusOfCase', this.selectedStatusOfCase);
  // addParam('reliefStage', this.selectedStage);
  // addParam('reliefStatus', this.selectedReliefStatus);
  addParam('OffenceGroup', this.selectedOffenceGroup);
   if ((this.Parsed_UserInfo.access_type === 'District' && this.Parsed_UserInfo.role === 4)||(this.Parsed_UserInfo.role === 3)) {
    params.revenueDistrict = this.Parsed_UserInfo.district;
    console.log(" if");
  }
  return params;
}


  applyFilters() {
    this.fetchMonetaryReliefDetails(1);
  }

  
 

async onBtnExport(): Promise<void> {
  this.loader = true;
  try {
    const res: any = await firstValueFrom(
      this.monetaryReliefService.getMonetaryReliefDownload(this.getFilterParams())
    );

    const cleanValue = (value: any) =>
      value === null || value === undefined ? '' : value;

    const numberValue = (value: any) =>
      value === null || value === undefined || value === '' || value === 'NULL'
        ? 0
        : Number(value);

    // ✅ Exact headers from your sample file
    const exportHeaders = [
      'Sl No','Revenue District', 'Police City', 'Police Station','FIR Number', 'Register Date', 
      'Offence Committed', 'Victim Name', 'Victim Gender','Caste', 'Sub Caste', 
       'FIR Proposal Sent to DC','FIR Status', 'FIR Pending Days' ,'FIR Proposal Date', 'FIR As per the Act',
      'FIR  Ex - Gratia', 'Total FIR Stage',
      '1st Stage Disbursement Date','Chargesheet Proposal Sent to DC','Chargesheet Status', 'Chargesheet Pending Days','Chargesheet Proposal Date', 'Chargesheet As per the Act',
      'Chargesheet Ex - Gratia', 'Total Chargesheet Amount','2nd Disbursement Date', 
      'Trial Proposal Sent to DC','Trial Status', 'Trial Pending Days','Trial Proposal Date', 'Trial As per the Act', 'Trial  Ex - Gratia','Total Trial Amount',
      '3rd Disbursement Date','Report Reason'
    ];
    // console.log(res.data);
    // ✅ Map API response to row array (order matches headers)
    const exportData = res.data.map((item: any, index: number) => ([
      index + 1,
      item.revenue_district,
      item.police_city,
      item.police_station,
      cleanValue(item.fir_number),
      item.FIR_date ? formatDate(item.FIR_date, 'yyyy-MM-dd', 'en') : '',
      cleanValue(item.offence_committed || '').replace(/["\[\]]/g, ''),
      cleanValue(item.victim_name || ''),
      cleanValue(item.victim_gender || ''),
      item.community,
      item.caste,
      item.fir_proposal_status,
      item.fir_status,
      item.fir_pending_days,
      item.first_proceeding_date ? formatDate(item.first_proceeding_date, 'yyyy-MM-dd', 'en') : '',
      numberValue(item.relief_amount_scst),
      numberValue(item.relief_amount_exgratia),
      numberValue(item.relief_amount_scst) + numberValue(item.relief_amount_exgratia),
      item.first_disbursement_date ? formatDate(item.first_disbursement_date, 'yyyy-MM-dd', 'en') : '',
      item.chargesheet_proposal_status,
      item.chargesheet_status,
      item.chargesheet_pending_days,

      item.second_proceeding_date ? formatDate(item.second_proceeding_date, 'yyyy-MM-dd', 'en') : '',
      numberValue(item.secondInstallmentReliefScst),
      numberValue(item.secondInstallmentReliefExGratia),
      numberValue(item.secondInstallmentReliefScst) + numberValue(item.secondInstallmentReliefExGratia),
      item.second_disbursement_date ? formatDate(item.second_disbursement_date, 'yyyy-MM-dd', 'en') : '',
      
      item.trail_proposal_status,
      item.trial_status,
      item.trial_pending_days,
      
      item.trial_proceeding_date ? formatDate(item.trial_proceeding_date, 'yyyy-MM-dd', 'en') : '',
      numberValue(item.trial_reliefScst),
      numberValue(item.trial_reliefExGratia),
      numberValue(item.trial_reliefScst) + numberValue(item.trial_reliefExGratia),
      item.trial_disbursement_date ? formatDate(item.trial_disbursement_date, 'yyyy-MM-dd', 'en') : '',
      numberValue(item.trial_reliefScst) + numberValue(item.trial_reliefExGratia),

      
      // cleanValue(item.days_since_first_relief),
      // cleanValue(item.days_since_second_relief),
      // cleanValue(item.days_since_trial_relief),

      item.report_reason
    ]));
    // console.log(exportData);
    // ✅ Combine header + data
    const worksheetData = [exportHeaders, ...exportData];

    // ✅ Create worksheet & workbook
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monetary Reports');

    // ✅ Download file
    XLSX.writeFile(wb, 'Monetary-Reports.xlsx');

  } catch (error) {
    console.error('Error exporting report', error);
  } finally {
    this.loader = false;
  }
}

reliefStage(event: any) {
  this.selectedStage = event.target.value;

  // If user selects "FirQuashed,MF,SectionDeleted,Charge_Abated,Quashed"
  if (this.selectedStage === 'FirQuashed,MF,SectionDeleted,Charge_Abated,Quashed') {
    this.selectedReliefStatus = ''; // clear status
  }
}

openReasonModal(data: any) {
  console.log('Selected Data:', data);
  this.selectedData = data;
  this.pendingReason = data?.report_reason || '';
}

submitReason() {
  if (!this.pendingReason.trim()) {
    alert('Please enter a reason.');
    return;
  }

  const payload = {
    fir_id: this.selectedData.fir_id,
    category: 'monetary',
    reason_for_status: this.pendingReason,
    created_by: this.selectedData.created_by
  };

  console.log('Payload:', payload);

  this.monetaryReliefService.updateMonetaryReliefDetails(payload).subscribe({
    next: (response) => {
      console.log('API Response:', response);
      alert('Reason updated successfully!');

      // ✅ Update the same row in table data
      const updatedRow = this.filteredData.find(
        (item: any) => item.fir_id === this.selectedData.fir_id
      );
      if (updatedRow) {
        updatedRow.report_reason = this.pendingReason;
      }

      // ✅ Close the modal after success
      this.modalService.dismissAll();

      // ✅ Trigger UI refresh if using ChangeDetectorRef
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error updating reason:', error);
      alert('Failed to update reason.');
    }
  });
}

open(content: TemplateRef<any>) {
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    (result) => {
      this.closeResult.set(`Closed with: ${result}`);
    },
    (reason) => {
      this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
    },
  );
}
private getDismissReason(reason: any): string {
  switch (reason) {
    case ModalDismissReasons.ESC:
      return 'by pressing ESC';
    case ModalDismissReasons.BACKDROP_CLICK:
      return 'by clicking on a backdrop';
    default:
      return `with: ${reason}`;
  }
}

}

 interface DisplayedColumn {
  label: string;
  field: string;
  group: any;
  sortable: boolean;
  visible: boolean;
  sortDirection: 'asc' | 'desc' | null;
}