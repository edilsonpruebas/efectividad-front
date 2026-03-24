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

  statusLabel(s: string) {
    return { 'OPEN': '🟢 En proceso', 'CLOSED': '✅ Finalizada', 'CANCELLED': '❌ Cancelada' }[s] ?? s;
  }

  statusClass(s: string) {
    return { 'OPEN': 'badge-open', 'CLOSED': 'badge-closed', 'CANCELLED': 'badge-cancelled' }[s] ?? '';
  }
}