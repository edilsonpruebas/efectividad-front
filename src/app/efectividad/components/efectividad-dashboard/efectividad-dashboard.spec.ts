import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfectividadDashboard } from './efectividad-dashboard';

describe('EfectividadDashboard', () => {
  let component: EfectividadDashboard;
  let fixture: ComponentFixture<EfectividadDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EfectividadDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(EfectividadDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
