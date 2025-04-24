import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCaseComponent } from './ui-case.component';

describe('UiCaseComponent', () => {
  let component: UiCaseComponent;
  let fixture: ComponentFixture<UiCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
