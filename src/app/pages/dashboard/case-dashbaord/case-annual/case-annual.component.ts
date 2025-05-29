import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexLegend, ApexFill } from "ng-apexcharts";
import { Chart, ChartData, ChartType } from 'chart.js/auto';
import { homeCaseService } from '../home-case.service';
import { Subscription } from 'rxjs';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};
@Component({
  selector: 'app-case-annual',
  templateUrl: './case-annual.component.html',
  styleUrl: './case-annual.component.scss'
})
export class CaseAnnualComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  private subscription = new Subscription();
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: ChartOptions;
  constructor(private hcs: homeCaseService, private cdr: ChangeDetectorRef) {
    this.chartOptions = {
      series: [
        // {
        //   name: "PRODUCT A",
        //   data: [44, 55, 41, 67, 22, 43]
        // },
        // {
        //   name: "PRODUCT B",
        //   data: [13, 23, 20, 8, 13, 27]
        // },
        // {
        //   name: "PRODUCT C",
        //   data: [11, 17, 15, 15, 21, 14]
        // },
        // {
        //   name: "PRODUCT D",
        //   data: [21, 7, 25, 13, 22, 8]
        // }
      ],
      chart: {
        type: "bar",
        height: 250,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        // enabled: false // <-- Add this line
        enabled: true,
        style: {
          fontSize: '12px',
          colors: ['#fff'] // makes labels white (or pick what suits your chart background)
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: [
          // "01/2011",
          // "02/2011",
          // "03/2011",
          // "04/2011",
          // "05/2011",
          // "06/2011"
        ]
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    };
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  public Annualcases: any = {}
  ngOnInit(): void {
    this.subscription.add(
      this.hcs.annual$.subscribe((res: any) => {
        if (res) {
          // this.Annualcases = res;
          // console.log('Annualcases',this.Annualcases);
          // this.createBarChart();

          const completed = res.cases;
          const categories = res.year;
          this.chartOptions.series = [
            { name: 'Cases', data: completed },
          ];
          this.chartOptions.xaxis = {
            categories
          };
          this.cdr.detectChanges();
        }
        this.cdr.detectChanges();
      })
    )
    this.subscription.add(
      this.hcs.isAnnualLoading$.subscribe((res: any) => {
        this.loading = res;
        this.cdr.detectChanges();
      })
    )
  }
  // barChartannual:Chart | null = null;
  // createBarChart(): void {
  //     const uiBar = this.Annualcases.cases;

  //     if (this.barChartannual) {
  //       this.barChartannual.destroy();
  //     }

  //     this.barChartannual = new Chart('barChartannual', {
  //       type: 'bar',
  //       data: {
  //         labels: this.Annualcases.year,
  //         datasets: [
  //           {
  //             label: 'UI (Under Investigation)',
  //             data: uiBar,
  //             backgroundColor: '#414ce7',
  //           },
  //         ],
  //       },
  //       options: {
  //         responsive: true,
  //         plugins: {
  //           legend: {
  //             display: false,
  //           },
  //         },
  //         interaction: {
  //           mode: 'none' as any,
  //           intersect: false,
  //         },
  //         animation: {
  //           onComplete: () => {
  //             const ctx = this.barChartannual!.ctx;
  //             ctx.font = 'bold 13px Arial';
  //             ctx.textAlign = 'center';
  //             ctx.textBaseline = 'bottom';

  //             this.barChartannual!.data.datasets.forEach((dataset, datasetIndex) => {
  //               const meta = this.barChartannual!.getDatasetMeta(datasetIndex);
  //               meta.data.forEach((bar, dataIndex) => {
  //                 const value = dataset.data[dataIndex];
  //                 const label = this.barChartannual!.data.labels?.[dataIndex];
  //                 if (label && value !== undefined) {
  //                   // const text = `${label}: ${value}`;
  //                   const text = `${value}`;
  //                   const x = bar.x;
  //                   const y = bar.y - -2;
  //                   ctx.fillStyle = '#000000';
  //                   ctx.fillText(text, x, y);
  //                 }
  //               });
  //             });
  //           },
  //         },
  //       },
  //     });
  //   }

}
