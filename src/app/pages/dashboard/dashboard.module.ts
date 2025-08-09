import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@NgModule({
  declarations: [],
  imports: [
    MatTooltipModule,
    NgxChartsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    NgCircleProgressModule.forRoot({
      radius: 60,
      outerStrokeWidth: 10,
      innerStrokeWidth: 0,
      outerStrokeColor: '#28a745',
      innerStrokeColor: '#eaeaea',
      animationDuration: 300,
    }),
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    ModalsModule,WidgetsModule
  ],
})
export class DashboardModule {}
