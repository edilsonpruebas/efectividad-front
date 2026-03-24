import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityHistory } from './activity-history';

describe('ActivityHistory', () => {
  let component: ActivityHistory;
  let fixture: ComponentFixture<ActivityHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
