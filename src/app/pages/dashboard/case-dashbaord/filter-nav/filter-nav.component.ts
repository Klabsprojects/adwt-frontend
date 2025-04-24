import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { homeCaseService } from '../home-case.service';
import { commondashboardSerivce } from '../../case-dashboard.service';
@Component({
  selector: 'app-filter-nav',
  templateUrl: './filter-nav.component.html',
  styleUrls: ['./filter-nav.component.css']
})
export class FilterNavComponent implements OnInit {
  filterOptions: any = {
    status: [
      { key: 'UI', value: 'UI Stage' },
      { key: 'PT', value: 'PT Stage' },
    ],
    district: [],
    caste: [],
    subcaste: [],
    gender: ['Male', 'Female', 'Other'],
  };
  selectedFilters = {
    status: '',
    district: '',
    caste: '',
    subcaste: '',
    gender: '',
    dateRange: '',
    fromDate: '',
    toDate: ''
  };
  constructor(private dashboardService: DashboardService, private hcs:homeCaseService,private cds:commondashboardSerivce) { }
  ngOnInit(): void {
    this.callAllfunction({});
    this.hcs.distrct$.subscribe((res:any)=>{
      this.callAllfunction({district:res});
    })
  }
  callAllfunction(body:any){
    this.getDropdowns();
    this.getDashboardValues();
    this.getStatusOfCase(body);
    this.getAnnualOverView(body);
    this.getPendingCaseZone(body);
    this.getPiechartdata(body);
  }
  getDropdowns() {
    this.dashboardService.getFilterOptions().subscribe(data => {
      this.filterOptions.status = this.filterOptions.status;
      this.filterOptions.gender = this.filterOptions.gender;
      this.filterOptions.district = data.district || [];
      this.filterOptions.caste = data.caste || [];
      this.filterOptions.subcaste = data.subcaste || [];
    });
  }
  getDashboardValues() {
    this.dashboardService.getDashboardCountData().subscribe((res: any) => {
      const cardsValue = {
        totalCases: res.totalCases,
        minorCases: res.minorCases,
        pendingTrials: res.pendingTrials,
        acquitted: res.acquittedCases,
        convicted: res.convictedCases,
        cases: res.cases,
        uicases: res.uicases
      }
      this.hcs.setCardData(cardsValue);
      this.hcs.setDwcdmPt(res.map1)
      this.hcs.setDwcdmUi(res.map2);
      this.hcs.setPtbar(res.ptBar);
      this.hcs.setUibar(res.uiBar);
    })
  }
  getStatusOfCase(body:any){
    this.dashboardService.userPostMethod('GetNatureOfOffenceChartValue',body).subscribe((res:any)=>{
      const data = {gcr:res.data[0].gcr,non_gcr:res.data[0].non_gcr};
      this.hcs.setStatus(data);
    })
  }
  getAnnualOverView(body:any){
    this.dashboardService.userPostMethod('GetAnnualOverViewRegisterdCases',body).subscribe((res:any)=>{
      const Annualcases = {
        year: res.data.map((item:any) => item.year),
        cases: res.data.map((item:any) => item.total_cases)
      };
      this.hcs.setAnnual(Annualcases);
    })
  }
  getPendingCaseZone(body: any) {
    this.dashboardService.userPostMethod('GetPendingCaseZoneWise', body).subscribe((res: any) => {
      const data = res.data;
      let values = [0, 0, 0, 0];
      const yearWiseData:any = [];
      for (let i = 0; i < data.length; i++) {
        // 'South Zone', 'Central Zone', 'North Zone', 'West Zone'
        if (data[i].zone === 'South Zone') {
          values[0] += data[i].total_cases;
        }
        else if (data[i].zone === 'Central Zone') {
          values[1] += data[i].total_cases;
        }
        else if (data[i].zone === 'North Zone') {
          values[2] += data[i].total_cases;
        }
        else if (data[i].zone === 'West Zone') {
          values[3] += data[i].total_cases;
        }
      }
      this.hcs.setHorizontal(values);
      // this.values = values;
      

      data.forEach((entry:any) => {
        let yearData = yearWiseData.find((y:any) => y.year === entry.year);
        if (!yearData) {
          yearData = { year: entry.year, sz: 0, cz: 0, nz: 0, wz: 0 };
          yearWiseData.push(yearData);
        }
        if (entry.zone === 'South Zone') yearData.sz += entry.total_cases;
        else if (entry.zone === 'Central Zone') yearData.cz += entry.total_cases;
        else if (entry.zone === 'North Zone') yearData.nz += entry.total_cases;
        else if (entry.zone === 'West Zone') yearData.wz += entry.total_cases;
      });
      this.hcs.setTable(yearWiseData);
      // this.years = yearWiseData;
    });

  }

  getPiechartdata(body:any){
    this.dashboardService.userPostMethod('ReasonForPendingUICases', body).subscribe((res: any) => {
      const newValue = res.data[0].ui_total_cases;
      this.hcs.setPieChart(newValue);
    });
  }

  applyFilters() {

  }
}
