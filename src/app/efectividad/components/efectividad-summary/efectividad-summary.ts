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