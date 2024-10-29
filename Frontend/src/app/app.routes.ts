import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const paths = {
  HOME: '',
  LOGIN: 'login',
  USERS: 'users',
  ROLES: 'roles',
  PARAMETERS: 'parameters',
  FORMATS: 'formats',
  REPORTS: 'reports',
  ALERTS: 'alerts',
};

export const routes: Routes = [
  {
    path: paths.LOGIN,
    loadComponent: () => import('@features/login/login.component'),
  },
  {
    path: paths.HOME,
    canMatch: [authGuard],
    loadComponent: () => import('@features/home/home.component'),
    children: [
      {
        path: paths.USERS,
        loadComponent: () => import('@features/users/users.component'),
      },
      {
        path: paths.ROLES,
        loadComponent: () => import('@features/roles/roles.component'),
      },
      {
        path: paths.PARAMETERS,
        loadComponent: () => import('@features/parameters/parameters.component'),
      },
      {
        path: `${paths.FORMATS}`,
        loadComponent: () => import('@features/formats/formats.component'),
      },
      {
        path: `${paths.REPORTS}`,
        loadComponent: () => import('@features/reports/reports.component'),
      },
      {
        path: `${paths.ALARMS}`, data: { title: 'Generación de alarmas' },
        loadComponent: () => import('@features/alarms/alarms.component'),
      },
      { path: '**', redirectTo: paths.FORMATS },
    ]
  },
  { path: '', redirectTo: paths.HOME, pathMatch: 'full' },
  { path: '**', redirectTo: paths.HOME },
];
