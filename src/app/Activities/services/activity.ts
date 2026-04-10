import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private api = 'http://localhost:8000/api/activities';

  private reload$ = new BehaviorSubject<void>(undefined);

  private activitiesSubject = new BehaviorSubject<any[]>([]);
  activities$ = this.activitiesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.init();
  }

  private init() {
    this.reload$
      .pipe(
        switchMap(() => this.http.get<any[]>(`${this.api}/open`))
      )
      .subscribe(data => {
        this.activitiesSubject.next(data);
      });
  }

  reload() {
    this.reload$.next();
  }

  // ✅ sin tap — el reload lo maneja el container
  start(data: any) {
    return this.http.post(`${this.api}/start`, data);
  }

  stop(id: number, data: any) {
    return this.http.post(`${this.api}/${id}/stop`, data);
  }

  cancel(id: number) {
  return this.http.post(`${this.api}/${id}/cancel`, {});
  }
  getOperators() {
    return this.http.get<any[]>('http://localhost:8000/api/operators');
  }

  getProcesses() {
    return this.http.get<any[]>('http://localhost:8000/api/processes');
  }

  getHistory() {
  return this.http.get<any[]>(`${this.api}/history`);
  
  }

  reportManual(data: any) {
  return this.http.post(`${this.api}/report-manual`, data);
  
  }
  
  addNote(id: number, notes: string) {
  return this.http.post(`${this.api}/${id}/note`, { notes });

  
}

stopTimer(id: number): Observable<any> {
  return this.http.post(`${this.api}/activities/${id}/stop-timer`, {});
}

submitReport(id: number, data: { quantity: number; notes?: string }): Observable<any> {
  return this.http.post(`${this.api}/activities/${id}/submit-report`, data);
}

quickReport(data: { operator_id: number; process_id: number; quantity: number; notes?: string }): Observable<any> {
  return this.http.post(`${this.api}/activities/quick-report`, data);
}
  
}