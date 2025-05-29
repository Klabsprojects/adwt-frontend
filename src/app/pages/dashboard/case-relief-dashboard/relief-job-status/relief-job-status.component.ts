import { Component, OnInit, ChangeDetectorRef,OnDestroy } from '@angular/core';
import { ChartOptions, Chart, registerables, Plugin } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DashboardService } from 'src/app/services/dashboard.service';
import { caseReliefService } from '../cas-relief.service';
import { Subscription } from 'rxjs';
Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-relief-job-status',
  templateUrl: './relief-job-status.component.html',
  styleUrls: ['./relief-job-status.component.scss']
})
export class ReliefJobStatusComponent implements OnInit,OnDestroy {
  private subscription: Subscription = new Subscription();
  loading:boolean=false;

  constructor(private dbService: DashboardService, private cdr: ChangeDetectorRef, private csr: caseReliefService) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.csr.jobstatus$.subscribe((res: any) => {
        if(res){
          this.loading = Object.keys(res).length === 0 ? true:false;
          this.pieChartDatasets = [{
            data: [res.Given, res.Pending],
            backgroundColor: ['#d64550', '#48327a']
          }];
          this.cdr.detectChanges();
        }
      })
    )
  }

  public pieChartOptions: ChartOptions<'doughnut'> = {
    responsive: false,
    cutout: '50%',
    plugins: {
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value: number) => value
      }
    }
  };

  public pieChartLabels = ['Job Given', 'Job Pending'];

  public pieChartDatasets = [{
    data: [5, 5],
    backgroundColor: ['#d64550', '#48327a']
  }];

  // 👇 Cast plugin array to correct type
  // public pieChartPlugins: Plugin<'doughnut'>[] = [ChartDataLabels];
  public pieChartPlugins = [ChartDataLabels as Plugin<'doughnut'>];
  public pieChartLegend = false;
}
