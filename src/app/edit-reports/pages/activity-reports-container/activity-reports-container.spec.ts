import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityReportsContainer } from './activity-reports-container';

describe('ActivityReportsContainer', () => {
  let component: ActivityReportsContainer;
  let fixture: ComponentFixture<ActivityReportsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityReportsContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityReportsContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
