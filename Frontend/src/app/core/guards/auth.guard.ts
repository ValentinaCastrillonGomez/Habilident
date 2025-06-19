import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, CanMatchFn } from '@angular/router';
import { paths } from 'src/app/app.routes';

export const authGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn
    ? authService.loadPermissions()
    : router.parseUrl(paths.LOGIN);
};
