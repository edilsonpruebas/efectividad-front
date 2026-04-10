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

  currentPageOperator = 1;
  currentPageProcess = 1;
  itemsPerPage = 5;

  private expandedMap = new Map<string, boolean>();

  isExpanded(op: any): boolean {
    return this.expandedMap.get(op.name) ?? false;
  }

  toggleExpanded(op: any): void {
    const current = this.expandedMap.get(op.name) ?? false;
    this.expandedMap.set(op.name, !current);
  }

  get sortedOperators() {
    if (!this.effectiveness?.by_operator) return [];

    const operators = this.effectiveness.by_operator.map((op: any) => {
      const consolidatedActivities = this.consolidateActivities(op.activities || []);

      const total_standard = consolidatedActivities.reduce((sum: number, a: any) => sum + (a.standard || 0), 0);
      const total_real = consolidatedActivities.reduce((sum: number, a: any) => sum + (a.real || 0), 0);
      const effectiveness = total_standard > 0 ? Math.round((total_real / total_standard) * 100) : null;
      const weighted_effectiveness = this.calculateWeightedEffectiveness(consolidatedActivities);

      const total_time = consolidatedActivities.reduce(
        (acc: any, a: any) => this.sumTimes(acc, a.time),
        '00:00:00'
      );

      return {
        ...op,
        activities: consolidatedActivities,
        activities_count: consolidatedActivities.length,
        total_standard,
        total_real,
        total_time,
        effectiveness,
        weighted_effectiveness
      };
    });

    if (this.sortDirection === 'asc') {
      return [...operators].sort((a, b) => (a.weighted_effectiveness || 0) - (b.weighted_effectiveness || 0));
    } else if (this.sortDirection === 'desc') {
      return [...operators].sort((a, b) => (b.weighted_effectiveness || 0) - (a.weighted_effectiveness || 0));
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

  private consolidateActivities(activities: any[]): any[] {
    const map = new Map<string, any>();

    for (const act of activities) {
      const key = act.name;

      if (map.has(key)) {
        const existing = map.get(key);
        existing.standard += act.standard || 0;
        existing.real     += act.real || 0;
        existing.time      = this.sumTimes(existing.time, act.time);
      } else {
        map.set(key, { ...act, time: act.time ?? '00:00:00' });
      }
    }

    return Array.from(map.values()).map(a => ({
      ...a,
      effectiveness: a.standard > 0 ? Math.round((a.real / a.standard) * 100) : null
    }));
  }

  private calculateWeightedEffectiveness(activities: any[]): number | null {
    const total_standard = activities.reduce((s, a) => s + (a.standard || 0), 0);
    if (total_standard === 0) return null;

    const weighted = activities.reduce((s, a) => {
      const eff = a.standard > 0 ? (a.real / a.standard) * 100 : 0;
      return s + eff * (a.standard / total_standard);
    }, 0);

    return Math.round(weighted);
  }

  private sumTimes(t1: any, t2: any): string {
  const toSeconds = (t: any): number => {
    if (t === null || t === undefined || t === '—' || t === '') return 0;

    if (typeof t === 'number') return t;

    const str = String(t).trim();

    // Formato "1h 0min" o "1h 30min" o "2h" o "45min"
    const humanMatch = str.match(/^(?:(\d+)h)?\s*(?:(\d+)min)?$/);
    if (humanMatch && (humanMatch[1] || humanMatch[2])) {
      const hours = parseInt(humanMatch[1] || '0');
      const mins  = parseInt(humanMatch[2] || '0');
      return hours * 3600 + mins * 60;
    }

    // Formato HH:MM:SS
    const hms = str.match(/^(\d+):(\d{2}):(\d{2})$/);
    if (hms) return parseInt(hms[1]) * 3600 + parseInt(hms[2]) * 60 + parseInt(hms[3]);

    // Formato HH:MM
    const hm = str.match(/^(\d+):(\d{2})$/);
    if (hm) return parseInt(hm[1]) * 3600 + parseInt(hm[2]) * 60;

    // Formato "90m" o "90min"
    const minOnly = str.match(/^(\d+)\s*m/i);
    if (minOnly) return parseInt(minOnly[1]) * 60;

    return 0;
  };

  const total = toSeconds(t1) + toSeconds(t2);
  if (total === 0) return '—';

  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

  sortAsc() { this.sortDirection = 'asc'; this.currentPageOperator = 1; }
  sortDesc() { this.sortDirection = 'desc'; this.currentPageOperator = 1; }
  sortProcessesAsc() { this.processSortDirection = 'asc'; this.currentPageProcess = 1; }
  sortProcessesDesc() { this.processSortDirection = 'desc'; this.currentPageProcess = 1; }

  prevPageOperator() { if (this.currentPageOperator > 1) this.currentPageOperator--; }
  nextPageOperator() { if (this.currentPageOperator < this.totalOperatorPages) this.currentPageOperator++; }
  prevPageProcess() { if (this.currentPageProcess > 1) this.currentPageProcess--; }
  nextPageProcess() { if (this.currentPageProcess < this.totalProcessPages) this.currentPageProcess++; }

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