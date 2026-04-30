import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  BehaviorSubject, Subject, switchMap, takeUntil, tap, catchError, of,
  Observable
} from 'rxjs';
// 🔥 IMPORTANTE: Agregamos UpdateOperatorDto a la importación
import { UpdateProcessDto, UpdateOperatorDto } from '../pages/efectividad-admin-container/efectividad-admin-container';

export interface EfectividadFilter {
  date_from:   string | null;
  date_to:     string | null;
  operator_id: number | null;
  process_id:  number | null;
}

@Injectable({ providedIn: 'root' })
export class EfectividadService {

  private api     = `${environment.apiUrl}/activities/dashboard`;
  private baseApi = environment.apiUrl;
  private POLL_MS = 10000;

  private filters$ = new BehaviorSubject<EfectividadFilter>({
    date_from:   new Date().toISOString().split('T')[0],
    date_to:     new Date().toISOString().split('T')[0],
    operator_id: null,
    process_id:  null
  });

  private dataSubject    = new BehaviorSubject<any>({
    activities:    [],
    metrics:       {},
    effectiveness: { by_operator: [], by_process: [] }
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private destroy$       = new Subject<void>();

  data$    = this.dataSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  startPolling() {
    this.destroy$ = new Subject<void>();
    this.filters$
      .pipe(
        tap(() => this.loadingSubject.next(true)),
        switchMap(f => {
          let params = new HttpParams();
          if (f.date_from)   params = params.set('date_from',   f.date_from);
          if (f.date_to)     params = params.set('date_to',     f.date_to);
          if (f.operator_id) params = params.set('operator_id', String(f.operator_id));
          if (f.process_id)  params = params.set('process_id',  String(f.process_id));

          return this.http.get<any>(this.api, { params }).pipe(
            catchError(err => {
              console.error('Error dashboard:', err);
              return of(null);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        this.loadingSubject.next(false);
        if (!data) return;
        this.dataSubject.next({
          activities:    data.activities    ?? [],
          metrics:       data.metrics       ?? {},
          effectiveness: data.effectiveness ?? { by_operator: [], by_process: [] }
        });
      });
  }

  setFilters(filters: EfectividadFilter) {
    this.filters$.next(filters);
  }

  stopPolling() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getOperators() {
    return this.http.get<any[]>(`${this.baseApi}/operators/active`);
  }

  getProcesses() {
    return this.http.get<any[]>(`${this.baseApi}/processes`);
  }

  getAllOperators() {
    return this.http.get<any[]>(`${this.baseApi}/operators`);
  }

  // Ahora solo envía { name: string }
  createOperator(dto: { name: string }) {
    return this.http.post<{ message: string; data: any }>(`${this.baseApi}/operators`, dto);
  }

  toggleOperator(id: number) {
    return this.http.patch<{ message: string; data: any }>(`${this.baseApi}/operators/${id}/toggle`, {});
  }

  deleteOperator(id: number) {
    return this.http.delete<{ message: string }>(`${this.baseApi}/operators/${id}`);
  }

  // 🔥 NUEVO: Método para actualizar el operador
  updateOperator(id: number, dto: UpdateOperatorDto): Observable<any> {
    return this.http.put(`${this.baseApi}/operators/${id}`, dto);
  }

  getAllProcesses() {
    return this.http.get<any[]>(`${this.baseApi}/processes/all`);
  }

  createProcess(dto: { name: string; description?: string; base_per_hour: number }) {
    return this.http.post<{ message: string; data: any }>(`${this.baseApi}/processes`, dto);
  }

  toggleProcess(id: number) {
    return this.http.patch<{ message: string; data: any }>(`${this.baseApi}/processes/${id}/toggle`, {});
  }

  deleteProcess(id: number) {
    return this.http.delete<{ message: string }>(`${this.baseApi}/processes/${id}`);
  }
  
  updateProcess(id: number, dto: UpdateProcessDto): Observable<any> {
    return this.http.put(`${this.baseApi}/processes/${id}`, dto);
  }
}