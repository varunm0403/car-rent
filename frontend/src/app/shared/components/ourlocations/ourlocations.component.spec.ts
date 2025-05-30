import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurlocationsComponent } from './ourlocations.component';

describe('OurlocationsComponent', () => {
  let component: OurlocationsComponent;
  let fixture: ComponentFixture<OurlocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurlocationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurlocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
