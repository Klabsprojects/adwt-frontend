import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMonthlyReportComponent } from './edit-monthly-report.component';

describe('EditMonthlyReportComponent', () => {
  let component: EditMonthlyReportComponent;
  let fixture: ComponentFixture<EditMonthlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMonthlyReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
