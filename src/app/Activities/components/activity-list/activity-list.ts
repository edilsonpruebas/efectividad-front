import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-activity-list',
  standalone: true,        // 👈 faltaba
  imports: [NgFor],
  templateUrl: './activity-list.html'
})
export class ActivityListComponent {

  @Input() activities: any[] = [];
  @Output() onStop = new EventEmitter<any>();

  stop(activity: any) {
    this.onStop.emit(activity);
  }
}