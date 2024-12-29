import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgApexchartsModule } from "ng-apexcharts";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke
} from "ng-apexcharts";
import { NgZone } from '@angular/core';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-horizontal-bar',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './horizontal-bar.component.html',
  styleUrl: './horizontal-bar.component.scss'
})
export class HorizontalBarComponent implements AfterViewInit {
  @ViewChild("chart", { static: false }) chart!: ChartComponent;

  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "2024",
          data: [142, 109, 86, 84]
        },
        {
          name: "2023",
          data: [14, 9, 10, 5]
        },
        {
          name: "2022",
          data: [0, 1, 4, 0]
        }
      ],
      chart: {
        type: "bar",
        height: 430
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
        categories: ['West Zone', 'North Zone', 'Central Zone', 'South Zone']
      }
    };
  }

  ngAfterViewInit() {
    // You can now interact with the chart component
    console.log(this.chart);
  }
}
