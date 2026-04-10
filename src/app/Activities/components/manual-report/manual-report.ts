import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Directive, ElementRef, HostListener,  } from '@angular/core';

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
    if (!clickedInside) {
      this.clickOutside.emit();
    }
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

  // Control de dropdowns
  operatorDropdownOpen = false;
  processDropdownOpen = false;

  // Términos de búsqueda
  operatorSearchTerm = '';
  processSearchTerm = '';

  // Timeout de seguridad para estado de carga
  private loadingTimeout: any;

  form = {
    operator_id: null as number | null,
    process_id:  null as number | null,
    start_time:  '',
    end_time:    '',
    quantity:    null as number | null
  };

  constructor(private cdr: ChangeDetectorRef) {}

  // --- Getters para filtrado ---
  get filteredOperators() {
    if (!this.operatorSearchTerm) return this.operators;
    const term = this.operatorSearchTerm.toLowerCase();
    return this.operators.filter(op => op.name.toLowerCase().includes(term));
  }

  get filteredProcesses() {
    if (!this.processSearchTerm) return this.processes;
    const term = this.processSearchTerm.toLowerCase();
    return this.processes.filter(pr => pr.name.toLowerCase().includes(term));
  }

  // --- Nombres para mostrar en el botón del dropdown ---
  get selectedOperatorName(): string {
    const op = this.operators.find(o => o.id === this.form.operator_id);
    return op ? op.name : '';
  }

  get selectedProcessName(): string {
    const pr = this.processes.find(p => p.id === this.form.process_id);
    return pr ? pr.name : '';
  }

  // --- Métodos para dropdowns ---
  toggleOperatorDropdown() {
    this.operatorDropdownOpen = !this.operatorDropdownOpen;
    this.processDropdownOpen = false;
    if (this.operatorDropdownOpen) {
      this.operatorSearchTerm = '';
    }
  }

  toggleProcessDropdown() {
    this.processDropdownOpen = !this.processDropdownOpen;
    this.operatorDropdownOpen = false;
    if (this.processDropdownOpen) {
      this.processSearchTerm = '';
    }
  }

  selectOperator(op: any) {
    this.form.operator_id = op.id;
    this.operatorDropdownOpen = false;
    this.operatorSearchTerm = '';
    this.cdr.detectChanges(); // Actualiza clase 'filled'
  }

  selectProcess(pr: any) {
    this.form.process_id = pr.id;
    this.processDropdownOpen = false;
    this.processSearchTerm = '';
    this.cdr.detectChanges();
  }

  // --- Validación y duración (sin cambios) ---
  isFormValid(): boolean {
    return !!this.form.operator_id && 
           !!this.form.process_id && 
           !!this.form.start_time && 
           !!this.form.end_time && 
           !!this.form.quantity && 
           this.form.quantity > 0;
  }

  calculateDuration(): string {
    if (!this.form.start_time || !this.form.end_time) return '';
    
    const start = new Date(this.form.start_time);
    const end = new Date(this.form.end_time);
    const diffMinutes = (end.getTime() - start.getTime()) / 1000 / 60;
    
    if (diffMinutes < 0) return 'Verificar fechas';
    if (diffMinutes === 0) return '0 minutos';
    if (diffMinutes < 60) return `${Math.round(diffMinutes)} minutos`;
    
    const hours = Math.floor(diffMinutes / 60);
    const mins = Math.round(diffMinutes % 60);
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }

  // --- Envío del formulario ---
  submit() {
    this.success = false;
    this.error   = '';

    if (!this.form.operator_id || !this.form.process_id ||
        !this.form.start_time  || !this.form.end_time   ||
        this.form.quantity === null) {
      this.error = 'Todos los campos son obligatorios.';
      this.cdr.detectChanges();
      return;
    }

    if (new Date(this.form.end_time) <= new Date(this.form.start_time)) {
      this.error = 'La hora final debe ser posterior a la hora de inicio.';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    // Timeout de seguridad: 10 segundos
    this.loadingTimeout = setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.error = 'La operación está tomando más tiempo de lo esperado. Intente nuevamente.';
        this.cdr.detectChanges();
      }
    }, 10000);

    this.onSubmit.emit({ ...this.form });
  }

  // --- Métodos llamados por el padre ---
  markSuccess() {
    this.clearLoadingTimeout();
    this.loading = false;
    this.success = true;
    this.form = {
      operator_id: null,
      process_id:  null,
      start_time:  '',
      end_time:    '',
      quantity:    null
    };
    // Limpiar estados de dropdown y búsqueda
    this.operatorDropdownOpen = false;
    this.processDropdownOpen = false;
    this.operatorSearchTerm = '';
    this.processSearchTerm = '';
    this.cdr.detectChanges(); // <-- Forzar actualización de vista
  }

  markError(msg: string) {
    this.clearLoadingTimeout();
    this.loading = false;
    this.error   = msg;
    this.cdr.detectChanges(); // <-- Forzar actualización de vista
  }

  private clearLoadingTimeout() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
  }
}