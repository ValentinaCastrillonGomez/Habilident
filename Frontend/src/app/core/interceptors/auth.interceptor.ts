import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { ERROR_MESSAGES } from '@habilident/types';
import { catchError, switchMap, throwError } from 'rxjs';
import { ENV } from 'src/app/app.config';

function addAuthHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(ENV).BASE_URL;
  const authService = inject(AuthService);

  let request = req.clone({ url: `${baseUrl}${req.url}` });
  request = authService.isLoggedIn ? addAuthHeader(request, authService.getBearerToken(req.url)) : request;

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        if (err.error?.message === ERROR_MESSAGES.TOKEN_EXPIRED) {
          return authService.refresh().pipe(
            switchMap((token) => {
              request = addAuthHeader(request, token);
              return next(request);
            }),
          );
        }
        if (err.error?.message === ERROR_MESSAGES.REFRESH_INVALID) {
          authService.logout();
        }
      }
      return throwError(() => err);
    })
  );
};
