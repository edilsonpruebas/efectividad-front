import { Component, Input, Output, EventEmitter, OnChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-reports.html',
  styleUrls: ['./activity-reports.css']
})
export class ActivityReportsComponent implements OnChanges {

  @Input() reports:   any[]         = [];
  @Input() operators: any[]         = [];
  @Input() processes: any[]         = [];
  @Input() loading    = false;
  @Input() saving     = false;
  @Input() error:      string | null = null;
  @Input() saveError:  string | null = null;
  @Input() successMsg: string | null = null;

  @Output() onFilterChange = new EventEmitter<any>();
  @Output() onSave         = new EventEmitter<{ report: any; form: any }>();

  // Filtros
  filterDate       = new Date().toISOString().split('T')[0];
  filterOperatorId = '';
  filterProcessId  = '';
  filterStatus     = '';

  // Edición
  editingId: number | null = null;
  editForm: any = {};

  // Detalle expandido
  expandedId: number | null = null;

  // Paginación
  pageSize    = 20;
  currentPage = 1;

  // Dropdowns
  operatorSearch       = '';
  processSearch        = '';
  operatorDropdownOpen = false;
  processDropdownOpen  = false;

  // ── DOCUMENT CLICK — cerrar dropdowns ────────────────────────────────
  @HostListener('document:click')
  onDocumentClick() {
    this.closeDropdowns();
  }

  // ── PAGINACIÓN ────────────────────────────────────────────────────────

  get totalPages(): number {
    return Math.ceil(this.reports.length / this.pageSize) || 1;
  }

  get paginatedReports(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.reports.slice(start, start + this.pageSize);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  // ── CICLO DE VIDA ─────────────────────────────────────────────────────

  ngOnChanges() {
    if (!this.saving && !this.saveError && this.editingId !== null && this.successMsg) {
      this.editingId = null;
      this.editForm  = {};
    }
  }

  // ── FILTROS ───────────────────────────────────────────────────────────

  applyFilters() {
    this.currentPage = 1;
    this.onFilterChange.emit({
      date:        this.filterDate       || undefined,
      operator_id: this.filterOperatorId || undefined,
      process_id:  this.filterProcessId  || undefined,
      status:      this.filterStatus     || undefined,
    });
  }

  resetFilters() {
    this.filterDate        = new Date().toISOString().split('T')[0];
    this.filterOperatorId  = '';
    this.filterProcessId   = '';
    this.filterStatus      = '';
    this.operatorSearch    = '';
    this.processSearch     = '';
    this.applyFilters();
  }

  // ── DROPDOWNS ─────────────────────────────────────────────────────────

  get filteredOperators(): any[] {
    const q = this.operatorSearch.toLowerCase().trim();
    return q ? this.operators.filter(o => o.name.toLowerCase().includes(q)) : this.operators;
  }

  get filteredProcesses(): any[] {
    const q = this.processSearch.toLowerCase().trim();
    return q ? this.processes.filter(p => p.name.toLowerCase().includes(q)) : this.processes;
  }

  selectOperator(id: string) {
    this.filterOperatorId    = id;
    this.operatorDropdownOpen = false;
    this.operatorSearch       = '';
    this.applyFilters();
  }

  selectProcess(id: string) {
    this.filterProcessId    = id;
    this.processDropdownOpen = false;
    this.processSearch       = '';
    this.applyFilters();
  }

  clearOperator() {
    this.filterOperatorId    = '';
    this.operatorDropdownOpen = false;
    this.operatorSearch       = '';
    this.applyFilters();
  }

  clearProcess() {
    this.filterProcessId    = '';
    this.processDropdownOpen = false;
    this.processSearch       = '';
    this.applyFilters();
  }

  getOperatorName(): string {
    if (!this.filterOperatorId) return 'Todos';
    return this.operators.find(o => String(o.id) === String(this.filterOperatorId))?.name ?? 'Todos';
  }

  getProcessName(): string {
    if (!this.filterProcessId) return 'Todos';
    return this.processes.find(p => String(p.id) === String(this.filterProcessId))?.name ?? 'Todos';
  }

  closeDropdowns() {
    this.operatorDropdownOpen = false;
    this.processDropdownOpen  = false;
  }

  // ── EDICIÓN ───────────────────────────────────────────────────────────

  startEdit(report: any) {
    this.editingId = report.id;
    this.editForm  = {
      operator_id: report.operator?.id ?? report.operator_id ?? '',
      process_id:  report.process?.id  ?? report.process_id  ?? '',
      start_time:  this.toLocalInput(report.start_time),
      end_time:    this.toLocalInput(report.end_time),
      quantity:    report.quantity ?? '',
      notes:       report.notes    ?? '',
    };
  }

  cancelEdit() {
    this.editingId = null;
    this.editForm  = {};
  }

  saveEdit(report: any) {
    this.onSave.emit({ report, form: { ...this.editForm } });
  }

  toggleExpand(id: number) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  // ── HELPERS ───────────────────────────────────────────────────────────

  toLocalInput(ts: string | null): string {
    if (!ts) return '';
    const d   = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  fmt(ts: string | null): string {
    if (!ts) return '—';
    return new Intl.DateTimeFormat('es-VE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(ts));
  }

  duration(start: string, end: string): string {
    if (!start || !end) return '—';
    const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins/60)}h ${mins % 60}m`;
  }

  statusLabel(status: string): string {
    const map: any = { OPEN:'Abierta', STOPPED:'Detenida', CLOSED:'Cerrada', CANCELLED:'Cancelada' };
    return map[status] ?? status;
  }

  statusClass(status: string): string {
    const map: any = { OPEN:'badge-open', STOPPED:'badge-stopped', CLOSED:'badge-closed', CANCELLED:'badge-cancelled' };
    return map[status] ?? '';
  }

  get total()    { return this.reports.length; }
  get nOpen()    { return this.reports.filter(r => r.status === 'OPEN').length; }
  get nStopped() { return this.reports.filter(r => r.status === 'STOPPED').length; }
  get nClosed()  { return this.reports.filter(r => r.status === 'CLOSED').length; }
}