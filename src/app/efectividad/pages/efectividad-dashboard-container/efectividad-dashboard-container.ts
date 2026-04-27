import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EfectividadDashboardComponent } from '../../components/efectividad-dashboard/efectividad-dashboard';
import { EfectividadService, EfectividadFilter } from '../../services/efectividad';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-efectividad-dashboard-container',
  standalone: true,
  imports: [EfectividadDashboardComponent],
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
  `
})
export class EfectividadDashboardContainerComponent implements OnInit, OnDestroy {

  activities:    any[] = [];
  metrics:       any   = {};
  effectiveness: any   = { by_operator: [], by_process: [] };
  operators:     any[] = [];
  processes:     any[] = [];
  loading              = false;

  private destroy$ = new Subject<void>();

  constructor(
    private service: EfectividadService,
    private cdr: ChangeDetectorRef  // ←
  ) {}

  ngOnInit() {
    this.service.getOperators()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: d => {
          this.operators = d;
          this.cdr.detectChanges(); // ←
        }
      });

    this.service.getProcesses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: d => {
          this.processes = d;
          this.cdr.detectChanges(); // ←
        }
      });

    this.service.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.activities    = data.activities    ?? [];
        this.metrics       = data.metrics       ?? {};
        this.effectiveness = data.effectiveness ?? { by_operator: [], by_process: [] };
        this.cdr.detectChanges(); // ←
      });

    this.service.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(l => {
        this.loading = l;
        this.cdr.detectChanges(); // ←
      });

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