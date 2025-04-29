import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DashboardService } from "src/app/services/dashboard.service";
@Injectable({
    providedIn:'root'
})

export class caseReliefService{

    constructor(private ds:DashboardService){}
    public staticCards = new BehaviorSubject<any>(null);
    staticCards$ = this.staticCards.asObservable();

    public dynamicCards = new BehaviorSubject<any>(null);
    dynamicCards$ = this.dynamicCards.asObservable();

    public tabledata = new BehaviorSubject<any>(null);
    tabledata$ = this.tabledata.asObservable();

    public jobstatus = new BehaviorSubject<any>(null);
    jobstatus$ = this.jobstatus.asObservable();

    public pensionStatus = new BehaviorSubject<any>(null);
    pensionStatus$ = this.pensionStatus.asObservable();

    public pattaStatus = new BehaviorSubject<any>(null);
    pattaStatus$ = this.pattaStatus.asObservable();

    public educationStatus = new BehaviorSubject<any>(null);
    educationStatus$ = this.educationStatus.asObservable();

    public reliefStatus = new BehaviorSubject<any>(null);
    reliefStatus$ = this.reliefStatus.asObservable();

    public pending = new BehaviorSubject<any>(null);
    pending$ = this.pending.asObservable();

    public given = new BehaviorSubject<any>(null);
    given$ = this.given.asObservable();

    setFilterJson(data:any){
        this.setStaticValues(data);
        this.setDynamicValues(data);
        this.setTableValues(data);
        this.setJobStatus(data);
        this.setPensionStatus(data);
        this.setPattaStatus(data);
        this.setEducationStatus(data);
        this.setReliefStatus(data);
        this.setPending(data);
        this.setGiven(data);
    }

    setStaticValues(data:any){
        // const district = data.district? {district:data.district} : {};
        const district = {}
        this.ds.userPostMethod('ReliefDashboardStaticValues',district).subscribe((res:any)=>{
            this.staticCards.next(res.data[0]);
        })
    }

    setDynamicValues(data:any){
        this.ds.userPostMethod('ReliefDashboardDynamicValues',data).subscribe((res:any)=>{
            this.dynamicCards.next(res.data[0]);
        })
    }

    setTableValues(data:any){
        this.ds.userPostMethod('ReliefDashboarTableData',data).subscribe((res:any)=>{
            this.tabledata.next(res.data);
        })
    }
    
    setJobStatus(data:any){
        this.ds.userPostMethod('JobStatus',data).subscribe((res:any)=>{
            this.jobstatus.next(res.data[0]);
        })
    }
    
    setPensionStatus(data:any){
        this.ds.userPostMethod('PensionStatus',data).subscribe((res:any)=>{
            this.pensionStatus.next(res.data[0]);
        })
    }

    setPattaStatus(data:any){
        this.ds.userPostMethod('PattaStatus',data).subscribe((res:any)=>{
            this.pattaStatus.next(res.data[0]);
        })
    }

    setEducationStatus(data:any){
        this.ds.userPostMethod('EducationConsissionStatus',data).subscribe((res:any)=>{
            this.educationStatus.next(res.data[0]);
        })
    }

    setReliefStatus(data:any){
        this.ds.userPostMethod('ReliefStatus_donut_chart',data).subscribe((res:any)=>{
            this.reliefStatus.next(res.data[0]);
        })
    }

    setPending(data:any){
        this.ds.userPostMethod('DistrictWisePedingStatus',data).subscribe((res:any)=>{
            this.pending.next(res.data);
        })
    }

    setGiven(data:any){
        this.ds.userPostMethod('DistrictWiseGivenStatus',data).subscribe((res:any)=>{
            this.given.next(res.data);
        })
    }
}