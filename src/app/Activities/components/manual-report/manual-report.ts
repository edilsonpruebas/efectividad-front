import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();
  constructor(private elementRef: ElementRef) {}
  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) this.clickOutside.emit();
  }
}

@Component({
  selector: 'app-manual-report',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, ClickOutsideDirective],
  templateUrl: './manual-report.html',
  styleUrls: ['./manual-report.css']
})
export class ManualReportComponent {

  @Input() operators: any[] = [];
  @Input() processes: any[] = [];
  @Output() onSubmit = new EventEmitter<any>();

  success = false;
  error   = '';
  loading = false;

  isGroup = false;

  operatorDropdownOpen = false;
  processDropdownOpen  = false;
  operatorSearchTerm   = '';
  processSearchTerm    = '';

  selectedGroupOperators: any[] = [];

  private loadingTimeout: any;

  form = {
    operator_id:  null as number | null,
    process_id:   null as number | null,
    start_time:   '',
    end_time:     '',
    quantity:     null as number | null,
    notes:        ''
  };

  constructor(private cdr: ChangeDetectorRef) {}

  // ── GETTERS ───────────────────────────────────────────────────────────

  get filteredOperators() {
    const base = this.isGroup
      ? this.operators.filter(op => !this.selectedGroupOperators.find(s => s.id === op.id))
      : this.operators;
    if (!this.operatorSearchTerm) return base;
    const term = this.operatorSearchTerm.toLowerCase();
    return base.filter(op => op.name.toLowerCase().includes(term));
  }

  get filteredProcesses() {
    if (!this.processSearchTerm) return this.processes;
    const term = this.processSearchTerm.toLowerCase();
    return this.processes.filter(pr => pr.name.toLowerCase().includes(term));
  }

  get selectedOperatorName(): string {
    const op = this.operators.find(o => o.id === this.form.operator_id);
    return op ? op.name : '';
  }

  get selectedProcessName(): string {
    const pr = this.processes.find(p => p.id === this.form.process_id);
    return pr ? pr.name : '';
  }

  // ── MODO ──────────────────────────────────────────────────────────────

  switchMode(group: boolean) {
    this.isGroup              = group;
    this.form.operator_id     = null;
    this.selectedGroupOperators = [];
    this.operatorSearchTerm   = '';
    this.operatorDropdownOpen = false;
  }

  // ── DROPDOWNS ─────────────────────────────────────────────────────────

  toggleOperatorDropdown() {
    this.operatorDropdownOpen = !this.operatorDropdownOpen;
    this.processDropdownOpen  = false;
    if (this.operatorDropdownOpen) this.operatorSearchTerm = '';
  }

  toggleProcessDropdown() {
    this.processDropdownOpen  = !this.processDropdownOpen;
    this.operatorDropdownOpen = false;
    if (this.processDropdownOpen) this.processSearchTerm = '';
  }

  selectOperator(op: any) {
    this.form.operator_id     = op.id;
    this.operatorDropdownOpen = false;
    this.operatorSearchTerm   = '';
    this.cdr.markForCheck();
  }

  selectProcess(pr: any) {
    this.form.process_id     = pr.id;
    this.processDropdownOpen = false;
    this.processSearchTerm   = '';
    this.cdr.markForCheck();
  }

  // ── GRUPO ─────────────────────────────────────────────────────────────

  addOperatorToGroup(op: any) {
    if (!this.selectedGroupOperators.find(o => o.id === op.id)) {
      this.selectedGroupOperators.push(op);
    }
    this.operatorDropdownOpen = false;
    this.operatorSearchTerm   = '';
    this.cdr.markForCheck();
  }

  removeOperatorFromGroup(opId: number) {
    this.selectedGroupOperators = this.selectedGroupOperators.filter(o => o.id !== opId);
    this.cdr.markForCheck();
  }

  // ── VALIDACIÓN ────────────────────────────────────────────────────────

  isFormValid(): boolean {
    const base = !!this.form.process_id &&
                 !!this.form.start_time &&
                 !!this.form.end_time   &&
                 !!this.form.quantity   &&
                 this.form.quantity > 0;

    if (this.isGroup) {
      return base && this.selectedGroupOperators.length >= 2;
    }
    return base && !!this.form.operator_id;
  }

  calculateDuration(): string {
    if (!this.form.start_time || !this.form.end_time) return '';
    const start       = new Date(this.form.start_time);
    const end         = new Date(this.form.end_time);
    const diffMinutes = (end.getTime() - start.getTime()) / 1000 / 60;
    if (diffMinutes < 0)  return 'Verificar fechas';
    if (diffMinutes === 0) return '0 minutos';
    if (diffMinutes < 60) return `${Math.round(diffMinutes)} minutos`;
    const hours = Math.floor(diffMinutes / 60);
    const mins  = Math.round(diffMinutes % 60);
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }

  // ── SUBMIT ────────────────────────────────────────────────────────────

  submit() {
    this.success = false;
    this.error   = '';

    if (this.form.end_time && this.form.start_time &&
        new Date(this.form.end_time) <= new Date(this.form.start_time)) {
      this.error = 'La hora final debe ser posterior a la hora de inicio.';
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();

    this.loadingTimeout = setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.error   = 'La operación está tomando más tiempo de lo esperado. Intente nuevamente.';
        this.cdr.markForCheck();
      }
    }, 10000);

    if (this.isGroup) {
      this.onSubmit.emit({
        is_group:     true,
        operator_ids: this.selectedGroupOperators.map(o => o.id),
        process_id:   this.form.process_id,
        start_time:   this.form.start_time,
        end_time:     this.form.end_time,
        quantity:     this.form.quantity,
        notes:        this.form.notes,
      });
    } else {
      this.onSubmit.emit({ ...this.form, is_group: false });
    }
  }

  markSuccess() {
    this.clearLoadingTimeout();
    this.loading  = false;
    this.success  = true;
    this.isGroup  = false;
    this.selectedGroupOperators = [];
    this.form = {
      operator_id: null,
      process_id:  null,
      start_time:  '',
      end_time:    '',
      quantity:    null,
      notes:       ''
    };
    this.operatorDropdownOpen = false;
    this.processDropdownOpen  = false;
    this.operatorSearchTerm   = '';
    this.processSearchTerm    = '';
    this.cdr.markForCheck();
  }

  markError(msg: string) {
    this.clearLoadingTimeout();
    this.loading = false;
    this.error   = msg;
    this.cdr.markForCheck();
  }

  private clearLoadingTimeout() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
  }
}