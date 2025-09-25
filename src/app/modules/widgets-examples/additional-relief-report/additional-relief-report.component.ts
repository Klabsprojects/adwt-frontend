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
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsCommonService } from 'src/app/services/reports-common.service';
import { AdditionalReportService } from 'src/app/services/additional-report.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AdditionalAbstractReportService } from 'src/app/services/additional-abstract-service.module';

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
  Parsed_UserInfo:any;
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
    label: 'As Per Act (Before 2016 / After 2016)',
    field: 'asperact',
    group: null,
    sortable: false,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Revenue District',
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
    label: 'FIR No.',
    field: 'fir_number',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'FIR Date',
    field: 'FIR_date',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Victim Name',
    field: 'victimName',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Gender',
    field: 'gender',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Community',
    field: 'community',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Caste',
    field: 'caste',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
// ✅ Group: FIR
  {
    label: 'Status ',
    field: 'EmpStatus',
    group: 'Employment',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Job given date',
    field: 'JobGivendate',
    group: 'Employment',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Relationship of beneficiary to the victim',
    field: 'Employmentrelationship',
    group: 'Employment',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Name of the Department',
    field: 'department_name',
    group: 'Employment',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Designation',
    field: 'designation',
    group: 'Employment',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  
  // ✅ Group: Pension  
  {
    label: 'Pension Status',
    field: 'PensionStatus',
    group: 'Pension',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Pension given date',
    field: 'PensionGivendate',
    group: 'Pension',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Relationship of beneficiary to the victim',
    field: 'Pensionrelationship',
    group: 'Pension',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  
  // ✅ Group: House Site Patta
  {
    label: 'Patta Status ',
    field: 'PattaStatus',
    group: 'House Site Patta',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Patta given date ',
    field: 'PattaGivendate',
    group: 'House Site Patta',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Education Concession Status',
    field: 'EducationStatus',
    group: 'Education Concession',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Number of Children studying in School/ College',
    field: 'Schoolorcollege',
    group: 'Education Concession',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Scholarship given date  ',
    field: 'EducationGivendate',
    group: 'Education Concession',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
];

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
    private additionalReportService: AdditionalAbstractReportService,
    private router: Router,
    private dashboardService: DashboardService
  ) {
    this.loader = true;
  }

  groupedBySection: { [group: string]: DisplayedColumn[] } = {};
  groupOrder = ['Employment', 'Pension', 'House Site Patta','Education Concession'];

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
    // console.log(this.filteredData.slice(startIndex, startIndex + this.itemsPerPage));
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Download Reports
  async onBtnExport(): Promise<void> {
    await this.reportsCommonService.exportToExcel(
      this.filteredData,
      this.displayedColumns,
      'Additional-Relief-Reports'
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
  let districtParam = '';
     if ((this.Parsed_UserInfo.access_type === 'District' && this.Parsed_UserInfo.role === 4)||(this.Parsed_UserInfo.role === 3)) {
    districtParam = this.Parsed_UserInfo.district;
    this.selectedDistrict = districtParam;
  }

    this.loader = true;
    this.additionalReportService.getAdditionalRelief(districtParam).subscribe({
      next: (response) => {
        this.reportData = response.data.map((item:any,index: number) => ({
          sl_no: index + 1,
          asperact: item.asperact,
          revenue_district: item.revenue_district,
          police_city: item.police_city,
          police_station:item.police_station,
          fir_number: item.fir_number === "NULL" || !item.fir_number ? '' : item.fir_number,
          FIR_date:formatDate(item.FIR_date, 'yyyy-MM-dd', 'en'),
          victimName: item.victimName === "NULL" ? '' : item.victimName,
          gender: item.gender === "NULL" ? '' : item.gender,
          community: item.community === "NULL" ? '' : item.community,
          caste: item.caste === "NULL" ? '' : item.caste,
         
          EmpStatus:item.EmpStatus,
          JobGivendate:item.JobGivendate,
          Employmentrelationship:item.Employmentrelationship,
          department_name:item.department_name,
          designation:item.designation,

          PensionStatus:item.PensionStatus,
          PensionGivendate:item.PensionGivendate ? formatDate(item.PensionGivendate,'yyyy-MM-dd', 'en') : '',
         Pensionrelationship: Array.isArray(item.Pensionrelationship)
  ? item.Pensionrelationship.length === 1
      ? item.Pensionrelationship[0]   // single value → just string
      : item.Pensionrelationship.join(', ')  // multiple → comma separated
  : item.Pensionrelationship,



          PattaStatus:item.PattaStatus,
          PattaGivendate:item.PattaGivendate ? formatDate(item.PattaGivendate,'yyyy-MM-dd','en') : '',

          EducationStatus:item.EducationStatus,
          Schoolorcollege:item.Schoolorcollege,
          EducationGivendate:item.EducationGivendate ? formatDate(item.EducationGivendate,'yyyy-MM-dd','en') : '',
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
}

interface DisplayedColumn {
  label: string;
  field: string;
  group: any;
  sortable: boolean;
  visible: boolean;
  sortDirection: 'asc' | 'desc' | null;
}