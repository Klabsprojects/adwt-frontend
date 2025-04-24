import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDwcdmPTComponent } from './case-dwcdm-pt.component';

describe('CaseDwcdmPTComponent', () => {
  let component: CaseDwcdmPTComponent;
  let fixture: ComponentFixture<CaseDwcdmPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseDwcdmPTComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseDwcdmPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
