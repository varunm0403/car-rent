import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentFeedbackComponent } from './recent-feedback.component';

describe('RecentFeedbackComponent', () => {
  let component: RecentFeedbackComponent;
  let fixture: ComponentFixture<RecentFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
