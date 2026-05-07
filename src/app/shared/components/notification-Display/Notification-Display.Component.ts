import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, animate, style } from '@angular/animations';
import { NotificationService, Notification } from '../../../auth/services/notification.service';

@Component({
  selector: 'app-notification-display',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush, // ← AGREGAR: optimizar detección de cambios
  template: `
    <div class="notification-container">
      @for (notif of notifications; track notif.id) {
        <div 
          class="notification"
          [ngClass]="'notification--' + notif.type"
          [@fadeInOut]>
          <div class="notification__icon">
            <span [ngSwitch]="notif.type">
              <span *ngSwitchCase="'success'">✓</span>
              <span *ngSwitchCase="'error'">✕</span>
              <span *ngSwitchCase="'warning'">⚠</span>
              <span *ngSwitchCase="'info'">ℹ</span>
            </span>
          </div>
          <div class="notification__message">{{ notif.message }}</div>
          <button 
            class="notification__close"
            (click)="removeNotification(notif.id)">
            ✕
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
    }

    .notification {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      margin-bottom: 12px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      pointer-events: auto;
      font-size: 14px;
      min-width: 320px;
      max-width: 400px;
    }

    .notification--success {
      background-color: #d4edda;
      color: #155724;
      border-left: 4px solid #28a745;
    }

    .notification--error {
      background-color: #f8d7da;
      color: #721c24;
      border-left: 4px solid #dc3545;
    }

    .notification--warning {
      background-color: #fff3cd;
      color: #856404;
      border-left: 4px solid #ffc107;
    }

    .notification--info {
      background-color: #d1ecf1;
      color: #0c5460;
      border-left: 4px solid #17a2b8;
    }

    .notification__icon {
      font-weight: bold;
      font-size: 18px;
      flex-shrink: 0;
    }

    .notification__message {
      flex-grow: 1;
      word-break: break-word;
    }

    .notification__close {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      padding: 0;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .notification__close:hover {
      opacity: 1;
    }
  `],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' }))
      ])
    ])
  ]
})
export class NotificationDisplayComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef // ← AGREGAR: para forzar detección de cambios
  ) {}

  ngOnInit() {
    // ← ACTUALIZAR: Suscribirse a nuevas notificaciones
    this.notificationService.notifications.subscribe(notif => {
      this.notifications.push(notif);
      this.cdr.markForCheck(); // ← FORZAR detección de cambios
    });

    // ← AGREGAR: Suscribirse a remociones
    this.notificationService.removeNotification.subscribe(id => {
      this.notifications = this.notifications.filter(n => n.id !== id);
      this.cdr.markForCheck(); // ← FORZAR detección de cambios
    });
  }

  removeNotification(id: string) {
    this.notificationService.remove(id);
  }
}