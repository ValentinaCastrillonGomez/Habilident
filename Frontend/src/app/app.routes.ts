import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const paths = {
  HOME: '',
  LOGIN: 'login',
  USERS: 'users',
};

export const routes: Routes = [
  {
    path: paths.LOGIN,
    loadComponent: () => import('./login/login.component'),
  },
  {
    path: paths.HOME,
    canMatch: [authGuard],
    loadComponent: () => import('./home/home.component'),
    loadChildren: () => import('./home/home.routes'),
  },
  { path: '**', redirectTo: paths.HOME, pathMatch: 'full' },
];
