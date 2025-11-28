import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SharedFilterService {
  private filterData: any = null;

  setChartFilter(data: any) {
    this.filterData = data;
  }

  getChartFilter() {
    return this.filterData;
  }

  clearFilter() {
    this.filterData = null;
  }
}
