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

    this.service.getOperators()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.operators = data,
        error: (err) => console.error('Error operadores:', err)
      });

    this.service.getProcesses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.processes = data,
        error: (err) => console.error('Error procesos:', err)
      });

    this.service.activities$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.activities = data);

    this.loadHistory();
    this.service.reload();
  }

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
          this.service.reload();
        },
        error: err => console.error('❌ Error al iniciar:', err)
      });
  }

  stop(data: any) {
    this.service.stop(data.id, { quantity: data.quantity })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {

          if (data.notes?.trim()) {
            this.service.addNote(data.id, data.notes).subscribe();
          }

          this.service.reload();
          this.loadHistory();
        },
        error: err => console.error('❌ Error al finalizar:', err)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}