import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User, Signature } from '@tipos/user';
import { Role } from '@tipos/role';
import { UsersService } from '../../services/users.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { RolesService } from 'src/app/roles/services/roles.service';
import Swal from 'sweetalert2';
import moment from 'moment';

const ADULT = 18;

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [UsersService, RolesService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  roles: Role[] = [];
  userForm;
  maxDate: Date;
  nameFile: string | null = null;

  get isNew() {
    return !this.user?._id;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User | null,
    private dialog: MatDialogRef<UserComponent>,
    private formBuilder: NonNullableFormBuilder,
    private usersService: UsersService,
    private rolesService: RolesService,
  ) {
    this.userForm = this.formBuilder.group({
      firstNames: this.formBuilder.control('', [Validators.required]),
      lastNames: this.formBuilder.control('', [Validators.required]),
      typeDocument: this.formBuilder.control('', [Validators.required]),
      numberDocument: this.formBuilder.control('', [Validators.required]),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      address: this.formBuilder.control('', [Validators.required]),
      phone: this.formBuilder.control('', [Validators.required]),
      gender: this.formBuilder.control('', [Validators.required]),
      birthday: this.formBuilder.control('', [Validators.required]),
      office: this.formBuilder.control('', [Validators.required]),
      position: this.formBuilder.control('', [Validators.required]),
      role: this.formBuilder.control('', [Validators.required]),
      password: this.formBuilder.control(null, this.isNew ? [Validators.required] : []),
      signature: this.formBuilder.control<any>(null),
      state: this.formBuilder.control(true),
    });
    this.maxDate = moment().subtract(ADULT, 'years').toDate();
  }

  ngOnInit(): void {
    this.loadRoles();

    if (this.user) {
      const { password, signature, role, ...user } = this.user;
      this.nameFile = signature?.name || null;
      this.userForm.patchValue({ ...user, role: role._id } as any);
    }
  }

  private async loadRoles() {
    const { data } = await this.rolesService.getAll();
    this.roles = data;
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.nameFile = file.name;
      this.userForm.controls.signature.setValue({
        name: file.name,
        image: await this.toBase64(file),
      } as Signature);
    }
  }

  private toBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  async save() {
    if (this.userForm.invalid) return;

    const user = this.userForm.getRawValue();

    this.usersService.save(user as any, this.user?._id)
      .then(() => {
        this.dialog.close(true);
        Swal.fire({
          title: "Registro guardado",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });
      })
      .catch(({ error }) => Swal.fire({
        icon: 'error',
        title: error.message,
      }));
  }
}
