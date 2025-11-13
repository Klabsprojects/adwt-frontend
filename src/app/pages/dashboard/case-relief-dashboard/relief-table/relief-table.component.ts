import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { caseReliefService } from '../cas-relief.service';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-relief-table',
  templateUrl: './relief-table.component.html',
  styleUrls: ['./relief-table.component.scss'],
})
export class ReliefTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('firChartCanvas') firChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chargeChartCanvas') chargeChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trialChartCanvas') trialChartCanvas!: ElementRef<HTMLCanvasElement>;

  firChart: any;
  chargeChart: any;
  trialChart: any;
  public tableData: any[] = [];
  loading: boolean = false;
  private subscription = new Subscription();

  constructor(private crs: caseReliefService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscription.add(
      this.crs.tabledata$.subscribe((res: any) => {
        if (res) {
          this.loading = res.length === 0;
          this.tableData = res;
          this.cdr.detectChanges();
        }
      })
    );
  }

  ngAfterViewInit(): void {
    // Create charts after view init
    this.createCharts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyCharts();
  }

  createCharts(): void {
    this.destroyCharts(); // cleanup old charts before creating new ones
    this.firChart = this.createDonutChart(this.firChartCanvas, [30, 20], ['Given', 'Pending']);
    this.chargeChart = this.createDonutChart(this.chargeChartCanvas, [45, 15], ['Given', 'Pending']);
    this.trialChart = this.createDonutChart(this.trialChartCanvas, [15, 30], ['Given', 'Pending']);
  }

  destroyCharts(): void {
    if (this.firChart) this.firChart.destroy();
    if (this.chargeChart) this.chargeChart.destroy();
    if (this.trialChart) this.trialChart.destroy();
  }

  createDonutChart(canvasRef: ElementRef<HTMLCanvasElement>, values: number[], labels: string[]): Chart {
    const ctx = canvasRef.nativeElement.getContext('2d');
    if (!ctx) return null as any;

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: ['#2A9D8F', '#E9C46A'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        cutout: '70%',
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}`,
            },
          },
        },
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
            ctx.fillStyle = '#000';
            ctx.fillText(text, centerX, centerY);
            ctx.restore();
          },
        },
      ],
    } as any);
  }
}
