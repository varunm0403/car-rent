import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCalenderComponent } from './view-calender.component';

describe('ViewCalenderComponent', () => {
  let component: ViewCalenderComponent;
  let fixture: ComponentFixture<ViewCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCalenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
