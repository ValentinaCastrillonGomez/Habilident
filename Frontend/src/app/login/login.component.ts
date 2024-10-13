import { Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
  ],
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
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      password: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    const login = this.loginForm.getRawValue();

    this.authService.singIn(login)
      .catch(({ error }) => Swal.fire({
        icon: 'error',
        title: error.message,
      }));
  }
} 