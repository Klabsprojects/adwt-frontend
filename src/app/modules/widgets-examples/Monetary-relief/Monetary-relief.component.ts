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
import { MonetaryReliefService } from 'src/app/services/monetary-relief.service';
import { ReportsCommonService } from 'src/app/services/reports-common.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-monetary-relief',
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
  templateUrl: './monetary-relief.component.html',
  styleUrls: ['./monetary-relief.component.scss'],
})
export class MonetaryReliefComponent implements OnInit {
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
      label: 'FIR No.',
      field: 'fir_id',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Police City/District',
      field: 'police_city',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Police Station Name',
      field: 'police_station',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Status',
      field: 'status',
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
      label: 'Case Status',
      field: 'case_status',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Relief Status',
      field: 'relief_status',
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
      label: 'Reason for Status (Previous Month)',
      field: 'reason_previous_month',
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Reason for Status (Current Month)',
      field: 'reason_current_month',
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
    private monetaryReliefService: MonetaryReliefService,
    private router: Router
  ) {
    this.loader = true;
  }

  // Initializes component data and fetches necessary information on component load.
  ngOnInit(): void {
    this.reportsCommonService
      .getAllData()
      .subscribe(({ districts, offences }) => {
        this.districts = districts;
        this.naturesOfOffence = offences;
        this.fetchMonetaryReliefDetails();
      });
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
  fetchMonetaryReliefDetails(): void {
    this.loader = true;
    this.monetaryReliefService.getMonetaryReliefDetails().subscribe({
      next: (response) => {
        //console.log('Monetary Reliefs:', response.data); // Debugging
        // Transform API response to match frontend structure
        this.reportData = response.data.map((item: { fir_number: any; police_city: any; police_station: any; status: number; offence_committed: any; victim_name: any; previous_month_reason_for_status: any; current_month_reason_for_status: any; relief_status: any;}, index: number) => ({
          sl_no: index + 1,
          fir_id: item.fir_number,
          police_city:  item.police_city,
          police_station: item.police_station,
          status: this.reportsCommonService.caseStatusOptions.find(option => option.value === item.status)?.label || '',
          nature_of_offence: (item.offence_committed === "NULL" ? '' : (item.offence_committed || '').replace(/"/g, '')), 
          case_status: this.reportsCommonService.caseStatusOptions.find(option => option.value === item.status)?.label || '',
          relief_status: this.reportsCommonService.reliefStatusOptions.find(option => option.value === item.relief_status)?.label || '',
          victim_name: (item.victim_name === "NULL" ? '' : (item.victim_name || '')),
          reason_previous_month: item.previous_month_reason_for_status || '',
          reason_current_month: item.current_month_reason_for_status || '',
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

  // Applies filters, assigns serial numbers, and resets pagination
  applyFilters(): void {
    this.filteredData = this.reportsCommonService.applyFilters(
      this.reportData,
      this.searchText,
      this.selectedDistrict,
      this.selectedNatureOfOffence,
      this.selectedStatusOfCase,
      this.selectedStatusOfRelief,
      'police_city',
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
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Download Reports
  async onBtnExport(): Promise<void> {
    await this.reportsCommonService.exportToExcel(
      this.filteredData,
      this.displayedColumns,
      'Monetary-Reports'
    );
  }
}
