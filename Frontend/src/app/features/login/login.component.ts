import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthComponent {
  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);

  loginForm = this.formBuilder.group({
    email: this.formBuilder.control('', [Validators.required, Validators.email]),
    password: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
  });
  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
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