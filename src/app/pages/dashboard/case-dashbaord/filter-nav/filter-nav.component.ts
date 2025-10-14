import { Component, OnInit,OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { homeCaseService } from '../home-case.service';
import { commondashboardSerivce } from '../../case-dashboard.service';
import { FirService } from 'src/app/services/fir.service';
import { PoliceDivisionService } from 'src/app/services/police-division.service';
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

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
  public isDistrictDisabled:boolean=false;
  public isPolicecityDisabled:boolean=false;

  selectedStatus:string='';
  selectedDataEntryStatus:string='';
  selectedChargeSheetToDate:string='';
  selectedChargeSheetFromDate:string='';
  selectedDistricts:string='';
  selectedDistrict:string = '';
  selectedPoliceZone:string='';
  selectedCommunity:string='';
  selectedCaste:string='';
  selectedZone:string='';
  selectedOffence:string='';
  selectedPoliceCity:string=''
  selectedFromDate:any="";
  selectedToDate:any="";
  policeZones: any;
  selectedPoliceRange:string='';
  policeRanges:any;
  selectedRevenue_district:string='';
  revenueDistricts:any;
  selectedPoliceStation:string='';
  years: number[] = [];
  RegistredYear: string = '';
  startDate: string = '';
  endDate: string = '';
  CreatedATstartDate: string = '';
  CreatedATendDate: string = '';
  ModifiedATstartDate: string = '';
  ModifiedATDate: string = '';
  selectedStatusOfCase: string = '';
  selectedOffenceGroup: string = '';
  selectedSectionOfLaw:string='';
  selectedCourt:string='';
  selectedConvictionType:string='';
  selectedChargeSheetDate:string='';
  selectedLegal:string='';
  selectedCase:string='';
  selectedFiled:string='';
  selectedAppeal:string='';
  selectedJudgementType:string='';

  offenceGroupsList: string[] = [
    "Non GCR",
    "Murder",
    "Rape",
    "POCSO",
    "Other POCSO",
    "Gang Rape",
    "Rape by Cheating",
    "Arson",
    "Death",
    "GCR",
    "Attempt Murder",
    "Rape POCSO"
  ];

  
  filterFields = [
  { key: 'city', label: 'Police City', visible: true },
  { key: 'zone', label: 'Police Zone', visible: false },
  { key: 'range', label: 'Police Range', visible: false },
  { key: 'revenueDistrict', label: 'Revenue District', visible: true },
  { key: 'station', label: 'Police Station', visible: false },
  { key: 'community', label: 'Community', visible: true },
  { key: 'caste', label: 'Caste', visible: false },
  { key: 'regDate', label: 'Reg. Date From - To', visible: true },
  { key: 'status', label: 'Status of Case', visible: true },
  { key: 'dataEntryStatus', label: 'Data Entry Status', visible: false },
  { key: 'offenceGroup', label: 'Nature of Case', visible: true },
  { key: 'sectionOfLaw', label: 'Section of Law', visible: false },
  { key: 'chargeSheetDate', label: 'Chargesheet Date', visible: true },
  { key: 'court', label: 'Court', visible: false },
  // { key: 'judgementType', label: 'Judgement Type', visible: true },
  { key: 'convictionType', label: 'Conviction Type', visible: false }
];

activeFilters: string[] = ['city', 'revenueDistrict', 'community','regDate','status','offenceGroup','chargeSheetDate'];

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

  policeStations: string[] = [];
  communitiesOptions: string[] = [];
  casteOptions:string[]=[];
  sectionOfLaw: any[] = [];
  courtList:any[]=[];

  constructor(private firService: FirListTestService,private policeDivisionService: PoliceDivisionService,private firGetService: FirService,private cdr: ChangeDetectorRef,private dashboardService: DashboardService, private hcs:homeCaseService,private cds:commondashboardSerivce) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    const JsonData = sessionStorage.getItem('user_data');
    this.userData = JsonData ? JSON.parse(JsonData) : {};
    const userData = JsonData ? JSON.parse(JsonData) : {};
    const body = userData.access_type==='District'? {district:userData.district}:{};
    // this.callAllfunction();
    this.subscription.add(
      this.hcs.distrct$.subscribe((res:any)=>{
        // if(res){
          // console.log("res1",res)
          // if(Object.keys(body).length === 0){
            this.selectedDistricts = res;
            this.callAllfunction();
          // } 
        // }
      })
    )
    this.loadPoliceDivision();
    this.loadPoliceRanges();
    this.loadRevenue_district();
    this.generateYearOptions();
    this.loadCommunities();
    this.loadOptions();
    this.updateFilterVisibility();
  }

  updateFilterVisibility() {
  this.filterFields.forEach(f => {
    f.visible = this.activeFilters.includes(f.key);
  });
}

isVisible(key: string): boolean {
  const field = this.filterFields.find(f => f.key === key);
  return field ? field.visible : false;
}

  get filterJson(){
    return {
      "police_city":this.selectedPoliceCity,
      "police_zone": this.selectedZone,
      "police_range":this.selectedPoliceRange,
      "district": this.selectedDistricts,
      "policeStation": this.selectedPoliceStation,
      "community":this.selectedCommunity,
      "caste":this.selectedCaste,
      "start_date" : this.selectedFromDate,
      "end_date" : this.selectedToDate,
      "statusOfCase":this.selectedStatus,
      "dataEntryStatus":this.selectedDataEntryStatus,
      "OffenceGroup" : this.selectedOffence,
      "sectionOfLaw":this.selectedSectionOfLaw,
      "chargesheetFromDate":this.selectedChargeSheetFromDate,
      "chargesheetToDate":this.selectedChargeSheetToDate,
      "court":this.selectedCourt,
      "convictionType":this.selectedConvictionType
     

    }
  }
  callAllfunction(){
    this.getDropdowns();
    this.getOtherValues();
  }
  getDropdowns() {
    this.dashboardService.userGetMethod('districts').subscribe((res:any)=>{
      this.districts = res;
      // console.log(this.districts);
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
    if(this.userData.access_type==="District"){
      this.filterJson.district = this.userData.district;
      this.selectedDistricts = this.userData.district;
      this.isDistrictDisabled = true;
    }
    else if(this.userData.role==='3'){
      this.filterJson.police_city = this.userData.police_city;
      this.selectedPoliceCity = this.userData.police_city;
      this.isPolicecityDisabled = true;
    }
    this.hcs.setFilterJson(this.filterJson);
  }
  clear(){
    this.selectedPoliceCity ='';
    this.selectedZone ='';
    this.selectedPoliceRange ='';
    this.selectedDistricts ='';
    this.selectedPoliceStation ='';
    this.selectedCommunity ='';
    this.selectedCaste ='';
    this.selectedFromDate ='';
    this.selectedToDate ='';
    this.selectedStatus='';
    this.selectedDataEntryStatus='';
    this.selectedOffence='';
    this.selectedSectionOfLaw='';
    this.selectedChargeSheetFromDate='';
    this.selectedChargeSheetToDate='';
    this.selectedCourt='';
    this.selectedJudgementType='';
    this.selectedConvictionType='';
    this.getOtherValues();
  }
  onCityChange(event: any)
{

  const district = event.target.value;
   if (district) {
      this.firGetService.getPoliceStations(district).subscribe(
        (stations: string[]) => {
          this.policeStations = stations.map(station =>
            station.replace(/\s+/g, '-')); // Replace spaces with "-"
          this.cdr.detectChanges(); // Trigger UI update
        },
        (error) => {
          console.error('Error fetching police stations:', error);
        }
      );
    }
      // this.loadPoliceStations(district);
}
onDistrictChange(event:any){
 const selectedDivision = event.target.value;
 
     if (selectedDivision) {
       this.firGetService.getCourtRangesByDivision(selectedDivision).subscribe(
         (ranges: string[]) => {
           this.courtList = ranges; // Populate court range options based on division
         },
         (error) => {
           console.error('Error fetching court ranges:', error);
           Swal.fire('Error', 'Failed to load court ranges for the selected division.', 'error');
         }
       );
     }
}

loadPoliceRanges() {
    this.firService.getPoliceRanges().subscribe(
      (response: any) => {
        this.policeRanges = response;
      },
      (error: any) => {
        console.error('Error', 'Failed to load FIR data', 'error', error);
      }
    );
  }


  loadRevenue_district() {
    this.firService.getRevenue_district().subscribe(
      (response: any) => {
        this.revenueDistricts = response;
      },
      (error: any) => {
        console.error('Error', 'Failed to load FIR data', 'error', error);
      }
    );
  }


  loadPoliceDivision() {
    this.policeDivisionService.getAllPoliceDivisions().subscribe(
      (data: any) => {

        // this.districts = data.map((item: any) => item.district_division_name);
        // console.log(this.districts);
        this.policeZones = data.map((item: any) => item.police_zone_name);
        this.policeZones = [...new Set(this.policeZones)];
      },
      (error: any) => {
        console.error(error)
      }
    );
  }

  generateYearOptions(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1980; year--) {
      this.years.push(year);
    }
  }
  loadCommunities(): void {
    this.firGetService.getAllCommunities().subscribe(
      (communities: any) => {
        this.communitiesOptions = communities; // Populate community options
      },
      (error) => {
        console.error('Error loading communities:', error);
        Swal.fire('Error', 'Failed to load communities.', 'error');
      }
    );
  }

  onCommunityChange(event: any): void {
  const selectedCommunity = event.target.value;
  console.log('Selected community:', selectedCommunity);

  if (selectedCommunity) {
    this.firGetService.getCastesByCommunity(selectedCommunity).subscribe(
      (res: string[]) => {
        console.log('API caste list:', res);
        this.casteOptions = [];
        res.forEach(caste => {
          this.casteOptions.push(caste);
        });

        // Optional: trigger change detection
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching castes:', error);
        Swal.fire('Error', 'Failed to load castes for the selected community.', 'error');
      }
    );
  } 
}


  loadOptions() {
    this.firGetService.getOffences().subscribe(
      (offences: any) => {
        this.sectionOfLaw = offences
          .filter((offence: any) => offence.offence_act_name !== '3(2)(va)' && offence.offence_act_name !== '3(2)(v) , 3(2)(va)');
          this.sectionOfLaw.push(
              { offence_act_name: '3(2)(va)', offence_name: '3(2)(va)', id : 24 },
              { offence_act_name: '3(2)(v), 3(2)(va)', offence_name: '3(2)(v), 3(2)(va)', id: 25 }
          );
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load offence options.', 'error');
      }
    );
  }

   SearchList() {
   }

   clearfilter() {
 this.selectedDistrict='';
 this.selectedPoliceZone='';
  this.selectedPoliceRange='';
 this.selectedRevenue_district='';
 this.selectedPoliceStation='';
  this.selectedCommunity='';
  this.selectedCaste='';
  this.RegistredYear='';
  this.CreatedATstartDate='';
  this.CreatedATendDate='';
  this.ModifiedATstartDate='';
  this.ModifiedATDate='';
  this.startDate='';
  this.endDate='';
  this.selectedStatusOfCase='';
  this.selectedSectionOfLaw='';
  this.selectedCourt='';
  this.selectedConvictionType='';
  this.selectedChargeSheetDate='';
  this.selectedLegal='';
  this.selectedCase='';
  this.selectedFiled='';
  this.selectedAppeal='';

  }

}
