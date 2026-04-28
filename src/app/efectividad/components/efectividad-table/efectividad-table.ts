import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgFor, NgIf, NgClass, DatePipe } from '@angular/common';
 
@Component({
  selector: 'app-efectividad-table',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, DatePipe],
  templateUrl: './efectividad-table.html',
  styleUrls: ['./efectividad-table.css']
})
export class EfectividadTableComponent implements OnChanges {
 
  @Input() activities: any[] = [];
 
  currentPage: number = 1;
  itemsPerPage: number = 10;
 
  consolidatedActivities: any[] = [];
 
  // 🔥 Set de IDs expandidos
  expandedRows = new Set<string>();
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activities']) {
      this.consolidateData();
      this.currentPage = 1;
      this.expandedRows.clear();
    }
  }
 
  consolidateData() {
    const map = new Map<string, any>();
 
    for (const act of this.activities) {
      const operatorId = act.operator?.id ?? 'no-op';
      const processId  = act.process?.id ?? 'no-pr';
      const key = `${operatorId}-${processId}`;
 
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          operator: act.operator,
          process: act.process,
          start_time: act.start_time,
          end_time: act.end_time,
          total_minutes: this.getMinutes(act),
          quantity: act.quantity ?? 0,
          status: act.status,
          notes: act.notes ? [act.notes] : [],
          // 🔥 Guardamos los registros individuales
          rawItems: [act]
        });
      } else {
        const existing = map.get(key);
 
        existing.total_minutes += this.getMinutes(act);
        existing.quantity += act.quantity ?? 0;
        existing.rawItems.push(act);
 
        if (act.notes) existing.notes.push(act.notes);
 
        if (act.start_time < existing.start_time) {
          existing.start_time = act.start_time;
        }
 
        if (act.end_time && (!existing.end_time || act.end_time > existing.end_time)) {
          existing.end_time = act.end_time;
        }
      }
    }
 
    this.consolidatedActivities = Array.from(map.values()).map(item => ({
      ...item,
      notes: item.notes.length ? [...new Set(item.notes)].join(' | ') : '—'
    }));
  }
 
  // 🔥 Toggle expansión
  toggleRow(id: string): void {
    if (this.expandedRows.has(id)) {
      this.expandedRows.delete(id);
    } else {
      this.expandedRows.add(id);
    }
  }
 
  isExpanded(id: string): boolean {
    return this.expandedRows.has(id);
  }
 
  // 📄 PAGINACIÓN
  get paginatedActivities(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex   = startIndex + this.itemsPerPage;
    return this.consolidatedActivities.slice(startIndex, endIndex);
  }
 
  get totalPages(): number {
    return Math.ceil(this.consolidatedActivities.length / this.itemsPerPage);
  }
 
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
 
  getMinutes(act: any): number {
    if (!act.start_time || !act.end_time) return 0;
    const start = new Date(act.start_time).getTime();
    const end   = new Date(act.end_time).getTime();
    return Math.max(0, Math.floor((end - start) / 60000));
  }
 
  durationMinutes(act: any): string {
    return act.total_minutes > 0 ? String(act.total_minutes) : '—';
  }
 
  durationMinutesRaw(act: any): string {
    const mins = this.getMinutes(act);
    return mins > 0 ? String(mins) : '—';
  }
 
  statusLabel(s: string) {
    return {
      'OPEN': '🟢 En proceso',
      'CLOSED': '✅ Finalizada',
      'CANCELLED': '❌ Cancelada'
    }[s] ?? s;
  }
 
  statusClass(s: string) {
    return {
      'OPEN': 'badge-open',
      'CLOSED': 'badge-closed',
      'CANCELLED': 'badge-cancelled'
    }[s] ?? '';
  }
 
  trackByFn(index: number, item: any) {
    return item.id;
  }
 
  trackByRaw(index: number, item: any) {
    return item.id;
  }
}