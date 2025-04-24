import { Component, ElementRef, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { Chart, ChartData, ChartType } from 'chart.js/auto';
import { homeCaseService } from '../home-case.service';
@Component({
  selector: 'app-case-status',
  templateUrl: './case-status.component.html',
  styleUrl: './case-status.component.scss'
})
export class CaseStatusComponent implements OnInit {
  @ViewChild('pieChartstatus') pieChartstatus!: ElementRef;
  chartInstance: any;
  status_of_case = {
    gcr:1,
    non_gcr:1
  }
  constructor(private hcs:homeCaseService,private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    this.createPieChart();
    this.hcs.status$.subscribe((res:any)=>{
      if(res){
        this.status_of_case = res;
        this.createPieChart();
      }
      this.cdr.detectChanges();
    })
  }

  createPieChart(): void {
  
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
  
      this.chartInstance = new Chart("pieChartstatus", {
        type: 'pie',
        data: {
          labels: ['',''],
          datasets: [{
            data: [
              Number(this.status_of_case.gcr),
              Number(this.status_of_case.non_gcr)
            ],
            backgroundColor: ['#e12a2a', '#3e42ea'],
            hoverBackgroundColor: ['#e12a2a', '#3e42ea'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true
            },
          },
          interaction: {
            mode: 'none' as any,
            intersect: false
          },
          hover: {
            mode: undefined
          },
          animation: {
            onComplete: function (this: Chart) {
              const chart = this;
              const ctx = chart.ctx;
  
              chart.data.datasets.forEach((dataset, i) => {
                const numericData = dataset.data.filter((value): value is number => typeof value === 'number');
                const total = numericData.reduce((sum, value) => sum + value, 0);
                const meta = chart.getDatasetMeta(i);
  
                meta.data.forEach((slice, index) => {
                  const value = numericData[index];
                  const percentage = ((value / total) * 100).toFixed(2);
                  const label = chart.data.labels![index] as string;
                  const position = slice.tooltipPosition(true);
                  const posX = position.x;
                  const posY = position.y;
                  ctx.fillStyle = '#fff';
                  ctx.font = 'bold 13px Arial';
                  ctx.textAlign = 'center';
                  // ctx.fillText(`${label}: ${value} (${percentage}%)`, posX, posY - 5); // Adjusted position
                  ctx.fillText(label, posX, posY - 15);
                  ctx.fillText(`${value}`, posX, posY);
                  ctx.fillText(`(${percentage}%)`, posX, posY + 15);
                });
              });
            }
          }
        }
      });
  
    }



}
