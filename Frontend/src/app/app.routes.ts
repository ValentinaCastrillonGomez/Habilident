import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const paths = {
  HOME: '',
  LOGIN: 'login',
  USERS: 'users',
  ROLES: 'roles',
  PARAMETERS: 'parameters',
  FORMATS: 'formats',
  RECORDS: 'records',
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
        path: paths.USERS, data: { title: 'Listado de usuarios' },
        loadComponent: () => import('@features/users/users.component'),
      },
      {
        path: paths.ROLES, data: { title: 'Listado de roles' },
        loadComponent: () => import('@features/roles/roles.component'),
      },
      {
        path: paths.PARAMETERS, data: { title: 'Parametros del sistema' },
        loadComponent: () => import('@features/parameters/parameters.component'),
      },
      {
        path: `${paths.FORMATS}/:id`, data: { title: 'Configuración de formato' },
        loadComponent: () => import('@features/formats/formats.component'),
      },
      {
        path: `${paths.RECORDS}/:id`, data: { title: 'Registros del formato' },
        loadComponent: () => import('@features/records/records.component'),
      }
    ]
  },
  { path: '', redirectTo: paths.HOME, pathMatch: 'full' },
  { path: '**', redirectTo: paths.HOME },
];
