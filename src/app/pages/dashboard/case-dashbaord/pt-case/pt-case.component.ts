import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { homeCaseService } from '../home-case.service';
import { Chart} from 'chart.js/auto';
@Component({
  selector: 'app-pt-case',
  templateUrl: './pt-case.component.html',
  styleUrl: './pt-case.component.scss'
})
export class PtCaseComponent implements OnInit {
  constructor(private hcs:homeCaseService, private cdr:ChangeDetectorRef){}
  barChart1: Chart | null = null;
  ptBar: number[] = [];
  ngOnInit(): void {
    this.hcs.ptbar$.subscribe((res:any)=>{
      if(res){
        this.ptBar = res;
        this.createbarChart1();
      }
      this.cdr.detectChanges();
    })
  }
  createbarChart1(): void {
    const ptBar = this.ptBar;
    if (this.barChart1) {
      this.barChart1.destroy();
    }

    this.barChart1 = new Chart('barChart1', {
      type: 'bar',
      data: {
        labels: ['<1 Year', '1-5 Yrs', '6-10 Yrs', '11-20 Yrs', '>20 Yrs'],
        datasets: [
          {
            label: 'PTR (Pending Trial)',
            data: ptBar,
            backgroundColor: '#c7c7fa',
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
            const ctx = this.barChart1!.ctx;
            ctx.font = 'bold 13px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            this.barChart1!.data.datasets.forEach((dataset, datasetIndex) => {
              const meta = this.barChart1!.getDatasetMeta(datasetIndex);
              meta.data.forEach((bar, dataIndex) => {
                const value = dataset.data[dataIndex];
                const label = this.barChart1!.data.labels?.[dataIndex];
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
