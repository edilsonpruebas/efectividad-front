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
      (onStop)="stop($event)"
      (onStopTimer)="stopTimer($event)"
      (onSubmitReport)="submitReport($event)"
      (onQuickReport)="quickReport($event)"
      (onCancel)="cancel($event)">
    </app-activity-dashboard>

    <app-activity-history
      [history]="history">
    </app-activity-history>
  `
})
export class ActivityDashboardContainerComponent implements OnInit, OnDestroy {

  activities: any[] = [];
  operators:  any[] = [];
  processes:  any[] = [];
  history:    any[] = [];

  private destroy$ = new Subject<void>();

  constructor(private service: ActivityService) {}

  ngOnInit() {
    this.service.getOperators()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: (data) => this.operators = data, error: (err) => console.error(err) });

    this.service.getProcesses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: (data) => this.processes = data, error: (err) => console.error(err) });

    this.service.activities$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.activities = data);

    this.loadHistory();
    this.service.reload();
  }

  loadHistory() {
    this.service.getHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: (data) => this.history = data, error: (err) => console.error(err) });
  }

  start(data: any) {
    this.service.start(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: () => this.service.reload(), error: err => console.error(err) });
  }

  // Legacy
  stop(data: any) {
    this.service.stop(data.id, { quantity: data.quantity })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (data.notes?.trim()) this.service.addNote(data.id, data.notes).subscribe();
          this.service.reload();
          this.loadHistory();
        },
        error: err => console.error(err)
      });
  }

  stopTimer(data: any) {
    this.service.stopTimer(data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: () => this.service.reload(), error: err => console.error(err) });
  }

  submitReport(data: any) {
    this.service.submitReport(data.id, { quantity: data.quantity, notes: data.notes })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.service.reload();
          this.loadHistory();
        },
        error: err => console.error(err)
      });
  }

  quickReport(data: any) {
    this.service.quickReport(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.service.reload();
          this.loadHistory();
        },
        error: err => console.error(err)
      });
  }

  // ✅ MÉTODO AGREGADO (SOLUCIÓN)
  cancel(data: any) {
    this.service.cancel(data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.service.reload();
          this.loadHistory();
        },
        error: err => console.error(err)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}