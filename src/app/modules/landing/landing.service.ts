import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})

export class LandingService {
  selLang = new BehaviorSubject<any>(null);
  selLang$ = this.selLang.asObservable();
  en = {
    home: "Home",
    about: "About us",
    poa: "PoA",
    acts_rules: "Acts & Rules",
    news_events: "News & Events",
    poa_helpline: "PoA Helpline",
    faq: "FAQs",
    officers_login: "Officer's Login",
    adwt: "Adi Dravidar and Tribal Welfare Department",
    govt: "Government of Tamil Nadu",
    sk: "Samaththuvam Kaanbom",
    sjhrw: "Social Justice and Human Rights Wing - TN Police",
    tnsc: "Tamil Nadu State Commission for Scheduled Castes and Scheduled Tribes",
    gallery: "Gallery",
    press_releases: "Press Releases",
    logout: "Log Out",
    // footer
    adwtw: 'ADW&TW - Adi Dravidar and Tribal Welfare Department',
    adwt_description: "The Adi Dravidar and Tribal Welfare Department, established in 1988, is dedicated to enhancing thesocio-economic conditions of Adi Dravidar and Tribal communities. Through targeted programs, the department works to uplift their standard of living.",
    quick_links: "Quick Links",
    msje: 'Ministry of Social Justice and Empowerment',
    cadw: 'Commissionerate of Adi Dravidar Welfare',
    dtw: 'Directorate of Tribal Welfare',
    tahdco: 'TAHDCO',
    nhaa: 'National Helpline Against Atrocities',
    trc: 'Tribal Research Centre',
    csje: "Centre for Social Justice and Equity",
    adw_department: "ADW Department",
    tribal_welfare_department: "Tribal Welfare Department",
    national_helpline: "National Helpline Against Atrocities",
    contact_us: "Contact Us",
    address: "Directorate of Adi Dravidar Welfare, First Floor, Ezhilagam Annexure building, Chepauk, Chennai, Tamil Nadu - 600 005.",
    tribal_research_centres: "Tribal Research Centres",
    //poa
    POA: "Prevention of Atrocities",
    poa_page: [
      "The Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989 is a landmark law enacted by the Government of India to protect the rights and dignity of Scheduled Castes (SCs) and Scheduled Tribes (STs).",
      "This Act seeks to prevent and punish caste-based discrimination, violence, and social exclusion by ensuring strict penalties for perpetrators and timely relief and rehabilitation for victims. It covers a wide range of offences—from physical violence and land alienation to denial of access to public places and social boycotts.",
      "In Tamil Nadu, the government has strengthened implementation through Special Courts, Exclusive Public Prosecutors, and district-level welfare officers, ensuring justice reaches even the most vulnerable.",
      "The Act empowers victims, holds offenders accountable, and promotes a society where equality and justice are accessible to all, regardless of caste."
    ],
    // poa helpline
    poa_helpline_heading: "National Helpline Against Atrocities (NHAPOA)",
    poa_helpline_subheading: "A dedicated helpline to report caste-based atrocities and ensure swift action and support for SC/ST victims.",
    poa_help: {
      "call_centre": {
        "title": "Call Centre",
        "description": "The National Helpline Against Atrocities (NHAPOA) is an initiative by the Government of India under the Ministry of Social Justice and Empowerment for providing 24/7 call center and a grievance redressal system for the victims of atrocities under the SC/ST (Prevention of Atrocities) Act."
      },
      "grievance_methods": {
        "portal": {
          "title": "Portal",
          "description": `A grievance can be registered through the website "https://nhapoa.gov.in/en" and entering the required details. This can be done by the victim, an informer, or an NGO. Once submitted, the complaint will be reviewed, and appropriate actions will be taken to ensure justice and resolution.`,
          "link_text": "NHAPOA Portal",
        },
        "call_centre": {
          "title": "Call Centre",
          "description": `The National PoA Helpline (14566) is a 24/7 toll-free service that empowers Scheduled Caste and Scheduled Tribe individuals to report atrocities, seek legal assistance, and track complaint progress—ensuring timely response and protection under the SC/ST Prevention of Atrocities Act.`,
        },
        "email": {
          "title": "E-mail",
          "description": `A grievance can be registered by sending a clear description of the issue, along with the contact details and any supporting documents to the email ‘helpdesk-ncrb@nic.in’.
This SOP is for the call centre representatives on setting up the call centre helpdesk and guidelines on handling calls. 
`,
        }
      }
    },
    //about
    mission: "Established in 1988, is dedicated to enhancing the literacy levels and socio-economic conditions of Adi Dravidar and Tribal communities.",
    about_us: [
      "This Department implements several welfare programmes for the socio-economic development of the Adi Dravidar and Scheduled Tribes in the State. Apart from formulating programmes so as to end the social seclusion and economic deprivation of Adi dravidars and Scheduled Tribes through educational development, the objectives of these programmes are also to speed up the process of integrating them with the national main stream.",
      "21 sectoral departments comprising of 48 HOD’s for Scheduled Castes Sub Plan and 49 HOD’s for Tribal Sub Plan earmark specific allocations for the benefit of the Adi Dravidar and Scheduled Tribes from their regular planned programmes allocations.",
      "Among various social sector programmes implemented by the Adi Dravidar and Tribal Welfare Department, education occupies the prime place as it reforms the society at greater level. Besides this, various other welfare programmes like distribution of house site pattas and construction of houses and provision of basic amenities like laying of roads, street lights, supply of drinking water, burial ground and pathway to burial ground etc. are also taken up as part of the social development programmes.",
      "Along with the Commissionerate of Adidravidar Welfare and Directorate of Tribal Welfare,",
      "- TAHDCO promotes economic development through subsidized projects, skill training, and construction initiatives for Adi Dravidar and Tribal communities.",
      "- The Tamil Nadu State Commission for Adi Dravidars and Tribes, formed in 2021, safeguards constitutional rights and protections for these communities.",
      "- The Tribal Research Centre, established in 1983-84 in the Nilgiris, studies the culture, traditions, and languages of Tamil Nadu’s 37 tribal communities and preserves tribal heritage.",
      "- The Centre for Social Justice and Equity, in collaboration with the Madras School of Social Work, conducts research, offers courses, and organizes seminars on social justice issues."
    ],
    // about-sjhr
    "sjhr_title": "Social Justice & Human Rights Wing",
    "sjhr_description": "Enforcing the Protection of Civil Rights Act, 1955, and the Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989",
    "sjhr_content": [
      "The crimes against the Scheduled Castes and the Scheduled Tribes continued despite the constitutional provisions and legal safeguards. Protection of Civil Rights Act, 1955, was the first post-independent legislation enacted for the purpose of protecting the Civil Rights of the Scheduled Castes and Scheduled Tribes.",
      "The community has been a victim of persistent injustice throughout centuries and has been looked down upon as a downtrodden community. The Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989, is also known as the POA, SC/ST Act, the Prevention of Atrocities Act, or the Atrocities Act of 1989.",
      "The Act being notified on March 31, 1995, was enacted on September 9, 1989. It is one of the legislations enacted to safeguard the rights of the Scheduled Castes and Scheduled Tribes community in India.",
      "In 1970, the Government of India, Ministry of Law and Social Welfare, brought notice to the State Government to eradicate all forms of violence and atrocities against members of Scheduled Caste and Scheduled Tribe by the dominant communities in rural areas.",
      "The State Government of Tamil Nadu formed the Social Justice and Human Rights unit as a Mobile Police Squad in certain districts for prevention of violence and atrocities against members of SC/ST. This was established via G.O. Ms. No. 34, Home Department dated 05.01.1972.",
      "The Mobile Police Squad (PCR Unit) in certain districts was tasked with preventing caste fragilities in society along with enforcing and periodically monitoring the Prevention of Civil Rights Act, 1955, in the State. The unit’s scope was expanded further with the enactment of the Prevention of Atrocities Act, 1989, and its Rules of 1995."
    ],
    "sjhr_structure": {
      "sjhr_title": "Structure and Organogram of SJHR",
      "sjhr_state_level": "The Social Justice and Human Rights unit, headed by the Additional Director General of Police, was created in 1972 in Tamil Nadu to prevent physical violence and atrocities against Scheduled Castes and Scheduled Tribes.",
      "sjhr_hq": "At the state level (Headquarters - Chennai), the Additional Director General of Police, Assistant Inspector General of Police, and the Social Justice and Human Rights division monitor the strict enforcement of the SC/ST (Prevention of Atrocities) Act, 1989, with support from a research unit comprising one Sociologist and one Economist."
    },
    "sjhr_administrative_setup": "ADMINISTRATIVE SET-UP OF SJ&HR",
    //about-tnsc
    tnsc_title: 'TN State Commission for Scheduled Castes & Scheduled Tribes',
    tnsc_description: `Tamil Nadu's official body protecting the rights of Scheduled Castes and Scheduled Tribes.`,
    tnsc_content: [
      'Constituted in 2021, this statutory body ensures protection, justice, and equitable development for Scheduled Castes and Scheduled Tribes in Tamil Nadu.',
      'A retired High Court Judge who belongs to any of the SC/ST communities as Chairperson',
      'A Vice-Chairperson who belongs to any of the SC/ST communities and has worked for the welfare of the SC/ST communities.',
      `Five members with representation from SC, ST, and women A senior IAS officer not below the rank of Additional Secretary to Government as Member-Secretary`,
      'Some of the important functions of the Commission are listed below:',
      'Investigating civil rights violations and official negligence',
      'Recommending legal and disciplinary action against defaulting officials',
      'Monitoring the impact of laws, schemes, and safeguards',
      'Creating awareness through research, outreach, and education'
    ],
    //services
    "govt_act_rules": "Relevant Act and Rules",
    "service_description": "Everything you need to know about our platform, all in one place.",
    // faq
    faq_land: {
      "title": "Frequently Asked Questions (FAQ)",
      "description": "Find answers to common queries about our helpline services."
    },
    faq_content: [
      {
        "question": "What is the SC/ST Prevention of Atrocities Act, 1989?",
        "answer": "The Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989, is a law that protects members of the Scheduled Castes (SC) and Scheduled Tribes (ST) from caste-based violence, discrimination, and atrocities. It ensures punishment for offenders and provides relief and rehabilitation for victims."
      },
      {
        "question": "Who is protected under this Act?",
        "answer": "The Act applies to all individuals belonging to the Scheduled Castes (SC) and Scheduled Tribes (ST) as per the Constitution of India."
      },
      {
        "question": "What are considered ‘atrocities’ under this Act?",
        "answer": "Atrocities include physical violence or sexual assault against SC/ST individuals, forcible eviction from land or houses, social boycotts, denial of access to common resources or places of worship, and derogatory caste-based insults, harassment, and threats."
      },
      {
        "question": "How can I file a complaint if I am a victim of caste-based violence?",
        "answer": "You can file a complaint at the nearest police station by filing an FIR, through the District Adi Dravidar Welfare Office, via the PoA Helpline (14566 or 1800 2021 989), through the Mudhalvarin Mugavari portal (CM Cell), or the e-services portal (https://eservices.tnpolice.gov.in/)."
      },
      {
        "question": "What should I do if the police refuse to register my FIR?",
        "answer": "Report immediately to the Deputy SP (SJ&HR Unit) in your district or the District Collector, who oversees atrocity prevention."
      },
      {
        "question": "Who is eligible for compensation under this Act?",
        "answer": "SC/ST victims or their dependents (if the victim has passed away) are eligible for compensation, legal aid, and rehabilitation support based on the specific atrocity."
      },
      {
        "question": "How much compensation will I receive?",
        "answer": "Compensation varies depending on the severity of the crime, as per government guidelines."
      },
      {
        "question": "What protection is available for victims and witnesses?",
        "answer": "Police protection, confidentiality during legal proceedings, relocation assistance, and protection requests through the Deputy SP (SC/ST Cell) or District Collector are available."
      },
      {
        "question": "What should I do if I am being threatened after filing a complaint?",
        "answer": "File a police complaint under Section 15A of the SC/ST Act, request police security from the District SP or Collector, and if threats continue, petition the State Human Rights Commission (SHRC), Chennai."
      },
      {
        "question": "How will my case be handled in court?",
        "answer": "Cases are tried in Special Courts or Exclusive Special Courts in Tamil Nadu, with representation by a Special Public Prosecutor (SPP)."
      },
      {
        "question": "Where are the Exclusive Special Courts in Tamil Nadu?",
        "answer": "Tamil Nadu has Exclusive Special Courts in Tirunelveli, Madurai, Thanjavur, Thiruvannamalai, Sivagangai, Salem, Theni, Virudhunagar, Dindigul, Thoothukudi, Cuddalore, Coimbatore, Ramanathapuram, Tiruchirapalli, Villupuram, Tiruppur, Namakkal, Perambalur, Kanniyakumari, and Vellore. Designated Special Courts exist in other districts."
      },
      {
        "question": "Who is the Special Public Prosecutor (SPP) under the SC/ST Act?",
        "answer": "The SPP is a government-appointed lawyer who represents victims in Special Courts under the SC/ST Prevention of Atrocities Act, 1989."
      },
      {
        "question": "What are the responsibilities of the SPP?",
        "answer": "The SPP represents SC/ST victims in court, ensures fair and speedy trials, works with police and welfare officials, and protects victims and witnesses from intimidation."
      }
    ]

  };

  tamil = {
    home: "முகப்பு",
    about: "துறையைப் பற்றி",
    poa: "சட்டம்",
    acts_rules: "சட்டம் & விதிகள்",
    news_events: "செய்திகள் & நிகழ்வுகள்",
    poa_helpline: "PoA உதவிமைய எண்",
    faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    officers_login: "அலுவலர்கள் உள்நுழைவு",
    adwt: "ஆதிதிராவிடர் மற்றும் பழங்குடியினர் நலத்துறை",
    govt: "தமிழ்நாடு அரசு",
    sk: "rkj;Jtk; fhz;Nghk;",
    sjhrw: "சமூக நீதி மற்றும் மனித உரிமைகள் பிரிவு - தமிழ்நாடு காவல்துறை",
    tnsc: "தமிழ்நாடு ஆதிதிராவிடர் மற்றும் பழங்குடியினர் மாநில ஆணையம்",
    gallery: "புகைப்படத் தொகுப்பு",
    press_releases: "பத்திரிகை வெளியீடுகள்",
    logout: "வெளியேறு",
    // footer
    adwtw: 'ஆதிதிராவிடர் மற்றும் பழங்குடியினர் நலத்துறை',
    adwt_description: "1988 ஆம் ஆண்டு நிறுவப்பட்ட ஆதி திராவிடர் மற்றும் பழங்குடியினர் நலத்துறை, ஆதி திராவிடர் மற்றும் பழங்குடியினர் சமூகங்களின் சமூக-பொருளாதார நிலையை மேம்படுத்த பல நடவடிக்கைகளை மேற்கொண்டு வருகிறது. குறிப்பிட்ட திட்டங்கள் மூலம், இச்சமூகங்களின் வாழ்க்கை தரத்தை உயர்த்த இத்துறை செயல்படுகிறது.",
    quick_links: "இணைப்புகள்",
    msje: 'சமூகநீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம்',
    cadw: 'ஆதிதிராவிடர் நலத்துறை',
    dtw: 'பழங்குடியினர் நலத்துறை',
    tahdco: 'தாட்கோ',
    nhaa: 'வன்கொடுமைகளுக்கு எதிரான தேசிய உதவி எண்',
    trc: 'பழங்குடியினர் ஆராய்ச்சி மையம்',
    csje: "சமூக நீதியும் சமத்துவமும் மையம்",
    adw_department: "ஆதி திராவிடர் நலத்துறை",
    tribal_welfare_department: "பழங்குடியினர் நலத்துறை",
    national_helpline: "தீவிரமான குற்றங்களுக்கு எதிரான தேசிய உதவி எண்",
    contact_us: "தொடர்பு கொள்ள",
    address: "ஆதிதிராவிடர் நல ஆணையரகம், முதல் தளம், எழிலகம் இணைப்பு கட்டிடம், சேப்பாக்கம், சென்னை, தமிழ்நாடு - 600005.",
    tribal_research_centres: "பழங்குடி ஆய்வு மையங்கள்",
    //poa
    POA: "அதிர்ச்சிகரமான குற்றங்களை தடுப்பது",
    poa_page: [
      "ஆதிதிராவிடர் மற்றும் பழங்குடியினர் (வன்கொடுமைகள் தடுப்புச்) சட்டம், 1989 என்பது, ஆதிதிராவிடர் (SCs) மற்றும் பழங்குடியினர் (STs) ஆகியோரின் உரிமைகள் மற்றும் கண்ணியத்தைப் பாதுகாப்பதற்காக அரசால் இயற்றப்பட்ட ஒரு முக்கிய சட்டமாகும்.",
      "இந்தச் சட்டம், குற்றவாளிகளுக்கு கடுமையான தண்டனைகள் மற்றும் பாதிக்கப்பட்டவர்களுக்கு சரியான நேரத்தில் நிவாரணம் மற்றும் மறுவாழ்வு ஆகியவற்றை உறுதி செய்வதன் மூலம் சாதி அடிப்படையிலான பாகுபாடு, வன்முறை மற்றும் சமூக விலக்கு ஆகியவற்றைத் தடுக்கவும் தண்டிக்கவும் முயல்கிறது. இது உடல் ரீதியான வன்முறை மற்றும் நிலம் அந்நியப்படுத்துதல் முதல் பொது இடங்களுக்குச் செல்ல மறுப்பு மற்றும் சமூக புறக்கணிப்புகள் வரை பல்வேறு குற்றங்களை உள்ளடக்கியது.",
      "தமிழ்நாட்டில், சிறப்பு நீதிமன்றங்கள், சிறப்பு அரசு வழக்கறிஞர்கள் மற்றும் மாவட்ட அளவிலான நல அலுவலர்கள் மூலம் செயல்படுத்தலை அரசாங்கம் வலுப்படுத்தியுள்ளது, நீதி மிகவும் பாதிக்கப்படக்கூடியவர்களுக்கு சென்றடைவதை உறுதி செய்கிறது.",
      "இந்தச் சட்டம் பாதிக்கப்பட்டவர்களுக்கு அதிகாரம் அளிக்கிறது, குற்றவாளிகளைத் தக்கமுறையில் பதியளிக்க வைக்கிறது, மேலும் சாதியைப் பொருட்படுத்தாமல் அனைவருக்கும் சமத்துவம் மற்றும் நீதி கிடைக்கும் ஒரு சமூகத்தை ஊக்குவிக்கிறது."
    ],
    //poa helpline
    poa_helpline_heading: "வன்கொடுமைகளுக்கு எதிரான உதவிமைய எண் (NHAPOA)",
    poa_helpline_subheading: "சாதி அடிப்படையிலான வன்கொடுமைகளைப் புகாரளிப்பதற்கும், SC/ST சமூகத்தைச் சேர்ந்த பாதிக்கப்பட்டவர்களுக்கு விரைவான நடவடிக்கை மற்றும் ஆதரவை உறுதி செய்வதற்கும் ஒரு பிரத்யேக உதவி எண்",
    poa_help: {
      "call_centre": {
        "title": "உதவி அழைப்பு மையம்",
        "description": "NHAPOA 24/7 கால்சென்டர் மற்றும் SC/ST (அதிர்ச்சிகரமான குற்றங்களை தடுக்கும்) சட்டத்தின் கீழ் பாதிக்கப்பட்டவர்களுக்கான புகார் தீர்வு அமைப்பை வழங்குகிறது."
      },
      "grievance_methods": {
        "portal": {
          "title": "இணையதளம்",
          "description": `"https://nhapoa.gov.in" என்ற இணையதளம் மூலம் தேவையான விவரங்களை உள்ளிட்டு குறைகளைப் பதிவு செய்யலாம். பாதிக்கப்பட்டவர், தகவல் தெரிவிப்பவர் அல்லது ஒரு அரசு சாரா நிறுவனம் கூட இதைச் செய்யலாம். சமர்ப்பிக்கப்பட்டவுடன், புகார் மதிப்பாய்வு செய்யப்பட்டு, நீதி மற்றும் தீர்வை உறுதி செய்ய தேவைப்படும் நடவடிக்கைகள் எடுக்கப்படும்.`,
          "link_text": "NHAPOA தளம்",
        },
        "call_centre": {
          "title": "உதவி அழைப்பு மையம்",
          "description": "தேசிய PoA உதவி அழைப்பு எண் (14566) என்பது 24/7 கட்டணமில்லா சேவையாகும், இது ஆதிதிராவிடர் மற்றும் பழங்குடியினர் வன்கொடுமைகளைப் புகாரளிக்கவும், சட்ட உதவி பெறவும், புகார் நடவடிக்கைகளைக் கண்காணிக்கவும் வழி வகுக்கிறது - SC/ST வன்கொடுமை தடுப்புச் சட்டத்தின் கீழ் சரியான நேரத்தில் பதில் பெறுவதையும், பாதுகாப்பையும் உறுதி செய்கிறது.",
        },
        "email": {
          "title": "மின்னஞ்சல்",
          "description": "உங்கள் புகாரை அனுப்பவும்",
        }
      }
    },
    //about
    mission: "1988-ஆம் ஆண்டு நிறுவப்பட்ட இத்துறை, ஆதிதிராவிடர் மற்றும் பழங்குடியின சமூகங்களின் வாழ்கைத்தரத்தைக், இளம்சமுதாயத்தின் கற்றல் மேம்படுத்த பணியாற்றுகிறது.",
    about_us: [
      "ஆதிதிராவிடர் மற்றும் பழங்குடியினரின் சமூக-பொருளாதார மேம்பாட்டிற்காக இந்த துறை பல நலத்திட்டங்களை செயல்படுத்துகிறது. கல்வி மேம்பாட்டினால் ஆதி திராவிடர்கள் மற்றும் பழங்குடியினர் ஒதுக்கப்படுவதைத் தடுத்து, பொருளாதார பற்றாக்குறையை முடிவுக்குக் கொண்டுவருவதற்கான திட்டங்களை வகுப்பதோடு மட்டுமல்லாமல், தேசிய அளவில் மைய நீரோட்டத்துடன் அவர்களை ஒருங்கிணைக்கும் செயல்முறையை விரைவுபடுத்துவதும் இந்தத் திட்டங்களின் நோக்கமாகும்.",
      "48 பட்டியல் சாதி துணைத் திட்ட HoD-களையும், 49 பழங்குடி துணைத் திட்டத் தலைவர்களையும் கொண்ட 21 துறைகள், ஆதிதிராவிடர் மற்றும் பட்டியல் பழங்குடியினரின் நலனுக்காக அவர்களின் திட்டமிடப்பட்ட ஒதுக்கீடுகளை வழங்குகின்றன.",
      "ஆதிதிராவிடர் மற்றும் பழங்குடியினர் நலத்துறையால் செயல்படுத்தப்படும் பல்வேறு திட்டங்களில், சமூகத்தை சீர்திருத்தம் செய்வதில் கல்வி முதன்மையான இடத்தைப் பிடித்துள்ளது. இது தவிர, வீட்டு மனைப் பட்டா வழங்குதல் மற்றும் வீடுகள் கட்டுதல், சாலைகள், தெரு விளக்குகள் அமைத்தல், குடிநீர் வழங்கல், மயானம் மற்றும் மயானத்திற்குச் செல்லும் பாதை போன்ற அடிப்படை வசதிகளை வழங்குதல் போன்ற பல்வேறு நலத்திட்டங்களும் சமூக மேம்பாட்டுத் திட்டங்களின் ஒரு பகுதியாக எடுத்துக்கொள்ளப்படுகின்றன.",
      "ஆதிதிராவிடர் நல ஆணையரகம் மற்றும் பழங்குடியினர் நல்ல இயக்குநரகம் ஆகியவற்றுடன்,",
      "- தாட்கோ, ஆதிதிராவிடர் மற்றும் பழங்குடி சமூகங்களுக்கான மானியங்களுடன் கூடிய திட்டங்கள், திறன் பயிற்சி மற்றும் கட்டுமானம் சார்ந்த முன்னெடுப்புகள் மூலம் பொருளாதார வளர்ச்சியை ஊக்குவிக்கிறது.",
      "- தமிழ்நாடு ஆதிதிராவிடர் மற்றும் பழங்குடியினர் மாநில ஆணையம், தமிழ்நாட்டில் உள்ள ஆதிதிராவிடர் மற்றும் பழங்குடியினருக்கு அரசயிலமைப்பு சட்டம் வழங்கும் உரிமைகளைப் பாதுகாத்து, நீதி மற்றும் சமமான வளர்ச்சியை உறுதி செய்கிறது.",
      "- பழங்குடி ஆராய்ச்சி மையம், நீலகிரியில் 1983-84 ஆம் ஆண்டு நிறுவப்பட்டது. தமிழ்நாட்டின் 37 பழங்குடி சமூகங்களின் கலாச்சாரம், மரபுகள் மற்றும் மொழிகளை ஆய்வு செய்து பழங்குடி பாரம்பரியத்தைப் பாதுகாக்கிறது.",
      "- சமூக நீதி மற்றும் சமத்துவ மையம், சென்னை சமூகப் பணி கல்லூரியுடன் இணைந்து, சமூக நீதி நிலையினை, இதன் மற்ற கூறுகளைக் குறித்து ஆராய்ச்சி நடத்துகிறது, பாடத்திட்டங்களை வழங்குகிறது மற்றும் கருத்தரங்குகளை ஏற்பாடு செய்கிறது."
    ],
    //about-sjhr
    "sjhr_title": "சமூக நீதி மற்றும் மனித உரிமைகள் பிரிவு",
    "sjhr_description": "குடியியல் உரிமைகள் பாதுகாப்புச் சட்டம், 1955 மற்றும் ஆதிதிராவிடர் மற்றும் பழங்குடியினர் (வன்கொடுமைகள் தடுப்பு) சட்டம், 1989 அமல்படுத்துதல்",
    "sjhr_content": [
      "அரசியலமைப்பு விதிகள் மற்றும் சட்டப் பாதுகாப்புகள் இருந்தபோதிலும், ஆதிதிராவிடர் மற்றும் பழங்குடியினருக்கு எதிரான குற்றங்கள் தொடர்ந்து வருகின்றன. குடியியல் உரிமைகள் பாதுகாப்புச் சட்டம், 1955, ஆதிதிராவிடர் மற்றும் பழங்குடியினரின் குடிமை உரிமைகளைப் பாதுகாப்பதற்காக இந்திய விடுதலைக்கு பின் இயற்றப்பட்ட முதல் சட்டமாகும்.",
      "இந்த சமூகம் பல நூற்றாண்டுகளாக தொடர்ச்சியான அநீதிக்கு ஆளாகியுள்ளது மற்றும் தாழ்த்தப்பட்ட சமூகமாக கருதப்படுகிறது. ஆதிதிராவிடர் மற்றும் பழங்குடியினர் (வன்கொடுமைகள் தடுப்பு) சட்டம், 1989, POA, SC/ST சட்டம், வன்கொடுமைகளைத் தடுக்கும் சட்டம் அல்லது 1989 ஆம் ஆண்டு வன்கொடுமைச் சட்டம் என்றும் அழைக்கப்படுகிறது.",
      "மார்ச் 31, 1995 அன்று அதிகாரப்பூர்வமாக அறிவிக்கப்பட்ட இந்தச் சட்டம், செப்டம்பர் 9, 1989 அன்று இயற்றப்பட்டது. இந்தியாவில் ஆதிதிராவிடர் மற்றும் பழங்குடியினர் சமூகத்தின் உரிமைகளைப் பாதுகாப்பதற்காக இயற்றப்பட்ட சட்டங்களில் இதுவும் ஒன்றாகும்.",
      "1970 ஆம் ஆண்டில், இந்திய அரசின் சட்டம் மற்றும் சமூக நல அமைச்சகம், கிராமப்புறங்களில் ஆதிக்க சமூகங்களால் ஆதிதிராவிடர் மற்றும் பழங்குடியினருக்கு எதிரான அனைத்து வகையான வன்முறைகளையும் வன்கொடுமையும் ஒழிக்க மாநில அரசுக்கு ஒரு அறிவிப்பை அனுப்பியது.",
      "தமிழ்நாடு மாநில அரசு, SC/ST உறுப்பினர்களுக்கு எதிரான வன்முறை மற்றும் வன்கொடுமைகளையும்  தடுப்பதற்காக சில மாவட்டங்களில் நடமாடும் காவல் படையாக(Mobile Police Squad) சமூக நீதி மற்றும் மனித உரிமைகள் பிரிவை உருவாக்கியது. இது 05.01.1972 தேதியிட்ட உள்துறைத் துறையின் G.O. திருமதி. எண். 34 மூலம் நிறுவப்பட்டது.",
      "சில மாவட்டங்களில் நடமாடும் காவல் படை (PCR பிரிவு) சமூகத்தில் சாதிய சிக்கல்களைத் தடுப்பதோடு, மாநிலத்தில் 1955 ஆம் ஆண்டு குடியியல் உரிமைகள் பாதுகாப்புச் சட்டத்தை அமல்படுத்தி அவ்வப்போது கண்காணிக்கும் பணியை மேற்கொண்டது. 1989 ஆம் ஆண்டு வன்கொடுமைத் தடுப்புச் சட்டம் மற்றும் அதன் 1995 ஆம் ஆண்டு விதிகள் இயற்றப்பட்டதன் மூலம் இந்தப் பிரிவின் நோக்கம் மேலும் விரிவுபடுத்தப்பட்டது."
    ],
    "sjhr_structure": {
      "sjhr_title": "SJHR இன் அமைப்பு மற்றும் பணிப்பிரிவுகள்",
      "sjhr_state_level": "ஆதிதிராவிடர் மற்றும் பழங்குடியினருக்கு எதிரான உடல் ரீதியான வன்முறை மற்றும் வன்கொடுமைகளைத் தடுப்பதற்காக, கூடுதல் காவல்துறை இயக்குநர் தலைமையில் சமூக நீதி மற்றும் மனித உரிமைகள் பிரிவு 1972 ஆம் ஆண்டு தமிழ்நாட்டில் உருவாக்கப்பட்டது.",
      "sjhr_hq": "மாநில அளவில் (தலைமையகம் - சென்னை), கூடுதல் காவல் துறை இயக்குநர், காவல்துறை உதவி ஆய்வாளர் மற்றும் சமூக நீதி மற்றும் மனித உரிமைகள் பிரிவு ஆகியோர் ஆதிதிராவிடர் மற்றும் பழங்குடியினர் (வன்கொடுமைகள் தடுப்பு) சட்டம், 1989-இன் அமலாக்கத்தைக் கண்காணிக்கின்றனர், இதற்கு ஒரு சமூகவியலாளர் மற்றும் ஒரு பொருளாதார நிபுணர் அடங்கிய ஆராய்ச்சிப் பிரிவின் ஆதரவும் உள்ளது."
    },
    "sjhr_administrative_setup": "SJ&HR நிர்வாக அமைப்பு படம்",
    //about-tnsc
    tnsc_title: 'தமிழ்நாடு ஆதி திராவிடர் மற்றும் பழங்குடியினர் மாநில ஆணையம்',
    tnsc_description: 'தமிழ்நாட்டின் அதிகாரப்பூர்வ அமைப்பு, ஆதி திராவிடர் மற்றும் பழங்குடியினரின் உரிமைகளைப் பாதுகாக்கிறது.',
    tnsc_content: [
      '2021 ஆம் ஆண்டு நிறுவப்பட்ட இந்த சட்டப்பூர்வ அமைப்பு, தமிழ்நாட்டில் உள்ள ஆதிதிராவிடர் மற்றும் பழங்குடியினருக்கு பாதுகாப்பு, நீதி மற்றும் சமமான வளர்ச்சியை உறுதி செய்கிறது.',
      'தலைவராக, SC/ST சமூகத்தைச் சேர்ந்த ஓய்வுபெற்ற உயர்நீதிமன்ற நீதிபதி',
      'துணைத் தலைவராக, SC/ST சமூகத்தைச் சேர்ந்த, இச்சமூகங்களின் நலனுக்காகப் பணியாற்றியவர் 5 உறுப்பினர்கள்.',
      'அரசு கூடுதல் செயலாளர் நிலைக்குக் குறையாத IAS அதிகாரி, உறுப்பினர்-செயலாளராக இருப்பார்.',
      'ஆணையத்தின் குறிப்பிடத்தக்க முக்கிய செயல்பாடுகள் பின்வருமாறு:',
      'மனித உரிமை மீறல்கள் மற்றும் அதிகாரிகளின் அலட்சியத்தை விசாரித்தல்',
      'பணியை நிறைவேற்றாத  அதிகாரிகள் மீது சட்ட மற்றும் ஒழுங்கு நடவடிக்கையை பரிந்துரைத்தல்',
      'சட்டங்கள், திட்டங்கள் மற்றும் பாதுகாப்பு நடவடிக்கைகளின் தாக்கத்தை கண்காணித்தல்',
      'ஆராய்ச்சி, மக்கள் தொடர்பு மற்றும் கல்வி மூலம் விழிப்புணர்வை ஏற்படுத்துதல்',
    ],
    //services
    "govt_act_rules": "சட்டம் மற்றும் விதிகள்",
    "service_description": "எங்கள் தளத்தைக் குறித்த அனைத்து தகவல்களும் ஒரே இடத்தில் கிடைக்கும்.",
    // faq
    faq_land: {
      "title": "அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ)",
      "description": "எங்கள் உதவி மைய சேவைகளை பற்றிய பொதுவான கேள்விகளுக்கு பதில்களை கண்டுபிடிக்கவும்."
    },
    "faq_content": [
      {
        "question": "ஆதிதிராவிடர் மற்றும் பழங்குடியினர் (வன்கொடுமை தடுப்புச்) சட்டம், 1989 என்றால் என்ன?",
        "answer": "இந்தச் சட்டம் ஆதிதிராவிடர் மற்றும் பழங்குடியினர் வகுப்பினரை சாதி அடிப்படையிலான வன்முறை, பாகுபாடு மற்றும் வன்கொடுமைகளில் இருந்து பாதுகாக்கும் சட்டமாகும். இது குற்றவாளிகளுக்கு தண்டனை வழங்குவதை உறுதி செய்யும் மற்றும் பாதிக்கப்பட்டவர்களுக்கு நிவாரணம் மற்றும் மறுவாழ்வு உதவிகளை வழங்கும்."
      },
      {
        "question": "இந்தச் சட்டத்தின் கீழ் யார் பாதுகாக்கப்படுகிறார்கள்?",
        "answer": "இந்திய அரசியலமைப்பின்படி, ஆதிதிராவிடர் (SC) மற்றும் பழங்குடியினர் (ST) பிரிவைச் சேர்ந்த நபர்களுக்கு இந்தச் சட்டம் பொருந்தும்."
      },
      {
        "question": "இந்தச் சட்டத்தின் கீழ் 'வன்கொடுமைகள்' என்று கருதப்படுவது எது?",
        "answer": "வன்கொடுமைகளில் உடல் வன்முறை, பாலியல் வன்முறை, நிலத்திலிருந்து வெளியேற்றுதல், சமூக புறக்கணிப்பு, வழிபாட்டு இடங்கள் மற்றும் பொதுவான வளங்களை அணுக தடுப்பு, மற்றும் இழிவான சாதி வசைச்சொற்கள், துன்புறுத்தல்கள், அச்சுறுத்தல்கள் அடங்கும்."
      },
      {
        "question": "சாதி அடிப்படையிலான வன்முறையால் பாதிக்கப்பட்டால் நான் எவ்வாறு புகார் அளிக்க முடியும்?",
        "answer": "அருகிலுள்ள காவல் நிலையத்தில் FIR பதிவு செய்யலாம், மாவட்ட ஆதிதிராவிடர் நல அலுவலரிடம் புகாரளிக்கலாம், அவசர அழைப்பு எண்கள் (14566 அல்லது 1800 2021 989) மூலம் தெரிவிக்கலாம், முதல்வரின் முகவரி தளத்தில் அல்லது காவல்துறை eservices தளத்தில் ஆன்லைனில் புகாரளிக்கலாம்."
      },
      {
        "question": "காவல்துறை எனது FIR பதிவு செய்ய மறுத்தால் நான் என்ன செய்ய வேண்டும்?",
        "answer": "உங்கள் மாவட்டத்தின் துணை காவல் கண்காணிப்பாளர் (SJ&HR பிரிவு) அல்லது மாவட்ட ஆட்சியரிடம் உடனடியாக புகார் அளிக்க வேண்டும்."
      },
      {
        "question": "இந்தச் சட்டத்தின் கீழ் இழப்பீடு/நிவாரணம் பெற தகுதியுடையவர் யார்?",
        "answer": "பாதிக்கப்பட்ட SC/ST நபர் அல்லது அவர் இறந்தால் அவருடைய சார்பில் உள்ள நபர்கள் இழப்பீடு, சட்ட உதவி மற்றும் மறுவாழ்வு ஆதரவுக்குத் தகுதியுடையவர்கள்."
      },
      {
        "question": "எனக்கு எவ்வளவு இழப்பீடு கிடைக்கும்?",
        "answer": "இழப்பீடு குற்றத்தின் தன்மை மற்றும் அரசு வழிகாட்டுதல்களின்படி மாறுபடும்."
      },
      {
        "question": "பாதிக்கப்பட்டவர்களுக்கும் சாட்சிகளுக்கும் என்ன பாதுகாப்பு உள்ளது?",
        "answer": "அச்சுறுத்தல்களுக்கு காவல்துறை பாதுகாப்பு, சட்ட நடவடிக்கைகளில் இரகசியத்தன்மை, பாதுகாப்பற்ற இடங்களில் இருப்பின் இடமாற்ற உதவி ஆகியவை வழங்கப்படும். பாதுகாப்பு கோரப்படலாம்."
      },
      {
        "question": "புகார் அளித்த பிறகு எனக்கு மிரட்டல் வந்தால் நான் என்ன செய்ய வேண்டும்?",
        "answer": "வன்கொடுமை தடுப்புச் சட்டத்தின் பிரிவு 15A இன் கீழ் காவல்துறையில் புகார் அளிக்கலாம், காவல்துறை பாதுகாப்பு கோரலாம், மாநில ஆணையத்தில் மனு அளிக்கலாம்."
      },
      {
        "question": "நீதிமன்றத்தில் எனது வழக்கு எவ்வாறு கையாளப்படும்?",
        "answer": "வழக்குகள் சிறப்பு நீதிமன்றங்கள் அல்லது தனியுறு சிறப்பு நீதிமன்றங்களில் விசாரணை செய்யப்படும். சிறப்பு அரசு வழக்கறிஞர் (SPP) வழக்கை நடத்துவர்."
      },
      {
        "question": "தமிழ்நாட்டில் தனியுறு சிறப்பு நீதிமன்றங்கள் எங்குள்ளன?",
        "answer": "திருநெல்வேலி, மதுரை, தஞ்சாவூர், திருவண்ணாமலை, சிவகங்கை, சேலம், தேனி, விருதுநகர், திண்டுக்கல், தூத்துக்குடி, கடலூர், கோயம்புத்தூர், ராமநாதபுரம், திருச்சி, விழுப்புரம், திருப்பூர், நாமக்கல், பெரம்பலூர், கன்னியாகுமரி மற்றும் வேலூர் ஆகிய மாவட்டங்களில் உள்ளன. மற்ற மாவட்டங்களில் நியமிக்கப்பட்ட சிறப்பு நீதிமன்றங்கள் உள்ளன."
      },
      {
        "question": "SC/ST சட்டத்தின் கீழ் சிறப்பு அரசு வழக்கறிஞர் (SPP) என்பவர் யார்?",
        "answer": "அரசால் நியமிக்கப்பட்ட ஒரு வழக்கறிஞர், அவர் சிறப்பு நீதிமன்றத்தில் SC/ST பாதிக்கப்பட்டவர்களின் சார்பில் வழக்கை நடத்துகிறார்."
      },
      {
        "question": "SPP-யின் பொறுப்புகள் என்ன?",
        "answer": "வழக்குகளை விரைவாகவும் நியாயமாகவும் முடிக்க நடவடிக்கை எடுப்பது, காவல்துறை மற்றும் நலத்துறை அலுவலர்களுடன் இணைந்து வலுவான ஆதாரங்களை சமர்ப்பிப்பது, சாட்சிகளையும் பாதிக்கப்பட்டவர்களையும் பாதுகாப்பது ஆகியவை."
      }
    ]
  };

  lang = this.en;
  constructor() {

  }
  setlang(lang: string) {
    this.selLang.next(lang)
    localStorage.setItem("adwtloclang", lang);
    if (lang === 'en') {
      this.lang = this.en;
    }
    else if (lang === 'tn') {
      this.lang = this.tamil;
    }
  }
}