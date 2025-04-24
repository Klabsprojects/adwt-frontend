import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStatusComponent } from './case-status.component';

describe('CaseStatusComponent', () => {
  let component: CaseStatusComponent;
  let fixture: ComponentFixture<CaseStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
