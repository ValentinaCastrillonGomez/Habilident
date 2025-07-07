import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { permissionGuard } from '@core/guards/permission.guard';
import { PERMISSIONS } from '@habilident/types';

export const paths = {
  HOME: '',
  LOGIN: 'login',
  USERS: 'users',
  ROLES: 'roles',
  PARAMETERS: 'parameters',
  FORMAT: 'format',
  FORMATS: 'formats',
  RECORD: 'record',
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
        path: `${paths.FORMAT}`,
        canMatch: [() => permissionGuard(PERMISSIONS.CREATE_FORMATS)],
        loadComponent: () => import('@features/formats/components/format/format.component'),
      },
      {
        path: `${paths.FORMATS}`,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_FORMATS)],
        loadComponent: () => import('@features/formats/formats.component'),
      },
      {
        path: `${paths.FORMAT}/:formatId`,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_FORMATS)],
        loadComponent: () => import('@features/formats/components/format/format.component'),
      },
      {
        path: `${paths.RECORDS}`,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_RECORDS)],
        loadComponent: () => import('@features/records/records.component'),
      },
      {
        path: `${paths.RECORD}`,
        canMatch: [() => permissionGuard(PERMISSIONS.CREATE_RECORDS)],
        loadComponent: () => import('@features/records/components/record/record.component'),
      },
      {
        path: `${paths.RECORD}/:recordId`,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_RECORDS)],
        loadComponent: () => import('@features/records/components/record/record.component'),
      },
      {
        path: `${paths.CALENDAR}`,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_RECORDS)],
        loadComponent: () => import('@features/calendar/calendar.component'),
      },
      { path: '**', redirectTo: paths.HOME },
    ]
  },
  { path: '', redirectTo: paths.HOME, pathMatch: 'full' },
  { path: '**', redirectTo: paths.HOME },
];
