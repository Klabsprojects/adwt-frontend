import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMonetaryReliefComponent  } from './edit-monetary-relief.component';

describe('EditMonetaryReliefComponent ', () => {
  let component: EditMonetaryReliefComponent ;
  let fixture: ComponentFixture<EditMonetaryReliefComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMonetaryReliefComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMonetaryReliefComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
