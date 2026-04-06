import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { EfectividadFilter } from '../../services/efectividad';

@Component({
  selector: 'app-efectividad-filters',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
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

  operatorSearch: string = '';
  processSearch:  string = '';

  operatorOpen: boolean = false;
  processOpen:  boolean = false;

  operatorLabel: string = 'Todos';
  processLabel:  string = 'Todos';

  ngOnInit() {
    const today = new Date().toISOString().split('T')[0];
    this.filters.date_from = today;
    this.filters.date_to   = today;
    this.emit();
  }

  get filteredOperators(): any[] {
    const q = this.operatorSearch.toLowerCase();
    return this.operators.filter(op => op.name.toLowerCase().includes(q));
  }

  get filteredProcesses(): any[] {
    const q = this.processSearch.toLowerCase();
    return this.processes.filter(pr => pr.name.toLowerCase().includes(q));
  }

  selectOperator(id: number | null, name: string) {
    this.filters.operator_id = id;
    this.operatorLabel       = name;
    this.operatorOpen        = false;
    this.operatorSearch      = '';
    this.emit();
  }

  selectProcess(id: number | null, name: string) {
    this.filters.process_id = id;
    this.processLabel       = name;
    this.processOpen        = false;
    this.processSearch      = '';
    this.emit();
  }

  toggleOperator() {
    this.operatorOpen = !this.operatorOpen;
    this.processOpen  = false;
  }

  toggleProcess() {
    this.processOpen  = !this.processOpen;
    this.operatorOpen = false;
  }

  emit() {
    this.onFilter.emit({ ...this.filters });
  }

  clear() {
    const today = new Date().toISOString().split('T')[0];
    this.filters        = { date_from: today, date_to: today, operator_id: null, process_id: null };
    this.operatorLabel  = 'Todos';
    this.processLabel   = 'Todos';
    this.operatorOpen   = false;
    this.processOpen    = false;
    this.operatorSearch = '';
    this.processSearch  = '';
    this.emit();
  }
}