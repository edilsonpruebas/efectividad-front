import { TestBed } from '@angular/core/testing';

import { ActivityReports } from './activity-reports';

describe('ActivityReports', () => {
  let service: ActivityReports;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityReports);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
