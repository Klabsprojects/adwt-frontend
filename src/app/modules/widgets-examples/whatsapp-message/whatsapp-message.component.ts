import { ChangeDetectorRef, Component, inject, signal, TemplateRef, WritableSignal } from '@angular/core';
import { WhatsappTriggerService } from '../../../app/services/whatsapp.service';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ReportsCommonService } from 'src/app/services/reports-common.service';
import bootstrap from 'bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-whatsapp-message',
  templateUrl: './whatsapp-message.component.html',
  styleUrl: './whatsapp-message.component.scss'
})
export class WhatsappMessageComponent {
 // Variable Declarations
    private modalService = inject(NgbModal);
    closeResult: WritableSignal<string> = signal('');
    searchText: string = '';
    selectAll: boolean = false;
    selectedTemplate: string = '';
    currentReport: any = null;
    reportData: Array<any> = [];
    filteredData:any;
    page: number = 1;
    itemsPerPage: number = 38;
    isReliefLoading: boolean = true;
    loading: boolean = false;
    // Filters
    selectedDistrict: string = '';
    selectedUserType:string='';
    selectedColumns: string[] = [];
    selectedNatureOfOffence: string = '';
    selectedStatusOfCase: string = '';
    selectedStatusOfRelief: string = '';
    districts: string[] = [];
    naturesOfOffence: string[] = [];
    statusesOfCase: string[] = ['Just Starting', 'Pending', 'Completed'];
     loader: boolean = false;
     pageSize: number = 10;
     totalRecords: number = 0; 
     currentPage: number = 1;
     selectedYear: string = '';
     selectedMeetingQuarter: string = '';
     year = ['2025','2024','2023','2022','2021','2020'];
       meeting_quater_list = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
       meeting_type_list = ['DLVMC','SDLVMC']
selectedPreviewIndex: number = 0; // Track which district preview is active
allPreviewMessages: any[] = []; // Store all district previews
    statusesOfRelief: string[] = [
      'FIR Stage',
      'ChargeSheet Stage',
      'Trial Stage',
    ];
    communities:any[]=[];
    castes:any[]=[];
    zones:any[]=[];
    policeCities:any[]=[];
     status: any[]=[
      { key: 'UI', value: 'UI Stage' },
      { key: 'PT', value: 'PT Stage' },
    ]
  
    selectedStatus:string='';
    selectedCommunity:string='';
    selectedCaste:string='';
    selectedZone:string='';
    selectedPoliceCity:string=''
    selectedFromDate:any="";
    selectedToDate:any="";
    selectedCount: number = 0;
    isTemplateEnabled = false;
    templatePreview: string = '';
    selectedDistricts: string[] = [];


  
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
      label: 'District',
      field: 'district_name',
      group: null,
      sortable: true,
      visible: true,
      sortDirection: null,
    },
    {
      label: 'CUG',
      field: 'phone_number',
      group: null,
      sortable: true,
      visible: true,
      sortDirection: null,
    },
  {
    label: 'User Type',
    field: 'user_type',
    group: null,
    sortable: true,
    visible: true,
    sortDirection: null,
  },
  // {
  //   label: 'Status',
  //   field: 'status',
  //   group: null,
  //   sortable: true,
  //   visible: true,
  //   sortDirection: null,
  // },
   
  ];
  
 
    selectedCaseStatus: string = '';
    selectedReliefStatus: string = '';
    currentSortField: string = '';
    isAscending: boolean = true;
    Parsed_UserInfo:any;
    filter_meeting_type = '';
  
    constructor(
      private cdr: ChangeDetectorRef,
      private WhatsappService: WhatsappTriggerService,
      private router: Router,
      private reportsCommonService: ReportsCommonService,
      private dashboardService: DashboardService
    ) {
      this.loader = true;
    }
  
    groupedBySection: { [group: string]: DisplayedColumn[] } = {};
    groupOrder = [];
  
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
          this.fetchUserList(1, this.pageSize);
        });
        this.getDropdowns();
      // this.filteredData = [...this.reportData];
      this.selectedColumns = this.displayedColumns.map((column) => column.field);
    }
  
    // Updates the visibility of columns based on user-selected columns.
    updateColumnVisibility(): void {
      this.displayedColumns.forEach((column) => {
        column.visible = this.selectedColumns.includes(column.field);
      });
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

     meeting_Quarter_Change(){
      if(this.filter_meeting_type == 'SLVMC'){
        this.meeting_quater_list = ['1st Meeting', '2nd Meeting'];
      } else {
        this.meeting_quater_list = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
      }
    }
  
    // Handles changes in column selection and updates column visibility.
    onColumnSelectionChange(): void {
      this.updateColumnVisibility();
    }
  
    // Load all monetaty relief reports details into UI
  
  
   
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
      return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
    }
  
    

  
      clearfilter(){
        this.selectedDistrict = '';
         this.filteredData.forEach((item: any) => (item.selected = false));
          this.selectedCount = 0;
          this.selectAll = false;
        this.fetchUserList();
    }
  
      resetModalForm(): void {
  this.selectedTemplate = '';
    this.templatePreview = '';

}


getFilterParams() {
  const params: any = {};

  const addParam = (key: string, value: any) => {
    params[key] = value ?? '';
  };
  addParam('district', this.selectedDistrict || '');
  return params;
}

  applyFilters() {
   let districtParam = '';
         if ((this.Parsed_UserInfo.access_type === 'District' && this.Parsed_UserInfo.role === 4)||(this.Parsed_UserInfo.role === 3)) {
        districtParam = this.Parsed_UserInfo.district;
        this.selectedDistrict = districtParam;
      }
      this.loader = true;
      const payload = this.getFilterParams();
      console.log('Payload sent to API:', payload);
      this.fetchUserList(1, this.pageSize);
  }
  
  
  
   fetchUserList(page: number = 1, pageSize: number = this.pageSize): void {
    let districtParam = '';
    if (
      (this.Parsed_UserInfo.access_type === 'District' && this.Parsed_UserInfo.role === 4) ||
      this.Parsed_UserInfo.role === 3
    ) {
      districtParam = this.Parsed_UserInfo.district;
      this.selectedDistrict = districtParam;
    }

    this.loader = true;
    this.currentPage = page;
    this.pageSize = pageSize;

    this.WhatsappService.getUserList(this.getFilterParams()).subscribe({
      next: (response: any) => {
        // ✅ Map data and assign serial numbers
        this.reportData = (response.data || []).map((item: any, i: number) => ({
          sl_no: (page - 1) * pageSize + (i + 1),
          district_name: item.district_name || item.district || '-',
          phone_number: item.phone_number || item.cug || '-',
          user_type: item.user_type == 1
      ? 'Collector'
      : item.user_type == 2
      ? "DADWO"
      : item.user_type || '-',
          status: item.status || '',
          selected: false,
          userId:item.user_id
        }));

        this.filteredData = [...this.reportData]; // ✅ Important: bind to template

        // console.log('Fetched Data:', this.filteredData);

        this.loader = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loader = false;
        console.error('Error fetching reports:', error);
      },
    });
  }

  toggleAllSelections(): void {
  this.filteredData.forEach((report: any) => (report.selected = this.selectAll));

  if (this.selectAll) {
    this.selectedCount = this.filteredData.length;
  } else {
    this.selectedCount = 0;
  }
  this.updateSelectedDistricts();
}
checkIfAllSelected(): void {
  // const allSelected = this.paginatedData().every((r) => r.selected);
  // this.selectAll = allSelected;
    this.selectedCount = this.filteredData.filter((item: any) => item.selected).length;
      this.selectAll = this.filteredData.every((item: any) => item.selected);
      this.updateSelectedDistricts();

}
  

    onSend(report: any): void {
  console.log('Sending report:', report);
}

onEdit(report: any): void {
  console.log('Editing report:', report);
}
  
    get ungroupedColumns(): DisplayedColumn[] {
    return this.displayedColumns.filter(col => col.group === null && col.visible);
  }
  
  get preGroupedColumns(): DisplayedColumn[] {
    return this.displayedColumns.filter(
      col => col.group === null && col.visible && !this.isPostGroupColumn(col)
    );
  }
  
  get postGroupedColumns(): DisplayedColumn[] {
    return this.displayedColumns.filter(
      col => col.group === null && col.visible && this.isPostGroupColumn(col)
    );
  }
  
  // Helper function to detect ungrouped columns that come after the grouped sections
  isPostGroupColumn(col: DisplayedColumn): boolean {
    const finalStageIndex = this.displayedColumns.findIndex(c =>
      c.group === 'Final Stage Relief (3rd Stage)' &&
      c.label === '3rd Stage Disbursement Date'
    );
  
    const colIndex = this.displayedColumns.indexOf(col);
    return colIndex > finalStageIndex;
  }
  
  getTotals() {
  const totals: any = {};
  
  this.displayedColumns.forEach(col => {
    if (col.visible) { // only numeric columns
      totals[col.field] = this.paginatedData().reduce((sum, row) => sum + (Number(row[col.field]) || 0), 0);
    }
  });

  return totals;
}
open(content: TemplateRef<any>) {
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    (result) => {
      this.closeResult.set(`Closed with: ${result}`);
    },
    (reason) => {
      this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
    },
  );
}
openChooseTemplate(content: TemplateRef<any>) {
  const anySelected = this.filteredData.some((report) => report.selected);

  if (!anySelected) {
    alert('Please select at least one user before choosing a template.');
    return;
  }

  // ✅ If at least one is selected, open modal
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    (result) => {
      this.closeResult.set(`Closed with: ${result}`);
    },
    (reason) => {
      this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
    }
  );
}

sendTemplateMessage(modal: any) {
  if (!this.selectedTemplate) {
    alert('Please select a template before sending.');
    return;
  }

  const selectedUsers = this.filteredData.filter((item: any) => item.selected);
  if (selectedUsers.length === 0) {
    alert('Please select at least one user.');
    return;
  }

  const userIds = selectedUsers.map((u: any) => u.userId).join(',');

  let apiCall;
  switch (this.selectedTemplate) {
    case 'UI & PT Cases':
      apiCall = this.WhatsappService.sendUIPTCase(userIds);
      break;
    case 'Relief':
      apiCall = this.WhatsappService.sendReliefCase(userIds);
      break;
    case 'Additional Relief':
      apiCall = this.WhatsappService.sendAdditionalRelief(userIds);
      break;
    case 'DLVMC and SDLVMC':
      apiCall = this.WhatsappService.sendMeetingCase(userIds);
      break;
    default:
      alert('Invalid template type.');
      return;
  }

  this.loader = true;
  apiCall.subscribe({
    next: (response) => {
      console.log('✅ Message sent successfully:', response);
      alert(`Message sent successfully`);
      this.loader = false;
      modal.close();
    },
    error: (error) => {
      console.error('❌ Error sending message:', error);
      alert(`Failed to send message for user IDs: ${userIds}`);
      this.loader = false;
    },
  });
}

startEdit(report: any): void {
  report.oldPhone = report.phone_number;
  report.editing = true;
}

cancelEdit(report: any): void {
  report.phone_number = report.oldPhone;
  report.editing = false;
}

saveEdit(report: any): void {
  const phone = report.phone_number?.trim();

  if (!/^[6-9]\d{9}$/.test(phone)) {
    alert('Please enter a valid 10-digit mobile number starting with 6-9.');
    return;
  }
}



// updateTemplatePreview(): void {
//   switch (this.selectedTemplate) {
//     case 'UI & PT Cases':
//       this.templatePreview = `
// Dear District Collector, _________________,
// Greetings from the Commissionerate of Adi Dravidar Welfare.

// As part of the monthly monitoring of cases under the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, we are sharing the status of Under Investigation (UI) and Pending Trial (PT) cases for your district as of 31/07/2025, as recorded in the portal.
// You are kindly requested to review the details below and take necessary steps to ensure timely progress and update the same on the portal.

// Under Investigation (UI) Cases:
// Total Number of UI Cases: 47
// Less than 60 Days: 12
// More than 60 Days:
// 2025 (Jan–Mar):6
// 2024: 10
// 2023: 12
// 2022: 7

// Pending Trial (PT) Cases:
// Total Number of PT Cases: 36
// Less than 1 year: 9
// 1–5 years: 14
// 6–10 years: 8
// 11–15 years: 4
// 16–20 years: 11
// Over 20 years: 0

// You are requested to:
// • Prioritise and expedite under investigation and under trial cases.
// • Ensure all pending cases, especially those over 60 days in case of under investigation and pending over 5 years in case of under trial cases, are reviewed for appropriate follow-up.

// Regards,
// _____________.`;
//       break;

//     case 'Relief':
//       this.templatePreview = `
// Dear District Collector, _________________,
// Greetings from the Commissionerate of Adi Dravidar Welfare.

// As part of the monthly monitoring of cases under the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, we ensure the timely disbursement of both Monetary Relief Fund. 
// We are sharing herewith the status of Relief cases for your district, as of 31/07/2025, as recorded in the portal.

// Monetary Relief Cases:
// • Total Cases:
// • Total MF Cases:
// • Total Atrocity Cases:
// • FIR Proposal not yet received.
// ...
// Regards,
// _____________.`;
//       break;

//     case 'Additional Relief':
//       this.templatePreview = `
// Dear District Collector, _________________,
// Greetings from the Commissionerate of Adi Dravidar Welfare.

// As part of the monthly monitoring of cases under the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, we ensure the timely disbursement of Additional Relief for both Before 14/04/2016 and After 14/04/2016 cases.
// ...
// Regards,
// _____________.`;
//       break;

//     case 'DLVMC and SDLVMC':
//       this.templatePreview = `
// Dear District Collector, _________________,
// Greetings from the Commissionerate of Adi Dravidar Welfare.

// A kind reminder to conduct the District Level Vigilance and Monitoring Committee (DLVMC) and Sub-Divisional Level Vigilance and Monitoring Committee (Sub-DLVMC) meetings for the __________ quarter.
// ...
// Regards,
// _____________.`;
//       break;

//     default:
//       this.templatePreview = '';
//   }
// }



updateTemplatePreview(): void {
  if (!this.selectedTemplate) {
    this.templatePreview = '';
    this.allPreviewMessages = [];
    return;
  }

  const selectedUsers = this.filteredData.filter((item: any) => item.selected);
  if (selectedUsers.length === 0) {
    this.templatePreview = 'Please select at least one user to load preview.';
    return;
  }

  const userIds = selectedUsers.map((u: any) => u.userId).join(',');
  this.templatePreview = '⏳ Loading preview...';
  this.allPreviewMessages = [];
  this.selectedPreviewIndex = 0;

  let apiCall;
  switch (this.selectedTemplate) {
    case 'UI & PT Cases':
      apiCall = this.WhatsappService.sendUIPTCase(userIds, true);
      break;
    case 'Relief':
      apiCall = this.WhatsappService.sendReliefCase(userIds, true);
      break;
    case 'Additional Relief':
      apiCall = this.WhatsappService.sendAdditionalRelief(userIds, true);
      break;
    case 'DLVMC and SDLVMC':
      apiCall = this.WhatsappService.sendMeetingCase(userIds, true);
      break;
    default:
      this.templatePreview = 'Invalid template type.';
      return;
  }

  apiCall.subscribe({
    next: (res: any) => {
      console.log('🟢 Preview Response:', res);

      if (res?.previewResults?.preview?.length > 0) {
        this.allPreviewMessages = res.previewResults.preview;

        // show first district’s message by default
        this.templatePreview = this.allPreviewMessages[0].previewMessage;
      } else {
        this.templatePreview = '⚠️ No preview data available.';
      }
    },
    error: (err) => {
      console.error('❌ Error loading preview:', err);
      this.templatePreview = '⚠️ Failed to load preview.';
    },
  });
}

// When user clicks a district tag → update preview
showPreviewByIndex(index: number): void {
  this.selectedPreviewIndex = index;
  this.templatePreview = this.allPreviewMessages[index].previewMessage;
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
updateSelectedDistricts() {
  this.selectedDistricts = this.filteredData
    .filter((item: any) => item.selected)
    .map((item: any) => item.district_name);
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
