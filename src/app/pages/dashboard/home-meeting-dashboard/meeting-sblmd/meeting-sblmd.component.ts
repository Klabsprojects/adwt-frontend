import { Component, OnInit, ChangeDetectorRef,OnDestroy } from '@angular/core';
import { homeMeetingService } from '../home-meeting.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-meeting-sblmd',
  templateUrl: './meeting-sblmd.component.html',
  styleUrl: './meeting-sblmd.component.scss'
})
export class MeetingSblmdComponent implements OnInit,OnDestroy {
  constructor(private hms:homeMeetingService, private cdr:ChangeDetectorRef){}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  private subscription = new Subscription();
  public tableData:any[]=[];
  loading:boolean = true;
  ngOnInit(): void {
    this.subscription.add(
      this.hms.sblmd$.subscribe((res: any) => {
        if (res) {
          this.loading = Object.keys(res).length === 0 ? true:false;
          this.tableData = Object.entries(res).map(([location, data]) => {
            if (typeof data === 'object' && data !== null) {
              return { location, ...data };
            } else {
              return { location, q1: 0, q2: 0, q3: 0, q4: 0, total: 0 }; // fallback or error shape
            }
          });
          this.cdr.detectChanges();
        }
      }) 
    )
    
  }
}
