import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from '@tipos/role';
import { RolesService } from '../../services/roles.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Permission, PERMISSIONS } from '@tipos/permission';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule, MatButtonModule
  ],
  providers: [RolesService],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent implements OnInit {
  role = inject<Role>(MAT_DIALOG_DATA);
  permissions: Permission[] = PERMISSIONS;
  roleForm;

  constructor(
    private dialog: MatDialogRef<RoleComponent>,
    private formBuilder: NonNullableFormBuilder,
    private rolesService: RolesService
  ) {
    this.roleForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      permissions: [[]],
    });
  }

  ngOnInit() {
    console.log(this.role);
    if (this.role) {
      // this.roleForm.setValue(this.role);
    }
  }

  save() {
    if (this.roleForm.invalid) return;

    const role = this.roleForm.getRawValue();

    console.log(role);
  }
}
