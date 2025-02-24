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
import { MonthlyReportService } from 'src/app/services/monthly-report.service';
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
  templateUrl: './edit-monthly-report.component.html',
  styleUrls: ['./edit-monthly-report.component.scss'],
})
export class EditMonthlyReportComponent implements OnInit {
  // Variable Declarations
  reportData: Array<any> = [];
  filteredData: Array<any> = [];
  searchText: string = '';
  saveChangesData: Array<any> = [];
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
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    public reportsCommonService: ReportsCommonService,
    private monthlyReportService: MonthlyReportService
  ) {}

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
  }

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
      this.loading = true;
      this.monthlyReportService.getMonthlyReportDetail().subscribe({
        next: (response) => {
          //console.log('Monthly Reports:', response.data); // Debugging
          // Transform API response to match frontend structure
          this.reportData = response.data.map((item: { fir_id: any; police_city: any; police_station: any; fir_number: any; offence_committed: any; scst_sections: any; number_of_victim: any; court_district: any; court_name: any; case_number: any; status: number; under_investigation_case_days: any; pending_trial_case_days: any; previous_month_reason_for_status: any; current_month_reason_for_status: any; }, index: number) => ({
            fir_id: item.fir_id,
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
            caseStatus: item.status,
            statusText: this.reportsCommonService.caseStatusOptions.find(option => option.value === item.status)?.label || '',
            uiPendingDays: item.under_investigation_case_days || '',
            ptPendingDays: item.pending_trial_case_days || '',
            reasonPreviousMonth: item.previous_month_reason_for_status || '',
            reasonCurrentMonth: item.current_month_reason_for_status || '',
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

  // Handles the change in casestatus for a specific report record.
  onStatusChange(event: Event, record: any): void {
    const firId = record.fir_id;
    const selectedStatus = record.caseStatus;
    this.updateStatus(firId, selectedStatus);
  }

  // Handles the change in reason for the current month for a specific report.
  onReasonChange(event: Event, report: any) {
    const firId = report.fir_id;
    const reason = report.reasonCurrentMonth;
    this.updateReason(firId, reason);
  }

  // Updates the status of a report in the saveChangesData array.
  updateStatus(firId: string, status: string) {
    // Check if the FIR ID already exists in the array
    const existingEntryIndex = this.saveChangesData.findIndex(entry => entry.fir_id === firId);
    if (existingEntryIndex > -1) {
      // Update existing entry's status
      this.saveChangesData[existingEntryIndex].status = status;
    } else {
      // Add new entry with status
      this.saveChangesData.push({ fir_id: firId, status });
    }
  }

  // Updates the reason for the current month of a report in the saveChangesData array.
  updateReason(firId: string, reason: string) {
    // Check if the FIR ID already exists in the array
    const existingEntryIndex = this.saveChangesData.findIndex(entry => entry.fir_id === firId);
    if (existingEntryIndex > -1) {
      // Update existing entry's reason
      this.saveChangesData[existingEntryIndex].reason_current_month = reason;
    } else {
      // Add new entry with reason
      this.saveChangesData.push({ fir_id: firId, reason_current_month: reason });
    }
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
    this.filteredData = this.reportsCommonService.applyFilters(
      this.reportData,
      this.searchText,
      this.selectedDistrict,
      this.selectedNatureOfOffence,
      this.selectedStatusOfCase,
      this.selectedStatusOfRelief,
      'policeCity', 'natureOfOffence', 'statusText'
    );
    this.filteredData = this.filteredData.map((report, index) => ({...report, sl_no: index + 1 })); // Assign sl_no starting from 1
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
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

// Saves the changes made to the reports, including user ID and missing values.
  saveData(): void {
    const userId = sessionStorage.getItem('userId'); // Retrieve userId from session storage
    // Iterate over each entry in saveChangesData
    this.saveChangesData.forEach(entry => {
      // Add created_by to each entry
      entry.created_by = userId;
      // Check if status or reason_current_month is missing
      if (!entry.status || !entry.reason_current_month) {
        // Find the corresponding report data using fir_id
        const reportDataEntry = this.reportData.find(report => report.fir_id === entry.fir_id);
        // If found, fill in missing values
        if (reportDataEntry) {
          if (!entry.status) {
            entry.status = reportDataEntry.caseStatus; // Assuming caseStatus is the correct field
          }
          if (!entry.reason_current_month) {
            entry.reason_current_month = reportDataEntry.reasonCurrentMonth; // Assuming reasonCurrentMonth is the correct field
          }
        }
      }
    });
    // Call the update API with the modified saveChangesData
    this.monthlyReportService.updateMonthlyReportDetail(this.saveChangesData).subscribe(
      response => {
        //console.log('API response:', response);
        alert('Data saved successfully!');
        this.saveChangesData = []; // Clear the changes after saving
        this.cdr.detectChanges();
      },
      error => {
        //console.error('Error saving data:', error);
        alert('Failed to save data.');
      }
    );
  }
}
