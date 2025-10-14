import { Component, inject, OnInit, signal, TemplateRef, WritableSignal } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsCommonService } from 'src/app/services/reports-common.service';
import { AdditionalReportService } from 'src/app/services/additional-report.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AdditionalAbstractReportService } from 'src/app/services/additional-abstract-service.module';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var bootstrap: any;

@Component({
  selector: 'app-additional-relief-report',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    DragDropModule,
    MatProgressSpinnerModule
  ],
  providers: [FirListTestService],
  templateUrl: './additional-relief-report.component.html',
  styleUrl: './additional-relief-report.component.scss',
})
export class AdditionalReliefReportComponent implements OnInit {
  // Variable Declarations
  private modalService = inject(NgbModal);
  closeResult: WritableSignal<string> = signal('');
  search: string = '';
  reportData: Array<any> = [];
  filteredData: Array<any> = [];
  page: number = 1;
  selectedtypeOfAdditionalReleif: string = '';
  itemsPerPage: number = 10;
  isReliefLoading: boolean = true;
  loading: boolean = false;
  Parsed_UserInfo:any;
  // Filters
  selectedDistrict: string = '';
  selectedColumns: string[] = [];
  selectedNatureOfOffence: string = '';
  selectedStatusOfCase: string = '';
  selectedStatusOfRelief: string = '';
  // selectedtypeOfAdditionalReleif: string = '';
  // Filter options
   loader: boolean = false;
  districts: string[] = [];
  naturesOfOffence: string[] = [];
  statusesOfCase: string[] = ['Just Starting', 'Pending', 'Completed'];
  statusesOfRelief: string[] = [
    'FIR Stage',
    'ChargeSheet Stage',
    'Trial Stage',
  ];
  typeOfAdditionalReleif: string[] = [
    'Employment',
    'Pension',
    'House Site patta',
    'Education Concession',
  ];
 displayedColumns: DisplayedColumn[] = [
  // ✅ Ungrouped columns
  {
    label: 'Sl. No.',
    field: 'sl_no',
    group: null,
    sortable: false,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'As Per Act (Before 2016 / After 2016)',
    field: 'asperact',
    group: null,
    sortable: false,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Revenue District',
    field: 'revenue_district',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Police Division',
    field: 'police_city',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Police Station',
    field: 'police_station',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'FIR No.',
    field: 'fir_number',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'FIR Date',
    field: 'FIR_date',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Victim Name',
    field: 'victimName',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Gender',
    field: 'gender',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Community',
    field: 'community',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Caste',
    field: 'caste',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
// ✅ Group: FIR
  {
    label: 'Status ',
    field: 'EmpStatus',
    group: 'Employment',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Job given date',
    field: 'JobGivendate',
    group: 'Employment',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Relationship of beneficiary to the victim',
    field: 'Employmentrelationship',
    group: 'Employment',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Name of the Department',
    field: 'department_name',
    group: 'Employment',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
   {
    label: 'Designation',
    field: 'designation',
    group: 'Employment',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  
  // ✅ Group: Pension  
  {
    label: 'Pension Status',
    field: 'PensionStatus',
    group: 'Pension',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Pension given date',
    field: 'PensionGivendate',
    group: 'Pension',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Relationship of beneficiary to the victim',
    field: 'Pensionrelationship',
    group: 'Pension',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  
  // ✅ Group: House Site Patta
  {
    label: 'Patta Status ',
    field: 'PattaStatus',
    group: 'House Site Patta',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Patta given date ',
    field: 'PattaGivendate',
    group: 'House Site Patta',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Education Concession Status',
    field: 'EducationStatus',
    group: 'Education Concession',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Number of Children studying in School/ College',
    field: 'Schoolorcollege',
    group: 'Education Concession',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  {
    label: 'Scholarship given date  ',
    field: 'EducationGivendate',
    group: 'Education Concession',
    sortable: true,
    visible: true,
    sortDirection: null,
  },
];

  currentSortField: string = '';
  isAscending: boolean = true;
  selectedRecord: any = null;
  reasonData = { employment: '', pension: '', patta: '', education: '' };
  modalInstance: any;

  communities:any[]=[];
  castes:any[]=[];
  zones:any[]=[];
  policeCities:any[]=[];
   status: any[]=[
    { key: 'UI', value: 'UI Stage' },
    { key: 'PT', value: 'PT Stage' },
  ]

  selectedStatus:string='';
  selectedDistricts:string='';
  selectedCommunity:string='';
  selectedCaste:string='';
  selectedZone:string='';
  selectedPoliceCity:string=''
  selectedFromDate:any="";
  selectedToDate:any="";

  constructor(
    // private firService: FirListTestService,
    private cdr: ChangeDetectorRef,
    private reportsCommonService: ReportsCommonService,
    private additionalReportService: AdditionalAbstractReportService,
    private router: Router,
    private dashboardService: DashboardService
  ) {
    this.loader = true;
  }

  groupedBySection: { [group: string]: DisplayedColumn[] } = {};
  groupOrder = ['Employment', 'Pension', 'House Site Patta','Education Concession'];

  // Initializes component data and fetches necessary information on component load.
  ngOnInit(): void {
    const UserInfo: any = sessionStorage.getItem('user_data');
    this.Parsed_UserInfo = JSON.parse(UserInfo);
    this.groupedBySection = this.groupOrder.reduce((acc, groupName) => {
    const cols = this.displayedColumns.filter(
      col => col.group === groupName && col.visible
    );
  if (cols.length > 0) {
    acc[groupName] = cols;
  }
  return acc;
}, {} as { [group: string]: DisplayedColumn[] });
    this.reportsCommonService
      .getAllData()
      .subscribe(({ districts, offences }) => {
        this.districts = districts;
        this.naturesOfOffence = offences;
        this.fetchAdditionalReports();
        this.getDropdowns();
      });
    this.filteredData = [...this.reportData];
    this.selectedColumns = this.displayedColumns.map((column) => column.field);
  }

      getDropdowns() {
    // this.dashboardService.userGetMethod('districts').subscribe((res:any)=>{
    //   this.districts = res;
    // })
    this.dashboardService.userGetMethod('fir/communities').subscribe((res:any)=>{
      this.communities = res;
    })
    this.dashboardService.userGetMethod('Zone_Filter_Data').subscribe((res:any)=>{
      this.zones = res.data;
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
  }
  
  // Updates the displayed columns based on the selected type of additional relief.
  
  // Updates the visibility of columns based on user-selected columns.
  updateColumnVisibility(): void {
    this.displayedColumns.forEach((column) => {
      column.visible = this.selectedColumns.includes(column.field);
    });
  }

  // Handles changes in column selection and updates column visibility.
  onColumnSelectionChange(): void {
    this.updateColumnVisibility();
  }



  // Applies filters, assigns serial numbers, and resets pagination
  // applyFilters(): void {
  //   this.filteredData = this.reportsCommonService.applyFilters(
  //     this.reportData,
  //     this.search,
  //     this.selectedDistrict,
  //     this.selectedNatureOfOffence,
  //     this.selectedStatusOfCase,
  //     this.selectedStatusOfRelief,
  //     'revenue_district',
  //     'nature_of_offence',
  //     'status'
  //   );
  //   this.filteredData = this.filteredData.map((report, index) => ({
  //     ...report,
  //     sl_no: index + 1,
  //   })); // Assign sl_no starting from 1
  //   this.page = 1; // Reset to the first page
  // }

  // Sorting logic
  sortTable(field: string) {
    const result = this.reportsCommonService.sortTable(
      this.filteredData,
      field,
      this.currentSortField,
      this.isAscending
    );
    this.filteredData = result.sortedData;
    this.currentSortField = result.newSortField;
    this.isAscending = result.newIsAscending;
  }

  // Get the sort icon class
  getSortIcon(field: string): string {
    return this.reportsCommonService.getSortIcon(
      field,
      this.currentSortField,
      this.isAscending
    );
  }

  // Pagination controls
  goToPage(page: number): void {
    this.page = page;
  }

  // Decreases the current page number if it is greater than 1.
  previousPage(): void {
    if (this.page > 1) this.page--;
  }

  // Increases the current page number if it is less than the total number of pages.
  nextPage(): void {
    if (this.page < this.totalPages()) this.page++;
  }

  // Calculates the total number of pages based on filtered data and items per page.
  totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  // Generates an array of page numbers to display for pagination.
  totalPagesArray(): number[] {
    const total = this.totalPages();
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.page - 2); // Ensure at least 5 pages are shown
    // Adjust if near the end
    if (startPage + maxPagesToShow - 1 > total) {
      startPage = Math.max(1, total - maxPagesToShow + 1);
    }
    return Array.from({ length: Math.min(maxPagesToShow, total) }, (_, i) => startPage + i);
  } 

  // Returns the subset of filtered data for the current page.
  paginatedData(): any[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    // console.log(this.filteredData.slice(startIndex, startIndex + this.itemsPerPage));
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Download Reports
  async onBtnExport(): Promise<void> {
    await this.reportsCommonService.exportToExcel(
      this.filteredData,
      this.displayedColumns,
      'Additional-Relief-Reports'
    );
  }

  clearfilter(){
  this.search = '';
  this.selectedDistrict = '';
  this.selectedStatus='';
  this.selectedDistricts='';
  this.selectedCommunity='';
  this.selectedCaste='';
  this.selectedZone=''; 
  this.selectedPoliceCity='';
  this.selectedFromDate='';
  this.selectedToDate = '';
  // this.filteredData = [...this.reportData]; 
  this.fetchAdditionalReports();
  }
     getStatusTextUIPT(status: number): string {
    console.log(status,'statussssssss')
    const statusTextMap = {
      0: 'UI',
      1: 'UI',
      2: 'UI',
      3: 'UI',
      4: 'UI',
      5: 'UI',
      6: 'PT',
      7: 'PT',
      8: 'PT',
      9: 'PT',
    } as { [key: number]: string };

    return statusTextMap[status] || '';
  }

 

getFilterParams() {
  const params: any = {};

  const addParam = (key: string, value: any) => {
    params[key] = value ?? '';
  };
  addParam('search', this.search || '');
  addParam('district', this.selectedDistrict || '');
  addParam('community', this.selectedCommunity || '');
  addParam('caste', this.selectedCaste || '');
  addParam('police_city', this.selectedPoliceCity || '');
  addParam('police_zone', this.selectedZone || '');
  addParam('Filter_From_Date', this.selectedFromDate || '');
  addParam('Filter_To_Date', this.selectedToDate || '');
  addParam('Status_Of_Case', this.selectedStatus || '');

  return params;
}


 applyFilters() {
  // If user is district-level, lock district param
  if (
    (this.Parsed_UserInfo.access_type === 'District' && this.Parsed_UserInfo.role === 4) ||
    this.Parsed_UserInfo.role === 3
  ) {
    this.selectedDistrict = this.Parsed_UserInfo.district?.district || this.Parsed_UserInfo.district;
  }

  const payload = this.getFilterParams(); // 👈 build payload from current filters
  // console.log('Payload sent to API:', payload);

  this.loader = true;

  this.additionalReportService.getAdditionalRelief(payload).subscribe({
    next: (response) => {
      this.reportData = response.data.map((item: any, index: number) => ({
        sl_no: index + 1,
        asperact: item.asperact,
        revenue_district: item.revenue_district,
        police_city: item.police_city,
        police_station: item.police_station,
        fir_number: item.fir_number === 'NULL' || !item.fir_number ? '' : item.fir_number,
        FIR_date: formatDate(item.FIR_date, 'yyyy-MM-dd', 'en'),
        victimName: item.victimName === 'NULL' ? '' : item.victimName,
        gender: item.gender === 'NULL' ? '' : item.gender,
        community: item.community === 'NULL' ? '' : item.community,
        caste: item.caste === 'NULL' ? '' : item.caste,
        fir_id:item.fir_id,
        created_by:item.created_by,
        reason_for_status:item.reason_for_status,

        EmpStatus: item.EmpStatus,
        JobGivendate: item.JobGivendate,
        Employmentrelationship: item.Employmentrelationship,
        department_name: item.department_name,
        designation: item.designation,

        PensionStatus: item.PensionStatus,
        PensionGivendate: item.PensionGivendate
          ? formatDate(item.PensionGivendate, 'yyyy-MM-dd', 'en')
          : '',
        Pensionrelationship: Array.isArray(item.Pensionrelationship)
          ? item.Pensionrelationship.length === 1
            ? item.Pensionrelationship[0]
            : item.Pensionrelationship.join(', ')
          : item.Pensionrelationship,

        PattaStatus: item.PattaStatus,
        PattaGivendate: item.PattaGivendate
          ? formatDate(item.PattaGivendate, 'yyyy-MM-dd', 'en')
          : '',

        EducationStatus: item.EducationStatus,
        Schoolorcollege: item.Schoolorcollege,
        EducationGivendate: item.EducationGivendate
          ? formatDate(item.EducationGivendate, 'yyyy-MM-dd', 'en')
          : '',
      }));

      this.filteredData = [...this.reportData];
      console.log("Filter Data",this.filteredData);
      this.loader = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      this.loader = false;
      console.error('Error fetching reports:', error);
    },
  });
}

 fetchAdditionalReports(): void {
  let districtParam = '';
     if ((this.Parsed_UserInfo.access_type === 'District' && this.Parsed_UserInfo.role === 4)||(this.Parsed_UserInfo.role === 3)) {
    districtParam = this.Parsed_UserInfo.district;
    this.selectedDistrict = districtParam;
  }

    this.loader = true;
    this.additionalReportService.getAdditionalRelief(districtParam).subscribe({
      next: (response) => {
        this.reportData = response.data.map((item:any,index: number) => ({
          sl_no: index + 1,
          asperact: item.asperact,
          revenue_district: item.revenue_district,
          police_city: item.police_city,
          police_station:item.police_station,
          fir_number: item.fir_number === "NULL" || !item.fir_number ? '' : item.fir_number,
          FIR_date:formatDate(item.FIR_date, 'yyyy-MM-dd', 'en'),
          victimName: item.victimName === "NULL" ? '' : item.victimName,
          gender: item.gender === "NULL" ? '' : item.gender,
          community: item.community === "NULL" ? '' : item.community,
          caste: item.caste === "NULL" ? '' : item.caste,
          fir_id:item.fir_id,
          created_by:item.created_by,
          reason_for_status:item.reason_for_status,
         
          EmpStatus:item.EmpStatus,
          JobGivendate:item.JobGivendate,
          Employmentrelationship:item.Employmentrelationship,
          department_name:item.department_name,
          designation:item.designation,

          PensionStatus:item.PensionStatus,
          PensionGivendate:item.PensionGivendate ? formatDate(item.PensionGivendate,'yyyy-MM-dd', 'en') : '',
         Pensionrelationship: Array.isArray(item.Pensionrelationship)
  ? item.Pensionrelationship.length === 1
      ? item.Pensionrelationship[0]   // single value → just string
      : item.Pensionrelationship.join(', ')  // multiple → comma separated
  : item.Pensionrelationship,



          PattaStatus:item.PattaStatus,
          PattaGivendate:item.PattaGivendate ? formatDate(item.PattaGivendate,'yyyy-MM-dd','en') : '',

          EducationStatus:item.EducationStatus,
          Schoolorcollege:item.Schoolorcollege,
          EducationGivendate:item.EducationGivendate ? formatDate(item.EducationGivendate,'yyyy-MM-dd','en') : '',
}));
        // Update filteredData to reflect the API data
        this.filteredData = [...this.reportData]; 
        console.log("filter",this.filteredData);
        this.loader = false;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (error) => {
        this.loader = false;
        console.error('Error fetching reports:', error);
      }
    });
  }

 get ungroupedColumns(): DisplayedColumn[] {
  return this.displayedColumns.filter(col => col.group === null && col.visible);
}

open(content: TemplateRef<any>, record?: any) {
  this.selectedRecord = record;
  this.reasonData = {employment:'', pension: '', patta: '', education: '' }; // reset data
  this.modalService.open(content, {
    size: 'lg',
    centered: true,
    backdrop: 'static',
  });
}

private getDismissReason(reason: any): string {
  switch (reason) {
    case ModalDismissReasons.ESC:
      return 'by pressing ESC';
    case ModalDismissReasons.BACKDROP_CLICK:
      return 'by clicking on a backdrop';
    default:
      return `with: ${reason}`;
  }
}
closeTab() {
  const modalElement = document.getElementById('reasonModal'); 
  if (modalElement) {
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance?.hide();
  }
}

openReasonModal(record: any) {
  this.selectedRecord = record;

  // Reset all fields first
  this.reasonData = { employment: '', pension: '', patta: '', education: '' };

  // ✅ Parse the reason_for_status if it exists and is not empty
  try {
    if (record.reason_for_status) {
      // Convert JSON string to array (if it’s stored as string)
      const parsedReasons = typeof record.reason_for_status === 'string'
        ? JSON.parse(record.reason_for_status)
        : record.reason_for_status;

      // ✅ Loop through and map to textarea fields
      parsedReasons.forEach((item: any) => {
        switch (item.sub_category) {
          case 'job':
            this.reasonData.employment = item.report_reason || '';
            break;
          case 'pension':
            this.reasonData.pension = item.report_reason || '';
            break;
          case 'patta':
            this.reasonData.patta = item.report_reason || '';
            break;
          case 'education':
            this.reasonData.education = item.report_reason || '';
            break;
        }
      });
    }
  } catch (err) {
    console.error('Error parsing reason_for_status:', err);
  }

  // ✅ Open Bootstrap modal
  const modalEl = document.getElementById('reasonModal');
  this.modalInstance = new bootstrap.Modal(modalEl);
  this.modalInstance.show();

  console.log('🟢 Loaded reasons:', this.reasonData);
}


saveReason(): void {
  if (!this.selectedRecord) return;

  // Build sub-category reasons array
  const reason_for_status: any[] = [];

  if (this.reasonData.employment) {
    reason_for_status.push({ sub_category: 'job', report_reason: this.reasonData.employment });
  }
  if (this.reasonData.pension) {
    reason_for_status.push({ sub_category: 'pension', report_reason: this.reasonData.pension });
  }
  if (this.reasonData.patta) {
    reason_for_status.push({ sub_category: 'patta', report_reason: this.reasonData.patta });
  }
  if (this.reasonData.education) {
    reason_for_status.push({ sub_category: 'education', report_reason: this.reasonData.education });
  }

  const payload = {
    reason_for_status,
    fir_id: this.selectedRecord.fir_id,
    category: 'Additional Relief',
    created_by: Number(this.selectedRecord.created_by)
  };

  console.log('Payload:', payload);

  this.additionalReportService.updateAdditionalReliefReason(payload).subscribe({
    next: (response) => {
      console.log('API Response:', response);
      Swal.fire('Updated Successfully!', 'Reason details updated successfully.', 'success');

      // ✅ Update same row in filtered data list
      const updatedRow = this.filteredData.find(
        (item: any) => item.fir_id === this.selectedRecord.fir_id
      );
      if (updatedRow) {
        updatedRow.reason_for_status = JSON.stringify(reason_for_status); // refresh locally
      }

      // ✅ Close modal
      this.modalInstance.hide();

      // ✅ Detect UI changes
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error updating reason:', error);
      Swal.fire('Error', 'Failed to update reason. Please try again.', 'error');
    }
  });
}

}

interface DisplayedColumn {
  label: string;
  field: string;
  group: any;
  sortable: boolean;
  visible: boolean;
  sortDirection: 'asc' | 'desc' | null;
}