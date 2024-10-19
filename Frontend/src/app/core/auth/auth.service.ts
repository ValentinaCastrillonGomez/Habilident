import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { Login } from '@tipos/login';
import { paths } from 'src/app/app.routes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_LOGIN = '/login';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  get isLoggedIn() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser(): { name: string; roles: string[] } {
    return JSON.parse(window.atob(this.getToken()!.split('.')[1]));
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
