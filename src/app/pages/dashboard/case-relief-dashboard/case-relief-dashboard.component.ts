import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { caseReliefService } from './cas-relief.service';
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
  selector: 'app-case-relief-dashboard',
  templateUrl: './case-relief-dashboard.component.html',
  styleUrls: ['./case-relief-dashboard.component.scss']
})
export class CaseReliefDashboardComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  loading: boolean = false;

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions;
  public pendingChartOptions!: ChartOptions;

  constructor(
    private csr: caseReliefService,
    private cdr: ChangeDetectorRef
  ) {
    // Base chart configuration (for both charts)
    const baseChartOptions: ChartOptions = {
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
        text: ''
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

    // Initialize charts
    this.chartOptions = { ...baseChartOptions };
    this.pendingChartOptions = {
      ...baseChartOptions,
      // title: {
      //   text: 'Job, Pension, Patta, Education'
      // }
    };
  }

  ngOnInit(): void {
    this.subscription.add(
      this.csr.given$.subscribe((res: any[]) => {
        this.loading = res.length === 0;
        if (!res) return;

        // Extract data
        const districts = res.map(item => item.revenue_district);
        const job = res.map(item => item.job_pending || 0);
        const pension = res.map(item => item.pension_pending || 0);
        const patta = res.map(item => item.patta_pending || 0);
        const education = res.map(item => item.education_pending || 0);

        // Calculate total pending for overall chart
        const totalPending = res.map(item =>
          (item.job_pending || 0) +
          (item.pension_pending || 0) +
          (item.patta_pending || 0) +
          (item.education_pending || 0)
        );

        // Dynamic height adjustment
        const dynamicHeight = Math.max(districts.length * 25, 200);

        // 🔹 Overall Pending Chart (aggregated)
        this.chartOptions = {
          ...this.chartOptions,
          chart: {
            ...this.chartOptions.chart,
            height: dynamicHeight
          },
          // title: {
          //   text: 'Overall District Pending Cases'
          // },
          series: [
            { name: 'Total Pending', data: totalPending }
          ],
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: districts
          }
        };

        // 🔹 Category-wise Pending Chart
        this.pendingChartOptions = {
          ...this.pendingChartOptions,
          chart: {
            ...this.pendingChartOptions.chart,
            height: dynamicHeight
          },
          series: [
            { name: 'Job Pending', data: job },
            { name: 'Pension Pending', data: pension },
            { name: 'Patta Pending', data: patta },
            { name: 'Education Pending', data: education }
          ],
          fill: {
            opacity: 1,
            colors: ['#007bff', '#28a745', '#ffc107', '#dc3545'] // Blue, Green, Yellow, Red
          },
          xaxis: {
            ...this.pendingChartOptions.xaxis,
            categories: districts
          }
        };

        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
