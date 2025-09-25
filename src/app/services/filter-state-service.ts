import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterStateService {
  filters: any = {
    search: '',
    district: '',
    policeStationName: '',
    revenue_district: '',
    start_date: '',
    end_date: '',
    additionalReliefType: '',
    reliefStatus:''
  };

  setFilters(filters: any) {
    this.filters = { ...filters };
  }

  getFilters() {
    return this.filters;
  }


  firFilter :any = {
      search: '',
    district: '',
    police_zone: '',
    police_range: '',
    revenue_district: '',
    policeStation: '',
    community: '',
    caste: '',
    year: '',
    CreatedATstartDate: '',
    CreatedATendDate: '',
    ModifiedATstartDate: '',
    ModifiedATDate: '',
    start_date: '',
    end_date: '',
    statusOfCase: '',
    dataEntryStatus: '',
    sectionOfLaw: '',
    court: '',
    convictionType: '',
    chargesheetFromDate: '',
    chargesheetToDate: '',
    hasLegalObtained: '',
    caseFitForAppeal: '',
    filedBy: '',
    appealCourt: '',
    OffenceGroup: '',
}

setFIRFilters(firFilter: any) {
    this.firFilter = { ...firFilter };
  }

  getFIRFilters() {
    return this.firFilter;
  }

  
}
