import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Login, Permission } from '@habilident/types';
import { paths } from 'src/app/app.routes';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_AUTH = '/auth';
  public isRefreshToken: Observable<boolean> = of(false);

  get isLoggedIn() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  getUser(): { name: string; roles: string, permissions: Permission[] } {
    return JSON.parse(window.atob(this.getToken()!.split('.')[1]));
  }

  hasPermission(permission: Permission): boolean {
    return this.getUser()?.permissions?.includes(permission);
  }

  async singIn(login: Login) {
    const { access_token, refresh_token } = await firstValueFrom(
      this.http.post<{ access_token: string, refresh_token: string }>(`${this.API_AUTH}/login`, login)
    );
    localStorage.setItem(ACCESS_TOKEN, access_token);
    localStorage.setItem(REFRESH_TOKEN, refresh_token);
    this.router.navigate([paths.HOME]);
  }

  async refreshToken() {
    const { access_token, refresh_token } = await firstValueFrom(
      this.http.post<{ access_token: string, refresh_token: string }>(`${this.API_AUTH}/refresh`, {})
    );
    localStorage.setItem(ACCESS_TOKEN, access_token);
    localStorage.setItem(REFRESH_TOKEN, refresh_token);
  }

  logout() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    this.router.navigate([paths.LOGIN]);
  }
}
