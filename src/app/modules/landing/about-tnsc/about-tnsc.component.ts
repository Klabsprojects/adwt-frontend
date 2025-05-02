import { Component } from '@angular/core';
import { LandingService } from '../landing.service';
@Component({
  selector: 'app-about-tnsc',
  templateUrl: './about-tnsc.component.html',
  styleUrl: './about-tnsc.component.scss'
})
export class AboutTnscComponent {
  constructor(public lang:LandingService){}
}
