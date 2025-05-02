import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { ContactComponent } from './contact/contact.component';
import { POAComponent } from './poa/poa.component';
import { PoaHelplineComponent } from './poa-helpline/poa-helpline.component';
import { GalleryComponent } from './gallery/gallery.component';
import { FaqComponent } from './faq/faq.component';
import { AboutSjhrComponent } from './about-sjhr/about-sjhr.component';
import { AboutTnscComponent } from './about-tnsc/about-tnsc.component';
const routes: Routes = [
  {
    path: '',
    component: LandingComponent, // This is the main landing page wrapper
    children: [
      { path: '', component: HomeComponent }, // Default Home Page
      { path: 'about', component: AboutComponent },
      { path: 'about-sjhr',component:AboutSjhrComponent},
      { path: 'about-tnsc',component:AboutTnscComponent},
      { path: 'services', component: DownloadsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'poa',component:POAComponent},
      { path: 'poahelpline',component:PoaHelplineComponent},
      { path: 'gallery',component:GalleryComponent},
      { path: 'faq',component:FaqComponent},
      
      { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirect unknown paths to Home
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule {}
