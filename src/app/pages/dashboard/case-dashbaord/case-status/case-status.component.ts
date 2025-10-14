import { Component, ElementRef, ViewChild, OnInit, ChangeDetectorRef,OnDestroy } from '@angular/core';
import { Chart, ChartData, ChartType } from 'chart.js/auto';
import { homeCaseService } from '../home-case.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-case-status',
  templateUrl: './case-status.component.html',
  styleUrl: './case-status.component.scss'
})
export class CaseStatusComponent implements OnInit,OnDestroy {
  private subscription = new Subscription();
  loading:boolean=false;
  @ViewChild('pieChartstatus') pieChartstatus!: ElementRef;
  chartInstance: any;
  nature_of_offence :any= {}
  constructor(private hcs:homeCaseService,private cdr:ChangeDetectorRef){}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  // ngOnInit(): void {
  //   this.createPieChartForOffence();
  //   this.subscription.add(
  //     this.hcs.status$.subscribe((res:any)=>{
  //       if(res){
  //         this.nature_of_offence = res;
  //         this.createPieChartForOffence();
  //       }
  //       this.cdr.detectChanges();
  //     })
  //   )
  //   this.subscription.add(
  //     this.hcs.isStatusLoading$.subscribe((res:any)=>{
  //       this.loading = res;
  //       this.cdr.detectChanges();
  //     })
  //   )
  // }

  // createPieChartForOffence(): void {
  
  //     if (this.chartInstance) {
  //       this.chartInstance.destroy();
  //     }
  
  //     this.chartInstance = new Chart("pieChartstatus", {
  //       type: 'pie',
  //       data: {
  //         labels: ['',''],
  //         datasets: [{
  //           data: [
  //             Number(this.nature_of_offence.gcr),
  //             Number(this.nature_of_offence.non_gcr)
  //           ],
  //           backgroundColor: ['#e12a2a', '#3e42ea'],
  //           hoverBackgroundColor: ['#e12a2a', '#3e42ea'],
  //           borderWidth: 1
  //         }]
  //       },
  //       options: {
  //         responsive: true,
  //         plugins: {
  //           legend: {
  //             display: false
  //           },
  //           tooltip: {
  //             enabled: true
  //           },
  //         },
  //         interaction: {
  //           mode: 'none' as any,
  //           intersect: false
  //         },
  //         hover: {
  //           mode: undefined
  //         },
  //         animation: {
  //           onComplete: function (this: Chart) {
  //             const chart = this;
  //             const ctx = chart.ctx;
  
  //             chart.data.datasets.forEach((dataset, i) => {
  //               const numericData = dataset.data.filter((value): value is number => typeof value === 'number');
  //               const total = numericData.reduce((sum, value) => sum + value, 0);
  //               const meta = chart.getDatasetMeta(i);
  
  //               meta.data.forEach((slice, index) => {
  //                 const value = numericData[index];
  //                 const percentage = ((value / total) * 100).toFixed(2);
  //                 const label = chart.data.labels![index] as string;
  //                 const position = slice.tooltipPosition(true);
  //                 const posX = position.x;
  //                 const posY = position.y;
  //                 ctx.fillStyle = '#fff';
  //                 ctx.font = 'bold 13px Arial';
  //                 ctx.textAlign = 'center';
  //                 // ctx.fillText(`${label}: ${value} (${percentage}%)`, posX, posY - 5); // Adjusted position
  //                 ctx.fillText(label, posX, posY - 15);
  //                 ctx.fillText(`${value}`, posX, posY);
  //                 ctx.fillText(`(${percentage}%)`, posX, posY + 15);
  //               });
  //             });
  //           }
  //         }
  //       }
  //     });
  
  //   }

  ngOnInit(): void {
  this.subscription.add(
    this.hcs.natureOfoffence$.subscribe((res: any) => {
      if (res) {
        this.nature_of_offence = res.data?.[0] || res; // support both data[] or object
        console.log(this.nature_of_offence);
        this.createPieChartForOffence(); // create chart after data arrives
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



createPieChartForOffence(): void {
  if (this.chartInstance) {
    this.chartInstance.destroy();
  }

  // Step 1: Extract labels & values dynamically
  const entries = Object.entries(this.nature_of_offence)
    .filter(([key]) => key !== 'total'); // Exclude 'total' if needed

  const labels = entries.map(([key]) => key.toUpperCase());
  const values = entries.map(([_, value]) => Number(value));

  // Step 2: Generate blue gradient tones
  const blueColors = [
    '#0d47a1', // Dark Blue
    '#1565c0',
    '#1976d2',
    '#1e88e5',
    '#2196f3',
    '#42a5f5',
    '#64b5f6',
    '#90caf9'
  ];
  const backgroundColors = values.map((_, i) => blueColors[i % blueColors.length]);
  const hoverColors = backgroundColors.map(c => c); // same for hover

  // Step 3: Create Chart
  this.chartInstance = new Chart("pieChartstatus", {
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

              ctx.fillStyle = '#fff';
              ctx.font = 'bold 12px Arial';
              ctx.textAlign = 'center';

              // Show only NON GCR text inside pie
              if (label === 'NON_GCR') {
                ctx.fillText(label, position.x, position.y - 10);
                ctx.fillText(`${value}`, position.x, position.y + 5);
              }
            });
          });
        }
      }
    }
  });

  // Step 4: Adjust canvas size dynamically
  const canvas = document.getElementById('pieChartstatus') as HTMLCanvasElement;
  if (canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '300px';
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
