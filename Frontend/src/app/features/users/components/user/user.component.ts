import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User, Signature } from '@tipos/user';
import { Role } from '@tipos/role';
import { UsersService } from '../../services/users.service';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '@shared/modules/material/material.module';
import { RolesService } from '@features/roles/services/roles.service';
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
  userForm: FormGroup<{
    firstNames: FormControl<string>;
    lastNames: FormControl<string>;
    typeDocument: FormControl<string>;
    numberDocument: FormControl<string>;
    email: FormControl<string>;
    address: FormControl<string>;
    phone: FormControl<string>;
    gender: FormControl<string>;
    birthday: FormControl<string>;
    office: FormControl<string>;
    position: FormControl<string>;
    role: FormControl<string>;
    password: FormControl<any>;
    signature: FormControl<any>;
    state: FormControl<boolean>;
  }>;
  maxDate: Date;
  nameFile: string | null;

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
      firstNames: this.formBuilder.control(user?.firstNames || '', [Validators.required]),
      lastNames: this.formBuilder.control(user?.lastNames || '', [Validators.required]),
      typeDocument: this.formBuilder.control(user?.typeDocument || '', [Validators.required]),
      numberDocument: this.formBuilder.control(user?.numberDocument || '', [Validators.required]),
      email: this.formBuilder.control(user?.email || '', [Validators.required, Validators.email]),
      address: this.formBuilder.control(user?.address || '', [Validators.required]),
      phone: this.formBuilder.control(user?.phone || '', [Validators.required]),
      gender: this.formBuilder.control(user?.gender || '', [Validators.required]),
      birthday: this.formBuilder.control(user?.birthday || '', [Validators.required]),
      office: this.formBuilder.control(user?.office || '', [Validators.required]),
      position: this.formBuilder.control(user?.position || '', [Validators.required]),
      role: this.formBuilder.control(user?.role?._id || '', [Validators.required]),
      password: this.formBuilder.control(null, this.isNew ? [Validators.required, Validators.minLength(5)] : []),
      signature: this.formBuilder.control(null),
      state: this.formBuilder.control(true),
    });
    this.nameFile = user?.signature?.name || null;
    this.maxDate = moment().subtract(ADULT, 'years').toDate();
  }

  ngOnInit(): void {
    this.loadRoles();
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

    this.usersService.save(user, this.user?._id)
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
