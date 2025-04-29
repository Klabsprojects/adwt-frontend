import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DashboardService } from "src/app/services/dashboard.service";

@Injectable({
    providedIn: 'root'
})

export class homeMeetingService {
    constructor(private ds: DashboardService) { }
    public cardsdetails = new BehaviorSubject<any>(null);
    cardsdetails$ = this.cardsdetails.asObservable();

    public dlmdDetails = new BehaviorSubject<any>(null);
    dlmdDetails$ = this.dlmdDetails.asObservable();

    public sblmd = new BehaviorSubject<any>(null);
    sblmd$ = this.sblmd.asObservable();

    public qwsms = new BehaviorSubject<any>(null);
    qwsms$ = this.qwsms.asObservable();

    setFilterJson(data: any) {
        this.setCardDetails(data);
        this.setDlmdDetails(data);
        this.setSblmdDetails(data);
        this.setQwsms(data);
    }

    setCardDetails(data: any) {
        this.ds.userPostMethod('GetVmcDashboardCardsValues', data).subscribe((res: any) => {
            this.cardsdetails.next(res.data[0]);
        })
    }

    setDlmdDetails(data: any) {
        this.ds.userPostMethod('GetVmcQuarterlyMeetingStats',data).subscribe((res:any)=>{
            this.dlmdDetails.next(res.data);
          })
    }

    setSblmdDetails(data: any) {
        this.ds.userPostMethod('GetVmcSubdivisionMeetingStats',data).subscribe((res:any)=>{
            this.sblmd.next(res.data);
          })
    }

    setQwsms(data: any) {
        this.ds.userPostMethod('GetQuarterWiseMeetingStatus',data).subscribe((res:any)=>{
            this.qwsms.next(res.data);
          })
    }
}