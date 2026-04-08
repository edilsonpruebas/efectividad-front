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


form: { process_id: number | null; operator_id: number | null } = {
  process_id: null,
  operator_id: null
};

  quantities: any = {};
  notes: any = {};

  // 🔍 Estado de los dropdowns personalizados
  operatorSearch: string = '';
  processSearch: string = '';
  operatorOpen: boolean = false;
  processOpen: boolean = false;
  operatorLabel: string = 'Seleccionar operador...';
  processLabel: string = 'Seleccionar proceso...';

  // 🔍 Filtros dinámicos
  get filteredOperators() {
    if (!this.operatorSearch) return this.operators;
    const search = this.operatorSearch.toLowerCase();
    return this.operators.filter(op => op.name?.toLowerCase().includes(search));
  }

  get filteredProcesses() {
    if (!this.processSearch) return this.processes;
    const search = this.processSearch.toLowerCase();
    return this.processes.filter(pr => pr.name?.toLowerCase().includes(search));
  }

  // 🔍 Control de apertura/cierre y selección
  toggleOperator() {
    this.operatorOpen = !this.operatorOpen;
    if (this.operatorOpen) {
      this.processOpen = false;
      this.operatorSearch = '';
    }
  }

  toggleProcess() {
    this.processOpen = !this.processOpen;
    if (this.processOpen) {
      this.operatorOpen = false;
      this.processSearch = '';
    }
  }

  selectOperator(id: number | null, name: string) {
    this.form.operator_id = id;
    this.operatorLabel = name;
    this.operatorOpen = false;
  }

  selectProcess(id: number | null, name: string) {
    this.form.process_id = id;
    this.processLabel = name;
    this.processOpen = false;
  }

  // ✅ LÓGICA ORIGINAL INTACTA
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