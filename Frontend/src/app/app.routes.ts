import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { permissionGuard } from '@core/guards/permission.guard';
import { PERMISSIONS } from '@habilident/types';

export const PATHS = {
  HOME: '',
  LOGIN: 'login',
  DASHBOARD: 'calendar',
  USERS: 'users',
  ROLES: 'roles',
  PARAMETERS: 'parameters',
  FORMAT: 'format',
  FORMATS: 'formats',
  RECORD: 'record',
  RECORDS: 'records',
} as const;

export const routes: Routes = [
  {
    path: PATHS.LOGIN,
    loadComponent: () => import('@features/login/login.component'),
  },
  {
    path: PATHS.HOME,
    canMatch: [() => authGuard()],
    loadComponent: () => import('@features/home/home.component'),
    children: [
      {
        path: PATHS.USERS,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_USERS)],
        loadComponent: () => import('@features/users/users.component'),
      },
      {
        path: PATHS.ROLES,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_ROLES)],
        loadComponent: () => import('@features/roles/roles.component'),
      },
      {
        path: PATHS.PARAMETERS,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_PARAMETERS)],
        loadComponent: () => import('@features/parameters/parameters.component'),
      },
      {
        path: `${PATHS.FORMATS}/:formatId/${PATHS.RECORDS}`,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_RECORDS)],
        loadComponent: () => import('@features/records/records.component'),
      },
      {
        path: `${PATHS.FORMATS}/:formatId/${PATHS.RECORD}/:recordId`,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_RECORDS)],
        loadComponent: () => import('@features/records/components/record/record.component'),
      },
      {
        path: `${PATHS.FORMATS}/:formatId/${PATHS.RECORD}`,
        canMatch: [() => permissionGuard(PERMISSIONS.CREATE_RECORDS)],
        loadComponent: () => import('@features/records/components/record/record.component'),
      },
      {
        path: `${PATHS.FORMATS}`,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_FORMATS)],
        loadComponent: () => import('@features/formats/formats.component'),
      },
      {
        path: `${PATHS.FORMAT}/:formatId`,
        canMatch: [() => permissionGuard(PERMISSIONS.READ_FORMATS)],
        loadComponent: () => import('@features/formats/components/format/format.component'),
      },
      {
        path: `${PATHS.FORMAT}`,
        canMatch: [() => permissionGuard(PERMISSIONS.CREATE_FORMATS)],
        loadComponent: () => import('@features/formats/components/format/format.component'),
      },
      {
        path: `${PATHS.DASHBOARD}`,
        canActivate: [() => permissionGuard(PERMISSIONS.READ_RECORDS)],
        loadComponent: () => import('@features/calendar/calendar.component'),
      },
      { path: '', redirectTo: PATHS.HOME, pathMatch: 'full' },
      { path: '**', redirectTo: PATHS.DASHBOARD },
    ]
  },
  { path: '**', redirectTo: PATHS.HOME },
];
