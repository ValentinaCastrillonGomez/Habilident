import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from '@tipos/role';
import { RolesService } from '../../services/roles.service';
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PERMISSIONS } from '@tipos/permission';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MatCheckboxModule, MatGridListModule, CommonModule
  ],
  providers: [RolesService],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent {
  role = inject<Role | null>(MAT_DIALOG_DATA);
  roleForm;

  constructor(
    private dialog: MatDialogRef<RoleComponent>,
    private formBuilder: NonNullableFormBuilder,
    private rolesService: RolesService
  ) {
    this.roleForm = this.formBuilder.group({
      name: [this.role?.name || '', [Validators.required]],
      permissions: this.formBuilder.group(this.buildPermissions()),
    });
  }

  get permissionsGroup() {
    return Object.keys(PERMISSIONS);
  }

  buildPermissions() {
    return Object.entries(PERMISSIONS).reduce((acc, [groupKey, permissions]) => {
      acc[groupKey] = this.formBuilder.array(permissions.map((permission) =>
        this.formBuilder.group({
          name: [permission],
          selected: [this.role?.permissions.includes(permission) || false]
        })
      ));
      return acc;
    }, {} as { [key: string]: FormArray });
  }

  async save() {
    if (this.roleForm.invalid) return;

    const role = this.roleForm.getRawValue();

    const permissions = Object.values(role.permissions).flat()
      .filter(permission => permission.selected)
      .map(permission => permission.name);

    this.rolesService.save({ ...role, permissions }, this.role?._id)
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
