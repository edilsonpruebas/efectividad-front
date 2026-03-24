import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfectividadDashboardContainer } from './efectividad-dashboard-container';

describe('EfectividadDashboardContainer', () => {
  let component: EfectividadDashboardContainer;
  let fixture: ComponentFixture<EfectividadDashboardContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EfectividadDashboardContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(EfectividadDashboardContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
