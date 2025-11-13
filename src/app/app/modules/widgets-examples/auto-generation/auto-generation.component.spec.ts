import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoGenerationComponent } from './auto-generation.component';

describe('AutoGenerationComponent', () => {
  let component: AutoGenerationComponent;
  let fixture: ComponentFixture<AutoGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoGenerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
