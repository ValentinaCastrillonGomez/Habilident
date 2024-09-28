import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required]],
    phone: ['', [Validators.minLength(10)]],
    birthDate: ['', [Validators.required]],
  }, {
    validators: this.authService.confirmedValidator()
  });
  maxDate = this.authService.getMaxDate();
  unsubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.unsubscription = this.authService.googleData$.subscribe((data) => {
      const user: User = {
        name: data!.name,
        email: data!.email,
        googleId: data!.id,
        phone: '',
        birthDate: ''
      };
      this.save(user);
    });
  }

  ngOnDestroy(): void {
    this.unsubscription.unsubscribe();
  }

  onSubmit() {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      const { passwordConfirm, ...form } = this.registerForm.getRawValue();
      this.save(form);
    }
  }

  save(user: User) {
    this.authService.register(user)
      .catch(({ error }) => Swal.fire({
        icon: 'error',
        title: error.message,
      }));
  }

  get form() {
    return this.registerForm.controls;
  }
}
