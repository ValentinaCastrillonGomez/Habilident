import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { paths } from 'src/app/app.routes';

export const authGuard = () => inject(AuthService).isLoggedIn || inject(Router).parseUrl(paths.LOGIN);
