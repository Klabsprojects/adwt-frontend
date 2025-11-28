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
import { Router } from '@angular/router';
import { SharedFilterService } from 'src/app/services/shared-filter.service';

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
  loading:boolean = false;  

  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions!: ChartOptions;
  public pendingChartOptions!: ChartOptions;

  constructor(
    private csr: caseReliefService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sharedFilter: SharedFilterService,
  ) {

    const baseChartOptions: ChartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height:1000,
        stacked: true,
        events: {
    dataPointSelection: (event, chartContext, config) => {
      const seriesName = config.w.config.series[config.seriesIndex].name;
      const district = config.w.config.xaxis.categories[config.dataPointIndex]; // Selected district

      this.onChartBarClick(seriesName,district);
    }
  }
      },
     dataLabels: {
  enabled: true,
  formatter: function (val) {
    return val;
  },
  style: {
    fontSize: '10px',
    colors: ['#fff']
  }
},

plotOptions: {
  bar: {
    horizontal: true,
    barHeight: '90%',
    borderRadius: 0,
    dataLabels: {
      position: 'center'
    }
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
    this.pendingChartOptions = { ...baseChartOptions };
  }

  ngOnInit(): void {

    // Get BEFORE pendency chart data
    this.subscription.add(
      this.csr.additionalReliefBeforePendency$.subscribe((res: any) => {
        console.log("Before Pendency Data", res);
        this.prepareBeforePendencyChart(res);
        this.cdr.detectChanges();
      })
    );

    // Get AFTER pendency chart data
    this.subscription.add(
      this.csr.additionalReliefAfterPendency$.subscribe((res: any) => {
        console.log("After Pendency Data", res);
        this.prepareAfterPendencyChart(res);
        this.cdr.detectChanges();
      })
    );
  }
 
  onChartBarClick(type: string, district: string) {
  const mapType: any = {
    'Job': 'employment',
    'Pension': 'pension',
    'Education': 'education',
    'Provisions': 'provision',
    'Patta': 'patta'
  };
    // localStorage.setItem('lastDashboard', 'relief');
      sessionStorage.setItem('fromRelief', '1');


  this.sharedFilter.setChartFilter({
    type: mapType[type],
    status: 'pending',
    district: district
  });

  this.router.navigate(['/widgets-examples/additional-relief-list']);
}

  prepareBeforePendencyChart(data: any[]) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No pending data received");
    return;
  }

  const categories = data.map(d => d.district);
  const reliefPending = data.map(d => d.reliefPending);

  this.chartOptions = {
    ...this.chartOptions,
    xaxis: { categories },
    series: [
      {
        name: 'Relief Pending',
        data: reliefPending
      }
    ]
  };

  this.cdr.detectChanges();
}

 prepareAfterPendencyChart(data: any[]) {

  if (!data || data.length === 0) return;

  const categories = data.map(d => d.district);

  const job = data.map(d => Number(d.reliefAfterJobPending || 0));
  const pension = data.map(d => Number(d.reliefAfterPensionPending || 0));
  const education = data.map(d => Number(d.reliefAfterEducationPending || 0));
  const provisions = data.map(d => Number(d.reliefAfterprovisionsPending || 0));
  const patta = data.map(d => Number(d.reliefAfterPattaPending || 0));

  const total = data.map((_, i) =>
    job[i] + pension[i] + education[i] + provisions[i] + patta[i]
  );

  // IMPORTANT: create fresh object (do NOT spread old)
  this.pendingChartOptions = {
    series: [
      { name: 'Job', data: job },
      { name: 'Pension', data: pension },
      { name: 'Education', data: education },
      { name: 'Provisions', data: provisions },
      { name: 'Patta', data: patta },
      { name: 'Total', data: total }
    ],
    chart: { ...this.pendingChartOptions.chart },
    xaxis: { categories },
    plotOptions: this.pendingChartOptions.plotOptions,
    dataLabels: this.pendingChartOptions.dataLabels,
    stroke: this.pendingChartOptions.stroke,
    yaxis: this.pendingChartOptions.yaxis,
    fill: this.pendingChartOptions.fill,
    legend: this.pendingChartOptions.legend,
    tooltip: this.pendingChartOptions.tooltip,
    title: this.pendingChartOptions.title,
  };

  this.cdr.detectChanges();
}


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
