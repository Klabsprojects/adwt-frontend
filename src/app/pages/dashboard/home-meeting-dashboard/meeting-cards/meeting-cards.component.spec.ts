import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingCardsComponent } from './meeting-cards.component';

describe('MeetingCardsComponent', () => {
  let component: MeetingCardsComponent;
  let fixture: ComponentFixture<MeetingCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
