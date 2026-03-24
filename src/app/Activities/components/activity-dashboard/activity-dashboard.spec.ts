import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDashboardComponent } from './activity-dashboard';

describe('ActivityDashboard', () => {
  let component: ActivityDashboardComponent;
  let fixture: ComponentFixture<ActivityDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
