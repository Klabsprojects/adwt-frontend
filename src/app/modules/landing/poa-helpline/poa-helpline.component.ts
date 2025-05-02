import { Component,ChangeDetectorRef } from '@angular/core';
import { LandingService } from '../landing.service';
@Component({
  selector: 'app-poa-helpline',
  templateUrl: './poa-helpline.component.html',
  styleUrl: './poa-helpline.component.scss'
})
export class PoaHelplineComponent {
  constructor(public lang:LandingService,private cdRef:ChangeDetectorRef){}
  phoneNumbers: string[] = ['1800 202 1989', '14566'];
  currentPhone: string = this.phoneNumbers[0];

  ngOnInit() {
    setInterval(() => {
      this.currentPhone = this.currentPhone === this.phoneNumbers[0] 
        ? this.phoneNumbers[1] 
        : this.phoneNumbers[0];
  
      this.cdRef.detectChanges(); // Force UI update
    }, 1000);
  }
}
