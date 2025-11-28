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
export class ReliefTableComponent implements OnInit, AfterViewInit, OnDestroy {
  firChart: any;
  chargeChart: any;
  trialChart: any;

  public tableData: any[] = [];
  loading = false;
  private subscription = new Subscription();
  private initialData: any = null;
  private viewReady = false;



  @ViewChild('firChartCanvas') firChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chargeChartCanvas') chargeChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trialChartCanvas') trialChartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private crs: caseReliefService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscription.add(
      this.crs.tabledata$.subscribe((res: any) => {

        if (res && res.length > 0) {
          this.tableData = res;
          this.initialData = res[0];
        }

        this.loading = !res || res.length === 0;
        this.cdr.detectChanges();
        if (this.viewReady && this.initialData) {
        this.createChartsFromAPI(this.initialData);
      }
      })
    );
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
  if (this.initialData) {
    this.createChartsFromAPI(this.initialData);
  }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyCharts();
  }

  // -----------------------
  // CHART CREATION METHODS
  // -----------------------
  createChartsFromAPI(data: any): void {
    this.destroyCharts();

    // FIR Stage
    this.firChart = this.createDonutChart(
      this.firChartCanvas,
      [data.fir_relief_given, data.fir_relief_pending],
      ['Given', 'Pending']
    );

    // Chargesheet Stage
    this.chargeChart = this.createDonutChart(
      this.chargeChartCanvas,
      [data.chargesheet_relief_given, data.chargesheet_relief_pending],
      ['Given', 'Pending']
    );

    // Trial Stage
    this.trialChart = this.createDonutChart(
      this.trialChartCanvas,
      [data.trial_relief_given, data.trial_relief_pending],
      ['Given', 'Pending']
    );
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
        },
      },
      plugins: [
        {
          id: 'centerText',
          afterDraw(chart) {
            const { ctx } = chart;
            const dataset = chart.data.datasets[0].data as number[];
            const total = dataset.reduce((a, b) => a + b, 0);

            const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
            const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 18px Arial';
            ctx.fillStyle = '#000';
            ctx.fillText(total.toString(), centerX, centerY);
            ctx.restore();
          },
        },
      ],
    } as any);
  }
}
