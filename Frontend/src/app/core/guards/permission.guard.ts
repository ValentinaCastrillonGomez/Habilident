import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { paths } from 'src/app/app.routes';
import { Permission } from '@habilident/types';

export const permissionGuard = (permission: Permission) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.hasPermission(permission) || router.parseUrl(paths.HOME);
};
