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
  selector: 'app-ui-case',
  templateUrl: './ui-case.component.html',
  styleUrl: './ui-case.component.scss'
})
export class UiCaseComponent implements OnInit, OnDestroy {
  loading:boolean=false;
  private subscription = new Subscription();
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: ChartOptions;
  constructor(private hcs:homeCaseService, private cdr:ChangeDetectorRef){
    this.chartOptions = {
      series: [
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
  // barChart2: Chart | null = null;
  // uiBar: number[] = [];
  ngOnInit(): void {
  // 🔹 Subscription for Bar Chart Data
  this.subscription.add(
    this.hcs.uibar$.subscribe((res: any) => {
      console.log("response", res);

      // ✅ Process only when valid data is received
      if (res && Object.keys(res).length > 0) {
        const completed = [
          Number(res.ui_less_than_2_month) || 0,
          Number(res.ui_2_to_4_month) || 0,
          Number(res.ui_4_to_6_month) || 0,
          Number(res.ui_6_to_12_month) || 0,
          Number(res.ui_greater_than_1_year) || 0
        ];

        const categories = [
          '< 2 Month',
          '2 - 4 Month',
          '4 - 6 Month',
          '6 - 12 Month',
          '> 1 Year'
        ];

        this.chartOptions = {
          ...this.chartOptions,
          series: [{ name: 'Cases', data: completed }],
          xaxis: { categories }
        };

        this.cdr.detectChanges();
      }
    })
  );

  // 🔹 Subscription for Loader
  this.subscription.add(
    this.hcs.isUibarLoading$.subscribe((res: any) => {
      this.loading = !!res; // ensure boolean
      this.cdr.detectChanges();
    })
  );
}

  
  // createbarChart2(): void {
  //   const uiBar = this.uiBar;

  //   if (this.barChart2) {
  //     this.barChart2.destroy();
  //   }

  //   this.barChart2 = new Chart('barChart2', {
  //     type: 'bar',
  //     data: {
  //       labels: ['< 2 Mos', '2-4 Mos', '4-6 Mos', '6-12 Mos', '> 1 Yrs'],
  //       datasets: [
  //         {
  //           label: 'UI (Under Investigation)',
  //           data: uiBar,
  //           backgroundColor: '#414ce7',
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
  //           const ctx = this.barChart2!.ctx;
  //           ctx.font = 'bold 13px Arial';
  //           ctx.textAlign = 'center';
  //           ctx.textBaseline = 'bottom';

  //           this.barChart2!.data.datasets.forEach((dataset, datasetIndex) => {
  //             const meta = this.barChart2!.getDatasetMeta(datasetIndex);
  //             meta.data.forEach((bar, dataIndex) => {
  //               const value = dataset.data[dataIndex];
  //               const label = this.barChart2!.data.labels?.[dataIndex];
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

