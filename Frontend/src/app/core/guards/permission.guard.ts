import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { paths } from 'src/app/app.routes';
import { Permission } from '@habilident/types';

export const permissionGuard = (permission: Permission) =>
  inject(AuthService).hasPermission(permission) || inject(Router).parseUrl(paths.HOME);
