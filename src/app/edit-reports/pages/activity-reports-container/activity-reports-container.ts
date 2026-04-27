import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityReportsComponent } from '../../components/activity-reports/activity-reports';
import { ActivityReportsService } from '../../services/activity-reports';

@Component({
  selector: 'app-activity-reports-container',
  standalone: true,
  imports: [CommonModule, ActivityReportsComponent],
  template: `
    <app-activity-reports
      [reports]="reports"
      [operators]="operators"
      [processes]="processes"
      [loading]="loading"
      [saving]="saving"
      [error]="error"
      [saveError]="saveError"
      [successMsg]="successMsg"
      (onFilterChange)="applyFilters($event)"
      (onSave)="save($event)"
    />
  `
})
export class ActivityReportsContainerComponent implements OnInit {

  reports:   any[] = [];
  operators: any[] = [];
  processes: any[] = [];
  loading  = false;
  saving   = false;
  error:      string | null = null;
  saveError:  string | null = null;
  successMsg: string | null = null;

  private currentFilters: any = {};

  constructor(
    private service: ActivityReportsService,
    private cdr: ChangeDetectorRef   // ← inyectar
  ) {}

  ngOnInit() {
    this.loadCatalogs();
    const today = new Date().toISOString().split('T')[0];
    this.currentFilters = { date: today };
    this.loadReports(this.currentFilters);
  }

  private loadCatalogs() {
    this.service.getOperators().subscribe(data => {
      this.operators = data ?? [];
      this.cdr.detectChanges(); // ←
    });
    this.service.getProcesses().subscribe(data => {
      this.processes = data ?? [];
      this.cdr.detectChanges(); // ←
    });
  }

  loadReports(filters: any = {}) {
    this.loading = true;
    this.error   = null;
    this.cdr.detectChanges(); // ← mostrar spinner inmediatamente
    this.service.getAll(filters).subscribe({
      next: data => {
        this.reports = data ?? [];
        this.loading = false;
        this.cdr.detectChanges(); // ←
      },
      error: err => {
        this.error   = err.error?.error ?? err.message;
        this.loading = false;
        this.cdr.detectChanges(); // ←
      }
    });
  }

  applyFilters(filters: any) {
    this.currentFilters = filters;
    this.loadReports(filters);
  }

  save(event: { report: any; form: any }) {
    this.saving    = true;
    this.saveError = null;
    this.cdr.detectChanges(); // ← mostrar spinner de guardado

    const { report, form } = event;

    const onlyNotes =
      form.notes !== (report.notes ?? '') &&
      +form.operator_id === (report.operator?.id ?? report.operator_id) &&
      +form.process_id  === (report.process?.id  ?? report.process_id)  &&
      +form.quantity    === report.quantity;

    const call$ = onlyNotes
      ? this.service.updateNote(report.id, form.notes)
      : this.service.update(report.id, {
          operator_id: +form.operator_id,
          process_id:  +form.process_id,
          start_time:  form.start_time
            ? new Date(form.start_time).toISOString()
            : undefined,
          end_time: form.end_time
            ? new Date(form.end_time).toISOString()
            : undefined,
          quantity: +form.quantity,
          notes:    form.notes || null,
        });

    call$.subscribe({
      next: () => {
        this.saving     = false;
        this.successMsg = 'Reporte editado correctamente';
        this.cdr.detectChanges(); // ←
        setTimeout(() => {
          this.successMsg = null;
          this.cdr.detectChanges(); // ← limpiar mensaje
        }, 3000);
        this.loadReports(this.currentFilters);
      },
      error: err => {
        this.saving    = false;
        this.saveError = err.error?.error ?? err.message;
        this.cdr.detectChanges(); // ←
      }
    });
  }
}