import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { homeCaseService } from '../home-case.service';
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  cardsData:any={};
  constructor(private hsc:homeCaseService, private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    this.hsc.cardsdata$.subscribe((res:any)=>{
      if(res){
        console.log("cards",res);
        this.cardsData = res;
        this.cdr.detectChanges();
      }
    })
  }
}
