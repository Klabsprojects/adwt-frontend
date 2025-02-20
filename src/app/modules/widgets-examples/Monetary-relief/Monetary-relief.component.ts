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

@Component({
  selector: 'app-Monetary-relief',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    DragDropModule,
  ],
  providers: [FirListTestService], // Provide the service here
  templateUrl: './Monetary-relief.component.html',
  styleUrls: ['./Monetary-relief.component.scss'],
})
export class MonetaryReliefComponent implements OnInit {
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

  caseStatusOptions: string[] = [
    'FIR Stage',
    'Chargesheet Stage',
    'Trial Stage',
  ];
  reliefStatusOptions: string[] = [
    'FIR Stage Relief Pending',
    'Chargesheet Relief Pending',
    'Trial Stage Relief Pending',
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
  ) {}

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
  onCaseStatusChange(fir: any): void {
    if (fir.case_status === 'FIR Stage') {
      fir.revenue_district = 'N/A';
      fir.police_station_name = 'N/A';
      fir.case_number = 'N/A';
    }
  }

  updateColumnVisibility(): void {
    this.displayedColumns.forEach((column) => {
      column.visible = this.selectedColumns.includes(column.field);
    });
  }

  onColumnSelectionChange(): void {
    this.updateColumnVisibility();
  }

  dropColumn(event: CdkDragDrop<any[]>): void {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }

  // Load all monetaty relief reports details into UI
  fetchMonetaryReliefDetails(): void {
    this.monetaryReliefService.getMonetaryReliefDetails().subscribe({
      next: (response) => {
        console.log('Monetary Reliefs:', response.data); // Debugging
        // Transform API response to match frontend structure
        this.reportData = response.data.map((item: { fir_number: any; police_city: any; police_station: any; status: number; offence_committed: any; victim_name: any; previous_month_reason_for_status: any; current_month_reason_for_status: any; }, index: number) => ({
          sl_no: index + 1,
          fir_id: item.fir_number,
          police_city:  item.police_city,
          police_station: item.police_station,
          status: this.reportsCommonService.getCaseStatus(item.status),
          nature_of_offence: (item.offence_committed === "NULL" ? '' : (item.offence_committed || '').replace(/"/g, '')), 
          case_status: this.reportsCommonService.getCaseStatus(item.status),
          relief_status: (item.status >= 5 && item.status <= 7) 
          ? this.reportsCommonService.getCaseStatus(item.status).replace(' Completed', '') 
          : '',
          victim_name: (item.victim_name === "NULL" ? '' : (item.victim_name || '')),
          reason_previous_month: item.previous_month_reason_for_status || '',
          reason_current_month: item.current_month_reason_for_status || '',
        }));
        // Update filteredData to reflect the API data
        this.filteredData = [...this.reportData]; 
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (error) => {
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
      const matchesDistrict = this.selectedDistrict
        ? fir.district === this.selectedDistrict
        : true;
      const matchesNatureOfOffence = this.selectedNatureOfOffence
        ? fir.nature_of_offence === this.selectedNatureOfOffence
        : true;
      const matchesStatusOfCase = this.selectedStatusOfCase
        ? fir.status_of_case === this.selectedStatusOfCase
        : true;
      const matchesStatusOfRelief = this.selectedStatusOfRelief
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
    const total = this.totalPages();
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.page - 2); // Ensure at least 5 pages are shown
  
    // Adjust if near the end
    if (startPage + maxPagesToShow - 1 > total) {
      startPage = Math.max(1, total - maxPagesToShow + 1);
    }
  
    return Array.from({ length: Math.min(maxPagesToShow, total) }, (_, i) => startPage + i);
  }  

  paginatedData(): any[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Download Reports
  async onBtnExport(): Promise<void> {
    this.loading = true;
    await this.reportsCommonService.exportToExcel(
      this.filteredData,
      this.displayedColumns,
      'Monetary-Reports'
    );
    this.loading = false;
  }
}
