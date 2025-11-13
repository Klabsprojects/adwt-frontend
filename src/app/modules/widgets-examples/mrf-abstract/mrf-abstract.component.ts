import { ChangeDetectorRef, Component, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ReportsCommonService } from 'src/app/services/reports-common.service';
import { mrfAbstractService } from 'src/app/services/mrf-service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FirListComponent } from '../fir-list/fir-list.component';

@Component({
  selector: 'app-mrf-abstract',
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
  templateUrl: './mrf-abstract.component.html',
  styleUrl: './mrf-abstract.component.scss'
})
export class MrfAbstractComponent {
// Variable Declarations
  sortColumn: 'fir' | 'chargesheet' | 'trial' | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  showFirProposal:boolean = true;
  showChargesheetProposal:boolean = true;
  showTrialProposal:boolean=true;
  Colspan = 4;
  searchText: string = '';
  reportData: Array<any> = [];
  filteredData: Array<any> = [];
  page: number = 1;
  itemsPerPage: number = 50;
  isReliefLoading: boolean = true;
  loading: boolean = false;

  showFIR: boolean = false;
  showChargesheet: boolean = false;
  showTrial: boolean = false;


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
  tableSearchText: string = "";
  currentPage: number = 1;
  tableItemsPerPage: number = 10;
  communities:any[]=[];
  castes:any[]=[];
  zones:any[]=[];
  policeCities:any[]=[];
  Parsed_UserInfo: any;

selectedStage: string = '';
showAllStages:boolean = false;
popupData: any[] = [];

   status: any[]=[
    { key: 'UI', value: 'UI' },
    { key: 'PT', value: 'PT' },
  ]

  selectedStatus:string='';
  selectedDistricts:string='';
  selectedCommunity:string='';
  selectedCaste:string='';
  selectedZone:string='';
  selectedPoliceCity:string=''
  selectedFromDate:any="";
  selectedToDate:any="";
  payload = {
    district: this.selectedDistrict || "",
    police_city: this.selectedPoliceCity || "",
    Status_Of_Case: this.selectedCaste || "", 
    police_zone: this.selectedZone || "",
    Filter_From_Date: this.selectedFromDate || "",
    Filter_To_Date: this.selectedToDate || ""
  };
@ViewChild(FirListComponent) firList!: FirListComponent;
  
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
    label: 'Total Cases',
    field: 'total_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'MF Cases',
    field: 'mf_cases',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
    {
    label: 'Atrocity Cases',
    field: 'nonmf_case',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Proposal Not Yet Received',
    field: 'notyetreceived',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
// ✅ Group: FIR
  {
    label: 'Proposal sent to DC',
    field: 'fir_proposal_sent_to_dc',
    group: 'FIR Relief',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Given',
    field: 'fir_relief_given',
    group: 'FIR Relief',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: ' Pending',
    field: 'fir_relief_pending',
    group: 'FIR Relief',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  
  // ✅ Group: Chargesheet
  {
    label: 'Proposal sent to DC',
    field: 'chargesheet_proposal_sent_to_dc',
    group: 'Chargesheet Relief',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: ' Given',
    field: 'chargesheet_relief_given',
    group: 'Chargesheet Relief',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: ' Pending',
    field: 'chargesheet_relief_pending',
    group: 'Chargesheet Relief',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  
  // ✅ Group: Trail Stage (spelling corrected from "TRAIL")
  {
    label: 'Proposal sent to DC',
    field: 'trial_proposal_sent_to_dc',
    group: 'Trail Relief',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: ' Given',
    field: 'trial_relief_given',
    group: 'Trail Relief',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: ' Pending',
    field: 'trial_relief_pending',
    group: 'Trail Relief',
    sortable: true,
    visible: true,
    sortDirection: null,
  }
];


  selectedCaseStatus: string = '';
  selectedReliefStatus: string = '';
  currentSortField: string = '';
  isAscending: boolean = true;
  originalData: any;
  
  constructor(
    // private firService: FirListTestService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private reportsCommonService: ReportsCommonService,
    private mrfAbstractService: mrfAbstractService,
    private router: Router,
     private dashboardService: DashboardService
  ) {
    this.loader = true;
  }

  groupedBySection: { [group: string]: DisplayedColumn[] } = {};
  groupOrder = ['FIR Relief', 'Chargesheet Relief', 'Trail Relief'];

ngOnInit(): void {
  // 🔹 Load user info
  const UserInfo: any = sessionStorage.getItem('user_data');
  this.Parsed_UserInfo = UserInfo ? JSON.parse(UserInfo) : null;

  // 🔹 Group displayed columns
  this.groupedBySection = this.groupOrder.reduce((acc, groupName) => {
    const cols = this.displayedColumns.filter(
      col => col.group === groupName && col.visible
    );
    if (cols.length > 0) {
      acc[groupName] = cols;
    }
    return acc;
  }, {} as { [group: string]: DisplayedColumn[] });

  // 🔹 Fetch dropdown values (districts, offences, etc.)
  this.reportsCommonService.getAllData().subscribe(({ districts, offences }) => {
    this.districts = districts;
    this.naturesOfOffence = offences;
  });

  this.getDropdowns();
  // 🔹 Init table state
  this.filteredData = [...this.reportData];
  this.selectedColumns = this.displayedColumns.map((column) => column.field);

  // 🔹 Restore saved filters from sessionStorage
  const savedFilters = sessionStorage.getItem('mrfFilters');


if (savedFilters) {
  const filters = JSON.parse(savedFilters);
  console.log("Filter", filters);

  // Extract values
  this.selectedDistrict   = filters.district   || '';
  this.selectedPoliceCity = filters.police_city || '';
  this.selectedZone       = filters.police_zone || '';
  this.selectedStatus     = filters.Status_Of_Case || '';
  this.selectedFromDate   = filters.Filter_From_Date || '';
  this.selectedToDate     = filters.Filter_To_Date || '';

  // Check if all filter values are empty
  const allEmpty = !this.selectedDistrict &&
                   !this.selectedPoliceCity &&
                   !this.selectedZone &&
                   !this.selectedStatus &&
                   !this.selectedFromDate &&
                   !this.selectedToDate;

  if (allEmpty) {
    // No filters set → fetch all data
    this.fetchMrfAbstract();
  } else {
    // Some filters present → apply them
    this.applyFilters();
  }
} else {
  // No saved filters → fetch all data
  this.fetchMrfAbstract();
}

}

  getFilterParams() {
  const params: any = {};

  const addParam = (key: string, value: any) => {
    if (value) params[key] = value;
  };
   addParam('district', this.selectedDistrict);
   addParam('police_city',this.selectedPoliceCity);
   addParam('police_zone', this.selectedZone);
   addParam('Filter_From_Date',this.selectedFromDate);
   addParam('Filter_To_Date',this.selectedToDate);
   addParam('Status_Of_Case',this.selectedStatus);
  //  console.log(this.Parsed_UserInfo);
   if ((this.Parsed_UserInfo.access_type === 'District' && this.Parsed_UserInfo.role === 4)||(this.Parsed_UserInfo.role === 3)) {
    params.district = this.Parsed_UserInfo.district;
  }
  // console.log(params);
  return params;
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
  
  get ungroupedColumns(): DisplayedColumn[] {
  return this.displayedColumns.filter(col => col.group === null && col.visible);
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
  //     'MRF-Abstract'
  //   );
  // }

sortTablePopup(column: 'fir' | 'chargesheet' | 'trial') {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }
}
caseDetailsExport() {
  const dataToExport = this.tableFilteredData();

  let headerRow1: string[] = ["S.No", "FIR Number","Police Station", "Register Date"];
  let headerRow2: string[] = ["", "", "","",];
  let dataRows: any[][] = [];

  if (this.showFIR && !this.showChargesheet && !this.showTrial) {
    // 🔹 FIR only
    headerRow1.push("FIR", "", "", "");
    headerRow2.push("Proposal Sent to DC", "Status", "Days Pending Since FIR Filing","Days Pending Since Proposal Signing");

    dataRows = dataToExport.map((d: any, i: number) => [
      i + 1,
      d.fir_number_full,
      d.police_station,
      new Date(d.register_date).toLocaleDateString('en-GB'),
      d.fir_proposal_status,
      d.fir_status,
      d.fir_status === 'Relief Given' ? '-' : d.fir_pending_days,
      d.fir_proposal_pending_days,
    ]);
  } 
  else if (this.showChargesheet && !this.showFIR && !this.showTrial) {
    // 🔹 Chargesheet only
    headerRow1.push("Chargesheet", "", "","");
    headerRow2.push("Proposal Sent to DC", "Status", "Days Pending Since FIR Filing","Days Pending Since Proposal Signing");

    dataRows = dataToExport.map((d: any, i: number) => [
      i + 1,
      d.fir_number_full,
      d.police_station,
      new Date(d.register_date).toLocaleDateString('en-GB'),
      d.chargesheet_proposal_status,
      d.chargesheet_status,
      d.chargesheet_status === 'Relief Given' ? '-' : d.chargesheet_pending_days,
      d.chargesheet_proposal_pending_days
    ]);
  } 
  else if (this.showTrial && !this.showFIR && !this.showChargesheet) {
    // 🔹 Trial only
    headerRow1.push("Trial", "", "");
    headerRow2.push("Proposal Sent to DC", "Status", "Days Pending Since FIR Filing");

    dataRows = dataToExport.map((d: any, i: number) => [
      i + 1,
      d.fir_number_full,
      d.police_station,
      new Date(d.register_date).toLocaleDateString('en-GB'),
      d.trial_proposal_status,
      d.trial_status,
      d.trial_status === 'Relief Given' ? '-' : d.trial_pending_days,
      d.trial_proposal_pending_days
    ]);
  }
  else if (!this.showTrial && !this.showFIR && !this.showChargesheet) {
    dataRows = dataToExport.map((d: any, i: number) => [
      i + 1,
      d.fir_number_full,
      d.police_station,
      new Date(d.register_date).toLocaleDateString('en-GB'),
    ]);
  } 
  else {
    // 🔹 District / All → include everything
    headerRow1.push("FIR","","","","Chargesheet","","","","Trial","","","");
    headerRow2.push(
      "Proposal Sent to DC","Status","Days Pending Since FIR Filing","Days Pending Since Proposal Signing",
      "Proposal Sent to DC","Status","Days Pending Since FIR Filing","Days Pending Since Proposal Signing",
      "Proposal Sent to DC","Status","Days Pending Since FIR Filing","Days Pending Since Proposal Signing"
    );

    dataRows = dataToExport.map((d: any, i: number) => [
      i + 1,
      d.fir_number_full,
      d.police_station,
      new Date(d.register_date).toLocaleDateString('en-GB'),
      d.fir_proposal_status,
      d.fir_status,
      d.fir_status === 'Relief Given' ? '-' : d.fir_pending_days,
      d.fir_proposal_pending_days,
      d.chargesheet_proposal_status,
      d.chargesheet_status,
      d.chargesheet_status === 'Relief Given' ? '-' : d.chargesheet_pending_days,
      d.chargesheet_proposal_pending_days,
      d.trial_proposal_status,
      d.trial_status,
      d.trial_status === 'Relief Given' ? '-' : d.trial_pending_days,
      d.trial_proposal_pending_days
    ]);
  }

const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headerRow1, headerRow2, ...dataRows]);

ws['!merges'] = [];

// 🔹 Rowspan for first 4 headers (S.No, FIR Number, Police Station, Register Date)
ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }); // S.No
ws['!merges'].push({ s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }); // FIR Number
ws['!merges'].push({ s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }); // Police Station
ws['!merges'].push({ s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }); // Register Date

// 🔹 Stage headers (merge horizontally)
if (this.showFIR && !this.showChargesheet && !this.showTrial) {
  ws['!merges'].push({ s: { r: 0, c: 4 }, e: { r: 0, c: 7 } }); // FIR 4 cols
} else if (this.showChargesheet && !this.showFIR && !this.showTrial) {
  ws['!merges'].push({ s: { r: 0, c: 4 }, e: { r: 0, c: 7 } }); // Chargesheet 4 cols
} else if (this.showTrial && !this.showFIR && !this.showChargesheet) {
  ws['!merges'].push({ s: { r: 0, c: 4 }, e: { r: 0, c: 7 } }); // Trial 4 cols
} else {
  ws['!merges'].push({ s: { r: 0, c: 4 }, e: { r: 0, c: 7 } });   // FIR
  ws['!merges'].push({ s: { r: 0, c: 8 }, e: { r: 0, c: 11 } });  // Chargesheet
  ws['!merges'].push({ s: { r: 0, c: 12 }, e: { r: 0, c: 15 } }); // Trial
}

  // 🔹 Create workbook & export
  const wb: XLSX.WorkBook = XLSX.utils.book_new();

  // Use popup title (selectedStage) as sheet name (max 31 chars for Excel)
  const sheetName = this.selectedStage.length > 31 
    ? this.selectedStage.substring(0, 31) 
    : this.selectedStage;

  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Use popup title as file name too
  const fileName = this.selectedStage.replace(/\s+/g, '_').toLowerCase();

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(wbout, fileName);
}


onBtnExport(): void {
  // Define multi-row headers
  const headers = [
    [
      'Sl. No.', 'District', 'Total Cases', 'MF Case', 'Atrocity Cases', 'Proposal Not Yet Received',
      'FIR Relief', '', '',
      'Chargesheet Relief', '', '',
      'Trial Relief', '', ''
    ],
    [
      '', '', '', '', '', '',
      'Proposal sent to DC', 'Given', 'Pending',
      'Proposal sent to DC', 'Given', 'Pending',
      'Proposal sent to DC', 'Given', 'Pending'
    ]
  ];

  const data = this.filteredData.map((item, index) => [
    index + 1,
    item.revenue_district,
    item.total_cases,
    item.mf_cases,
    item.nonmf_case,
    item.notyetreceived,
    item.fir_proposal_sent_to_dc,
    item.fir_relief_given,
    item.fir_relief_pending,
    item.chargesheet_proposal_sent_to_dc,
    item.chargesheet_relief_given,
    item.chargesheet_relief_pending,
    item.trial_proposal_sent_to_dc,
    item.trial_relief_given,
    item.trial_relief_pending
  ]);

  // Compute totals for numeric columns
  const totalRow = [
    '',
    'Total',
    this.sumByKey('total_cases'),
    this.sumByKey('mf_cases'),
    this.sumByKey('nonmf_case'),
    this.sumByKey('notyetreceived'),
    this.sumByKey('fir_proposal_sent_to_dc'),
    this.sumByKey('fir_relief_given'),
    this.sumByKey('fir_relief_pending'),
    this.sumByKey('chargesheet_proposal_sent_to_dc'),
    this.sumByKey('chargesheet_relief_given'),
    this.sumByKey('chargesheet_relief_pending'),
    this.sumByKey('trial_proposal_sent_to_dc'),
    this.sumByKey('trial_relief_given'),
    this.sumByKey('trial_relief_pending')
  ];

  const aoa = [...headers, ...data, totalRow];
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);

  // Define merged cells correctly
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Sl. No.
    { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // District
    { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Total Cases
    { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // MF Case
    { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } }, // Non MF Case
    { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }, // Proposal Not Yet Received
    { s: { r: 0, c: 6 }, e: { r: 0, c: 8 } }, // FIR Relief (3 cols)
    { s: { r: 0, c: 9 }, e: { r: 0, c: 11 } }, // Chargesheet Relief (3 cols)
    { s: { r: 0, c: 12 }, e: { r: 0, c: 14 } } // Trial Relief (3 cols)
  ];

  const workbook: XLSX.WorkBook = {
    Sheets: { 'MRF Abstract': worksheet },
    SheetNames: ['MRF Abstract']
  };

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, 'mrf_abstract');
}

// Helper method to sum column values
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

onBtnExportPDF(): void {
  const doc = new jsPDF('l', 'mm', 'a4'); // Landscape

  // Define multi-level headers
  const headRows = [
    [
      { content: 'Sl. No.', rowSpan: 2 },
      { content: 'District', rowSpan: 2 },
      { content: 'Total Cases', rowSpan: 2 },
      { content: 'MF Case', rowSpan: 2 },
      { content: 'Atrocity Cases', rowSpan: 2 },
      { content: 'Proposal Not Yet Received', rowSpan: 2 },
      { content: 'FIR Relief', colSpan: 3 },
      { content: 'Chargesheet Relief', colSpan: 3 },
      { content: 'Trial Relief', colSpan: 3 }
    ],
    [
      { content: 'Proposal sent to DC' },
      { content: 'Given' },
      { content: 'Pending' },
      { content: 'Proposal sent to DC' },
      { content: 'Given' },
      { content: 'Pending' },
      { content: 'Proposal sent to DC' },
      { content: 'Given' },
      { content: 'Pending' }
    ]
  ];

  // Table body data
  const body = this.filteredData.map((item: any, index: number) => [
    index + 1,
    item.revenue_district,
    item.total_cases,
    item.mf_cases,
    item.nonmf_case,
    item.notyetreceived,
    item.fir_proposal_sent_to_dc,
    item.fir_relief_given,
    item.fir_relief_pending,
    item.chargesheet_proposal_sent_to_dc,
    item.chargesheet_relief_given,
    item.chargesheet_relief_pending,
    item.trial_proposal_sent_to_dc,
    item.trial_relief_given,
    item.trial_relief_pending
  ]);

  // Total row
  const totalRow = [
    '', // Sl. No.
    'Total',
    this.sumByKey('total_cases'),
    this.sumByKey('mf_cases'),
    this.sumByKey('nonmf_case'),
    this.sumByKey('notyetreceived'),
    this.sumByKey('fir_proposal_sent_to_dc'),
    this.sumByKey('fir_relief_given'),
    this.sumByKey('fir_relief_pending'),
    this.sumByKey('chargesheet_proposal_sent_to_dc'),
    this.sumByKey('chargesheet_relief_given'),
    this.sumByKey('chargesheet_relief_pending'),
    this.sumByKey('trial_proposal_sent_to_dc'),
    this.sumByKey('trial_relief_given'),
    this.sumByKey('trial_relief_pending')
  ];
  body.push(totalRow);

  // AutoTable render
  autoTable(doc, {
    head: headRows,
    body: body,
    startY: 20,
    theme: 'grid',
    headStyles: { fillColor: [22, 160, 133] }, // optional styling
    styles: { fontSize: 8 },
   didDrawPage: function (data) {
  // Get current page number
  const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber;
  
  if (currentPage === 1) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const text = 'MRF Abstract';
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;

    doc.setFontSize(13);
    doc.text(text, x, 10); // Top center of first page
  }
}

  });

  doc.save('mrf_abstract.pdf');
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
      this.fetchMrfAbstract();
      sessionStorage.removeItem('mrfFilters');

      // this.filteredData = [...this.reportData]; 
  }

    getStatusTextUIPT(status: number): string {
    // console.log(status,'statussssssss')
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
  const payload = {
    district: this.selectedDistrict || "",
    police_city: this.selectedPoliceCity || "",
    police_zone: this.selectedZone || "",
    Filter_From_Date: this.selectedFromDate || "",
    Filter_To_Date: this.selectedToDate || "",
    Status_Of_Case:this.selectedStatus
  };
    this.loader = true;

    sessionStorage.setItem('mrfFilters', JSON.stringify(payload));

  this.mrfAbstractService.getMrfAbstractDetails(this.getFilterParams()).subscribe({
    next: (response: any) => {
      // console.log(response.data);
      const data = response.data;
      const totals: { [key: string]: any } = {
        sl_no: '',
        revenue_district: 'Total',
        total_cases: 0,
        mf_cases:0,
        nonmf_case:0,
        notyetreceived:0,
        fir_proposal_sent_to_dc: 0,
        fir_relief_given: 0,
        fir_relief_pending: 0,
        chargesheet_proposal_sent_to_dc: 0,
        chargesheet_relief_given: 0,
        chargesheet_relief_pending: 0,
        trial_proposal_sent_to_dc: 0,
        trial_relief_given: 0,
        trial_relief_pending: 0
      };

      this.reportData = data.map((item: any, index: number) => {
        const row: { [key: string]: any } = {
          sl_no: index + 1,
          revenue_district: item.revenue_district,
          total_cases: +item.total_cases || 0,
          mf_cases: +item.mf_cases || 0,
          nonmf_case: +item.nonmf_case || 0,
          notyetreceived: +item.notyetreceived || 0,
          fir_proposal_sent_to_dc: +item.fir_proposal_sent_to_dc || 0,
          fir_relief_given: +item.fir_relief_given || 0,
          fir_relief_pending: +item.fir_relief_pending || 0,
          chargesheet_proposal_sent_to_dc: +item.chargesheet_proposal_sent_to_dc || 0,
          chargesheet_relief_given: +item.chargesheet_relief_given || 0,
          chargesheet_relief_pending: +item.chargesheet_relief_pending || 0,
          trial_proposal_sent_to_dc: +item.trial_proposal_sent_to_dc || 0,
          trial_relief_given: +item.trial_relief_given || 0,
          trial_relief_pending: +item.trial_relief_pending || 0
        };

        // Add to totals
        Object.keys(totals).forEach((key) => {
          if (typeof totals[key] === 'number') {
            totals[key] += row[key] || 0;
          }
        });

        return row;
      });
      this.totalRow = totals;
      this.filteredData = [...this.reportData];
      this.loader = false;
      this.cdr.detectChanges();
    },
    error: (error: any) => {
      this.loader = false;
      console.error('Error fetching reports:', error);
    }
  });
}

totalRow: any = {}; // Already declared

fetchMrfAbstract(): void {
  this.loader = true;

  this.mrfAbstractService.getMrfAbstractDetails(this.getFilterParams()).subscribe({
    next: (response: any) => {
      // console.log(response.data);
      const data = response.data;
      const totals: { [key: string]: any } = {
        sl_no: '',
        revenue_district: 'Total',
        total_cases: 0,
        mf_cases:0,
        nonmf_case:0,
        notyetreceived:0,
        fir_proposal_sent_to_dc: 0,
        fir_relief_given: 0,
        fir_relief_pending: 0,
        chargesheet_proposal_sent_to_dc: 0,
        chargesheet_relief_given: 0,
        chargesheet_relief_pending: 0,
        trial_proposal_sent_to_dc: 0,
        trial_relief_given: 0,
        trial_relief_pending: 0
      };

      const validData = data.filter(
        (item: any) => item.revenue_district && item.revenue_district.trim() !== ''
      );

      this.reportData = validData.map((item: any, index: number) => {
        const row: { [key: string]: any } = {
          sl_no: index + 1,
          revenue_district: item.revenue_district,
          total_cases: +item.total_cases || 0,
          mf_cases: +item.mf_cases || 0,
          nonmf_case: +item.nonmf_case || 0,
          notyetreceived: +item.notyetreceived || 0,
          fir_proposal_sent_to_dc: +item.fir_proposal_sent_to_dc || 0,
          fir_relief_given: +item.fir_relief_given || 0,
          fir_relief_pending: +item.fir_relief_pending || 0,
          chargesheet_proposal_sent_to_dc: +item.chargesheet_proposal_sent_to_dc || 0,
          chargesheet_relief_given: +item.chargesheet_relief_given || 0,
          chargesheet_relief_pending: +item.chargesheet_relief_pending || 0,
          trial_proposal_sent_to_dc: +item.trial_proposal_sent_to_dc || 0,
          trial_relief_given: +item.trial_relief_given || 0,
          trial_relief_pending: +item.trial_relief_pending || 0
        };

        // Add to totals
        Object.keys(totals).forEach((key) => {
          if (typeof totals[key] === 'number') {
            totals[key] += row[key] || 0;
          }
        });

        return row;
      });
      this.totalRow = totals;
      this.filteredData = [...this.reportData];
      this.loader = false;
      this.cdr.detectChanges();
    },
    error: (error: any) => {
      this.loader = false;
      console.error('Error fetching reports:', error);
    }
  });
}



getColumnTotal(field: string): number {
  return this.reportData.reduce((total, row) => {
    const val = parseFloat(row[field]);
    return total + (isNaN(val) ? 0 : val);
  }, 0);
}


  getVisibleColumns() {
  return this.displayedColumns.filter(col => col.visible);
}



openReliefPopup(report: any, status: string): void {
  this.selectedDistrict = report.revenue_district;
  this.tableSearchText = '';
  this.popupData = [];
  this.loader = true;
  this.currentPage = 1;

  // 👇 Reset defaults first
  this.showAllStages = true;
  this.showFIR = true;
  this.showChargesheet = true;
  this.showTrial = true;

  this.showFirProposal = true;
  this.showChargesheetProposal = true;
  this.showTrialProposal = true;

  // 👇 If "mf", hide FIR/Chargesheet/Trial sections
  if (status === 'mf') {
    this.showFIR = false;
    this.showChargesheet = false;
    this.showTrial = false;
    this.showAllStages = false;
    this.selectedStage = `MF Case Details`;
  }
  else if(status === 'totalcase'){
    this.selectedStage = `Total Case Details`;
  }
  else if(status === 'nonmf'){
    this.selectedStage = `Atrocity Case Details`;
  }
  else if(status === 'notyetreceived'){
    this.selectedStage = `Proposal Not Yet Received	`;
    this.showFirProposal = false;
    this.showChargesheetProposal = false;
    this.showTrialProposal = false;
    this.Colspan = 3;
  }
  // ✅ Show modal immediately with spinner
  this.ngZone.run(() => {
    const modalEl: any = document.getElementById('reliefModal');
    if (modalEl) {
      const modalInstance = new (window as any).bootstrap.Modal(modalEl);
      modalInstance.show();
    }
  });

  const params = {
    ...this.getFilterParams(),
    status: status  
  };

  // API call
  this.mrfAbstractService
    .getMrfAbstractDetailedData(params)
    .subscribe((res: any) => {
      const flatData = Array.isArray(res.data[0]) ? res.data[0] : res.data;

      if (flatData?.length > 0) {
        this.popupData = flatData.map((item: any, index: number) => ({
          sno: index + 1,
          firId:item.firId,
          fir_number_full: item.fir_number_full,
          register_date: item.register_date,
          police_station:item.police_station,
          fir_proposal_status: item.fir_proposal_status || '-',
          fir_status: item.fir_status || '-',
          fir_pending_days: item.fir_pending_days ?? '-',
          fir_proposal_pending_days: item.fir_proposal_pending_days ?? '-',
          chargesheet_proposal_status: item.chargesheet_proposal_status || '-',
          chargesheet_status: item.chargesheet_status || '-',
          chargesheet_pending_days: item.chargesheet_pending_days ?? '-',
          chargesheet_proposal_pending_days: item.chargesheet_proposal_pending_days ?? '-',
          trial_proposal_status: item.trial_proposal_status || '-',
          trial_status: item.trial_status || '-',
          trial_pending_days: item.trial_pending_days ?? '-',
          trial_proposal_pending_days: item.trial_proposal_pending_days ?? '-'

        }));
      }

      this.loader = false;
      this.cdr.detectChanges();
    });
}


openPendingPopup(report: any, type: 'fir' | 'charge' | 'trial'): void {
  this.selectedDistrict = report.revenue_district;
   this.showFirProposal = true;
  this.showChargesheetProposal = true;
  this.showTrialProposal = true;
  this.Colspan = 4;
  // Configure popup based on type
  const config: any = {
    fir: {
      stage: 'FIR Relief Pending Details',
      status: 'firpending',
      showFIR: true,
      showChargesheet: false,
      showTrial: false,
      mapFields: (item: any, index: number) => ({
        sno: index + 1,
        firId:item.firId,
        fir_number_full: item.fir_number_full,
        police_station:item.police_station,
        register_date: item.register_date,
        fir_proposal_status: item.fir_proposal_status || '-',
        fir_status: item.fir_status || '-',
        fir_pending_days: item.fir_pending_days ?? '-',
        fir_proposal_pending_days: item.fir_proposal_pending_days ?? '-'
      })
    },
    charge: {
      stage: 'Chargesheet Relief Pending Details',
      status: 'chargepending',
      showFIR: false,
      showChargesheet: true,
      showTrial: false,
      mapFields: (item: any, index: number) => ({
        sno: index + 1,
        firId:item.firId,
        fir_number_full: item.fir_number_full,
        police_station:item.police_station,
        register_date: item.register_date,
        chargesheet_proposal_status: item.chargesheet_proposal_status || '-',
        chargesheet_status: item.chargesheet_status || '-',
        chargesheet_pending_days: item.chargesheet_pending_days ?? '-',
        chargesheet_proposal_pending_days: item.chargesheet_proposal_pending_days ?? '-'
      })
    },
    trial: {
      stage: 'Trial Relief Pending Details',
      status: 'trialpending',
      showFIR: false,
      showChargesheet: false,
      showTrial: true,
      mapFields: (item: any, index: number) => ({
        sno: index + 1,
        firId:item.firId,
        fir_number_full: item.fir_number_full,
        police_station:item.police_station,
        register_date: item.register_date,
        trial_proposal_status: item.trial_proposal_status || '-',
        trial_status: item.trial_status || '-',
        trial_pending_days: item.trial_pending_days ?? '-',
        trial_proposal_pending_days: item.trial_proposal_pending_days ?? '-'
      })
    }
  };

  const cfg = config[type];
  this.selectedStage = cfg.stage;
  this.showFIR = cfg.showFIR;
  this.showChargesheet = cfg.showChargesheet;
  this.showTrial = cfg.showTrial;

  this.popupData = [];
  this.loader = true;
  this.currentPage = 1;

  this.showModal();

  const params = {
    ...this.getFilterParams(),
    status: cfg.status
  };

  this.mrfAbstractService.getMrfAbstractDetailedData(params).subscribe((res: any) => {
    const flatData = Array.isArray(res.data[0]) ? res.data[0] : res.data;
    this.popupData = flatData.map(cfg.mapFields);

    this.loader = false;
    this.cdr.detectChanges();
  });
}

openGivenPopup(report: any, type: 'fir' | 'charge' | 'trial'): void {
  this.selectedDistrict = report.revenue_district;
  this.showFirProposal = false;
  this.showChargesheetProposal = false;
  this.showTrialProposal = false;
  this.Colspan = 3;
  // Configuration for each type
  const config: any = {
    fir: {
      stage: 'FIR Relief Given Details',
      status: 'firgiven',
      showFIR: true,
      showChargesheet: false,
      showTrial: false,
      mapFields: (item: any, index: number) => ({
        sno: index + 1,
        firId:item.firId,
        fir_number_full: item.fir_number_full,
        police_station:item.police_station,
        register_date: item.register_date,
        fir_proposal_status: item.fir_proposal_status || '-',
        fir_status: item.fir_status || '-',
        fir_pending_days: item.fir_pending_days ?? '-'
      })
    },
    charge: {
      stage: 'Chargesheet Relief Given Details',
      status: 'chargegiven',
      showFIR: false,
      showChargesheet: true,
      showTrial: false,
      mapFields: (item: any, index: number) => ({
        sno: index + 1,
        firId:item.firId,
        fir_number_full: item.fir_number_full,
        police_station:item.police_station,
        register_date: item.register_date,
        chargesheet_proposal_status: item.chargesheet_proposal_status || '-',
        chargesheet_status: item.chargesheet_status || '-',
        chargesheet_pending_days: item.chargesheet_pending_days ?? '-'
      })
    },
    trial: {
      stage: 'Trial Relief Given Details',
      status: 'trialgiven',
      showFIR: false,
      showChargesheet: false,
      showTrial: true,
      mapFields: (item: any, index: number) => ({
        sno: index + 1,
        firId:item.firId,
        fir_number_full: item.fir_number_full,
        police_station:item.police_station,
        register_date: item.register_date,
        trial_proposal_status: item.trial_proposal_status || '-',
        trial_status: item.trial_status || '-',
        trial_pending_days: item.trial_pending_days ?? '-'
      })
    }
  };

  const cfg = config[type];
  this.selectedStage = cfg.stage;
  this.showFIR = cfg.showFIR;
  this.showChargesheet = cfg.showChargesheet;
  this.showTrial = cfg.showTrial;

  this.popupData = [];
  this.loader = true;
  this.currentPage = 1;

  this.showModal();

  const params = {
    ...this.getFilterParams(),
    status: cfg.status
  };

  this.mrfAbstractService.getMrfAbstractDetailedData(params).subscribe((res: any) => {
    const flatData = Array.isArray(res.data[0]) ? res.data[0] : res.data;
    this.popupData = flatData.map(cfg.mapFields);

    this.loader = false;
    this.cdr.detectChanges();
  });
}


private showModal() {
  this.ngZone.run(() => {
    const modalEl: any = document.getElementById('reliefModal');
    if (modalEl) {
      const modalInstance = new (window as any).bootstrap.Modal(modalEl);
      modalInstance.show();
    }
  });
}



closePopup() {
  const modalEl: any = document.getElementById('reliefModal');
  console.log("close");
  if (modalEl) {
    const modalInstance = (window as any).bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
  this.popupData = [];
  this.tableSearchText = '';
  this.currentPage = 1;
}

Math = Math;

getPageNumbers(): number[] {
  const total = this.tableTotalPages().length;
  const maxPagesToShow = 5; // show 5 pages at a time
  let start = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
  let end = start + maxPagesToShow - 1;

  if (end > total) {
    end = total;
    start = Math.max(1, end - maxPagesToShow + 1);
  }

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}


// tableFilteredData() {
//   if (!this.tableSearchText) {
//     return this.popupData;
//   }
//   const lower = this.tableSearchText.toLowerCase();
//   return this.popupData.filter(d =>
//     d.fir_number_full?.toLowerCase().includes(lower) ||
//     d.fir_status?.toLowerCase().includes(lower) ||
//     d.chargesheet_status?.toLowerCase().includes(lower) ||
//     d.trial_status?.toLowerCase().includes(lower) ||
//     d.fir_pending_days?.toLowerCase().includes(lower) ||
//     d.chargesheet_pending_days?.toLowerCase().includes(lower) ||
//     d.trial_pending_days?.toLowerCase().includes(lower) 
//     );
// }

// tableFilteredData() {
//   if (!this.tableSearchText) {
//     return this.popupData;
//   }

//   const lower = this.tableSearchText.toLowerCase();

//   return this.popupData.filter(d => {
//     const fields = [
//       d.fir_number_full,
//       d.fir_proposal_status,
//       d.fir_status,
//       d.fir_pending_days,
//       d.police_station
//     ];
//     if (this.showAllStages) {
//       fields.push(
//         d.chargesheet_proposal_status,
//         d.chargesheet_status,
//         d.chargesheet_pending_days,
//         d.trial_proposal_status,
//         d.trial_status,
//         d.trial_pending_days
//       );
//     }

//     return fields
//       .map(val => (val !== null && val !== undefined ? String(val).toLowerCase() : ''))
//       .some(val => val.includes(lower));
//   });
// }

tableFilteredData() {
  let data = [...this.popupData]; // clone array to avoid mutating original

  // 🔍 Search Filter
  if (this.tableSearchText && this.tableSearchText.trim() !== '') {
    const lower = this.tableSearchText.toLowerCase();
    data = data.filter(d => {
      const fields = [
        d.fir_number_full,
        d.fir_proposal_status,
        d.fir_status,
        d.fir_pending_days,
        d.fir_proposal_pending_days,
        d.police_station
      ];

      if (this.showAllStages) {
        fields.push(
          d.chargesheet_proposal_status,
          d.chargesheet_status,
          d.chargesheet_pending_days,
          d.chargesheet_proposal_pending_days,
          d.trial_proposal_status,
          d.trial_status,
          d.trial_pending_days,
          d.trial_proposal_pending_days
        );
      }

      return fields
        .map(val => (val !== null && val !== undefined ? String(val).toLowerCase() : ''))
        .some(val => val.includes(lower));
    });
  }

  // 🔼🔽 Sorting Logic
  if (this.sortColumn) {
    const sortKey =
      this.sortColumn === 'fir'
        ? 'fir_pending_days'
        : this.sortColumn === 'chargesheet'
        ? 'chargesheet_pending_days'
        : 'trial_pending_days';

    data.sort((a, b) => {
      const valA = Number(a[sortKey]) || 0;
      const valB = Number(b[sortKey]) || 0;

      if (this.sortDirection === 'asc') {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });
  }

  return data;
}


tableTotalPages() {
  return Array(Math.ceil(this.tableFilteredData().length / this.itemsPerPage))
    .fill(0)
    .map((x, i) => i + 1);
}

changePage(page: number) {
  if (page >= 1 && page <= this.tableTotalPages().length) {
    this.currentPage = page;
  }
}

openModalFromAbstract(data: any): void {
  this.router.navigate(['/widgets-examples/fir-list'], { 
    state: { firData: data , from: 'mrf-abstract' }
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