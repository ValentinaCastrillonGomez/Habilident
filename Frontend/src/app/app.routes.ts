import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/auth.guard';

export const paths = {
  HOME: '',
  LOGIN: 'login',
  USERS: 'users',
  ROLES: 'roles',
  FORMATS: 'formats',
  RECORDS: 'records',
  PARAMETERS: 'parameters',
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
        path: `${paths.FORMATS}/:id`,
        loadComponent: () => import('@features/formats/components/format/format.component'),
      },
      {
        path: paths.RECORDS,
        loadComponent: () => import('@features/roles/roles.component'),
      }
    ]
  },
  { path: '', redirectTo: paths.HOME, pathMatch: 'full' },
  { path: '**', redirectTo: paths.HOME },
];
