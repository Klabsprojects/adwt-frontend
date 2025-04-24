import { Component, ViewChild,Input, SimpleChanges, OnChanges, Output, EventEmitter } from "@angular/core";
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
export class HorizontalBarComponent implements OnChanges {
  @ViewChild("chart", { static: false }) chart!: ChartComponent;
  @Input() values: number[] = [];
  @Output() zoneClicked = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges) {
    console.log("hello")
    if (changes['values']) {
      this.createBar(this.values);
    }
  }
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
            this.zoneClicked.emit(selectedZone); // 🚀 Emit zone
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
    this.zoneClicked.emit('');
  }
}
