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
    field: 'job_Given',
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
    label: 'Given',
    field: 'Pension_Given',
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
    label: 'Given',
    field: 'Patta_Given',
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
    label: 'Given',
    field: 'Education_Given',
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
  }
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
    async onBtnExport(): Promise<void> {
      await this.reportsCommonService.exportToExcel(
        this.filteredData,
        this.displayedColumns,
        'After-Abstract-Reports'
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
  
  
    fetchAfterAbstract(): void {
      this.loader = true;
      this.additionalAbstractService.getAfterAbstract().subscribe({
        next: (response) => {
          console.log('Abstract:', response.data); // Debugging
          // Transform API response to match frontend structure
          this.reportData = response.data
          .filter((item: any) => item.revenue_district && item.revenue_district.trim() !== '')
          .map((item: any, index: number) => ({
            sl_no: index + 1,
            revenue_district: item.revenue_district,
            total_cases:item.total_cases,
            job_Given: item.job_Given,
            employment_pending: item.employment_pending,
            Pension_Given: item.Pension_Given,
            pension_pending: item.pension_pending,
            Patta_Given: item.Patta_Given,
            patta_pending: item.patta_pending,
            Education_Given: item.Education_Given,
            education_pending:item.education_pending
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
  
  
  }
  
   interface DisplayedColumn {
    label: string;
    field: string;
    group: any;
    sortable: boolean;
    visible: boolean;
    sortDirection: 'asc' | 'desc' | null;
  }

