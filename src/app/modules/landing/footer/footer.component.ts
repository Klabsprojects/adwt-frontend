import { Component } from '@angular/core';
import { LandingService } from '../landing.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
constructor(public lang:LandingService){}
  currentYear: number = new Date().getFullYear();

  // quickLinks = [
  //   { name: 'Home', path: '/' },
  //   { name: 'About Us', path: '/about' },
  //   { name: 'Downloads', path: '/services' },
  //   { name: 'Contact', path: '/contact' },
  //   { name: 'Login', path: 'https://cmrf.klabsindia.com/#/login', isExternal: true }
  // ];
  quickLinks = [
    { name: 'ADW Department', path: 'https://www.tnadw.in/ ' },
    { name: 'Tribal Welfare Department', path: 'https://www.tntribalwelfare.tn.gov.in/' },
    { name: 'National Helpline Against Atrocities', path: 'https://nhapoa.gov.in/en' },
    { name: 'Tribal Research Centres', path: 'https://tntrc.org.in/ ' },
    { name: 'TAHDCO', path: 'https://tahdco.com/' },
    { name: 'CSJE', path: 'https://csje.mssw.in/' },
  ];
  contactInfo = [
    { icon: 'fas fa-map-marker-alt', info: 'Directorate of Adi Dravidar Welfare Ezhilagam Annexure building, Cheapauk, Chennai,Tamil Nadu - 600 005.', link: 'https://maps.google.com/?q=DIRECTORATE+OF+COLLEGIATE+EDUCATION+Chennai' },
    { icon: 'fas fa-phone', info: '044 -28589855' },
    // { icon: 'fas fa-phone', info: '044-24343109' },
    { icon: 'fas fa-envelope', info: 'adw.director@gmail.com', link: 'mailto:adw.director@gmail.com' }
  ];

  socialLinks = [
    { icon: 'fab fa-facebook-f', link: '#',name:'' },
    { icon: 'fab fa-twitter', link: '#',name:'' },
    { icon: 'fab fa-instagram', link: '#',name:'' },
    { icon: 'fab fa-linkedin-in', link: '#',name:'' }
  ];
}
