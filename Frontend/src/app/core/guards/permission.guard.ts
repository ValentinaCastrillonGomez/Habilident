import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PATHS } from 'src/app/app.routes';
import { Permission } from '@habilident/types';

export const permissionGuard = (permissions: Permission[] | Permission) =>
  inject(AuthService).hasPermission(Array.isArray(permissions) ? permissions : [permissions]) || inject(Router).parseUrl(PATHS.HOME);
