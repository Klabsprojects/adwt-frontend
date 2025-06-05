import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import * as ExcelJS from 'exceljs';
import { MonthlyReportService } from 'src/app/services/monthly-report.service';
import { ReportsCommonService } from 'src/app/services/reports-common.service';
import { inject, signal, TemplateRef, WritableSignal } from '@angular/core';

import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DashboardService } from 'src/app/services/dashboard.service';



declare var bootstrap: any;

@Component({
  selector: 'app-monthly-report',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.scss'],
})
export class MonthlyReportComponent implements OnInit {
  private modalService = inject(NgbModal);
	closeResult: WritableSignal<string> = signal('');
  // Variable Declarations
  reportData: Array<any> = [];
  filteredData: Array<any> = [];
  searchText: string = '';
  selectedDistrict: string = '';
  selectedColumns: string[] = [];
  selectedNatureOfOffence: string = '';
  selectedStatusOfCase: string = '';
  selectedStatusOfRelief: string = '';
  districts: string[] = [];
  natureOfOffences: string[] = [];
  caseStatuses: string[] = ['Just Starting', 'Pending', 'Completed'];
  courtDistricts: string[] = [
    'High Court Chennai',
    'Madurai Bench',
    'Trichy Court',
  ];
  courtNames: string[] = ['Court A', 'Court B', 'Court C'];
  // status: string[] = ['Just Starting', 'Pending', 'Completed'];
  statusesOfRelief: string[] = [
    'FIR Stage',
    'ChargeSheet Stage',
    'Trial Stage',
  ];
  currentSortField: string = '';
  isAscending: boolean = true;
  page: number = 1;
  itemsPerPage: number = 10;
  isAdmin: boolean = true;
  selectedCaseStatus: string = '';
  loading: boolean = false;
  loader: boolean = false;
  displayedColumns: {
    field: string;
    label: string;
    visible: boolean;
    sortable: boolean;
    sortDirection: 'asc' | 'desc' | null;
  }[] = [
    {
      field: 'sl_no',
      label: 'Sl. No.',
      visible: true,
      sortable: false,
      sortDirection: null,
    },
    {
      field: 'policeCity',
      label: 'Police City/District',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'stationName',
      label: 'Police Station Name',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'firNumber',
      label: 'FIR Number',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'natureOfOffence',
      label: 'Nature of Offence',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'poaSection',
      label: 'Section of the PoA Act invoked for the offence',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'noOfVictim',
      label: 'No. of Victim',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'courtDistrict',
      label: 'Court District',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'courtName',
      label: 'Court Name',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'caseNumber',
      label: 'CC/PRC/SC/SSC Number',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'caseStatus',
      label: 'Status of the Case',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'uiPendingDays',
      label: 'No. of Days UI is Pending',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'ptPendingDays',
      label: 'No. of Days PT is Pending',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'reasonPreviousMonth',
      label: 'Reason for Status (Previous Month)',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'reasonCurrentMonth',
      label: 'Reason for Status (Current Month)',
      visible: true,
      sortable: true,
      sortDirection: null,
    },
    {
      field: 'action',
      label: 'Action',
      visible: true,  
      sortable: false,
      sortDirection: null,
    },
  ];


  ReportType = 'General';
  currentYear = new Date().getFullYear();
  yearColumns1: number[] = [];

  reason_Update = '';
  fir_id = ''


  // table 1
  TypeReport1 : any;
  currentPage1 = 1;
  itemsPerPage1 = 5;
  totalItems1 = 0;
  // table 1

  // table 2
  TypeReport2 : any;
  currentPage2 = 1;
  itemsPerPage2 = 5;
  totalItems2 = 0;
  // table 2

  // table 3
  TypeReport3 : any;
  currentPage3 = 1;
  itemsPerPage3 = 5;
  totalItems3 = 0;
  // table 3

  // table 4
  TypeReport4 : any;
  currentPage4 = 1;
  itemsPerPage4 = 5;
  totalItems4 = 0;
  // table 4

  // table 5
  TypeReport5 : any;
  currentPage5 = 1;
  itemsPerPage5 = 5;
  totalItems5 = 0;
  // table 5

  // new
  status: any[]=[
    { key: 'UI', value: 'UI Stage' },
    { key: 'PT', value: 'PT Stage' },
  ]
  // districts:any=[];
  communities:any[]=[];
  castes:any[]=[];
  zones:any[]=[];
  offences:any[]=[];
  policeCities:any[]=[];

  selectedStatus:string='';
  selectedDistricts:string='';
  selectedCommunity:string='';
  selectedCaste:string='';
  selectedZone:string='';
  selectedOffence:string='';
  selectedPoliceCity:string=''
  selectedFromDate:any="";
  selectedToDate:any="";
  constructor(
    private cdr: ChangeDetectorRef,
    private reportsCommonService: ReportsCommonService,
    private monthlyReportService: MonthlyReportService,
    private dashboardService: DashboardService
  ) {
    this.loader = true;
    const currentYear = new Date().getFullYear();
    this.yearColumns1 = [currentYear, currentYear - 1, currentYear - 2];
  }

  // Lifecycle hook that initializes component data and fetches monthly reports.
  ngOnInit(): void {
    this.reportsCommonService
      .getAllData()
      .subscribe(({ districts, offences }) => {
        this.districts = districts;
        this.natureOfOffences = offences;
        this.fetchMonthlyReports();
      });
    this.filteredData = [...this.reportData];
    this.selectedColumns = this.displayedColumns.map((column) => column.field);
    // this.getReportData();
    this.getDropdowns();
  }

  // new
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
    this.dashboardService.userGetMethod('GetOffence').subscribe((res:any)=>{
      this.offences = res.data;
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

  getStatusBadgeClass(status: number): string {
    const badgeClassMap = {
      0: 'badge bg-info text-white',
      1: 'badge bg-warning text-dark',
      2: 'badge bg-warning text-dark',
      3: 'badge bg-warning text-dark',
      4: 'badge bg-success text-white',
      5: 'badge bg-success text-white',
      6: 'badge bg-success text-white',
      7: 'badge bg-success text-white',
      8: 'badge bg-danger text-white',
      9: 'badge bg-danger text-white',
      10: 'badge bg-danger text-white', // Add this entry for status 12
    } as { [key: number]: string };

    return badgeClassMap[status] || 'badge bg-secondary text-white';
  }

  getStatusTextUIPT(status: number): string {
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

    return statusTextMap[status] || 'Unknown';
  }
  // new end
  // Filters the report data based on the selected case status.
  filterByCaseStatus(): void {
    if (this.selectedCaseStatus) {
      this.filteredData = this.reportData.filter(
        (report) => report.caseStatus === this.selectedCaseStatus
      );
    } else {
      this.filteredData = [...this.reportData];
    }
  }

  // Load all fir reports details into UI
  fetchMonthlyReports(): void {
      this.loader = true;
      this.monthlyReportService.getMonthlyReportDetail().subscribe({
        next: (response) => {
          console.log(response,'response')
           this.loader = false;
          //console.log('Monthly Reports:', response.data); // Debugging
          // Transform API response to match frontend structure
          this.reportData = response.data.map((item: { police_city: any; police_station: any; fir_number: any; offence_committed: any; scst_sections: any; number_of_victim: any; court_district: any; court_name: any; case_number: any; status: number; under_investigation_case_days: any; pending_trial_case_days: any; previous_month_reason_for_status: any; current_month_reason_for_status: any; fir_id : any }, index: number) => ({
            sl_no: index + 1,
            policeCity: item.police_city,
            stationName: item.police_station,
            firNumber: item.fir_number,
            natureOfOffence: (item.offence_committed === "NULL" ? '' : (item.offence_committed || '').replace(/"/g, '')), 
            poaSection: (item.scst_sections || '').replace(/"/g, ''), // Remove double quotes
            noOfVictim: item.number_of_victim,
            courtDistrict: item.court_district || '',
            courtName: item.court_name || '',
            caseNumber: item.case_number || '',
            caseStatus: this.reportsCommonService.caseStatusOptions.find(option => option.value === item.status)?.label || '',
            uiPendingDays: item.under_investigation_case_days || '',
            ptPendingDays: item.pending_trial_case_days || '',
            reasonPreviousMonth: item.previous_month_reason_for_status || '',
            reasonCurrentMonth: item.current_month_reason_for_status || '',
            fir_id: item.fir_id || '',
          }));
          // Update filteredData to reflect the API data
          this.filteredData = [...this.reportData]; 
          this.cdr.detectChanges(); // Trigger change detection
        },
        error: (error) => {
          this.loader = false;
          console.error('Error fetching reports:', error);
        }
      });
  }

  // Updates the visibility of columns based on the selected columns.
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
  applyFilters(): void {
    this.filteredData = this.reportsCommonService.applyFiltersMonthly(
      this.reportData,
      this.searchText,
      this.selectedDistrict,
      this.selectedNatureOfOffence,
      this.selectedStatusOfCase,
      this.selectedStatusOfRelief,
      'policeCity', 'natureOfOffence', 'caseStatus',
      this.selectedStatus,
      this.selectedDistricts,
      this.selectedCommunity,
      this.selectedCaste,
      this.selectedZone,
      this.selectedOffence,
      this.selectedPoliceCity,
      this.selectedFromDate,
      this.selectedToDate
    );
    this.filteredData = this.filteredData.map((report, index) => ({...report, sl_no: index + 1 })); // Assign sl_no starting from 1
    this.page = 1; // Reset to the first page
  }
  

  clearfilter(){
      this.searchText = '';
      this.selectedDistrict = '';
      this.selectedNatureOfOffence = '';
      this.selectedStatusOfCase = '';
      this.selectedStatusOfRelief = '';
      this.selectedStatus='';
      this.selectedDistricts='';
      this.selectedCommunity='';
      this.selectedCaste='';
      this.selectedZone='';
      this.selectedOffence='';
      this.selectedPoliceCity='';
      this.selectedFromDate='';
      this.selectedToDate = '';
      this.applyFilters();
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

  // Get the sort icon class
  getSortIcon(field: string): string {
    return this.reportsCommonService.getSortIcon(
      field,
      this.currentSortField,
      this.isAscending
    );
  }

  // Navigates to the specified page number.
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
    // console.log(this.filteredData,'filteredDatafilteredDatafilteredData')
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Download Reports
  async onBtnExport(): Promise<void> {
    await this.reportsCommonService.exportToExcel(
      this.filteredData,
      this.displayedColumns,
      'UI&PT-Reports'
    );
  }


  getReportData(){
    if(this.ReportType == 'District_Wise_Pending_UI'){
      this.GetDistrictWisePendingUI();
    }
    if(this.ReportType == 'Reason_for_Pending_UI'){
      this.GetReasonWisePendingUI();
    }
    if(this.ReportType == 'Community_Certificate'){
      this.GetCommunity_Certificate_Report()
    }
    if(this.ReportType == 'District_wise_PT'){
      this.GetDistrictWisePendingPT()
    }
    if(this.ReportType == 'Conviction'){
      this.GetConvictionTypeRepot()
    }
  }


  // Helper method to use Math.min in template
  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
}


// table 1

GetDistrictWisePendingUI(){
  this.monthlyReportService.GetDistrictWisePendingUI().subscribe({
    next: (response) => {
      this.TypeReport1 = response.data;
      this.totalItems1 = this.TypeReport1.length;
      this.cdr.detectChanges(); 
    },
    error: (error) => {
      this.loading = false;
      console.error('Error fetching reports:', error);
    }
  });
}

get pagedUsers1(){
  const startIndex = (this.currentPage1 - 1) * this.itemsPerPage1;
  return this.TypeReport1.slice(startIndex, startIndex + this.itemsPerPage1);
}

get totalPages1(): number[] {
  const totalPages = Math.ceil(this.totalItems1 / this.itemsPerPage1);
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}

changePage1(page: number): void {
  this.currentPage1 = page;
}

nextPage1(): void {
  if (this.currentPage1 < this.totalPages1.length) {
    this.currentPage1++;
  }
}

prevPage1(): void {
  if (this.currentPage1 > 1) {
    this.currentPage1--;
  }
}

// exportToExcel1(): void {
//   const worksheetData: any[][] = [];

//   // First header row (merged)
//   worksheetData.push([
//     'SI.', 'District', 'UI Total Number of Cases', 'Less than 60 Days',
//     'More than 60 Days', '', ''
//   ]);

//   // Second header row (years under "More than 60 Days")
//   worksheetData.push([
//     '', '', '', '',
//     this.currentYear, this.currentYear - 1, this.currentYear - 2
//   ]);

//   // Add data rows
//   this.TypeReport1.forEach((item: any, index: number) => {
//     worksheetData.push([
//       index + 1,
//       item.revenue_district,
//       item.ui_total_cases,
//       item.less_than_60_days,
//       item.more_than_60_current_year,
//       item.more_than_60_last_year,
//       item.more_than_60_two_years_ago
//     ]);
//   });

//   // Create worksheet and workbook
//   const worksheet: xlsx.WorkSheet = xlsx.utils.aoa_to_sheet(worksheetData);

//   // Merge cells for "More than 60 Days" header
//   worksheet['!merges'] = [
//     { s: { r: 0, c: 4 }, e: { r: 0, c: 6 } }, // merge "More than 60 Days" over 3 cols
//     { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // merge SI.
//     { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // merge District
//     { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // merge UI Total
//     { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // merge Less than 60 Days
//   ];

//   const workbook: xlsx.WorkBook = {
//     Sheets: { 'District Wise Pending UI': worksheet },
//     SheetNames: ['District Wise Pending UI']
//   };

//   // Export to file
//   const excelBuffer: any = xlsx.write(workbook, {
//     bookType: 'xlsx',
//     type: 'array'
//   });
//   const fileName = 'District_Wise_Pending_UI.xlsx';
//   const data: Blob = new Blob([excelBuffer], {
//     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//   });
//   FileSaver.saveAs(data, fileName);
// }


exportToExcel1(): void {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('District Wise Pending UI');

  // Define columns
  worksheet.columns = [
    { header: 'SI.', width: 5 },
    { header: 'District', width: 20 },
    { header: 'UI Total Number of Cases', width: 25 },
    { header: 'Less than 60 Days', width: 20 },
    { header: 'More than 60 Days', width: 15 },
    { header: '', width: 15 },
    { header: '', width: 15 }
  ];

  // Add the second header row for years
  worksheet.addRow(['', '', '', '', this.currentYear, this.currentYear - 1, this.currentYear - 2]);

  // Style the headers - get the exact blue color you want
  const headerStyle = {
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1F497D' } // This is the hex color without the #
    },
    font: {
      color: { argb: 'FFFFFF' },
      bold: true
    },
    alignment: {
      horizontal: 'center',
      vertical: 'middle'
    },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  // Apply style to first row
  worksheet.getRow(1).eachCell((cell : any) => {
    cell.style = headerStyle;
  });

  // Apply style to second row
  worksheet.getRow(2).eachCell((cell : any) => {
    cell.style = headerStyle;
  });

  // Merge cells for headers
  worksheet.mergeCells('E1:G1'); // More than 60 Days
  worksheet.mergeCells('A1:A2'); // SI.
  worksheet.mergeCells('B1:B2'); // District
  worksheet.mergeCells('C1:C2'); // UI Total
  worksheet.mergeCells('D1:D2'); // Less than 60 Days

  // Add data rows
  this.TypeReport1.forEach((item: any, index: number) => {
    const row = worksheet.addRow([
      index + 1,
      item.revenue_district,
      item.ui_total_cases,
      item.less_than_60_days,
      item.more_than_60_current_year,
      item.more_than_60_last_year,
      item.more_than_60_two_years_ago
    ]);

    // Center align all data cells
    row.eachCell((cell:any) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
  });

// Apply header style to the last row (total row)
const lastRowIndex = this.TypeReport1.length + 2; // +2 because of header rows
const lastRow = worksheet.getRow(lastRowIndex);

// Merge first two cells for grand total and set the text
lastRow.getCell(1).value = 'Grand Total'; // Clear the first cell
lastRow.getCell(2).value = ''; // Set the text in the second cell
worksheet.mergeCells(`A${lastRowIndex}:B${lastRowIndex}`);

lastRow.eachCell((cell: any) => {
  cell.style = {
    ...headerStyle,
    font: {
      color: { argb: 'FFFFFF' },
      bold: true
    }
  };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
});

  // Generate Excel file
  workbook.xlsx.writeBuffer().then((buffer:any) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, 'District_Wise_Pending_UI.xlsx');
  });
}

// table 1


// table 2

GetReasonWisePendingUI(){
  this.monthlyReportService.GetReasonWisePendingUI().subscribe({
    next: (response) => {
      this.TypeReport2 = response.data;
      this.totalItems2 = this.TypeReport2.length;
      this.cdr.detectChanges(); 
    },
    error: (error) => {
      this.loading = false;
      console.error('Error fetching reports:', error);
    }
  });
}

get pagedUsers2(){
  const startIndex = (this.currentPage2 - 1) * this.itemsPerPage2;
  return this.TypeReport2.slice(startIndex, startIndex + this.itemsPerPage2);
}

get totalPages2(): number[] {
  const totalPages = Math.ceil(this.totalItems2 / this.itemsPerPage2);
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}

changePage2(page: number): void {
  this.currentPage2 = page;
}

nextPage2(): void {
  if (this.currentPage2 < this.totalPages2.length) {
    this.currentPage2++;
  }
}

prevPage2(): void {
  if (this.currentPage2 > 1) {
    this.currentPage2--;
  }
}



exportToExcel2(): void {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reason Wise Pending UI');

  // Define columns
  worksheet.columns = [
    { header: 'SI.', width: 5 },
    { header: 'Reason for Status', width: 20 },
    { header: 'UI Total Number of Cases', width: 25 },
    { header: 'Less than 60 Days', width: 20 },
    { header: 'More than 60 Days', width: 15 },
    { header: '', width: 15 },
    { header: '', width: 15 }
  ];

  // Add the second header row for years
  worksheet.addRow(['', '', '', '', this.currentYear, this.currentYear - 1, this.currentYear - 2]);

  // Style the headers - get the exact blue color you want
  const headerStyle = {
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1F497D' } // This is the hex color without the #
    },
    font: {
      color: { argb: 'FFFFFF' },
      bold: true
    },
    alignment: {
      horizontal: 'center',
      vertical: 'middle'
    },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  // Apply style to first row
  worksheet.getRow(1).eachCell((cell : any) => {
    cell.style = headerStyle;
  });

  // Apply style to second row
  worksheet.getRow(2).eachCell((cell : any) => {
    cell.style = headerStyle;
  });

  // Merge cells for headers
  worksheet.mergeCells('E1:G1'); // More than 60 Days
  worksheet.mergeCells('A1:A2'); // SI.
  worksheet.mergeCells('B1:B2'); // Reason
  worksheet.mergeCells('C1:C2'); // UI Total
  worksheet.mergeCells('D1:D2'); // Less than 60 Days

  // Add data rows
  this.TypeReport2.forEach((item: any, index: number) => {
    const row = worksheet.addRow([
      index + 1,
      item.reason_for_status,
      item.ui_total_cases,
      item.less_than_60_days,
      item.more_than_60_current_year,
      item.more_than_60_last_year,
      item.more_than_60_two_years_ago
    ]);

    // Center align all data cells
    row.eachCell((cell:any) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
  });

// Apply header style to the last row (total row)
const lastRowIndex = this.TypeReport2.length + 2; // +2 because of header rows
const lastRow = worksheet.getRow(lastRowIndex);

// Merge first two cells for grand total and set the text
lastRow.getCell(1).value = 'Grand Total'; // Clear the first cell
lastRow.getCell(2).value = ''; // Set the text in the second cell
worksheet.mergeCells(`A${lastRowIndex}:B${lastRowIndex}`);

lastRow.eachCell((cell: any) => {
  cell.style = {
    ...headerStyle,
    font: {
      color: { argb: 'FFFFFF' },
      bold: true
    }
  };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
});


  // Generate Excel file
  workbook.xlsx.writeBuffer().then((buffer:any) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, 'Reason_Wise_Pending_UI.xlsx');
  });
}

// table 2



// table 3

GetCommunity_Certificate_Report(){
  this.monthlyReportService.GetCommunity_Certificate_Report().subscribe({
    next: (response) => {
      this.TypeReport3 = response.data;
      this.totalItems3 = this.TypeReport3.length;
      this.cdr.detectChanges(); 
    },
    error: (error) => {
      this.loading = false;
      console.error('Error fetching reports:', error);
    }
  });
}

get pagedUsers3(){
  const startIndex = (this.currentPage3 - 1) * this.itemsPerPage3;
  return this.TypeReport3.slice(startIndex, startIndex + this.itemsPerPage3);
}

get totalPages3(): number[] {
  const totalPages = Math.ceil(this.totalItems3 / this.itemsPerPage3);
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}

changePage3(page: number): void {
  this.currentPage3 = page;
}

nextPage3(): void {
  if (this.currentPage3 < this.totalPages3.length) {
    this.currentPage3++;
  }
}

prevPage3(): void {
  if (this.currentPage3 > 1) {
    this.currentPage3--;
  }
}

exportToExcel3(): void {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('District Wise Pending UI');

  // Define columns
  worksheet.columns = [
    { header: 'SI.', width: 5 },
    { header: 'District', width: 20 },
    { header: 'UI Total Number of Cases', width: 25 },
    { header: 'Less than 60 Days', width: 20 },
    { header: 'More than 60 Days', width: 15 },
    { header: '', width: 15 },
    { header: '', width: 15 }
  ];

  // Add the second header row for years
  worksheet.addRow(['', '', '', '', this.currentYear, this.currentYear - 1, this.currentYear - 2]);

  // Style the headers - get the exact blue color you want
  const headerStyle = {
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1F497D' } // This is the hex color without the #
    },
    font: {
      color: { argb: 'FFFFFF' },
      bold: true
    },
    alignment: {
      horizontal: 'center',
      vertical: 'middle'
    },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  // Apply style to first row
  worksheet.getRow(1).eachCell((cell : any) => {
    cell.style = headerStyle;
  });

  // Apply style to second row
  worksheet.getRow(2).eachCell((cell : any) => {
    cell.style = headerStyle;
  });

  // Merge cells for headers
  worksheet.mergeCells('E1:G1'); // More than 60 Days
  worksheet.mergeCells('A1:A2'); // SI.
  worksheet.mergeCells('B1:B2'); // District
  worksheet.mergeCells('C1:C2'); // UI Total
  worksheet.mergeCells('D1:D2'); // Less than 60 Days

  // Add data rows
  this.TypeReport3.forEach((item: any, index: number) => {
    const row = worksheet.addRow([
      index + 1,
      item.revenue_district,
      item.ui_total_cases,
      item.less_than_60_days,
      item.more_than_60_current_year,
      item.more_than_60_last_year,
      item.more_than_60_two_years_ago
    ]);

    // Center align all data cells
    row.eachCell((cell:any) => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
  });

  //   // Apply header style to the last row (total row)
  // const lastRowIndex = this.TypeReport3.length + 2; // +2 because of header rows
  // const lastRow = worksheet.getRow(lastRowIndex);
  
  // lastRow.eachCell((cell: any) => {
  //   cell.style = {
  //     ...headerStyle,
  //     font: {
  //       color: { argb: 'FFFFFF' },
  //       bold: true
  //     }
  //   };
  //   cell.alignment = { horizontal: 'center', vertical: 'middle' };
  // });

  // Apply header style to the last row (total row)
  const lastRowIndex = this.TypeReport3.length + 2; // +2 because of header rows
  const lastRow = worksheet.getRow(lastRowIndex);

  // Merge first two cells for grand total and set the text
  lastRow.getCell(1).value = 'Grand Total'; // Clear the first cell
  lastRow.getCell(2).value = ''; // Set the text in the second cell
  worksheet.mergeCells(`A${lastRowIndex}:B${lastRowIndex}`);

  lastRow.eachCell((cell: any) => {
    cell.style = {
      ...headerStyle,
      font: {
        color: { argb: 'FFFFFF' },
        bold: true
      }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });


  // Generate Excel file
  workbook.xlsx.writeBuffer().then((buffer:any) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, 'Community_Certificate.xlsx');
  });
}

// table 3




// table 4

GetDistrictWisePendingPT(){
  this.monthlyReportService.GetDistrictWisePendingPT().subscribe({
    next: (response) => {
      this.TypeReport4 = response.data;
      this.totalItems4 = this.TypeReport4.length;
      this.cdr.detectChanges(); 
    },
    error: (error) => {
      this.loading = false;
      console.error('Error fetching reports:', error);
    }
  });
}

get pagedUsers4(){
  const startIndex = (this.currentPage4 - 1) * this.itemsPerPage4;
  return this.TypeReport4.slice(startIndex, startIndex + this.itemsPerPage4);
}

get totalPages4(): number[] {
  const totalPages = Math.ceil(this.totalItems4 / this.itemsPerPage4);
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}

changePage4(page: number): void {
  this.currentPage4 = page;
}

nextPage4(): void {
  if (this.currentPage4 < this.totalPages4.length) {
    this.currentPage4++;
  }
}

prevPage4(): void {
  if (this.currentPage4 > 1) {
    this.currentPage4--;
  }
}

exportToExcel4(): void {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('PT Case Pendency Report');

  // Define headers based on the image
  const headers = [
    'SI.',
    'District',
    'PT Total Number of Cases',
    'Less than one Year',
    '1-5 Yrs',
    '6-10 Yrs',
    '11-15 Yrs',
    '16-20 Yrs',
    'Above 20 Yrs'
  ];

  // Add header row
  worksheet.addRow(headers);

  // Sample data - replace with your actual data source
  const data = this.TypeReport4.map((item : any, index: any) => [
    index + 1,
    item.revenue_district,
    item.total,
    item.less_than_one_year,
    item.between_1_and_5_years,
    item.between_6_and_10_years,
    item.between_11_and_15_years,
    item.between_16_and_20_years,
    item.above_20_years
  ]);

  // Add data rows
  data.forEach((row:any) => {
    worksheet.addRow(row);
  });

  // Set column widths
  worksheet.columns = [
    { width: 5 },  // SI.
    { width: 20 }, // District
    { width: 22 }, // PT Total Number of Cases
    { width: 18 }, // Less than one Year
    { width: 12 }, // 1-5 Yrs
    { width: 12 }, // 6-10 Yrs
    { width: 12 }, // 11-15 Yrs
    { width: 12 }, // 16-20 Yrs
    { width: 12 }  // Above 20 Yrs
  ];

  // Styling Constants
  const headerBlue = '1F497D'; // The blue color from your image without #

  // Style headers
  const headerRow = worksheet.getRow(1);
  headerRow.height = 25; // Increase header height for better appearance
  
  headerRow.eachCell((cell:any, colNumber:any) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: headerBlue }
    };
    cell.font = {
      color: { argb: 'FFFFFF' }, // White text
      bold: true,
      size: 11
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFFFFF' } },
      left: { style: 'thin', color: { argb: 'FFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFF' } }
    };
  });

  // Style data rows
  worksheet.eachRow((row:any, rowNumber:any) => {
    if (rowNumber > 1) { // Skip header row
      row.height = 22; // Consistent row height
      
      row.eachCell((cell:any) => {
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      
      // Add zebra striping for better readability (optional)
      if (rowNumber % 2 === 0) {
        row.eachCell((cell:any) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F5F5F5' } // Light gray background
          };
        });
      }
    }
  });

    // Style the headers - get the exact blue color you want
  const headerStyle = {
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1F497D' } // This is the hex color without the #
    },
    font: {
      color: { argb: 'FFFFFF' },
      bold: true
    },
    alignment: {
      horizontal: 'center',
      vertical: 'middle'
    },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  };
  // Apply header style to the last row (total row)
const lastRowIndex = this.TypeReport4.length + 1; // +2 because of header rows
const lastRow = worksheet.getRow(lastRowIndex);

// Merge first two cells for grand total and set the text
lastRow.getCell(1).value = 'Grand Total'; // Clear the first cell
lastRow.getCell(2).value = ''; // Set the text in the second cell
worksheet.mergeCells(`A${lastRowIndex}:B${lastRowIndex}`);

lastRow.eachCell((cell: any) => {
  cell.style = {
    ...headerStyle,
    font: {
      color: { argb: 'FFFFFF' },
      bold: true
    }
  };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
});

  // Generate Excel file
  workbook.xlsx.writeBuffer().then((buffer:any) => {
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    FileSaver.saveAs(blob, 'PT_Case_Pendency_Report.xlsx');
  });
}

// table 4




// table 5

GetConvictionTypeRepot(){
  this.monthlyReportService.GetConvictionTypeRepot().subscribe({
    next: (response) => {
      this.TypeReport5 = response.data;
      this.totalItems5 = this.TypeReport5.length;
      this.cdr.detectChanges(); 
    },
    error: (error) => {
      this.loading = false;
      console.error('Error fetching reports:', error);
    }
  });
}

get pagedUsers5(){
  const startIndex = (this.currentPage5 - 1) * this.itemsPerPage5;
  return this.TypeReport5.slice(startIndex, startIndex + this.itemsPerPage5);
}

get totalPages5(): number[] {
  const totalPages = Math.ceil(this.totalItems5 / this.itemsPerPage5);
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}

changePage5(page: number): void {
  this.currentPage5 = page;
}

nextPage5(): void {
  if (this.currentPage5 < this.totalPages5.length) {
    this.currentPage5++;
  }
}

prevPage5(): void {
  if (this.currentPage5 > 1) {
    this.currentPage5--;
  }
}

exportToExcel5(): void {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('PT Case Pendency Report');

  // Define headers based on the image
  const headers = [
    'SI.',
    'Judgement Type',
    'Number of Cases'
  ];

  // Add header row
  worksheet.addRow(headers);

  // Sample data - replace with your actual data source
  const data = this.TypeReport5.map((item : any, index: any) => [
    index + 1,
    item.Conviction_Type,
    item.case_count
  ]);

  // Add data rows
  data.forEach((row:any) => {
    worksheet.addRow(row);
  });

  // Set column widths
  worksheet.columns = [
    { width: 5 },  // SI.
    { width: 20 }, // District
    { width: 22 }, // PT Total Number of Cases
    { width: 18 }, // Less than one Year
    { width: 12 }, // 1-5 Yrs
    { width: 12 }, // 6-10 Yrs
    { width: 12 }, // 11-15 Yrs
    { width: 12 }, // 16-20 Yrs
    { width: 12 }  // Above 20 Yrs
  ];

  // Styling Constants
  const headerBlue = '1F497D'; // The blue color from your image without #

  // Style headers
  const headerRow = worksheet.getRow(1);
  headerRow.height = 25; // Increase header height for better appearance
  
  headerRow.eachCell((cell:any, colNumber:any) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: headerBlue }
    };
    cell.font = {
      color: { argb: 'FFFFFF' }, // White text
      bold: true,
      size: 11
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFFFFF' } },
      left: { style: 'thin', color: { argb: 'FFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFF' } }
    };
  });

  // Style data rows
  worksheet.eachRow((row:any, rowNumber:any) => {
    if (rowNumber > 1) { // Skip header row
      row.height = 22; // Consistent row height
      
      row.eachCell((cell:any) => {
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      
      // Add zebra striping for better readability (optional)
      if (rowNumber % 2 === 0) {
        row.eachCell((cell:any) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F5F5F5' } // Light gray background
          };
        });
      }
    }
  });

    const headerStyle = {
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1F497D' } // This is the hex color without the #
    },
    font: {
      color: { argb: 'FFFFFF' },
      bold: true
    },
    alignment: {
      horizontal: 'center',
      vertical: 'middle'
    },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

    // Apply header style to the last row (total row)
const lastRowIndex = this.TypeReport5.length + 1; // +2 because of header rows
const lastRow = worksheet.getRow(lastRowIndex);

// Merge first two cells for grand total and set the text
lastRow.getCell(1).value = 'Grand Total'; // Clear the first cell
lastRow.getCell(2).value = ''; // Set the text in the second cell
worksheet.mergeCells(`A${lastRowIndex}:B${lastRowIndex}`);

lastRow.eachCell((cell: any) => {
  cell.style = {
    ...headerStyle,
    font: {
      color: { argb: 'FFFFFF' },
      bold: true
    }
  };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
});

  // Generate Excel file
  const file_name = 'Conviction_for_the_Year_'+this.currentYear+'.xlsx'
  workbook.xlsx.writeBuffer().then((buffer:any) => {
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    FileSaver.saveAs(blob,file_name );
  });
}

// table 5


openMessageBox(report : any) {
  this.fir_id = report.fir_id;
  // const modalElement = document.getElementById('fbmessage');
  // if (modalElement) {
  //   const modal = new bootstrap.Modal(modalElement);
  //   modal.show();
  // }
}

CloseMessageBox() {
  this.reason_Update = '';
  const modalElement = document.getElementById('fbmessage');
  if (modalElement) {
    // Use vanilla JS to hide the modal and remove backdrop
    modalElement.classList.remove('show');
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.style.display = 'none';
    
    // Remove backdrop if present
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    const el = document.getElementById('scrollbar');
    if (el) {
      el.style.overflow = 'auto';
    }
    // Remove body classes added by Bootstrap
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
  }
  
}



MonnthlyUpdateSubmit() {
  console.log('reason_Update', this.reason_Update, this.fir_id)
  if(this.fir_id && this.reason_Update) {
    this.monthlyReportService.MonnthlyUpdate(this.fir_id, this.reason_Update).subscribe({
      next: (response: any) => {
        // Close using JavaScript/DOM instead of Bootstrap Modal method
        // const modalElement = document.getElementById('fbmessage');
        // if (modalElement) {
        //   // Use vanilla JS to hide the modal and remove backdrop
        //   modalElement.classList.remove('show');
        //   modalElement.setAttribute('aria-hidden', 'true');
        //   modalElement.style.display = 'none';
          
        //   // Remove backdrop if present
        //   const backdrop = document.querySelector('.modal-backdrop');
        //   if (backdrop) {
        //     backdrop.remove();
        //   }
          
        //   // Remove body classes added by Bootstrap
        //   document.body.classList.remove('modal-open');
        //   document.body.style.removeProperty('padding-right');
        // }
        // const el = document.getElementById('scrollbar');
        // if (el) {
        //   el.style.overflow = 'auto';
        // }
        // Reset feedback text
        this.reason_Update = '';
        this.fetchMonthlyReports();
      },
    });
  }
}

getCurrentMonthShort(): string {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  return monthNames[now.getMonth()];
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
