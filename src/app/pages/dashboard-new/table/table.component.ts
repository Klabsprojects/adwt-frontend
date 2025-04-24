import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() zonewise:any[]=[];
  @Input() zone:any;
  @Output() yearEmit = new EventEmitter<any>();
  // public zonewise = [
  //   { year: 2021, cz: 120, wz: 95, nz: 110, sz: 130 },
  //   { year: 2022, cz: 140, wz: 105, nz: 115, sz: 125 },
  //   { year: 2023, cz: 135, wz: 98, nz: 120, sz: 140 },
  //   { year: 2024, cz: 150, wz: 110, nz: 130, sz: 145 },
  // ];
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
  emitYear(year:any){
    this.yearEmit.emit(year);
  }
}
