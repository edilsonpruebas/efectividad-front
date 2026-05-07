import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new Subject<Notification>();
  public notifications = this.notifications$.asObservable();

  private removeNotification$ = new Subject<string>();
  public removeNotification = this.removeNotification$.asObservable();

  private nextId = 0;

  show(type: 'success' | 'error' | 'warning' | 'info', message: string, duration = 4000) {
    const id = `notif-${this.nextId++}`;
    
    console.log('📢 NOTIFICACIÓN EMITIDA:', { id, type, message, duration }); // ← LOG

    this.notifications$.next({
      id,
      type,
      message,
      duration
    });

    if (duration > 0) {
      setTimeout(() => {
        console.log('🗑️ REMOVIENDO NOTIFICACIÓN:', id); // ← LOG
        this.removeNotification$.next(id);
      }, duration);
    }

    return id;
  }

  success(message: string, duration = 4000) {
    console.log('✅ SUCCESS:', message); // ← LOG
    return this.show('success', message, duration);
  }

  error(message: string, duration = 5000) {
    console.log('❌ ERROR:', message); // ← LOG
    return this.show('error', message, duration);
  }

  warning(message: string, duration = 4000) {
    console.log('⚠️ WARNING:', message); // ← LOG
    return this.show('warning', message, duration);
  }

  info(message: string, duration = 4000) {
    console.log('ℹ️ INFO:', message); // ← LOG
    return this.show('info', message, duration);
  }

  remove(id: string) {
    this.removeNotification$.next(id);
  }
}