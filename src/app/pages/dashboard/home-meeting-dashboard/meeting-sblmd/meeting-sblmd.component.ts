import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { homeMeetingService } from '../home-meeting.service';
@Component({
  selector: 'app-meeting-sblmd',
  templateUrl: './meeting-sblmd.component.html',
  styleUrl: './meeting-sblmd.component.scss'
})
export class MeetingSblmdComponent implements OnInit {
  constructor(private hms:homeMeetingService, private cdr:ChangeDetectorRef){}
  public tableData:any[]=[];
  ngOnInit(): void {
    this.hms.sblmd$.subscribe((res: any) => {
      if (res) {
        this.tableData = Object.entries(res).map(([location, data]) => {
          if (typeof data === 'object' && data !== null) {
            return { location, ...data };
          } else {
            return { location, q1: 0, q2: 0, q3: 0, q4: 0, total: 0 }; // fallback or error shape
          }
        });
        this.cdr.detectChanges();
      }
    });
    
  }
}
