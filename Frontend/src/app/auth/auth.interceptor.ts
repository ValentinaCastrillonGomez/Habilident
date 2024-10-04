import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { BASE_URL } from '../app.config';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const baseUrl = inject(BASE_URL);
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
