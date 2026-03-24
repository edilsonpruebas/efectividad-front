import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, interval, switchMap, startWith, takeUntil, Subject } from 'rxjs';

export interface EfectividadFilter {
  date_from:   string | null;
  date_to:     string | null;
  operator_id: number | null;
  process_id:  number | null;
}

@Injectable({ providedIn: 'root' })
export class EfectividadService {

  private api     = 'http://localhost:8000/api/activities/dashboard';
  private POLL_MS = 10000;

  private filters$ = new BehaviorSubject<EfectividadFilter>({
    date_from:   new Date().toISOString().split('T')[0],
    date_to:     new Date().toISOString().split('T')[0],
    operator_id: null,
    process_id:  null
  });

  // 🔥 IMPORTANTE: ahora incluye effectiveness
  private dataSubject = new BehaviorSubject<any>({
    activities: [],
    metrics: {},
    effectiveness: { by_operator: [], by_process: [] }
  });

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private destroy$       = new Subject<void>();

  data$    = this.dataSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 🔥 FUNCIÓN CLAVE (NO TOCA TU CÁLCULO, SOLO AGREGA ACTIVIDADES)
  private attachActivities(effectiveness: any, activities: any[]) {

    const map: any = {};

    activities.forEach(act => {
      const opName =
        act.operator?.name ||
        act.operator_name ||
        act.user?.name ||
        'Sin nombre';

      if (!map[opName]) {
        map[opName] = [];
      }

      const standard = act.standard || act.expected || 0;
      const real     = act.real || act.produced || 0;

      map[opName].push({
        name: act.process?.name || act.activity_name || 'Actividad',
        time: act.time_spent || act.duration || '—',
        standard,
        real,
        effectiveness: standard
          ? Math.round((real / standard) * 100)
          : 0
      });
    });

    if (effectiveness?.by_operator) {
      effectiveness.by_operator.forEach((op: any) => {
        op.activities = map[op.name] || [];
      });
    }

    return effectiveness;
  }

  startPolling() {
    this.destroy$ = new Subject<void>();

    interval(this.POLL_MS)
      .pipe(
        startWith(0),
        switchMap(() => {
          this.loadingSubject.next(true);

          const f    = this.filters$.value;
          let params = new HttpParams();

          if (f.date_from)   params = params.set('date_from',   f.date_from);
          if (f.date_to)     params = params.set('date_to',     f.date_to);
          if (f.operator_id) params = params.set('operator_id', f.operator_id);
          if (f.process_id)  params = params.set('process_id',  f.process_id);

          return this.http.get<any>(this.api, { params });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: data => {

          let effectiveness = data.effectiveness;

          // 🔥 SOLO ENRIQUECE, NO RECALCULA
          if (effectiveness?.by_operator) {
            effectiveness = this.attachActivities(effectiveness, data.activities || []);
          }

          this.dataSubject.next({
            ...data,
            effectiveness
          });

          this.loadingSubject.next(false);
        },
        error: err => {
          console.error('Error dashboard:', err);
          this.loadingSubject.next(false);
        }
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
    return this.http.get<any[]>('http://localhost:8000/api/operators');
  }

  getProcesses() {
    return this.http.get<any[]>('http://localhost:8000/api/processes');
  }
}