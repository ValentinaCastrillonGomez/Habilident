import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, CanMatchFn } from '@angular/router';
import { paths } from 'src/app/app.routes';

export const authGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) return true;

  return router.parseUrl(paths.LOGIN);
};
