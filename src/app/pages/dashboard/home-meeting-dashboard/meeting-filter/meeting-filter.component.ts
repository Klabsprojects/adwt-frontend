import { Component,OnInit,ChangeDetectorRef } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { homeMeetingService } from '../home-meeting.service';
@Component({
  selector: 'app-meeting-filter',
  templateUrl: './meeting-filter.component.html',
  styleUrl: './meeting-filter.component.scss'
})
export class MeetingFilterComponent implements OnInit {
  constructor(private ds:DashboardService,private hms:homeMeetingService, private cdr:ChangeDetectorRef){}
  distandsubdivs:any;
  districts:any[]=[];
  subdivs:any[]=[];

  selectedDistrict:string = '';
  selectedSubDivision:string = '';
  selectedQuarter:string = '';
  selectedyear:string = '';
  isDistrictDisabled:boolean=false;
  private userData:any;
  ngOnInit(): void {
    const JsonData = sessionStorage.getItem('user_data');
    this.userData = JsonData ? JSON.parse(JsonData) : {};
    this.getDisctricts();
  }
  
  getDisctricts(){
    this.ds.userGetMethod('vmcmeeting/districts').subscribe((res:any)=>{
      this.distandsubdivs = res;
      this.districts = Object.keys(res);
      this.get_other_values();
    })
  }

  getSubdivisions(){
    if(this.selectedDistrict){
      this.subdivs = this.distandsubdivs[this.selectedDistrict];
    }
    else{
      this.subdivs = [];
    }
    this.get_other_values();
  }

  get_other_values(){
    if(this.userData.access_type==="District"){
      this.filterJson.district = this.userData.district;
      this.selectedDistrict = this.userData.district;
      this.isDistrictDisabled = true;
      this.subdivs = this.distandsubdivs[this.selectedDistrict];
    }
    this.hms.setFilterJson(this.filterJson);
  }

  get filterJson() {
    return {
      "quarter": this.selectedQuarter,
      "district": this.selectedDistrict,
      "subdivision": this.selectedSubDivision,
      "year":this.selectedyear
    };
  }

  clear(){
    this.selectedDistrict = '';
    this.selectedSubDivision = '';
    this.selectedQuarter = '';
    this.subdivs=[];
    this.get_other_values();
    this.cdr.detectChanges()
  }

}
