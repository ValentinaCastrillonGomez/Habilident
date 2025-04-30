import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LoadingService } from '@core/services/loading.service';
import { NotificationService } from '@core/services/notification.service';
import { RecordComponent } from '@features/records/components/record/record.component';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { PERMISSIONS } from '@tipos/permission';
import { paths } from 'src/app/app.routes';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    MaterialModule,
    PermissionDirective,
    CdkMenuTrigger, CdkMenu, CdkMenuItem
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly formatsService = inject(FormatsService);
  private readonly dialog = inject(MatDialog);
  private readonly loadingService = inject(LoadingService);

  readonly administration = [
    { id: 'roles', path: paths.ROLES, title: 'Roles', icon: 'admin_panel_settings', permission: PERMISSIONS.READ_ROLES },
    { id: 'users', path: paths.USERS, title: 'Usuarios', icon: 'group', permission: PERMISSIONS.READ_USERS },
    { id: 'parameters', path: paths.PARAMETERS, title: 'Parametros', icon: 'fact_check', permission: PERMISSIONS.READ_PARAMETERS },
  ];
  readonly management = [
    { id: 'formats', path: paths.FORMATS, title: 'Formatos', permission: PERMISSIONS.READ_FORMATS },
    { id: 'reports', path: paths.REPORTS, title: 'Reportes', permission: PERMISSIONS.PRINT_REPORTS },
    { id: 'alarms', path: paths.ALERTS, title: 'Alarmas', permission: PERMISSIONS.READ_ALERTS },
  ];

  loading = this.loadingService.loading;
  username = this.authService.getUser().name;
  notifications = this.notificationService.notifications;

  ngOnInit(): void {
    this.notificationService.loadNotifications();
  }

  async open(formatId: string) {
    const format = await this.formatsService.get(formatId);
    const dialogRef = this.dialog.open(RecordComponent, { data: { format } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.notificationService.loadNotifications();
    });
  }

  logout() {
    this.authService.logout();
  }

}
