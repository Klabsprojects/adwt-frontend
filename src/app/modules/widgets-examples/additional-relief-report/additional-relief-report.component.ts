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
import { ReportsCommonService } from 'src/app/services/reports-common.service';
import { AdditionalReportService } from 'src/app/services/additional-report.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-additional-relief-report',
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
  providers: [FirListTestService],
  templateUrl: './additional-relief-report.component.html',
  styleUrl: './additional-relief-report.component.scss',
})
export class AdditionalReliefReportComponent implements OnInit {
  // Variable Declarations
  searchText: string = '';
  reportData: Array<any> = [];
  filteredData: Array<any> = [];
  page: number = 1;
  selectedtypeOfAdditionalReleif: string = '';
  itemsPerPage: number = 10;
  isReliefLoading: boolean = true;
  loading: boolean = false;
  // Filters
  selectedDistrict: string = '';
  selectedColumns: string[] = [];
  selectedNatureOfOffence: string = '';
  selectedStatusOfCase: string = '';
  selectedStatusOfRelief: string = '';
  // selectedtypeOfAdditionalReleif: string = '';
  // Filter options
   loader: boolean = false;
  districts: string[] = [];
  naturesOfOffence: string[] = [];
  statusesOfCase: string[] = ['Just Starting', 'Pending', 'Completed'];
  statusesOfRelief: string[] = [
    'FIR Stage',
    'ChargeSheet Stage',
    'Trial Stage',
  ];
  typeOfAdditionalReleif: string[] = [
    'Employment',
    'Pension',
    'House Site patta',
    'Education Concession',
  ];
  // Displayed Columns
  displayedColumns: {
    label: string;
    field: string;
    sortable: boolean;
    visible: boolean;
    sortDirection: 'asc' | 'desc' | null;
  }[] = [];
  // Default Columns
  defaultColumns: {
    label: string;
    field: string;
    sortable: boolean;
    visible: boolean;
    sortDirection: 'asc' | 'desc' | null;
  }[] = [
    {
      label: 'Sl. No.',
      field: 'sl_no',
      sortable: false,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Revenue District',
      field: 'revenue_district',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
      {
      label: 'Police City',
      field: 'police_city',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
      {
      label: 'Police Zone',
      field: 'police_zone',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
      {
      label: 'Community',
      field: 'community',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
      {
      label: 'Caste',
      field: 'caste',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
      {
      label: 'Data Entry Status',
      field: 'status',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
     {
      label: 'Case Status',
      field: 'case_status',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
      {
      label: 'Reporting Date',
      field: 'date_of_registration',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Police Station Name',
      field: 'police_station_name',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'FIR Number',
      field: 'fir_number',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Victim Name',
      field: 'victim_name',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Age',
      field: 'age',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Gender',
      field: 'gender',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Nature of Offence',
      field: 'nature_of_offence',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Section of the PoA Act invoked for the offence',
      field: 'poa_section',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
  ];
  // Column Configurations for Additional Relief Types
  columnConfigs = {
    Employment: [
      {
        label: 'Status',
        field: 'status',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label: 'Reason for Job pending - Previous Month',
        field: 'reason_job_pending_previous',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label:
          'If "OTHERS" option is selected enter valid reasons - Previous Month',
        field: 'others_reason_previous',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label: 'Reason for Job pending - Current Month',
        field: 'reason_job_pending_current',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label:
          'If "OTHERS" option is selected enter valid reasons - Current Month',
        field: 'others_reason_current',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
    ],
    Pension: [
      {
        label: 'Status',
        field: 'status',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label: 'Reason for Pension pending - Previous Month',
        field: 'reason_pension_pending_previous',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label:
          'If "OTHERS" option is selected enter the valid reason - Previous Month',
        field: 'others_reason_previous',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label: 'Reason for Pension pending - Current Month',
        field: 'reason_pension_pending_current',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label:
          'If "OTHERS" option is selected enter the valid reason - Current Month',
        field: 'others_reason_current',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
    ],
    HouseSitePatta: [
      {
        label: 'Status',
        field: 'status',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label: 'Reason for Patta pending - Previous Month',
        field: 'reason_patta_pending_previous',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label:
          'If "OTHERS" option is selected enter the valid reason - Previous Month',
        field: 'others_reason_previous',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label: 'Reason for Patta pending - Current Month',
        field: 'reason_patta_pending_current',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label:
          'If "OTHERS" option is selected enter the valid reason - Current Month',
        field: 'others_reason_current',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
    ],
    EducationConcession: [
      {
        label: 'Status of the Current Month',
        field: 'status',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label: 'Reason for Education concession  pending - Previous Month',
        field: 'reason_patta_pending_previous',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label:
          'If "OTHERS" option is selected enter the valid reason - Previous Month',
        field: 'others_reason_previous',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label: 'Reason for Education Concession pending - Current Month',
        field: 'reason_patta_pending_current',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
      {
        label:
          'If "OTHERS" option is selected enter the valid reason - Current Month',
        field: 'others_reason_current',
        sortable: true,
        visible: true,
        sortDirection: null,
      },
    ],
  };
  currentSortField: string = '';
  isAscending: boolean = true;

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

  constructor(
    // private firService: FirListTestService,
    private cdr: ChangeDetectorRef,
    private reportsCommonService: ReportsCommonService,
    private additionalReportService: AdditionalReportService,
    private router: Router,
    private dashboardService: DashboardService
  ) {
    this.loader = true;
  }

  // Initializes component data and fetches necessary information on component load.
  ngOnInit(): void {
    this.displayedColumns = [...this.defaultColumns]; // Initialize default columns
    this.reportsCommonService
      .getAllData()
      .subscribe(({ districts, offences }) => {
        this.districts = districts;
        this.naturesOfOffence = offences;
        this.fetchAdditionalReports();
        this.getDropdowns();
      });
    this.filteredData = [...this.reportData];
    this.selectedColumns = this.displayedColumns.map((column) => column.field);
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
  
  // Updates the displayed columns based on the selected type of additional relief.
  updateDisplayedColumns(): void {
    console.log('Selected Type:', this.selectedtypeOfAdditionalReleif); // Debugging log
    switch (this.selectedtypeOfAdditionalReleif) {
      case 'Employment':
        this.displayedColumns = [
          ...this.defaultColumns,
          ...this.columnConfigs.Employment,
        ];
        break;
      case 'Pension':
        this.displayedColumns = [
          ...this.defaultColumns,
          ...this.columnConfigs.Pension,
        ];
        break;
      case 'House Site patta':
        this.displayedColumns = [
          ...this.defaultColumns,
          ...this.columnConfigs.HouseSitePatta,
        ];
        break;
      case 'Education Concession':
        this.displayedColumns = [
          ...this.defaultColumns,
          ...this.columnConfigs.EducationConcession,
        ];
        break;
      default:
        this.displayedColumns = [...this.defaultColumns]; // Fallback to default columns
        break;
    }
    // Set all columns to visible
    this.displayedColumns.forEach((column) => {
      column.visible = true; // Set each column's visible property to true
    });
    // Update selectedColumns based on displayedColumns
    this.selectedColumns = this.displayedColumns
      .filter((column) => column.visible)
      .map((column) => column.field);
    console.log('Updated Columns:', this.displayedColumns); // Debugging log
  }

  // Updates the visibility of columns based on user-selected columns.
  updateColumnVisibility(): void {
    this.displayedColumns.forEach((column) => {
      column.visible = this.selectedColumns.includes(column.field);
    });
  }

  // Handles changes in column selection and updates column visibility.
  onColumnSelectionChange(): void {
    this.updateColumnVisibility();
  }



  // Applies filters, assigns serial numbers, and resets pagination
  // applyFilters(): void {
  //   this.filteredData = this.reportsCommonService.applyFilters(
  //     this.reportData,
  //     this.searchText,
  //     this.selectedDistrict,
  //     this.selectedNatureOfOffence,
  //     this.selectedStatusOfCase,
  //     this.selectedStatusOfRelief,
  //     'revenue_district',
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
    console.log(
      'this.filteredData.slice(startIndex, startIndex + this.itemsPerPage)'
    );
    console.log(
      this.filteredData.slice(startIndex, startIndex + this.itemsPerPage)
    );
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Download Reports
  async onBtnExport(): Promise<void> {
    await this.reportsCommonService.exportToExcel(
      this.filteredData,
      this.displayedColumns,
      'Additional-Reports'
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

    // Search filter for FIR number
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

 fetchAdditionalReports(): void {
    this.loader = true;
    this.additionalReportService.getAdditionalReportDetails().subscribe({
      next: (response) => {
        //console.log('Additional Reports:', response.data); // Debugging
        // Transform API response to match frontend structure
        this.reportData = response.data.map((item: { 
          revenue_district: any; police_station: any; fir_number: any; victim_name: any; 
          victim_age: any; victim_gender: any; status: number; 
          offence_committed: string; scst_sections: any; 
           police_zone : any; community : any; caste : any; date_of_registration : any; police_city : any;
        }, index: number) => ({
          sl_no: index + 1,
          revenue_district: item.revenue_district,
          police_station_name: item.police_station,
          fir_number: item.fir_number === "NULL" || !item.fir_number ? '' : item.fir_number, // Fix this line
          victim_name: item.victim_name === "NULL" ? '' : item.victim_name,
          age: item.victim_age === "NULL" ? '' : item.victim_age,
          gender: item.victim_gender === "NULL" ? '' : item.victim_gender,
          status: this.reportsCommonService.caseStatusOptions.find(option => option.value === item.status)?.label || '',
          nature_of_offence: (item.offence_committed === "NULL" ? '' : (item.offence_committed || '').replace(/"/g, '')), 
          poa_section: (item.scst_sections || '').replace(/"/g, ''), // Remove double quotes
          police_zone : item.police_zone,
          community : item.community,
          caste : item.caste,
          date_of_registration : item.date_of_registration,
          filter_status : item.status,
          police_city:  item.police_city,
          case_status: this.getStatusTextUIPT(item.status) || '',
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


}
