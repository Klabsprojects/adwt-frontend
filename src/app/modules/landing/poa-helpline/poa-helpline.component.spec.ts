import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoaHelplineComponent } from './poa-helpline.component';

describe('PoaHelplineComponent', () => {
  let component: PoaHelplineComponent;
  let fixture: ComponentFixture<PoaHelplineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoaHelplineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoaHelplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
