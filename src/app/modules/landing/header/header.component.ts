import { Component } from '@angular/core';
import { Router } from '@angular/router';
declare var bootstrap: any; // Import Bootstrap JavaScript
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuOpen = false;

  menuItems = [
    { to: 'landing', label: 'Home', isExternal: false },
    { to: 'about', label: 'About Us', isExternal: false },
    { to: 'poa', label: 'PoA', isExternal: false },
    { to: 'services', label: 'Acts & Rules', isExternal: false },
    { to: 'newsEvents', label: 'News & Events', isExternal: false },
    { to: 'helpline', label: 'PoA Helpline', isExternal: false },
    { to: 'faq', label: "FAQ's", isExternal: false },
    { to: '/auth/login', label: 'Login', isExternal: false }
  ];

  constructor(private router: Router) { }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isDropdownOpen: boolean = false;

  toggleDropdown(event: Event) {
    event.preventDefault(); // Prevent page navigation when clicking "News & Events"
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  closeModal() {
    const modalElement = document.getElementById('exampleModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement); 
    if (modalInstance) {
      modalInstance.hide();  // Closes the modal
    }
  }
}
