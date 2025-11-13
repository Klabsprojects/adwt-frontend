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
  processedLabels: string[] = [];
  processedValues: number[] = [];
  isMenuOpen: boolean = false; 
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

capitalizeWords(str: string): string {
    if (!str) return '';
    const formattedStr = str.toLowerCase().replace(/_/g, ' ');
    return formattedStr.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }


createPieChart(): void {
  if (this.chartInstance) {
    this.chartInstance.destroy();
  }

  // Step 1: Extract labels & values dynamically
  const entries = Object.entries(this.status_of_case)
    .filter(([key]) => key !== 'total'); // exclude total

 this.processedLabels = entries.map(([key]) => this.capitalizeWords(key));
    this.processedValues = entries.map(([_, value]) => Number(value));
    const labels = this.processedLabels;
    const values = this.processedValues;

  // Step 2: Blue gradient tones
  const blueColors = [
    '#0d47a1', '#1565c0', '#1976d2', '#1e88e5',
    '#2196f3', '#42a5f5', '#64b5f6', '#90caf9'
  ];
  const backgroundColors = values.map((_, i) => blueColors[i % blueColors.length]);
  const hoverColors = backgroundColors.map(c => c);

  
   this.chartInstance = new Chart("pieStatusOfCase", {
      type: 'bar', // 1. Changed to 'bar'
      data: {
        labels: labels,
        datasets: [{
          label: 'Counts', // Added a dataset label for clarity
          data: values,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverColors,
          borderColor: backgroundColors.map(c => c.replace('1', '3')),
          borderWidth: 1.5,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // 2. Makes the bar chart horizontal
        plugins: {
          legend: {
            display: false,
            position: 'bottom',
            labels: {
              boxWidth: 10,
              font: { size: 10 }
            }
          },
          tooltip: { enabled: true },
          datalabels: {
              color: '#FFFFFF', // Set text color to White
              anchor: 'center', // Position the label in the center of the bar
              align: 'center',
              font: {
                weight: 'bold',
                size: 12 // Reduced font size to 12
              },
              // Formatter function displays the value (count)
              formatter: (value: number) => {
                  // If the value is less than 200, return an empty string to hide the label
                  if (value < 200) {
                      return ''; 
                  }
                  return value.toLocaleString(); // Format number nicely
              }
            }
        },
        scales: { // Added scales configuration for a bar chart
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Value' // Label for the value axis
            }
          },
          y: {
            title: {
              display: true,
              text: 'Label' // Label for the category axis
            }
          }
        },
        
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
downloadPNG(): void {
  if (!this.chartInstance) return;
  const link = document.createElement('a');
  link.download = 'Status_of_Case.png';
  link.href = this.chartInstance.toBase64Image('image/png', 1.0);
  link.click();
}

downloadSVG(): void {
  const canvas = document.getElementById('pieStatusOfCase') as HTMLCanvasElement;
  if (!canvas) return;

  const svgData = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
      <foreignObject width="100%" height="100%">
        <canvas xmlns="http://www.w3.org/1999/xhtml" width="${canvas.width}" height="${canvas.height}">
          ${canvas.toDataURL()}
        </canvas>
      </foreignObject>
    </svg>
  `;

  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const link = document.createElement('a');
  link.download = 'Status_of_Case.svg';
  link.href = URL.createObjectURL(blob);
  link.click();
}

downloadCSV(): void {
  if (!this.processedLabels || !this.processedValues) return;

  let csv = 'Label,Value\n';
  for (let i = 0; i < this.processedLabels.length; i++) {
    csv += `"${this.processedLabels[i]}",${this.processedValues[i]}\n`;
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'Status_of_Case_Data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}
