import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterAbstractComponent } from './after-abstract.component';

describe('AfterAbstractComponent', () => {
  let component: AfterAbstractComponent;
  let fixture: ComponentFixture<AfterAbstractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfterAbstractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfterAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
