
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity-stop',
  standalone: true,           // 👈 faltaba
  imports: [FormsModule],
  templateUrl: './activity-stop.html',
  styleUrl: './activity-stop.css',
})

export class ActivityStopComponent {

  @Input() activity: any;
  @Output() onConfirm = new EventEmitter<any>();

  quantity: number = 0;

  confirm() {
    this.onConfirm.emit({ quantity: this.quantity });
  }
}

