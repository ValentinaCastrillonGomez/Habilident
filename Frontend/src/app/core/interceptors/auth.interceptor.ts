import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { catchError, throwError } from 'rxjs';
import { ENV } from 'src/app/app.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(ENV).BASE_URL;
  const authService = inject(AuthService);
  const token = authService.getToken();

  let request = req.clone({ url: `${baseUrl}${req.url}` });

  if (token) {
    request = request.clone({
      setHeaders: {
        authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        authService.logout();
      }
      return throwError(() => err);
    })
  );
};
