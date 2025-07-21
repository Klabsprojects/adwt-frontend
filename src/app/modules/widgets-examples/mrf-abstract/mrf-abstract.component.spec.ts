import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrfAbstractComponent } from './mrf-abstract.component';

describe('MrfAbstractComponent', () => {
  let component: MrfAbstractComponent;
  let fixture: ComponentFixture<MrfAbstractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MrfAbstractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrfAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
