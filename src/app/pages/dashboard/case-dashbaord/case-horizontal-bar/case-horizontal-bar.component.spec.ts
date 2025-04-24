import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseHorizontalBarComponent } from './case-horizontal-bar.component';

describe('CaseHorizontalBarComponent', () => {
  let component: CaseHorizontalBarComponent;
  let fixture: ComponentFixture<CaseHorizontalBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseHorizontalBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseHorizontalBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
