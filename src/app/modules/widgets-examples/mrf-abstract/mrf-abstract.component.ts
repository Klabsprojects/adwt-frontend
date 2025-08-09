import { ChangeDetectorRef, Component } from '@angular/core';
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
  searchText: string = '';
  reportData: Array<any> = [];
  filteredData: Array<any> = [];
  page: number = 1;
  itemsPerPage: number = 40;
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
  payload = {
    district: this.selectedDistrict || "",
    police_city: this.selectedPoliceCity || "",
    Status_Of_Case: "", // Add if needed
    police_zone: this.selectedZone || "",
    Filter_From_Date: this.selectedFromDate || "",
    Filter_To_Date: this.selectedToDate || ""
  };

  
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
// ✅ Group: FIR
  {
    label: 'Proposal sent to DC',
    field: 'fir_proposal_sent_to_dc',
    group: 'FIR',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Relief Given',
    field: 'fir_relief_given',
    group: 'FIR',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Relief Pending',
    field: 'fir_relief_pending',
    group: 'FIR',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  
  // ✅ Group: CHARGESHEET
  {
    label: 'Proposal sent to DC',
    field: 'chargesheet_proposal_sent_to_dc',
    group: 'CHARGESHEET',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Relief Given',
    field: 'chargesheet_relief_given',
    group: 'CHARGESHEET',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Relief Pending',
    field: 'chargesheet_relief_pending',
    group: 'CHARGESHEET',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  
  // ✅ Group: TRIAL Stage (spelling corrected from "TRAIL")
  {
    label: 'Proposal sent to DC',
    field: 'trial_proposal_sent_to_dc',
    group: 'TRIAL',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Relief Given',
    field: 'trial_relief_given',
    group: 'TRIAL',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Relief Pending',
    field: 'trial_relief_pending',
    group: 'TRIAL',
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
    private cdr: ChangeDetectorRef,
    private reportsCommonService: ReportsCommonService,
    private mrfAbstractService: mrfAbstractService,
    private router: Router,
     private dashboardService: DashboardService
  ) {
    this.loader = true;
  }

  groupedBySection: { [group: string]: DisplayedColumn[] } = {};
  groupOrder = ['FIR', 'CHARGESHEET', 'TRIAL'];

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
        this.fetchMrfAbstract();
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
onBtnExport(): void {
  // Define multi-row headers
  const headers = [
    ['Sl. No.', 'District', 'Total Cases', 'FIR', '', '', 'CHARGESHEET', '', '', 'TRIAL', '', ''],
    ['', '', '', 'Proposal sent to DC', 'Relief Given', 'Relief Pending', 'Proposal sent to DC', 'Relief Given', 'Relief Pending', 'Proposal sent to DC', 'Relief Given', 'Relief Pending']
  ];

  const data = this.filteredData.map((item, index) => [
    index + 1,
    item.revenue_district,
    item.total_cases,
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
    '', // Sl. No.
    'Total', // District column
    this.sumByKey('total_cases'),
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

  // Define merged cells
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Sl. No.
    { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // District
    { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Total Cases
    { s: { r: 0, c: 3 }, e: { r: 0, c: 5 } }, // FIR
    { s: { r: 0, c: 6 }, e: { r: 0, c: 8 } }, // CHARGESHEET
    { s: { r: 0, c: 9 }, e: { r: 0, c: 11 } } // TRIAL
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
      { content: 'FIR', colSpan: 3 },
      { content: 'CHARGESHEET', colSpan: 3 },
      { content: 'TRIAL', colSpan: 3 }
    ],
    [
      { content: 'Proposal sent to DC' },
      { content: 'Relief Given' },
      { content: 'Relief Pending' },
      { content: 'Proposal sent to DC' },
      { content: 'Relief Given' },
      { content: 'Relief Pending' },
      { content: 'Proposal sent to DC' },
      { content: 'Relief Given' },
      { content: 'Relief Pending' }
    ]
  ];

  // Table body data
  const body = this.filteredData.map((item: any, index: number) => [
    index + 1,
    item.revenue_district,
    item.total_cases,
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


applyFilters() {
  const payload = {
    district: this.selectedDistrict || "",
    police_city: this.selectedPoliceCity || "",
    police_zone: this.selectedZone || "",
    Filter_From_Date: this.selectedFromDate || "",
    Filter_To_Date: this.selectedToDate || ""
  };
  this.mrfAbstractService.getMrfAbstractDetails(payload).subscribe({
    next: (response: any) => {
     this.reportData = (response.data || [])
        .filter((item: any) => item.revenue_district && item.revenue_district.trim() !== '') // 🔍 Filter non-empty district
        .map((item: any, index: number) => ({
          sl_no: index + 1,
          revenue_district: item.revenue_district,
          total_cases: item.total_cases,
          fir_proposal_sent_to_dc: item.fir_proposal_sent_to_dc,
          fir_relief_given: item.fir_relief_given,
          fir_relief_pending: item.fir_relief_pending,
          chargesheet_proposal_sent_to_dc: item.chargesheet_proposal_sent_to_dc,
          chargesheet_relief_given: item.chargesheet_relief_given,
          chargesheet_relief_pending: item.chargesheet_relief_pending,
          trial_proposal_sent_to_dc: item.trial_proposal_sent_to_dc,
          trial_relief_given: item.trial_relief_given,
          trial_relief_pending: item.trial_relief_pending
        }));

      this.filteredData = [...this.reportData];
      this.loader = false;
      this.cdr.detectChanges(); // Trigger change detection
    },
    error: (error) => {
      console.error('Error fetching data', error);
    }
  });
}

totalRow: any = {}; // Already declared

fetchMrfAbstract(): void {
  this.loader = true;

  this.mrfAbstractService.getMrfAbstractDetails(this.payload).subscribe({
    next: (response: any) => {
      const data = (response.data || []).filter(
        (item: any) => item.revenue_district && item.revenue_district.trim() !== ''
      );

      const totals: { [key: string]: any } = {
        sl_no: '',
        revenue_district: 'Total',
        total_cases: 0,
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

      // Store total row for external use if needed
      this.totalRow = totals;

      // Append total row at the bottom
      // this.reportData.push(totals);

      // Set filtered data for table
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

}
 interface DisplayedColumn {
  label: string;
  field: string;
  group: any;
  sortable: boolean;
  visible: boolean;
  sortDirection: 'asc' | 'desc' | null;
}