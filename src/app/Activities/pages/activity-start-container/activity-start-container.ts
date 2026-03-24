import { Component } from '@angular/core';
import { ActivityService } from '../../services/activity';
import { ActivityStartComponent } from "../../components/activity-start/activity-start";

@Component({
  selector: 'app-activity-start-container',
  template: `
    <app-activity-start (onStart)="start($event)"></app-activity-start>
  `,
  imports: [ActivityStartComponent]
})
export class ActivityStartContainerComponent {

  constructor(private service: ActivityService) {}

  start(data: any) {
    this.service.start(data).subscribe({
      next: () => alert('Actividad iniciada'),
      error: err => alert(err.error.error)
    });
  }
}