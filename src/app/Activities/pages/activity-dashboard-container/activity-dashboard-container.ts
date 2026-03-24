import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivityDashboardComponent } from '../../components/activity-dashboard/activity-dashboard';
import { ActivityHistoryComponent } from '../../components/activity-history/activity-history';
import { ActivityService } from '../../services/activity';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-activity-dashboard-container',
  standalone: true,
  imports: [ActivityDashboardComponent, ActivityHistoryComponent],
  template: `
    <app-activity-dashboard
      [activities]="activities"
      [operators]="operators"
      [processes]="processes"
      (onStart)="start($event)"
      (onStop)="stop($event)">
    </app-activity-dashboard>

    <app-activity-history
      [history]="history">
    </app-activity-history>
  `
})
export class ActivityDashboardContainerComponent implements OnInit, OnDestroy {

  activities: any[] = [];
  operators: any[] = [];
  processes: any[] = [];
  history: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(private service: ActivityService) {}

  ngOnInit() {

    // 🔹 Operadores
    this.service.getOperators()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.operators = data,
        error: (err) => console.error('Error operadores:', err)
      });

    // 🔹 Procesos
    this.service.getProcesses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.processes = data,
        error: (err) => console.error('Error procesos:', err)
      });

    // 🔹 Actividades en proceso (reactivo)
    this.service.activities$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.activities = data);

    // 🔥 Cargar historial
    this.loadHistory();

    // 🔥 Cargar actividades activas
    this.service.reload();
  }

  // 🔥 MÉTODO HISTORIAL
  loadHistory() {
    this.service.getHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.history = data,
        error: (err) => console.error('Error historial:', err)
      });
  }

  start(data: any) {
    this.service.start(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ Actividad iniciada');
          this.service.reload();
          // (no recargamos historial aquí porque aún no está cerrada)
        },
        error: err => console.error('❌ Error al iniciar:', err)
      });
  }

  stop(data: any) {
    this.service.stop(data.id, { quantity: data.quantity })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ Actividad finalizada');

          this.service.reload();   // 🔄 actualiza activas
          this.loadHistory();      // 🔥 actualiza historial
        },
        error: err => console.error('❌ Error al finalizar:', err)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}