import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComDashboardComponent } from './com-dashboard.component';
import { MeetingDashboardComponent } from '../meeting-dashboard/meeting-dashboard.component';
import { MeetingDashboardModule } from '../meeting-dashboard/meeting-dashboard.module';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { DashboardModule } from 'src/app/pages/dashboard/dashboard.module';
import { DadtwoDashboardComponent } from 'src/app/pages/dadtwo-dashboard/dadtwo-dashboard.component';
import { DashboardNewComponent } from 'src/app/pages/dashboard-new/dashboard-new.component';



@NgModule({
  declarations: [ComDashboardComponent,MeetingDashboardComponent,DashboardComponent,DadtwoDashboardComponent],
  imports: [
        NgxChartsModule,
        MatTooltipModule,
            CommonModule,
            FormsModule,
            DashboardNewComponent,
            RouterModule.forChild([
              {
                path: '',
                component: ComDashboardComponent,
              },
            ]), 
  ]
})
export class ComDashboardModule { }
