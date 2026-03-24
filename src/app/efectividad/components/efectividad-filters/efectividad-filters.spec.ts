import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfectividadFilters } from './efectividad-filters';

describe('EfectividadFilters', () => {
  let component: EfectividadFilters;
  let fixture: ComponentFixture<EfectividadFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EfectividadFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(EfectividadFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
