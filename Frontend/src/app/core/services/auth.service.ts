import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { Login, Permission } from '@habilident/types';
import { paths } from 'src/app/app.routes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_LOGIN = '/login';

  get isLoggedIn() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser(): { name: string; roles: string, permissions: Permission[] } {
    return JSON.parse(window.atob(this.getToken()!.split('.')[1]));
  }

  hasPermission(permission: Permission): boolean {
    return this.getUser()?.permissions?.includes(permission);
  }

  async singIn(login: Login) {
    const { access_token } = await firstValueFrom(
      this.http.post<{ access_token: string }>(this.API_LOGIN, login)
    );
    localStorage.setItem('token', access_token);
    this.router.navigate([paths.HOME]);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate([paths.LOGIN]);
  }
}
