import { Component, Input, Output, EventEmitter, ChangeDetectorRef, Directive, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

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

interface Corte {
  start_time: string;
  end_time: string;
  quantity: number | null;
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
  @Output() onSubmit = new EventEmitter<any[]>();

  success = false;
  error   = '';
  loading = false;
  isGroup = false;

  operatorDropdownOpen = false;
  processDropdownOpen  = false;
  operatorSearchTerm   = '';
  processSearchTerm    = '';

  selectedGroupOperators: any[] = [];
  selectedOperatorName = '';
  selectedProcessName  = '';

  form = {
    operator_id: null as number | null,
    process_id:  null as number | null,
    notes:       ''
  };

  cortes: Corte[] = [{ start_time: '', end_time: '', quantity: null }];

  constructor(private cdr: ChangeDetectorRef) {}

  get filteredOperators() {
    return this.operators.filter(op => 
      op.name.toLowerCase().includes(this.operatorSearchTerm.toLowerCase())
    );
  }

  get filteredProcesses() {
    return this.processes.filter(pr => 
      pr.name.toLowerCase().includes(this.processSearchTerm.toLowerCase())
    );
  }

  switchMode(group: boolean) {
    this.isGroup = group;
    this.form.operator_id = null;
    this.selectedOperatorName = '';
    this.selectedGroupOperators = [];
  }

  toggleOperatorDropdown() { this.operatorDropdownOpen = !this.operatorDropdownOpen; }
  toggleProcessDropdown()  { this.processDropdownOpen = !this.processDropdownOpen; }

  selectOperator(op: any) {
    this.form.operator_id = op.id;
    this.selectedOperatorName = op.name;
    this.operatorDropdownOpen = false;
  }

  selectProcess(pr: any) {
    this.form.process_id = pr.id;
    this.selectedProcessName = pr.name;
    this.processDropdownOpen = false;
  }

  addOperatorToGroup(op: any) {
    if (!this.selectedGroupOperators.find(o => o.id === op.id)) {
      this.selectedGroupOperators.push(op);
    }
    this.operatorDropdownOpen = false;
  }

  removeOperatorFromGroup(id: number) {
    this.selectedGroupOperators = this.selectedGroupOperators.filter(o => o.id !== id);
  }

  addCorte() {
    this.cortes.push({ start_time: '', end_time: '', quantity: null });
  }

  removeCorte(index: number) {
    if (this.cortes.length > 1) this.cortes.splice(index, 1);
  }

  getTotalQuantity(): number {
    return this.cortes.reduce((acc, c) => acc + (c.quantity || 0), 0);
  }

  // 🔧 Helper seguro para datetime-local
  private parseDateTime(value: string): number | null {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      const [datePart, timePart] = value.split('T');
      if (!datePart || !timePart) return null;
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes).getTime();
    }
    return date.getTime();
  }

  getCorteMinutes(corte: Corte): number {
    const start = this.parseDateTime(corte.start_time);
    const end = this.parseDateTime(corte.end_time);
    if (!start || !end) return 0;
    const diff = (end - start) / 60000;
    return diff > 0 ? diff : 0;
  }

  formatDuration(minutes: number): string {
    if (minutes <= 0) return '';
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h} h`;
    return `${h} h ${m} min`;
  }

  getTotalMinutes(): number {
    return this.cortes.reduce((acc, c) => acc + this.getCorteMinutes(c), 0);
  }

  getCorteTimeError(corte: Corte): string | null {
    const start = this.parseDateTime(corte.start_time);
    const end = this.parseDateTime(corte.end_time);
    if (!start || !end) return null;
    if (start === end) return 'Las horas de inicio y fin son iguales';
    if (end < start) return 'La hora final es anterior a la hora de inicio';
    return null;
  }

  getCorteOverlapError(corte: Corte, index: number): string | null {
    const startA = this.parseDateTime(corte.start_time);
    const endA = this.parseDateTime(corte.end_time);
    if (!startA || !endA) return null;

    for (let i = 0; i < this.cortes.length; i++) {
      if (i === index) continue;
      const other = this.cortes[i];
      const startB = this.parseDateTime(other.start_time);
      const endB = this.parseDateTime(other.end_time);
      if (!startB || !endB) continue;

      if (startA < endB && startB < endA) {
        return `Se solapa con el Corte #${i + 1}`;
      }
    }
    return null;
  }

  getCorteLimitError(corte: Corte): string | null {
  const minutes = this.getCorteMinutes(corte);
  if (minutes > 240) {
    return `Excede el límite de 4 horas (${this.formatDuration(minutes)})`;
  }
  return null;
}

  corteExceedsLimit(corte: Corte): boolean {
    return this.getCorteMinutes(corte) > 240;
  }

  hasAnyCorteExceedingLimit(): boolean {
    return this.cortes.some(c => this.corteExceedsLimit(c));
  }

  isFormValid(): boolean {
    const hasProcess = !!this.form.process_id;
    const areCortesValid = this.cortes.every(c => c.start_time && c.end_time && c.quantity && c.quantity > 0);
    const hasOperators = this.isGroup 
      ? this.selectedGroupOperators.length >= 2 
      : !!this.form.operator_id;
    const noExceeds = !this.hasAnyCorteExceedingLimit();
    const noTimeErrors = this.cortes.every(c => this.getCorteTimeError(c) === null);
    const noOverlaps = this.cortes.every((c, i) => this.getCorteOverlapError(c, i) === null);

    return hasProcess && areCortesValid && hasOperators && noExceeds && noTimeErrors && noOverlaps;
  }

  submit() {
    this.success = false;
    this.error = '';
    this.loading = true;

    const formatDate = (ds: string) => {
      const d = new Date(ds);
      const p = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:00`;
    };

    const payloads = this.cortes.map(c => ({
      process_id: this.form.process_id,
      start_time: formatDate(c.start_time),
      end_time: formatDate(c.end_time),
      quantity: c.quantity,
      notes: this.form.notes,
      is_group: this.isGroup,
      operator_id: this.isGroup ? null : this.form.operator_id,
      operator_ids: this.isGroup ? this.selectedGroupOperators.map(o => o.id) : null
    }));

    this.onSubmit.emit(payloads);
  }

  markSuccess() {
    this.loading = false;
    this.success = true;
    this.form = { operator_id: null, process_id: null, notes: '' };
    this.cortes = [{ start_time: '', end_time: '', quantity: null }];
    this.selectedOperatorName = '';
    this.selectedProcessName = '';
    this.selectedGroupOperators = [];
    this.cdr.markForCheck();
  }

  markError(msg: string) {
    this.loading = false;
    this.error = msg;
    this.cdr.markForCheck();
  }
}