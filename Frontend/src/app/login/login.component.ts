import { Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class AuthComponent {
  loginForm;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) return;

    const login = this.loginForm.getRawValue();

    this.authService.singIn(login)
      .catch(({ error }) => Swal.fire({
        icon: 'error',
        title: error.message,
      }));
  }
} 