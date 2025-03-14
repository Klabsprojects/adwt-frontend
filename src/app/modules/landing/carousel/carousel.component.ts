import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  slides = [
    { url: 'assets/images/slide1.jpg', title: '', subtitle: '' },
    { url: 'assets/images/slide2.jpg', title: '', subtitle: '' },
    { url: 'assets/images/slide3.jpg', title: '', subtitle: '' },
  ];
}
