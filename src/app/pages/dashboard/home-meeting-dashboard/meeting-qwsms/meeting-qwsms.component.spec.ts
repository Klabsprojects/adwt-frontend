import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingQwsmsComponent } from './meeting-qwsms.component';

describe('MeetingQwsmsComponent', () => {
  let component: MeetingQwsmsComponent;
  let fixture: ComponentFixture<MeetingQwsmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingQwsmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingQwsmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
