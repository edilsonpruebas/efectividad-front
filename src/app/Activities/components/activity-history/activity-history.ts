import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity-history',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, DatePipe],
  templateUrl: './activity-history.html',
  styleUrls: ['./activity-history.css']
})
export class ActivityHistoryComponent implements OnChanges {

  @Input() history: any[]         = [];
  @Input() supervisorId: number | null = null;  // ID del usuario logueado
  @Input() isSupervisor: boolean  = false;      // true si role === 'SUPERVISOR'

  selectedDate: string = '';   // 'YYYY-MM-DD' o vacío = todos
  page: number         = 1;
  pageSize: number     = 10;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['history']) {
      this.page = 1; // reset al recibir nuevos datos
    }
  }

  // ── FILTRO ─────────────────────────────────────────────────────────────

  get filteredHistory(): any[] {
    let data = this.history;

    console.log('👤 supervisorId:', this.supervisorId);
  console.log('🔍 isSupervisor:', this.isSupervisor);
  console.log('📋 primer registro:', data[0]); // ← mira qué campos llegan

    // Supervisores solo ven sus propios registros
    if (this.isSupervisor && this.supervisorId !== null) {
      data = data.filter(h => h.submitted_by === this.supervisorId);
    }

    // Filtro por día
    if (this.selectedDate) {
      data = data.filter(h => {
        const d = new Date(h.start_time);
        const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        return iso === this.selectedDate;
      });
    }

    return data;
  }

  // ── PAGINACIÓN ──────────────────────────────────────────────────────────

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredHistory.length / this.pageSize));
  }

  get paginatedHistory(): any[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredHistory.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(n: number): void {
    if (n >= 1 && n <= this.totalPages) this.page = n;
  }

  // ── FILTRO FECHA ────────────────────────────────────────────────────────

  setToday(): void {
    const today = new Date();
    this.selectedDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    this.page = 1;
  }

  setYesterday(): void {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    this.selectedDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    this.page = 1;
  }

  isToday(): boolean {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    return this.selectedDate === today;
  }

  isYesterday(): boolean {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yest = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    return this.selectedDate === yest;
  }

  clearFilter(): void {
    this.selectedDate = '';
    this.page = 1;
  }

  onDateChange(): void {
    this.page = 1;
  }
}