import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { ContactComponent } from './contact/contact.component';
import { POAComponent } from './poa/poa.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent, // This is the main landing page wrapper
    children: [
      { path: '', component: HomeComponent }, // Default Home Page
      { path: 'about', component: AboutComponent },
      { path: 'services', component: DownloadsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'poa',component:POAComponent},
      { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirect unknown paths to Home
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule {}
