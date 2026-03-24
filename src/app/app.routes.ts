import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout';
import { ActivityListContainerComponent } from './Activities/pages/activity-list-container/activity-list-container';
import { ActivityStartContainerComponent } from './Activities/pages/activity-start-container/activity-start-container';
import { ActivityDashboardContainerComponent } from './Activities/pages/activity-dashboard-container/activity-dashboard-container';
import { EfectividadDashboardContainerComponent } from './efectividad/pages/efectividad-dashboard-container/efectividad-dashboard-container';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '',                    component: ActivityDashboardContainerComponent },
      { path: 'start',               component: ActivityStartContainerComponent },
      { path: 'activities',          component: ActivityListContainerComponent },
      { path: 'reports/efectividad', component: EfectividadDashboardContainerComponent }
    ]
  }
];