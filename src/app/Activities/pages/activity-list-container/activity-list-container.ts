import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityListComponent } from '../../components/activity-list/activity-list';
import { ActivityStopComponent } from '../../components/activity-stop/activity-stop';
import { ActivityService } from '../../services/activity';

@Component({
  selector: 'app-activity-list-container',
  standalone: true,
  imports: [CommonModule, ActivityListComponent, ActivityStopComponent],
  template: `
    <app-activity-list
      [activities]="activities"
      (onStop)="selectActivity($event)">
    </app-activity-list>

    @if (selected) {
      <app-activity-stop
        [activity]="selected"
        (onConfirm)="stop($event)">
      </app-activity-stop>
    }
  `
})
export class ActivityListContainerComponent implements OnInit {

  activities: any[] = [];
  selected: any = null;

  constructor(private service: ActivityService) {}

  ngOnInit() {
    this.service.activities$.subscribe((data: any[]) => {
      this.activities = data;
    });
    this.service.reload();
  }

  selectActivity(activity: any) {
    this.selected = activity;
  }

  stop(data: any) {
    this.service.stop(this.selected.id, { quantity: data.quantity })
      .subscribe({
        next: () => {
          alert('Finalizada');
          this.selected = null;
          this.service.reload();
        },
        error: err => console.error('❌ Error al finalizar:', err)
      });
  }
}