import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualReportContainer } from './manual-report-container';

describe('ManualReportContainer', () => {
  let component: ManualReportContainer;
  let fixture: ComponentFixture<ManualReportContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualReportContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualReportContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
