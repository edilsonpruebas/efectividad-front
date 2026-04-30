import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivityHistoryComponent } from '../../components/activity-history/activity-history';
import { ActivityService } from '../../services/activity';
import { AuthService } from '../../../auth/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-activity-reports-supervisors-container',
  standalone: true,
  imports: [ActivityHistoryComponent],
  template: `
    <app-activity-history
      [history]="history"
      [isSupervisor]="auth.isSupervisor()"
      [supervisorId]="auth.getUser()?.id ?? null">
    </app-activity-history>
  `
})
export class ActivityReportsSupervisorsContainerComponent implements OnInit, OnDestroy {

  history: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private service: ActivityService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.service.getHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: (data) => this.history = data, error: err => console.error(err) });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}