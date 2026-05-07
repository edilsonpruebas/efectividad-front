import { Component } from '@angular/core';
import { ActivityService } from '../../services/activity';
import { NotificationService } from '../../../auth/services/notification.service'; // ← AGREGAR
import { ActivityStartComponent } from "../../components/activity-start/activity-start";

@Component({
  selector: 'app-activity-start-container',
  template: `
    <app-activity-start (onStart)="start($event)"></app-activity-start>
  `,
  imports: [ActivityStartComponent]
})
export class ActivityStartContainerComponent {

  constructor(
    private service: ActivityService,
    private notificationService: NotificationService // ← AGREGAR
  ) {}

  start(data: any) {
    this.service.start(data).subscribe({
      next: () => {
        this.notificationService.success('✓ Actividad iniciada correctamente'); // ← AGREGAR
      },
      error: err => {}
    });
  }
}