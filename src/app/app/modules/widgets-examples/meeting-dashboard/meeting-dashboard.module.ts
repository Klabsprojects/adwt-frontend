import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { MeetingDashboardComponent } from './meeting-dashboard.component';



@NgModule({
  declarations: [MeetingDashboardComponent],
  imports: [
    NgxChartsModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([
          {
            path: '',
            component: MeetingDashboardComponent,
          },
        ]), 
  ]
})
export class MeetingDashboardModule { }
