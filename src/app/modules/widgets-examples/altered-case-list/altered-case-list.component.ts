import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReliefService } from 'src/app/services/relief.service';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FirService } from 'src/app/services/fir.service';
import { VmcMeetingService } from 'src/app/services/vmc-meeting.service';
import { PoliceDivisionService } from 'src/app/services/police-division.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-altered-case-list',
  templateUrl: './altered-case-list.component.html',
  styleUrls: ['./altered-case-list.component.scss'],
  standalone: true,
  imports: [CommonModule,DragDropModule,RouterModule,FormsModule,MatSelectModule,MatOptionModule,MatCheckboxModule,ReactiveFormsModule,NgSelectModule],

})
export class AlteredCaseListComponent implements OnInit {
  firList: any[] = []; // Complete FIR list
  displayedFirList: any[] = []; // FIRs to show on current page
  page = 1; // Current page
  itemsPerPage = 10; // Items per page
  totalPages = 1; // Total number of pages
  isLoading = true; // Loading indicator
  searchText: string = '';
  dorf:any;
  dort:any;
  Parsed_UserInfo : any;
  policeStationlist : any;
  view = 'list'
  victimNames: string[] = [];
  firForm: FormGroup;
  offenceOptions: any[] = [];
  offenceOptionData:any[]=[];
  firDetails : any;
  isActExcluded(act: string): boolean {
    const excluded = [
      '100 percent incapacitation',
      'Disability: Incapacitation greater than 50',
      'Disability: Incapacitation less than 50',
      'Rape',
      'Gang Rape',
      'Murder',
      '3(2)(v)',
      '3(2)(va)'
    ];
    return excluded.includes(act);
  }
  constructor(
    private reliefService: ReliefService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private firService: FirService,
    private vmcMeeting: VmcMeetingService,
    private policeDivisionService :PoliceDivisionService,
    private fb: FormBuilder,
  ) {
    const UserInfo : any = sessionStorage.getItem('user_data');
    this.Parsed_UserInfo = JSON.parse(UserInfo)
    this.vmcMeeting.getDistricts().subscribe((data) => {
    this.districts = Object.keys(data);
    this.cdr.detectChanges();
  });
  }

  ngOnInit(): void {

    this.updateSelectedColumns();
    this.fetchFIRList();
    this.loadPolicecity();
    this.loadOptions();
    this.initializeForm();
  }

  // Fetch FIR data from the service
  fetchFIRList(): void {
    this.isLoading = true;
    this.reliefService.getAlteredList(this.getFilterParams()).subscribe(
      (data) => {
        this.firList = (data || []).filter((fir) => [4 ,5, 6, 7, 11, 12,13].includes(fir.status)); // Filter data
        this.updatePagination();
        this.isLoading = false;
        this.cdr.detectChanges(); // Ensure the UI is updated immediately
      },
      (error) => {
        console.error('Error fetching FIR data:', error);
        this.isLoading = false;
      }
    );
  }

  // Update pagination data
  updatePagination(): void {
    this.totalPages = Math.ceil(this.firList.length / this.itemsPerPage);
    this.updateDisplayedList();
  }

  // Update the list of FIRs for the current page
  updateDisplayedList(): void {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    this.displayedFirList = this.firList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Pagination controls
  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updateDisplayedList();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updateDisplayedList();
    }
  }

  goToPage(pageNum: number): void {
    this.page = pageNum;
    this.updateDisplayedList();
  }

  // totalPagesArray(): number[] {
  //   return Array(this.totalPages)
  //     .fill(0)
  //     .map((_, i) => i + 1);
  // }

  // Get badge classes for the status
 // Get badge classes for the status
// getStatusBadgeClass(status: number): string {
//   const badgeClassMap = {
//     0: 'badge bg-info text-white',
//     1: 'badge bg-warning text-dark',
//     2: 'badge bg-warning text-dark',
//     3: 'badge bg-warning text-dark',
//     4: 'badge bg-warning text-dark',
//     5: 'badge bg-danger text-white', // Red for FIR Stage pending
//     6: 'badge bg-danger text-white', // Red for Chargesheet Stage pending
//     7: 'badge bg-danger text-white',
//     // 8: 'badge bg-danger text-white',
//     // 9: 'badge bg-danger text-white', // Red for Trial Stage pending
//     11: 'badge bg-primary text-white', // On completion of Disbursement of FIR Stage Relief
//     12: 'badge bg-success text-white', // Chargesheet Stage completed
//     13: 'badge bg-success text-white', // Completed
//   } as { [key: number]: string };

//   return badgeClassMap[status] || 'badge bg-secondary text-white';
// }

getStatusBadgeClass(status: number): string {
  const badgeClassMap = {
    0: 'badge bg-info text-white',
    1: 'badge bg-warning text-dark',
    2: 'badge bg-warning text-dark',
    3: 'badge bg-warning text-dark',
    4: 'badge bg-warning text-dark',
    5: 'badge bg-success text-white',
    6: 'badge bg-success text-white',
    7: 'badge bg-success text-white',
    8: 'badge bg-danger text-white',
    9: 'badge bg-danger text-white',
    10: 'badge bg-danger text-white', // Add this entry for status 12
  } as { [key: number]: string };

  return badgeClassMap[status] || 'badge bg-secondary text-white';
}

// Get status text for the status
getStatusText(status: number, reliefStatus: number, natureOfJudgement?: string): string {
  const statusTextMap = {
    0: 'Just Starting',
    1: 'Pending | FIR Stage | Step 1 Completed',
    2: 'Pending | FIR Stage | Step 2 Completed',
    3: 'Pending | FIR Stage | Step 3 Completed',
    // 4: 'Pending | FIR Stage | Step 4 Completed',
    4: 'FIR Stage pending',
    5: 'FIR Stage pending',
    6: 'Chargesheet Stage pending',
    7: 'Trial Stage pending',
    // 8: 'Altered case',
    // 9: 'Mistake of Fact',
    11: 'FIR Stage Completed',
    12: 'Chargesheet Stage completed',
    13: 'Trial Completed',
  } as { [key: number]: string };

  if (status === 5 && reliefStatus === 0) {
    return 'FIR relief Stage pending';
  }
  if (status === 5 && reliefStatus === 1) {
    return 'FIR relief Stage completed';
  }
  if (status === 6 && reliefStatus === 1) {
    return 'Chargesheet Stage pending';
  }
  if (status === 6 && reliefStatus === 2) {
    return 'Chargesheet Stage completed';
  }
  if (status === 7 && reliefStatus === 3) {
    return 'Appeal';
  }
  if ((status === 5 || status === 6) && reliefStatus === 0) {
    return 'FIR Stage pending | Chargesheet Stage Pending';
  }
  if (status === 7 && (reliefStatus === 1 || reliefStatus === 2)) {
    return 'Trial Stage pending';
  }
  if ((status === 6 || status === 7) && reliefStatus === 1) {
    return 'Chargesheet Stage Pending | Trial Stage Pending';
  }

  if (( status === 5 || status === 6 || status === 7) && reliefStatus === 0) {
    return 'FIR Stage pending | Charge sheet Stage Pending | Trial stage pending';
  }

  if (( status === 5 || status === 6 || status === 7) && reliefStatus === 3) {
    return 'Completed';
  }

  if (status === 6 && (natureOfJudgement === 'Acquitted' || natureOfJudgement === 'Convicted')) {
    return 'Acquitted';
  }

  if (status === 7 && natureOfJudgement === 'Convicted') {
    return 'Convicted';
  }

  return statusTextMap[status] || 'Unknown';
}


  navigateToRelief(firId: string): void {
    this.router.navigate(['widgets-examples/relief'], {
      queryParams: { fir_id: firId },

    });
  }





  // Filters
  selectedDistrict: string = '';
  policeStationName : string = '';
  selectedNatureOfOffence: string = '';
  selectedStatusOfCase: string = '';
  selectedStatusOfRelief: string = '';

  // Filter options
  districts: any;

  naturesOfOffence: string[] = [
    'Theft',
    'Assault',
    'Fraud',
    'Murder',
    'Kidnapping',
    'Cybercrime',
    'Robbery',
    'Arson',
    'Cheating',
    'Extortion',
    'Dowry Harassment',
    'Rape',
    'Drug Trafficking',
    'Human Trafficking',
    'Domestic Violence',
    'Burglary',
    'Counterfeiting',
    'Attempt to Murder',
    'Hate Crime',
    'Terrorism'
  ];

  statusesOfCase: string[] = ['Just Starting', 'Pending', 'Completed'];
  statusesOfRelief: string[] = ['FIR Stage', 'ChargeSheet Stage', 'Trial Stage'];

  // Visible Columns Management

  displayedColumns: { label: string; field: string; sortable: boolean; visible: boolean }[] = [
    { label: 'Sl.No', field: 'sl_no', sortable: false, visible: true },
    { label: 'FIR No.', field: 'fir_number', sortable: true, visible: true },
    { label: 'Police City', field: 'police_city', sortable: true, visible: true },
    { label: 'Police Station Name', field: 'police_station', sortable: true, visible: true },
    { label: 'Created By', field: 'created_by', sortable: true, visible: true },
    { label: 'Date Of Reporting', field : 'date_of_repost', sortable: true, visible: true},
    { label: 'Created At', field: 'created_at', sortable: true, visible: true },
    { label: 'Status', field: 'status', sortable: false, visible: true },
    { label: 'Actions', field: 'actions', sortable: false, visible: true },

  ];

  selectedColumns: any[] = [...this.displayedColumns];

  // Sorting variables
  currentSortField: string = '';
  isAscending: boolean = true;




  updateSelectedColumns() {
    this.selectedColumns = this.displayedColumns.filter((col) => col.visible);
  }
  // Toggle column visibility
  toggleColumnVisibility(column: any) {
    column.visible = !column.visible; // Toggle visibility
    this.updateSelectedColumns(); // Update selected columns
  }

  // Drag and drop for rearranging columns
  dropColumn(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    this.updateSelectedColumns(); // Update selected columns after rearranging
  }


  // Apply filters to the FIR list
  applyFilters() {
    this.page = 1; // Reset pagination to the first page
    this.filteredFirList(); // Update displayed list
    this.cdr.detectChanges(); // Ensure UI updates
  }

    loadOptions() {
      this.firService.getOffences().subscribe(
        (offences: any) => {
          // console.log(offences);
          this.offenceOptions = offences
            .filter((offence: any) => offence.offence_act_name !== '3(2)(va)' && offence.offence_act_name !== '3(2)(v) , 3(2)(va)');
            this.offenceOptions.push(
              { offence_act_name: '3(2)(va)', offence_name: '3(2)(va)', id : 24 },
            );
            this.offenceOptionData = offences.map((offence: any) => offence);
        },
        (error: any) => {
          // Swal.fire('Error', 'Failed to load offence options.', 'error');
        }
      );
    }


  // filteredFirList() {
  //   const searchLower = this.searchText.toLowerCase();
  //   console.log(searchLower)
  //   return this.firList.filter((fir) => {
  //     // Apply search filter
  //     const matchesSearch =
  //       fir.fir_id.toString().toLowerCase().includes(searchLower) ||
  //       (fir.police_city || '').toLowerCase().includes(searchLower) ||
  //       (fir.fir_number || '').toLowerCase().includes(searchLower) ||
  //       (fir.police_station || '').toLowerCase().includes(searchLower);

  //     // Apply dropdown filters
  //     const matchesDistrict = this.selectedDistrict ? fir.police_city === this.selectedDistrict : true;
  //     const matchesNatureOfOffence = this.selectedNatureOfOffence? fir.police_station === this.selectedNatureOfOffence: true;
  //     // const matchesStatusOfCase = this.selectedStatusOfCase ? fir.relief_status == this.selectedStatusOfCase : true;
  //     // const matchesStatusOfRelief = this.selectedStatusOfRelief ? fir.status == this.selectedStatusOfRelief : true;
  //     let matchesStatusOfRelief = true;
  //     if (this.selectedStatusOfRelief) {
  //       if (this.selectedStatusOfRelief === 'FIR Stage') {
  //         matchesStatusOfRelief = fir.relief_status == '1';
  //       } else if (this.selectedStatusOfRelief === 'ChargeSheet Stage') {
  //         matchesStatusOfRelief = fir.relief_status == '2';
  //       } else if (this.selectedStatusOfRelief === 'Trial Stage') {
  //         matchesStatusOfRelief = fir.relief_status == '3';
  //       }
  //     }

  //     let matchesStatusOfCase = true;
  //     if (this.selectedStatusOfCase) {
  //       if (this.selectedStatusOfCase === 'Just Starting') {
  //         matchesStatusOfCase = fir.status == '0';
  //       } else if (this.selectedStatusOfCase === 'Pending') {
  //         matchesStatusOfCase = (fir.status >= '1' && fir.status <= '12') ;
  //       } else if (this.selectedStatusOfCase === 'Completed') {
  //         matchesStatusOfCase = fir.status == '13';
  //       }
  //     }

  //     return (
  //       matchesSearch &&
  //       matchesDistrict &&
  //       matchesNatureOfOffence &&
  //       matchesStatusOfCase &&
  //       matchesStatusOfRelief
  //     );
  //   });
  // }


  getFilterParams() {
  const params: any = {};
  
  if (this.searchText) {
    params.search = this.searchText;
  }
  
  if (this.selectedDistrict) {
    params.district = this.selectedDistrict;
  }

  if (this.policeStationName) {
    params.policeStationName = this.policeStationName;
  }

  if (this.dorf) {
    params.start_date = this.dorf;
  }

  if (this.dort) {
    params.end_date = this.dort;
  }

  
  if(this.Parsed_UserInfo.role == '3'){
    params.district = this.Parsed_UserInfo.police_city
  } 
  else {
    if(this.Parsed_UserInfo.access_type == 'District'){
    params.revenue_district = this.Parsed_UserInfo.district;
    } 
  }

  
  return params;
}

   filteredFirList() {
    this.reliefService.getAlteredList(this.getFilterParams()).subscribe(
      (data) => {
        this.firList = [];
        this.firList = (data || []).filter((fir) => [4 ,5, 6, 7, 11, 12,13].includes(fir.status)); // Filter data
        this.updatePagination();
        this.isLoading = false;
        this.cdr.detectChanges(); // Ensure the UI is updated immediately
      },
      (error) => {
        console.error('Error fetching FIR data:', error);
        this.isLoading = false;
      }
    );
  }

    loadPoliceStations(district: string): void {
    if (district) {
      this.firService.getPoliceStations(district).subscribe(
        (stations: string[]) => {
          this.policeStationlist = stations.map(station =>
            station.replace(/\s+/g, '-')); // Replace spaces with "-"
          // this.firForm.get('stationName')?.setValue(''); // Reset selected station if district changes
          this.cdr.detectChanges(); // Trigger UI update
        },
        (error) => {
          console.error('Error fetching police stations:', error);
        }
      );
    }
  }

    clearfilter(){
    this.searchText = '';
    this.selectedDistrict = '';
    this.policeStationName = '';
    this.dorf = '';
    this.dort = '';
    this.applyFilters();
  }
  


      loadPolicecity() {
      this.policeDivisionService.getpoliceCity().subscribe(
        (data: any) => {
          this.districts = data.map((item: any) => item.district_division_name);
        },
        (error: any) => {
          // Swal.fire('Error', 'Failed to load division details.', 'error');
        }
      );
    }


  // Sorting logic
  sortTable(field: string) {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }

    this.firList.sort((a, b) => {
      const valA = a[field]?.toString().toLowerCase() || '';
      const valB = b[field]?.toString().toLowerCase() || '';
      return this.isAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  // Get the sort icon class
  getSortIcon(field: string): string {
    return this.currentSortField === field
      ? this.isAscending
        ? 'fa-sort-up'
        : 'fa-sort-down'
      : 'fa-sort';
  }




  // Paginated FIR list
  paginatedFirList() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.firList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  hasNextPage(): boolean {
    return this.page * this.itemsPerPage < this.firList.length;
  }


  totalPagesArray(): number[] {
    const totalPages = Math.ceil(this.firList.length / this.itemsPerPage);
    const pageNumbers = [];
  
    // Define how many pages to show before and after the current page
    const delta = 2; // Number of pages to show before and after the current page
  
    // Calculate start and end page numbers
    let startPage = Math.max(1, this.page - delta);
    let endPage = Math.min(totalPages, this.page + delta);
  
    // Adjust start and end if there are not enough pages before or after
    if (this.page <= delta) {
      endPage = Math.min(totalPages, startPage + delta * 2);
    } else if (this.page + delta >= totalPages) {
      startPage = Math.max(1, endPage - delta * 2);
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  
    return pageNumbers;
  }

  get victims(): FormArray {
  return this.firForm.get('victims') as FormArray;
}
  get victims2(): FormArray {
  return this.firForm.get('victims2') as FormArray;
}

 initializeForm() {
   this.firForm = this.fb.group({
   victims2: this.fb.array([this.createVictimGroup2()]),
   victims: this.fb.array([this.createVictimGroup()])
   });
 }

   createVictimGroup(): FormGroup {
    return this.fb.group({
      victim_id: [''],
      victimName : [''],
      offenceCommitted: ['', Validators.required],
      scstSections:  ['', Validators.required],
      sectionDetails: this.fb.array([this.createSection()]),
    });
  }

  createVictimGroup2(): FormGroup {
    return this.fb.group({
      victim_id2: [''],
     victimName2 : [''],
      offenceCommitted2: ['', Validators.required],
      scstSections2:  ['', Validators.required],
      sectionDetails2: this.fb.array([this.createSection2()]),
    });
  }

  createSection2(): FormGroup {
    return this.fb.group({
      SectionType2: [''],
      Section2: ['']
    });
  }

    createSection(): FormGroup {
    return this.fb.group({
      SectionType: [''],
      Section: ['']
    });
  }
  getSectionDetails(victimIndex: number): FormArray {
    return this.victims.at(victimIndex).get('sectionDetails') as FormArray;
  }
  getSectionDetails2(victimIndex: number): FormArray {
    return this.victims2.at(victimIndex).get('sectionDetails2') as FormArray;
  }
  addSection2(victimIndex: number): void {
    const sectionDetails2 = this.getSectionDetails2(victimIndex);
    sectionDetails2.push(this.createSection2());
  }
  addSection(victimIndex: number): void {
    const sectionDetails = this.getSectionDetails(victimIndex);
    sectionDetails.push(this.createSection());
  }
  removeSection(victimIndex: number, sectionIndex: number): void {
    const sectionDetails = this.getSectionDetails(victimIndex);
    if (sectionDetails.length > 1) {
      sectionDetails.removeAt(sectionIndex);
    }
  }


  viewpage(id : any, fir_id : any){
    // console.log(id)
    this.firDetails = [];
  if (id) {
    this.loadfirdetails(fir_id)
      this.firService.getalteredcasebasedID(id).subscribe(
        (response: string[]) => {
      
      if (response && response.length > 0) {
          this.victimNames = response.map((victim: any) => victim.victim_name);
          // Resetting the victims array in case of a previous value
          const victimsFormArray = this.firForm.get('victims') as FormArray;
          victimsFormArray.clear(); // Clear any existing victims data
          // console.log('arryresp',response.data1);
    
          response.forEach((victim: any, index: number) => {
    
            const victimGroup = this.createVictimGroup();
            let offence_committed_data: any[] = [];
            let scst_sections_data: any[] = [];
    
            if (victim.cur_offence_committed && this.isValidJSON(victim.cur_offence_committed)) {
              offence_committed_data = JSON.parse(victim.cur_offence_committed);
            }
            if (victim.cur_scst_sections && this.isValidJSON(victim.cur_scst_sections)) {
              scst_sections_data = JSON.parse(victim.cur_scst_sections);
            }
        
            victimGroup.patchValue({
              victim_id: victim.victim_id,
              victimName : victim.victim_name,
              offenceCommitted: offence_committed_data,
              scstSections: scst_sections_data,
              sectionsIPC: victim.sectionsIPC
            });
    
            victimsFormArray.push(victimGroup);
    
          });
    
          response.forEach((victim: any, index: number) => {
    
          const sectionsArray = JSON.parse(victim.cur_sectionsIPC_JSON);
    
          // Get the form array for the specific victim index (assuming index 0 for example)
          const victimIndex = index; // Adjust this based on your logic
          const sectionDetails = this.getSectionDetails(victimIndex);
    
          // Clear existing form array
          while (sectionDetails.length !== 0) {
            sectionDetails.removeAt(0);
          }
    
          // Populate form array with parsed data
          sectionsArray.forEach((section: any) => {
            sectionDetails.push(this.fb.group({
              SectionType: [section.SectionType || ''],
              Section: [section.Section || '']
            }));
          });   
            
          });
        }


          if (response && response.length > 0) {
          // Resetting the victims array in case of a previous value
          const victimsFormArray = this.firForm.get('victims2') as FormArray;
          victimsFormArray.clear(); // Clear any existing victims data
          // console.log('arryresp',response.data1);
    
          response.forEach((victim: any, index: number) => {
    
            const victimGroup = this.createVictimGroup2();
            let offence_committed_data: any[] = [];
            let scst_sections_data: any[] = [];
    
            if (victim.prev_offence_committed && this.isValidJSON(victim.prev_offence_committed)) {
              offence_committed_data = JSON.parse(victim.prev_offence_committed);
            }
            if (victim.prev_scst_sections && this.isValidJSON(victim.prev_scst_sections)) {
              scst_sections_data = JSON.parse(victim.prev_scst_sections);
            }
        
            victimGroup.patchValue({
              victim_id2: victim.victim_id,
              victimName2 : victim.victim_name,
              offenceCommitted2: offence_committed_data,
              scstSections2: scst_sections_data,
              sectionsIPC2: victim.sectionsIPC
            });
    
            victimsFormArray.push(victimGroup);
    
          });
    
          response.forEach((victim: any, index: number) => {
    
          const sectionsArray2 = JSON.parse(victim.prev_sectionsIPC_JSON);
    
          // Get the form array for the specific victim index (assuming index 0 for example)
          const victimIndex = index; // Adjust this based on your logic
          const sectionDetails2 = this.getSectionDetails2(victimIndex);
    
          // Clear existing form array
          while (sectionDetails2.length !== 0) {
            sectionDetails2.removeAt(0);
          }
    
          // Populate form array with parsed data
          sectionsArray2.forEach((section: any) => {
            sectionDetails2.push(this.fb.group({
              SectionType2: [section.SectionType || ''],
              Section2: [section.Section || '']
            }));
          });   
            
          });
        }
        },
        (error) => {
          console.error('Error fetching police stations:', error);
        }
      );
      this.view = 'view'
    }
  }


  isValidJSON(str : any) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  back(){
    this.view = 'list'
  }


   loadfirdetails(firId : any){
       this.firService.getFirDetails(firId).subscribe(
      (response) => {
        this.firDetails = response;
      },
      (error) => {
        console.log(error)
      }
    )};


  getVictimIndices(): number[] {
  const victimsLength = this.victims.length;
  const victims2Length = this.victims2.length;
  const maxLength = Math.max(victimsLength, victims2Length);
  
  return Array.from({ length: maxLength }, (_, index) => index);
}

}
