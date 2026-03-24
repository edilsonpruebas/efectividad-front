import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity-start',
  imports: [FormsModule],
  templateUrl: './activity-start.html'
})
export class ActivityStartComponent {

  @Output() onStart = new EventEmitter<any>();

  form = {
    process_id: null,
    operator_id: null
  };

  start() {
    this.onStart.emit(this.form);
  }
}