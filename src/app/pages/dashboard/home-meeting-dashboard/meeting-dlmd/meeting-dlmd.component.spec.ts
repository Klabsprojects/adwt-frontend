import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingDlmdComponent } from './meeting-dlmd.component';

describe('MeetingDlmdComponent', () => {
  let component: MeetingDlmdComponent;
  let fixture: ComponentFixture<MeetingDlmdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingDlmdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingDlmdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
