import { Routes } from '@angular/router';
import { paths } from '../app.routes';

export default [
  {
    path: paths.USERS,
    loadComponent: () => import('../users/users.component'),
  },
  {
    path: paths.ROLES,
    loadComponent: () => import('../roles/roles.component'),
  },
  {
    path: paths.FORMATS,
    loadComponent: () => import('../formats/formats.component'),
  }
] as Routes;
