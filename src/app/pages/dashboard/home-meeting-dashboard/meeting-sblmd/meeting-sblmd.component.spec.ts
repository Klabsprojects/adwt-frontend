import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingSblmdComponent } from './meeting-sblmd.component';

describe('MeetingSblmdComponent', () => {
  let component: MeetingSblmdComponent;
  let fixture: ComponentFixture<MeetingSblmdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingSblmdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingSblmdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
