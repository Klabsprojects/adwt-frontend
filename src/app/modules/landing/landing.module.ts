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
@NgModule({
  declarations: [
    CarouselComponent,
    LandingComponent,
    HomeComponent,
    AboutComponent,
    DownloadsComponent,
    ContactComponent,
    POAComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [CommonModule, LandingRoutingModule,NgbModule,AuthModule],
})
export class LandingModule {}
