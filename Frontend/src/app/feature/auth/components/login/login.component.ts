import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { Login } from 'src/app/core/models/login.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  unsubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.unsubscription = this.authService.googleData$.subscribe((data) => {
      const login: Login = {
        email: data!.email,
        googleId: data!.id,
      };
      this.getIn(login);
    });
  }

  ngOnDestroy(): void {
    this.unsubscription.unsubscribe();
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      this.getIn(this.loginForm.getRawValue());
    }
  }

  getIn(login: Login) {
    this.authService.signIn(login)
      .catch(({ error }) => Swal.fire({
        icon: 'error',
        title: error.message,
      }));
  }

  get form() {
    return this.loginForm.controls;
  }
}
