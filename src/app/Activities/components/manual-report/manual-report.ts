import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-manual-report',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './manual-report.html',
  styleUrls: ['./manual-report.css']
})
export class ManualReportComponent {

  @Input() operators: any[] = [];
  @Input() processes:  any[] = [];
  @Output() onSubmit = new EventEmitter<any>();

  success = false;
  error   = '';
  loading = false;

  form = {
    operator_id: null as number | null,
    process_id:  null as number | null,
    start_time:  '',
    end_time:    '',
    quantity:    null as number | null
  };

  submit() {
    this.success = false;
    this.error   = '';

    if (!this.form.operator_id || !this.form.process_id ||
        !this.form.start_time  || !this.form.end_time   ||
        this.form.quantity === null) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }

    if (new Date(this.form.end_time) <= new Date(this.form.start_time)) {
      this.error = 'La hora final debe ser posterior a la hora de inicio.';
      return;
    }

    this.loading = true;
    this.onSubmit.emit({ ...this.form });
  }

  markSuccess() {
    this.loading = false;
    this.success = true;
    this.form = {
      operator_id: null,
      process_id:  null,
      start_time:  '',
      end_time:    '',
      quantity:    null
    };
  }

  markError(msg: string) {
    this.loading = false;
    this.error   = msg;
  }
}