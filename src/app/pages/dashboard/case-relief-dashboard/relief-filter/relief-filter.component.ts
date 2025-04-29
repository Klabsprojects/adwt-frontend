import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { caseReliefService } from '../cas-relief.service';
@Component({
  selector: 'app-relief-filter',
  templateUrl: './relief-filter.component.html',
  styleUrl: './relief-filter.component.scss'
})
export class ReliefFilterComponent implements OnInit {
  before_after: string[] = [];
  districts: any[] = [];
  communities: any[] = [];
  castes: any[] = [];
  nature_of_offence: any[] = [];
  relief_status: any[] = [];

  selectedBeforeAfter: string = '';
  selectedDistrict: string = '';
  selectedCommunity: string = '';
  selectedCaste: string = '';
  selectedNatureOfOffence: string = '';
  selectedReliefStatus: string = '';

  constructor(private ds: DashboardService, private crs: caseReliefService) { }
  ngOnInit() {
    this.callAllFunction({});
  }

  get filterJson() {
    return {
      "Two_thousand_sixteen": this.selectedBeforeAfter,
      "district": this.selectedDistrict,
      "community": this.selectedCommunity,
      "caste": this.selectedCaste,
      "offence": this.selectedNatureOfOffence,
      "relief_status": this.selectedReliefStatus
    };
  }

  clear(){
    this.selectedBeforeAfter = '';
    this.selectedDistrict = '';
    this.selectedCommunity = '';
    this.selectedCaste = '';
    this.selectedNatureOfOffence = '';
    this.selectedReliefStatus = '';
    this.get_other_details();
  }
  

  callAllFunction(body: any) {
    this.get_before_after();
    this.get_disctrcits();
    this.get_communities();
    this.get_offence_nature();
    this.get_relief_status();
    this.get_other_details();
  }

  get_before_after() {
    this.ds.userGetMethod('Get_Two_thousand_sixteen_Status').subscribe((res: any) => {
      this.before_after = res.data;
    })
  }
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
    this.ds.userGetMethod(`fir/castes-by-community?community=${this.selectedCommunity}`).subscribe((res: any) => {
      this.castes = res;
      this.get_other_details();
    })
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
    this.crs.setFilterJson(this.filterJson);
  }
}
