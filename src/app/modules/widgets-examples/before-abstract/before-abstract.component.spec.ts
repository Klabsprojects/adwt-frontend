import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeAbstractComponent } from './before-abstract.component';

describe('BeforeAbstractComponent', () => {
  let component: BeforeAbstractComponent;
  let fixture: ComponentFixture<BeforeAbstractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeforeAbstractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeforeAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
