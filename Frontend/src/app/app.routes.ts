import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { formatGuard } from '@core/guards/format.guard';
import { permissionGuard } from '@core/guards/permission.guard';
import { PERMISSIONS } from '@habilident/types';

export const paths = {
  HOME: '',
  LOGIN: 'login',
  USERS: 'users',
  ROLES: 'roles',
  PARAMETERS: 'parameters',
  FORMATS: 'formats',
  RECORDS: 'records',
  REPORTS: 'reports',
  ALERTS: 'alerts',
  CALENDAR: 'calendar',
};

export const routes: Routes = [
  {
    path: paths.LOGIN,
    loadComponent: () => import('@features/login/login.component'),
  },
  {
    path: paths.HOME,
    canMatch: [() => authGuard()],
    loadComponent: () => import('@features/home/home.component'),
    children: [
      {
        path: paths.USERS,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_USERS)],
        loadComponent: () => import('@features/users/users.component'),
      },
      {
        path: paths.ROLES,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_ROLES)],
        loadComponent: () => import('@features/roles/roles.component'),
      },
      {
        path: paths.PARAMETERS,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_PARAMETERS)],
        loadComponent: () => import('@features/parameters/parameters.component'),
      },
      {
        path: `${paths.FORMATS}`,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_FORMATS)],
        loadComponent: () => import('@features/formats/formats.component'),
      },
      {
        path: `${paths.RECORDS}/:formatId`,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_RECORDS), formatGuard],
        loadComponent: () => import('@features/records/records.component'),
      },
      {
        path: `${paths.REPORTS}`,
        canMatch: [() => permissionGuard(PERMISSIONS.PRINT_REPORTS)],
        loadComponent: () => import('@features/reports/reports.component'),
      },
      {
        path: `${paths.ALERTS}`,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_ALERTS)],
        loadComponent: () => import('@features/alerts/alerts.component'),
      },
      {
        path: `${paths.CALENDAR}`,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_ALERTS)],
        loadComponent: () => import('@features/calendar/calendar.component'),
      },
      { path: '**', redirectTo: paths.HOME },
    ]
  },
  { path: '', redirectTo: paths.HOME, pathMatch: 'full' },
  { path: '**', redirectTo: paths.HOME },
];
