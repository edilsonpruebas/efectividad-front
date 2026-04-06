import { Component, Input } from '@angular/core';
import { NgFor, NgIf, NgClass, DatePipe } from '@angular/common';

@Component({
  selector: 'app-efectividad-table',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, DatePipe],
  templateUrl: './efectividad-table.html',
  styleUrls: ['./efectividad-table.css']
})
export class EfectividadTableComponent {
  @Input() activities: any[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;

  get paginatedActivities(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex   = startIndex + this.itemsPerPage;
    return this.activities.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.activities.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  durationMinutes(act: any): string {
    if (!act.start_time || !act.end_time) return '—';
    const start = new Date(act.start_time).getTime();
    const end   = new Date(act.end_time).getTime();
    const diff  = Math.floor((end - start) / 60000);
    return diff > 0 ? String(diff) : '—';
  }

  statusLabel(s: string) {
    return { 'OPEN': '🟢 En proceso', 'CLOSED': '✅ Finalizada', 'CANCELLED': '❌ Cancelada' }[s] ?? s;
  }

  statusClass(s: string) {
    return { 'OPEN': 'badge-open', 'CLOSED': 'badge-closed', 'CANCELLED': 'badge-cancelled' }[s] ?? '';
  }
}