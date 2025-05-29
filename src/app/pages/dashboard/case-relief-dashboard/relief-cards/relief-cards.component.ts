import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { caseReliefService } from '../cas-relief.service';
import { Subscription } from 'rxjs'; // <-- import Subscription
@Component({
  selector: 'app-relief-cards',
  templateUrl: './relief-cards.component.html',
  styleUrl: './relief-cards.component.scss'
})
export class ReliefCardsComponent implements OnInit, OnDestroy {
  public staticCards: any = {};
  public DynamicCards: any = {};
  loading: boolean = false;
  private subscription: Subscription = new Subscription();
  constructor(private crs: caseReliefService, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    let stat = false;
    let dynm = false;
    this.subscription.add(
      this.crs.staticCards$.subscribe((res: any) => {
        if (res) {
          stat = Object.keys(res).length > 0;
          this.loading = !(stat && dynm);
          this.staticCards = res;
          this.cdr.detectChanges();
        }
      })
    );

    this.subscription.add(
      this.crs.dynamicCards$.subscribe((res: any) => {
        if (res) {
          dynm = Object.keys(res).length > 0;
          this.loading = !(stat && dynm);
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
