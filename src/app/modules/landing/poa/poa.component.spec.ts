import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POAComponent } from './poa.component';

describe('POAComponent', () => {
  let component: POAComponent;
  let fixture: ComponentFixture<POAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
