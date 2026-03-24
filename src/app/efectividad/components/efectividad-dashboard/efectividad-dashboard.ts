import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EfectividadFiltersComponent } from '../efectividad-filters/efectividad-filters';
import { EfectividadTableComponent } from '../efectividad-table/efectividad-table';
import { EfectividadSummaryComponent } from '../efectividad-summary/efectividad-summary';
import { NgIf, DecimalPipe } from '@angular/common';
import { EfectividadFilter } from '../../services/efectividad';

@Component({
  selector: 'app-efectividad-dashboard',
  standalone: true,
  imports: [
    EfectividadFiltersComponent,
    EfectividadTableComponent,
    EfectividadSummaryComponent, // ✅ nuevo
    NgIf,
    DecimalPipe
  ],
  templateUrl: './efectividad-dashboard.html',
  styleUrls: ['./efectividad-dashboard.css']
})
export class EfectividadDashboardComponent {
  @Input() activities: any[]    = [];
  @Input() metrics: any         = {};
  @Input() effectiveness: any   = { by_operator: [], by_process: [] }; // ✅ nuevo
  @Input() operators: any[]     = [];
  @Input() processes: any[]     = [];
  @Input() loading: boolean     = false;

  @Output() onFilter = new EventEmitter<EfectividadFilter>();
}