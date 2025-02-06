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
  ],
  providers: [FirListTestService],
  templateUrl: './additional-relief-report.component.html',
  styleUrl: './additional-relief-report.component.scss'
})
export class AdditionalReliefReportComponent implements OnInit{
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
  districts: string[] = [];
  naturesOfOffence: string[] = [];

  statusesOfCase: string[] = ['Just Starting', 'Pending', 'Completed'];
  statusesOfRelief: string[] = ['FIR Stage', 'ChargeSheet Stage', 'Trial Stage'];
  typeOfAdditionalReleif: string[] = ['Employment', 'Pension', 'House Site patta', 'Education Concession'];

  
  // Displayed Columns
  displayedColumns: { label: string; field: string; sortable: boolean; visible: boolean;sortDirection: 'asc' | 'desc' | null; }[] = [];

  // Default Columns
  defaultColumns: { label: string; field: string; sortable: boolean; visible: boolean;sortDirection: 'asc' | 'desc' | null; }[] = [
    { label: 'Sl. No.', field: 'sl_no', sortable: false, visible: true, sortDirection: null  },
    { label: 'Revenue District', field: 'revenue_district', sortable: true, visible: true, sortDirection: null  },
    { label: 'Police Station Name', field: 'police_station_name', sortable: true, visible: true, sortDirection: null  },
    { label: 'FIR Number', field: 'fir_number', sortable: true, visible: true, sortDirection: null  },
    { label: 'Victim Name', field: 'victim_name', sortable: true, visible: true, sortDirection: null  },
    { label: 'Age', field: 'age', sortable: true, visible: true, sortDirection: null  },
    { label: 'Gender', field: 'gender', sortable: true, visible: true, sortDirection: null  },
    { label: 'Nature of Offence', field: 'nature_of_offence', sortable: true, visible: true, sortDirection: null  },
    { label: 'Section of the PoA Act invoked for the offence', field: 'poa_section', sortable: true, visible: true, sortDirection: null  },
  ];

  // Column Configurations for Additional Relief Types
  columnConfigs = {
    Employment: [
      { label: 'Status', field: 'status', sortable: true, visible: true, sortDirection: null  },
      { label: 'Reason for Job pending - Previous Month', field: 'reason_job_pending_previous', sortable: true, visible: true, sortDirection: null  },
      { label: 'If "OTHERS" option is selected enter valid reasons - Previous Month', field: 'others_reason_previous', sortable: true, visible: true, sortDirection: null  },
      { label: 'Reason for Job pending - Current Month', field: 'reason_job_pending_current', sortable: true, visible: true, sortDirection: null  },
      { label: 'If "OTHERS" option is selected enter valid reasons - Current Month', field: 'others_reason_current', sortable: true, visible: true, sortDirection: null  },
    ],
    Pension: [
      { label: 'Status', field: 'status', sortable: true, visible: true, sortDirection: null  },
      { label: 'Reason for Pension pending - Previous Month', field: 'reason_pension_pending_previous', sortable: true, visible: true, sortDirection: null  },
      { label: 'If "OTHERS" option is selected enter the valid reason - Previous Month', field: 'others_reason_previous', sortable: true, visible: true, sortDirection: null  },
      { label: 'Reason for Pension pending - Current Month', field: 'reason_pension_pending_current', sortable: true, visible: true, sortDirection: null  },
      { label: 'If "OTHERS" option is selected enter the valid reason - Current Month', field: 'others_reason_current', sortable: true, visible: true, sortDirection: null  },
    ],
    HouseSitePatta: [
      { label: 'Status', field: 'status', sortable: true, visible: true, sortDirection: null  },
      { label: 'Reason for Patta pending - Previous Month', field: 'reason_patta_pending_previous', sortable: true, visible: true, sortDirection: null  },
      { label: 'If "OTHERS" option is selected enter the valid reason - Previous Month', field: 'others_reason_previous', sortable: true, visible: true, sortDirection: null  },
      { label: 'Reason for Patta pending - Current Month', field: 'reason_patta_pending_current', sortable: true, visible: true, sortDirection: null  },
      { label: 'If "OTHERS" option is selected enter the valid reason - Current Month', field: 'others_reason_current', sortable: true, visible: true, sortDirection: null  },
    ],
    EducationConcession: [
      { label: 'Status of the Current Month', field: 'status', sortable: true, visible: true, sortDirection: null  },
      { label: 'Reason for Education concession  pending - Previous Month', field: 'reason_patta_pending_previous', sortable: true, visible: true, sortDirection: null  },
      { label: 'If "OTHERS" option is selected enter the valid reason - Previous Month', field: 'others_reason_previous', sortable: true, visible: true, sortDirection: null  },
      { label: 'Reason for Education Concession pending - Current Month', field: 'reason_patta_pending_current', sortable: true, visible: true, sortDirection: null  },
      { label: 'If "OTHERS" option is selected enter the valid reason - Current Month', field: 'others_reason_current', sortable: true, visible: true, sortDirection: null  },
    ],
  };

  currentSortField: string = '';
  isAscending: boolean = true;

  constructor(
    // private firService: FirListTestService,
    private cdr: ChangeDetectorRef,
    private reportsCommonService: ReportsCommonService,
    private router: Router
  ) {
    //this.getReportdata()
  }

  ngOnInit(): void {
    this.displayedColumns = [...this.defaultColumns];// Initialize default columns
    this.reportsCommonService
      .getAllData()
      .subscribe(({ districts, offences }) => {
        this.districts = districts;
        this.naturesOfOffence = offences;
        this.generateDummyData();
      });
    this.filteredData = [...this.reportData];
    this.selectedColumns = this.displayedColumns.map(column => column.field);
  }
  updateDisplayedColumns(): void {
    console.log('Selected Type:', this.selectedtypeOfAdditionalReleif); // Debugging log
    switch (this.selectedtypeOfAdditionalReleif) {
      case 'Employment':
        this.displayedColumns = [...this.defaultColumns, ...this.columnConfigs.Employment];
        break;
      case 'Pension':
        this.displayedColumns = [...this.defaultColumns, ...this.columnConfigs.Pension];
        break;
      case 'House Site patta':
        this.displayedColumns = [...this.defaultColumns, ...this.columnConfigs.HouseSitePatta];
        break;
      case 'Education Concession':
        this.displayedColumns = [...this.defaultColumns, ...this.columnConfigs.EducationConcession];
        break;
      default:
        this.displayedColumns = [...this.defaultColumns]; // Fallback to default columns
        break;
    }
    // Set all columns to visible
    this.displayedColumns.forEach(column => {
      column.visible = true; // Set each column's visible property to true
    });
    // Update selectedColumns based on displayedColumns
    this.selectedColumns = this.displayedColumns.filter(column => column.visible).map(column => column.field);
    console.log('Updated Columns:', this.displayedColumns); // Debugging log
  }

  updateColumnVisibility(): void {
    this.displayedColumns.forEach(column => {
      column.visible = this.selectedColumns.includes(column.field);
    });
  }

  onColumnSelectionChange(): void {
    this.updateColumnVisibility();
  }
  
  dropColumn(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }


  // Load FIR list from the backend (dummy data for now)
  generateDummyData(): void {
    for (let i = 1; i <= 15; i++) {
      this.reportData.push({
        sl_no: i,
        revenue_district: this.districts[i % this.districts.length],
        police_station_name: 'Station ' + (i + 1),
        fir_number: 'FIR-' + (i + 1000),
        victim_name: 'Victim ' + (i + 1),
        age: 20 + i,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        nature_of_offence: this.naturesOfOffence[i % this.naturesOfOffence.length],
        poa_section: 'Section ' + (i % 5 + 1),
        status: i % 2 === 0 ? 'Completed' : 'Pending',
        reason_job_pending_previous: 'Reason ' + i,
        others_reason_previous: i % 3 === 0 ? 'Other Reason ' + i : '',
        reason_job_pending_current: 'Reason ' + (i + 1),
        others_reason_current: i % 4 === 0 ? 'Other Reason ' + i : '',
      });
    }
    this.filteredData = [...this.reportData]; // Update filteredData
    this.cdr.detectChanges(); // Trigger change detection
  }

  // Apply filters to the FIR list
  applyFilters(): void {
    this.filteredData = this.reportData.filter(report => {
      const matchesSearchText = Object.values(report)
        .some(value => value?.toString().toLowerCase().includes(this.searchText.toLowerCase()));

      const matchesDistrict = this.selectedDistrict ? report.revenue_district === this.selectedDistrict : true;
      const matchesNature = this.selectedNatureOfOffence ? report.nature_of_offence === this.selectedNatureOfOffence : true;
      
      return matchesSearchText && matchesDistrict && matchesNature;
    });
    this.filteredData = this.filteredData.map((report, index) => ({...report, sl_no: index + 1 })); // Assign sl_no starting from 1
    const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage); // Reset page if filteredData is empty or if the current page exceeds the number of pages
    if (this.page > totalPages) {
        this.page = 1; // Reset to the first page
    }
  }

  // Filtered FIR list based on search and filter criteria
  filteredFirList() {
    const searchLower = this.searchText.toLowerCase();

    return this.filteredData.filter((fir) => {
      // Apply search filter
      const matchesSearch =
        fir.fir_id.toString().includes(searchLower) ||
        (fir.police_city || '').toLowerCase().includes(searchLower) ||
        (fir.police_station || '').toLowerCase().includes(searchLower) ||
        (fir.nature_of_offence || '').toLowerCase().includes(searchLower) ||
        (fir.case_status || '').toLowerCase().includes(searchLower);

      // Apply dropdown filters
      const matchesDistrict =
        this.selectedDistrict ? fir.district === this.selectedDistrict : true;
      const matchesNatureOfOffence =
        this.selectedNatureOfOffence
          ? fir.nature_of_offence === this.selectedNatureOfOffence
          : true;
      const matchesStatusOfCase =
        this.selectedStatusOfCase ? fir.status_of_case === this.selectedStatusOfCase : true;
      const matchesStatusOfRelief =
        this.selectedStatusOfRelief
          ? fir.status_of_relief === this.selectedStatusOfRelief
          : true;

      return (
        matchesSearch &&
        matchesDistrict &&
        matchesNatureOfOffence &&
        matchesStatusOfCase &&
        matchesStatusOfRelief
      );
    });
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

  previousPage(): void {
    if (this.page > 1) this.page--;
  }

  nextPage(): void {
    if (this.page < this.totalPages()) this.page++;
  }

  totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  paginatedData(): any[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    console.log('this.filteredData.slice(startIndex, startIndex + this.itemsPerPage)');
    console.log(this.filteredData.slice(startIndex, startIndex + this.itemsPerPage));
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  /* getReportdata(){
    
    this.firService.getReportdata().subscribe(
        (data : any) => {
          console.log('Fetched report data data:', data);
          this.filteredData = data.Data;
        },
        (error : any) => {
          console.error('Error fetching attendees:', error);
          // Swal.fire('Error', 'Failed to fetch meeting data.', 'error');
        }
      );
  } */

  // Download Reports
  async onBtnExport(): Promise<void> {
    this.loading = true;
    await this.reportsCommonService.exportToExcel(
      this.filteredData,
      this.displayedColumns
    );
    this.loading = false;
  }

}

