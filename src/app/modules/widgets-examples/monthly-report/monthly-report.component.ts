import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import * as xlsx from 'xlsx';
import { MonthlyReportService } from 'src/app/services/monthly-report.service.ts';
import { ReportsCommonService } from 'src/app/services/reports-common.service';

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
  ],
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.scss'],
})
export class MonthlyReportComponent implements OnInit {
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
  status: string[] = ['Just Starting', 'Pending', 'Completed'];
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
      sortable: false,
      sortDirection: null,
    },
    {
      field: 'reasonCurrentMonth',
      label: 'Reason for Status (Current Month)',
      visible: true,
      sortable: false,
      sortDirection: null,
    },
  ];

  caseStatusOptions: string[] = ['Under Investigation', 'Pending Trial'];

  constructor(
    private cdr: ChangeDetectorRef,
    private reportsCommonService: ReportsCommonService,
    private monthlyReportService: MonthlyReportService
  ) {
    //this.getReportdata();
  }

  ngOnInit(): void {
    this.reportsCommonService
      .getAllData()
      .subscribe(({ districts, offences }) => {
        this.districts = districts;
        this.natureOfOffences = offences;
        this.generateDummyData();
      });
    this.filteredData = [...this.reportData];
    this.selectedColumns = this.displayedColumns.map((column) => column.field);
  }

  filterByCaseStatus(): void {
    if (this.selectedCaseStatus) {
      this.filteredData = this.reportData.filter(
        (report) => report.caseStatus === this.selectedCaseStatus
      );
    } else {
      this.filteredData = [...this.reportData];
    }
  }

  getCaseStatusDropdown(): string[] {
    return this.caseStatusOptions;
  }

  generateDummyData(): void {
    for (let i = 1; i <= 50; i++) {
      this.reportData.push({
        sl_no: i,
        policeCity: this.districts[i % this.districts.length],
        stationName: `Station ${i}`,
        firNumber: `FIR-${1000 + i}`,
        natureOfOffence:
          this.natureOfOffences[i % this.natureOfOffences.length],
        poaSection: `Section ${(i % 10) + 1}`,
        noOfVictim: Math.floor(Math.random() * 5) + 1,
        courtDistrict: `Court District ${(i % 3) + 1}`,
        courtName: `Court Name ${(i % 3) + 1}`,
        caseNumber: `CC-${2000 + i}`,
        caseStatus: this.caseStatusOptions[i % this.caseStatusOptions.length],
        uiPendingDays: Math.floor(Math.random() * 100),
        ptPendingDays: Math.floor(Math.random() * 100),
        reasonPreviousMonth: '',
        reasonCurrentMonth: '',
      });
    }
    this.filteredData = [...this.reportData]; // Update filteredData
    this.cdr.detectChanges(); // Trigger change detection
  }

  getPendingData(days: number): string {
    if (!days || days < 0) return 'NA';
    if (days <= 90) return `${days} days`;
    if (days <= 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  }

  onStatusChange(event: Event, record: any): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedStatus = selectElement.value;

    record.caseStatus = selectedStatus;
    if (selectedStatus === 'Under Investigation') {
      record.courtDistrict = 'NA';
      record.courtName = 'NA';
      record.caseNumber = 'NA';
    }
  }
  // saveData(record: any): void {
  //   const index = this.reportData.findIndex((item) => item.sl_no === record.sl_no);
  //   if (index > -1) {
  //     this.reportData[index] = { ...record };
  //     alert('Data saved successfully!');
  //   }
  // }
  saveData(): void {
    console.log('Updated Report Data:', this.reportData);
    alert('Data saved successfully!');
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

  applyFilters(): void {
    this.filteredData = this.reportData.filter((report) => {
      const matchesSearchText = Object.values(report).some((value) =>
        value?.toString().toLowerCase().includes(this.searchText.toLowerCase())
      );
      const matchesDistrict = this.selectedDistrict
        ? report.policeCity === this.selectedDistrict
        : true;
      const matchesNature = this.selectedNatureOfOffence
        ? report.natureOfOffence === this.selectedNatureOfOffence
        : true;
      const matchesStatus = this.selectedStatusOfCase
        ? report.caseStatus === this.selectedStatusOfCase
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

  /*   getReportdata(){
    
    this.service.getReportdata().subscribe(
        (data) => {
          console.log('Fetched report data data:', data); // Debug fetched data
        },
        (error) => {
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
