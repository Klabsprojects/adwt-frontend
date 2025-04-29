import { Component,OnInit,ChangeDetectorRef,OnDestroy } from '@angular/core';
import { homeMeetingService } from '../home-meeting.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-meeting-cards',
  templateUrl: './meeting-cards.component.html',
  styleUrl: './meeting-cards.component.scss'
})
export class MeetingCardsComponent implements OnInit,OnDestroy {
  private subscription = new Subscription();
  constructor(private hms:homeMeetingService,private cdr:ChangeDetectorRef){}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  public cardDetails:any={}
  ngOnInit(): void {
    this.subscription.add(
      this.hms.cardsdetails$.subscribe((res:any)=>{
        if(res){
          this.cardDetails = res;
          this.cdr.detectChanges();
        }
      })
    )
  }

}
