import { Component } from '@angular/core';
import { LandingService } from '../landing.service';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  constructor(public lang:LandingService){}

}
