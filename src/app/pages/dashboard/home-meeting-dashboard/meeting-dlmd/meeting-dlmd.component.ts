import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { homeMeetingService } from '../home-meeting.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-meeting-dlmd',
  templateUrl: './meeting-dlmd.component.html',
  styleUrl: './meeting-dlmd.component.scss'
})
export class MeetingDlmdComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  loading:boolean = false;
  quarters = ['q1', 'q2', 'q3', 'q4', 'total'];
  tableData: any[] = [];
  constructor(private hms: homeMeetingService, private cdr: ChangeDetectorRef) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription.add(
      this.hms.dlmdDetails$.subscribe((res: any) => {
        if (res) {
          this.loading = Object.keys(res).length === 0 ? true:false;
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
    )
  }

}
