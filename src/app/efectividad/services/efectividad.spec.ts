import { TestBed } from '@angular/core/testing';

import { Efectividad } from './efectividad';

describe('Efectividad', () => {
  let service: Efectividad;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Efectividad);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
