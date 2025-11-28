import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { caseReliefService } from '../cas-relief.service';
import { Subscription } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexTooltip,
  ApexFill,
  ApexLegend
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: 'app-relief-pending',
  templateUrl: './relief-pending.component.html',
  styleUrls: ['./relief-pending.component.scss']
})
export class ReliefPendingComponent implements OnInit, OnDestroy {
  loading:boolean=false;
  totalExpenditure:any;
  totalFir:any;
  totalChargeSheet:any;
  totalTrial:any;
  private subscription: Subscription = new Subscription();
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: ChartOptions;

  constructor(
    private csr: caseReliefService,
    private cdr: ChangeDetectorRef
  ) {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      title: {
        text: 'Job, Pension, Patta, Scholarship Pending'
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: '10px'
          },
          formatter: function (val) {
            return val + '';
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + '';
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
      }
    };
  }

  ngOnInit(): void {
    this.subscription.add(
      this.csr.pending$.subscribe((res: any) => {
    
        const data = res;
        const toCr = (val: any) =>
          val ? (Number(val) / 10000000).toFixed(2) : '0.00';
    
        this.totalExpenditure = toCr(data.total_expenditure);
        this.totalFir = toCr(data.total_firReliefAmount);
        this.totalChargeSheet = toCr(data.total_chargesheetReliefAmount);
        this.totalTrial = toCr(data.total_trialReliefAmount);
        this.cdr.detectChanges();
      })
    );
    
    
    // this.subscription.add(
    //   this.csr.pending$.subscribe((res: any[]) => {
    //     this.loading = res.length === 0 ? true : false;
    //     if (!res) return;

    //     const districts = res.map(item => item.revenue_district);
    //     const job = res.map(item => item.Job_Pending);
    //     const pension = res.map(item => item.Pension_Pending);
    //     const patta = res.map(item => item.Patta_Pending);
    //     const scholarship = res.map(item => item.Education_Pending);

    //     // Set dynamic height with minimum threshold
    //     const dynamicHeight = Math.max(districts.length * 25, 150);

    //     this.chartOptions = {
    //       ...this.chartOptions,
    //       chart: {
    //         ...this.chartOptions.chart,
    //         height: dynamicHeight
    //       },
    //       series: [
    //         { name: 'Job Pending', data: job },
    //         { name: 'Pension Pending', data: pension },
    //         { name: 'Patta Pending', data: patta },
    //         { name: 'Scholarship Pending', data: scholarship }
    //       ],
    //       xaxis: {
    //         ...this.chartOptions.xaxis,
    //         categories: districts
    //       }
    //     };

    //     this.cdr.detectChanges();
    //   })
    // );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
