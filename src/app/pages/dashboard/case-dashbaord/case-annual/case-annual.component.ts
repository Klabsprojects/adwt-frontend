import { Component,OnInit,ChangeDetectorRef } from '@angular/core';
import { Chart, ChartData, ChartType } from 'chart.js/auto';
import { homeCaseService } from '../home-case.service';
@Component({
  selector: 'app-case-annual',
  templateUrl: './case-annual.component.html',
  styleUrl: './case-annual.component.scss'
})
export class CaseAnnualComponent implements OnInit {
  constructor(private hcs:homeCaseService,private cdr:ChangeDetectorRef){}
  public Annualcases:any={}
ngOnInit(): void {
  this.hcs.annual$.subscribe((res:any)=>{
    if(res){
      this.Annualcases = res;
      console.log('Annualcases',this.Annualcases);
      this.createBarChart();
    }
    this.cdr.detectChanges();
  })
}
barChartannual:Chart | null = null;
createBarChart(): void {
    const uiBar = this.Annualcases.cases;

    if (this.barChartannual) {
      this.barChartannual.destroy();
    }

    this.barChartannual = new Chart('barChartannual', {
      type: 'bar',
      data: {
        labels: this.Annualcases.year,
        datasets: [
          {
            label: 'UI (Under Investigation)',
            data: uiBar,
            backgroundColor: '#414ce7',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        interaction: {
          mode: 'none' as any,
          intersect: false,
        },
        animation: {
          onComplete: () => {
            const ctx = this.barChartannual!.ctx;
            ctx.font = 'bold 13px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            this.barChartannual!.data.datasets.forEach((dataset, datasetIndex) => {
              const meta = this.barChartannual!.getDatasetMeta(datasetIndex);
              meta.data.forEach((bar, dataIndex) => {
                const value = dataset.data[dataIndex];
                const label = this.barChartannual!.data.labels?.[dataIndex];
                if (label && value !== undefined) {
                  // const text = `${label}: ${value}`;
                  const text = `${value}`;
                  const x = bar.x;
                  const y = bar.y - -2;
                  ctx.fillStyle = '#000000';
                  ctx.fillText(text, x, y);
                }
              });
            });
          },
        },
      },
    });
  }

}
