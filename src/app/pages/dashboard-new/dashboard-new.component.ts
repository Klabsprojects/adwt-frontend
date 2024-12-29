import { Component } from '@angular/core';
import { TableComponent } from './table/table.component';
import { HorizontalBarComponent } from './horizontal-bar/horizontal-bar.component';
import { PiechartComponent } from './piechart/piechart.component';
@Component({
  selector: 'app-dashboard-new',
  standalone: true,
  imports: [TableComponent,HorizontalBarComponent,PiechartComponent],
  templateUrl: './dashboard-new.component.html',
  styleUrl: './dashboard-new.component.scss'
})
export class DashboardNewComponent {

}
