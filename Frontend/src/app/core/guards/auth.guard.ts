import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, CanMatchFn } from '@angular/router';
import { paths } from 'src/app/app.routes';

export const authGuard: CanMatchFn = () => inject(AuthService).isLoggedIn || inject(Router).parseUrl(paths.LOGIN);
