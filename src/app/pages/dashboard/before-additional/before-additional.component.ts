import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import {
  Chart,
  ChartType,
  ChartData,
  ChartOptions,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-before-additional',
  templateUrl: './before-additional.component.html',
  styleUrls: ['./before-additional.component.scss']
})
export class BeforeAdditionalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('beforeChartCanvas') beforeChartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart<'doughnut', number[], string>;
  loading: boolean = false;

  ngAfterViewInit(): void {
    this.chart = this.createDonutChart(this.beforeChartCanvas, [30, 20], ['Given', 'Pending']);
  }

  createDonutChart(
    canvasRef: ElementRef<HTMLCanvasElement>,
    values: number[],
    labels: string[]
  ): Chart<'doughnut', number[], string> {
    const ctx = canvasRef.nativeElement.getContext('2d');
    if (!ctx) throw new Error('Canvas context not found');

    return new Chart<'doughnut', number[], string>(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: ['#2A9D8F', '#E9C46A'],
            borderWidth: 2
          }
        ]
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw as number;
                return `${context.label}: ${value}`;
              }
            }
          }
        }
      },
      plugins: [
        {
          id: 'centerText',
          afterDraw(chart) {
            const { ctx } = chart;
            const dataset = chart.data.datasets[0].data as number[];
            const total = dataset.reduce((a, b) => a + b, 0);
            const text = total.toString();
            const centerX =
              chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
            const centerY =
              chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 18px Arial';
            ctx.fillStyle = '#000'; // black text in center
            ctx.fillText(text, centerX, centerY);
            ctx.restore();
          }
        }
      ]
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
