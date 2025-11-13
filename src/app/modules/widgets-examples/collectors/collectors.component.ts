import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { RevenueDistrictService } from 'src/app/services/revenueDistrict.service';
import { CollectorService } from 'src/app/services/collector.service';

@Component({
  selector: 'app-collectors',
  templateUrl: './collectors.component.html',
  styleUrl: './collectors.component.scss'
})
export class CollectorsComponent implements OnInit{
@ViewChild('formModal') formModal: any;
  modalRef: NgbModalRef | undefined;
  searchText: string = '';
  districtModel: any = { revenue_district_name: '', status: 1 }; // District Model
  editIndex: number | null = null; // Track which row is being edited
  revenueDistricts: any[] = []; // List of revenue districts
  districts: any[] = []; // List of districts for the dropdown
  page: number = 1;
  itemsPerPage: number = 10;
  totalRecords: number = 0;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private revenueDistrictService: RevenueDistrictService,
    private collectorService:CollectorService
  ) {}

  ngOnInit(): void {
    // this.loadRevenueDistricts();
    this.loadCollectorData();
    // this.loadDistricts();
  }

  loadCollectorData(){
    this.collectorService.getAllCollector().subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        Swal.fire('Error', 'Failed to load revenue districts. Please try again later.', 'error');
      }
    );
  }

  loadRevenueDistricts() {
    this.revenueDistrictService.getAllRevenueDistricts().subscribe(
      (data) => {
        this.revenueDistricts = data;
        this.totalRecords = this.revenueDistricts.length;
        this.refreshTable();
      },
      (error) => {
        Swal.fire('Error', 'Failed to load revenue districts. Please try again later.', 'error');
      }
    );
  }

  loadDistricts() {
    this.revenueDistrictService.getAllDistricts().subscribe(
      (data) => {
        this.districts = data;
        this.totalRecords = this.districts.length;
      },
      (error) => {
        Swal.fire('Error', 'Failed to load districts. Please try again later.', 'error');
      }
    );
  }

  openModal() {
    this.loadDistricts();
    this.modalRef = this.modalService.open(this.formModal, { centered: true });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close(); // Close the modal
    }
    this.resetForm();
  }

  resetForm() {
    this.districtModel = { revenue_district_name: '', status: 1 };
    this.editIndex = null;
  }

  submitForm() {
    if (!this.districtModel.district_id || !this.districtModel.collector_name || !this.districtModel.account_number) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      district_id: this.districtModel.district_id,
      collector_name: this.districtModel.collector_name,
      account_number: this.districtModel.account_number
    };

    console.log('Payload:', payload);

    this.collectorService.addCollector(payload).subscribe({
      next: (res) => {
        console.log('Collector added successfully:', res);
        alert('Collector added successfully!');
        this.closeModal();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Failed to add collector.');
      }
    });
  }

  toggleStatus(district: any) {
    const newStatus = district.status === 1 ? 0 : 1;
    Swal.fire({
      title: `Are you sure you want to set this district to ${newStatus === 1 ? 'Active' : 'Inactive'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedDistrict = {
          ...district,
          status: newStatus,
        };
        this.revenueDistrictService.updateRevenueDistrict(district.id, updatedDistrict).subscribe(
          () => {
            district.status = newStatus;
            this.showSuccessAlert(`Revenue district status changed to ${newStatus === 1 ? 'Active' : 'Inactive'}!`);
            this.refreshTable();
          },
          (error) => {
            Swal.fire('Error', 'Failed to update status. Please try again later.', 'error');
          }
        );
      }
    });
  }

  editDistrict(district: any, index: number) {
    this.districtModel = { ...district }; // Pre-fill the form with the selected district data
    this.editIndex = index;
    this.openModal();
  }

  confirmDelete(index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this revenue district? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeDistrict(index);
      }
    });
  }

  removeDistrict(index: number) {
    const id = this.revenueDistricts[index].id;
    this.revenueDistrictService.deleteRevenueDistrict(id).subscribe(
      () => {
        this.revenueDistricts.splice(index, 1);
        this.showSuccessAlert('Revenue district deleted successfully!');
        this.refreshTable();
      },
      (error) => {
        Swal.fire('Error', 'Failed to delete revenue district. Please try again later.', 'error');
      }
    );
  }

  refreshTable() {
    this.revenueDistricts = [...this.revenueDistricts];
    this.cdr.detectChanges();
  }

  filteredDistricts() {
    return this.revenueDistricts.filter((district) => {
      return district.revenue_district_name?.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }

  showSuccessAlert(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6',
    });
  }
    get totalPages(): number {
  return Math.ceil(this.totalRecords / this.itemsPerPage);
}
}
