import { Component } from '@angular/core';
import { LandingService } from '../landing.service';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  constructor(public lang:LandingService){}
  gallery:any[]=[
    'assets/images/gallery/1.JPG',
    'assets/images/gallery/2.JPG',
    'assets/images/gallery/3.JPG',
    'assets/images/gallery/4.JPG',
    'assets/images/gallery/5.JPG',
    'assets/images/gallery/6.JPG',
    'assets/images/gallery/7.JPG',
    'assets/images/gallery/8.JPG',
    'assets/images/gallery/9.JPG',
    'assets/images/gallery/10.JPG',
    'assets/images/gallery/11.JPG',
    'assets/images/gallery/12.JPG',
    'assets/images/gallery/13.JPG',
    'assets/images/gallery/14.JPG',
    'assets/images/gallery/15.JPG',
    'assets/images/gallery/16.JPG',
    'assets/images/gallery/17.JPG',
    'assets/images/gallery/18.JPG',
    'assets/images/gallery/19.JPG',
    'assets/images/gallery/20.jpeg',
    'assets/images/gallery/21.jpeg',
    'assets/images/gallery/22.jpeg',
    'assets/images/gallery/23.jpeg',
    'assets/images/gallery/24.jpeg',
    'assets/images/gallery/25.jpeg',
    'assets/images/gallery/26.jpeg',
    'assets/images/gallery/27.jpeg',
    'assets/images/gallery/28.jpeg',
    'assets/images/gallery/29.jpeg',
  ]
}
