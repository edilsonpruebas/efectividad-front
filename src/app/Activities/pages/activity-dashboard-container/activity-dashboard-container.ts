import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivityDashboardComponent } from '../../components/activity-dashboard/activity-dashboard';
import { ActivityService } from '../../services/activity';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-activity-dashboard-container',
  standalone: true,
  imports: [ActivityDashboardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-activity-dashboard
      [activities]="activities"
      [activeGroups]="activeGroups"
      [operators]="operators"
      [processes]="processes"
      (onStart)="start($event)"
      (onStop)="stop($event)"
      (onStopTimer)="stopTimer($event)"
      (onSubmitReport)="submitReport($event)"
      (onQuickReport)="quickReport($event)"
      (onCancel)="cancel($event)"
      (onStartGroup)="startGroup($event)"
      (onStopTimerGroup)="stopTimerGroup($event)"
      (onSubmitReportGroup)="submitReportGroup($event)"
      (onCancelGroup)="cancelGroup($event)">
    </app-activity-dashboard>
  `
})
export class ActivityDashboardContainerComponent implements OnInit, OnDestroy {

  activities:   any[] = [];
  activeGroups: any[] = [];
  operators:    any[] = [];
  processes:    any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private service: ActivityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.service.getOperators()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => { this.operators = data; this.cdr.markForCheck(); },
        error: (err) => console.error(err)
      });

    this.service.getProcesses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => { this.processes = data; this.cdr.markForCheck(); },
        error: (err) => console.error(err)
      });

    this.service.activities$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.activities = data;
        this.cdr.markForCheck();
      });

    this.loadGroups();
    this.service.reload();
  }

  loadGroups() {
    this.service.getActiveGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => { this.activeGroups = data; this.cdr.markForCheck(); },
        error: (err) => console.error(err)
      });
  }

  start(data: any) {
    this.service.start(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.service.reload(); this.cdr.markForCheck(); },
        error: err => console.error(err)
      });
  }

  stop(data: any) {
    this.service.stop(data.id, { quantity: data.quantity })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (data.notes?.trim()) this.service.addNote(data.id, data.notes).subscribe();
          this.service.reload();
          this.cdr.markForCheck();
        },
        error: err => console.error(err)
      });
  }

  stopTimer(data: any) {
    this.service.stopTimer(data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.service.reload(); this.cdr.markForCheck(); },
        error: err => console.error(err)
      });
  }

  submitReport(data: any) {
    this.service.submitReport(data.id, { quantity: data.quantity, notes: data.notes })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.service.reload(); this.cdr.markForCheck(); },
        error: err => console.error(err)
      });
  }

  quickReport(data: any) {
    this.service.quickReport(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.service.reload(); this.cdr.markForCheck(); },
        error: err => console.error(err)
      });
  }

  cancel(data: any) {
    this.service.cancel(data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.service.reload(); this.cdr.markForCheck(); },
        error: err => console.error(err)
      });
  }

  startGroup(data: any) {
    this.service.startGroup(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.loadGroups(); this.cdr.markForCheck(); },
        error: err => console.error(err)
      });
  }

  stopTimerGroup(data: any) {
    this.service.stopTimerGroup(data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.loadGroups(); this.cdr.markForCheck(); },
        error: err => console.error(err)
      });
  }

  submitReportGroup(data: any) {
    this.service.submitReportGroup(data.id, { quantity: data.quantity, notes: data.notes })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.loadGroups(); this.cdr.markForCheck(); },
        error: err => console.error(err)
      });
  }

  cancelGroup(data: any) {
    this.service.cancelGroup(data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.loadGroups(); this.cdr.markForCheck(); },
        error: err => console.error(err)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}