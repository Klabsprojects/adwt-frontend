import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdditionalReliefReportComponent } from './edit-additional-relief-report.component';

describe('EditAdditionalReliefReportComponent', () => {
  let component: EditAdditionalReliefReportComponent;
  let fixture: ComponentFixture<EditAdditionalReliefReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAdditionalReliefReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAdditionalReliefReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
