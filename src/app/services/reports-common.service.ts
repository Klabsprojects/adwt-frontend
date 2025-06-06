import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DistrictService } from './district.service';
import { OffenceService } from './offence.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import * as xlsx from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ReportsCommonService {

  constructor(
    private http: HttpClient,
    private districtService: DistrictService,
    private offenceService: OffenceService
  ) {}

  // Fetches all district names from the district service and maps them to a string array.
  getAllDistricts(): Observable<string[]> {
    return this.districtService
      .getAllDistricts()
      .pipe(
        map((districts: { district_name: string }[]) =>
          districts.map((district) => district.district_name)
        )
      );
  }

  // Fetches all offence names from the offence service and maps them to a string array.
  getAllOffences(): Observable<string[]> {
    return this.offenceService
      .getAllOffences()
      .pipe(
        map((offences: { offence_name: string }[]) =>
          offences.map((offence) => offence.offence_name)
        )
      );
  }

  // Fetches both districts and offences simultaneously using forkJoin.
  getAllData(): Observable<{ districts: string[]; offences: string[] }> {
    return forkJoin({
      districts: this.getAllDistricts(),
      offences: this.getAllOffences(),
    });
  }

  // Converts pending days into a readable format (days, months, or years).
  formatPendingDays(days: number): string {
    if (!days || days < 0) return 'NA';
    if (days <= 90) return `${days} days`;
    if (days <= 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  }

  // Sorts a given dataset based on a specific field and maintains sorting order.
  sortTable(data: any[], field: string, currentSortField: string, isAscending: boolean): { sortedData: any[], newSortField: string, newIsAscending: boolean } {
    let newIsAscending = isAscending;
    if (currentSortField === field) {
      newIsAscending = !isAscending;
    } else {
      currentSortField = field;
      newIsAscending = true;
    }
    const sortedData = [...data].sort((a, b) => {
      const valA = a[field]?.toString().toLowerCase() || '';
      const valB = b[field]?.toString().toLowerCase() || '';
      return newIsAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    // Reassign sl_no after sorting
    sortedData.forEach((item, index) => {
        item.sl_no = index + 1;
    });
    return { sortedData, newSortField: field, newIsAscending };
  }

  // Returns the appropriate sort icon class based on sorting state.
  getSortIcon(field: string, currentSortField: string, isAscending: boolean): string {
    return currentSortField === field
      ? isAscending
        ? 'fa-sort-up'
        : 'fa-sort-down'
      : 'fa-sort';
  }

  // Exports filtered table data to an Excel file, considering only visible columns.
  async exportToExcel(
    filteredData: any[],
    displayedColumns: any[],
    fileName: string
  ): Promise<void> {
    try {
      if (filteredData.length === 0) {
        alert('No Data Found');
        return;
      }
      // Filter visible columns
      const visibleColumns = displayedColumns.filter(
        (column) => column.visible
      );
      // Prepare data for export
      const exportData = filteredData.map((item, index) => {
        const exportedItem: any = { 'S.No': index + 1 };
        visibleColumns.forEach((column) => {
          const key = column.field; // Field name in data
          const label = column.label; // Label in Excel file
          if (key === 'sl_no') return; // Skip "Sl. No."
          if (key in item) {
            // Format specific fields if necessary
            if (key === 'uiPendingDays' || key === 'ptPendingDays') {
              exportedItem[label] = this.formatPendingDays(item[key]); // Corrected method name
            } else {
              exportedItem[label] = item[key];
            }
          }
        });
        return exportedItem;
      });
      // Export data to Excel
      await this.exportExcel(exportData,fileName);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }

  // Converts JSON data into an Excel worksheet and triggers the download.
  private async exportExcel(list: any[],fileName: string): Promise<void> {
    const xlsx = await import('xlsx');
    const worksheet = xlsx.utils.json_to_sheet(list);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  // Saves the provided Excel buffer as a downloadable file with the appropriate format.
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '' + EXCEL_EXTENSION);
  }

  // To Return the corresponding case status label based on the provided index.
  caseStatusOptions = [
      { value: 0, label: 'FIR Draft' },
      { value: 1, label: 'Pending | FIR Stage | Step 1 Completed' },
      { value: 2, label: 'Pending | FIR Stage | Step 2 Completed' },
      { value: 3, label: 'Pending | FIR Stage | Step 3 Completed' },
      { value: 4, label: 'Pending | FIR Stage | Step 4 Completed' },
      { value: 5, label: 'Completed | FIR Stage' },
      { value: 6, label: 'Charge Sheet Completed' },
      { value: 7, label: 'Trial Stage Completed' },
      { value: 8, label: 'This Case is Altered Case' },
      { value: 9, label: 'Mistake Of Fact' }
  ];

  // To Return the corresponding case relief status label based on the provided index.
  reliefStatusOptions = [
    { value: 1, label: 'FIR Stage' },
    { value: 2, label: 'Charge Sheet' },
    { value: 3, label: 'Trial Stage' }
  ];

  // Filters report data based on search text, district, nature of offense, case status, and relief status
  applyFilters(
    reportData: any[],
    searchText: string,
    selectedDistrict: string,
    selectedNatureOfOffence: string,
    selectedStatusOfCase: string,
    selectedStatusOfRelief: string,
    districtKey: string,
    offenceKey: string,
    caseStatusKey: string
  ): any[] {
    return reportData.filter((report) => {
      const matchesSearchText = Object.values(report).some((value) =>
        value?.toString().toLowerCase().includes(searchText.toLowerCase())
      );
      const district = report[districtKey];
      const offence = report[offenceKey];
      let caseStatus = report[caseStatusKey];
      if (caseStatus.includes('Pending |') && caseStatus.includes('Completed')) { // Check if caseStatus contains both 'Pending' and 'Completed'
        caseStatus = caseStatus.replace('Completed', '').trim(); // Remove 'Completed' from caseStatus
      }
      const matchesDistrict = selectedDistrict ? district?.includes(selectedDistrict) : true;
      const matchesNature = selectedNatureOfOffence ? offence?.includes(selectedNatureOfOffence) : true;
      const matchesStatus = selectedStatusOfCase
        ? (selectedStatusOfCase === 'Just Starting' && caseStatus === 'FIR Draft') ||
          (selectedStatusOfCase === 'Pending' && caseStatus.includes('Pending')) ||
          (selectedStatusOfCase === 'Completed' && caseStatus.includes('Completed'))
        : true;
      const matchesReliefStatus = selectedStatusOfRelief
        ? (selectedStatusOfRelief === 'FIR Stage' && caseStatus.includes('FIR Stage')) ||
          (selectedStatusOfRelief === 'ChargeSheet Stage' && caseStatus.includes('Charge Sheet')) ||
          (selectedStatusOfRelief === 'Trial Stage' && caseStatus.includes('Trial'))
        : true;

      return matchesSearchText && matchesDistrict && matchesNature && matchesStatus && matchesReliefStatus;
    });
  }
  applyFiltersMonthly(
  reportData: any[],
  searchText: string,
  selectedDistrict: string,
  selectedNatureOfOffence: string,
  selectedStatusOfCase: string,
  selectedStatusOfRelief: string,
  districtKey: string,
  offenceKey: string,
  caseStatusKey: string,
  selectedStatus: string,
  selectedDistricts: string | string[],
  selectedCommunity: string,
  selectedCaste: string,
  selectedZone: string,
  selectedOffence: string | string[],
  selectedPoliceCity: string,
  selectedFromDate: string,
  selectedToDate: string
): any[] {
  console.log("reportData", reportData);
  return reportData.filter((report) => {
    // Helper function to check if a value matches (handles strings and arrays)
    const matchesField = (reportValue: any, filterValue: any, isPartialMatch: boolean = false) => {
      // Skip empty, undefined, or null filters
      if (filterValue === undefined || filterValue === null || filterValue === '') {
        return true;
      }
      // Handle array-based filters (e.g., selectedDistricts, selectedOffence)
      if (Array.isArray(filterValue)) {
        return filterValue.includes(String(reportValue));
      }
      // Partial matching for strings
      if (isPartialMatch && typeof reportValue === 'string' && typeof filterValue === 'string') {
        return reportValue.toLowerCase().includes(filterValue.toLowerCase());
      }
      // Exact matching
      return String(reportValue) === String(filterValue);
    };

    // Date range filtering
    const matchesDateRange = () => {
      if (!selectedFromDate || !selectedToDate) {
        return true; // Skip if either date is not set
      }
      const reportDate = report.reportDate; // Adjust to your date field name
      if (!reportDate) {
        return false;
      }
      const from = new Date(selectedFromDate);
      const to = new Date(selectedToDate);
      const reportDateObj = new Date(reportDate);
      return reportDateObj >= from && reportDateObj <= to;
    };

    // Search text applies to specific fields (e.g., firNumber, stationName)
    const matchesSearchText = searchText
      ? report.firNumber?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        report.stationName?.toString().toLowerCase().includes(searchText.toLowerCase())
      : true;

    // Field-specific matches
    const matchesDistrict = matchesField(report[districtKey], selectedDistrict);
    const matchesNature = matchesField(report[offenceKey], selectedNatureOfOffence);
    const matchesDistricts = matchesField(report[districtKey], selectedDistricts);
    const matchesOffence = matchesField(report[offenceKey], selectedOffence);
    const matchesCommunity = matchesField(report.community, selectedCommunity);
    const matchesCaste = matchesField(report.caste, selectedCaste);
    const matchesZone = matchesField(report.zone, selectedZone);
    const matchesPoliceCity = matchesField(report.policeCity, selectedPoliceCity);

    // Handle caseStatus as a number
    const caseStatus = report[caseStatusKey];

    // Mapping for caseStatus to UI/PT status
    const statusMap: { [key: number]: string } = {
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
    };

    // Mapping for caseStatus to descriptive status (for matchesStatus and matchesReliefStatus)
    const caseStatusMap: { [key: number]: string } = {
      1: 'FIR Draft',
      2: 'Pending',
      3: 'Charge Sheet',
      4: 'Trial',
      5: 'Completed',
      // Add more mappings as needed
    };

    const caseStatusString = caseStatusMap[caseStatus] || String(caseStatus);
    const uiPtStatus = statusMap[caseStatus] || '';

    // Case status logic
    const matchesStatus = selectedStatusOfCase
      ? (selectedStatusOfCase === 'Just Starting' && caseStatusString === 'FIR Draft') ||
        (selectedStatusOfCase === 'Pending' && caseStatusString.includes('Pending')) ||
        (selectedStatusOfCase === 'Completed' && caseStatusString.includes('Completed'))
      : true;

    // Relief status logic
    const matchesReliefStatus = selectedStatusOfRelief
      ? (selectedStatusOfRelief === 'FIR Stage' && caseStatusString.includes('FIR')) ||
        (selectedStatusOfRelief === 'ChargeSheet Stage' && caseStatusString.includes('Charge Sheet')) ||
        (selectedStatusOfRelief === 'Trial Stage' && caseStatusString.includes('Trial'))
      : true;

    // UI/PT status filtering
    const matchesStatusField = selectedStatus ? uiPtStatus === selectedStatus : true;

    // Combine all conditions
    return (
      matchesSearchText &&
      matchesDistrict &&
      matchesNature &&
      matchesStatus &&
      matchesReliefStatus &&
      matchesDistricts &&
      matchesOffence &&
      matchesCommunity &&
      matchesCaste &&
      matchesZone &&
      matchesPoliceCity &&
      matchesStatusField &&
      matchesDateRange()
    );
  });
}
}
