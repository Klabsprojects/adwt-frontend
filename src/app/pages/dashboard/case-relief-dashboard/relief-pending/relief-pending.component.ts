import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { caseReliefService } from "../cas-relief.service";
import { Subscription } from "rxjs";
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
} from "ng-apexcharts";

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
  styleUrl: './relief-pending.component.scss'
})
export class ReliefPendingComponent implements OnInit, OnDestroy {
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  private subscription: Subscription = new Subscription();
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: ChartOptions;

  constructor(private csr: caseReliefService, private cdr: ChangeDetectorRef) {
    this.chartOptions = {
      series: [], // Placeholder
      chart: {
        type: "bar",
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
        colors: ["#fff"]
      },
      title: {
        text: "Job, Pension, Patta,Scholorship Pending"
      },
      xaxis: {
        categories: [], // Placeholder
        labels: {
          formatter: function (val) {
            return val + "";
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
            return val + "";
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40
      }
    };
  }

  ngOnInit(): void {
    let disctrics: any = [];
    let job: any = [];
    let pension: any = [];
    let patta: any = [];
    let scholorship: any = [];
    this.subscription.add(
      this.csr.pending$.subscribe((res: any) => {
        if (res) {
          disctrics = [];
          job = [];
          pension = [];
          patta = [];
          scholorship = [];
          for (let i = 0; i < res.length; i++) {
            disctrics.push(res[i].revenue_district);
            job.push(res[i].Job_Pending);
            pension.push(res[i].Pension_Pending);
            patta.push(res[i].Patta_Pending);
            scholorship.push(res[i].Education_Pending);
          }
          console.log("disctrics",disctrics);
          // Load dynamic data
          this.chartOptions.series = [
            {
              name: "Job Pending",
              data: job
            },
            {
              name: "Pension Pending",
              data: pension
            },
            {
              name: "Patta Pending",
              data: patta
            },
            {
              name: "Scholorship Pending",
              data: scholorship
            }
          ];

          this.chartOptions.xaxis.categories = disctrics;
        }
        this.cdr.detectChanges();
      })
    )

  }
}
