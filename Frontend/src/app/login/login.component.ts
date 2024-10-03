import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class AuthComponent {
  private _formBuilder = inject(NonNullableFormBuilder);
  private _authService = inject(AuthService);

  loginForm = this._formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  login() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.getRawValue();

    try {
      this._authService.singIn(username, password);
    } catch ({ error }: any) {
      console.log(error);
    }
  }

}
