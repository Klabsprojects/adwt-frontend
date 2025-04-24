import { Component,OnInit,ChangeDetectorRef } from '@angular/core';
import { homeMeetingService } from '../home-meeting.service';
@Component({
  selector: 'app-meeting-dlmd',
  templateUrl: './meeting-dlmd.component.html',
  styleUrl: './meeting-dlmd.component.scss'
})
export class MeetingDlmdComponent implements OnInit {
  quarters = ['q1', 'q2', 'q3', 'q4', 'total'];

  tableData:any[]=[];
  constructor(private hms:homeMeetingService,private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    this.hms.dlmdDetails$.subscribe((res:any)=>{
      if(res){
        this.tableData = Object.keys(res).map(district => {
          const districtData = res[district];
        
          let totalCompleted = 0;
          let totalPending = 0;
        
          const result: any = {
            district,
            q1: {},
            q2: {},
            q3: {},
            q4: {},
            total: {}
          };
        
          ['q1', 'q2', 'q3', 'q4'].forEach(q => {
            const completed = parseInt(districtData[q]?.completed || '0', 10);
            const pending = parseInt(districtData[q]?.pending || '0', 10);
            const total = completed + pending;
        
            result[q] = { completed, pending, total };
        
            totalCompleted += completed;
            totalPending += pending;
          });
        
          result.total = {
            completed: totalCompleted,
            pending: totalPending,
            total: totalCompleted + totalPending
          };
        
          return result;
        });
        this.cdr.detectChanges();
      }
    })
  }

}
