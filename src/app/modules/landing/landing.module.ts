import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { ContactComponent } from './contact/contact.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    LandingComponent,
    HomeComponent,
    AboutComponent,
    DownloadsComponent,
    ContactComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [CommonModule, LandingRoutingModule],
})
export class LandingModule {}
