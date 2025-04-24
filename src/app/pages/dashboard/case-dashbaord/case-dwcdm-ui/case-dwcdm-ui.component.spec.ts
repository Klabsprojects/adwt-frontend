import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDwcdmUiComponent } from './case-dwcdm-ui.component';

describe('CaseDwcdmUiComponent', () => {
  let component: CaseDwcdmUiComponent;
  let fixture: ComponentFixture<CaseDwcdmUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseDwcdmUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseDwcdmUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
