import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth';
import { LandingService } from '../landing.service';
declare var bootstrap: any; // Import Bootstrap JavaScript
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
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
  public is_user:boolean=false;
  selLang:any="en";
  phoneNumbers: string[] = ['+91 9876543210', '+91 0123456789'];
  currentPhone: string = this.phoneNumbers[0];


  constructor(private router: Router,private auth:AuthService,public lang:LandingService,private cdRef: ChangeDetectorRef) { }
  ngOnInit(): void {
    setInterval(() => {
      this.currentPhone = this.currentPhone === this.phoneNumbers[0] 
        ? this.phoneNumbers[1] 
        : this.phoneNumbers[0];
  
      this.cdRef.detectChanges(); // Force UI update
    }, 1000);
    this.is_user = sessionStorage.getItem('user_data')?true:false;
    const locLang = localStorage.getItem('adwtloclang');
    if(locLang){
      this.selLang = locLang;
      this.lang.setlang(locLang);
    }
  }
  changelang(lang:string){
    this.selLang = lang;
    this.lang.setlang(lang);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isDropdownOpen: boolean = false;
  isDropdownOpenAbout: boolean = false;

  toggleDropdown(event: Event) {
    event.preventDefault(); // Prevent page navigation when clicking "News & Events"
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleDropdownAbout(event: Event) {
    event.preventDefault(); // Prevent page navigation when clicking "News & Events"
    this.isDropdownOpenAbout = !this.isDropdownOpenAbout;
  }
  closeModal() {
    const modalElement = document.getElementById('exampleModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement); 
    if (modalInstance) {
      modalInstance.hide();  // Closes the modal
    }
  }
  logout(){
    this.auth.logout();
    window.location.reload();
  }
}
