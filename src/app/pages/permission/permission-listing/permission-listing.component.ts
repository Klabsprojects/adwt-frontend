import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-permission-listing',
  templateUrl: './permission-listing.component.html',
  styleUrls: ['./permission-listing.component.scss']
})
export class PermissionListingComponent implements OnInit {
  @ViewChild('permissionsModal') permissionsModal: TemplateRef<any>;
  modalRef: NgbModalRef;

  roles: any[] = [];
  filteredRoles: any[] = [];
  rolePermissions: any[] = [];
  categorizedPermissions: { [key: string]: any[] } = {};
  selectedRole: any = {};
  searchText: string = '';
  currentUser = { id: 0, role: '' };
  changedPermissions: any[] = []; // Track changed permissions

  mainCategories = ['Dashboard', 'User Management', 'Master Data', 'FIR', 'Relief Process', 'Additional Relief', 'Reports','DLVMC'];

  constructor(
    private modalService: NgbModal,
    private permissionService: PermissionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserFromSession();

    if (!this.currentUser.id || !this.currentUser.role) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadRoles();
  }

  loadUserFromSession() {
    const userDataString = sessionStorage.getItem('user_data');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.currentUser.id = userData.id;
      this.currentUser.role = userData.role;
    }
  }

  loadRoles() {
    this.permissionService.getAllRoles().subscribe(
      (data: any[]) => {
        this.roles = data;
        this.filteredRoles = data;
        this.cdr.detectChanges();
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load roles. Please try again later.', 'error');
      }
    );
  }

  filterRoles() {
    this.filteredRoles = this.roles.filter(role =>
      role.role_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  openPermissionsModal(role: any) {
    this.selectedRole = role;
    this.changedPermissions = []; // Reset changed permissions
    this.permissionService.getPermissionsByRoleId(role.role_id).subscribe(
      (permissions: any[]) => {
        this.rolePermissions = permissions;
        this.categorizePermissions();
        this.cdr.detectChanges();
        this.modalRef = this.modalService.open(this.permissionsModal, { centered: true, size: 'lg' });
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load permissions for the selected role. Please try again later.', 'error');
      }
    );
  }

  categorizePermissions() {
    this.categorizedPermissions = {
      'Dashboard': [],
      'User Management': [],
      'Master Data': [],
      'FIR': [],
      'Relief Process': [],
      'Additional Relief': [],
      'Reports': [],
      'DLVMC': [] // Added DLVMC section for VMC Members and VMC Meetings
    };

    this.rolePermissions.forEach(permission => {
      const permissionName = permission.permission_name.toLowerCase();

      // Strict matching for Reports
      if (['reports', 'ui reports', 'monetary relief reports', 'additional relief reports'].some(sub => permissionName.includes(sub))) {
        this.categorizedPermissions['Reports'].push(permission);
      }
      // Matching for Additional Relief
      else if (permissionName === 'additional relief') {
        this.categorizedPermissions['Additional Relief'].push(permission);
      }
      // Matching for User Management
      else if (['user management', 'users', 'roles', 'permissions'].some(sub => permissionName.includes(sub))) {
        this.categorizedPermissions['User Management'].push(permission);
      }
      // Matching for Master Data
      else if (['master data', 'district', 'city', 'offence', 'caste', 'police station', 'court'].some(sub => permissionName.includes(sub))) {
        this.categorizedPermissions['Master Data'].push(permission);
      }
      // Matching for FIR
      else if (['fir', 'fir list', 'add fir', 'edit fir', 'view fir', 'altered cases'].some(sub => permissionName.includes(sub))) {
        this.categorizedPermissions['FIR'].push(permission);
      }
      // Matching for DLVMC
      else if (['vmc members', 'vmc meetings', 'dlvmc'].some(sub => permissionName.includes(sub))) {
        this.categorizedPermissions['DLVMC'].push(permission);
      }
      // Matching for Relief Process
      else if (permissionName.includes('relief process')) {
        this.categorizedPermissions['Relief Process'].push(permission);
      }
      // Default: Dashboard
      else if (permissionName.includes('dashboard')) {
        this.categorizedPermissions['Dashboard'].push(permission);
      }
    });
  }




  togglePermission(permission: any) {
    permission.has_permission = permission.has_permission === 1 ? 0 : 1;

    const existingIndex = this.changedPermissions.findIndex(p => p.permission_id === permission.permission_id);

    if (existingIndex > -1) {
      this.changedPermissions[existingIndex] = permission;
    } else {
      this.changedPermissions.push(permission);
    }
  }

  savePermissions() {
    if (this.changedPermissions.length === 0) {
      Swal.fire('No Changes', 'No permissions have been modified.', 'info');
      return;
    }

    const updateRequests = this.changedPermissions.map(permission =>
      this.permissionService.updateRolePermission(this.selectedRole.role_id, permission.permission_id, permission.has_permission).toPromise()
    );

    Promise.all(updateRequests).then(
      () => {
        Swal.fire({
          title: 'Success',
          text: 'All changes have been saved!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.reloadPermissionsData();
          this.closePermissionsModal();
          this.reloadCurrentPage(); // Refresh the current page
        });
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to update some permissions. Please try again later.', 'error');
      }
    );
  }

  reloadPermissionsData() {
    this.permissionService.getPermissionsByRoleId(this.selectedRole.role_id).subscribe(
      (permissions: any[]) => {
        this.rolePermissions = permissions;
        this.categorizePermissions();
        this.changedPermissions = [];
        this.cdr.detectChanges();
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to reload permissions. Please try again later.', 'error');
      }
    );
  }

  reloadCurrentPage() {
    // Refresh the current page by reloading the route
    this.router.navigateByUrl(this.router.url).then(() => {
      window.location.reload(); // This forces a complete reload of the page
    });
  }

  closePermissionsModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
