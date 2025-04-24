import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtCaseComponent } from './pt-case.component';

describe('PtCaseComponent', () => {
  let component: PtCaseComponent;
  let fixture: ComponentFixture<PtCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PtCaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
