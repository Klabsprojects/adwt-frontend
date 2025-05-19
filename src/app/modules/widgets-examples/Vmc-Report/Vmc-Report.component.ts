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
import { VmcReportService } from 'src/app/services/Vmc-Report.service';
import { ReportsCommonService } from 'src/app/services/reports-common.service';
import { VmcMeetingService } from 'src/app/services/vmc-meeting.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-Vmc-Report',
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
  templateUrl: './Vmc-Report.component.html',
  styleUrls: ['./Vmc-Report.component.scss'],
})
export class VmcReportComponent implements OnInit {
  // Variable Declarations
  searchText: string = '';
  reportData: Array<any> = [];
  filteredData: Array<any> = [];
  page: number = 1;
  itemsPerPage: number = 10;
  isReliefLoading: boolean = true;
  loading: boolean = false;
   loader: boolean = false;
  // Filters
  selectedYear: string = '';
  selectedDistrict: string = '';
  selectedMeetingType: string = '';
  selectedMeetingQuarter: string = '';
  selectedSubDivision: string = '';
  selectedColumns: string[] = [];
  districts: string[] = [];
  subdivisionsMap: string[] = [];

  // Visible Columns Management
  displayedColumns: {
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
      label: 'Year',
      field: 'year',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Meeting Type',
      field: 'meeting_type',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Meeting Quarter',
      field: 'meeting_quarter',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Meeting Date',
      field: 'meeting_date',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Meeting Time',
      field: 'meeting_time',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'District',
      field: 'district',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Sub Division',
      field: 'subdivision',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Meeting Status',
      field: 'meeting_status',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Updated Date',
      field: 'uploaded_date',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
  ];
  currentSortField: string = '';
  isAscending: boolean = true;
  year = ['2025','2024','2023','2022','2021','2020']
  meeting_quater_list = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
  meeting_type_list = ['DLVMC','SDLVMC']
  cumulative_Data: any;
  Parsed_UserInfo : any;

  constructor(
    // private firService: FirListTestService,
    private cdr: ChangeDetectorRef,
    private reportsCommonService: ReportsCommonService,
    private vmcReportService: VmcReportService,
    private vmcMeeting: VmcMeetingService,
    private router: Router
  ) {
     this.loader = true;
    const UserInfo : any = sessionStorage.getItem('user_data');
    this.Parsed_UserInfo = JSON.parse(UserInfo)
    console.log(this.Parsed_UserInfo)
    if(this.Parsed_UserInfo.access_type == 'District'){
      this.meeting_type_list = ['DLVMC','SDLVMC']
      this.vmcMeeting.getDistricts().subscribe((data) => {
        this.cumulative_Data = data;
        this.districts = Object.keys(data);
        this.selectedDistrict = this.Parsed_UserInfo.district;
        this.applyFilters();
        this.getSubdivisions();
        this.cdr.detectChanges();
      });
    } else if(this.Parsed_UserInfo.access_type == 'State'){
      this.meeting_type_list = ['DLVMC','SDLVMC','SLVMC']
      this.applyFilters();
      this.vmcMeeting.getDistricts().subscribe((data) => {
        this.cumulative_Data = data;
        this.districts = Object.keys(data);
        this.cdr.detectChanges();
      });

    }
    // this.getVmcReportList();

  }

  // Initializes component data and fetches necessary information on component load.
  ngOnInit(): void {
    this.filteredData = [...this.reportData];
    this.selectedColumns = this.displayedColumns.map((column) => column.field);
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

  // Load all monetaty relief reports details into UI
  getVmcReportList(): void {
    this.loader = true;
    this.vmcReportService.getVmcReportList().subscribe({
      next: (response) => {
        this.loader = false;
        //console.log('Monetary Reliefs:', response.data); // Debugging
        // Transform API response to match frontend structure
        this.reportData = response.data.map((item: { year: any; meeting_type: any; meeting_quarter: any; meeting_date: number; meeting_time: any; district: any; subdivision: any; meeting_status: any; uploaded_date: any;}, index: number) => ({
          sl_no: index + 1,
          year: item.year,
          meeting_type:  item.meeting_type,
          meeting_quarter: item.meeting_quarter,
          meeting_date: item.meeting_date,
          meeting_time: item.meeting_time,
          district: item.district,
          subdivision: item.subdivision,
          meeting_status: item.meeting_status,
          uploaded_date: item.uploaded_date
          
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

  
getFilterParams() {
  const params: any = {};
  
  if (this.searchText) {
    params.search = this.searchText;
  }
  
  if (this.selectedYear) {
    params.year = this.selectedYear;
  }

  if (this.selectedMeetingType) {
    params.meeting_type = this.selectedMeetingType;
  }

  if (this.selectedMeetingQuarter) {
    params.meeting_quarter = this.selectedMeetingQuarter;
  }
  
  if (this.selectedDistrict) {
    if(this.Parsed_UserInfo.access_type == 'District'){
      params.district = this.Parsed_UserInfo.district;
    } else {
      params.district = this.selectedDistrict;
    }
  }

  if (this.selectedSubDivision) {
    params.subdivision = this.selectedSubDivision;
  }
  
  return params;
}

  // Applies filters, assigns serial numbers, and resets pagination
  applyFilters(): void {
    this.loader = true;
    this.vmcReportService.getVmcReportList(this.getFilterParams()).subscribe({
      next: (response) => {
        //console.log('Monetary Reliefs:', response.data); // Debugging
        // Transform API response to match frontend structure
        this.reportData = response.data.map((item: { year: any; meeting_type: any; meeting_quarter: any; meeting_date: number; meeting_time: any; district: any; subdivision: any; meeting_status: any; uploaded_date: any;}, index: number) => ({
          sl_no: index + 1,
          year: item.year,
          meeting_type:  item.meeting_type,
          meeting_quarter: item.meeting_quarter,
          meeting_date: item.meeting_date,
          meeting_time: item.meeting_time,
          district: item.district,
          subdivision: item.subdivision,
          meeting_status: item.meeting_status,
          uploaded_date: item.uploaded_date
          
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

  clearfilter(){
    this.searchText = '';
    this.selectedMeetingType = '';
    this.selectedYear = '';
    this.selectedMeetingQuarter = '';
    this.selectedDistrict = '';
    this.selectedSubDivision = '';
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
      'VMC Report'
    );
  }

  getSubdivisions(){
    if(this.selectedDistrict){
      this.subdivisionsMap = this.cumulative_Data[this.selectedDistrict];
    }
    else{
      this.subdivisionsMap = [];
    }
  }
}
