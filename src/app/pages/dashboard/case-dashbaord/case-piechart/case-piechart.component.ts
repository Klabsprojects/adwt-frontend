import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChartOptions, Chart, registerables } from 'chart.js';
import { homeCaseService } from '../home-case.service';
import { DashboardService } from 'src/app/services/dashboard.service';
Chart.register(...registerables);
@Component({
  selector: 'app-case-piechart',
  templateUrl: './case-piechart.component.html',
  styleUrl: './case-piechart.component.scss'
})
export class CasePiechartComponent implements OnInit {
  constructor(private dbService:DashboardService, private hcs:homeCaseService, private cdr:ChangeDetectorRef) {
    Chart.register(...registerables);
  }
  ngOnInit(): void {
   this.hcs.pieChart$.subscribe((res:any)=>{
    if(res){
      this.pieChartDatasets = [{
        data: [res],
        backgroundColor: ['#3357FF']
      }];
    }
    this.cdr.detectChanges();
   })
   
  }
  public pieChartOptions: ChartOptions<'doughnut'> = {
    responsive: false,
    cutout: '50%', // Adjust to control the inner radius (donut hole size)
  };
  public pieChartLabels = [''];
  public pieChartDatasets = [ {
    data: [0],
    backgroundColor: ['#3357FF']
  } ];
  public pieChartLegend = false;
  public pieChartPlugins = [];

}
