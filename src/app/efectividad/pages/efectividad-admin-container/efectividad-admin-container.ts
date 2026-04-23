import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EfectividadAdminComponent } from '../../components/efectividad-admin/efectividad-admin';
import { EfectividadService } from '../../services/efectividad';
import { HttpErrorResponse } from '@angular/common/http';

export interface Operator {
  id:        number;
  name:      string;
  email:     string;
  is_active: boolean;
}

export interface Process {
  id:            number;
  name:          string;
  description:   string | null;
  base_per_hour: number;
  is_active:     boolean;
}

export interface CreateOperatorDto {
  name: string;
}

export interface CreateProcessDto {
  name:          string;
  description?:  string;
  base_per_hour: number;
}

export interface UpdateProcessDto {
  name?:          string;
  description?:   string;
  base_per_hour?: number;
}

@Component({
  selector: 'app-efectividad-admin-container',
  standalone: true,
  imports: [EfectividadAdminComponent],
  template: `
    <app-efectividad-admin
      [operators]="operators"
      [processes]="processes"
      [loading]="loading"
      (createOperator)="onCreateOperator($event)"
      (toggleOperator)="onToggleOperator($event)"
      (deleteOperator)="onDeleteOperator($event)"
      (createProcess)="onCreateProcess($event)"
      (toggleProcess)="onToggleProcess($event)"
      (deleteProcess)="onDeleteProcess($event)"
      (updateProcess)="onUpdateProcess($event)">
    </app-efectividad-admin>
  `
})
export class EfectividadAdminContainerComponent implements OnInit, OnDestroy {

  operators: Operator[] = [];
  processes: Process[]  = [];
  loading               = false;

  private destroy$ = new Subject<void>();

  constructor(private service: EfectividadService) {}

  ngOnInit() {
    this.loadOperators();
    this.loadProcesses();
  }

  loadOperators() {
    this.service.getAllOperators()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: d => this.operators = d });
  }

  loadProcesses() {
    this.service.getAllProcesses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: d => this.processes = d });
  }

  onCreateOperator(dto: CreateOperatorDto) {
    this.service.createOperator(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:  () => this.loadOperators(),
        error: e  => alert(e?.error?.message ?? 'Error al crear operador')
      });
  }

  onToggleOperator(id: number) {
    this.service.toggleOperator(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: () => this.loadOperators() });
  }

  onDeleteOperator(id: number) {
    this.service.deleteOperator(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:  () => this.loadOperators(),
        error: e  => alert(e?.error?.message ?? 'Error al eliminar operador')
      });
  }

  onCreateProcess(dto: CreateProcessDto) {
    this.service.createProcess(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:  () => this.loadProcesses(),
        error: e  => alert(e?.error?.message ?? 'Error al crear proceso')
      });
  }

  onToggleProcess(id: number) {
    this.service.toggleProcess(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: () => this.loadProcesses() });
  }

  onDeleteProcess(id: number) {
    this.service.deleteProcess(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:  () => this.loadProcesses(),
        error: e  => alert(e?.error?.message ?? 'Error al eliminar proceso')
      });
  }

  onUpdateProcess(payload: { id: number; dto: UpdateProcessDto }) {
    this.service.updateProcess(payload.id, payload.dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:  () => this.loadProcesses(),
        error: (e: HttpErrorResponse) => alert(e?.error?.message ?? 'Error al actualizar proceso')
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}