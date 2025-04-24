import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasePiechartComponent } from './case-piechart.component';

describe('CasePiechartComponent', () => {
  let component: CasePiechartComponent;
  let fixture: ComponentFixture<CasePiechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasePiechartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasePiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
