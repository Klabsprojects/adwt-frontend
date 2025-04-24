import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseAnnualComponent } from './case-annual.component';

describe('CaseAnnualComponent', () => {
  let component: CaseAnnualComponent;
  let fixture: ComponentFixture<CaseAnnualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseAnnualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseAnnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
