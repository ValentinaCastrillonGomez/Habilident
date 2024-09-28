import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, firstValueFrom } from 'rxjs';
import { Login } from 'src/app/core/models/login.model';
import { User } from 'src/app/core/models/user.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable()
export class AuthService {
  googleData$ = new Subject<SocialUser>();
  userData$ = new ReplaySubject<User>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private socialService: SocialAuthService,
  ) {
    this.socialService.authState.subscribe((data) => {
      this.googleData$.next(data);
    });
  }

  get isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  async getName() {
    return (await firstValueFrom(this.userData$)).name;
  }

  public get user_id(): string {
    const token = localStorage.getItem('token')!;
    return JSON.parse(window.atob(token.split('.')[1])).sub;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['auth/login']);
    this.userData$ = new ReplaySubject<User>();
  }

  private login(access_token: string) {
    localStorage.setItem('token', access_token);
    this.router.navigate(['']);
  }

  async setUser() {
    const user = await firstValueFrom(this.http.get<User>(`users/${this.user_id}`));
    this.userData$.next(user);
  }

  async signIn(login: Login) {
    const { access_token } = await firstValueFrom(this.http.post<{ access_token: string }>(`auth/login`, login));
    this.login(access_token);
  }

  async register(register: User) {
    const { access_token } = await firstValueFrom(this.http.post<{ access_token: string }>(`auth/register`, register));
    this.login(access_token);

    Swal.fire({
      icon: 'success',
      title: 'Registrado',
    });
  }

  public confirmedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get('password');
      const targetCtrl = control.get('passwordConfirm');

      return sourceCtrl && targetCtrl && !targetCtrl.errors &&
        sourceCtrl.value !== targetCtrl.value
        ? { confirm: true }
        : null;
    }
  }

  public getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toJSON().slice(0, 10);
  }
}
