import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, first, firstValueFrom, map } from 'rxjs';
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
  private readonly PATH_REFRESH = `${this.API_AUTH}/refresh`;
  public refreshToken: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get isLoggedIn() {
    return !!this.getTokens()[ACCESS_TOKEN];
  }

  getTokens() {
    return {
      [ACCESS_TOKEN]: localStorage.getItem(ACCESS_TOKEN),
      [REFRESH_TOKEN]: localStorage.getItem(REFRESH_TOKEN),
    };
  }

  getBearerToken(url: string): string {
    return this.PATH_REFRESH !== url ? this.getTokens()[ACCESS_TOKEN]! : this.getTokens()[REFRESH_TOKEN]!
  }

  getUser(): { name: string; roles: string, permissions: Permission[] } {
    return JSON.parse(window.atob(this.getTokens()[ACCESS_TOKEN]!.split('.')[1]));
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

  refresh() {
    if (this.refreshToken.value) {
      return this.refreshToken.pipe(filter((refreshing) => !refreshing), first(), map(() => this.getTokens()[ACCESS_TOKEN]!));
    }

    this.refreshToken.next(true);
    return this.http.post<{ access_token: string, refresh_token: string }>(this.PATH_REFRESH, {}).pipe(
      map(({ access_token, refresh_token }) => {
        localStorage.setItem(ACCESS_TOKEN, access_token);
        localStorage.setItem(REFRESH_TOKEN, refresh_token);
        this.refreshToken.next(false);
        return access_token;
      })
    );
  }

  logout() {
    try {
      firstValueFrom(this.http.post<void>(`${this.API_AUTH}/logout`, {}));
    } finally {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);

      this.router.navigate([paths.LOGIN]);
    }
  }
}
