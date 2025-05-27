
import Swal from 'sweetalert2';
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { PoliceDivisionService } from 'src/app/services/police-division.service';
@Component({
  selector: 'app-fir-list',
  templateUrl: './fir-list.component.html',
})

export class FirListComponent implements OnInit {

  firId: number;
  image_access = environment.image_access;
  image_access2 = environment.image_access2;

  policeCity: string = '';
  policeZone: string = '';
  policeRange: string = '';
  revenueDistrict: string = '';
  stationName: string = '';

  officerName: string = '';
  complaintReceivedType:string='';
  complaintRegisteredBy:string='';
  complaintReceiverName:string='';
  officerDesignation: string = '';
  showOtherDesignation = false;
  otherDesignationValue:string='';
  officerPhone: string = '';

  firNumber: string = '';
  dateOfOccurrence: string = '';
  date_of_occurrence_to:string='';
  timeOfOccurrence: string = '';
  time_of_occurrence_to:string='';
  placeOfOccurrence: string = '';
  is_case_altered : string = '';
  dateOfRegistration: string = '';
  timeOfRegistration: string = '';

  nameOfComplainant: string = '';
  mobileNumberOfComplainant: string = '';
  isVictimSameAsComplainant: string = '';
  numberOfVictims: string = '';

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

  reliefsdata: any[] = [];
  communityCertificate: string = ''; // Default: Yes
  victimName1: string = ''; // Default: Jane Doe
  reliefAmountScst: string = ''; // Default: ₹50,000
  reliefAmountExGratia: string = ''; // Default: ₹30,000
  reliefAmountFirstStage: string = ''; // Default: ₹20,000
  additionalRelief: string = ''; // Default: Text

  totalCompensation: string = ''; // Default: ₹100,000
  proceedingsFileNo: string = ''; // Default: Proceedings file number
  proceedingsDate: string = ''; // Default: YYYY-MM-DD
  proceedingsFile: string = ''; // Default: Text
  attachments: string = ''; // Default: Text

  chargeSheetFiled: string = ''; // Default: Yes
  courtDistrict: string = ''; // Default: Court District
  courtName: string = ''; // Default: Court Range
  caseType: string = ''; // Default: Case Type
  caseNumber: string = ''; // Default: Case Number Report
  chargeSheetDate:string='';
  rcsFileNumber: string = ''; // Default: RCS File Number
  rcsFilingDate: string = ''; // Default: YYYY-MM-DD
  mfCopy: string = ''; // Default: Upload MF Copy

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


  hearingdetailsdata: any[] =[];
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
  appealdata: any[]=[];
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
  appealonedata: any[]=[];
  opinionObtained_2nd_Accquitted: string = ''; // Default: Has legal opinion obtained
  caseFit_2nd_Accquitted: string = ''; // Default: Is the case fit for appeal
  governmentApproved_2nd_Accquitted: string = ''; // Default: Has the government approved for appeal
  filedAppeal_2nd_Accquitted: string = ''; // Default: Who has filed the appeal
  specialCourtName_2nd_Accquitted: string = ''; // Default: Name of the Designated/Special court

  // Case Trial and Court Details
  casedetailstwodata: any [] = [];
  districtOfCourt_2nd_Accquitted: string = ''; // Default: District in which court is present
  scNumber1_2nd_Accquitted: string = ''; // Default: Case Number Report (CNR) / Special SC number
  prosecutorName1_2nd_Accquitted: string = ''; // Default: Special Public Prosecutor's Name
  phoneNumber1_2nd_Accquitted: string = ''; // Default: Special Public Prosecutor's Phone Number

  // Select Hearing Date
  courtdetailstwodata: any [] = [];
  hearingDate1_2nd_Accquitted: string = ''; // Default: First Hearing Date
  judgementAwarded1_2nd_Accquitted: string = ''; // Default: Judgement awarded status

  // Judgement Details
  hearingdetailtwodata: any [] = [];
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
  caseappealdetailstwodata: any []=[];
  opinionObtained_3rdAccquitted: string = ''; // Default: Has legal opinion obtained
  caseFit_3rdAccquitted: string = ''; // Default: Is the case fit for appeal
  governmentApproved_3rdAccquitted: string = ''; // Default: Has the government approved for appeal
  filedAppeal_3rdAccquitted: string = ''; // Default: Who has filed the appeal

  filteredList: any[] = [];




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



  steps = ['Location Details', 'Offence Information', 'Victim Information', 'Accused Info', 'MRF Info','ChargeSheet Stage','Trail Stage'];
  currentStep = 0;
  step :any;
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
  RegistredYear: string = '';
  selectedPoliceZone: string = '';
  selectedPoliceRange: string = '';
  selectedRevenue_district: string = '';
  selectedComplaintReceivedType: string = '';
  startDate: string = '';
  endDate: string = '';
  selectedUIPT: string = '';




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

  districts : any;
  policeZones : any;
  policeRanges : any;
  revenueDistricts : any;

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

  offenceGroupsList : string[] = [
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
  statusesOfRelief: any[] = [{value : 0 , label : 'FIR Stage'}, {value : 6 , label :'ChargeSheet Stage'} , {value : 7 , label : 'Trial Stage'}];

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
    { label: 'Date of Registration', field: 'date_of_registration', sortable: true, visible: false },
    { label: 'Time of Registration', field: 'time_of_registration', sortable: true, visible: false },

    { label: 'Date of Occurrence', field: 'date_of_occurrence', sortable: true, visible: false },
    { label: 'Time of Occurrence', field: 'time_of_occurrence', sortable: true, visible: false },
    { label: 'Date of Occurrence To', field: 'date_of_occurrence_to', sortable: true, visible: false },
    { label: 'Time of Occurrence To', field: 'time_of_occurrence_to', sortable: true, visible: false },
    { label: 'Name of Nomplainant', field: 'name_of_complainant', sortable: true, visible: false },

    { label: 'Created By', field: 'created_by', sortable: true, visible: true },
    { label: 'Created At', field: 'created_at', sortable: true, visible: true },
    { label: 'Data Entry Status', field: 'status', sortable: false, visible: true },
    { label: 'Case Status', field: 'Case_Status', sortable: false, visible: true },
    { label: 'Actions', field: 'actions', sortable: false, visible: true },
  ];

  years: number[] = [];

  selectedColumns: any[] = [...this.displayedColumns];

  // Sorting variables
  currentSortField: string = '';
  isAscending: boolean = true;
  RecivedFirData : any;


  pageSizeOptions: number[] = [5, 10, 20, 50]; // Available page size options
  pageSize: number = 10; // Default records per page
  totalRecords: number = 0; // Total number of records
  currentPage: number = 1; // Current page
  totalPages: number = 0;
  Parsed_UserInfo : any;


  constructor(
    private firService: FirListTestService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private policeDivisionService :PoliceDivisionService
  ) {}

  ngOnInit(): void {
    const UserInfo : any = sessionStorage.getItem('user_data');
    this.Parsed_UserInfo = JSON.parse(UserInfo)
    this.loadFirList(1, this.pageSize);
    this.updateSelectedColumns();
    this.loadPoliceDivision();
    this.loadPoliceRanges();
    this.loadRevenue_district();
    this.generateYearOptions();

    setTimeout(() => {
      this.route.queryParams.subscribe(params => {
        if (params['shouldCallFunction'] == 'true') {
          this.RecivedFirData = decodeURIComponent(params['data']);
          if(this.RecivedFirData){
            let data = {
              fir_id : this.RecivedFirData.replace(/"/g, '')
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
  // funtions
  fetchFirDetails(firId:any): void {


    console.log(firId)
    this.firService.getFirView(firId).subscribe(
      (data) => {
        console.log(data);
        if (!data || data.length === 0) {
          console.warn('No FIR found for the given ID');
          alert('No FIR found for the given ID');
        } else {
          console.log(data.queryResults);
          this.victimsdata =data.queryResults1;
          this.victimsdata = this.victimsdata.map((victim) => ({
            ...victim, // Keep all existing properties
            scst_sections: victim.scst_sections ? this.formatedata(victim.scst_sections) : victim.scst_sections ,
            offence_committed: victim.offence_committed ? this.formatedata(victim.offence_committed) : victim.offence_committed
          }));
          this.accusedsdata =data.queryResults2;
          this.reliefsdata =data.queryResults3;




          // step 7
          this.casedetailsdata =data.queryResults4;
          this.hearingdetaildata =data.queryResults6;

console.log(  this.hearingdetaildata,"  this.hearingdetaildata")

          this.Judgementdata =data.queryResults7;
          this.Judgementdata = data.queryResults7.map((judgement: any) => ({
            ...judgement,
            judgement_copy: `${this.image_access2}${judgement.judgement_copy}`
          }));
          
          this.hearingdetailonedata =data.queryResults11;
console.log( this.hearingdetailonedata ," this.hearingdetailonedata ")
          this.trialreliefdata =data.queryResults8;


          this.firtraildata =data.queryResults5;
          this.compensation_details_2 =data.compensation_details_2;
          // console.log( this.firtraildata,"firtraildata")

          if (data.compensation_details_2 && data.compensation_details_2.length > 0) {
            this.uploadProceedingsUrl = `${this.image_access2}${data.compensation_details_2[0].upload_proceedings}`;
          }

          this.appealdata =data.queryResults9;
          this.casedetailsonedata =data.queryResults10;
          this.appealonedata =data.queryResults12;
          this.casedetailstwodata =data.queryResults13;
          this.courtdetailstwodata =data.queryResults14;
          this.hearingdetailsdata =data.queryResults15;
      
            this.courtDetails =  data.courtDetails.caseCourtDetailOne;
            console.log( this.courtDetails," this.courtDetails")
           
        
          
      

          this.hearingdetailtwodata =data.queryResults16;
          this.caseappealdetailstwodata =data.queryResults17;
          this.hearingdetailstwodata =data.queryResults18;
          this.hearingdetailsthreedata =data.queryResults19;









          this.policeCity = data.queryResults[0].police_city;
          this.policeZone = data.queryResults[0].police_zone;
          this.policeRange = data.queryResults[0].police_range;
          this.revenueDistrict = data.queryResults[0].revenue_district;
          this.stationName = data.queryResults[0].police_station;

          this.officerName = data.queryResults[0].officer_name;
          this.complaintReceivedType = data.queryResults[0].complaintReceivedType;
          this.complaintRegisteredBy = data.queryResults[0].complaintRegisteredBy;
          this.complaintReceiverName = data.queryResults[0].complaintReceiverName;
          this.officerDesignation=data.queryResults[0].officer_designation;
          if (this.officerDesignation.startsWith("Others")) {
            const parts = this.officerDesignation.split(" - ");
            this.showOtherDesignation = true;
            this.officerDesignation = parts[0];
            this.otherDesignationValue = parts[1] || ''; 
          }
          else{
            this.showOtherDesignation = false;
          }
          this.officerPhone=data.queryResults[0].officer_phone;

          this.firNumber=data.queryResults[0].fir_number+'/'+data.queryResults[0].fir_number_suffix;
          this.dateOfOccurrence= data.queryResults[0].date_of_occurrence ? this.convertToNormalDate(data.queryResults[0].date_of_occurrence) : data.queryResults[0].date_of_occurrence;
          this.date_of_occurrence_to= data.queryResults[0].date_of_occurrence_to ? this.convertToNormalDate(data.queryResults[0].date_of_occurrence_to) : data.queryResults[0].date_of_occurrence_to;
          this.timeOfOccurrence=data.queryResults[0].time_of_occurrence;
          this.time_of_occurrence_to=data.queryResults[0].time_of_occurrence_to;
          this.placeOfOccurrence=data.queryResults[0].place_of_occurrence;
          this.dateOfRegistration= data.queryResults[0].date_of_registration ? this.convertToNormalDate(data.queryResults[0].date_of_registration) : data.queryResults[0].date_of_registration;
          this.timeOfRegistration=data.queryResults[0].time_of_registration;
          this.timeOfRegistration=data.queryResults[0].is_case_altered;

          this.nameOfComplainant=data.queryResults[0].name_of_complainant;
          this.mobileNumberOfComplainant=data.queryResults[0].mobile_number_of_complainant;
            // this.isVictimSameAsComplainant=data.queryResults[0].is_victim_same_as_complainant;
            if(data && data.queryResults[0] && data.queryResults[0].is_victim_same_as_complainant){
            if(data.queryResults[0].is_victim_same_as_complainant == 'true'){
              this.isVictimSameAsComplainant= 'Yes';
            } else {
              this.isVictimSameAsComplainant= 'No';
            }
          }
          this.numberOfVictims=data.queryResults[0].number_of_victim;


          this.judgementBeenAwardednxt=data.queryResults[0].judgement_awarded;
          this.judgementBeenAwardednxt1=data.queryResults[0].judgement_awarded;
          this.judgementBeenAwardednxt2=data.queryResults[0].judgement_awarded;

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
          this.nativeDistrict=data.queryResults1[0].native_district;
          // this.victimOffence=data.queryResults1[0].offence_committed;
          // this.invokedAct=data.queryResults1[0].scst_sections;
          // this.sectionsIPC=data.queryResults1[0].sectionsIPC;
          // this.sectionsIPC = data.queryResults1[0].sectionsIPC_JSON;
          try {
            this.sectionsIPC = JSON.parse(data.queryResults1[0].sectionsIPC_JSON);
          } catch (error) {
            console.error("Error parsing sectionsIPC_JSON:", error);
          }
          console.log("section",data.queryResults1[0].sectionsIPC_JSON);
          
          this.isDeceased=data.queryResults[0].is_deceased;
          this.deceasedPersonNames= data.queryResults[0].deceased_person_names ? this.formatedata(data.queryResults[0].deceased_person_names) : data.queryResults[0].deceased_person_names;

          this.numberOfAccused=data.queryResults[0].number_of_accused;
console.log( this.numberOfAccused,"number")
console.log( data.queryResults[0],"vire ")
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
          this.uploadFIRCopy=data.queryResults[0].upload_fir_copy;


          // this.communityCertificate=data.queryResults3[0].community_certificate;
          // this.victimName1=data.queryResults3[0].victim_name;
          // this.reliefAmountScst=data.queryResults3[0].relief_amount_scst;
          // this.reliefAmountExGratia=data.queryResults3[0].relief_amount_exgratia;
          // this.reliefAmountFirstStage=data.queryResults3[0].relief_amount_first_stage;
          // this.additionalRelief=data.queryResults[0].additional_relief;
          this.totalCompensation=data.queryResults[0].total_amount_third_stage;
          this.proceedingsFileNo=data.queryResults[0].proceedings_file_no;
          this.proceedingsDate= data.queryResults[0].proceedings_date ? this.convertToNormalDate(data.queryResults[0].proceedings_date) : data.queryResults[0].proceedings_date;
          //need to check
          this.proceedingsFile=data.queryResults[0].Commissionerate_file;
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
          



          this.chargeSheetFiled=data.queryResults[0].charge_sheet_filed;
          this.courtDistrict=data.queryResults[0].court_district;
          this.courtName=data.queryResults[0].court_name;
          this.caseType=data.queryResults[0].case_type;
          this.caseNumber=data.queryResults[0].case_number;
          this.chargeSheetDate=data.queryResults[0].chargesheetDate;
          console.log(data.queryResults[0].chargeSheetDate);
          // this.chargeSheetDate= data.queryResults[0].chargeSheetDate ? this.convertToNormalDate(data.queryResults[0].chargeSheetDate) : data.queryResults[0].chargeSheetDate;

          this.rcsFileNumber=data.queryResults[0].rcs_file_number;
          this.rcsFilingDate=data.queryResults[0].rcs_filing_date;
          this.mfCopy=data.queryResults[0].mf_copy_path;

          // 71  need to check
          this.victimName2=data.queryResults[0].victim_name;
          this.reliefAmountScst1=data.queryResults[0].relief_amount_scst_1;
          this.reliefAmountExGratia1=data.queryResults[0].relief_amount_ex_gratia_1;
          this.totalCompensation1=data.queryResults[0].relief_amount_second_stage;

          this.totalCompensation2=data.queryResults[0].total_compensation_1;
          this.proceedingsFileNo1=data.queryResults[0].proceedings_file_no;
          // this.proceedingsDate1=data.queryResults[0].proceedings_date;
          this.proceedingsDate1= data.queryResults[0].proceedings_date ? this.convertToNormalDate(data.queryResults[0].proceedings_date) : data.queryResults[0].proceedings_date;
          this.uploadProceedings=data.queryResults[0].upload_proceedings_path;
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


    this.firId = data.fir_id; // Save the FIR ID

    console.log(this.firId)

    // alert(this.firId)
    this.currentStep = 0; // Reset to the first step
    this.modalService.open(this.firDetailsModal, { size: 'xl', backdrop: 'static' });
    this.fetchFirDetails(this.firId); // Fetch details after opening the modal
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
  
  this.firService.getPaginatedFirList(page, pageSize, this.getFilterParams()).subscribe(
    (response: any) => {
      this.firList = response.data;
      this.totalRecords = response.total;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      this.filteredList = [...this.firList];
      // this.policeRanges = response.data.map((item: any) => item.police_range);
      // this.policeRanges = [...new Set(this.policeRanges)];
      // this.revenueDistricts = response.data.map((item: any) => item.revenue_district_name);
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    (error) => {
      this.isLoading = false;
      Swal.fire('Error', 'Failed to load FIR data', 'error');
    }
  );
}

loadPoliceRanges(){
  this.firService.getPoliceRanges().subscribe(
    (response: any) => {
      this.policeRanges = response;
    },
    (error : any) => {
      console.error('Error', 'Failed to load FIR data', 'error',error);
    }
  );
}


loadRevenue_district(){
  this.firService.getRevenue_district().subscribe(
    (response: any) => {
      this.revenueDistricts = response;
    },
    (error : any) => {
      console.error('Error', 'Failed to load FIR data', 'error',error);
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
  
  if (this.searchText) {
    params.search = this.searchText;
  }
  
  if (this.selectedDistrict) {
    params.district = this.selectedDistrict;
  }

  if (this.selectedPoliceZone) {
    params.police_zone = this.selectedPoliceZone;
  }

  if (this.selectedPoliceRange) {
    params.police_range = this.selectedPoliceRange;
  }

  if (this.selectedRevenue_district) {
    params.revenue_district = this.selectedRevenue_district;
  }

  if (this.selectedComplaintReceivedType) {
    params.complaintReceivedType = this.selectedComplaintReceivedType;
  }

  if (this.startDate) {
    params.start_date = this.startDate;
  }

  if (this.endDate) {
    params.end_date = this.endDate;
  }

  if (this.selectedUIPT) {
    params.UIPT = this.selectedUIPT;
  }
  
  if (this.selectedStatusOfRelief) {
    params.status = this.selectedStatusOfRelief;
  }

  if (this.selectedOffenceGroup) {
    params.Offence_group = this.selectedOffenceGroup;
  }

  if (this.RegistredYear) {
    params.year = this.RegistredYear;
  }

  if(this.Parsed_UserInfo.role == '3'){
    params.district = this.Parsed_UserInfo.police_city
  } 
  else {
    if(this.Parsed_UserInfo.access_type == 'District'){
    params.revenue_district = this.Parsed_UserInfo.district;
    } 
  }


  
  // Add other filters as needed
  
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

  clearfilter(){
    this.searchText = '';
    this.selectedDistrict = '';
    this.selectedPoliceZone = '';
    this.selectedPoliceRange = '';
    this.selectedRevenue_district = '';
    this.selectedComplaintReceivedType = '';
    this.selectedNatureOfOffence = '';
    this.selectedStatusOfCase = '';
    this.selectedStatusOfRelief = '';
    this.selectedOffenceGroup = '';
    this.RegistredYear = '';
    this.startDate = '';
    this.endDate = '';
    this.selectedUIPT = '';
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
  getStatusText(status: number): string {
    const statusTextMap = {
      0: 'FIR Draft',
      1: 'Pending | FIR Stage | Step 1 Completed',
      2: 'Pending | FIR Stage | Step 2 Completed',
      3: 'Pending | FIR Stage | Step 3 Completed',
      4: 'Completed | FIR Stage',
      5: 'Completed | FIR Stage',
      6: 'Charge Sheet Completed',
      7: 'Trial Stage Completed',
      8: 'This Case is Altered Case',
      9: 'Mistake Of Fact',
    } as { [key: number]: string };

    return statusTextMap[status] || 'Unknown';
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
    4: 'badge bg-success text-white',
    5: 'badge bg-success text-white',
    6: 'badge bg-success text-white',
    7: 'badge bg-success text-white',
    8: 'badge bg-danger text-white',
    9: 'badge bg-danger text-white',
    10: 'badge bg-danger text-white', // Add this entry for status 12
  } as { [key: number]: string };

  return badgeClassMap[status] || 'badge bg-secondary text-white';
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

  openEditPage(firId: number,step:number) {
    this.router.navigate(['/fir-edit-module'], { queryParams: { fir_id: firId,step:step+1 } });
    console.log(step,"step");
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
  

  GotoRelief(){
    this.router.navigate(['/widgets-examples/relief-list'], {
      queryParams: { shouldCallFunction: 'true', data: encodeURIComponent(JSON.stringify(this.RecivedFirData)) }
    }).catch(err => {
      console.error('Navigation Error:', err);
    });
  }

}
