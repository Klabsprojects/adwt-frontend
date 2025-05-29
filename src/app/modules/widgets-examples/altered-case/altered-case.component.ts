import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import Swal from 'sweetalert2';
import { AlteredCaseService } from 'src/app/services/altered-case.service';
import { FirService } from 'src/app/services/fir.service';

import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-altered-case',
  templateUrl: './altered-case.component.html',
  styleUrls: ['./altered-case.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    NgSelectModule
  ],
})
export class AlteredCaseComponent implements OnInit {
  
offenceOptions: any[] = [];
offenceOptionData:any[]=[];
victims : FormArray
firForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private alteredCaseService: AlteredCaseService,
    private firService: FirService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) {
 
    
  }

  ngOnInit(): void {
    this.initializeForm();
  }

 initializeForm() {
   this.firForm = this.fb.group({
   victims: this.fb.array([this.createVictimGroup()])
   });
 }

   createVictimGroup(): FormGroup {
    return this.fb.group({
      victim_id: [''],
     
      offenceCommitted: ['', Validators.required],
      scstSections:  ['', Validators.required],
      sectionDetails: this.fb.array([this.createSection()]),
    });
  }

    createSection(): FormGroup {
    return this.fb.group({
      SectionType: [''],
      Section: ['']
    });
  }
  getSectionDetails(victimIndex: number): FormArray {
    return this.victims.at(victimIndex).get('sectionDetails') as FormArray;
  }
  addSection(victimIndex: number): void {
    const sectionDetails = this.getSectionDetails(victimIndex);
    sectionDetails.push(this.createSection());
  }
  removeSection(victimIndex: number, sectionIndex: number): void {
    const sectionDetails = this.getSectionDetails(victimIndex);
    if (sectionDetails.length > 1) {
      sectionDetails.removeAt(sectionIndex);
    }
  }


    isActExcluded(act: string): boolean {
    const excluded = [
      '100 percent incapacitation',
      'Disability: Incapacitation greater than 50',
      'Disability: Incapacitation less than 50',
      'Rape',
      'Gang Rape',
      'Murder',
      '3(2)(v), 3(2)(va)',
      '3(2)(va)'
    ];
    return excluded.includes(act);
  }

  removeSelectedOffence(index: number, offenceName: string): void {
  const control = this.victims.at(index).get('offenceCommitted');
  const selected = control?.value || [];
  const updated = selected.filter((item: string) => item !== offenceName);

  control?.setValue(updated);
  control?.markAsDirty();
  control?.updateValueAndValidity();

  // Manually trigger the (change) handler
  this.onOffenceCommittedChange(index);
}


onOffenceCommittedChange(index: number): void {
  const victimGroup = this.victims.at(index) as FormGroup;

  // Get the selected offence names (array of offence_name)
  const selectedOffences: string[] = victimGroup.get('offenceCommitted')?.value || [];

  // Filter the offence options that match selected offence names
  const selectedActs = this.offenceOptions.filter((item: any) =>
    selectedOffences.includes(item.offence_name)
  );

  // Get the offence_act_name of each matched item
  const actNames = selectedActs.map(item => item.offence_act_name).filter(name => !!name);

  // Patch scstSections with comma-separated act names
  victimGroup.patchValue({
    scstSections: actNames.join(', '),
  });

  this.cdr.detectChanges();
}



    loadOptions() {
      this.firService.getOffences().subscribe(
        (offences: any) => {
          // console.log(offences);
          this.offenceOptions = offences
            .filter((offence: any) => offence.offence_act_name !== '3(2)(va)' && offence.offence_act_name !== '3(2)(v) , 3(2)(va)');
            this.offenceOptions.push(
              { offence_act_name: '3(2)(va)', offence_name: '3(2)(va)', id : 24 },
              { offence_act_name: '3(2)(v), 3(2)(va)', offence_name: '3(2)(v), 3(2)(va)', id: 25 }
            );
            this.offenceOptionData = offences.map((offence: any) => offence);
        },
        (error: any) => {
          Swal.fire('Error', 'Failed to load offence options.', 'error');
        }
      );
    }





}
