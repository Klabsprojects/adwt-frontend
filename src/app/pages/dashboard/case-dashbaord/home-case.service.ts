import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn:'root'
})

export class homeCaseService{
    public cardsdata = new BehaviorSubject<any>(null);
    cardsdata$ = this.cardsdata.asObservable();
    
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

    setCardData(data:any){
        this.cardsdata.next(data);
    }

    setDwcdmPt(data:any){
        this.dwcdmpt.next(data);
    }

    setDwcdmUi(data:any){
        this.dwcdmui.next(data);
    }

    setPtbar(data:any){
        this.ptbar.next(data);
    }

    setUibar(data:any){
        this.uibar.next(data);
    }

    setStatus(data:any){
        this.status.next(data);
    }
    setAnnual(data:any){
        this.annual.next(data);
    }

    setHorizontal(data:any){
        this.horizontal.next(data);
    }

    setTable(data:any){
        this.table.next(data);
    }

    setPieChart(data:any){
        this.pieChart.next(data);
    }

    setdisctrict(data:any){
        this.district.next(data);
    }

    setZone(data:any){
        this.zoneEmit.next(data);
    }
}