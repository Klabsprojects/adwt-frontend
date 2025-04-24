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
import { CaseDashbaordComponent } from 'src/app/pages/dashboard/case-dashbaord/case-dashbaord.component';
import { CardsComponent } from 'src/app/pages/dashboard/case-dashbaord/cards/cards.component';
import { FilterNavComponent } from 'src/app/pages/dashboard/case-dashbaord/filter-nav/filter-nav.component';
import { HomeMeetingDashboardComponent } from 'src/app/pages/dashboard/home-meeting-dashboard/home-meeting-dashboard.component';
import { MeetingCardsComponent } from 'src/app/pages/dashboard/home-meeting-dashboard/meeting-cards/meeting-cards.component';
import { MeetingDlmdComponent } from 'src/app/pages/dashboard/home-meeting-dashboard/meeting-dlmd/meeting-dlmd.component';
import { MeetingFilterComponent } from 'src/app/pages/dashboard/home-meeting-dashboard/meeting-filter/meeting-filter.component';
import { MeetingQwsmsComponent } from 'src/app/pages/dashboard/home-meeting-dashboard/meeting-qwsms/meeting-qwsms.component';
import { MeetingSblmdComponent } from 'src/app/pages/dashboard/home-meeting-dashboard/meeting-sblmd/meeting-sblmd.component';
import { CaseDwcdmPTComponent } from 'src/app/pages/dashboard/case-dashbaord/case-dwcdm-pt/case-dwcdm-pt.component';
import { CaseDwcdmUiComponent } from 'src/app/pages/dashboard/case-dashbaord/case-dwcdm-ui/case-dwcdm-ui.component';
import { PtCaseComponent } from 'src/app/pages/dashboard/case-dashbaord/pt-case/pt-case.component';
import { UiCaseComponent } from 'src/app/pages/dashboard/case-dashbaord/ui-case/ui-case.component';
import { CaseStatusComponent } from 'src/app/pages/dashboard/case-dashbaord/case-status/case-status.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CaseAnnualComponent } from 'src/app/pages/dashboard/case-dashbaord/case-annual/case-annual.component';
import { CaseHorizontalBarComponent } from 'src/app/pages/dashboard/case-dashbaord/case-horizontal-bar/case-horizontal-bar.component';
import { CasePiechartComponent } from 'src/app/pages/dashboard/case-dashbaord/case-piechart/case-piechart.component';
import { CaseTableComponent } from 'src/app/pages/dashboard/case-dashbaord/case-table/case-table.component';
import { BaseChartDirective } from 'ng2-charts';
@NgModule({
  declarations: [
    MeetingCardsComponent,
    MeetingDlmdComponent,
    MeetingFilterComponent,
    MeetingQwsmsComponent,
    MeetingSblmdComponent,
    HomeMeetingDashboardComponent,
    ComDashboardComponent,
    MeetingDashboardComponent,
    DashboardComponent,
    DadtwoDashboardComponent,
    CaseDashbaordComponent,
    CardsComponent,
    FilterNavComponent,
    CaseDwcdmPTComponent,
    CaseDwcdmUiComponent,
    PtCaseComponent,
    UiCaseComponent,
    CaseStatusComponent,
    CaseAnnualComponent,
    CaseHorizontalBarComponent,
    CasePiechartComponent,
    CaseTableComponent,
  ],
  imports: [
    NgxChartsModule,
    MatTooltipModule,
    CommonModule,
    FormsModule,
    NgApexchartsModule,
    BaseChartDirective,
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
