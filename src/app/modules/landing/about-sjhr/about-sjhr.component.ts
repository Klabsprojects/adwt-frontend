import { Component } from '@angular/core';
import { LandingService } from '../landing.service';
@Component({
  selector: 'app-about-sjhr',
  templateUrl: './about-sjhr.component.html',
  styleUrl: './about-sjhr.component.scss'
})
export class AboutSjhrComponent {
  constructor(public lang:LandingService){}

}
