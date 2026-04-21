import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout';
import { LoginComponent } from './auth/pages/login/login.component';
import { authGuard } from './auth/components/guards/auth.guard';
import { adminGuard } from './auth/components/guards/role.guard';
import { ActivityListContainerComponent } from './Activities/pages/activity-list-container/activity-list-container';
import { ActivityStartContainerComponent } from './Activities/pages/activity-start-container/activity-start-container';
import { ActivityDashboardContainerComponent } from './Activities/pages/activity-dashboard-container/activity-dashboard-container';
import { EfectividadDashboardContainerComponent } from './efectividad/pages/efectividad-dashboard-container/efectividad-dashboard-container';
import { ManualReportContainerComponent } from './Activities/pages/manual-report-container/manual-report-container';
import { EfectividadAdminContainerComponent } from './efectividad/pages/efectividad-admin-container/efectividad-admin-container';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '',                    component: ActivityDashboardContainerComponent },
      { path: 'start',               component: ActivityStartContainerComponent },
      { path: 'activities',          component: ActivityListContainerComponent },

      // Solo ADMIN
      { path: 'reports/efectividad', component: EfectividadDashboardContainerComponent, canActivate: [adminGuard] },
      { path: 'reports/manual',      component: ManualReportContainerComponent,          canActivate: [adminGuard] },
      { path: 'admin/efectividad',   component: EfectividadAdminContainerComponent,      canActivate: [adminGuard] },
    ]
  },
  { path: '**', redirectTo: '' }
];