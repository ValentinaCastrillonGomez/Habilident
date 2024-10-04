import { Routes } from '@angular/router';
import { paths } from '../app.routes';

export default [
  {
    path: paths.USERS,
    loadComponent: () => import('../users/users.component'),
  },
  { path: '**', redirectTo: paths.USERS, pathMatch: 'full' },
] as Routes;
