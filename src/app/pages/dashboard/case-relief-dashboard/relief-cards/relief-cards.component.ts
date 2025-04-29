import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { caseReliefService } from '../cas-relief.service';
import { Subscription } from 'rxjs'; // <-- import Subscription
@Component({
  selector: 'app-relief-cards',
  templateUrl: './relief-cards.component.html',
  styleUrl: './relief-cards.component.scss'
})
export class ReliefCardsComponent implements OnInit,OnDestroy {
  public staticCards:any={};
  public DynamicCards:any={};
  private subscription: Subscription = new Subscription();
  constructor(private crs:caseReliefService, private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    this.subscription.add(
      this.crs.staticCards$.subscribe((res: any) => {
        if (res) {
          this.staticCards = res;
          this.cdr.detectChanges();
        }
      })
    );
  
    this.subscription.add(
      this.crs.dynamicCards$.subscribe((res: any) => {
        if (res) {
          this.DynamicCards = res;
          this.cdr.detectChanges();
        }
      })
    );
  }  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
