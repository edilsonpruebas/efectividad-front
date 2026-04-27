import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ActivityReportsService {

  private api = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) {}

  getAll(filters: {
    date?: string;
    operator_id?: number | string;
    process_id?: number | string;
    status?: string;
  } = {}): Observable<any[]> {
    const params: any = {};
    if (filters.date)        params['date']        = filters.date;
    if (filters.operator_id) params['operator_id'] = filters.operator_id;
    if (filters.process_id)  params['process_id']  = filters.process_id;
    if (filters.status)      params['status']      = filters.status;
    return this.http.get<any[]>(this.api, { params });
  }

  update(id: number, data: {
    operator_id?: number;
    process_id?: number;
    start_time?: string;
    end_time?: string;
    quantity?: number;
    notes?: string | null;
  }): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  updateNote(id: number, notes: string): Observable<any> {
    return this.http.post(`${this.api}/${id}/note`, { notes });
  }

  getOperators(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/operators/active`);
  }

  getProcesses(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/processes/all`);
  }
}