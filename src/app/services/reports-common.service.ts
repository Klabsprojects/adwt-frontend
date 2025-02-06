import { Injectable } from '@angular/core';
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
    private districtService: DistrictService,
    private offenceService: OffenceService
  ) {}

  getAllDistricts(): Observable<string[]> {
    return this.districtService
      .getAllDistricts()
      .pipe(
        map((districts: { district_name: string }[]) =>
          districts.map((district) => district.district_name)
        )
      );
  }

  getAllOffences(): Observable<string[]> {
    return this.offenceService
      .getAllOffences()
      .pipe(
        map((offences: { offence_name: string }[]) =>
          offences.map((offence) => offence.offence_name)
        )
      );
  }

  getAllData(): Observable<{ districts: string[]; offences: string[] }> {
    return forkJoin({
      districts: this.getAllDistricts(),
      offences: this.getAllOffences(),
    });
  }

  formatPendingDays(days: number): string {
    if (!days || days < 0) return 'NA';
    if (days <= 90) return `${days} days`;
    if (days <= 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  }

  // Sorting logic
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

  // Get the sort icon class
  getSortIcon(field: string, currentSortField: string, isAscending: boolean): string {
    return currentSortField === field
      ? isAscending
        ? 'fa-sort-up'
        : 'fa-sort-down'
      : 'fa-sort';
  }

  async exportToExcel(
    filteredData: any[],
    displayedColumns: any[]
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
      await this.exportExcel(exportData);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }

  private async exportExcel(list: any[]): Promise<void> {
    const xlsx = await import('xlsx');
    const worksheet = xlsx.utils.json_to_sheet(list);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'All-Forms');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_' + EXCEL_EXTENSION);
  }
}
