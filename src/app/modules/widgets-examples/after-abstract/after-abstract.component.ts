import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { AdditionalAbstractReportService } from 'src/app/services/additional-abstract-service.module';
import { AdditionalReportService } from 'src/app/services/additional-report.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import { ReportsCommonService } from 'src/app/services/reports-common.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-after-abstract',
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
  providers:[FirListTestService],
  templateUrl: './after-abstract.component.html',
  styleUrl: './after-abstract.component.scss'
})
export class AfterAbstractComponent {
// Variable Declarations
    searchText: string = '';
    reportData: Array<any> = [];
    filteredData: Array<any> = [];
    page: number = 1;
    itemsPerPage: number = 38;
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
    Parsed_UserInfo:any;
  
  displayedColumns: DisplayedColumn[] = [
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
      field: 'revenue_district',
      group: null,
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Total Case',
      field: 'total_cases',
      group: null,
      sortable: true,
      visible: true,
      sortDirection: null,
    },
  {
    label: 'Given',
    field: 'employment_given',
    group: 'Employment',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Pending',
    field: 'employment_pending',
    group: 'Employment',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Ineligible',
    field: 'employment_notApplicable',
    group: 'Employment',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Given',
    field: 'pension_given',
    group: 'Pension',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Pending',
    field: 'pension_pending',
    group: 'Pension',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Ineligible',
    field: 'pension_notApplicable',
    group: 'Pension',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Given',
    field: 'patta_given',
    group: 'House Site Patta',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Pending',
    field: 'patta_pending',
    group: 'House Site Patta',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Ineligible',
    field: 'patta_notApplicable',
    group: 'House Site Patta',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Given',
    field: 'education_given',
    group: 'Education Concession',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Pending',
    field: 'education_pending',
    group: 'Education Concession',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Ineligible',
    field: 'education_notApplicable',
    group: 'Education Concession',
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
      private additionalAbstractService: AdditionalAbstractReportService,
      private router: Router,
       private dashboardService: DashboardService
    ) {
      this.loader = true;
    }
  
  


    groupedBySection: { [group: string]: DisplayedColumn[] } = {};
    groupOrder = ['Employment','Pension','House Site Patta','Education Concession'];
  
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
          this.fetchAfterAbstract();
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
    // async onBtnExport(): Promise<void> {
    //   await this.reportsCommonService.exportToExcel(
    //     this.filteredData,
    //     this.displayedColumns,
    //     'After-Abstract-Reports'
    //   );
    // }

onBtnExport(): void {
  const headers = [
  [
    'Sl. No.', 'District', 'Total Cases', 
    'Employment', '','',       
    'Pension', '','',          
    'House Site Patta', '','', 
    'Education Concession', '','', 
  ],
  [
    '', '', '', 
    'Given', 'Pending','Ineligible',
    'Given', 'Pending','Ineligible',
    'Given', 'Pending','Ineligible',
    'Given', 'Pending','Ineligible',
  ]
];


  const data = this.filteredData.map((item, index) => [
    index + 1,
    item.revenue_district,
    item.total_cases,
    item.employment_given,
    item.employment_pending,
    item.employment_notApplicable,
    item.pension_given,
    item.pension_pending,
    item.pension_notApplicable,
    item.patta_given,
    item.patta_pending,
    item.patta_notApplicable,
    item.education_given,
    item.education_pending,
    item.education_notApplicable,
  ]);

  const totalRow = [
      '',
      'Total',
      this.sumByKey('total_cases'),
      this.sumByKey('employment_given'),
      this.sumByKey('employment_pending'),
      this.sumByKey('employment_notApplicable'),
      this.sumByKey('pension_given'),
      this.sumByKey('pension_pending'),
      this.sumByKey('pension_notApplicable'),
      this.sumByKey('patta_given'),
      this.sumByKey('patta_pending'),
      this.sumByKey('patta_notApplicable'),
      this.sumByKey('education_given'),
      this.sumByKey('education_pending'),
      this.sumByKey('education_notApplicable')
    ];
  
    const aoa = [...headers, ...data, totalRow];
    const worksheet = XLSX.utils.aoa_to_sheet(aoa);

  console.log(data);

  // Correct merges based on headers
 worksheet['!merges'] = [
  { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Sl. No.
  { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // District
  { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Total Cases

  { s: { r: 0, c: 3 }, e: { r: 0, c: 5 } }, // Employment (Given, Pending, Ineligible)
  { s: { r: 0, c: 6 }, e: { r: 0, c: 8 } }, // Pension (Given, Pending, Ineligible)
  { s: { r: 0, c: 9 }, e: { r: 0, c: 11 } }, // House Site Patta (Given, Pending, Ineligible)
  { s: { r: 0, c: 12 }, e: { r: 0, c: 14 } }, // Education Concession (Given, Pending, Ineligible)
];

  const workbook: XLSX.WorkBook = {
    Sheets: { 'After Abstract': worksheet },
    SheetNames: ['After Abstract']
  };

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, 'after_abstract');
}

sumByKey(key: string): number {
  return this.filteredData.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
}

saveAsExcelFile(buffer: any, filename: string): void {
  const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
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
        // this.filteredData = [...this.reportData]; 
        this.fetchAfterAbstract();
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

  getFilterParams() {
  const params: any = {};

  const addParam = (key: string, value: any) => {
    params[key] = value ?? '';
  };

  addParam('district', this.selectedDistrict || '');
  addParam('community', this.selectedCommunity || '');
  addParam('caste', this.selectedCaste || '');
  addParam('police_city', this.selectedPoliceCity || '');
  addParam('police_zone', this.selectedZone || '');
  addParam('Filter_From_Date', this.selectedFromDate || '');
  addParam('Filter_To_Date', this.selectedToDate || '');
  addParam('Status_Of_Case', this.selectedStatus || '');

  return params;
}


  applyFilters() {
    // If user is district-level, lock district param
    let districtParam = '';
      if ((this.Parsed_UserInfo.access_type === 'District' && this.Parsed_UserInfo.role === 4)||(this.Parsed_UserInfo.role === 3)) {
        districtParam = this.Parsed_UserInfo.district;
        this.selectedDistrict = districtParam;
      }
      this.loader = true;
      const payload = this.getFilterParams(); // 👈 build payload from current filters
  console.log('Payload sent to API:', payload);

  this.loader = true;
      this.additionalAbstractService.getAfterAbstract(payload).subscribe({
        next: (response) => {
          console.log('Abstract:', response.data); // Debugging
          // Transform API response to match frontend structure
          this.reportData = response.data
          .filter((item: any) => item.revenue_district && item.revenue_district.trim() !== '')
          .map((item: any, index: number) => ({
            sl_no: index + 1,
            revenue_district: item.revenue_district,
            total_cases:item.total_cases,
            employment_given: item.employment_given,
            employment_pending: item.employment_pending,
            employment_notApplicable: item.employment_notApplicable,
            pension_given: item.pension_given,
            pension_pending: item.pension_pending,
            pension_notApplicable: item.pension_notApplicable,
            patta_given: item.patta_given,
            patta_pending: item.patta_pending,
            patta_notApplicable: item.patta_notApplicable,
            education_given: item.education_given,
            education_pending:item.education_pending,
            education_notApplicable: item.education_notApplicable,
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
  
  
    fetchAfterAbstract(): void {
      let districtParam = '';
      if ((this.Parsed_UserInfo.access_type === 'District' && this.Parsed_UserInfo.role === 4)||(this.Parsed_UserInfo.role === 3)) {
        districtParam = this.Parsed_UserInfo.district;
        this.selectedDistrict = districtParam;
      }
      this.loader = true;
      this.additionalAbstractService.getAfterAbstract(districtParam).subscribe({
        next: (response) => {
          console.log('Abstract:', response.data); // Debugging
          // Transform API response to match frontend structure
          this.reportData = response.data
          .filter((item: any) => item.revenue_district && item.revenue_district.trim() !== '')
          .map((item: any, index: number) => ({
            sl_no: index + 1,
            revenue_district: item.revenue_district,
            total_cases:item.total_cases,
            employment_given: item.employment_given,
            employment_pending: item.employment_pending,
            employment_notApplicable: item.employment_notApplicable,
            pension_given: item.pension_given,
            pension_pending: item.pension_pending,
            pension_notApplicable: item.pension_notApplicable,
            patta_given: item.patta_given,
            patta_pending: item.patta_pending,
            patta_notApplicable: item.patta_notApplicable,
            education_given: item.education_given,
            education_pending:item.education_pending,
            education_notApplicable: item.education_notApplicable,
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
   preGroupedColumns = this.displayedColumns.filter(
  col =>
    !col.group &&
    ['sl_no', 'revenue_district', 'total_cases'].includes(col.field)
);

postGroupedColumns = this.displayedColumns.filter(
  col =>
    !col.group &&
    !['sl_no', 'revenue_district', 'total_cases'].includes(col.field)
);
  // Helper function to detect ungrouped columns that come after the grouped sections
  isPostGroupColumn(col: DisplayedColumn): boolean {
    const finalStageIndex = this.displayedColumns.findIndex(c =>
      c.group === 'Final Stage Relief (3rd Stage)' &&
      c.label === '3rd Stage Disbursement Date'
    );
  
    const colIndex = this.displayedColumns.indexOf(col);
    return colIndex > finalStageIndex;
  }
  getTotals() {
  const totals: any = {};
  
  this.displayedColumns.forEach(col => {
    if (col.visible) { // only numeric columns
      totals[col.field] = this.paginatedData().reduce((sum, row) => sum + (Number(row[col.field]) || 0), 0);
    }
  });

  return totals;
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