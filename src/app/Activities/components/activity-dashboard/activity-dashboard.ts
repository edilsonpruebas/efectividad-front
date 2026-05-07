import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-activity-dashboard',
  standalone: true,
  imports: [FormsModule, NgFor, DatePipe, NgIf, NgClass],
  templateUrl: './activity-dashboard.html',
  styleUrls: ['./activity-dashboard.css']
})
export class ActivityDashboardComponent {

  @Input() activities: any[]  = [];
  @Input() activeGroups: any[] = [];
  @Input() operators: any[]   = [];
  @Input() processes: any[]   = [];

  @Output() onStart             = new EventEmitter<any>();
  @Output() onStop              = new EventEmitter<any>();
  @Output() onStopTimer         = new EventEmitter<any>();
  @Output() onSubmitReport      = new EventEmitter<any>();
  @Output() onQuickReport       = new EventEmitter<any>();
  @Output() onCancel            = new EventEmitter<any>();
  @Output() onStartGroup        = new EventEmitter<any>();
  @Output() onStopTimerGroup    = new EventEmitter<any>();
  @Output() onSubmitReportGroup = new EventEmitter<any>();
  @Output() onCancelGroup       = new EventEmitter<any>();

  form: {
    process_id: number | null;
    operator_id: number | null;
    is_group: boolean;
  } = {
    process_id:  null,
    operator_id: null,
    is_group:    false,
  };

  quantities: any = {};
  notes: any      = {};

  operatorSearch: string = '';
  processSearch: string  = '';
  operatorOpen: boolean  = false;
  processOpen: boolean   = false;
  operatorLabel: string  = 'Seleccionar operador...';
  processLabel: string   = 'Seleccionar proceso...';

  selectedGroupOperators: any[] = [];

  // Pagination
  pageSize = 3;
  currentActivityPage = 0;

  // ── FILTROS ──────────────────────────────────────────────────────────

  get filteredOperators() {
    const search = this.operatorSearch.toLowerCase();
    const base   = this.form.is_group
      ? this.operators.filter(op => !this.selectedGroupOperators.find(s => s.id === op.id))
      : this.operators;
    return search ? base.filter(op => op.name?.toLowerCase().includes(search)) : base;
  }

  get filteredProcesses() {
    if (!this.processSearch) return this.processes;
    const search = this.processSearch.toLowerCase();
    return this.processes.filter(pr => pr.name?.toLowerCase().includes(search));
  }

  // ── DROPDOWNS ────────────────────────────────────────────────────────

  toggleOperator() {
    this.operatorOpen = !this.operatorOpen;
    if (this.operatorOpen) { this.processOpen = false; this.operatorSearch = ''; }
  }

  toggleProcess() {
    this.processOpen = !this.processOpen;
    if (this.processOpen) { this.operatorOpen = false; this.processSearch = ''; }
  }

  selectOperator(id: number | null, name: string) {
    this.form.operator_id = id;
    this.operatorLabel    = name;
    this.operatorOpen     = false;
  }

  selectProcess(id: number | null, name: string) {
    this.form.process_id = id;
    this.processLabel    = name;
    this.processOpen     = false;
  }

  // ── MODO GRUPAL ───────────────────────────────────────────────────────

  addOperatorToGroup(op: any) {
    if (!this.selectedGroupOperators.find(o => o.id === op.id)) {
      this.selectedGroupOperators.push(op);
    }
    this.operatorOpen = false;
  }

  removeOperatorFromGroup(opId: number) {
    this.selectedGroupOperators = this.selectedGroupOperators.filter(o => o.id !== opId);
  }

  switchMode(isGroup: boolean) {
    this.form.is_group          = isGroup;
    this.form.operator_id       = null;
    this.operatorLabel          = 'Seleccionar operador...';
    this.selectedGroupOperators = [];
    this.operatorSearch         = '';
    this.operatorOpen           = false;
  }

  // ── ACCIONES INDIVIDUALES ─────────────────────────────────────────────

  start() {
    this.onStart.emit({
      process_id:  this.form.process_id,
      operator_id: this.form.operator_id,
    });
  }

  stop(activity: any) {
    this.onStop.emit({
      id:       activity.id,
      quantity: this.quantities[activity.id],
      notes:    this.notes[activity.id] ?? ''
    });
  }

  stopTimer(activity: any) {
    this.onStopTimer.emit({ id: activity.id });
  }

  submitReport(activity: any) {
    this.onSubmitReport.emit({
      id:       activity.id,
      quantity: this.quantities[activity.id],
      notes:    this.notes[activity.id] ?? ''
    });
  }

  quickReport() {
    this.onQuickReport.emit({
      operator_id: this.form.operator_id,
      process_id:  this.form.process_id,
      quantity:    this.quantities['quick'] ?? 0,
      notes:       this.notes['quick'] ?? ''
    });
  }

  cancel(activity: any) {
    this.onCancel.emit({ id: activity.id });
  }

  // ── ACCIONES GRUPALES ─────────────────────────────────────────────────

  startGroup() {
    this.onStartGroup.emit({
      process_id:   this.form.process_id,
      operator_ids: this.selectedGroupOperators.map(o => o.id),
    });
  }

  stopTimerGroup(group: any) {
    this.onStopTimerGroup.emit({ id: group.id });
  }

  submitReportGroup(group: any) {
    this.onSubmitReportGroup.emit({
      id:       group.id,
      quantity: this.quantities['group_' + group.id],
      notes:    this.notes['group_' + group.id] ?? '',
    });
  }

  cancelGroup(group: any) {
    this.onCancelGroup.emit({ id: group.id });
  }

  // ── HELPERS ───────────────────────────────────────────────────────────

  groupOperatorNames(group: any): string {
    return group.activities?.map((a: any) => a.operator?.name).join(', ') ?? '—';
  }

  // Paginación de cards (individuales + grupales)
  get allActiveCards(): any[] {
    // Puedes elegir el orden que prefieras. Este es individuales primero, luego grupales.
    // Si quieres mezclarlos de otro modo (por fecha, por ejemplo) ajusta aquí.
    return [...this.activities, ...this.activeGroups];
  }

  get maxActivityPage(): number {
    return Math.ceil(this.allActiveCards.length / this.pageSize) - 1;
  }

  get displayedCards(): any[] {
    const start = this.currentActivityPage * this.pageSize;
    return this.allActiveCards.slice(start, start + this.pageSize);
  }

      nextActivityPage() {
        if (this.currentActivityPage < this.maxActivityPage) {
          this.currentActivityPage++;
        }
      }

      prevActivityPage() {
        if (this.currentActivityPage > 0) {
          this.currentActivityPage--;
        }
      }

      resetActivityPage() {
        this.currentActivityPage = 0;
      }

      ngOnChanges(changes: SimpleChanges) {
      if (changes['activities'] || changes['activeGroups']) {
        this.resetActivityPage();
      }
    }
}