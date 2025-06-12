import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, filter, first, firstValueFrom, map } from 'rxjs';
import { Router } from '@angular/router';
import { Login, Permission, Role } from '@habilident/types';
import { paths } from 'src/app/app.routes';
import { ENV } from 'src/app/app.config';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly ENV = inject(ENV);
  private readonly PATH_REFRESH = `${this.ENV.API_AUTH}/refresh`;

  refreshToken: BehaviorSubject<boolean> = new BehaviorSubject(false);
  permissions = signal<Permission[]>([]);

  get isLoggedIn() {
    return !!this.getTokens()[ACCESS_TOKEN];
  }

  get user(): { name: string; roleId: string } {
    return JSON.parse(window.atob(this.getTokens()[ACCESS_TOKEN]!.split('.')[1]));
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

  async singIn(login: Login) {
    const { access_token, refresh_token } = await firstValueFrom(
      this.http.post<{ access_token: string, refresh_token: string }>(`${this.ENV.API_AUTH}/login`, login)
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
      firstValueFrom(this.http.post<void>(`${this.ENV.API_AUTH}/logout`, {}));
    } finally {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);

      this.router.navigate([paths.LOGIN]);
    }
  }

  async loadPermissions(): Promise<boolean> {
    const { permissions } = await firstValueFrom(this.http.get<Role>(`${this.ENV.API_ROLES}/${this.user.roleId}`));;
    this.permissions.set(permissions);
    return true;
  }

  hasPermission(permission: Permission): boolean {
    return this.permissions().includes(permission);
  }
}
