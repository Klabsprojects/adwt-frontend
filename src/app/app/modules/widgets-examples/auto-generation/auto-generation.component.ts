import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Document, Packer, Paragraph, TextRun,AlignmentType,UnderlineType, Table, TableRow, TableCell, WidthType, TabStopType } from 'docx';
import { saveAs } from 'file-saver';
import { FilterStateService } from 'src/app/services/filter-state-service';
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-auto-generation',
  templateUrl: './auto-generation.component.html',
  styleUrl: './auto-generation.component.scss'
})
export class AutoGenerationComponent implements OnInit{
searchText = '';
totalRecords: number = 0; // Total number of records
currentPage: number = 1; // Current page
totalPages: number = 0;
selectedRevenue_district: string = '';
revenueDistricts: any;
startDate: string = '';
endDate: string = '';
page: number = 1;
itemsPerPage: number = 10;
pageSize: number = 10;
displayedColumns: { label: string; field: string; sortable: boolean; visible: boolean }[] = [
    { label: 'Sl.No', field: 'sl_no', sortable: false, visible: true },
    { label: 'FIR No.', field: 'fir_number', sortable: true, visible: true },
    { label: 'Police City', field: 'police_city', sortable: true, visible: true },
    { label: 'Police Zone', field: 'police_zone', sortable: true, visible: true },
    { label: 'Police Range', field: 'police_range', sortable: true, visible: true },
    { label: 'Revenue District', field: 'revenue_district', sortable: true, visible: true },
    { label: 'Police Station Name', field: 'police_station', sortable: true, visible: true },
    { label: 'Registration Year', field: 'year', sortable: true, visible: true },

    { label: 'Offence', field: 'Offence_group', sortable: true, visible: false },
    { label: 'Officer Name', field: 'officer_name', sortable: true, visible: false },
    { label: 'Complaint Received Type', field: 'complaintReceivedType', sortable: true, visible: false },
    { label: 'Complaint Registered By', field: 'complaintRegisteredBy', sortable: true, visible: false },
    { label: 'Complaint Receiver Name', field: 'complaintReceiverName', sortable: true, visible: false },
    { label: 'Officer Designation', field: 'officer_designation', sortable: true, visible: false },
    { label: 'Place of Occurrence', field: 'place_of_occurrence', sortable: true, visible: false },
    { label: 'Date of Registration', field: 'date_of_registration', sortable: true, visible: true },
    { label: 'Time of Registration', field: 'time_of_registration', sortable: true, visible: false },

    { label: 'Date of Occurrence', field: 'date_of_occurrence', sortable: true, visible: false },
    { label: 'Time of Occurrence', field: 'time_of_occurrence', sortable: true, visible: false },
    { label: 'Date of Occurrence To', field: 'date_of_occurrence_to', sortable: true, visible: false },
    { label: 'Time of Occurrence To', field: 'time_of_occurrence_to', sortable: true, visible: false },
    { label: 'Name of Nomplainant', field: 'name_of_complainant', sortable: true, visible: false },

    { label: 'Created By', field: 'created_by', sortable: true, visible: true },
    { label: 'Created At', field: 'created_at', sortable: true, visible: true },
    { label: 'Last Edited Date', field: 'modified_at', sortable: true, visible: true },
    { label: 'Data Entry Status', field: 'status', sortable: false, visible: true },
    { label: 'Case Status', field: 'Case_Status', sortable: false, visible: true },
    { label: 'Actions', field: 'actions', sortable: false, visible: true },
  ];
selectedColumns: any[] = [...this.displayedColumns];
loader : boolean = false;
Parsed_UserInfo: any;
firList: any[] = [];
currentSortField: string = '';
isAscending: boolean = true;
appliedStatusOfCase: string = ''; 
isLoading: boolean = true;
selectedDistrict: string = '';
filteredList: any[] = [];
selectAll = false;
selectedDistricts: string | null = null;


constructor(
    private firService: FirListTestService, private cdr: ChangeDetectorRef,private firFilter:FilterStateService
){}
ngOnInit(): void {
   const userInfo: any = sessionStorage.getItem('user_data');
  this.Parsed_UserInfo = userInfo ? JSON.parse(userInfo) : null;
    this.loadRevenue_district();
    this.loadFirList(1, this.pageSize);
    this.updateSelectedColumns();
}

toggleSelectAll(event: any): void {
  const checked = event.target.checked;
  this.selectAll = checked;

  if (checked) {
    // When selecting all, pick the district of the first FIR
    if (this.filteredFirList().length > 0) {
      this.selectedDistrict = this.filteredFirList()[0].revenue_district;
    }

    // Only select FIRs from that district
    this.filteredFirList().forEach((fir: any) => {
      fir.selected = fir.revenue_district === this.selectedDistrict;
    });
  } else {
    // Deselect all
    this.selectedDistrict = null;
    this.filteredFirList().forEach((fir: any) => (fir.selected = false));
  }
}

onCheckboxChange(fir: any): void {
  if (fir.selected) {
    if (!this.selectedDistrict) {
      this.selectedDistrict = fir.revenue_district;
    } else if (fir.revenue_district !== this.selectedDistrict) {
      alert(
        `You can only select FIRs from the same district.\n` +
        `Selected District: ${this.selectedDistrict}\n` +
        `This FIR belongs to: ${fir.revenue_district}`
      );

      // 👇 uncheck after alert closes to ensure UI updates correctly
      setTimeout(() => {
        fir.selected = false;
        if (this.cdr) this.cdr.detectChanges();
      });
      return;
    }
  } else {
    const anySelected = this.filteredFirList().some((f: any) => f.selected);
    if (!anySelected) {
      this.selectedDistrict = null;
    }
  }

  // Update "Select All" checkbox
  const allSelected = this.filteredFirList()
    .filter((f: any) => f.revenue_district === this.selectedDistrict)
    .every((f: any) => f.selected);

  this.selectAll = allSelected;
}



getSelectedFirs(): any[] {
  return this.filteredFirList().filter((fir: any) => fir.selected);
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

formatStatusOfCase(statusOfCase: string): string {
  const map: { [key: string]: string } = {
    'UI': 'UI',
    'PT': 'PT',
    'Convicted': 'Conviction',
    'Acquitted': 'Acquitted',
    'FirQuashed': 'FIR Quashed',
    'MF': 'Mistake of Fact',
    'SectionDeleted': 'Section Deleted',
    'Charge_Abated': 'Charge Abated',
    'Quashed': 'Quashed',
    'Appeal': 'Appeal'
  };
  return map[statusOfCase] || statusOfCase;
}

openModal(data: any): void {
}
goToFirstPage() {
    if (this.currentPage !== 1) {
      this.loadFirList(1);
    }
  }

  goToLastPage() {
    if (this.currentPage !== this.totalPages) {
      this.loadFirList(this.totalPages);
    }
  }
  getFilterParams() {
  const params: any = {};

  const addParam = (key: string, value: any) => {
    if (value) params[key] = value;
  };
  if (this.Parsed_UserInfo.access_type === 'District' && this.Parsed_UserInfo.role === 4) {
    params.revenue_district = this.Parsed_UserInfo.district;
  }else if (this.Parsed_UserInfo.access_type === 'District' && this.Parsed_UserInfo.role === 3) {
    params.revenue_district = this.Parsed_UserInfo.district;
    params.district = this.Parsed_UserInfo.police_city;
  }
  
  addParam('search', this.searchText);
  addParam('revenue_district', this.selectedRevenue_district);
  addParam('start_date', this.startDate);
  addParam('end_date', this.endDate);
  return params;
}
clearfilter() {
  this.appliedStatusOfCase = '';
   this.searchText='';
 this.selectedRevenue_district='';
  this.startDate='';
  this.endDate='';
  this.appliedStatusOfCase = '';
 
    this.applyFilters();
  }
loadFirList(page: number = 1, pageSize: number = this.pageSize) {
    this.isLoading = true;
    this.currentPage = page;
    this.pageSize = pageSize;
    this.loader = true;

    this.firService.getPaginatedFirList(page, pageSize, this.getFilterParams()).subscribe(
      (response: any) => {
        this.firList = response.data;
        // console.log(response.data,response.data.status);
        this.totalRecords = response.total;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.filteredList = [...this.firList];
        // this.policeRanges = response.data.map((item: any) => item.police_range);
        // this.policeRanges = [...new Set(this.policeRanges)];
        // this.revenueDistricts = response.data.map((item: any) => item.revenue_district_name);
        this.isLoading = false;
        this.loader = false;
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load FIR data', 'error');
      }
    );
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.loadFirList(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadFirList(this.currentPage + 1);
    }
  }

  goToPage(pageNum: number) {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.loadFirList(pageNum);
    }
  }
  totalPagesArray(): number[] {
    // Use total pages from server-side pagination
    const totalPages = this.totalPages;
    const pageNumbers: number[] = [];

    // Define how many pages to show before and after the current page
    const delta = 2; // Number of pages to show before and after the current page

    // Calculate start and end page numbers
    let startPage = Math.max(1, this.currentPage - delta);
    let endPage = Math.min(totalPages, this.currentPage + delta);

    // Adjust start and end if there are not enough pages before or after
    if (this.currentPage <= delta) {
      endPage = Math.min(totalPages, startPage + delta * 2);
    } else if (this.currentPage + delta >= totalPages) {
      startPage = Math.max(1, endPage - delta * 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }
  hasNextPage() {
    return this.currentPage < this.totalPages;
  }


getSortIcon(field: string): string {
    return this.currentSortField === field
      ? this.isAscending
        ? 'fa-sort-up'
        : 'fa-sort-down'
      : 'fa-sort';
  }

  sortTable(field: string): void {
  if (this.currentSortField === field) {
    this.isAscending = !this.isAscending;
  } else {
    this.currentSortField = field;
    this.isAscending = true;
  }

  this.firList.sort((a, b) => {
    let valA = a[field] || '';
    let valB = b[field] || '';

    // Detect dd/MM/yyyy format
    const dateA = this.parseCustomDate(valA);
    const dateB = this.parseCustomDate(valB);
    if (dateA && dateB) {
      return this.isAscending
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }
    return this.isAscending
      ? valA.toString().localeCompare(valB.toString())
      : valB.toString().localeCompare(valA.toString());
  });
}
parseCustomDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day);
}
paginatedFirList() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.filteredFirList().slice(startIndex, startIndex + this.itemsPerPage);
  }

SearchList() {
  this.applyFilters();
}
applyFilters(): void {
  this.firFilter.setFIRFilters({
    search: this.searchText,
    revenue_district: this.selectedRevenue_district,
    start_date: this.startDate,
    end_date: this.endDate,
  });

  this.loadFirList(1);
}
filteredFirList() {
  return this.firList;
}
toggleColumnVisibility(column: any) {
    column.visible = !column.visible; // Toggle visibility
    this.updateSelectedColumns(); // Update selected columns
  }

updateSelectedColumns() {
    this.selectedColumns = this.displayedColumns.filter((col) => col.visible);
  }
dropColumn(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    this.updateSelectedColumns(); // Update selected columns after rearranging
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
  getCaseStatusBadgeClass(statusOfCase: string): string {
  switch (statusOfCase) {
    case 'Convicted':
      return 'badge bg-success text-white';
    case 'Acquitted':
      return 'badge bg-primary text-white';
    case 'Quashed':
    case 'FirQuashed':
      return 'badge bg-warning text-dark';
    case 'MF':
      return 'badge bg-danger text-white';
    case 'SectionDeleted':
      return 'badge bg-dark text-white';
    case 'Charge_Abated':
      return 'badge bg-info text-dark';
    case 'Appeal':
      return 'badge bg-info text-white';
    case 'UI':
      return 'badge bg-purple text-white';
    case 'PT':
      return 'badge bg-dark text-white';
    default:
      return 'badge bg-secondary text-white';
  }
}
   getStatusTextUIPT(status: number): string {
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

    alteredBadgeClass(status: number): string {
       if(status == 1){
        return 'badge bg-danger text-white'
      } else {
         return ''
      }
  }

 
downloadOCRelief() {
  
}
generateReliefDoc(type: 'OC' | 'FC') {
  const selectedFirs = this.getSelectedFirs();
  if (!selectedFirs.length) {
    alert('Please select at least one FIR.');
    return;
  }

  const district = selectedFirs[0].revenue_district || "________";
  const invalid = selectedFirs.some(f => f.revenue_district !== district);
  if (invalid) {
    alert('All selected FIRs must belong to the same district.');
    return;
  }

  // Prepare payload
  const payload = {
    district: district,
    fir_ids: selectedFirs.map(f => f.fir_id),
  };
  console.log("Payload ready for API:", payload);

  // Styling setup
  const blue = "0000FF";
  const black = "000000";
  const font = "Times New Roman";


  // ==== Head of Account table data ====
  const totalUA = "6,18,750";
  const totalUC = "6,18,750";
  const totalBA = "5,62,500";

  const headOfAccountRows = [
    {
      sl: "1",
      head: "“2235 Social Security and Welfare – 01 - Rehabilitation 200 Other Relief Measures - Schemes shared between State and Centre UC Assistance to the people of Scheduled Castes / Scheduled Tribes Community affected by riots – State Share 351 Compensation – 02 Other Compensation” 2235 01 200 UC 35102",
      amount: totalUC,
    },
    {
      sl: "2",
      head: "“2235 Social Security and Welfare – 01 - Rehabilitation 200 Other Relief Measures - Schemes shared between State and Centre UA Assistance to the people of Scheduled Castes / Scheduled Tribes Community affected by riots – Central Share 351 Compensation – 02 Other Compensation” 2235 01 200 UA 35102",
      amount: totalUA,
    },
    {
      sl: "3",
      head: "“2235 Social Security and Welfare – 01 - Rehabilitation 200 Other Relief Measures - Schemes shared between State and Centre BC Assistance to the people of Scheduled Castes / Scheduled Tribes Community affected by riots (Top-up) - 351 Compensation – 02 Other Compensation” 2235 01 200 BA 35102",
      amount: totalBA,
    },
  ];

  const headOfAccountTableSection = [
  // Space before table
  new Paragraph({
    spacing: { before: 200, after: 200 },
  }),

  // === Table ===
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Header Row
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 100 },
                children: [
                  new TextRun({ text: "Sl.", bold: true, size: 24, font: "Times New Roman" }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 100 },
                children: [
                  new TextRun({ text: "Head of Account", bold: true, size: 24, font: "Times New Roman" }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 100 },
                children: [
                  new TextRun({ text: "Amount", bold: true, size: 24, font: "Times New Roman" }),
                ],
              }),
            ],
          }),
        ],
      }),

      // Data Rows
      ...headOfAccountRows.map(
        (row) =>
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 100, after: 100 },
                    children: [
                      new TextRun({ text: row.sl, size: 24, font: "Times New Roman" }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    spacing: { before: 100, after: 100 },
                    children: [
                      new TextRun({ text: row.head, size: 24, font: "Times New Roman" }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    spacing: { before: 100, after: 100 },
                    children: [
                      new TextRun({ text: row.amount, size: 24, font: "Times New Roman" }),
                    ],
                  }),
                ],
              }),
            ],
          })
      ),
    ],
  }),

  // Space after table
  new Paragraph({
    spacing: { before: 200, after: 200 },
  }),
];

const footerText =
    type === 'OC'
      ? "……………………………………………………,\nDistrict Collector,\n…………………………."
      : "……………………………………………………,\nDistrict Collector,\nFor District Collector,";

  const fileName =
    type === 'OC'
      ? `OC_Relief_Proposal_${district}.docx`
      : `FC_Relief_Proposal_${district}.docx`;


  // Build document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `Proceedings of the District Collector, ${district} District`,
                color: black,
                bold: true,
                font,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 400 },
  children: [
    new TextRun({
      text: "Present: ",
      color: black,
      font,
      size: 26,
    }),
    new TextRun({
      text: "…………………………………",
      color: blue,
      underline: { type: UnderlineType.DOTTED },
      font,
      size: 26,
    }),
  ],
}),

          // Rc No / Date Line
          new Paragraph({
  alignment: AlignmentType.JUSTIFIED, // makes both sides stretch properly
  children: [
    new TextRun({
      text: "Rc. No: ",
      color: black,
      font,
      size: 26,
    }),
    new TextRun({
      text: "________________________",
      color: blue,
      underline: { type: UnderlineType.DOTTED },
    }),
    // Add a large tab space to push 'Date' to right side
    new TextRun({
      text: "\t", // adjust tabs if needed
    }),
    new TextRun({
      text: "Date: ",
      color: black,
      font,
      size: 26,
    }),
    new TextRun({
      text: "________________________",
      color: blue,
      underline: { type: UnderlineType.DOTTED },
    }),
  ],
  tabStops: [
    { type: TabStopType.RIGHT, position: 9000 }, 
  ],
}),


new Paragraph({
  spacing: { before: 400, after: 300 },
  children: [
    new TextRun({
      text: "Subject : ",
      bold: true,
      color: black,
      font,
      size: 26,
    }),
    new TextRun({
      text: "Adi Dravidar Welfare – Prevention of Atrocities - Disbursement of Monetary Relief and Ex-gratia to the victim(s) of atrocity as per Scheduled Castes and Scheduled Tribes Prevention of Atrocities Act, 1989 and Rules, 1995 - Regarding.",
      color: black,
      font,
      size: 26,
    }),
  ],
}),

// Reference
// Reference section
new Paragraph({
  spacing: { before: 200, after: 200 },
  children: [
    new TextRun({
      text: "Reference:",
      bold: true,
      color: black,
      font,
      size: 26,
    }),
  ],
}),

new Paragraph({
  indent: { left: 920 }, // indentation for numbering (0.5 inch)
  children: [
    new TextRun({
      text: "1. Prevention of Atrocities Act, 1989 & Rules (Amended) 2016, 14.04.2016",
      color: black,
      font,
      size: 26,
    }),
  ],
}),

new Paragraph({
  indent: { left: 920 },
  children: [
    new TextRun({
      text: "2. GO No: 4, Adi Dravidar and Tribal Welfare Department, Date: 02.02.2022",
      color: black,
      font,
      size: 26,
    }),
  ],
}),

new Paragraph({
  indent: { left: 920 },
  children: [
    new TextRun({
      text: "3. Related Document",
      color: black,
      font,
      size: 26,
    }),
  ],
}),



          // Description
         // ORDER (centered) + paragraph (left)
new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200, after: 300 },
  children: [
    new TextRun({
      text: "Order",
      bold: true,
      color: black,
      font,
      size: 27,
      underline: { type: UnderlineType.SINGLE },
    }),
  ],
}),

new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { before: 200, after: 500 },
  children: [
    new TextRun({
      text: "Based on the Prevention of Atrocities Act, 1989, Rules (Amended) 2016 and GO attached in the reference, proposals have been received from Superintendent of Police, ………………………… District, for the disbursement of relief to the victims/dependents mentioned below.",
      color: black,
      font,
      size: 26,
    }),
  ],
}),


          // Table
          new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    // 🔹 Header Row (Bold)
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "SI.", bold: true , size:26})],
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Police Station", bold: true,size:26 })],
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "FIR No.", bold: true,size:26 })],
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Victim/Dependent", bold: true,size:26 })],
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Section Filed", bold: true,size:26 })],
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Address of the Victim / Dependent",
                  bold: true,
                  size:26
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // 🔹 (Optional) Data rows — dynamically generated
    // ...selectedFirs.map((fir: any, index: number) =>
    //   new TableRow({
    //     children: [
    //       new TableCell({ children: [new Paragraph((index + 1).toString())] }),
    //       new TableCell({ children: [new Paragraph(fir.police_station || "—")] }),
    //       new TableCell({ children: [new Paragraph(fir.fir_number || "—")] }),
    //       new TableCell({ children: [new Paragraph(fir.victim_name || "—")] }),
    //       new TableCell({ children: [new Paragraph(fir.section || "—")] }),
    //       new TableCell({ children: [new Paragraph(fir.address || "—")] }),
    //     ],
    //   })
    // ),
  ],
}),

          new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { before: 300, after: 500 },
  children: [
    new TextRun({
      text: "Sanction is hereby accorded to disburse Monetary Relief Fund and Ex-gratia to the victims/dependents of the atrocity based on the proposal received from Superintendent of Police/ Commissioner of Police, ………………………… District - as tabulated below:",
      color: black,
      font,
      size: 26,
    }),
  ],
}),
new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      children: [
        ...[
          "Sl.",
          "Police Station",
          "FIR No.",
          "Victim/Dependent",
          "Stage",
          "Dependent Name",
          "Central Share UA",
          "State Share UC",
          "Ex-Gratia BA",
          "Total",
        ].map(
          (text) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text, bold: true, size:26 })],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 300, after: 400 },
                }),
              ],
            })
        ),
      ],
    }),
  ]
}),

new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      children: [
        ...[
          "Sl.",
          "Victim/Dependent",
          "Dependent",
          "Aadhar No.",
          "Bank Name",
          "Account Number",
          "IFSC",
          "Total",
        ].map(
          (text) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text, bold: true, size:26 })],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 300, after: 400 },
                }),
              ],
            })
        ),
      ],
    }),
  ]
}),
 new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { before: 200, after: 300 },
  children: [
    new TextRun({
      text: " District Adi Dravidar and Tribal Welfare Office’s Assistant Accounts Officer / District Adi Dravidar Welfare Officer is hereby authorised to disburse the above sanctioned relief to the victims / dependents through Single Nodal Account (…….Account Number………….) in PFMS. ",
      color: black,
      font,
      size: 26,
    }),
  ],
}),
new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { before: 100, after: 200 },
  children: [
    new TextRun({
      text: " The above expenditure is booked under the heads of account as tabulated below:",
      color: black,
      font,
      size: 26,
    }),
  ],
}),
          ...headOfAccountTableSection,

        new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 300, after: 300 },
            children: [
              new TextRun({
                text: footerText,
                color: black,
                font,
                size: 24,
              }),
            ],
          }),

        ],
      },
    ],
  });

  // Generate and download DOCX file
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, fileName);
  });
}
}

