import { Component, OnInit, OnDestroy } from '@angular/core';
import { EfectividadDashboardComponent } from '../../components/efectividad-dashboard/efectividad-dashboard';
import { EfectividadService, EfectividadFilter } from '../../services/efectividad';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-efectividad-dashboard-container',
  standalone: true,
  imports: [EfectividadDashboardComponent], // ✅ Solo el dashboard, sin admin
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

  constructor(private service: EfectividadService) {}

  ngOnInit() {
    // Cargar operadores activos (para filtros del dashboard)
    this.service.getOperators()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: d => this.operators = d });

    // Cargar procesos (para filtros del dashboard)
    this.service.getProcesses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: d => this.processes = d });

    // Suscribirse a los datos del dashboard
    this.service.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.activities    = data.activities    ?? [];
        this.metrics       = data.metrics       ?? {};
        this.effectiveness = data.effectiveness ?? { by_operator: [], by_process: [] };
      });

    // Suscribirse al estado de carga
    this.service.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(l => this.loading = l);

    // Iniciar polling de datos
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