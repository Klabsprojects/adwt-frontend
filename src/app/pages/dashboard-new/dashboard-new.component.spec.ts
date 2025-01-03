import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNewComponent } from './dashboard-new.component';

describe('DashboardNewComponent', () => {
  let component: DashboardNewComponent;
  let fixture: ComponentFixture<DashboardNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
