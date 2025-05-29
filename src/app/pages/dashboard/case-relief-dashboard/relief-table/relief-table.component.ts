import { Component,OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { caseReliefService } from '../cas-relief.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-relief-table',
  templateUrl: './relief-table.component.html',
  styleUrl: './relief-table.component.scss'
})
export class ReliefTableComponent implements OnInit,OnDestroy {
  public tableData:any[]=[]
  loading:boolean = false;
  private subscription: Subscription = new Subscription();
  constructor(private crs:caseReliefService, private cdr:ChangeDetectorRef){}

  ngOnInit(): void {
    this.subscription.add(
      this.crs.tabledata$.subscribe((res: any) => {
        if (res) {
          this.loading = res.length === 0 ? true : false;
          this.tableData = res;
          this.cdr.detectChanges();
        }
      })
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
}
