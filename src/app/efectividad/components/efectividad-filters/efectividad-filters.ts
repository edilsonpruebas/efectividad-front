import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { EfectividadFilter } from '../../services/efectividad';

@Component({
  selector: 'app-efectividad-filters',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './efectividad-filters.html',
  styleUrls: ['./efectividad-filters.css']
})
export class EfectividadFiltersComponent implements OnInit {

  @Input() operators: any[] = [];
  @Input() processes: any[] = [];
  @Output() onFilter = new EventEmitter<EfectividadFilter>();

  filters: EfectividadFilter = {
    date_from:   null,
    date_to:     null,
    operator_id: null,
    process_id:  null
  };

  ngOnInit() {
    const today        = new Date().toISOString().split('T')[0];
    this.filters.date_from = today;
    this.filters.date_to   = today;
    this.emit();
  }

  emit() {
    this.onFilter.emit({ ...this.filters });
  }

  clear() {
    const today = new Date().toISOString().split('T')[0];
    this.filters = { date_from: today, date_to: today, operator_id: null, process_id: null };
    this.emit();
  }
}