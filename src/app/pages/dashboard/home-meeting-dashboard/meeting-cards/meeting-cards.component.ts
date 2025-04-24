import { Component,OnInit,ChangeDetectorRef } from '@angular/core';
import { homeMeetingService } from '../home-meeting.service';
@Component({
  selector: 'app-meeting-cards',
  templateUrl: './meeting-cards.component.html',
  styleUrl: './meeting-cards.component.scss'
})
export class MeetingCardsComponent implements OnInit {
  constructor(private hms:homeMeetingService,private cdr:ChangeDetectorRef){}
  public cardDetails:any={}
  ngOnInit(): void {
    this.hms.cardsdetails$.subscribe((res:any)=>{
      if(res){
        this.cardDetails = res;
        this.cdr.detectChanges();
      }
    })
  }

}
