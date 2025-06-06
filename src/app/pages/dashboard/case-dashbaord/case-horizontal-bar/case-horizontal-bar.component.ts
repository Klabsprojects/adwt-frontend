import { Component, SimpleChanges, ViewChild, OnInit, ChangeDetectorRef,OnDestroy } from '@angular/core';
import { homeCaseService } from '../home-case.service';
import { Subscription } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
};
@Component({
  selector: 'app-case-horizontal-bar',
  templateUrl: './case-horizontal-bar.component.html',
  styleUrl: './case-horizontal-bar.component.scss'
})
export class CaseHorizontalBarComponent implements OnInit,OnDestroy {
  private subscription = new Subscription();
  constructor(private hcs:homeCaseService, private cdr:ChangeDetectorRef){}
  loading:boolean=false;
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription.add(
      this.hcs.horizontal$.subscribe((res:any)=>{
        if(res){
          this.createBar(res);
        }
        this.cdr.detectChanges();
      })
    )
    this.subscription.add(
      this.hcs.isHorizontalLoading$.subscribe((res:any)=>{
        this.loading = res;
        this.cdr.detectChanges();
      })
    )
  }
  @ViewChild("chart", { static: false }) chart!: ChartComponent;
  
    // ngOnChanges(changes: SimpleChanges) {
    //   if (changes['values']) {
    //     this.createBar({});
    //   }
    // }
    // public chartOptions: ChartOptions;
    chartOptions: {
      series: ApexAxisChartSeries;
      chart: ApexChart;
      dataLabels: ApexDataLabels;
      plotOptions: ApexPlotOptions;
      xaxis: ApexXAxis;
    } = {
      series: [/* your data */],
      chart: {
        type: 'bar'
      },
      dataLabels: { /* config */ },
      plotOptions: { /* config */ },
      xaxis: { /* x-axis config */ }
    };
    
    createBar(values: any) {
      this.chartOptions = {
        series: [
          {
            name: "",
            data: values
          }
        ],
        chart: {
          type: "bar",
          height: 200,
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const index = config.dataPointIndex;
              const zones = ['South Zone', 'Central Zone', 'North Zone', 'West Zone'];
              const selectedZone = zones[index];
              this.hcs.setZone(selectedZone);
              // this.zoneClicked.emit(selectedZone); // 🚀 Emit zone
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: "top"
            }
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: "12px",
            colors: ["#fff"]
          }
        },
        xaxis: {
          categories: ['South Zone', 'Central Zone', 'North Zone', 'West Zone']
        }
      };
    }
    clear(){
      this.hcs.setZone('null');
      // this.zoneClicked.emit('');
    }
}
