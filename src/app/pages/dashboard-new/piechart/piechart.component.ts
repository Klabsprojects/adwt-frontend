import { Component,OnInit } from '@angular/core';
// import { ChartOptions } from 'chart.js';
import { ChartOptions, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { CommonModule } from '@angular/common';
import { DashboardService } from 'src/app/services/dashboard.service';
Chart.register(...registerables);
@Component({
  selector: 'app-piechart',
  standalone: true,
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './piechart.component.html',
  styleUrl: './piechart.component.scss'
})
export class PiechartComponent implements OnInit {
  constructor(private dbService:DashboardService) {
    Chart.register(...registerables);
  }
  ngOnInit(): void {
   this.getReasonforpendig({});
  }
  
  // public pieChartOptions: ChartOptions<'pie'> = {
  //   responsive: false,
  // };

  public pieChartOptions: ChartOptions<'doughnut'> = {
    responsive: false,
    cutout: '50%', // Adjust to control the inner radius (donut hole size)
  };
  public pieChartLabels = [''];
  // public pieChartDatasets = [ {
  //   data: [ 112, 31, 26,12,144,24,2,57,52,5 ],
  //   backgroundColor: [
  //     '#FF5733',  // Segment 1 - Orange-Red
  //     '#33FF57',  // Segment 2 - Green
  //     '#3357FF',  // Segment 3 - Blue
  //     '#FF33A1',  // Segment 4 - Pink
  //     '#FFC300',  // Segment 5 - Yellow
  //     '#DAF7A6',  // Segment 6 - Light Green
  //     '#C70039',  // Segment 7 - Dark Red
  //     '#900C3F',  // Segment 8 - Maroon
  //     '#581845',  // Segment 9 - Purple
  //     '#8E44AD'   // Segment 10 - Dark Violet
  //   ]
  // } ];
  public pieChartDatasets = [ {
    data: [0],
    backgroundColor: ['#3357FF']
  } ];
  public pieChartLegend = false;
  public pieChartPlugins = [];

  getReasonforpendig(body: any) {
    this.dbService.userPostMethod('ReasonForPendingUICases', body).subscribe((res: any) => {
      const newValue = res.data[0].ui_total_cases;
  
      this.pieChartDatasets = [{
        data: [newValue],
        backgroundColor: ['#3357FF']
      }];
    });
  }
  
}
