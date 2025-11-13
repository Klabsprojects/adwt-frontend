import { Component, ViewChild, OnInit, ChangeDetectorRef,OnDestroy } from "@angular/core";
import { ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexLegend, ApexFill } from "ng-apexcharts";
import { homeMeetingService } from "../home-meeting.service";
import { Subscription } from "rxjs";
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
  selector: 'app-meeting-qwsms',
  templateUrl: './meeting-qwsms.component.html',
  styleUrl: './meeting-qwsms.component.scss'
})
export class MeetingQwsmsComponent implements OnInit,OnDestroy {
  private subscription =  new Subscription();
  loading:boolean = false;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: ChartOptions;
  vmcData: any = {}; // declare variable

  ngOnInit(): void {
    this.subscription.add(
      this.hms.qwsms$.subscribe((res: any) => {
        if (res) {
          const categories = Object.keys(res); // ["Q1", "Q2", "Q3", "Q4"]
          this.loading = categories.length === 0 ? true:false;
          const completed = categories.map(q => res[q].completed);
          const pending = categories.map(q => res[q].pending);
  
          this.chartOptions.series = [
            { name: 'Completed', data: completed },
            { name: 'Pending', data: pending }
          ];
  
          this.chartOptions.xaxis = {
            categories
          };
        }
        this.cdr.detectChanges();
      })
     
    )
       this.hms.vmcmemeber$.subscribe((data: any) => {
    if (data && data.length > 0) {
      this.vmcData = data[0];
      console.log('VMC Data Object:', this.vmcData);
      this.cdr.detectChanges();
    }
  });

  }

  constructor(private hms: homeMeetingService, private cdr: ChangeDetectorRef) {
    this.chartOptions = {
      series: [
        {
          name: "PRODUCT A",
          data: [44, 55, 41, 67, 22, 43]
        },
        {
          name: "PRODUCT B",
          data: [13, 23, 20, 8, 13, 27]
        },
        {
          name: "PRODUCT C",
          data: [11, 17, 15, 15, 21, 14]
        },
        {
          name: "PRODUCT D",
          data: [21, 7, 25, 13, 22, 8]
        }
      ],
      chart: {
        type: "bar",
        height: 350,
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
          "01/2011",
          "02/2011",
          "03/2011",
          "04/2011",
          "05/2011",
          "06/2011"
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
}
