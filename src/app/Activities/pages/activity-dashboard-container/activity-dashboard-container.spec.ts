import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDashboardContainerComponent } from './activity-dashboard-container';

describe('ActivityDashboardContainer', () => {
  let component: ActivityDashboardContainerComponent;
  let fixture: ComponentFixture<ActivityDashboardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityDashboardContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityDashboardContainerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
