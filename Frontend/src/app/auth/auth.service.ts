import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ENV } from '../app.config';
import { Router } from '@angular/router';
import { paths } from '../app.routes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _http = inject(HttpClient);
  private _apiLogin = inject(ENV).API_LOGIN;
  private _router = inject(Router);

  get isLoggedIn() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  async singIn(username: string, password: string) {
    const { access_token } = await firstValueFrom(this._http.post<{ access_token: string }>(this._apiLogin, { username, password }));
    localStorage.setItem('token', access_token);
    this._router.navigate([paths.HOME]);
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigate([paths.LOGIN]);
  }
}
