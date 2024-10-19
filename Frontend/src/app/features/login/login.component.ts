import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/auth/auth.service';
import { MaterialModule } from '@shared/modules/material/material.module';
import Swal from 'sweetalert2';

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
  loginForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

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