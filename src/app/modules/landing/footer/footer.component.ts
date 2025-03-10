import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Downloads', path: '/services' },
    { name: 'Contact', path: '/contact' },
    { name: 'Login', path: 'https://cmrf.klabsindia.com/#/login', isExternal: true }
  ];

  contactInfo = [
    { icon: 'fas fa-map-marker-alt', info: 'DIRECTORATE OF COLLEGIATE EDUCATION, Chennai, Tamil Nadu', link: 'https://maps.google.com/?q=DIRECTORATE+OF+COLLEGIATE+EDUCATION+Chennai' },
    { icon: 'fas fa-phone', info: '044-24343106' },
    { icon: 'fas fa-phone', info: '044-24343109' },
    { icon: 'fas fa-envelope', info: 'cmrfdce2023@gmail.com', link: 'mailto:cmrfdce2023@gmail.com' }
  ];

  socialLinks = [
    { icon: 'fab fa-facebook-f', link: '#',name:'' },
    { icon: 'fab fa-twitter', link: '#',name:'' },
    { icon: 'fab fa-instagram', link: '#',name:'' },
    { icon: 'fab fa-linkedin-in', link: '#',name:'' }
  ];
}
