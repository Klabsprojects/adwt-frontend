import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalReliefService } from 'src/app/services/additional-relief.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PoliceDivisionService } from 'src/app/services/police-division.service';
import { VmcMeetingService } from 'src/app/services/vmc-meeting.service';
import { FirService } from 'src/app/services/fir.service';
import { FilterStateService } from 'src/app/services/filter-state-service';

@Component({
  selector: 'app-additional-relief-list',
  standalone: true,
  imports: [CommonModule,DragDropModule,FormsModule,MatSelectModule,MatOptionModule,MatCheckboxModule],
  templateUrl: './additional-relief-list.component.html',
  styleUrls: ['./additional-relief-list.component.scss']
})
export class AdditionalReliefListComponent implements OnInit {
  searchText: string = '';
  firList: any[] = []; // Complete FIR list
  displayedFirList: any[] = []; // Paginated FIRs
  page = 1; // Current page
  totalRecords = 0;
  totalPages = 0; // Total number of pages
  isLoading = true; // Loading indicator
  Parsed_UserInfo : any;
  

  constructor(
    private additionalreliefService: AdditionalReliefService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private policeDivisionService :PoliceDivisionService,
    private vmcMeeting: VmcMeetingService,
    private firService: FirService,
    private filterState: FilterStateService
  ) {
    const UserInfo : any = sessionStorage.getItem('user_data');
    this.Parsed_UserInfo = JSON.parse(UserInfo)
    this.vmcMeeting.getDistricts().subscribe((data) => {
    this.districts = Object.keys(data);
    this.cdr.detectChanges();
  });
  }


  // Filters
  selectedDistrict: string = '';
  selectedPoliceCity:string = '';
  selectedPoliceStation:string = '';
  selectedNatureOfOffence: string = '';
  selectedStatusOfCase: string = '';
  selectedStatusOfRelief: string = '';
  start_date:string = '';
  end_date:string = '';
  selectedType:any = '';
  selectedStatus:string = '';

  // Filter options
  districts: any;
  policeCities:any;
  policestations:any;
  pageSize = 10;

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
  reliefType = [
    { value: 'pension', label: 'Pension' },
    { value: 'employment', label: 'Employment / Job' },
    { value: 'patta', label: 'House site Patta' },
    { value: 'education', label: 'Education concession' },
    { value: 'provision', label: 'Provisions' },
    
  ];
  reliefStatus: any[] = [
    { value:'given' , label:'Given' } ,
    { value:'pending' , label:'Pending' } ,
    { value:'notApplicable' , label:'Not Applicable' } ,
   ];

  // Visible Columns Management

  displayedColumns: { label: string; field: string; sortable: boolean; visible: boolean }[] = [
    { label: 'Sl.No', field: 'sl_no', sortable: false, visible: true },
    { label: 'FIR ID', field: 'fir_id', sortable: true, visible: true },
    // { label: 'Victim ID', field: 'victim_id', sortable: true, visible: true },
    { label: 'Register Date', field: 'date_of_registration', sortable: true, visible: true },
    { label: 'Victim Name', field: 'victim_name', sortable: true, visible: true },
    { label: 'Disctrict', field: 'revenue_district', sortable: true, visible: true },
    { label: 'Police City', field: 'police_city', sortable: true, visible: true },
    { label: 'Police Station Name', field: 'police_station', sortable: true, visible: true },
    // { label: 'Data Entry Status', field: 'status', sortable: true, visible: true },
    { label: 'Status', field: 'statusGroup', sortable: false, visible: true },
    { label: 'Actions', field: 'actions', sortable: false, visible: true }
  ];

  selectedColumns: any[] = [...this.displayedColumns];

  // Sorting variables
  currentSortField: string = '';
  isAscending: boolean = true;


  ngOnInit(): void {
  this.updateSelectedColumns();
  this.loadPolicecity();

  // Restore saved filters first
  const savedFilters = this.filterState.getFilters();
  if (savedFilters) {
    this.selectedDistrict = savedFilters.revenue_district;
    this.selectedPoliceCity = savedFilters.district;
    this.selectedPoliceStation = savedFilters.policeStationName;
    this.start_date = savedFilters.start_date;
    this.end_date = savedFilters.end_date;
    this.selectedType = savedFilters.additionalReliefType;
    this.selectedStatus = savedFilters.reliefStatus;

    // ✅ Now call API with filters
    this.applyFilters();
  } else {
    // ✅ If no filters saved, call normally (all data)
    this.fetchFIRList();
  }
}


  getStatusText(status: number,HascaseMF:any): string {
    if (HascaseMF) {
    status = 9;
  }
    const statusTextMap = {
      0: 'FIR Draft',
      1: 'Pending | FIR Stage | Step 1 Completed',
      2: 'Pending | FIR Stage | Step 2 Completed',
      3: 'Pending | FIR Stage | Step 3 Completed',
      4: 'Pending | FIR Stage | Step 4 Completed',
      5: 'Completed | FIR Stage',
      6: 'Charge Sheet Completed',
      7: 'Trial Stage Completed',
      8: 'This Case is Altered Case',
      9: 'Mistake Of Fact',
    } as { [key: number]: string };

    return statusTextMap[status] || 'Unknown';
  }

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

  isaltered(status: number): string {
      if(status == 1){
        return 'Section Altered'
      } else {
         return ''
      }
  }

  alteredBadgeClass(status: number): string {
       if(status == 1){
        return 'badge bg-danger text-white'
      } else {
         return ''
      }
  }



  // Fetch FIR data from the service
  fetchFIRList(): void {
    this.isLoading = true;
    
    this.additionalreliefService.getFIRAdditionalReliefList_By_Victim(this.getFilterParams()).subscribe(
      (data) => {
        this.firList = data;
        this.totalRecords = data.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
         this.updateDisplayedList();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching FIR data:', error);
        this.isLoading = false;
      }
    );
  }

  // Update pagination data
  updatePagination(): void {
    this.totalPages = Math.ceil(this.firList.length / this.pageSize);
    this.updateDisplayedList();
  }

  // Update the list of FIRs for the current page
  updateDisplayedList(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    this.displayedFirList = this.firList.slice(startIndex, startIndex + this.pageSize);
    console.log('Displayed FIR List:', this.displayedFirList);
  }

  

  nextPage() {
  if (this.page < this.totalPages) {
    this.goToPage(this.page + 1);
  }
}

/** Show max 5 page numbers around current */
getVisiblePages(): number[] {
  const visiblePages: number[] = [];
  const start = Math.max(1, this.page - 2);
  const end = Math.min(this.totalPages, start + 4);

  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }
  return visiblePages;
}

  goToPage(pageNum: number) {
  if (pageNum >= 1 && pageNum <= this.totalPages) {
    this.page = pageNum;
    this.fetchFIRList(); // call API or update table
  }
}

previousPage() {
  if (this.page > 1) {
    this.goToPage(this.page - 1);
  }
}

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Navigate to the additional relief details page
  navigateToRelief(firId: string, victimId : string): void {
    this.router.navigate(['widgets-examples/additional-relief'], {
      queryParams: { fir_id: firId , victim_id :  victimId},
    });
  }


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

  // dropRow(event: CdkDragDrop<any[]>) {
  //   moveItemInArray(this.firList, event.previousIndex, event.currentIndex);
  // }



  // Load FIR list from the backend
  // loadFirList() {
  //   this.isLoading = true;
  //   this.firService.getFirList().subscribe(
  //     (data: any[]) => {
  //       this.firList = data;
  //       this.isLoading = false;
  //       this.cdr.detectChanges();
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       Swal.fire('Error', 'Failed to load FIR data', 'error');
  //     }
  //   );
  // }

  // Apply filters to the FIR list
  applyFilters() {
    this.filterState.setFilters({
    revenue_district: this.selectedDistrict,
    district: this.selectedPoliceCity,
    policeStationName: this.selectedPoliceStation,
    start_date: this.start_date,
    end_date: this.end_date,
    additionalReliefType: this.selectedType,
    reliefStatus: this.selectedStatus
  });
    this.page = 1;
    this.cdr.detectChanges();
    this.fetchFIRList();
  }
  
  showColumn(type: string): boolean {
  return !this.selectedType || this.selectedType === type;
}

// For dynamic colspan
getStatusColSpan(): number {
  return !this.selectedType ? 5 : 1;
}

    // Filtered FIR list based on search and filter criteria
  filteredFirList() {
    this.isLoading = true;
    this.additionalreliefService.getFIRAdditionalReliefList_By_Victim(this.getFilterParams()).subscribe(
      (data) => {
        console.log('Raw API Response:', data);
        // Filter FIRs with at least one victim with relief
        // this.firList = (data || []).filter((fir) => fir.victims_with_relief > 0);
        this.displayedFirList = data;
        console.log('Filtered FIR List:', this.firList);
        this.updatePagination();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching FIR data:', error);
        this.isLoading = false;
      }
    );
  }

  clearfilter(){
    this.searchText = '';
    this.selectedPoliceCity = '';
    this.selectedDistrict = '';
    this.selectedPoliceStation = '';
    this.start_date = '';
    this.end_date = '';
    this.selectedType = '';
    this.selectedStatus = '';
    this.applyFilters();
  }
  

getFilterParams() {
  const params: any = {};
  
  if (this.searchText) {
    params.search = this.searchText;
  }
  
  if (this.selectedPoliceCity) {
    params.district = this.selectedPoliceCity;
  }

  if (this.selectedPoliceStation) {
    params.policeStationName = this.selectedPoliceStation;
  }

  if (this.selectedDistrict) {
    params.revenue_district = this.selectedDistrict;
  }

  if (this.start_date) {
    params.start_date = this.start_date;
  }

  if(this.end_date){
    params.end_date = this.end_date;
  }

  if(this.selectedType){
    params.additionalReliefType = this.selectedType;
  }

  if(this.selectedStatus){
    params.reliefStatus = this.selectedStatus;
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
    const startIndex = (this.page - 1) * this.pageSize;
    return this.firList.slice(startIndex, startIndex + this.pageSize);
  }

  loadPoliceDivision() {
    this.policeDivisionService.getAllPoliceDivisions().subscribe(
      (data: any) => {
        this.policeCities = data.map((item: any) => item.district_division_name);
      },
      (error: any) => {
        console.error(error)
      }
    );
  }

  loadPolicecity() {
  this.policeDivisionService.getpoliceCity().subscribe(
    (data: any) => {
      this.policeCities = data.map((item: any) => item.district_division_name);
    },
    (error: any) => {
      // Swal.fire('Error', 'Failed to load division details.', 'error');
    }
  );
}

  loadPoliceStations(district: string): void {
    if (district) {
      this.firService.getPoliceStations(district).subscribe(
        (stations: string[]) => {
          this.policestations = stations.map(station =>
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

}
