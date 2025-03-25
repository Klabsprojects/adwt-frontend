import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSjhrComponent } from './about-sjhr.component';

describe('AboutSjhrComponent', () => {
  let component: AboutSjhrComponent;
  let fixture: ComponentFixture<AboutSjhrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSjhrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutSjhrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
