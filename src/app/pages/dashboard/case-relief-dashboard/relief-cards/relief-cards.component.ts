import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { caseReliefService } from '../cas-relief.service';
import { Subscription } from 'rxjs'; // <-- import Subscription
@Component({
  selector: 'app-relief-cards',
  templateUrl: './relief-cards.component.html',
  styleUrl: './relief-cards.component.scss'
})
export class ReliefCardsComponent implements OnInit, OnDestroy {
  public cards: any = {};
  public DynamicCards: any = {};
  loading: boolean = false;
  private subscription: Subscription = new Subscription();
  constructor(private crs: caseReliefService, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
  this.subscription.add(
    this.crs.reliefData$.subscribe((res: any) => {

      if (res && res.length > 0) {
        this.cards = res[0];
      }
      this.cdr.detectChanges();
    })
  );
}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
