import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityStopComponent } from './activity-stop';

describe('ActivityStop', () => {
  let component: ActivityStopComponent;
  let fixture: ComponentFixture<ActivityStopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityStopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityStopComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
