import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { caseReliefService } from '../case-relief-dashboard/cas-relief.service';
import { DashboardService } from 'src/app/services/dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-before-additional',
  templateUrl: './before-additional.component.html',
  styleUrls: ['./before-additional.component.scss']
})
export class BeforeAdditionalComponent implements OnInit, AfterViewInit, OnDestroy {

  private viewReady = false;

  @ViewChild('beforeChartCanvas', { static: false })
  beforeChartCanvas!: ElementRef<HTMLCanvasElement>;

  chart!: Chart<'doughnut', number[], string>;
  loading: boolean = false;

  constructor(
    private dbService: DashboardService,
    private cdr: ChangeDetectorRef,
    private csr: caseReliefService
  ) {}

  // 👉 Additional Relief Cards
  total_records: number = 0;
  before_2016: number = 0;
  after_2016: number = 0;

  additional_filter: number = 0;
  before_filter: number = 0;
  after_filter: number = 0;

  // 👉 Before Relief Table Values
  reliefJob = 0;
  reliefPension = 0;
  reliefPatta = 0;
  reliefEducation = 0;

  // 👉 Donut chart values
  chartGiven = 0;
  chartPending = 0;

  ngOnInit(): void {
    // 🔹 1. Additional Relief Data
    this.csr.additionalReliefData$.subscribe((res: any) => {
      this.total_records = res.total_records ?? 0;
      this.before_2016 = res.before_2016 ?? 0;
      this.after_2016 = res.after_2016 ?? 0;

      this.additional_filter = res.additional_relief_filter_case ?? 0;
      this.before_filter = res.before_filter_case ?? 0;
      this.after_filter = res.after_filter_case ?? 0;

      this.cdr.detectChanges();
    });

    // 🔹 2. Before Relief Status
    this.csr.additionalReliefBeforeData$.subscribe((response: any) => {
      this.chartGiven = response.reliefGiven ?? 0;
      this.chartPending = response.reliefPending ?? 0;

      this.reliefJob = response.reliefJobGiven ?? 0;
      this.reliefPension = response.reliefPensionGiven ?? 0;
      this.reliefPatta = response.reliefPattaGiven ?? 0;
      this.reliefEducation = response.reliefEducationGiven ?? 0;

      // SAFE chart update
      if (this.viewReady) {
        this.updateChart();
      }

      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.initChart(); // Safe creation
  }

  /** ---------------------------
   *   SAFE CHART INITIALIZER
   ---------------------------- */
  private initChart() {
    if (!this.beforeChartCanvas) return;

    this.chart = this.createDonutChart(
      this.beforeChartCanvas,
      [this.chartGiven, this.chartPending],
      ['Given', 'Pending']
    );
  }

  /** ---------------------------
   *     SAFE CHART UPDATER
   ---------------------------- */
  private updateChart() {
    if (!this.chart) {
      this.initChart();
      return;
    }

    this.chart.data.datasets[0].data = [this.chartGiven, this.chartPending];
    this.chart.update();
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
          legend: { position: 'bottom' }
        }
      },
      plugins: [
        {
          id: 'centerText',
          afterDraw(chart) {
            const { ctx } = chart;
            const dataset = chart.data.datasets[0].data as number[];
            const total = dataset.reduce((a, b) => a + b, 0);

            const centerX =
              chart.chartArea.left +
              (chart.chartArea.right - chart.chartArea.left) / 2;

            const centerY =
              chart.chartArea.top +
              (chart.chartArea.bottom - chart.chartArea.top) / 2;

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 18px Arial';
            ctx.fillStyle = '#000';
            ctx.fillText(total.toString(), centerX, centerY);
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
