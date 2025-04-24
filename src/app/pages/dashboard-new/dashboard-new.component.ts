import { Component,OnInit } from '@angular/core';
import { TableComponent } from './table/table.component';
import { HorizontalBarComponent } from './horizontal-bar/horizontal-bar.component';
import { PiechartComponent } from './piechart/piechart.component';
import { DashboardService } from 'src/app/services/dashboard.service';
import { commondashboardSerivce } from '../dashboard/case-dashboard.service';
@Component({
  selector: 'app-dashboard-new',
  standalone: true,
  imports: [TableComponent,HorizontalBarComponent,PiechartComponent],
  templateUrl: './dashboard-new.component.html',
  styleUrl: './dashboard-new.component.scss'
})
export class DashboardNewComponent implements OnInit {
  values:any[]=[];
  years:any;
  zone:any;
  constructor(private dbserive: DashboardService, private cds:commondashboardSerivce) { }
  ngOnInit(): void {
    this.getPendingCaseZone({});
    this.cds.district$.subscribe((res:any)=>{
      if(res){
        this.getPendingCaseZone({district:res});
        console.log("selected dist",res);
      }
    })
  }
  onZoneClicked(zone: string) {
    this.zone = zone;
    console.log('zone',zone);
    if(zone===''){
      this.getPendingCaseZone({});
    }
    // Do something like filtering data or showing details
  }
  getPendingCaseZone(body: any) {
    console.log("pending")
    this.dbserive.userPostMethod('GetPendingCaseZoneWise', body).subscribe((res: any) => {
      const data = res.data;
      let values = [0, 0, 0, 0];
      const yearWiseData:any = [];
      for (let i = 0; i < data.length; i++) {
        // 'South Zone', 'Central Zone', 'North Zone', 'West Zone'
        if (data[i].zone === 'South Zone') {
          values[0] += data[i].total_cases;
        }
        else if (data[i].zone === 'Central Zone') {
          values[1] += data[i].total_cases;
        }
        else if (data[i].zone === 'North Zone') {
          values[2] += data[i].total_cases;
        }
        else if (data[i].zone === 'West Zone') {
          values[3] += data[i].total_cases;
        }
      }
      this.values = values;
      

      data.forEach((entry:any) => {
        let yearData = yearWiseData.find((y:any) => y.year === entry.year);
        if (!yearData) {
          yearData = { year: entry.year, sz: 0, cz: 0, nz: 0, wz: 0 };
          yearWiseData.push(yearData);
        }
        if (entry.zone === 'South Zone') yearData.sz += entry.total_cases;
        else if (entry.zone === 'Central Zone') yearData.cz += entry.total_cases;
        else if (entry.zone === 'North Zone') yearData.nz += entry.total_cases;
        else if (entry.zone === 'West Zone') yearData.wz += entry.total_cases;
      });
      this.years = yearWiseData;
    });

  }
  yearHandle(value:any){
    this.values = [value.sz, value.cz, value.nz, value.wz];
  }
}
