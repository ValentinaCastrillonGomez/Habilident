import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/core/models/user.model';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm = this.formBuilder.nonNullable.group({
    _id: '',
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.minLength(10)]],
    birthDate: ['', [Validators.required]],
  });

  changePasswordForm = this.formBuilder.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required]],
  }, {
    validators: this.authService.confirmedValidator()
  });

  maxDate = this.authService.getMaxDate();
  user: User;
  private readonly unsubscription$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.userData$
      .pipe(takeUntil(this.unsubscription$))
      .subscribe((user) => {
        this.user = user;
        this.profileForm.patchValue({ ...this.user, birthDate: this.user.birthDate?.slice(0, 10) });
        this.user.googleId ? this.form.email.disable() : this.form.email.enable();
      });

    this.authService.googleData$
      .pipe(takeUntil(this.unsubscription$))
      .subscribe((data) => {
        this.onSocial(data!.id, data!.email);
      });
  }

  ngOnDestroy(): void {
    this.unsubscription$.next();
    this.unsubscription$.complete();
  }

  onSubmit() {
    this.profileForm.markAllAsTouched();

    if (this.profileForm.valid) {
      this.accountService.update(this.profileForm.getRawValue())
        .then(() => Swal.fire({
          icon: 'success',
          title: 'Perfil actualizado',
        }))
        .catch(({ error }) => Swal.fire({
          icon: 'error',
          title: error.message,
        }));
    }
  }

  onChange() {
    this.changePasswordForm.markAllAsTouched();

    if (this.changePasswordForm.valid) {
      this.accountService.updatePassword(this.user._id!, this.formPassword.password.value)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada',
          });
          this.changePasswordForm.reset();
        });
    }
  }

  onSocial(googleId: string | null, email?: string) {
    if (!googleId && !this.user.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Registre una contraseña',
      });

      return;
    }

    this.accountService.updateGoogle(this.user._id!, googleId, email)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Cuenta actualizada',
        });
        this.authService.setUser();
      })
      .catch(({ error }) => Swal.fire({
        icon: 'error',
        title: error.message,
      }));
  }

  get form() {
    return this.profileForm.controls;
  }

  get formPassword() {
    return this.changePasswordForm.controls;
  }
}
