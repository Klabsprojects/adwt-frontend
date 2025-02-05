import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditFirComponent } from './edit-fir.component';


@NgModule({
  declarations: [],
  imports: [
    MatTooltipModule,
    NgxChartsModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
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
        component: EditFirComponent,
      },
    ]),
  ],
})
export class EditFirModule {}
