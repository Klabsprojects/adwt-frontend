import { Component, OnInit, ChangeDetectorRef,OnDestroy } from '@angular/core';
import { ChartOptions, Chart, registerables } from 'chart.js';
import { homeCaseService } from '../home-case.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Subscription } from 'rxjs';
Chart.register(...registerables);
@Component({
  selector: 'app-case-piechart',
  templateUrl: './case-piechart.component.html',
  styleUrl: './case-piechart.component.scss'
})
export class CasePiechartComponent implements OnInit,OnDestroy {
  private subscription = new Subscription();
  loading:boolean=false;
  constructor(private dbService:DashboardService, private hcs:homeCaseService, private cdr:ChangeDetectorRef) {
    Chart.register(...registerables);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription.add(
      this.hcs.pieChart$.subscribe((res:any)=>{
        if(res){
          this.pieChartDatasets = [{
            data: [res],
            backgroundColor: ['#008ffb']
          }];
        }
        this.cdr.detectChanges();
       })
    )
    this.subscription.add(
      this.hcs.isPieChartLoading$.subscribe((res:any)=>{
        this.loading = res;
        this.cdr.detectChanges();
      })
    )
  }
  public pieChartOptions: ChartOptions<'doughnut'> = {
    responsive: false,
    cutout: '50%', // Adjust to control the inner radius (donut hole size)
  };
  public pieChartLabels = [''];
  public pieChartDatasets = [ {
    data: [0],
    backgroundColor: ['#008ffb']
  } ];
  public pieChartLegend = false;
  public pieChartPlugins = [];

}
