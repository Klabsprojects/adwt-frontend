import { Component } from '@angular/core';
// import { ChartOptions } from 'chart.js';
import { ChartOptions, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { CommonModule } from '@angular/common';
Chart.register(...registerables);
@Component({
  selector: 'app-piechart',
  standalone: true,
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './piechart.component.html',
  styleUrl: './piechart.component.scss'
})
export class PiechartComponent {
  constructor() {
    Chart.register(...registerables);
  }
  
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = ['Accused not arrested', 'Court Stay', 'Medical Certificate' ,'Waiting for report','community certificate','DLVMC','CBCID','Legal opinion','investigation not completed','procestion order'];
  public pieChartDatasets = [ {
    data: [ 112, 31, 26,12,144,24,2,57,52,5 ],
    backgroundColor: [
      '#FF5733',  // Segment 1 - Orange-Red
      '#33FF57',  // Segment 2 - Green
      '#3357FF',  // Segment 3 - Blue
      '#FF33A1',  // Segment 4 - Pink
      '#FFC300',  // Segment 5 - Yellow
      '#DAF7A6',  // Segment 6 - Light Green
      '#C70039',  // Segment 7 - Dark Red
      '#900C3F',  // Segment 8 - Maroon
      '#581845',  // Segment 9 - Purple
      '#8E44AD'   // Segment 10 - Dark Violet
    ]
  } ];
  public pieChartLegend = false;
  public pieChartPlugins = [];
}
