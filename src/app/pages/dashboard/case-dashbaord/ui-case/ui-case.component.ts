import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { homeCaseService } from '../home-case.service';
import { Chart} from 'chart.js/auto';

@Component({
  selector: 'app-ui-case',
  templateUrl: './ui-case.component.html',
  styleUrl: './ui-case.component.scss'
})
export class UiCaseComponent {
  constructor(private hcs:homeCaseService, private cdr:ChangeDetectorRef){}
  barChart2: Chart | null = null;
  uiBar: number[] = [];
  ngOnInit(): void {
    this.hcs.uibar$.subscribe((res:any)=>{
      if(res){
        this.uiBar = res;
        this.createbarChart2();
      }
      this.cdr.detectChanges();
    })
  }
  createbarChart2(): void {
    const uiBar = this.uiBar;

    if (this.barChart2) {
      this.barChart2.destroy();
    }

    this.barChart2 = new Chart('barChart2', {
      type: 'bar',
      data: {
        labels: ['< 2 Mos', '2-4 Mos', '4-6 Mos', '6-12 Mos', '> 1 Yrs'],
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
            const ctx = this.barChart2!.ctx;
            ctx.font = 'bold 13px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            this.barChart2!.data.datasets.forEach((dataset, datasetIndex) => {
              const meta = this.barChart2!.getDatasetMeta(datasetIndex);
              meta.data.forEach((bar, dataIndex) => {
                const value = dataset.data[dataIndex];
                const label = this.barChart2!.data.labels?.[dataIndex];
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

