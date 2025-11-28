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

    public reliefData = new BehaviorSubject<any>(null);
    reliefData$ = this.reliefData.asObservable();

    public additionalReliefData = new BehaviorSubject<any>(null);
    additionalReliefData$ = this.additionalReliefData.asObservable();

    public additionalReliefBeforeData = new BehaviorSubject<any>(null);
    additionalReliefBeforeData$ = this.additionalReliefBeforeData.asObservable();

    public additionalReliefAfterData = new BehaviorSubject<any>(null);
    additionalReliefAfterData$ = this.additionalReliefAfterData.asObservable();

    public additionalReliefBeforePendency = new BehaviorSubject<any>(null);
    additionalReliefBeforePendency$ = this.additionalReliefBeforePendency.asObservable();

    public additionalReliefAfterPendency = new BehaviorSubject<any>(null);
    additionalReliefAfterPendency$ = this.additionalReliefAfterPendency.asObservable();

    setFilterJson(data:any){
        this.setStaticValues(data);
        this.setDynamicValues(data);
        // this.setTableValues(data);
        // this.setJobStatus(data);
        // this.setPensionStatus(data);
        // this.setPattaStatus(data);
        // this.setEducationStatus(data);
        // this.setReliefStatus(data);
        // this.setPending(data);
        // this.setGiven(data);
        this.setExpenditure(data);
        this.setReliefPendingData(data);
        this.setReliefData(data);
        this.getAdditionalReliefCase(data);
        this.getAdditionalReliefBeforeCase(data);
        this.getAdditionalReliefAfterCase(data);
        this.getAdditionalReliefAfterPendency(data);
        this.getAdditionalReliefBeforePendency(data);
    }

    setExpenditure(data){
        this.pending.next([]);
            this.ds.userPostMethod('reliefExpenditure',data).subscribe((res:any)=>{
                this.pending.next(res);
            })
    }

    setReliefPendingData(data){
        this.given.next([]);
            this.ds.userPostMethod('GetReliefPending',data).subscribe((res:any)=>{
                this.given.next(res);
            })
    }

    setReliefData(data){
        this.reliefData.next([]);
            this.ds.userPostMethod('GetReliefData',data).subscribe((res:any)=>{
                this.reliefData.next(res.data);
                this.tabledata.next(res.data);
            })
    }
    setStaticValues(data:any){
        // const district = data.district? {district:data.district} : {};
        this.staticCards.next({});
        const district = {}
        this.ds.userPostMethod('ReliefDashboardStaticValues',district).subscribe((res:any)=>{
            this.staticCards.next(res.data[0]);
        })
    }

    setDynamicValues(data:any){
        this.dynamicCards.next({});
        this.ds.userPostMethod('ReliefDashboardDynamicValues',data).subscribe((res:any)=>{
            this.dynamicCards.next(res.data[0]);
        })
    }

    // setTableValues(data:any){
    //     this.tabledata.next([]);
    //     this.ds.userPostMethod('ReliefDashboarTableData',data).subscribe((res:any)=>{
    //         this.tabledata.next(res.data);
    //     })
    // }
    
    setJobStatus(data:any){
        this.jobstatus.next({});
        this.ds.userPostMethod('JobStatus',data).subscribe((res:any)=>{
            this.jobstatus.next(res.data[0]);
        })
    }
    
    setPensionStatus(data:any){
        this.pensionStatus.next({});
        this.ds.userPostMethod('PensionStatus',data).subscribe((res:any)=>{
            this.pensionStatus.next(res.data[0]);
        })
    }

    setPattaStatus(data:any){
        this.pattaStatus.next({});
        this.ds.userPostMethod('PattaStatus',data).subscribe((res:any)=>{
            this.pattaStatus.next(res.data[0]);
        })
    }

    setEducationStatus(data:any){
        this.educationStatus.next({});
        this.ds.userPostMethod('EducationConsissionStatus',data).subscribe((res:any)=>{
            this.educationStatus.next(res.data[0]);
        })
    }

    setReliefStatus(data:any){
        this.reliefStatus.next({});
        this.ds.userPostMethod('ReliefStatus_donut_chart',data).subscribe((res:any)=>{
            this.reliefStatus.next(res.data[0]);
        })
    }

    // setPending(data:any){
    //     this.pending.next([]);
    //     this.ds.userPostMethod('DistrictWisePedingStatus',data).subscribe((res:any)=>{
    //         this.pending.next(res.data);
    //     })
    // }

    setGiven(data:any){
        this.given.next([]);
        this.ds.userPostMethod('DistrictWiseGivenStatus',data).subscribe((res:any)=>{
            this.given.next(res.data);
        })
    }

    getAdditionalReliefCase(data:any){
       this.additionalReliefData.next([]);
        this.ds.userPostMethodForAdditional('/cases',data).subscribe((res:any)=>{
            this.additionalReliefData.next(res);
        }) 
    }

    getAdditionalReliefBeforeCase(data:any){
       this.additionalReliefBeforeData.next([]);
        this.ds.userPostMethodForAdditional('/before',data).subscribe((res:any)=>{
            this.additionalReliefBeforeData.next(res);
        }) 
    }

    getAdditionalReliefAfterCase(data:any){
       this.additionalReliefAfterData.next([]);
        this.ds.userPostMethodForAdditional('/after',data).subscribe((res:any)=>{
            this.additionalReliefAfterData.next(res);
        }) 
    }

    getAdditionalReliefBeforePendency(data:any){
       this.additionalReliefBeforePendency.next([]);
        this.ds.userPostMethodForAdditional('/bf/pendency',data).subscribe((res:any)=>{
            this.additionalReliefBeforePendency.next(res.data);
        }) 
    }

    getAdditionalReliefAfterPendency(data:any){
       this.additionalReliefAfterPendency.next([]);
        this.ds.userPostMethodForAdditional('/af/pendency',data).subscribe((res:any)=>{
            this.additionalReliefAfterPendency.next(res.data);
        }) 
    }
}