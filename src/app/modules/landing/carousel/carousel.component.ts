import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  slides = [
    { url: 'assets/images/adwt1.jpg', title: '', subtitle: '' },
    { url: 'assets/images/adwt2.jpg', title: '', subtitle: '' },
    { url: 'assets/images/adwt3.jpg', title: '', subtitle: '' },
    { url: 'assets/images/adwt4.jpg', title: '', subtitle: '' },
    { url: 'assets/images/adwt5.jpg', title: '', subtitle: '' },
    { url: 'assets/images/adwt6.jpg', title: '', subtitle: '' },
  ];
}
