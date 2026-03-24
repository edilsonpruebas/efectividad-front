import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityStartContainerComponent } from './activity-start-container';

describe('ActivityStartContainer', () => {
  let component: ActivityStartContainerComponent;
  let fixture: ComponentFixture<ActivityStartContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityStartContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityStartContainerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
