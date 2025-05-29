import { Component,OnInit,ChangeDetectorRef,OnDestroy } from '@angular/core';
import { homeCaseService } from '../home-case.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-case-table',
  templateUrl: './case-table.component.html',
  styleUrl: './case-table.component.scss'
})
export class CaseTableComponent implements OnInit,OnDestroy {
  loading:boolean=true;
  private subscription = new Subscription();
  constructor(private cdr:ChangeDetectorRef, private hcs:homeCaseService){}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription.add(
      this.hcs.table$.subscribe((res:any)=>{
        if(res){
          this.zonewise = res.filter((item: any) => {return item.sz !== 0 || item.cz !== 0 || item.nz !== 0 || item.wz !== 0;});
          this.loading = false;
        }
        this.cdr.detectChanges();
      })
    )
    this.subscription.add(
      this.hcs.zoneEmit$.subscribe((res:any)=>{
        if(res){
          res = res==='null'?'':res;
          this.zone = res;
        }
        this.cdr.detectChanges();
      })
    )
  }
  public tabletop = [
    {year:'2023',UIB:'734',report:'2,068',charge:'1,706',refer:'514',UIE:'582'},
    {year:'2024 (up to September)',UIB:'582',report:'1,464',charge:'1,200',refer:'382',UIE:'464'},
  ]

  public tablebottom = [
    { "Nature": "Murder", "UIL": "17", "RFL": "23", "TCL": "45", "PFL": "12", "UIC": "38", "RFC": "9", "TCC": "56", "PFC": "32" },
    { "Nature": "Rape", "UIL": "21", "RFL": "34", "TCL": "11", "PFL": "42", "UIC": "28", "RFC": "5", "TCC": "77", "PFC": "64" },
    { "Nature": "POCSO", "UIL": "36", "RFL": "19", "TCL": "23", "PFL": "8", "UIC": "52", "RFC": "4", "TCC": "61", "PFC": "29" },
    { "Nature": "Arson", "UIL": "25", "RFL": "31", "TCL": "47", "PFL": "18", "UIC": "67", "RFC": "2", "TCC": "53", "PFC": "38" }
  ]

  public gcr = {
    "UIL": "836", 
    "RFL": "291", 
    "TCL": "517", 
    "PFL": "184", 
    "UIC": "673", 
    "RFC": "204", 
    "TCC": "539", 
    "PFC": "389"
  }  

  zonewise:any[]=[];
  zone:any;

  emitYear(item:any){
    const data = [item.sz,item.cz,item.nz,item.wz]
    this.hcs.setTable(data);
  }

}
