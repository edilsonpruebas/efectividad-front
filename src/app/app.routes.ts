import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout';
import { ActivityListContainerComponent } from './Activities/pages/activity-list-container/activity-list-container';
import { ActivityStartContainerComponent } from './Activities/pages/activity-start-container/activity-start-container';
import { ActivityDashboardContainerComponent } from './Activities/pages/activity-dashboard-container/activity-dashboard-container';
import { EfectividadDashboardContainerComponent } from './efectividad/pages/efectividad-dashboard-container/efectividad-dashboard-container';
import { ManualReportContainerComponent } from './Activities/pages/manual-report-container/manual-report-container';
// ✅ NUEVO IMPORT: Contenedor del módulo administrativo
import { EfectividadAdminContainerComponent } from './efectividad/pages/efectividad-admin-container/efectividad-admin-container';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '',                    component: ActivityDashboardContainerComponent },
      { path: 'start',               component: ActivityStartContainerComponent },
      { path: 'activities',          component: ActivityListContainerComponent },
      { path: 'reports/efectividad', component: EfectividadDashboardContainerComponent },
      { path: 'reports/manual',      component: ManualReportContainerComponent },
      // ✅ NUEVA RUTA: Módulo administrativo independiente
      { path: 'admin/efectividad',   component: EfectividadAdminContainerComponent }
    ]
  }
];