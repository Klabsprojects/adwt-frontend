import { Component } from '@angular/core';
import { LandingService } from '../landing.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  constructor(public lang:LandingService){
    
  }
  collegeData = [
    { id: 1, type: "Arts and Science Colleges", government: 164, aided: 139, selfFinancing: 646, total: 949 },
    { id: 2, type: "Physical Education", government: 0, aided: 3, selfFinancing: 8, total: 11 },
    { id: 3, type: "Oriental", government: 0, aided: 4, selfFinancing: 0, total: 4 },
    { id: 4, type: "School of Social Work", government: 0, aided: 2, selfFinancing: 0, total: 2 },
    { id: 5, type: "Colleges of Education", government: 7, aided: 14, selfFinancing: 639, total: 660 }
  ];
}
