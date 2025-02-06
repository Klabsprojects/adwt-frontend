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
      sortable: false,
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
      sortable: false,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'Reason for Status (Current Month)',
      field: 'reason_current_month',
      sortable: false,
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reportsCommonService
      .getAllData()
      .subscribe(({ districts, offences }) => {
        this.districts = districts;
        this.naturesOfOffence = offences;
        this.generateDummyData();
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

  // Load FIR list from the backend (dummy data for now)
  generateDummyData(): void {
    for (let i = 1; i <= 15; i++) {
      this.reportData.push({
        sl_no: i,
        fir_id: `FIR-${1000 + i}`,
        police_city: this.districts[i % this.districts.length],
        police_station: `Station ${i}`,
        status: '',
        nature_of_offence:
          this.naturesOfOffence[i % this.naturesOfOffence.length],
        case_status: this.caseStatusOptions[i % this.caseStatusOptions.length],
        relief_status: 'Relief Pending',
        victim_name: `Victim ${i}`,
        reason_previous_month: 'Pending',
        reason_current_month: 'In Progress',
      });
    }
    this.filteredData = [...this.reportData]; // Update filteredData
    this.cdr.detectChanges(); // Trigger change detection
  }

  // Apply filters to the FIR list
  applyFilters(): void {
    this.filteredData = this.reportData.filter((report) => {
      const matchesSearchText = Object.values(report).some((value) =>
        value?.toString().toLowerCase().includes(this.searchText.toLowerCase())
      );

      const matchesDistrict = this.selectedDistrict
        ? report.police_city === this.selectedDistrict
        : true;
      const matchesNature = this.selectedNatureOfOffence
        ? report.nature_of_offence === this.selectedNatureOfOffence
        : true;
      const matchesStatus = this.selectedStatusOfCase
        ? report.case_status === this.selectedStatusOfCase
        : true;
      return (
        matchesSearchText && matchesDistrict && matchesNature && matchesStatus
      );
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
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
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
      this.displayedColumns
    );
    this.loading = false;
  }
}
