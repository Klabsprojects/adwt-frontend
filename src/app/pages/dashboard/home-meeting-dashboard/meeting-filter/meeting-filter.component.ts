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
  selectedDistrict:string='';
  selectedSubDivision:string='';
  ngOnInit(): void {
    this.ds.userGetMethod('vmcmeeting/districts').subscribe((res:any)=>{
      this.distandsubdivs = res;
      this.districts = Object.keys(res);
    })
    this.getFilterDatas();
  }
  selectDistrict(event:any){
    if(event.target.value){
      this.selectedDistrict = event.target.value;
      this.subdivs = this.distandsubdivs[event.target.value];
    }
    else{
      this.selectedDistrict = '';
      this.subdivs = [];
    }
    this.getFilterDatas();
  }
  selectSubdiv(event:any){
    if(event.target.value){
      this.selectedSubDivision = event.target.value;
    }
    else{
      this.selectedSubDivision = '';
    }
    this.getFilterDatas();
  }

  getFilterDatas(){
    let body;
    if(this.selectedDistrict && this.selectedSubDivision){
      body = {district:this.selectedDistrict,subdivision:this.selectedSubDivision};
    }
    else if(this.selectedDistrict && !this.selectedSubDivision){
      body = {district:this.selectedDistrict};
    }
    else if(!this.selectedDistrict && this.selectedSubDivision){
      body = {subdivision:this.selectedSubDivision};
    }
    else if(!this.selectedDistrict && !this.selectedSubDivision){
      body = {};
    }
    this.getCarddetails(body);
    this.getDLMD(body);
    this.getSDLMD(body);
    this.getQWSMS(body);
  }

  getCarddetails(body:any){
    this.ds.userPostMethod('GetVmcDashboardCardsValues',body).subscribe((res:any)=>{
      this.hms.setCardDetails(res.data[0]);
    })
  }

  getDLMD(body:any){
    this.ds.userPostMethod('GetVmcQuarterlyMeetingStats',body).subscribe((res:any)=>{
      this.hms.setDlmdDetails(res.data);
    })
  }
  getSDLMD(body:any){
    this.ds.userPostMethod('GetVmcSubdivisionMeetingStats',body).subscribe((res:any)=>{
      this.hms.setSblmdDetails(res.data);
    })
  }
  getQWSMS(body:any){
    this.ds.userPostMethod('GetQuarterWiseMeetingStatus',body).subscribe((res:any)=>{
      this.hms.setQwsms(res.data);
    })
  }

  clear(){
    this.selectedDistrict = '';
    this.selectedSubDivision = '';
    this.subdivs=[];
    this.getFilterDatas();
    this.cdr.detectChanges()
  }

}
