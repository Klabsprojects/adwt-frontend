import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  // quickLinks = [
  //   { name: 'Home', path: '/' },
  //   { name: 'About Us', path: '/about' },
  //   { name: 'Downloads', path: '/services' },
  //   { name: 'Contact', path: '/contact' },
  //   { name: 'Login', path: 'https://cmrf.klabsindia.com/#/login', isExternal: true }
  // ];
  quickLinks = [
    { name: 'Quick Link 1', path: '/' },
    { name: 'Quick Link 2', path: '/' },
    { name: 'Quick Link 3', path: '/' },
    { name: 'Quick Link 4', path: '/' },
    { name: 'Quick Link 5', path: '/' }
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
