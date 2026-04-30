import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout';
import { LoginComponent } from './auth/pages/login/login.component';
import { authGuard } from './auth/components/guards/auth.guard';
import { permissionGuard } from './auth/components/guards/permission.guard';
import { ActivityListContainerComponent } from './Activities/pages/activity-list-container/activity-list-container';
import { ActivityStartContainerComponent } from './Activities/pages/activity-start-container/activity-start-container';
import { ActivityDashboardContainerComponent } from './Activities/pages/activity-dashboard-container/activity-dashboard-container';
import { EfectividadDashboardContainerComponent } from './efectividad/pages/efectividad-dashboard-container/efectividad-dashboard-container';
import { ManualReportContainerComponent } from './Activities/pages/manual-report-container/manual-report-container';
import { EfectividadAdminContainerComponent } from './efectividad/pages/efectividad-admin-container/efectividad-admin-container';
import { ActivityReportsContainerComponent } from './edit-reports/pages/activity-reports-container/activity-reports-container';
import { ActivityReportsSupervisorsContainerComponent } from './Activities/pages/activity-reports-container/reports-supervisors-container';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // VP, ADMIN, RRHH, SUPERVISOR
      { path: 'dashboard',       component: ActivityDashboardContainerComponent,          canActivate: [permissionGuard('dashboard.activities')] },
      { path: 'start',           component: ActivityStartContainerComponent,              canActivate: [permissionGuard('dashboard.activities')] },
      { path: 'activities',      component: ActivityListContainerComponent,               canActivate: [permissionGuard('dashboard.activities')] },
      { path: 'reports/history', component: ActivityReportsSupervisorsContainerComponent, canActivate: [permissionGuard('reports.history')] },

      // VP, ADMIN, RRHH, FABRICA
      { path: 'reports/efectividad', component: EfectividadDashboardContainerComponent, canActivate: [permissionGuard('reports.efectividad')] },
      { path: 'reports/manual',      component: ManualReportContainerComponent,          canActivate: [permissionGuard('reports.manual')] },

      // VP, ADMIN, RRHH
      { path: 'admin/efectividad', component: EfectividadAdminContainerComponent, canActivate: [permissionGuard('admin.operators')] },
      { path: 'reports/edit',      component: ActivityReportsContainerComponent,  canActivate: [permissionGuard('admin.audit')] },
    ]
  },
  { path: '**', redirectTo: 'login' }
];