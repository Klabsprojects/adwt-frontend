import { Component, SimpleChanges, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { homeCaseService } from '../home-case.service';
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
export class CaseHorizontalBarComponent implements OnInit {
  constructor(private hcs:homeCaseService, private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    this.hcs.horizontal$.subscribe((res:any)=>{
      if(res){
        this.createBar(res);
      }
      this.cdr.detectChanges();
    })
  }
  @ViewChild("chart", { static: false }) chart!: ChartComponent;
  
    // ngOnChanges(changes: SimpleChanges) {
    //   if (changes['values']) {
    //     this.createBar({});
    //   }
    // }
    public chartOptions: ChartOptions;
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
        stroke: {
          show: true,
          width: 1,
          colors: ["#fff"]
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
