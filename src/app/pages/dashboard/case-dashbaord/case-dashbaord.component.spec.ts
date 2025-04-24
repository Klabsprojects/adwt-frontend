import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDashbaordComponent } from './case-dashbaord.component';

describe('CaseDashbaordComponent', () => {
  let component: CaseDashbaordComponent;
  let fixture: ComponentFixture<CaseDashbaordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseDashbaordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseDashbaordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
