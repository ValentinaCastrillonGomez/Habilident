import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { ENV } from 'src/app/app.config';

function addAuthHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(ENV).BASE_URL;
  const authService = inject(AuthService);

  let request = req.clone({ url: `${baseUrl}${req.url}` });
  request = authService.isLoggedIn ? addAuthHeader(request, authService.getToken()!) : request;

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && req.url !== authService.PATH_LOGOUT) {
        if (req.url === authService.PATH_REFRESH) {
          authService.logout();
        }

        return authService.refresh().pipe(
          switchMap((token) => {
            request = addAuthHeader(request, token);
            return next(request);
          }),
        );
      }
      return throwError(() => err);
    })
  );
};
