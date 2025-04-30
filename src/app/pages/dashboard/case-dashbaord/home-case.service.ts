import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DashboardService } from "src/app/services/dashboard.service";

@Injectable({
    providedIn: 'root'
})

export class homeCaseService {

    constructor(private dashboardService: DashboardService) { }

    public staticCardsdata = new BehaviorSubject<any>(null);
    staticCardsdata$ = this.staticCardsdata.asObservable();

    public dynamicCardsData = new BehaviorSubject<any>(null);
    dynamicCardsData$ = this.dynamicCardsData.asObservable();

    public dwcdmpt = new BehaviorSubject<any>(null);
    dwcdmpt$ = this.dwcdmpt.asObservable();

    public dwcdmui = new BehaviorSubject<any>(null);
    dwcdmui$ = this.dwcdmui.asObservable();

    public uibar = new BehaviorSubject<any>(null);
    uibar$ = this.uibar.asObservable();

    public ptbar = new BehaviorSubject<any>(null);
    ptbar$ = this.ptbar.asObservable();

    public status = new BehaviorSubject<any>(null);
    status$ = this.status.asObservable();

    public annual = new BehaviorSubject<any>(null);
    annual$ = this.annual.asObservable();

    public horizontal = new BehaviorSubject<any>(null);
    horizontal$ = this.horizontal.asObservable();

    public table = new BehaviorSubject<any>(null);
    table$ = this.table.asObservable();

    public pieChart = new BehaviorSubject<any>(null);
    pieChart$ = this.pieChart.asObservable();

    public district = new BehaviorSubject<any>(null);
    distrct$ = this.district.asObservable();

    public zoneEmit = new BehaviorSubject<any>(null);
    zoneEmit$ = this.zoneEmit.asObservable();

    setFilterJson(data: any) {
        this.setStaticCardData(data);
        this.setDynamicCardData(data);
        this.setDwcdmPt(data);
        this.setDwcdmUi(data);
        this.setPtbar(data);
        this.setUibar(data);
        this.setStatus(data);
        this.setAnnual(data);
        this.setHorizontal(data);
    }
    setStaticCardData(data: any) {
        const body = {};
        this.dashboardService.userPostMethod('GetCaseDashboardCardStaticValue', body).subscribe((res: any) => {
            this.staticCardsdata.next(res.data[0]);
        })
    }
    setDynamicCardData(data: any) {
        this.dashboardService.userPostMethod('GetCaseDashboardCardDynamicValue', data).subscribe((res: any) => {
            this.dynamicCardsData.next(res.data[0]);
        })
    }

    setDwcdmPt(data: any) {
        this.dashboardService.userPostMethod('GetPTDistrictWiseHeatMap', data).subscribe((res: any) => {
            this.dwcdmpt.next(res.data);
        })
    }
    setDwcdmUi(data: any) {
        this.dashboardService.userPostMethod('GetUIDistrictWiseHeatMap', data).subscribe((res: any) => {
            this.dwcdmui.next(res.data);
        })
    }

    setPtbar(data: any) {
        this.dashboardService.userPostMethod('GetPTPendencyCasesGroupedByYears', data).subscribe((res: any) => {
            this.ptbar.next(res.data[0]);
        })
    }

    setUibar(data: any) {
        this.dashboardService.userPostMethod('GetPTPendencyCasesGroupedByYears', data).subscribe((res: any) => {
            this.uibar.next(res.data[0]);
        })
    }

    setStatus(data: any) {
        this.dashboardService.userPostMethod('GetNatureOfOffenceChartValue', data).subscribe((res: any) => {
            this.status.next(res.data[0]);
        })
    }
    setAnnual(data: any) {
        this.dashboardService.userPostMethod('GetAnnualOverViewRegisterdCases', data).subscribe((res: any) => {
            const Annualcases = {
                year: res.data.map((item: any) => item.year),
                cases: res.data.map((item: any) => item.total_cases)
            };
            this.annual.next(Annualcases);
        })
    }

    setHorizontal(data: any) {
        this.dashboardService.userPostMethod('GetPendingCaseZoneWise', data).subscribe((res: any) => {
            const data = res.data;
            let values = [0, 0, 0, 0];
            const yearWiseData: any = [];
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
            data.forEach((entry: any) => {
                let yearData = yearWiseData.find((y: any) => y.year === entry.year);
                if (!yearData) {
                    yearData = { year: entry.year, sz: 0, cz: 0, nz: 0, wz: 0 };
                    yearWiseData.push(yearData);
                }
                if (entry.zone === 'South Zone') yearData.sz += entry.total_cases;
                else if (entry.zone === 'Central Zone') yearData.cz += entry.total_cases;
                else if (entry.zone === 'North Zone') yearData.nz += entry.total_cases;
                else if (entry.zone === 'West Zone') yearData.wz += entry.total_cases;
            });
            this.horizontal.next(values);
            this.table.next(yearWiseData);
        })
    }

    setTable(data: any) {
        this.horizontal.next(data);
    }

    setPieChart(data: any) {
        this.dashboardService.userPostMethod('',data).subscribe((res:any)=>{
            this.pieChart.next(res.data[0].ui_total_cases);
        })
    }

    setdisctrict(data: any) {
        this.district.next(data);
    }

    setZone(data: any) {
        this.zoneEmit.next(data);
    }
}