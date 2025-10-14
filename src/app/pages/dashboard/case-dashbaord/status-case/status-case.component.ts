import { Component, ElementRef, ViewChild, OnInit, ChangeDetectorRef,OnDestroy } from '@angular/core';
import { Chart, ChartData, ChartType } from 'chart.js/auto';
import { homeCaseService } from '../home-case.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-status-case',
  templateUrl: './status-case.component.html',
  styleUrl: './status-case.component.scss'
})
export class StatusCaseComponent implements OnInit{
 private subscription = new Subscription();
  loading:boolean=false;
  @ViewChild('pieStatusOfCase') pieStatusOfCase!: ElementRef;
  chartInstance: any;
  status_of_case :any= {}
  constructor(private hcs:homeCaseService,private cdr:ChangeDetectorRef){}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  

  ngOnInit(): void {
  this.subscription.add(
    this.hcs.status$.subscribe((res: any) => {
      if (res) {
        this.status_of_case = res.data?.[0] || res; // support both data[] or object
        this.createPieChart(); // create chart after data arrives
      }
      this.cdr.detectChanges();
    })
  );

  this.subscription.add(
    this.hcs.isStatusLoading$.subscribe((res: any) => {
      this.loading = res;
      this.cdr.detectChanges();
    })
  );
}



createPieChart(): void {
  if (this.chartInstance) {
    this.chartInstance.destroy();
  }

  // Step 1: Extract labels & values dynamically
  const entries = Object.entries(this.status_of_case)
    .filter(([key]) => key !== 'total'); // exclude total

  const labels = entries.map(([key]) => key); // keep original text, can uppercase if needed
  const values = entries.map(([_, value]) => Number(value));

  // Step 2: Blue gradient tones
  const blueColors = [
    '#0d47a1', '#1565c0', '#1976d2', '#1e88e5',
    '#2196f3', '#42a5f5', '#64b5f6', '#90caf9'
  ];
  const backgroundColors = values.map((_, i) => blueColors[i % blueColors.length]);
  const hoverColors = backgroundColors.map(c => c);

  // Step 3: Create Chart
  this.chartInstance = new Chart("pieStatusOfCase", {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 10,
            font: { size: 10 }
          }
        },
        tooltip: { enabled: true }, // hover will show label & value
      },
      animation: {
        onComplete: function (this: Chart) {
          const chart = this;
          const ctx = chart.ctx;

          chart.data.datasets.forEach((dataset, i) => {
            const numericData = dataset.data.filter((value): value is number => typeof value === 'number');
            const meta = chart.getDatasetMeta(i);

            meta.data.forEach((slice, index) => {
              const value = numericData[index];
              const label = chart.data.labels![index] as string;
              const position = slice.tooltipPosition(true);

              ctx.fillStyle = '#fff'; // text color white
              ctx.font = 'bold 12px Arial';
              ctx.textAlign = 'center';

              // Show only UI and PT text inside pie slices (or choose one key)
              if (label === 'UI' || label === 'PT') {
                ctx.fillText(label, position.x, position.y - 10);
                ctx.fillText(`${value}`, position.x, position.y + 5);
              }
            });
          });
        }
      }
    }
  });

  // Step 4: Adjust canvas size
  const canvas = document.getElementById('pieStatusOfCase') as HTMLCanvasElement;
  if (canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '280px'; // Adjust as needed
  }
}

generateColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
  }
  return colors;
}
}
