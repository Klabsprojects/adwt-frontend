import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn:'root'
})

export class commondashboardSerivce{
    public disctrict = new BehaviorSubject(null);
    district$ = this.disctrict.asObservable();

    selectDistrict(data:any){
        // this.disctrict = data;
    }
}