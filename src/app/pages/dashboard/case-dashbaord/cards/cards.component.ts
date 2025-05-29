import { Component, OnInit, ChangeDetectorRef,OnDestroy } from '@angular/core';
import { homeCaseService } from '../home-case.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit,OnDestroy {
  staticCardsData:any={};
  dynamicCardsData:any={};
  private subscription = new Subscription(); 
  constructor(private hsc:homeCaseService, private cdr:ChangeDetectorRef){}
  loading:boolean=false;
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription.add(
      this.hsc.staticCardsdata$.subscribe((res:any)=>{
        if(res){
          this.staticCardsData = res;
        }
        this.cdr.detectChanges();
      })
    )
    this.subscription.add(
      this.hsc.dynamicCardsData$.subscribe((res:any)=>{
        if(res){
          this.dynamicCardsData = res;
        }
        this.cdr.detectChanges();
      })
    )
    this.subscription.add(
      this.hsc.isStaticCardsLoading$.subscribe((res:any)=>{
        this.loading = res;
        this.cdr.detectChanges();
      })
    )
  }
}
