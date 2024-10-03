import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { ENV } from "../app.config";
import { paths } from "../app.routes";

export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const baseUrl = inject(ENV).BASE_URL;
    const token = inject(AuthService).getToken();
    const router = inject(Router);

    let request = req.clone({ url: `${baseUrl}${req.url}` });

    if (token) {
        request = request.clone({
            setHeaders: {
                authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
            router.navigate([paths.LOGIN]);
        }
        return throwError(() => err);
    }));
}