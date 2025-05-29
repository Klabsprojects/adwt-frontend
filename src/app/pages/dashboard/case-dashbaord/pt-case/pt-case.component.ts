import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexLegend, ApexFill } from "ng-apexcharts";
import { homeCaseService } from '../home-case.service';
// import { Chart} from 'chart.js/auto';
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
  selector: 'app-pt-case',
  templateUrl: './pt-case.component.html',
  styleUrl: './pt-case.component.scss'
})
export class PtCaseComponent implements OnInit, OnDestroy {
  loading:boolean=false;
  private subscription = new Subscription();
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: ChartOptions;
  constructor(private hcs:homeCaseService, private cdr:ChangeDetectorRef){
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
  // barChart1: Chart | null = null;
  // ptBar: number[] = [];
  ngOnInit(): void {
    this.subscription.add(
      this.hcs.ptbar$.subscribe((res: any) => {
        if (res) {
          const completed = [res.pt_less_than_1_year,res.pt_1_to_5_years,res.pt_6_to_10_years,res.pt_11_to_20_years,res.pt_greater_than_20_years];
          // const categories = Object.keys(res);
          const categories = ['< 1 year', '1 - 5 year', '6 - 10 year','11 - 20 year','> 20 year'];
          this.chartOptions.series = [
            { name: 'Cases', data: completed },
          ];
          this.chartOptions.xaxis = {
            categories
          };
          this.cdr.detectChanges();
          // this.ptBar = [
          //   Number(res.pt_less_than_1_year),
          //   Number(res.pt_1_to_5_years),
          //   Number(res.pt_6_to_10_years),
          //   Number(res.pt_11_to_20_years),
          //   Number(res.pt_greater_than_20_years),
          // ];
          // this.createbarChart1();
        }
        this.cdr.detectChanges();
      })
    )
    this.subscription.add(
      this.hcs.isPtbarLoading$.subscribe((res:any)=>{
        this.loading = res;
        this.cdr.detectChanges();
      })
    )
  }
  // createbarChart1(): void {
  //   const ptBar = this.ptBar;
  //   if (this.barChart1) {
  //     this.barChart1.destroy();
  //   }

  //   this.barChart1 = new Chart('barChart1', {
  //     type: 'bar',
  //     data: {
  //       labels: ['<1 Year', '1-5 Yrs', '6-10 Yrs', '11-20 Yrs', '>20 Yrs'],
  //       datasets: [
  //         {
  //           label: 'PTR (Pending Trial)',
  //           data: ptBar,
  //           backgroundColor: '#c7c7fa',
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         legend: {
  //           display: false,
  //         },
  //       },
  //       interaction: {
  //         mode: 'none' as any,
  //         intersect: false,
  //       },
  //       animation: {
  //         onComplete: () => {
  //           const ctx = this.barChart1!.ctx;
  //           ctx.font = 'bold 13px Arial';
  //           ctx.textAlign = 'center';
  //           ctx.textBaseline = 'bottom';

  //           this.barChart1!.data.datasets.forEach((dataset, datasetIndex) => {
  //             const meta = this.barChart1!.getDatasetMeta(datasetIndex);
  //             meta.data.forEach((bar, dataIndex) => {
  //               const value = dataset.data[dataIndex];
  //               const label = this.barChart1!.data.labels?.[dataIndex];
  //               if (label && value !== undefined) {
  //                 // const text = `${label}: ${value}`;
  //                 const text = `${value}`;
  //                 const x = bar.x;
  //                 const y = bar.y - -2;
  //                 ctx.fillStyle = '#000000';
  //                 ctx.fillText(text, x, y);
  //               }
  //             });
  //           });
  //         },
  //       },
  //     },
  //   });
  // }

}
