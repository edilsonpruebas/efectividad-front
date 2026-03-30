import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualReport } from './manual-report';

describe('ManualReport', () => {
  let component: ManualReport;
  let fixture: ComponentFixture<ManualReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualReport],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
