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
        about: "About Us",
        poa: "PoA",
        acts_rules: "Acts & Rules",
        news_events: "News & Events",
        poa_helpline: "PoA Helpline",
        faq: "FAQ's",
        officers_login: "Officer's Login",
        adwt: "Adi Dravidar and Tribal Welfare Department",
        govt: "Government of Tamil Nadu",
        sk: "Samaththuvam Kaanbom",
        sjhrw: "Social Justice and Human Rights Wing",
        tnsc: "TN State Commission for Scheduled Castes and Scheduled Tribes",
        gallery: "Gallery",
        press_releases: "Press Releases",
        logout: "Log Out",
        // footer
        adwt_description: "The Adi Dravidar and Tribal Welfare Department, established in 1988, is dedicated to enhancing the literacy levels and socio-economic conditions of Adi Dravidar and Tribal communities. Through targeted programs, the department works to uplift their standard of living.",
        quick_links: "Quick Links",
        adw_department: "ADW Department",
        tribal_welfare_department: "Tribal Welfare Department",
        national_helpline: "National Helpline Against Atrocities",
        contact_us: "Contact Us",
        address: "Directorate of Adi Dravidar Welfare, Ezhilagam Annexure building, Chepauk, Chennai, Tamil Nadu - 600 005.",
        //poa
        POA: "Prevention of Atrocities",
        poa_page: [
            "This Department is taking various steps to abolish Untouchability and to prevent activities against Adi Dravidar and Scheduled Tribes.",
            "For this, the Protection of Civil Rights Act 1955 and the Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act 1989 and rules have been enacted by the Government of India and implemented by the State Government effectively.",
            "Now, the Scheduled Castes and Scheduled Tribes (PoA) Act 1989 and the Scheduled Castes and Scheduled Tribes (PoA) rules 1995 have been amended by the Government of India after getting concurrence from the State Governments as the Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) (Amendments) Act 2015 and Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Amendment Rules 2016-2018.",
            "The above said Act and Rules have been notified in the Gazette of India (Extraordinary) and came into force on 01.01.2016, 14.04.2016, and 27.06.2018 respectively."
          ],
        // poa helpline
        poa_helpline_heading: "National Helpline Against Atrocities (NHAPOA)",
        poa_helpline_subheading: "An initiative by the Government of India under the Ministry of Social Justice and Empowerment.",
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
              "description": `A grievance can be registered by calling the Toll Free Helpline number 18002021989/ 14566.  The call centre representative will obtain the details and register a grievance on the platform. The call can be made by a victim, an informer, or an NGO. The complaint will be reviewed, and appropriate actions will be taken.`,
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
            "The Adi Dravidar and Tribal Welfare Department, established in 1988, is dedicated to enhancing the literacy levels and socio-economic conditions of Adi Dravidar and Tribal communities. Through targeted programs, the department works to uplift their standard of living.",
            "It comprises key institutions, including the Directorate of Adi Dravidar Welfare, Directorate of Tribal Welfare, Social Justice and Human Rights Police Wing, Tamil Nadu Adi Dravidar Housing and Development Corporation (TAHDCO), Tamil Nadu State Commission for Adi Dravidar and Tribal Affairs, Tribal Research Centre, Centre for Social Justice and Equity, and various welfare boards.",
            "8 Regional Offices located at Chennai, Vellore, Coimbatore, Trichy, Madurai, Tirunelveli, Dharmapuri, and Thanjavur are functioning under the administrative control of the Directorate of Collegiate Education. Each Regional office is headed by a Joint Director of Collegiate Education. These offices handle tasks related to aided colleges, such as the release of salary grants, approval of appointments, and auditing of accounts.",
            "The Directorate of Adi Dravidar Welfare focuses on community development, housing assistance, and educational programs such as scholarships, overseas study support, and hostel facilities.",
            "The Directorate of Tribal Welfare oversees Tribal Residential Schools, Eklavya Model Residential Schools, and Comprehensive Tribal Development Programs, ensuring infrastructure development, livelihood support, and the protection of tribal rights under the Forest Rights Act, 2006.",
            "The Social Justice and Human Rights Wing enforces the Protection of Civil Rights Act, 1955, and the SC/ST (Prevention of Atrocities) Act, 1989 (amended in 2015), with oversight from the State-Level Vigilance Committee, chaired by the Hon’ble Chief Minister.",
            "TAHDCO promotes economic development through subsidized projects, skill training, and construction initiatives for Adi Dravidar and Tribal communities.",
            "The Tamil Nadu State Commission for Adi Dravidars and Tribes, formed in 2021, safeguards constitutional rights and protections for these communities.",
            "The Tribal Research Centre, established in 1983-84 in the Nilgiris, studies the culture, traditions, and languages of Tamil Nadu’s 37 tribal communities and preserves tribal heritage.",
            "The Centre for Social Justice and Equity, in collaboration with the Madras School of Social Work, conducts research, offers courses, and organizes seminars on social justice issues."
        ],
        //services
        "govt_act_rules": "Government Act & Rules",
        "service_description": "Everything you need to know about our platform, all in one place.",
        // faq
        faq_land: {
            "title": "Frequently Asked Questions (FAQ)",
            "description": "Find answers to common queries about our helpline services."
          }
    };

    tamil = {
        home: "முகப்பு",
        about: "எங்களை பற்றி",
        poa: "PoA",
        acts_rules: "சட்டங்கள் & விதிகள்",
        news_events: "செய்திகள் & நிகழ்வுகள்",
        poa_helpline: "PoA உதவி எண்",
        faq: "கே&ப",
        officers_login: "அதிகாரிகள் உள்நுழைவு",
        adwt: "ஆதி திராவிடர் மற்றும் பழங்குடியினர் நலத்துறை",
        govt: "தமிழ்நாடு அரசு",
        sk: "சமத்துவம் காண்போம்",
        sjhrw: "சமூக நீதி மற்றும் மனித உரிமை பிரிவு",
        tnsc: "தமிழ்நாடு மாநில ஒதுக்கப்பட்ட இன மற்றும் பழங்குடியினர் ஆணையம்",
        gallery: "கேலரி",
        press_releases: "பத்திரிகை வெளியீடுகள்",
        logout: "வெளியேறு",
        // footer
        adwt_description: "1988ஆம் ஆண்டில் நிறுவப்பட்ட ஆதி திராவிடர் மற்றும் பழங்குடியினர் நலத்துறை, ஆதி திராவிடர் மற்றும் பழங்குடியினர் சமூகங்களின் கல்வியறிவு மட்டமும் சமூக-பொருளாதார நிலையும் மேம்பட செயல்படுகிறது. குறிக்கோளான திட்டங்கள் மூலம், இந்த துறை அவர்களின் வாழ்க்கை தரத்தை உயர்த்த பணியாற்றுகிறது.",
        quick_links: "விரைவுச் இணைப்புகள்",
        adw_department: "ஆதி திராவிடர் நலத்துறை",
        tribal_welfare_department: "பழங்குடியினர் நலத்துறை",
        national_helpline: "தீவிரமான குற்றங்களுக்கு எதிரான தேசிய உதவி எண்",
        contact_us: "எங்களை தொடர்புகொள்ள",
        address: "ஆதி திராவிடர் நலத்துறை இயக்குநரகம், எழிலகம் அனெக்சர் கட்டிடம், சேப்பாக்கம், சென்னை, தமிழ்நாடு - 600 005.",
        //poa
        POA: "அதிர்ச்சிகரமான குற்றங்களை தடுப்பது",
        poa_page: [
            "இந்த துறை தீண்டாமையை நீக்க மற்றும் ஆதி திராவிடர் மற்றும் நிர்ணயிக்கப்பட்ட பழங்குடியினர் மீதான நடவடிக்கைகளை தடுக்க பல்வேறு நடவடிக்கைகளை எடுத்து வருகிறது.",
            "இதற்காக, 1955 ஆம் ஆண்டு குடிமக்கள் உரிமை பாதுகாப்பு சட்டம் மற்றும் 1989 ஆம் ஆண்டு நிர்ணயிக்கப்பட்ட சாதிகள் மற்றும் பழங்குடியினருக்கு எதிரான குற்றங்களைத் தடுக்கும் சட்டம் ஆகியவை இந்திய அரசால் இயற்றப்பட்டு, மாநில அரசால் பயனுள்ளதாக செயல்படுத்தப்பட்டுள்ளன.",
            "இப்போது, 1989 ஆம் ஆண்டு நிர்ணயிக்கப்பட்ட சாதிகள் மற்றும் பழங்குடியினருக்கான (PoA) சட்டம் மற்றும் 1995 ஆம் ஆண்டு (PoA) விதிகள் மாநில அரசுகளின் ஒப்புதலின்பிறகு, 2015 ஆம் ஆண்டு திருத்தச் சட்டம் மற்றும் 2016-2018 திருத்த விதிகளாக மாற்றப்பட்டுள்ளன.",
            "மேலே குறிப்பிடப்பட்ட சட்டம் மற்றும் விதிகள் இந்தியாவின் அரசிதழில் (விசேஷ வெளியீடு) அறிவிக்கப்பட்டு, முறையே 01.01.2016, 14.04.2016, மற்றும் 27.06.2018 அன்று அமலுக்கு வந்துள்ளன."
          ],
        //poa helpline
        poa_helpline_heading: "அதிர்ச்சிகரமான குற்றங்களுக்கு எதிரான தேசிய உதவி மையம் (NHAPOA)",
        poa_helpline_subheading: "இந்திய அரசின் சமூக நீதி மற்றும் அதிகாரமளிப்பு அமைச்சகத்தின் கீழ் தொடங்கப்பட்ட முயற்சி.",
        poa_help: {
          "call_centre": {
            "title": "கால்சென்டர்",
            "description": "NHAPOA 24/7 கால்சென்டர் மற்றும் SC/ST (அதிர்ச்சிகரமான குற்றங்களை தடுக்கும்) சட்டத்தின் கீழ் பாதிக்கப்பட்டவர்களுக்கான புகார் தீர்வு அமைப்பை வழங்குகிறது."
          },
          "grievance_methods": {
            "portal": {
              "title": "தளவாய்ப்பு",
              "description": "ஆன்லைனில் புகார் பதிவு செய்ய",
              "link_text": "NHAPOA தளம்",
            },
            "call_centre": {
              "title": "கால்சென்டர்",
              "description": "டோல்-ஃப்ரீ உதவி எண்ணை அழைக்கவும்:",
            },
            "email": {
              "title": "மின்னஞ்சல்",
              "description": "உங்கள் புகாரை அனுப்பவும்",
            }
          }
        },
        //about
        mission: "1988ஆம் ஆண்டில் நிறுவப்பட்டு, ஆதி திராவிடர் மற்றும் பழங்குடியினர் சமூகங்களின் கல்வியறிவு மட்டமும் சமூக-பொருளாதார நிலையும் மேம்பட உழைக்கிறது.",
        about_us: [
            "1988ஆம் ஆண்டில் நிறுவப்பட்ட ஆதி திராவிடர் மற்றும் பழங்குடியினர் நலத்துறை, ஆதி திராவிடர் மற்றும் பழங்குடியினர் சமூகங்களின் கல்வியறிவு மட்டமும் சமூக-பொருளாதார நிலையும் மேம்பட செயல்படுகிறது. குறிக்கோளான திட்டங்கள் மூலம், இந்த துறை அவர்களின் வாழ்க்கை தரத்தை உயர்த்த பணியாற்றுகிறது.",
            "இத்துறை முக்கிய நிறுவனங்களை உள்ளடக்கியது, உட்பட: ஆதி திராவிடர் நலத்துறை இயக்குநரகம், பழங்குடியினர் நலத்துறை இயக்குநரகம், சமூக நீதி மற்றும் மனித உரிமை போலீஸ் பிரிவு, தமிழ்நாடு ஆதி திராவிடர் வீடமைப்பு மற்றும் மேம்பாட்டு கழகம் (TAHDCO), தமிழ்நாடு மாநில ஆதி திராவிடர் மற்றும் பழங்குடியினர் ஆணையம், பழங்குடியினர் ஆராய்ச்சி மையம், சமூக நீதி மற்றும் சமத்துவ மையம், மற்றும் பல நல வாரியங்கள்.",
            "சென்னை, வேலூர், கோயம்புத்தூர், திருச்சி, மதுரை, திருநெல்வேலி, தர்மபுரி மற்றும் தஞ்சாவூர் ஆகிய 8 பிராந்திய அலுவலகங்கள், உயர் கல்வித் துறை இயக்குநரகத்தின் நிர்வாக கட்டுப்பாட்டில் செயல்படுகின்றன. ஒவ்வொரு பிராந்திய அலுவலகத்தையும் உயர் கல்வித் துறையின் இணை இயக்குநர் தலைமையில் நடத்தப்படுகிறது. இவை, சம்பந்தப்பட்ட பகுதிகளில் உள்ள உதவி பெற்ற கல்லூரிகளின் சம்பள உதவித் தொகை வழங்கல், நியமனங்களை அங்கீகரித்தல், கணக்குகளை கண்காணித்தல் போன்ற பணிகளை மேற்கொள்கின்றன.",
            "ஆதி திராவிடர் நலத்துறை சமூக மேம்பாடு, வீடமைப்பு உதவி மற்றும் கல்விச் செயற்திட்டங்கள், உதவித்தொகைகள், வெளிநாட்டு கல்வி ஆதரவு, விடுதி வசதிகள் போன்றவற்றில் கவனம் செலுத்துகிறது.",
            "பழங்குடியினர் நலத்துறை பழங்குடியினர் விடுதிகள், ஏக்லவ்யா மாதிரி விடுதிகள், முழுமையான பழங்குடியினர் மேம்பாட்டு திட்டங்களை மேற்கொண்டு, அடிப்படை வசதிகள், வாழ்வாதார ஆதரவு, மற்றும் 2006 ஆம் ஆண்டு வன உரிமைச் சட்டத்தின் கீழ் பழங்குடியினர் உரிமைகளை பாதுகாக்க நடவடிக்கை எடுக்கிறது.",
            "சமூக நீதி மற்றும் மனித உரிமை பிரிவு, 1955 ஆம் ஆண்டு குடிமக்கள் உரிமை பாதுகாப்பு சட்டம், 1989 (2015 இல் திருத்தம் செய்யப்பட்ட) SC/ST (தீவிர குற்றங்கள் தடுப்பு) சட்டங்களை அமல்படுத்துகிறது. மாநில அளவிலான விழிப்புணர்வு குழு, மாண்புமிகு முதலமைச்சர் தலைமையில் செயல்படுகிறது.",
            "TAHDCO சிறப்பு மானிய திட்டங்கள், திறன் பயிற்சி மற்றும் கட்டுமான முயற்சிகள் மூலம் ஆதி திராவிடர் மற்றும் பழங்குடியினர் சமூகங்களின் பொருளாதார வளர்ச்சியை ஊக்குவிக்கிறது.",
            "2021 இல் உருவாக்கப்பட்ட தமிழ்நாடு மாநில ஆதி திராவிடர் மற்றும் பழங்குடியினர் ஆணையம், இந்த சமூகங்களுக்கான அரசியல் உரிமைகள் மற்றும் பாதுகாப்புகளை உறுதி செய்கிறது.",
            "1983-84 இல் நீலகிரியில் நிறுவப்பட்ட பழங்குடியினர் ஆராய்ச்சி மையம், தமிழகத்தின் 37 பழங்குடியினர் சமூகங்களின் கலாச்சாரம், பாரம்பரியம், மொழிகளை ஆய்வு செய்து, பழங்குடியினர் மரபுகளை பாதுகாக்கிறது.",
            "சமூக நீதி மற்றும் சமத்துவ மையம், மெட்ராஸ் சமூக பணியியல் பள்ளியுடன் இணைந்து, ஆராய்ச்சி செய்கிறது, படிப்புகள் வழங்குகிறது, மற்றும் சமூக நீதி தொடர்பான கருத்தரங்குகளை நடத்துகிறது."
        ],
        //services
        "govt_act_rules": "அரசு சட்டங்கள் & விதிகள்",
        "service_description": "எங்கள் தளத்தைக் குறித்த அனைத்து தகவல்களும் ஒரே இடத்தில் கிடைக்கும்.",
        // faq
        faq_land: {
            "title": "அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ)",
            "description": "எங்கள் உதவி மைய சேவைகளை பற்றிய பொதுவான கேள்விகளுக்கு பதில்களை கண்டுபிடிக்கவும்."
          }
    };

    lang = this.en;
    constructor() {

    }
    setlang(lang: string) {
        this.selLang.next(lang)
        localStorage.setItem("adwtloclang",lang);
        if (lang === 'en') {
            this.lang = this.en;
        }
        else if (lang === 'tn') {
            this.lang = this.tamil;
        }
    }
}