import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { ContactComponent } from './contact/contact.component';
import { POAComponent } from './poa/poa.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthModule } from '../auth/auth.module';
import { CarouselComponent } from './carousel/carousel.component';
import { PoaHelplineComponent } from './poa-helpline/poa-helpline.component';
import { GalleryComponent } from './gallery/gallery.component';
import { FaqComponent } from './faq/faq.component';
import { FormsModule } from '@angular/forms';
import { AboutSjhrComponent } from './about-sjhr/about-sjhr.component';
@NgModule({
  declarations: [
    CarouselComponent,
    LandingComponent,
    HomeComponent,
    AboutComponent,
    AboutSjhrComponent,
    DownloadsComponent,
    ContactComponent,
    POAComponent,
    PoaHelplineComponent,
    GalleryComponent,
    FaqComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [CommonModule, LandingRoutingModule,NgbModule,AuthModule,FormsModule],
})
export class LandingModule {}
