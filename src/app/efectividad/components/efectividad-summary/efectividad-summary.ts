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

  sortAsc() {
    this.sortDirection = 'asc';
  }

  sortDesc() {
    this.sortDirection = 'desc';
  }

  sortProcessesAsc() {
    this.processSortDirection = 'asc';
  }

  sortProcessesDesc() {
    this.processSortDirection = 'desc';
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