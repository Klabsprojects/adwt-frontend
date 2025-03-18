import { Component } from '@angular/core';
import { LandingService } from '../landing.service';
@Component({
  selector: 'app-poa',
  templateUrl: './poa.component.html',
  styleUrl: './poa.component.scss'
})
export class POAComponent {
  constructor(public lang:LandingService){}

}
