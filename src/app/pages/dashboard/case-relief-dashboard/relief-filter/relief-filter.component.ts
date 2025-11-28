import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { caseReliefService } from '../cas-relief.service';
import { FirService } from 'src/app/services/fir.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-relief-filter',
  templateUrl: './relief-filter.component.html',
  styleUrl: './relief-filter.component.scss'
})
export class ReliefFilterComponent implements OnInit {
  before_after: string[] = [];
  reliefPending:string[]=[];
  expenditure:string[]=[];
  reliefData:string[]=[];
  districts: any[] = [];
  communities: any[] = [];
  castes: any[] = [];
  nature_of_offence: any[] = [];
  relief_status: any[] = [];
  policeCities:any[]=[];
  policeStations: string[] = [];
  sectionOfLaw:any[]=[];

  selectedBeforeAfter: string = '';
  selectedDistrict: string = '';
  selectedCommunity: string = '';
  selectedCaste: string = '';
  selectedNatureOfOffence: string = '';
  selectedReliefStatus: string = '';
  selectedPoliceCity:string = '';
  selectedPoliceStation:string='';
  selectedSectionOfLaw:string='';
  selectedChargeSheetFromDate:string='';
  selectedChargeSheetToDate:string='';
  selectedFromDate:string='';
  selectedToDate:string='';
  selectedAmountFromDate:string='';
  selectedAmountToDate:string='';
  selectedStatus:string='';
  selectedReliefDataEntryStatus:string='';
  selectedReliefStage:string='';

  isDistrictDisabled:boolean=false;
  private userData:any;
    filterFields = [
  { key: 'before/after', label: 'Before / After 2016', visible: true },
  { key: 'city', label: 'Police City', visible: false },
  { key: 'revenueDistrict', label: 'Revenue District', visible: true },
  { key: 'station', label: 'Police Station', visible: false },
  { key: 'community', label: 'Community', visible: true },
  { key: 'caste', label: 'Caste', visible: false },
  { key: 'offenceGroup', label: 'Nature of Case', visible: true },
  { key: 'sectionOfLaw', label: 'Section of Law', visible: false },
  { key: 'chargeSheetDate', label: 'Chargesheet Date', visible: false },
  { key: 'regDate', label: 'Reg. Date From - To', visible: true },
  { key: 'amountDate', label: 'Date of Amount Disbursed', visible: false },
  { key: 'status', label: 'Status of Case', visible: true },
  { key: 'reliefDataEntryStatus', label: 'Relief Data Entry Status', visible: false },
  { key: 'reliefStage', label: 'Relief Stage', visible: true },
  { key: 'reliefDataEntryStatus', label:'Relief Data Entry Status', visible: false},
  { key: 'reliefStage', label:'Relief Stage', visible: true},
  { key: 'additionalReliefType', label: 'Type of Additional Relief', visible: true },
  
];

activeFilters: string[] = ['before/after','city', 'revenueDistrict', 'community','regDate','status','offenceGroup','additionalReliefType','reliefStage'];


  constructor(private ds: DashboardService, private crs: caseReliefService,private cdr: ChangeDetectorRef,private firGetService: FirService) { }
  ngOnInit() {
    const JsonData = sessionStorage.getItem('user_data');
    this.userData = JsonData ? JSON.parse(JsonData) : {};
    this.callAllFunction({});
    this.updateFilterVisibility();
    this.getDropdowns();
    this.loadOptions();
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

  getDropdowns() {
     this.ds.userGetMethod('Police_City_filtet_data').subscribe((res:any)=>{
      this.policeCities = res.data;
    })
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

  get filterJson() {
    return {
      // "Two_thousand_sixteen": this.selectedBeforeAfter,
      // "district": this.selectedDistrict,
      // "community": this.selectedCommunity,
      // "caste": this.selectedCaste,
      // "offence": this.selectedNatureOfOffence,
      // "relief_status": this.selectedReliefStatus
      "police_city":this.selectedPoliceCity,
      "police_station":this.selectedPoliceStation,
      "district": this.selectedDistrict,
      "Filter_From_Date":this.selectedFromDate,
      "Filter_To_Date":this.selectedToDate
    };
  }

  clear(){
    this.selectedBeforeAfter = '';
    this.selectedPoliceCity = '';
    this.selectedDistrict='';
    this.selectedPoliceStation='';
    this.selectedCommunity = '';
    this.selectedCaste = '';
    this.selectedNatureOfOffence = '';
    this.selectedSectionOfLaw='';
    this.selectedChargeSheetFromDate = '';
    this.selectedChargeSheetToDate = '';
    this.selectedFromDate = '';
    this.selectedToDate = '';
    this.selectedAmountFromDate = '';
    this.selectedAmountToDate = '';
    this.selectedStatus='';
    this.selectedReliefDataEntryStatus = '';
    this.selectedReliefStage = '';
    this.selectedReliefStatus = '';
    this.get_other_details();
  }
  

  callAllFunction(body: any) {
    // this.get_before_after();
    this.get_disctrcits();
    this.get_communities();
    this.get_offence_nature();
    this.get_relief_status();
    this.get_other_details();
  }

  // get_before_after() {
  //   this.ds.userGetMethod('Get_Two_thousand_sixteen_Status').subscribe((res: any) => {
  //     this.before_after = res.data;
  //   })
  // }
 
  
  get_disctrcits() {
    this.ds.userGetMethod('districts').subscribe((res: any) => {
      this.districts = res;
    })
  }
  get_communities() {
    this.ds.userGetMethod('fir/communities').subscribe((res: any) => {
      this.communities = res;
    })
  }
  get_caste() {
    if(this.selectedCommunity){
      this.ds.userGetMethod(`fir/castes-by-community?community=${this.selectedCommunity}`).subscribe((res: any) => {
        this.castes = res;
      })
    }
    this.get_other_details();
  }
  get_offence_nature() {
    this.ds.userGetMethod('GetOffence').subscribe((res: any) => {
      this.nature_of_offence = res.data;
    })
  }

  get_relief_status() {
    this.ds.userGetMethod('Relief_Status').subscribe((res: any) => {
      this.relief_status = res.data;
    })
  }


  get_other_details() {
    if(this.userData.access_type==="District"){
      this.filterJson.district = this.userData.district;
      this.selectedDistrict = this.userData.district;
      this.isDistrictDisabled = true;
    }
    this.crs.setFilterJson(this.filterJson);
  }
}
