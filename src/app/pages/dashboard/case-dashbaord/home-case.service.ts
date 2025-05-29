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
    public isStaticCardsLoading = new BehaviorSubject<boolean>(false);
    isStaticCardsLoading$ = this.isStaticCardsLoading.asObservable();

    public dynamicCardsData = new BehaviorSubject<any>(null);
    dynamicCardsData$ = this.dynamicCardsData.asObservable();
    public isDynamicCardsLoading = new BehaviorSubject<boolean>(false);
    isDynamicCardsLoading$ = this.isDynamicCardsLoading.asObservable();

    public dwcdmpt = new BehaviorSubject<any>(null);
    dwcdmpt$ = this.dwcdmpt.asObservable();
    public isDwcdmPtLoading = new BehaviorSubject<boolean>(false);
    isDwcdmPtLoading$ = this.isDwcdmPtLoading.asObservable();

    public dwcdmui = new BehaviorSubject<any>(null);
    dwcdmui$ = this.dwcdmui.asObservable();
    public isDwcdmUiLoading = new BehaviorSubject<boolean>(false);
    isDwcdmUiLoading$ = this.isDwcdmUiLoading.asObservable();

    public uibar = new BehaviorSubject<any>(null);
    uibar$ = this.uibar.asObservable();
    public isUibarLoading = new BehaviorSubject<boolean>(false);
    isUibarLoading$ = this.isUibarLoading.asObservable();

    public ptbar = new BehaviorSubject<any>(null);
    ptbar$ = this.ptbar.asObservable();
    public isPtbarLoading = new BehaviorSubject<boolean>(false);
    isPtbarLoading$ = this.isPtbarLoading.asObservable();

    public status = new BehaviorSubject<any>(null);
    status$ = this.status.asObservable();
    public isStatusLoading = new BehaviorSubject<boolean>(false);
    isStatusLoading$ = this.isStatusLoading.asObservable();

    public annual = new BehaviorSubject<any>(null);
    annual$ = this.annual.asObservable();
    public isAnnualLoading = new BehaviorSubject<boolean>(false);
    isAnnualLoading$ = this.isAnnualLoading.asObservable();

    public horizontal = new BehaviorSubject<any>(null);
    horizontal$ = this.horizontal.asObservable();
    public isHorizontalLoading = new BehaviorSubject<boolean>(false);
    isHorizontalLoading$ = this.isHorizontalLoading.asObservable();

    public table = new BehaviorSubject<any>(null);
    table$ = this.table.asObservable();

    public pieChart = new BehaviorSubject<any>(null);
    pieChart$ = this.pieChart.asObservable();
    public isPieChartLoading = new BehaviorSubject<boolean>(false);
    isPieChartLoading$ = this.isPieChartLoading.asObservable();

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
        this.setPieChart(data);
    }

    setStaticCardData(data: any) {
        this.isStaticCardsLoading.next(true);
        const body = {};
        this.dashboardService.userPostMethod('GetCaseDashboardCardStaticValue', body).subscribe((res: any) => {
            this.staticCardsdata.next(res.data[0]);
            this.isStaticCardsLoading.next(false);
        });
    }

    setDynamicCardData(data: any) {
        this.isDynamicCardsLoading.next(true);
        this.dashboardService.userPostMethod('GetCaseDashboardCardDynamicValue', data).subscribe((res: any) => {
            this.dynamicCardsData.next(res.data[0]);
            this.isDynamicCardsLoading.next(false);
        });
    }

    setDwcdmPt(data: any) {
        this.isDwcdmPtLoading.next(true);
        this.dashboardService.userPostMethod('GetPTDistrictWiseHeatMap', data).subscribe((res: any) => {
            this.dwcdmpt.next(res.data);
            this.isDwcdmPtLoading.next(false);
        });
    }

    setDwcdmUi(data: any) {
        this.isDwcdmUiLoading.next(true);
        this.dashboardService.userPostMethod('GetUIDistrictWiseHeatMap', data).subscribe((res: any) => {
            this.dwcdmui.next(res.data);
            this.isDwcdmUiLoading.next(false);
        });
    }

    setPtbar(data: any) {
        this.isPtbarLoading.next(true);
        this.dashboardService.userPostMethod('GetPTPendencyCasesGroupedByYears', data).subscribe((res: any) => {
            this.ptbar.next(res.data[0]);
            this.isPtbarLoading.next(false);
        });
    }

    setUibar(data: any) {
        this.isUibarLoading.next(true);
        this.dashboardService.userPostMethod('GetPTPendencyCasesGroupedByYears', data).subscribe((res: any) => {
            this.uibar.next(res.data[0]);
            this.isUibarLoading.next(false);
        });
    }

    setStatus(data: any) {
        this.isStatusLoading.next(true);
        this.dashboardService.userPostMethod('GetNatureOfOffenceChartValue', data).subscribe((res: any) => {
            this.status.next(res.data[0]);
            this.isStatusLoading.next(false);
        });
    }

    setAnnual(data: any) {
        this.isAnnualLoading.next(true);
        this.dashboardService.userPostMethod('GetAnnualOverViewRegisterdCases', data).subscribe((res: any) => {
            const Annualcases = {
                year: res.data.map((item: any) => item.year),
                cases: res.data.map((item: any) => item.total_cases)
            };
            this.annual.next(Annualcases);
            this.isAnnualLoading.next(false);
        });
    }

    setHorizontal(data: any) {
        this.isHorizontalLoading.next(true);
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
            this.isHorizontalLoading.next(false);
        });
    }

    setTable(data: any) {
        this.horizontal.next(data);
    }

    setPieChart(data: any) {
        this.isPieChartLoading.next(true);
        this.dashboardService.userPostMethod('ReasonForPendingUICases',data).subscribe((res:any)=>{
            this.pieChart.next(res.data[0].ui_total_cases);
            this.isPieChartLoading.next(false);
        });
    }

    setdisctrict(data: any) {
        this.district.next(data);
    }

    setZone(data: any) {
        this.zoneEmit.next(data);
    }
}