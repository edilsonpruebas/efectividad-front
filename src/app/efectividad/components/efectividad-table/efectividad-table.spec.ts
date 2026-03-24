import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfectividadTable } from './efectividad-table';

describe('EfectividadTable', () => {
  let component: EfectividadTable;
  let fixture: ComponentFixture<EfectividadTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EfectividadTable],
    }).compileComponents();

    fixture = TestBed.createComponent(EfectividadTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
