import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCaseComponent } from './status-case.component';

describe('StatusCaseComponent', () => {
  let component: StatusCaseComponent;
  let fixture: ComponentFixture<StatusCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusCaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
