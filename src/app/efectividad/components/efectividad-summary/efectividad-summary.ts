import { Component, Input } from '@angular/core';
import { NgFor, NgIf, NgClass, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-efectividad-summary',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, DecimalPipe],
  templateUrl: './efectividad-summary.html',
  styleUrls: ['./efectividad-summary.css']
})
export class EfectividadSummaryComponent {
  @Input() effectiveness: any = { by_operator: [], by_process: [] };

  sortDirection: 'asc' | 'desc' | null = null;
  processSortDirection: 'asc' | 'desc' | null = null;

  // 🔢 PROPIEDADES DE PAGINACIÓN
  currentPageOperator = 1;
  currentPageProcess = 1;
  itemsPerPage = 5;

  get sortedOperators() {
    if (!this.effectiveness?.by_operator) return [];
    const operators = [...this.effectiveness.by_operator];
    
    if (this.sortDirection === 'asc') {
      return operators.sort((a, b) => (a.weighted_effectiveness || 0) - (b.weighted_effectiveness || 0));
    } else if (this.sortDirection === 'desc') {
      return operators.sort((a, b) => (b.weighted_effectiveness || 0) - (a.weighted_effectiveness || 0));
    }
    
    return operators;
  }

  get sortedProcesses() {
    if (!this.effectiveness?.by_process) return [];
    const processes = [...this.effectiveness.by_process];
    
    if (this.processSortDirection === 'asc') {
      return processes.sort((a, b) => (a.effectiveness || 0) - (b.effectiveness || 0));
    } else if (this.processSortDirection === 'desc') {
      return processes.sort((a, b) => (b.effectiveness || 0) - (a.effectiveness || 0));
    }
    
    return processes;
  }

  // 📄 GETTERS PARA PAGINACIÓN
  get paginatedOperators() {
    const start = (this.currentPageOperator - 1) * this.itemsPerPage;
    return this.sortedOperators.slice(start, start + this.itemsPerPage);
  }

  get paginatedProcesses() {
    const start = (this.currentPageProcess - 1) * this.itemsPerPage;
    return this.sortedProcesses.slice(start, start + this.itemsPerPage);
  }

  get totalOperatorPages() {
    return Math.ceil(this.sortedOperators.length / this.itemsPerPage) || 1;
  }

  get totalProcessPages() {
    return Math.ceil(this.sortedProcesses.length / this.itemsPerPage) || 1;
  }

  sortAsc() {
    this.sortDirection = 'asc';
    this.currentPageOperator = 1;
  }

  sortDesc() {
    this.sortDirection = 'desc';
    this.currentPageOperator = 1;
  }

  sortProcessesAsc() {
    this.processSortDirection = 'asc';
    this.currentPageProcess = 1;
  }

  sortProcessesDesc() {
    this.processSortDirection = 'desc';
    this.currentPageProcess = 1;
  }

  // 🔘 MÉTODOS DE NAVEGACIÓN
  prevPageOperator() {
    if (this.currentPageOperator > 1) this.currentPageOperator--;
  }

  nextPageOperator() {
    if (this.currentPageOperator < this.totalOperatorPages) this.currentPageOperator++;
  }

  prevPageProcess() {
    if (this.currentPageProcess > 1) this.currentPageProcess--;
  }

  nextPageProcess() {
    if (this.currentPageProcess < this.totalProcessPages) this.currentPageProcess++;
  }

  badgeClass(value: number | null): string {
    if (value === null) return 'badge-neutral';
    if (value >= 90)   return 'badge-high';
    if (value >= 70)   return 'badge-mid';
    return 'badge-low';
  }

  badgeLabel(value: number | null): string {
    if (value === null) return '—';
    return value + '%';
  }
}