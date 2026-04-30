import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';

interface MenuItem {
  label: string;
  route: string;
  permission: string;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, NgFor],
  templateUrl: './app-layout.html',
  styleUrls: ['./app-layout.css']
})
export class AppLayoutComponent {
  sidebarOpen = true;
  visibleGroups: MenuGroup[] = [];

  private readonly menuGroups: MenuGroup[] = [
    {
      group: 'Operaciones',
      items: [
        { label: '🏭 Dashboard Actividades', route: '/dashboard',       permission: 'dashboard.activities' },
        { label: '🗂️ Historial Reportes',    route: '/reports/history', permission: 'reports.history'      },
      ]
    },
    {
      group: 'Reportes',
      items: [
        { label: '📊 Efectividad',    route: '/reports/efectividad', permission: 'reports.efectividad' },
        { label: '📝 Reporte Manual', route: '/reports/manual',      permission: 'reports.manual'      },
      ]
    },
    {
      group: 'Administración',
      items: [
        { label: '🔧 Operadores y Procesos', route: '/admin/efectividad', permission: 'admin.operators' },
        { label: '🗂️ Edición y Auditoría',   route: '/reports/edit',      permission: 'admin.audit'     },
      ]
    },
  ];

  constructor(public auth: AuthService) {
    // Suscribirse al usuario para recalcular cuando esté disponible
    this.auth.user$.subscribe(() => {
      this.visibleGroups = this.menuGroups
        .map(group => ({
          ...group,
          items: group.items.filter(item => this.auth.can(item.permission))
        }))
        .filter(group => group.items.length > 0);
    });
  }

  toggle(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.auth.logout();
  }
}