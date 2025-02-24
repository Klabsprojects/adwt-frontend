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
  templateUrl: './edit-additional-relief-report.component.html',
  styleUrl: './edit-additional-relief-report.component.scss',
})
export class EditAdditionalReliefReportComponent implements OnInit {
  // Variable Declarations
  searchText: string = '';
  reportData: Array<any> = [];
  filteredData: Array<any> = [];
  saveChangesData: Array<any> = [];
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
  // Filter options
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

  constructor(
    // private firService: FirListTestService,
    private cdr: ChangeDetectorRef,
    public reportsCommonService: ReportsCommonService,
    private additionalReportService: AdditionalReportService,
    private router: Router
  ) {}

  // Initializes component data and fetches necessary information on component load.
  ngOnInit(): void {
    this.displayedColumns = [...this.defaultColumns]; // Initialize default columns
    this.reportsCommonService
      .getAllData()
      .subscribe(({ districts, offences }) => {
        this.districts = districts;
        this.naturesOfOffence = offences;
        this.fetchAdditionalReports();
      });
    this.filteredData = [...this.reportData];
    this.selectedColumns = this.displayedColumns.map((column) => column.field);
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

  // Load all fir reports details into UI
  fetchAdditionalReports(): void {
    this.loading = true;
    this.additionalReportService.getAdditionalReportDetails().subscribe({
      next: (response) => {
        //console.log('Additional Reports:', response.data); // Debugging
        // Transform API response to match frontend structure
        this.reportData = response.data.map((item: { revenue_district: any; police_station: any; fir_number: any; victim_name: any; victim_age: any; victim_gender: any; status: number; offence_committed: string; scst_sections: any; }, index: number) => ({
          sl_no: index + 1,
          revenue_district: item.revenue_district,
          police_station_name: item.police_station,
          fir_number: item.fir_number,
          victim_name: item.victim_name === "NULL" ? '' : item.victim_name,
          age: item.victim_age === "NULL" ? '' : item.victim_age,
          gender: item.victim_gender === "NULL" ? '' : item.victim_gender,
          status: this.reportsCommonService.caseStatusOptions.find(option => option.value === item.status)?.label || '',
          nature_of_offence: (item.offence_committed === "NULL" ? '' : (item.offence_committed || '').replace(/"/g, '')), 
          poa_section: (item.scst_sections || '').replace(/"/g, ''), // Remove double quotes
        }));
        // Update filteredData to reflect the API data
        this.filteredData = [...this.reportData]; 
        this.loading = false;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching reports:', error);
      }
    });
  }

  // Applies filters, assigns serial numbers, and resets pagination
  applyFilters(): void {
    this.filteredData = this.reportsCommonService.applyFilters(
      this.reportData,
      this.searchText,
      this.selectedDistrict,
      this.selectedNatureOfOffence,
      this.selectedStatusOfCase,
      this.selectedStatusOfRelief,
      'revenue_district',
      'nature_of_offence',
      'status'
    );
    this.filteredData = this.filteredData.map((report, index) => ({
      ...report,
      sl_no: index + 1,
    })); // Assign sl_no starting from 1
    this.page = 1; // Reset to the first page
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
    console.log(
      'this.filteredData.slice(startIndex, startIndex + this.itemsPerPage)'
    );
    console.log(
      this.filteredData.slice(startIndex, startIndex + this.itemsPerPage)
    );
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Save Reports
  saveData(): void {
    console.log('Updated Report Data:', this.reportData);
    alert('Data saved successfully!');
  }
}
