
import Swal from 'sweetalert2';
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { environment as env } from 'src/environments/environment.prod';
import { PoliceDivisionService } from 'src/app/services/police-division.service';
import { FirService } from 'src/app/services/fir.service';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-fir-list',
  templateUrl: './fir-list.component.html',
})

export class FirListComponent implements OnInit {
  loader : boolean = false;
  firId: any;
  image_access = environment.image_access;
  image_access2 = environment.image_access2;

  policeCity: string = '';
  policeZone: string = '';
  policeRange: string = '';
  revenueDistrict: string = '';
  stationName: string = '';

  officerName: string = '';
  complaintReceivedType: string = '';
  complaintRegisteredBy: string = '';
  complaintReceiverName: string = '';
  officerDesignation: string = '';
  showOtherDesignation = false;
  otherDesignationValue: string = '';
  officerPhone: string = '';

  firNumber: string = '';
  dateOfOccurrence: string = '';
  date_of_occurrence_to: string = '';
  timeOfOccurrence: string = '';
  time_of_occurrence_to: string = '';
  placeOfOccurrence: string = '';
  is_case_altered: string = '';
  altered_date: string = '';
  dateOfRegistration: string = '';
  timeOfRegistration: string = '';

  nameOfComplainant: string = '';
  mobileNumberOfComplainant: string = '';
  isVictimSameAsComplainant: string = '';
  numberOfVictims: string = '';
  victimNames: string[] = [];
  victimsReliefDetails: any[] = [];
  judgementBeenAwardednxt: string = '';



  victimsdata: any[] = [];
  victimAge: string = '';
  victimName: string = '';
  victimGender: string = '';
  victimMobile: string = '';
  victimAddress: string = '';
  victimPincode: string = '';
  victimCommunity: string = '';
  victimCaste: string = '';
  victimGuardian: string = '';
  isNativeDistrictSame: string = '';
  nativeDistrict: string = '';
  victimOffence: string = '';
  invokedAct: string = '';
  sectionsIPC: any = [];


  isDeceased: string = '';
  deceasedPersonNames: string = '';


  numberOfAccused: string = ''; // Default: 1 accused
  accused_remarks: string = '';


  accusedsdata: any[] = [];
  accusedAge: string = ''; // Default: 35 years old
  accusedName: string = ''; // Default: John Doe
  accusedGender: string = ''; // Default: Male
  accusedAddress: string = ''; // Default: Address
  accusedPincode: string = ''; // Default: Pincode
  accusedCommunity: string = ''; // Default: Community
  accusedCaste: string = ''; // Default: Not applicable
  accusedGuardian: string = ''; // Default: Guardian
  previousIncident: string = ''; // Default: No previous incidents
  previousFIRNumber: string = ''; // Default: Not applicable
  scstOffence: string = ''; // Default: No offence against SC/ST
  scstFIRNumber: string = ''; // Default: Not applicable
  antecedents: string = ''; // Default: No antecedents
  landOIssues: string = ''; // Default: No L&O issues
  gistOfCurrentCase: string = ''; // Default: Brief case description
  uploadFIRCopy: string = ''; // Default: No file uploaded
  previous_incident_remarks: string = '';
  uploadedFIRFileNames: string;

  reliefsdata: any[] = [];
  communityCertificate: string = ''; // Default: Yes
  victimName1: string = ''; // Default: Jane Doe
  reliefAmountScst: string = ''; // Default: ₹50,000
  reliefAmountExGratia: string = ''; // Default: ₹30,000
  reliefAmountFirstStage: string = ''; // Default: ₹20,000
  additionalRelief: string = ''; // Default: Text

  totalCompensation: string = ''; // Default: ₹100,000
  proceedingsFileNo: string = ''; // Default: Proceedings file number
  proceedingsFileNo_1: string = '';
  proceedingsDate: string = ''; // Default: YYYY-MM-DD
  proceedingsDate_1: string = '';
  proceedingsFile: string = ''; // Default: Text
  proceedingFileName2: string = ''; // Default: Text
  attachments: any; // Default: Text
  chargeSheetattachments: any; // Default: Text
  quash_petition_no: string = '';
  petition_date: string = '';
  upload_court_order_path: string = '';
  totalCompensation_1: string = '';
  chargeSheetFiled: string = ''; // Default: Yes
  courtDistrict: string = ''; // Default: Court District
  courtName: string = ''; // Default: Court Range
  caseType: string = ''; // Default: Case Type
  caseNumber: string = ''; // Default: Case Number Report
  chargeSheetDate: string = '';
  rcsFileNumber: string = ''; // Default: RCS File Number
  rcsFilingDate: string = ''; // Default: YYYY-MM-DD
  mfCopy: string = ''; // Default: Upload MF Copy
  ChargeSheet_CRL_number: string = '';

  victimName2: string = ''; // Default: Victim Name
  reliefAmountScst1: string = ''; // Default: Relief Amount (SC/ST Act)
  reliefAmountExGratia1: string = ''; // Default: Relief Amount (Ex-Gratia)
  totalCompensation1: string = ''; // Default: Total eligible amount for the victim

  totalCompensation2: string = ''; // Default: Total amount for second stage of compensation
  proceedingsFileNo1: string = ''; // Default: Proceedings File No.
  proceedingsDate1: string = ''; // Default: Proceedings Date (format: YYYY-MM-DD)
  uploadProceedings: string = ''; // Default: Uploaded Proceedings File
  attachments1: string = ''; // Default: Other Attachments

  casedetailsdata: any[] = [];
  designated: string = ''; // Default: Name of the Designated / Special Court
  presentCourt: string = ''; // Default: District in which court is present
  scNumber: string = ''; // Default: Case Number Report (CNR) / Special SC Number
  prosecutorName: string = ''; // Default: Special Public Prosecutor's Name
  prosecutorPhoneNumber: string = ''; // Default: Special Public Prosecutor's Phone Number

  hearingdetaildata: any[] = [];
  hearingDate: string = ''; // Default: First Hearing Date
  judgementAwarded: string = ''; // Default: Judgement awarded status


  hearingdetailsdata: any[] = [];
  nextHearingDate: string = '';
  reasonNextHearing: string = '';







  // 1st Convicted
  // Judgement Details
  Judgementdata: any[] = [];
  natureOfJudgemen_1stConvicted: string = ''; // Default: Nature of Judgement
  judgementCopy_1stConvicted: string = ''; // Default: Upload Judgement Copy

  // Victim Relief Details
  trialreliefdata: any[] = [];
  victimName_1stConvicted: string = ''; // Default: Name of the Victim
  reliefAmount_1stConvicted: string = ''; // Default: Relief Amount as per SC/ST Act
  reliefAmount2_1stConvicted: string = ''; // Default: Relief Amount (Ex-Gratia)
  eligibleAmount_1stConvicted: string = ''; // Default: Total Eligible Amount

  // Compensation and Proceedings
  firtraildata: any[] = [];
  totalAmount_1stConvicted: string = ''; // Default: Total Amount for Third Stage of Compensation
  proceedingsNo_1stConvicted: string = ''; // Default: Proceedings File Number
  proceedingsDate2_1stConvicted: string = ''; // Default: Proceedings Date
  officeProceedings_1stConvicted: string = ''; // Default: Upload Commissionerate / S.P. Office Proceedings

  // Additional Attachments
  otherAttachments_1stConvicted: string = ''; // Default: Upload Other Attachments




  // 1st Acquitted
  appealdata: any[] = [];
  opinionObtained_1stAccquitted: string = ''; // Default: Has legal opinion obtained
  caseFit_1stAccquitted: string = ''; // Default: Is the case fit for appeal
  governmentApproved_1stAccquitted: string = ''; // Default: Has the government approved for appeal
  filedAppeal_1stAccquitted: string = ''; // Default: Who has filed the appeal
  specialCourtName_1stAccquitted: string = ''; // Default: Name of the Designated/Special court

  // Case Trial and Court Details
  casedetailsonedata: any[] = [];
  districtOfCourt_1stAccquitted: string = ''; // Default: District in which court is present
  scNumber1_1stAccquitted: string = ''; // Default: Case Number Report (CNR) / Special SC number
  prosecutorName1_1stAccquitted: string = ''; // Default: Special Public Prosecutor's Name
  phoneNumber1_1stAccquitted: string = ''; // Default: Special Public Prosecutor's Phone Number

  // Select Hearing Date
  hearingdetailonedata: any[] = [];
  hearingDate1_1stAccquitted: string = ''; // Default: First Hearing Date
  judgementAwarded1_1stAccquitted: string = ''; // Default: Judgement awarded status

  // Judgement Details

  judgementNature_1stAccquitted: string = ''; // Default: Nature of Judgement
  judgementCopy1_1stAccquitted: string = ''; // Default: Upload Judgement Copy

  hearingdetailstwodata: any[] = [];
  nextHearingDate1: string = '';
  reasonNextHearing1: string = '';
  judgementBeenAwardednxt1: string = '';


  // 2n convicted
  // Judgement Details
  natureOfJudgemen_2ndConvicted: string = ''; // Default: Nature of Judgement
  judgementCopy_2ndConvicted: string = ''; // Default: Upload Judgement Copy

  // Victim Relief Details
  victimName4_2ndConvicted: string = ''; // Default: Name of the Victim
  reliefAmount_2ndConvicted: string = ''; // Default: Relief Amount as per SC/ST Act
  reliefAmount2_2ndConvicted: string = ''; // Default: Relief Amount (Ex-Gratia)
  eligibleAmount_2ndConvicted: string = ''; // Default: Total Eligible Amount for the Victim

  // Compensation and Proceedings
  totalAmount_2ndConvicted: string = ''; // Default: Total Amount for Third Stage of Compensation
  proceedingsNo_2ndConvicted: string = ''; // Default: Proceedings File Number
  proceedingsDate2_2ndConvicted: string = ''; // Default: Proceedings Date
  officeProceedings_2ndConvicted: string = ''; // Default: Upload Commissionerate / S.P. Office Proceedings

  // Additional Attachments
  otherAttachments_2ndConvicted: string = ''; // Default: Upload Other Attachments


  // 2n Accquitted
  appealonedata: any[] = [];
  opinionObtained_2nd_Accquitted: string = ''; // Default: Has legal opinion obtained
  caseFit_2nd_Accquitted: string = ''; // Default: Is the case fit for appeal
  governmentApproved_2nd_Accquitted: string = ''; // Default: Has the government approved for appeal
  filedAppeal_2nd_Accquitted: string = ''; // Default: Who has filed the appeal
  specialCourtName_2nd_Accquitted: string = ''; // Default: Name of the Designated/Special court

  // Case Trial and Court Details
  casedetailstwodata: any[] = [];
  districtOfCourt_2nd_Accquitted: string = ''; // Default: District in which court is present
  scNumber1_2nd_Accquitted: string = ''; // Default: Case Number Report (CNR) / Special SC number
  prosecutorName1_2nd_Accquitted: string = ''; // Default: Special Public Prosecutor's Name
  phoneNumber1_2nd_Accquitted: string = ''; // Default: Special Public Prosecutor's Phone Number

  // Select Hearing Date
  courtdetailstwodata: any[] = [];
  hearingDate1_2nd_Accquitted: string = ''; // Default: First Hearing Date
  judgementAwarded1_2nd_Accquitted: string = ''; // Default: Judgement awarded status

  // Judgement Details
  hearingdetailtwodata: any[] = [];
  judgementNature_2nd_Accquitted: string = ''; // Default: Nature of Judgement
  judgementCopy1_2nd_Accquitted: string = ''; // Default: Upload Judgement Copy


  hearingdetailsthreedata: any[] = [];
  nextHearingDate2: string = '';
  reasonNextHearing2: string = '';
  judgementBeenAwardednxt2: string = '';

  // 2n convicted
  // Judgement Details
  natureOfJudgemen_3rdConvicted: string = ''; // Default: Nature of Judgement
  judgementCopy_3rdConvicted: string = ''; // Default: Upload Judgement Copy

  // Victim Relief Details
  victimName4_3rdConvicted: string = ''; // Default: Name of the Victim
  reliefAmount_3rdConvicted: string = ''; // Default: Relief Amount as per SC/ST Act
  reliefAmount2_3rdConvicted: string = ''; // Default: Relief Amount (Ex-Gratia)
  eligibleAmount_3rdConvicted: string = ''; // Default: Total Eligible Amount

  // Compensation and Proceedings
  totalAmount_3rdConvicted: string = ''; // Default: Total Compensation Amount
  proceedingsNo_3rdConvicted: string = ''; // Default: Proceedings File No.
  proceedingsDate2_3rdConvicted: string = ''; // Default: Proceedings Date
  officeProceedings_3rdConvicted: string = ''; // Default: Upload Commissionerate / S.P. Office Proceedings

  // Additional Attachments
  otherAttachments_3rdConvicted: string = ''; // Default: Upload Other Attachments

  // 3rd accquitted
  // Appeal Details
  caseappealdetailstwodata: any[] = [];
  opinionObtained_3rdAccquitted: string = ''; // Default: Has legal opinion obtained
  caseFit_3rdAccquitted: string = ''; // Default: Is the case fit for appeal
  governmentApproved_3rdAccquitted: string = ''; // Default: Has the government approved for appeal
  filedAppeal_3rdAccquitted: string = ''; // Default: Who has filed the appeal

  filteredList: any[] = [];
  policeStations: string[] = [];
  communitiesOptions: string[] = [];
  casteOptions:string[]=[];
  sectionOfLaw: any[] = [];


  // nextHearingDate: string = ''; // Default: Next Hearing Date
  // reasonNextHearing: string = ''; // Default: Reason for Next Hearing
  // judgementAwardedCase: string = ''; // Default: Judgement awarded status

  // natureOfJudgement: string = ''; // Default: Nature of Judgement
  // judgementCopy: string = ''; // Default: Judgement Copy Details


  // victimName4: string = ''; // Default: Name of the Victim
  // reliefAmount: string = ''; // Default: Relief Amount as per SC/ST Act
  // reliefAmount2: string = ''; // Default: Relief Amount (Ex-Gratia)
  // eligibleAmount: string = ''; // Default: Total Eligible Amount

  // totalAmount: string = ''; // Default: Total Amount for Third Stage of Compensation
  // proceedingsNo: string = ''; // Default: Proceedings File No.
  // proceedingsDate2: string = ''; // Default: Proceedings Date
  // officeProceedings: string = ''; // Default: Office Proceedings Upload Details
  // otherAttachments: string = ''; // Default: Other Attachments Details

  // opinionObtained: string = ''; // Default: Has legal opinion obtained
  // caseFit: string = ''; // Default: Is the case fit for appeal
  // governmentApproved: string = ''; // Default: Has the government approved for appeal
  // filedAppeal: string = ''; // Default: Who has filed the appeal
  // specialCourtName: string = ''; // Default: Name of the Designated/ Special Court

  // specialCourtName1: string = 'Enter Name';
  // districtOfCourt: string = 'Enter District Name';
  // scNumber1: string = 'Enter Case Number';
  // prosecutorName1: string = 'Enter Name';
  // phoneNumber1: string = 'Enter Phone Number';

  // hearingDate1: string = 'Enter Date';
  // judgementAwarded1: string = 'Enter Yes or No';

  // hearingDate2: string = 'Select Next Hearing Date';
  // nextHearingReason: string = 'Enter Reason';
  // judgementAwarded2: string = 'Enter Yes or No';

  // judgementNature: string = 'Enter Nature of Judgement';
  // judgementCopy1: string = '';

  // opinionObtained1: string = '';
  // caseFit1: string = '';
  // governmentApproved1: string = '';
  // filedAppeal1: string = '';



  steps = ['Location Details', 'Offence Information', 'Victim Information', 'Accused Info', 'MRF Info', 'ChargeSheet Stage', 'Trail Stage'];
  currentStep = 0;
  step: any;
  searchText: string = '';
  firList: any[] = [];
  page: number = 1;
  itemsPerPage: number = 10;
  isLoading: boolean = true;
  compensation_details_2: any;
  uploadProceedingsUrl: string;
  get progressPercentage(): number {
    return ((this.currentStep + 1) / this.steps.length) * 100;
  }
  // Filters
  selectedDistrict: string = '';
  selectedNatureOfOffence: string = '';
  selectedStatusOfCase: string = '';
  selectedStatusOfRelief: string = '';
  selectedOffenceGroup: string = '';
  selectedSectionOfLaw:string='';
  selectedCourt:string='';
  selectedConvictionType:string='';
  RegistredYear: string = '';
  selectedPoliceZone: string = '';
  selectedPoliceRange: string = '';
  selectedRevenue_district: string = '';
  selectedPoliceStation:string='';
  selectedCommunity:string='';
  selectedCaste:string='';
  selectedComplaintReceivedType: string = '';
  startDate: string = '';
  endDate: string = '';
  CreatedATstartDate: string = '';
  CreatedATendDate: string = '';
  ModifiedATstartDate: string = '';
  ModifiedATDate: string = '';
  selectedUIPT: string = '';
  selectedChargeSheetDate:string='';
  selectedLegal:string='';
  selectedCase:string='';
  selectedFiled:string='';
  selectedAppeal:string='';




  @ViewChild('firDetailsModal') firDetailsModal!: TemplateRef<any>;

  // Filter options
  // districts: string[] = [
  //   'Ariyalur',
  //   'Chengalpattu',
  //   'Chennai',
  //   'Coimbatore',
  //   'Cuddalore',
  //   'Dharmapuri',
  //   'Dindigul',
  //   'Erode',
  //   'Kallakurichi',
  //   'Kanchipuram',
  //   'Kanniyakumari',
  //   'Karur',
  //   'Krishnagiri',
  //   'Madurai',
  //   'Mayiladuthurai',
  //   'Nagapattinam',
  //   'Namakkal',
  //   'Nilgiris',
  //   'Perambalur',
  //   'Pudukkottai',
  //   'Ramanathapuram',
  //   'Ranipet',
  //   'Salem',
  //   'Sivagangai',
  //   'Tenkasi',
  //   'Thanjavur',
  //   'Theni',
  //   'Thoothukudi (Tuticorin)',
  //   'Tiruchirappalli (Trichy)',
  //   'Tirunelveli',
  //   'Tirupathur',
  //   'Tiruppur',
  //   'Tiruvallur',
  //   'Tiruvannamalai',
  //   'Tiruvarur',
  //   'Vellore',
  //   'Viluppuram',
  //   'Virudhunagar'
  // ];

  districts: any;
  policeZones: any;
  policeRanges: any;
  revenueDistricts: any;

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


  statusesOfCase: string[] = ['Just Starting', 'Pending', 'Completed'];
  // statusesOfRelief: string[] = ['FIR Stage', 'ChargeSheet Stage', 'Trial Stage'];
  statusesOfRelief: any[] = [{ value: 0, label: 'FIR Stage' }, { value: 6, label: 'ChargeSheet Stage' }, { value: 7, label: 'Trial Stage' }];

  // Visible Columns Management

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


  filterFields = [
  { key: 'city', label: 'Police City', visible: true },
  { key: 'zone', label: 'Police Zone', visible: true },
  { key: 'range', label: 'Police Range', visible: true },
  { key: 'revenueDistrict', label: 'Revenue District', visible: true },
  { key: 'station', label: 'Police Station', visible: true },
  { key: 'community', label: 'Community', visible: false },
  { key: 'caste', label: 'Caste', visible: false },
  { key: 'registeredYear', label: 'Year of Registration', visible: false },
  { key: 'regDate', label: 'Reg. Date From - To', visible: false },
  // { key: 'regDate', label: 'Reg. Date To', visible: false },
  { key: 'createdAt', label: 'Created At From - To', visible: false },
  // { key: 'createdAt', label: 'Created At To', visible: false },
  { key: 'modifiedAt', label: 'Modified At From - To', visible: false },
  // { key: 'modifiedAt', label: 'Modified At To', visible: false },
  { key: 'status', label: 'Status of Case', visible: false },
  { key: 'offenceGroup', label: 'Nature of Case', visible: false },
  { key: 'sectionOfLaw', label: 'Section of Law', visible: false },
  { key: 'court', label: 'Court', visible: false },
  { key: 'convictionType', label: 'Conviction Type', visible: false },
  { key: 'chargeSheetDate', label: 'Chargesheet Date', visible: false },
  { key: 'legal', label: 'Legal Opinion', visible: false },
  { key: 'fitCase', label: 'Fit for Appeal', visible: false },
  { key: 'filedBy', label: 'Filed By', visible: false },
  { key: 'appealCourt', label: 'Appeal Court', visible: false }
];

activeFilters: string[] = ['city', 'zone', 'range', 'revenueDistrict', 'station'];


  years: number[] = [];

  selectedColumns: any[] = [...this.displayedColumns];

  // Sorting variables
  currentSortField: string = '';
  isAscending: boolean = true;
  RecivedFirData: any;


  pageSizeOptions: number[] = [5, 10, 20, 50]; // Available page size options
  pageSize: number = 10; // Default records per page
  totalRecords: number = 0; // Total number of records
  currentPage: number = 1; // Current page
  totalPages: number = 0;
  Parsed_UserInfo: any;
  showDuplicateSection = false;
  showDuplicateSection_1: boolean = false;


  constructor(
    private firService: FirListTestService,
    // private firService : FirService,
    private firGetService: FirService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private policeDivisionService: PoliceDivisionService
  ) { }

  ngOnInit(): void {
    const UserInfo: any = sessionStorage.getItem('user_data');
    this.Parsed_UserInfo = JSON.parse(UserInfo)
    this.loadFirList(1, this.pageSize);
    this.updateSelectedColumns();
    this.loadPoliceDivision();
    this.loadPoliceRanges();
    this.loadRevenue_district();
    this.generateYearOptions();
    this.loadCommunities();
    this.loadOptions();
    this.updateFilterVisibility();


    setTimeout(() => {
      this.route.queryParams.subscribe(params => {
        if (params['shouldCallFunction'] == 'true') {
          this.RecivedFirData = decodeURIComponent(params['data']);
          if (this.RecivedFirData) {
            let data = {
              fir_id: this.RecivedFirData.replace(/"/g, '')
            }
            this.openModal(data);
          }
        }
      });
    }, 2000);
  }
  isPreviewVisible = false;
  showPreview() {
    this.isPreviewVisible = !this.isPreviewVisible;
  }
  courtDetails: any = {};

  generateYearOptions(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1980; year--) {
      this.years.push(year);
    }
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
        console.log(offences);
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



  loadFirDetails(firId: any) {
    this.firGetService.getFirDetails(firId).subscribe(
      (response) => {
        console.log("response view", response);
        this.policeCity = response.data.police_city;
        this.policeZone = response.data.police_zone;
        this.policeRange = response.data.police_range;
        this.revenueDistrict = response.data.revenue_district;
        this.stationName = response.data.police_station;
        this.officerName = response.data.officer_name;
        this.complaintReceivedType = response.data.complaintReceivedType;
        this.complaintRegisteredBy = response.data.complaintRegisteredBy;
        this.complaintReceiverName = response.data.complaintReceiverName;
        this.officerDesignation = response.data.officer_designation;
        this.officerPhone = response.data.officer_phone;
        this.firNumber = response.data.fir_number + '/' + response.data.fir_number_suffix;
        this.dateOfOccurrence = response.data.date_of_occurrence ? this.convertToNormalDate(response.data.date_of_occurrence) : response.data.date_of_occurrence;
        this.date_of_occurrence_to = response.data.date_of_occurrence_to ? this.convertToNormalDate(response.data.date_of_occurrence_to) : response.data.date_of_occurrence_to;
        this.timeOfOccurrence = response.data.time_of_occurrence;
        this.time_of_occurrence_to = response.data.time_of_occurrence_to;
        this.placeOfOccurrence = response.data.place_of_occurrence;
        this.dateOfRegistration = response.data.date_of_registration ? this.convertToNormalDate(response.data.date_of_registration) : response.data.date_of_registration;
        this.timeOfRegistration = response.data.time_of_registration;
        this.is_case_altered = response.data.is_case_altered;
        this.altered_date = response.data.altered_date ? this.convertToNormalDate(response.data.altered_date) : response.data.altered_date;

        this.nameOfComplainant = response.data.name_of_complainant;
        this.mobileNumberOfComplainant = response.data.mobile_number_of_complainant;
        if (response.data && response.data.is_victim_same_as_complainant) {
          if (response.data.is_victim_same_as_complainant == 'true') {
            this.isVictimSameAsComplainant = 'Yes';
          } else {
            this.isVictimSameAsComplainant = 'No';
          }
        }
        this.numberOfVictims = response.data.number_of_victim;
        this.victimsdata = response.data1;
        this.victimsdata = this.victimsdata.map((victim) => {
          const age = Number(victim.victim_age);
          const name = !isNaN(age) && age < 18 ? 'Minor' : victim.victim_name;

          return {
            ...victim,
            victim_name: name,
            scst_sections: victim.scst_sections ? this.formatedata(victim.scst_sections) : victim.scst_sections,
            offence_committed: victim.offence_committed ? this.formatedata(victim.offence_committed) : victim.offence_committed,
            sectionsIPC: victim.sectionsIPC_JSON ? JSON.parse(victim.sectionsIPC_JSON) : []
          };


        });
        this.isDeceased = response.data.is_deceased == 1 ? 'Yes' : 'No';
        this.deceasedPersonNames = response.data.deceased_person_names ? this.formatedata(response.data.deceased_person_names) : response.data.deceased_person_names;
        this.numberOfAccused = response.data.number_of_accused;
        this.accused_remarks = response.data.accused_remarks;
        this.accusedsdata = response.data2;
        this.reliefsdata = response.data;
        this.gistOfCurrentCase = response.data.gist_of_current_case;
        this.uploadFIRCopy = response.data.upload_fir_copy;
        this.uploadedFIRFileNames = response.data.upload_fir_copy;
        this.totalCompensation = response.data3.total_compensation;
        console.log(this.totalCompensation, response.data3.total_amount_third_stage);
        this.proceedingsFileNo = response.data3.proceedings_file_no;
        this.proceedingsDate = response.data3.proceedings_date ? this.convertToNormalDate(response.data3.proceedings_date) : response.data3.proceedings_date;
        this.proceedingsFile = response.data3.proceedings_file;
        this.loadVictimsDetails();
        this.attachments = response.data3.file_paths || [];
        this.chargeSheetFiled = response.data4.charge_sheet_filed;
        this.courtDistrict = response.data4.court_district;
        this.courtName = response.data4.court_name;
        this.caseType = response.data4.case_type;
        // this.caseType = 'referredChargeSheet';
        this.caseNumber = response.data4.case_number;
        this.chargeSheetDate = response.data4.chargesheetDate ? this.convertToNormalDate(response.data4.chargesheetDate) : response.data4.chargesheetDate;
        this.ChargeSheet_CRL_number = response.data4.ChargeSheet_CRL_number;
        this.rcsFileNumber = response.data4.rcs_file_number;
        this.rcsFilingDate = response.data4.rcs_filing_date ? this.convertToNormalDate(response.data4.rcs_filing_date) : response.data4.rcs_filing_date;
        this.mfCopy = response.data4.mf_copy_path;
        this.proceedingsFileNo_1 = response.data4.proceedings_file_no;
        this.proceedingsDate_1 = response.data4.proceedings_date ? this.convertToNormalDate(response.data4.proceedings_date) : response.data4.proceedings_date;
        this.proceedingFileName2 = response.data4.upload_proceedings_path;
        this.quash_petition_no = response.data4.quash_petition_no;
        this.petition_date = response.data4.petition_date ? this.convertToNormalDate(response.data4.petition_date) : response.data4.petition_date;
        this.upload_court_order_path = response.data4.upload_court_order_path;
        this.totalCompensation_1 = response.data4.total_compensation_1;
        this.chargeSheetattachments = response.data4.attachments || [];


        this.showDuplicateSection = false;
        this.showDuplicateSection_1 = false;

        // Assign data from response
        if (response && response.data5 && response.data5.length > 0) {
          console.log('response.data5', response.data5);
          const item = response.data5[0];
          this.courtDistrict = item.court_district || '';
          this.Court_name1 = item.court_name || '';
          this.trialCaseNumber = item.trial_case_number || '';
          this.CRL_number = item.CRL_number || '';
          this.CaseHandledBy = item.CaseHandledBy || '';
          this.NameOfAdvocate = item.NameOfAdvocate || '';
          this.advocateMobNumber = item.advocateMobNumber || '';
          this.publicProsecutor = item.public_prosecutor || '';
          this.prosecutorPhone = item.prosecutor_phone || '';
          this.firstHearingDate = item.first_hearing_date ? formatDate(item.first_hearing_date, 'yyyy-MM-dd', 'en') : '';
          this.judgementAwarded = item.judgement_awarded || '';
          this.judgementNature = item.judgementNature || '';
          this.Judgement_Date = item.Judgement_Date ? formatDate(item.Judgement_Date, 'yyyy-MM-dd', 'en') : '';
          this.Conviction_Type = item.Conviction_Type || '';
          this.judgement_nature_remarks = item.judgement_nature_remarks || '';
          this.judgementAwarded1 = item.judgementAwarded1;
          this.judgementAwarded2 = item.judgementAwarded2;
          this.judgementAwarded3 = item.judgementAwarded3;

          // Hearing Details
          console.log('item.hearingDetails', item.hearingDetails);
          if (item.hearingDetails && Array.isArray(item.hearingDetails)) {
            this.hearingDetails = item.hearingDetails.map((hearing: any) => ({
              nextHearingDate: hearing.next_hearing_date ? formatDate(hearing.next_hearing_date, 'yyyy-MM-dd', 'en') : '',
              reasonNextHearing: hearing.reason_next_hearing || ''
            }));
          }
        }

        this.hearingDetails = response.hearingDetails;
        this.hearingDetails_one = response.hearingDetails_one;
        this.hearingDetails_two = response.hearingDetails_two;

        // Appeal Details
        if (response.appeal_details && response.appeal_details.length > 0) {
          const appealDetail = response.appeal_details[0];
          this.legalOpinionObtained = appealDetail.legal_opinion_obtained || '';
          this.caseFitForAppeal = appealDetail.case_fit_for_appeal || '';
          this.governmentApprovalForAppeal = appealDetail.government_approval_for_appeal || '';
          this.filedBy = appealDetail.filed_by || '';
          this.designatedCourt = appealDetail.designated_court || '';
        }

        // Duplicate Section (High Court)
        if (response.casedetail_one && response.casedetail_one.length > 0) {
          this.showDuplicateSection = response.appeal_details.designated_court === 'highCourt' || response.appeal_details.designated_court === 'supremeCourt';
          this.selectedCourtType = response.appeal_details.designated_court;
          const item = response.casedetail_one[0];
          this.courtDistrict_one = item.court_district || '';
          this.caseNumber_one = item.case_number || '';
          this.CRL_number_one = item.CRL_number || '';
          this.publicProsecutor_one = item.public_prosecutor || '';
          this.prosecutorPhone_one = item.prosecutor_phone || '';
          this.firstHearingDate_one = item.second_hearing_date ? formatDate(item.second_hearing_date, 'yyyy-MM-dd', 'en') : '';
          this.judgementAwarded_one = item.judgement_awarded || '';
          this.judgementNature_one = item.judgementNature || '';
          this.Judgement_Date_one = item.Judgement_Date ? formatDate(item.Judgement_Date, 'yyyy-MM-dd', 'en') : '';
          this.Conviction_Type_one = item.Conviction_Type || '';
          this.judgement_nature_remarks_one = item.judgement_nature_remarks || '';
          this.uploadJudgement_one = item.judgement_copy || '';

          if (response.hearingDetails_one && response.hearingDetails_one.length > 0) {
            this.hearingDetails_one = response.hearingDetails_one.map((hearing: any) => ({
              nextHearingDate_one: hearing.next_hearing_date ? formatDate(hearing.next_hearing_date, 'yyyy-MM-dd', 'en') : '',
              reasonNextHearing_one: hearing.reason_next_hearing || ''
            }));
          }

          if (response.appeal_details_one && response.appeal_details_one.length > 0) {
            const appealDetail = response.appeal_details_one[0];
            this.legalOpinionObtained_one = appealDetail.legal_opinion_obtained || '';
            this.caseFitForAppeal_one = appealDetail.case_fit_for_appeal || '';
            this.governmentApprovalForAppeal_one = appealDetail.government_approval_for_appeal || '';
            this.filedBy_one = appealDetail.filed_by || '';
            this.designatedCourt_one = appealDetail.designated_court || '';
          }
        }

        // Duplicate Section 1 (Supreme Court)
        if (response.casedetail_two && response.casedetail_two.length > 0) {
          this.showDuplicateSection_1 = response.appeal_details_one.designated_court === 'highCourt_one' || response.appeal_details_one.designated_court === 'supremeCourt_one'
          const item = response.casedetail_two[0];
          this.courtDistrict_two = item.court_district || '';
          this.caseNumber_two = item.case_number || '';
          this.CRL_number_two = item.CRL_number || '';
          this.publicProsecutor_two = item.public_prosecutor || '';
          this.prosecutorPhone_two = item.prosecutor_phone || '';
          this.firstHearingDate_two = item.second_hearing_date ? formatDate(item.second_hearing_date, 'yyyy-MM-dd', 'en') : '';
          this.judgementAwarded_two = item.judgement_awarded || '';
          this.judgementAwarded3 = item.judgement_awarded || '';
          this.judgementNature_two = item.judgementNature || '';
          this.Judgement_Date_two = item.Judgement_Date ? formatDate(item.Judgement_Date, 'yyyy-MM-dd', 'en') : '';
          this.Conviction_Type_two = item.Conviction_Type || '';
          this.judgement_nature_remarks_two = item.judgement_nature_remarks || '';
          this.uploadJudgement_two = item.judgement_copy || '';
          this.legalOpinionObtained_two = item.legal_opinion_obtained || '';
          this.caseFitForAppeal_two = item.case_fit_for_appeal || '';
          this.governmentApprovalForAppeal_two = item.government_approval_for_appeal || '';
          this.filedBy_two = item.filed_by || '';

          if (response.hearingDetails_two && response.hearingDetails_two.length > 0) {
            this.hearingDetails_two = response.hearingDetails_two.map((hearing: any) => ({
              nextHearingDate_two: hearing.next_hearing_date ? formatDate(hearing.next_hearing_date, 'yyyy-MM-dd', 'en') : '',
              reasonNextHearing_two: hearing.reason_next_hearing || ''
            }));
          }
        }

        // Victim Relief and Compensation
        if (response.data1 && response.data1.length > 0) {
          this.victimNames = response.data1.map((victim: any) => victim.victim_name || '');
        }

        if (response.compensation_details_2 && response.compensation_details_2.length > 0) {
          this.victimsRelief = response.compensation_details_2.map((item: any) => ({
            reliefAmountScst_2: item.relief_amount_scst || '',
            reliefAmountExGratia_2: item.relief_amount_ex_gratia || '',
            reliefAmountThirdStage: item.total_compensation || ''
          }));
          this.totalCompensation_2 = response.compensation_details_2[0].total_compensation || '';
          this.proceedingsFileNo_2 = response.compensation_details_2[0].proceedings_file_no || '';
          this.proceedingsDate_2 = response.compensation_details_2[0].proceedings_date ? formatDate(response.compensation_details_2[0].proceedings_date, 'yyyy-MM-dd', 'en') : '';
          this.file95 = response.compensation_details_2[0].upload_proceedings || '';
        }

        // Attachments
        if (response.trialAttachments && response.trialAttachments.length > 0) {
          this.attachments_2 = response.trialAttachments.map((item: any) => ({
            fileName_2: item.file_name || '',
            file_2: item.file_name || ''
          }));
        }

        this.hideCompensationSection = !(this.judgementNature === 'Convicted' || this.filedBy !== 'No appeal yet');

        this.cdr.detectChanges();

      });
  }

  Court_name1: string = '';
  trialCaseNumber: string = '';
  CRL_number: string = '';
  CaseHandledBy: string = '';
  NameOfAdvocate: string = '';
  advocateMobNumber: string = '';
  publicProsecutor: string = '';
  prosecutorPhone: string = '';
  firstHearingDate: string = '';
  judgementAwarded1: string = '';
  judgementNature: string = '';
  Judgement_Date: string = '';
  Conviction_Type: string = '';
  judgement_nature_remarks: string = '';
  uploadJudgement: string = '';
  legalOpinionObtained: string = '';
  caseFitForAppeal: string = '';
  governmentApprovalForAppeal: string = '';
  filedBy: string = '';
  designatedCourt: string = '';
  selectedCourtType: string = '';
  courtDistrict_one: string = '';
  caseNumber_one: string = '';
  CRL_number_one: string = '';
  publicProsecutor_one: string = '';
  prosecutorPhone_one: string = '';
  firstHearingDate_one: string = '';
  judgementAwarded_one: string = '';
  judgementAwarded2: string = '';
  judgementNature_one: string = '';
  Judgement_Date_one: string = '';
  Conviction_Type_one: string = '';
  judgement_nature_remarks_one: string = '';
  uploadJudgement_one: string = '';
  legalOpinionObtained_one: string = '';
  caseFitForAppeal_one: string = '';
  governmentApprovalForAppeal_one: string = '';
  filedBy_one: string = '';
  designatedCourt_one: string = '';
  courtDistrict_two: string = '';
  caseNumber_two: string = '';
  CRL_number_two: string = '';
  publicProsecutor_two: string = '';
  prosecutorPhone_two: string = '';
  firstHearingDate_two: string = '';
  judgementAwarded_two: string = '';
  judgementAwarded3: string = '';
  judgementNature_two: string = '';
  Judgement_Date_two: string = '';
  Conviction_Type_two: string = '';
  judgement_nature_remarks_two: string = '';
  uploadJudgement_two: string = '';
  legalOpinionObtained_two: string = '';
  caseFitForAppeal_two: string = '';
  governmentApprovalForAppeal_two: string = '';
  filedBy_two: string = '';
  victimsRelief: any[] = [];
  totalCompensation_2: string = '';
  proceedingsFileNo_2: string = '';
  proceedingsDate_2: string = '';
  file95: string = '';
  attachments_2: any[] = [];
  hideCompensationSection: boolean = false;
  hearingDetails: any[] = [];
  hearingDetails_one: any[] = [];
  hearingDetails_two: any[] = [];


  viewuploadJudgement(path: any) {

  }
  view_pdf(path: any) {
    if (path) {
      const url = `${env.file_access}${path.startsWith('/') ? '' : '/'}${path}`;
      window.open(url, '_blank');
    }
  }

  getFileName(path: string): string {
    return path.split('/').pop() || path;
  }

  getChargeFileName(path: string): string {
    return path.split('/').pop() || path;
  }

  parseAdditionalRelief(data: string): any[] {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  loadVictimsDetails(): void {
    // if (!this.firId || this.firId !== sessionStorage.getItem('firId')) { 
    //   return;
    // }

    this.firGetService.getVictimsReliefDetails(this.firId).subscribe(
      (response: any) => {
        // this.numberOfVictims = response.numberOfVictims || "";
        this.victimNames = response.victimNames;
        this.victimsReliefDetails = response.victimsReliefDetails;
        this.reliefsdata = this.victimsReliefDetails;
        console.log("vidtim", this.victimsReliefDetails);
        const data = response.victimsReliefDetails[0];  // get the first object from the array

        this.victimName2 = data.victim_name;
        this.reliefAmountScst1 = data.relief_amount_scst_1;
        this.reliefAmountExGratia1 = data.relief_amount_ex_gratia_1;
        this.totalCompensation1 = data.relief_amount_second_stage;
        this.populateVictimsRelief(response.victimsReliefDetails)
      },
      (error) => {
        console.error('Error fetching victim details:', error);
        Swal.fire('Error', 'Failed to load victim details', 'error');
      }
    );
  }

  victimsReliefs: any[] = [];

  loadVictimsReliefDetails(): void {
    if (!this.firId) {
      console.error('FIR ID is missing.');
      return;
    }

    this.firGetService.getVictimsReliefDetails(this.firId).subscribe(
      (response: any) => {
        if (response && response.victimsReliefDetails) {
          this.populateVictimsRelief(response.victimsReliefDetails);
        } else {
          console.warn('No victim relief details found.');
        }
        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error('Failed to fetch victim relief details:', error);
      }
    );
  }

  populateVictimsRelief(victimsReliefDetails: any[]): void {
    console.log('victimsReliefDetails', victimsReliefDetails);
    this.victimNames = [];
    this.victimsReliefs = [];
    this.victimsRelief = [];
    let totalReliefSecondStage = 0;

    victimsReliefDetails.forEach((victimReliefDetail) => {
      this.victimNames.push(victimReliefDetail.victim_name || '');

      const reliefAmountSecondStage = (
        (parseFloat(victimReliefDetail.relief_amount_scst_1) || 0) +
        (parseFloat(victimReliefDetail.relief_amount_ex_gratia_1) || 0)
      ).toFixed(2);

      this.victimsRelief.push({
        reliefAmountScst_2: victimReliefDetail.relief_amount_act || '0',
        reliefAmountExGratia_2: victimReliefDetail.relief_amount_government || '0',
        reliefAmountThirdStage: victimReliefDetail.relief_amount_final_stage
      })

      this.victimsReliefs.push({
        reliefAmountScst_2: victimReliefDetail.relief_amount_scst_1 || '0',
        reliefAmountExGratia_2: victimReliefDetail.relief_amount_ex_gratia_1 || '0',
        reliefAmountThirdStage: reliefAmountSecondStage
      });

      console.log('victimsReliefs', this.victimsReliefs);

      totalReliefSecondStage += parseFloat(reliefAmountSecondStage);
    });

    this.totalCompensation_1 = totalReliefSecondStage.toFixed(2);
  }













  // funtions
  fetchFirDetails(firId: any): void {


    console.log(firId)
    this.firGetService.getFirDetails(firId).subscribe(
      (data) => {
        console.log(data);
        if (!data || data.length === 0) {
          console.warn('No FIR found for the given ID');
          alert('No FIR found for the given ID');
        } else {
          console.log(data.queryResults);
          this.victimsdata = data.queryResults1;
          this.victimsdata = this.victimsdata.map((victim) => ({
            ...victim, // Keep all existing properties
            scst_sections: victim.scst_sections ? this.formatedata(victim.scst_sections) : victim.scst_sections,
            offence_committed: victim.offence_committed ? this.formatedata(victim.offence_committed) : victim.offence_committed
          }));
          this.accusedsdata = data.queryResults2;
          this.reliefsdata = data.queryResults3;




          // step 7
          this.casedetailsdata = data.queryResults4;
          this.hearingdetaildata = data.queryResults6;

          console.log(this.hearingdetaildata, "  this.hearingdetaildata")

          this.Judgementdata = data.queryResults7;
          this.Judgementdata = data.queryResults7.map((judgement: any) => ({
            ...judgement,
            judgement_copy: `${this.image_access2}${judgement.judgement_copy}`
          }));

          this.hearingdetailonedata = data.queryResults11;
          console.log(this.hearingdetailonedata, " this.hearingdetailonedata ")
          this.trialreliefdata = data.queryResults8;


          this.firtraildata = data.queryResults5;
          this.compensation_details_2 = data.compensation_details_2;
          // console.log( this.firtraildata,"firtraildata")

          if (data.compensation_details_2 && data.compensation_details_2.length > 0) {
            this.uploadProceedingsUrl = `${this.image_access2}${data.compensation_details_2[0].upload_proceedings}`;
          }

          this.appealdata = data.queryResults9;
          this.casedetailsonedata = data.queryResults10;
          this.appealonedata = data.queryResults12;
          this.casedetailstwodata = data.queryResults13;
          this.courtdetailstwodata = data.queryResults14;
          this.hearingdetailsdata = data.queryResults15;

          this.courtDetails = data.courtDetails.caseCourtDetailOne;
          console.log(this.courtDetails, " this.courtDetails")





          this.hearingdetailtwodata = data.queryResults16;
          this.caseappealdetailstwodata = data.queryResults17;
          this.hearingdetailstwodata = data.queryResults18;
          this.hearingdetailsthreedata = data.queryResults19;









          this.policeCity = data.queryResults[0].police_city;
          this.policeZone = data.queryResults[0].police_zone;
          this.policeRange = data.queryResults[0].police_range;
          this.revenueDistrict = data.queryResults[0].revenue_district;
          this.stationName = data.queryResults[0].police_station;

          this.officerName = data.queryResults[0].officer_name;
          this.complaintReceivedType = data.queryResults[0].complaintReceivedType;
          this.complaintRegisteredBy = data.queryResults[0].complaintRegisteredBy;
          this.complaintReceiverName = data.queryResults[0].complaintReceiverName;
          this.officerDesignation = data.queryResults[0].officer_designation;
          if (this.officerDesignation.startsWith("Others")) {
            const parts = this.officerDesignation.split(" - ");
            this.showOtherDesignation = true;
            this.officerDesignation = parts[0];
            this.otherDesignationValue = parts[1] || '';
          }
          else {
            this.showOtherDesignation = false;
          }
          this.officerPhone = data.queryResults[0].officer_phone;

          this.firNumber = data.queryResults[0].fir_number + '/' + data.queryResults[0].fir_number_suffix;
          this.dateOfOccurrence = data.queryResults[0].date_of_occurrence ? this.convertToNormalDate(data.queryResults[0].date_of_occurrence) : data.queryResults[0].date_of_occurrence;
          this.date_of_occurrence_to = data.queryResults[0].date_of_occurrence_to ? this.convertToNormalDate(data.queryResults[0].date_of_occurrence_to) : data.queryResults[0].date_of_occurrence_to;
          this.timeOfOccurrence = data.queryResults[0].time_of_occurrence;
          this.time_of_occurrence_to = data.queryResults[0].time_of_occurrence_to;
          this.placeOfOccurrence = data.queryResults[0].place_of_occurrence;
          this.dateOfRegistration = data.queryResults[0].date_of_registration ? this.convertToNormalDate(data.queryResults[0].date_of_registration) : data.queryResults[0].date_of_registration;
          this.timeOfRegistration = data.queryResults[0].time_of_registration;
          this.is_case_altered = data.queryResults[0].is_case_altered;
          this.altered_date = data.queryResults[0].altered_date ? this.convertToNormalDate(data.queryResults[0].altered_date) : data.queryResults[0].altered_date;

          this.nameOfComplainant = data.queryResults[0].name_of_complainant;
          this.mobileNumberOfComplainant = data.queryResults[0].mobile_number_of_complainant;
          // this.isVictimSameAsComplainant=data.queryResults[0].is_victim_same_as_complainant;
          if (data && data.queryResults[0] && data.queryResults[0].is_victim_same_as_complainant) {
            if (data.queryResults[0].is_victim_same_as_complainant == 'true') {
              this.isVictimSameAsComplainant = 'Yes';
            } else {
              this.isVictimSameAsComplainant = 'No';
            }
          }
          this.numberOfVictims = data.queryResults[0].number_of_victim || "";


          this.judgementBeenAwardednxt = data.queryResults[0].judgement_awarded;
          this.judgementBeenAwardednxt1 = data.queryResults[0].judgement_awarded;
          this.judgementBeenAwardednxt2 = data.queryResults[0].judgement_awarded;

          // this.victimAge=data.queryResults1[0].victim_age;
          // this.victimName=data.queryResults1[0].victim_name;
          // this.victimGender=data.queryResults1[0].victim_gender;
          // this.victimMobile=data.queryResults1[0].mobile_number;
          // this.victimAddress=data.queryResults1[0].address;
          // this.victimPincode=data.queryResults1[0].victim_pincode;
          // this.victimCommunity=data.queryResults1[0].community;
          // this.victimCaste=data.queryResults1[0].caste;
          // this.victimGuardian=data.queryResults1[0].guardian_name;
          // this.isNativeDistrictSame=data.queryResults1[0].is_native_district_same;
          this.nativeDistrict = data.queryResults1[0].native_district;
          // this.victimOffence=data.queryResults1[0].offence_committed;
          // this.invokedAct=data.queryResults1[0].scst_sections;
          // this.sectionsIPC=data.queryResults1[0].sectionsIPC;
          // this.sectionsIPC = data.queryResults1[0].sectionsIPC_JSON;
          try {
            this.sectionsIPC = JSON.parse(data.queryResults1[0].sectionsIPC_JSON);
          } catch (error) {
            console.error("Error parsing sectionsIPC_JSON:", error);
          }
          console.log("section", data.queryResults1[0].sectionsIPC_JSON);

          // this.isDeceased=data.queryResults[0].is_deceased;
          this.isDeceased = data.queryResults[0].is_deceased == 1 ? 'Yes' : 'No';
          this.deceasedPersonNames = data.queryResults[0].deceased_person_names ? this.formatedata(data.queryResults[0].deceased_person_names) : data.queryResults[0].deceased_person_names;

          this.numberOfAccused = data.queryResults[0].number_of_accused;
          this.accused_remarks = data.queryResults[0].accused_remarks;
          // this.accusedAge=data.queryResults2[0].age;
          // this.accusedName=data.queryResults2[0].name;
          // this.accusedGender=data.queryResults2[0].gender;
          // this.accusedAddress=data.queryResults2[0].address;
          // this.accusedPincode=data.queryResults2[0].pincode;
          // this.accusedCommunity=data.queryResults2[0].community;
          // this.accusedCaste=data.queryResults2[0].caste;
          // this.accusedGuardian=data.queryResults2[0].guardian_name;
          // this.previousIncident=data.queryResults2[0].previous_incident;
          // if (data.queryResults2[0]?.previous_fir_number && data.queryResults2[0]?.previous_fir_number_suffix) {
          //   this.previousFIRNumber = data.queryResults2[0].previous_fir_number+'/'+ data.queryResults2[0].previous_fir_number_suffix;
          // } else {
          //   this.previousFIRNumber = ''; // Handle the case where values are missing
          // }
          // this.scstOffence=data.queryResults2[0].scst_offence;
          // this.scstFIRNumber=data.queryResults2[0].scst_fir_number+'/'+data.queryResults2[0].scst_fir_number_suffix;
          // this.antecedents=data.queryResults2[0].antecedents;
          // this.landOIssues=data.queryResults2[0].land_o_issues;
          // this.gistOfCurrentCase=data.queryResults2[0].gist_of_current_case;

          // need to check
          console.log(data.queryResults[0], "case", data.firDetails);
          this.gistOfCurrentCase = data.queryResults[0].gist_of_current_case;
          this.uploadFIRCopy = data.queryResults[0].upload_fir_copy;
          this.uploadedFIRFileNames = data.queryResults[0].upload_fir_copy;


          // this.communityCertificate=data.queryResults3[0].community_certificate;
          // this.victimName1=data.queryResults3[0].victim_name;
          // this.reliefAmountScst=data.queryResults3[0].relief_amount_scst;
          // this.reliefAmountExGratia=data.queryResults3[0].relief_amount_exgratia;
          // this.reliefAmountFirstStage=data.queryResults3[0].relief_amount_first_stage;
          // this.additionalRelief=data.queryResults[0].additional_relief;
          this.totalCompensation = data.queryResults[0].total_amount_third_stage;
          this.proceedingsFileNo = data.queryResults[0].proceedings_file_no;
          this.proceedingsDate = data.queryResults[0].proceedings_date ? this.convertToNormalDate(data.queryResults[0].proceedings_date) : data.queryResults[0].proceedings_date;
          //need to check
          this.proceedingsFile = data.queryResults[0].Commissionerate_file;
          // this.attachments=data.queryResults[0].file_path;

          // this.attachments = data.queryResults.map((item: any) => {
          //   return item.file_path.startsWith('uploads/') ? item.file_path : 'uploads/' + item.file_path;
          // });
          this.attachments = data.queryResults.map((item: any) => {
            // Check if file_path is null or undefined before calling startsWith
            if (item.file_path && typeof item.file_path === 'string') {
              return item.file_path.startsWith('uploads/') ? item.file_path : 'uploads/' + item.file_path;
            } else {
              return '';  // Return an empty string or handle it as needed
            }
          });




          this.chargeSheetFiled = data.queryResults[0].charge_sheet_filed;
          this.courtDistrict = data.queryResults[0].court_district;
          this.courtName = data.queryResults[0].court_name;
          this.caseType = data.queryResults[0].case_type;
          this.caseNumber = data.queryResults[0].case_number;
          this.chargeSheetDate = data.queryResults[0].chargesheetDate;
          console.log(data.queryResults[0].chargeSheetDate);
          // this.chargeSheetDate= data.queryResults[0].chargeSheetDate ? this.convertToNormalDate(data.queryResults[0].chargeSheetDate) : data.queryResults[0].chargeSheetDate;

          this.rcsFileNumber = data.queryResults[0].rcs_file_number;
          this.rcsFilingDate = data.queryResults[0].rcs_filing_date;
          this.mfCopy = data.queryResults[0].mf_copy_path;

          // 71  need to check
          this.victimName2 = data.queryResults[0].victim_name;
          this.reliefAmountScst1 = data.queryResults[0].relief_amount_scst_1;
          this.reliefAmountExGratia1 = data.queryResults[0].relief_amount_ex_gratia_1;
          this.totalCompensation1 = data.queryResults[0].relief_amount_second_stage;

          this.totalCompensation2 = data.queryResults[0].total_compensation_1;
          this.proceedingsFileNo1 = data.queryResults[0].proceedings_file_no;
          // this.proceedingsDate1=data.queryResults[0].proceedings_date;
          this.proceedingsDate1 = data.queryResults[0].proceedings_date ? this.convertToNormalDate(data.queryResults[0].proceedings_date) : data.queryResults[0].proceedings_date;
          this.uploadProceedings = data.queryResults[0].upload_proceedings_path;
          // need to know 79
          // this.attachments1=data.queryResults[0].victim_name;

          // this.designated=data.queryResults[0].court_name;
          // this.presentCourt=data.queryResults[0].court_district;
          // this.scNumber=data.queryResults[0].trial_case_number;
          // this.prosecutorName=data.queryResults[0].public_prosecutor;
          // this.prosecutorPhoneNumber=data.queryResults[0].prosecutor_phone;

          // this.hearingDate=data.queryResults[0].first_hearing_date;
          // this.judgementAwarded=data.queryResults[0].judgement_awarded;
          // this.nextHearingDate=data.queryResults[0].first_hearing_date;



          // 1st Acquitted








          // ned to know 87
          // this.reasonNextHearing=data.queryResults[0].name_of_designated;
          // this.judgementAwardedCase=data.queryResults[0].judgement_awarded;
          // this.natureOfJudgement=data.queryResults[0].nature_of_judgement;
          // // need to add
          // this.judgementCopy=data.queryResults[0].judgement_copy2;

          // this.victimName4=data.queryResults[0].victim_name;
          // this.reliefAmount=data.queryResults[0].relief_amount_act;
          // this.reliefAmount2=data.queryResults[0].relief_amount_government;
          // this.eligibleAmount=data.queryResults[0].relief_amount_final_stage;

          // this.totalAmount=data.queryResults[0].total_amount_third_stage;
          // this.proceedingsNo=data.queryResults[0].proceedings_file_no;
          // this.proceedingsDate2=data.queryResults[0].	proceedings_date;
          // this.officeProceedings=data.queryResults[0].Commissionerate_file;
          // // need to add
          // this.otherAttachments=data.queryResults[0].image;

          // this.opinionObtained=data.queryResults[0].specialCourtName;
          // this.caseFit=data.queryResults[0].is_this_case_fit_for_appeal1;
          // this.governmentApproved=data.queryResults[0].govt_approved_for_appeal1;
          // this.filedAppeal=data.queryResults[0].who_has_filled_appeal1;
          // this.specialCourtName=data.queryResults[0].name_of_designated1;


          // this.specialCourtName1=data.[0].specialCourtName;
          // this.districtOfCourt=data.[0].specialCourtName;
          // this.scNumber1=data.[0].specialCourtName;
          // this.prosecutorName1=data.[0].specialCourtName;
          // this.phoneNumber1=data.[0].specialCourtName;
          // this.hearingDate1=data.[0].specialCourtName;
          // this.judgementAwarded1=data.[0].specialCourtName;
          // this.hearingDate2=data.[0].specialCourtName;
          // this.nextHearingReason=data.[0].specialCourtName;
          // this.judgementAwarded2=data.[0].specialCourtName;
          // this.judgementNature=data.[0].specialCourtName;
          // this.judgementCopy1=data.[0].specialCourtName;
          // this.opinionObtained1=data.[0].specialCourtName;
          // this.caseFit1=data.[0].specialCourtName;
          // this.governmentApproved1=data.[0].specialCourtName;
          // this.filedAppeal1=data.[0].specialCourtName;


          console.log('FIR details:', data);
        }
      }
    );
  }


  viewFIRCopy(): void {
    const path = this.uploadFIRCopy;
    if (path) {
      const url = `${env.file_access}${path}`;
      window.open(url, '_blank');
    }
  }

  viewmfCopy() {
    const path = this.mfCopy;
    if (path) {
      const url = `${env.file_access}${path}`;
      window.open(url, '_blank');
    }
  }

  viewProceedingsCopy2() {
    const path = this.proceedingFileName2;
    if (path) {
      const url = `${env.file_access}${path}`;
      window.open(url, '_blank');
    }
  }

  viewProceedingFileName(): void {
    const path = this.proceedingsFile;
    if (path) {
      const url = `${env.file_access}${path}`;
      window.open(url, '_blank');
    }
  }

  view_upload_court_order(): void {
    const path = this.upload_court_order_path;
    if (path) {
      const url = `${env.file_access}${path}`;
      window.open(url, '_blank');
    }
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

  // Step navigation methods
  navigateToStep(stepIndex: number): void {
    this.currentStep = stepIndex;
  }

  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }




  openModal(data: any): void {


    this.firId = data.fir_id;

    // alert(this.firId)
    this.currentStep = 0; // Reset to the first step
    this.modalService.open(this.firDetailsModal, { size: 'xl', backdrop: 'static' });
    // this.fetchFirDetails(this.firId); // Fetch details after opening the modal
    this.loadFirDetails(this.firId);
  }


  // Load FIR list from the backend
  //   loadFirList() {
  //     this.isLoading = true;
  //     this.firService.getFirList().subscribe(
  //       (data: any[]) => {
  //         this.firList = data;

  // console.log(this.firList,"loadfirst")

  //         this.filteredList = [...this.firList];
  //         this.isLoading = false;
  //         this.cdr.detectChanges();
  //       },
  //       (error) => {
  //         this.isLoading = false;
  //         Swal.fire('Error', 'Failed to load FIR data', 'error');
  //       }
  //     );
  //   }



  // loadFirList(page: number = 1) {
  //   this.isLoading = true;
  //   this.currentPage = page;

  //   this.firService.getPaginatedFirList(page, this.pageSize,'','').subscribe(
  //     (response: any) => {
  //       this.firList = response.data;
  //       this.totalRecords = response.total;
  //       this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  //       this.filteredList = [...this.firList];
  //       this.isLoading = false;
  //       this.cdr.detectChanges();
  //     },
  //     (error : any) => {
  //       this.isLoading = false;
  //       Swal.fire('Error', 'Failed to load FIR data', 'error');
  //     }
  //   );
  // }


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

        this.districts = data.map((item: any) => item.district_division_name);
        this.policeZones = data.map((item: any) => item.police_zone_name);
        this.policeZones = [...new Set(this.policeZones)];
      },
      (error: any) => {
        console.error(error)
      }
    );
  }


  // Change page size
  changePageSize(newSize: number) {
    this.pageSize = newSize;
    this.loadFirList(1, newSize); // Reset to first page with new size
  }

  // Navigation methods
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

  // Generate visible page numbers for pagination (with ellipsis for many pages)
  getVisiblePageNumbers(): (number | string)[] {
    const visiblePages: (number | string)[] = [];
    const totalPages = this.totalPages;

    if (totalPages <= 10) {
      // If we have 10 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Always show first page
      visiblePages.push(1);

      // Calculate range of pages to show around current page
      let startPage = Math.max(2, this.currentPage - 2);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 2);

      // Add ellipsis if needed before the range
      if (startPage > 2) {
        visiblePages.push('...');
      }

      // Add the range of pages
      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }

      // Add ellipsis if needed after the range
      if (endPage < this.totalPages - 1) {
        visiblePages.push('...');
      }

      // Always show last page
      visiblePages.push(this.totalPages);
    }

    return visiblePages;
  }


  getFilterParams() {
  const params: any = {};

  const addParam = (key: string, value: any) => {
    if (value) params[key] = value;
  };

  addParam('search', this.searchText);
  addParam('district', this.selectedDistrict);
  addParam('police_zone', this.selectedPoliceZone);
  addParam('police_range', this.selectedPoliceRange);
  addParam('revenue_district', this.selectedRevenue_district);
  addParam('policeStation', this.selectedPoliceStation);
  addParam('community', this.selectedCommunity);
  addParam('caste', this.selectedCaste);
  addParam('year', this.RegistredYear);
  addParam('CreatedATstartDate', this.CreatedATstartDate);
  addParam('CreatedATendDate', this.CreatedATendDate);
  addParam('ModifiedATstartDate', this.ModifiedATstartDate);
  addParam('ModifiedATDate', this.ModifiedATDate);
  addParam('start_date', this.startDate);
  addParam('end_date', this.endDate);
  addParam('statusOfCase', this.selectedStatusOfCase);
  addParam('sectionOfLaw', this.selectedSectionOfLaw);
  addParam('court', this.selectedCourt);
  addParam('convictionType', this.selectedConvictionType);
  addParam('chargesheetDate', this.selectedChargeSheetDate);
  addParam('hasLegalObtained', this.selectedLegal);
  addParam('caseFitForAppeal', this.selectedCase);
  addParam('filedBy', this.selectedFiled);
  addParam('appealCourt', this.selectedAppeal);
 

  // Override based on user role/access_type
  if (this.Parsed_UserInfo.role === '3') {
    params.district = this.Parsed_UserInfo.police_city;
  } else if (this.Parsed_UserInfo.access_type === 'District') {
    params.revenue_district = this.Parsed_UserInfo.district;
  }

  return params;
}

  // Apply filters to the FIR list
  // applyFilters() {
  //   this.page = 1; // Reset to the first page
  //   this.cdr.detectChanges();
  //   this.filteredFirList();
  // }

  applyFilters() {
    this.loadFirList(1);
  }

  // Filtered FIR list based on search and filter criteria
  filteredFirList() {
    // const searchLower = this.searchText.toLowerCase();

    // // console.log(this.selectedDistrict,'this.selectedDistrict')
    // // console.log(this.selectedNatureOfOffence,'this.selectedNatureOfOffence')
    // // console.log(this.selectedStatusOfCase,'this.selectedStatusOfCase')
    // // console.log(this.selectedStatusOfRelief,'this.selectedStatusOfRelief')

    // return this.firList.filter((fir) => {
    //   // Apply search filter
    //   const matchesSearch =
    //     fir.fir_id.toString().includes(searchLower) ||
    //     (fir.police_city || '').toLowerCase().includes(searchLower) ||
    //     (fir.police_station || '').toLowerCase().includes(searchLower);

    //   // Apply dropdown filters
    //   const matchesDistrict = this.selectedDistrict ? fir.police_city === this.selectedDistrict : true;
    //   const matchesNatureOfOffence = this.selectedNatureOfOffence? fir.nature_of_offence === this.selectedNatureOfOffence: true;
    //   const matchesStatusOfCase = this.selectedStatusOfCase ? fir.relief_status == this.selectedStatusOfCase : true;
    //   // const matchesStatusOfRelief = this.selectedStatusOfRelief ? fir.status == this.selectedStatusOfRelief : true;
    //   const matchesStatusOfRelief = this.selectedStatusOfRelief
    //   ? (this.selectedStatusOfRelief == 0 ? fir.status >= 0 && fir.status <= 5 : fir.status == this.selectedStatusOfRelief)
    //   : true;



    //   return (
    //     matchesSearch &&
    //     matchesDistrict &&
    //     matchesNatureOfOffence &&
    //     matchesStatusOfCase &&
    //     matchesStatusOfRelief
    //   );
    // });
    return this.firList;
  }

  clearfilter() {
    this.searchText = '';
    this.selectedDistrict = '';
    this.selectedPoliceZone = '';
    this.selectedPoliceRange = '';
    this.selectedRevenue_district = '';
    this.selectedPoliceStation = '';
    this.selectedComplaintReceivedType = '';
    this.selectedNatureOfOffence = '';
    this.selectedStatusOfCase = '';
    this.selectedStatusOfRelief = '';
    this.selectedOffenceGroup = '';
    this.RegistredYear = '';
    this.startDate = '';
    this.endDate = '';
    this.CreatedATstartDate = '';
    this.CreatedATendDate = '';
    this.ModifiedATstartDate = '';
    this.ModifiedATDate = '';
    this.selectedUIPT = '';
    this.applyFilters();
  }

    SearchList() {
      this.applyFilters();
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


  // Get status text based on status value
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

    isaltered(status: number): string {
      if(status == 1){
        return 'Section Altered'
      } else {
         return ''
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

  // Get CSS class for status badge
  // Get CSS class for status badge
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


  // Paginated FIR list
  paginatedFirList() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.filteredFirList().slice(startIndex, startIndex + this.itemsPerPage);
  }

  dropRow(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.firList, event.previousIndex, event.currentIndex);
  }

  // Pagination controls
  // totalPagesArray(): number[] {
  //   return Array(Math.ceil(this.filteredFirList().length / this.itemsPerPage))
  //     .fill(0)
  //     .map((_, i) => i + 1);
  // }

  // nextPage() {
  //   if (this.hasNextPage()) this.page++;
  // }


  // previousPage() {
  //   if (this.page > 1) this.page--;
  // }

  // goToPage(pageNum: number) {
  //   this.page = pageNum;
  // }


  // hasNextPage(): boolean {
  //   return this.page * this.itemsPerPage < this.filteredFirList().length;
  // }

  hasNextPage() {
    return this.currentPage < this.totalPages;
  }

  // Delete FIR
  deleteFIR(index: number, firId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.firService.deleteFir(firId).subscribe(
          () => {
            this.firList.splice(index, 1);
            Swal.fire('Deleted!', 'The FIR has been deleted.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'Failed to delete FIR', 'error');
          }
        );
      }
    });
  }

  // // Navigate to different pages
  // viewFIR(firId: number) {
  //   this.router.navigate(['/widgets-examples/fir-view'], { queryParams: { fir_id: firId } });
  // }

  openEditPage(firId: number, step: number) {
    this.router.navigate(['/fir-edit-module'], { queryParams: { fir_id: firId, step: step + 1 } });
    console.log(step, "step");
  }

  navigateToMistakeOfFact(firId: number) {
    this.router.navigate(['/widgets-examples/mistake-of-fact'], { queryParams: { fir_id: firId } });
  }

  navigateToAlteredCase(firId: number) {
    this.router.navigate(['/widgets-examples/altered-case'], { queryParams: { fir_id: firId } });
  }

  // totalPagesArray(): number[] {
  //   const totalPages = Math.ceil(this.filteredFirList().length / this.itemsPerPage);
  //   const pageNumbers = [];

  //   // Define how many pages to show before and after the current page
  //   const delta = 2; // Number of pages to show before and after the current page

  //   // Calculate start and end page numbers
  //   let startPage = Math.max(1, this.page - delta);
  //   let endPage = Math.min(this.totalPages, this.page + delta);

  //   // Adjust start and end if there are not enough pages before or after
  //   if (this.page <= delta) {
  //     endPage = Math.min(this.totalPages, startPage + delta * 2);
  //   } else if (this.page + delta >= this.totalPages) {
  //     startPage = Math.max(1, endPage - delta * 2);
  //   }

  //   for (let i = startPage; i <= endPage; i++) {
  //     pageNumbers.push(i);
  //   }

  //   return pageNumbers;
  // }

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

  // totalPagesArray() {
  //   return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  // }


  convertToNormalDate(isoDate: string): string {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits
    const month = date.toLocaleString('en-US', { month: 'short' }); // Get short month (Jan, Feb, etc.)
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Format as DD-MMM-YYYY
  }

  // formatedata(value : any){
  //   if(value == '[]'){
  //     return ''
  //   }

  //   var data2 = JSON.parse(value)
  //   var data3 = data2.join(',')
  //   return data3;
  // }

  formatedata(value: any) {
    // Check if value is an empty array represented as a string or falsy
    if (value === '[]' || !value) {
      return '';
    }

    let data2;

    // Try parsing the JSON value safely
    try {
      data2 = JSON.parse(value);
    } catch (error) {
      console.error('Invalid JSON format:', error);
      return '';
    }

    // Check if the parsed data is actually an array
    if (Array.isArray(data2)) {
      return data2.join(',');
    } else if (typeof data2 === 'object') {
      // If it's an object, join its values
      return Object.values(data2).join(',');
    } else {
      // For any other type (string, number), convert to string and return
      return String(data2);
    }
  }


  GotoRelief() {
    this.router.navigate(['/widgets-examples/relief-list'], {
      queryParams: { shouldCallFunction: 'true', data: encodeURIComponent(JSON.stringify(this.RecivedFirData)) }
    }).catch(err => {
      console.error('Navigation Error:', err);
    });
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


}
