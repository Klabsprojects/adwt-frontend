import { Component, OnInit } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonetaryReliefService } from 'src/app/services/monetary-relief.service';
import { ReportsCommonService } from 'src/app/services/reports-common.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DashboardService } from 'src/app/services/dashboard.service';


@Component({
  selector: 'app-monetary-relief',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    DragDropModule,
    MatProgressSpinnerModule
  ],
  providers: [FirListTestService], // Provide the service here
  templateUrl: './monetary-relief.component.html',
  styleUrls: ['./monetary-relief.component.scss'],
})
export class MonetaryReliefComponent implements OnInit {
  // Variable Declarations
  searchText: string = '';
  reportData: Array<any> = [];
  filteredData: Array<any> = [];
  page: number = 1;
  itemsPerPage: number = 10;
  isReliefLoading: boolean = true;
  loading: boolean = false;
  // Filters
  selectedDistrict: string = '';
  selectedColumns: string[] = [];
  selectedNatureOfOffence: string = '';
  selectedStatusOfCase: string = '';
  selectedStatusOfRelief: string = '';
  districts: string[] = [];
  naturesOfOffence: string[] = [];
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

  selectedStatus:string='';
  selectedDistricts:string='';
  selectedCommunity:string='';
  selectedCaste:string='';
  selectedZone:string='';
  selectedPoliceCity:string=''
  selectedFromDate:any="";
  selectedToDate:any="";

  // Visible Columns Management
  // displayedColumns: {
  //   label: string;
  //   field: string;
  //   sortable: boolean;
  //   visible: boolean;
  //   sortDirection: 'asc' | 'desc' | null;
  // }[] = [
  //   {
  //     label: 'Sl. No.',
  //     field: 'sl_no',
  //     sortable: false,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //   {
  //     label: 'FIR No.',
  //     field: 'fir_id',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //    {
  //     label: 'Revenue District',
  //     field: 'revenue_district',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //    {
  //     label: 'Police City',
  //     field: 'police_city',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //     {
  //     label: 'Police Zone',
  //     field: 'police_zone',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //     {
  //     label: 'Community',
  //     field: 'community',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //     {
  //     label: 'Caste',
  //     field: 'caste',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //   {
  //     label: 'Police Station Name',
  //     field: 'police_station',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //     {
  //     label: 'Reporting Date',
  //     field: 'date_of_registration',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //   {
  //     label: 'Nature of Offence',
  //     field: 'nature_of_offence',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //   {
  //     label: 'Data Entry Status',
  //     field: 'status',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //   {
  //     label: 'Case Status',
  //     field: 'case_status',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //   {
  //     label: 'Relief Status',
  //     field: 'relief_status',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //   {
  //     label: 'Victim Name',
  //     field: 'victim_name',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //   {
  //     label: 'Reason for Status (Previous Month)',
  //     field: 'reason_previous_month',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  //   {
  //     label: 'Reason for Status (Current Month)',
  //     field: 'reason_current_month',
  //     sortable: true,
  //     visible: true,
  //     sortDirection: null,
  //   },
  // ];

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
    label: 'District',
    field: 'district',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Police Division',
    field: 'total_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Police Station',
    field: 'total_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'FIR Number',
    field: 'total_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'FIR Date',
    field: 'total_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Nature of Offence',
    field: 'total_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Victim Name',
    field: 'total_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Gender',
    field: 'total_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Caste',
    field: 'total_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Sub Caste',
    field: 'total_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Date of proposal',
    field: 'total_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Relief Stage',
    field: 'total_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Relief Status',
    field: 'total_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  
  // ✅ Group: CHARGESHEET
  {
    label: 'Proposal Date',
    field: 'cs_proposal_sent',
    group: 'Chargesheet Stage Relief (2nd Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'As per the Act',
    field: 'cs_relief_given',
    group: 'Chargesheet Stage Relief (2nd Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Ex-Gratia',
    field: 'cs_relief_pending',
    group: 'Chargesheet Stage Relief (2nd Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Total - Chargesheet Stage',
    field: 'cs_relief_pending',
    group: 'Chargesheet Stage Relief (2nd Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
    {
    label: '2nd Stage Disbursement Date',
    field: 'cs_relief_pending',
    group: 'Chargesheet Stage Relief (2nd Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  // ✅ Group: FIR
  {
    label: 'Proposal Date',
    field: 'fir_proposal_sent',
    group: 'FIR Stage Relief (1st Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'As per the Act',
    field: 'fir_relief_given',
    group: 'FIR Stage Relief (1st Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Ex-Gratia',
    field: 'fir_relief_pending',
    group: 'FIR Stage Relief (1st Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Total - FIR Stage',
    field: 'fir_relief_pending',
    group: 'FIR Stage Relief (1st Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: '1st Stage Disbursement Date',
    field: 'fir_relief_pending',
    group: 'FIR Stage Relief (1st Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  // ✅ Group: TRIAL Stage (spelling corrected from "TRAIL")
  {
    label: 'Proposal Date',
    field: 'cs_proposal_sent',
    group: 'Final Stage Relief (3rd Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'As per the Act',
    field: 'cs_relief_given',
    group: 'Final Stage Relief (3rd Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Ex-Gratia',
    field: 'cs_relief_pending',
    group: 'Final Stage Relief (3rd Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Total - Final Stage',
    field: 'cs_relief_pending',
    group: 'Final Stage Relief (3rd Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: '3rd Stage Disbursement Date',
    field: 'cs_relief_pending',
    group: 'Final Stage Relief (3rd Stage)',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
// ✅ Ungrouped "No. of Days since" columns
{
  label: 'No. of Days since 1st Stage Relief',
  field: 'days_since_1st',
  group: null,
  sortable: true,
  visible: true,
  sortDirection: null,
},
{
  label: 'No. of Days since 2nd latest Relief',
  field: 'days_since_2nd',
  group: null,
  sortable: true,
  visible: true,
  sortDirection: null,
},
{
  label: 'No. of Days since 3rd latest Relief',
  field: 'days_since_3rd',
  group: null,
  sortable: true,
  visible: true,
  sortDirection: null,
},
{
  label: 'Reason for Pending - Previous Month',
  field: 'days_since_3rd',
  group: null,
  sortable: true,
  visible: true,
  sortDirection: null,
},
{
  label: 'Reason for Pending - Current Month',
  field: 'days_since_3rd',
  group: null,
  sortable: true,
  visible: true,
  sortDirection: null,
},

 
];



  selectedCaseStatus: string = '';
  selectedReliefStatus: string = '';
  currentSortField: string = '';
  isAscending: boolean = true;

  constructor(
    // private firService: FirListTestService,
    private cdr: ChangeDetectorRef,
    private reportsCommonService: ReportsCommonService,
    private monetaryReliefService: MonetaryReliefService,
    private router: Router,
     private dashboardService: DashboardService
  ) {
    this.loader = true;
  }

  groupedBySection: { [group: string]: DisplayedColumn[] } = {};
  groupOrder = ['FIR Stage Relief (1st Stage)', 'Chargesheet Stage Relief (2nd Stage)', 'Final Stage Relief (3rd Stage)'];

  // Initializes component data and fetches necessary information on component load.
  ngOnInit(): void {
    this.groupedBySection = this.groupOrder.reduce((acc, groupName) => {
    const cols = this.displayedColumns.filter(
      col => col.group === groupName && col.visible
    );
  if (cols.length > 0) {
    acc[groupName] = cols;
  }
  return acc;
}, {} as { [group: string]: DisplayedColumn[] });
    this.reportsCommonService
      .getAllData()
      .subscribe(({ districts, offences }) => {
        this.districts = districts;
        this.naturesOfOffence = offences;
        this.fetchMonetaryReliefDetails();
      });
      this.getDropdowns();
    this.filteredData = [...this.reportData];
    this.selectedColumns = this.displayedColumns.map((column) => column.field);
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
    this.updateColumnVisibility();
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

  // Pagination controls
  goToPage(page: number): void {
    this.page = page;
  }

  // Decreases the current page number if it is greater than 1.
  previousPage(): void {
    if (this.page > 1) this.page--;
  }

  // Increases the current page number if it is less than the total number of pages.
  nextPage(): void {
    if (this.page < this.totalPages()) this.page++;
  }

  // Calculates the total number of pages based on filtered data and items per page.
  totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  // Generates an array of page numbers to display for pagination.
  totalPagesArray(): number[] {
    const total = this.totalPages();
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.page - 2); // Ensure at least 5 pages are shown
    // Adjust if near the end
    if (startPage + maxPagesToShow - 1 > total) {
      startPage = Math.max(1, total - maxPagesToShow + 1);
    }
    return Array.from({ length: Math.min(maxPagesToShow, total) }, (_, i) => startPage + i);
  }  

  // Returns the subset of filtered data for the current page.
  paginatedData(): any[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Download Reports
  async onBtnExport(): Promise<void> {
    await this.reportsCommonService.exportToExcel(
      this.filteredData,
      this.displayedColumns,
      'Monetary-Reports'
    );
  }

    clearfilter(){
      this.searchText = '';
      this.selectedDistrict = '';
      this.selectedStatus='';
      this.selectedDistricts='';
      this.selectedCommunity='';
      this.selectedCaste='';
      this.selectedZone=''; 
      this.selectedPoliceCity='';
      this.selectedFromDate='';
      this.selectedToDate = '';
      this.filteredData = [...this.reportData]; 
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


  applyFilters() {
  this.filteredData = this.reportData.filter(item => {

    if (this.searchText && this.searchText.trim() !== '' && 
    item.fir_number.toLowerCase() !== this.searchText.toLowerCase().trim()) {
    return false;
    }

    // District filter
    if (this.selectedDistrict && this.selectedDistrict !== '' && 
        item.revenue_district !== this.selectedDistrict) {
      return false;
    }

    // Police City filter
    if (this.selectedPoliceCity && this.selectedPoliceCity !== '' && 
        item.police_city !== this.selectedPoliceCity) {
      return false;
    }

    // Police Zone filter
    if (this.selectedZone && this.selectedZone !== '' && 
        item.police_zone !== this.selectedZone) {
      return false;
    }

    // Community filter
    if (this.selectedCommunity && this.selectedCommunity !== '' && 
        item.community !== this.selectedCommunity) {
      return false;
    }

    // Caste filter
    if (this.selectedCaste && this.selectedCaste !== '' && 
        item.caste !== this.selectedCaste) {
      return false;
    }

    // Status filter (UI: status <= 5, PT: status > 5)
    if (this.selectedStatus && this.selectedStatus !== '') {
      if (this.selectedStatus === 'UI' && item.filter_status > 5) {
        return false;
      }
      if (this.selectedStatus === 'PT' && item.filter_status <= 5) {
        return false;
      }
    }

    // Date range filter
    if (this.selectedFromDate || this.selectedToDate) {
    const registrationDate = new Date(item.date_of_registration);
    
    if (this.selectedFromDate && !this.selectedToDate) {
      const fromDate = new Date(this.selectedFromDate);
      if (registrationDate < fromDate) {
        return false;
      }
    }
    
    if (this.selectedToDate && !this.selectedFromDate) {
      const toDate = new Date(this.selectedToDate);
      if (registrationDate > toDate) {
        return false;
      }
    }

    if (this.selectedToDate && this.selectedFromDate) {
      const fromDate = new Date(this.selectedFromDate);
      const toDate = new Date(this.selectedToDate);
      if (registrationDate < fromDate || registrationDate > toDate) {
        return false;
      }
    }
  }

    return true;
  });
}


  fetchMonetaryReliefDetails(): void {
    this.loader = true;
    this.monetaryReliefService.getMonetaryReliefDetails().subscribe({
      next: (response) => {
        //console.log('Monetary Reliefs:', response.data); // Debugging
        // Transform API response to match frontend structure
        this.reportData = response.data.map((item: { 
          fir_number: any; police_city: any; police_station: any; status: number;
           offence_committed: any; victim_name: any; previous_month_reason_for_status: any;
            current_month_reason_for_status: any; relief_status: any;
            revenue_district : any; police_zone : any; community : any; caste : any; date_of_registration : any;
          }, index: number) => ({
          sl_no: index + 1,
          fir_id: item.fir_number,
          fir_number: item.fir_number === "NULL" || !item.fir_number ? '' : item.fir_number,
          police_city:  item.police_city,
          police_station: item.police_station,
          status: this.reportsCommonService.caseStatusOptions.find(option => option.value === item.status)?.label || '',
          nature_of_offence: (item.offence_committed === "NULL" ? '' : (item.offence_committed || '').replace(/"/g, '')), 
          case_status: this.getStatusTextUIPT(item.status) || '',
          relief_status: this.reportsCommonService.reliefStatusOptions.find(option => option.value === item.relief_status)?.label || '',
          victim_name: (item.victim_name === "NULL" ? '' : (item.victim_name || '')),
          reason_previous_month: item.previous_month_reason_for_status || '',
          reason_current_month: item.current_month_reason_for_status || '',
          revenue_district : item.revenue_district,
          police_zone : item.police_zone,
          community : item.community,
          caste : item.caste,
          date_of_registration : item.date_of_registration,
          filter_status : item.status
        }));
        // Update filteredData to reflect the API data
        this.filteredData = [...this.reportData]; 
        this.loader = false;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (error) => {
        this.loader = false;
        console.error('Error fetching reports:', error);
      }
    });
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
    c.group === 'Final Stage Relief (3rd Stage)' &&
    c.label === '3rd Stage Disbursement Date'
  );

  const colIndex = this.displayedColumns.indexOf(col);
  return colIndex > finalStageIndex;
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