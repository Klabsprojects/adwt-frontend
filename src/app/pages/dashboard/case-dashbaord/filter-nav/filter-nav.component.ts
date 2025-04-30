import { Component, OnInit,OnDestroy } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { homeCaseService } from '../home-case.service';
import { commondashboardSerivce } from '../../case-dashboard.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-filter-nav',
  templateUrl: './filter-nav.component.html',
  styleUrls: ['./filter-nav.component.css']
})
export class FilterNavComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  status: any[]=[
    { key: 'UI', value: 'UI Stage' },
    { key: 'PT', value: 'PT Stage' },
  ]
  districts:any=[];
  communities:any[]=[];
  castes:any[]=[];
  zones:any[]=[];
  offences:any[]=[];
  policeCities:any[]=[];
  fromdate:any;
  todate:any;
  private userData:any;

  selectedStatus:string='';
  selectedDistricts:string='';
  selectedCommunity:string='';
  selectedCaste:string='';
  selectedZone:string='';
  selectedOffence:string='';
  selectedPoliceCity:string=''
  selectedFromDate:any="";
  selectedToDate:any="";

  filterOptions: any = {
    status: [
      { key: 'UI', value: 'UI Stage' },
      { key: 'PT', value: 'PT Stage' },
    ],
    district: [],
    caste: [],
    subcaste: [],
    gender: ['Male', 'Female', 'Other'],
  };
  selectedFilters = {
    status: '',
    district: '',
    caste: '',
    subcaste: '',
    gender: '',
    dateRange: '',
    fromDate: '',
    toDate: ''
  };
  constructor(private dashboardService: DashboardService, private hcs:homeCaseService,private cds:commondashboardSerivce) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    const JsonData = sessionStorage.getItem('user_data');
    this.userData = JsonData ? JSON.parse(JsonData) : {};
    const userData = JsonData ? JSON.parse(JsonData) : {};
    const body = userData.access_type==='District'? {district:userData.district}:{};
    this.callAllfunction();
    this.subscription.add(
      this.hcs.distrct$.subscribe((res:any)=>{
        if(res){
          if(Object.keys(body).length === 0){
            this.selectedDistricts = res;
            this.callAllfunction();
          }
        }
      })
    )
  }
  get filterJson(){
    return {
      "district": this.selectedDistricts,
      "community":this.selectedCommunity,
      "caste":this.selectedCaste,
      "police_city":this.selectedPoliceCity,
      "Status_Of_Case":this.selectedStatus,
      "police_zone": this.selectedZone,
      "offence" : this.selectedOffence,
      "Filter_From_Date" : this.selectedFromDate,
      "Filter_To_Date" : this.selectedToDate
    }
  }
  callAllfunction(){
    this.getDropdowns();
    this.getOtherValues();
  }
  getDropdowns() {
    this.dashboardService.userGetMethod('districts').subscribe((res:any)=>{
      this.districts = res;
    })
    this.dashboardService.userGetMethod('fir/communities').subscribe((res:any)=>{
      this.communities = res;
    })
    this.dashboardService.userGetMethod('Zone_Filter_Data').subscribe((res:any)=>{
      this.zones = res.data;
    })
    this.dashboardService.userGetMethod('GetOffence').subscribe((res:any)=>{
      this.offences = res.data;
    })
    this.dashboardService.userGetMethod('Police_City_filtet_data').subscribe((res:any)=>{
      this.policeCities = res.data;
    })
  }
  getCaste(){
    if(this.selectedCommunity){
      this.dashboardService.userGetMethod(`fir/castes-by-community?community=${this.selectedCommunity}`).subscribe((res:any)=>{
        this.castes = res;
      })
    }
    this.getOtherValues();
  }
  getOtherValues(){
    this.hcs.setFilterJson(this.filterJson);
  }
  clear(){
    this.selectedStatus ='';
    this.selectedDistricts ='';
    this.selectedCommunity ='';
    this.selectedCaste ='';
    this.selectedZone ='';
    this.selectedOffence ='';
    this.selectedPoliceCity ='';
    this.selectedFromDate ='';
    this.selectedToDate ='';
    this.selectedPoliceCity='';
    this.getOtherValues();
  }
}
