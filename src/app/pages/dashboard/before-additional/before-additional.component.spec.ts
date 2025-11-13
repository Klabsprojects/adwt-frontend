import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeAdditionalComponent } from './before-additional.component';

describe('BeforeAdditionalComponent', () => {
  let component: BeforeAdditionalComponent;
  let fixture: ComponentFixture<BeforeAdditionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeforeAdditionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeforeAdditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
