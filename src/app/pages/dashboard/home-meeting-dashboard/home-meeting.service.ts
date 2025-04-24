import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn:'root'
})

export class homeMeetingService{
    public cardsdetails = new BehaviorSubject<any>(null);
    cardsdetails$ = this.cardsdetails.asObservable();

    public dlmdDetails = new BehaviorSubject<any>(null);
    dlmdDetails$ = this.dlmdDetails.asObservable();

    public sblmd = new BehaviorSubject<any>(null);
    sblmd$ = this.sblmd.asObservable();

    public qwsms = new BehaviorSubject<any>(null);
    qwsms$ = this.qwsms.asObservable();

    setCardDetails(data:any){
        this.cardsdetails.next(data);
    }

    setDlmdDetails(data:any){
        this.dlmdDetails.next(data);
    }

    setSblmdDetails(data:any){
        this.sblmd.next(data);
    }

    setQwsms(data:any){
        this.qwsms.next(data);
    }
}