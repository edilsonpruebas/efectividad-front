import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Operator, Process, CreateOperatorDto, CreateProcessDto
} from '../../pages/efectividad-admin-container/efectividad-admin-container';

@Component({
  selector: 'app-efectividad-admin',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule],
  templateUrl: './efectividad-admin.html',
  styleUrls: ['./efectividad-admin.css']
})
export class EfectividadAdminComponent {

  @Input() operators: Operator[] = [];
  @Input() processes: Process[]  = [];
  @Input() loading               = false;

  @Output() createOperator = new EventEmitter<CreateOperatorDto>();
  @Output() toggleOperator = new EventEmitter<number>();
  @Output() deleteOperator = new EventEmitter<number>();
  @Output() createProcess  = new EventEmitter<CreateProcessDto>();
  @Output() toggleProcess  = new EventEmitter<number>();
  @Output() deleteProcess  = new EventEmitter<number>();

  activeTab: 'operators' | 'processes' = 'operators';

  newOperator: CreateOperatorDto = { name: '', email: '', password: '' };
  showOperatorForm               = false;

  newProcess: CreateProcessDto = { name: '', description: '', base_per_hour: 0 };
  showProcessForm               = false;

  confirmDeleteId:   number | null            = null;
  confirmDeleteType: 'operator' | 'process' | null = null;

  // 🔍 PROPIEDADES PARA BÚSQUEDA Y PAGINACIÓN
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // GETTERS PARA OPERADORES (FILTRADO + PAGINACIÓN)
  get filteredOperators(): Operator[] {
    if (!this.searchQuery) return this.operators;
    const q = this.searchQuery.toLowerCase();
    return this.operators.filter(op => op.name.toLowerCase().includes(q));
  }

  get paginatedOperators(): Operator[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOperators.slice(start, start + this.itemsPerPage);
  }

  get totalOperatorPages(): number {
    return Math.ceil(this.filteredOperators.length / this.itemsPerPage) || 1;
  }

  // GETTERS PARA PROCESOS (FILTRADO + PAGINACIÓN)
  get filteredProcesses(): Process[] {
    if (!this.searchQuery) return this.processes;
    const q = this.searchQuery.toLowerCase();
    return this.processes.filter(pr => pr.name.toLowerCase().includes(q));
  }

  get paginatedProcesses(): Process[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProcesses.slice(start, start + this.itemsPerPage);
  }

  get totalProcessPages(): number {
    return Math.ceil(this.filteredProcesses.length / this.itemsPerPage) || 1;
  }

  // MÉTODOS DE PAGINACIÓN
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(totalPages: number) {
    if (this.currentPage < totalPages) this.currentPage++;
  }

  resetFilters() {
    this.searchQuery = '';
    this.currentPage = 1;
  }

  submitOperator() {
    if (!this.newOperator.name || !this.newOperator.email || !this.newOperator.password) return;
    this.createOperator.emit({ ...this.newOperator });
    this.newOperator     = { name: '', email: '', password: '' };
    this.showOperatorForm = false;
  }

  submitProcess() {
    if (!this.newProcess.name || !this.newProcess.base_per_hour) return;
    this.createProcess.emit({ ...this.newProcess });
    this.newProcess     = { name: '', description: '', base_per_hour: 0 };
    this.showProcessForm = false;
  }

  askDelete(id: number, type: 'operator' | 'process') {
    this.confirmDeleteId   = id;
    this.confirmDeleteType = type;
  }

  confirmDelete() {
    if (this.confirmDeleteType === 'operator') this.deleteOperator.emit(this.confirmDeleteId!);
    if (this.confirmDeleteType === 'process')  this.deleteProcess.emit(this.confirmDeleteId!);
    this.confirmDeleteId   = null;
    this.confirmDeleteType = null;
  }

  cancelDelete() {
    this.confirmDeleteId   = null;
    this.confirmDeleteType = null;
  }
}