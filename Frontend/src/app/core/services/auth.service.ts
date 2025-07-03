import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, first, firstValueFrom, map } from 'rxjs';
import { Router } from '@angular/router';
import { Login, Permission } from '@habilident/types';
import { paths } from 'src/app/app.routes';
import { ENV } from 'src/app/app.config';

const ACCESS_TOKEN = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly ENV = inject(ENV);
  readonly PATH_LOGOUT = `${this.ENV.API_AUTH}/logout`;
  readonly PATH_REFRESH = `${this.ENV.API_AUTH}/refresh`;

  refreshToken: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get isLoggedIn() {
    return !!this.getToken();
  }

  get user(): { name: string; roles: string[], permissions: Permission[] } {
    return JSON.parse(window.atob(this.getToken()!.split('.')[1]));
  }

  getToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  async singIn(login: Login) {
    const { access_token } = await firstValueFrom(
      this.http.post<{ access_token: string }>(`${this.ENV.API_AUTH}/login`, login)
    );
    localStorage.setItem(ACCESS_TOKEN, access_token);
    this.router.navigate([paths.HOME]);
  }

  refresh() {
    if (this.refreshToken.value) {
      return this.refreshToken.pipe(filter((refreshing) => !refreshing), first(), map(() => this.getToken()!));
    }

    this.refreshToken.next(true);
    return this.http.post<{ access_token: string }>(this.PATH_REFRESH, {}, { withCredentials: true }).pipe(
      map(({ access_token }) => {
        localStorage.setItem(ACCESS_TOKEN, access_token);
        this.refreshToken.next(false);
        return access_token;
      })
    );
  }

  logout() {
    try {
      firstValueFrom(this.http.post<void>(this.PATH_LOGOUT, {}));
    } finally {
      localStorage.removeItem(ACCESS_TOKEN);
      this.router.navigate([paths.LOGIN]);
    }
  }

  hasPermission(permission: Permission): boolean {
    return this.user.permissions.includes(permission);
  }
}
