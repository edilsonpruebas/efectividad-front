import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-activity-dashboard',
  standalone: true,
  imports: [FormsModule, NgFor, DatePipe, NgIf],
  templateUrl: './activity-dashboard.html',
  styleUrls: ['./activity-dashboard.css']
})
export class ActivityDashboardComponent {

  @Input() activities: any[] = [];
  @Input() operators: any[] = [];
  @Input() processes: any[] = [];

  @Output() onStart = new EventEmitter<any>();
  @Output() onStop = new EventEmitter<any>();

  form = {
    process_id: null,
    operator_id: null
  };

  quantities: any = {};
  notes: any = {};

  start() {
    this.onStart.emit(this.form);
  }

  stop(activity: any) {
    this.onStop.emit({
      id:       activity.id,
      quantity: this.quantities[activity.id],
      notes:    this.notes[activity.id] ?? ''
    });
  }
}