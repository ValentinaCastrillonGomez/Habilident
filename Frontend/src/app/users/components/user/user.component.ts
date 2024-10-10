import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '@tipos/user';
import Swal from 'sweetalert2';
import { UsersService } from '../../services/users.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [UsersService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  userForm;

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User | null,
    private dialog: MatDialogRef<UserComponent>,
    private formBuilder: NonNullableFormBuilder,
    private usersService: UsersService
  ) {
    this.userForm = this.formBuilder.group({
      firstNames: ['', [Validators.required]],
      lastNames: ['', [Validators.required]],
    });
  }

  async save() {
    if (this.userForm.invalid) return;

    const user = this.userForm.getRawValue();

    this.usersService.save({ ...user } as any, this.user?._id)
      .then(() => {
        this.dialog.close(true);
        Swal.fire({
          title: "Registro guardado",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch(({ error }) => Swal.fire({
        icon: 'error',
        title: error.message,
      }));
  }
}
