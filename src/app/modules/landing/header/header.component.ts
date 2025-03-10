import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuOpen = false;

  menuItems = [
    { to: 'landing', label: 'Home', isExternal: false },
    { to: 'about', label: 'About', isExternal: false },
    { to: 'services', label: 'Downloads', isExternal: false },
    { to: 'contact', label: 'Contact', isExternal: false },
    { to: '/auth/login', label: 'Login', isExternal: false }
  ];

  constructor(private router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
