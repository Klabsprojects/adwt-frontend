import { ChangeDetectorRef, Component, inject, TemplateRef } from '@angular/core';
import { WhatsappTriggerService } from '../../../app/services/whatsapp.service';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ReportsCommonService } from 'src/app/services/reports-common.service';
import bootstrap from 'bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-whatsapp-message',
  templateUrl: './whatsapp-message.component.html',
  styleUrl: './whatsapp-message.component.scss'
})
export class WhatsappMessageComponent {
 // Variable Declarations
    private modalService = inject(NgbModal);
    searchText: string = '';
    selectAll: boolean = false;
    selectedTemplate: string = '';
    currentReport: any = null;
    reportData: Array<any> = [];
    filteredData:any;
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
      field: 'revenue_district',
      group: null,
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'CUG',
      field: 'cug',
      group: null,
      sortable: true,
      visible: true,
      sortDirection: null,
    },
  {
    label: 'User Type',
    field: 'userType',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Status',
    field: 'status',
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
    Parsed_UserInfo:any;
  
    constructor(
      private cdr: ChangeDetectorRef,
      private WhatsappService: WhatsappTriggerService,
      private router: Router,
      private reportsCommonService: ReportsCommonService,
      private dashboardService: DashboardService
    ) {
      this.loader = true;
    }
  
    groupedBySection: { [group: string]: DisplayedColumn[] } = {};
    groupOrder = [];
  
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
          this.fetchUserList();
        });
        this.getDropdowns();
      // this.filteredData = [...this.reportData];
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
        this.fetchUserList();
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
   let districtParam = '';
         if ((this.Parsed_UserInfo.access_type === 'District' && this.Parsed_UserInfo.role === 4)||(this.Parsed_UserInfo.role === 3)) {
        districtParam = this.Parsed_UserInfo.district;
        this.selectedDistrict = districtParam;
      }
      this.loader = true;
      const payload = this.getFilterParams(); // 👈 build payload from current filters
  console.log('Payload sent to API:', payload);
      // this.WhatsappService.getBeforeAbstract(payload).subscribe({
      //   next: (response:any) => {
      //     console.log('Abstract:', response.data); // Debugging
      //     // Transform API response to match frontend structure
      //     this.reportData = response.data
      //     .filter((item: any) => item.revenue_district && item.revenue_district.trim() !== '')
      //     .map((item: any, index: number) => ({
      //       sl_no: index + 1,
      //       revenue_district: item.revenue_district,
      //       total_cases: item.total_cases,
      //       job_Given: item.job_Given,
      //       Pension_Given: item.Pension_Given,
      //       Patta_Given: item.Patta_Given,
      //       Education_Given: item.Education_Given,
      //       relief_pending:item.relief_pending,
      //     }));

      //     // Update filteredData to reflect the API data
      //     this.filteredData = [...this.reportData]; 
      //     this.loader = false;
      //     this.cdr.detectChanges(); // Trigger change detection
      //   },
      //   error: (error:any) => {
      //     this.loader = false;
      //     console.error('Error fetching reports:', error);
      //   }
      // });
  }
  
  
  
    fetchUserList(): void {
      let districtParam = '';
         if ((this.Parsed_UserInfo.access_type === 'District' && this.Parsed_UserInfo.role === 4)||(this.Parsed_UserInfo.role === 3)) {
        districtParam = this.Parsed_UserInfo.district;
        this.selectedDistrict = districtParam;
      }
      this.loader = true;
      this.filteredData = [
  {
    sl_no: 1,
    revenue_district: 'Chennai',
    cug: 8766766768,
    userType: 'Collector',
    status: 'Pending'
  },
  {
    sl_no: 2,
    revenue_district: 'Madurai',
    cug: 9887667667,
    userType: 'DADWO',
    status: 'Send'
  },
  {
    sl_no: 3,
    revenue_district: 'Salem',
    cug: 6787667667,
    userType: 'Collector',
    status: 'Not Send'
  }
];
console.log(this.filteredData);

    }

     toggleAllSelections(): void {
  this.paginatedData().forEach((report) => (report.selected = this.selectAll));
}
checkIfAllSelected(): void {
  const allSelected = this.paginatedData().every((r) => r.selected);
  this.selectAll = allSelected;
}
  

    onSend(report: any): void {
  console.log('Sending report:', report);
}

onEdit(report: any): void {
  console.log('Editing report:', report);
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
  
  getTotals() {
  const totals: any = {};
  
  this.displayedColumns.forEach(col => {
    if (col.visible) { // only numeric columns
      totals[col.field] = this.paginatedData().reduce((sum, row) => sum + (Number(row[col.field]) || 0), 0);
    }
  });

  return totals;
}

open(content: TemplateRef<any>, record?: any) {
  this.modalService.open(content, {
    size: 'lg',
    centered: true,
    backdrop: 'static',
  });
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
