import { Component ,AfterViewInit} from '@angular/core';
import { Chart , registerables} from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-com-dashboard',
  templateUrl: './com-dashboard.component.html',
  styleUrl: './com-dashboard.component.scss'
})


export class ComDashboardComponent implements AfterViewInit{
  barChart1: Chart | null = null;



  ngAfterViewInit(): void {
    // Register Chart.js components
    Chart.register(...registerables);

    // Create the chart
    const ctx = document.getElementById('barChart1') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'], // Quarters
        datasets: [
          {
            label: 'Completed',
            data: [0, 50, 0, 70], // Completed values
            backgroundColor: '#4caf50',
          },
          {
            label: 'Pending',
            data: [100, 50, 100, 30], // Pending values
            backgroundColor: '#f44336',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context: any) => `${context.dataset.label}: ${context.raw}`,
            },
          },
        },
        scales: {
          x: {
            stacked: true, // Stack bars horizontally
          },
          y: {
            stacked: true, // Stack bars vertically
            beginAtZero: true,
          },
        },
      },
    });
  }

}
