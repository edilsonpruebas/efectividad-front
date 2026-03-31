import { Component, OnInit, OnDestroy } from '@angular/core';
import { EfectividadDashboardComponent } from '../../components/efectividad-dashboard/efectividad-dashboard';
import { EfectividadService, EfectividadFilter } from '../../services/efectividad';
import { Subject, takeUntil } from 'rxjs';
import { EfectividadAdminContainerComponent } from '../efectividad-admin-container/efectividad-admin-container';

@Component({
  selector: 'app-efectividad-dashboard-container',
  standalone: true,
  imports: [EfectividadDashboardComponent, EfectividadAdminContainerComponent],
  template: `
    <app-efectividad-dashboard
      [activities]="activities"
      [metrics]="metrics"
      [effectiveness]="effectiveness"
      [operators]="operators"
      [processes]="processes"
      [loading]="loading"
      (onFilter)="onFilter($event)">
    </app-efectividad-dashboard>
    <app-efectividad-admin-container></app-efectividad-admin-container>

  `
})
export class EfectividadDashboardContainerComponent implements OnInit, OnDestroy {

  activities:    any[] = [];
  metrics:       any   = {};
  effectiveness: any   = { by_operator: [], by_process: [] }; // ✅
  operators:     any[] = [];
  processes:     any[] = [];
  loading              = false;

  private destroy$ = new Subject<void>();

  constructor(private service: EfectividadService) {}

  ngOnInit() {
    this.service.getOperators()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: d => this.operators = d });

    this.service.getProcesses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: d => this.processes = d });

    this.service.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.activities    = data.activities    ?? [];
        this.metrics       = data.metrics       ?? {};
        this.effectiveness = data.effectiveness ?? { by_operator: [], by_process: [] }; // ✅
      });

    this.service.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(l => this.loading = l);

    this.service.startPolling();
  }

  onFilter(filters: EfectividadFilter) {
    this.service.setFilters(filters);
  }

  ngOnDestroy() {
    this.service.stopPolling();
    this.destroy$.next();
    this.destroy$.complete();
  }
}