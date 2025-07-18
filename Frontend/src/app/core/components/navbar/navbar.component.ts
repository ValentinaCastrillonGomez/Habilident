import { Component, inject, OnInit, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LoadingService } from '@core/services/loading.service';
import { NotificationService } from '@core/services/notification.service';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { PERMISSIONS } from '@habilident/types';
import { paths } from 'src/app/app.routes';
import { CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    MaterialModule,
    PermissionDirective,
    CdkMenuTrigger,
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
  sidenavToggle = output<void>();

  readonly administration = [
    { id: 'roles', path: paths.ROLES, title: 'Roles', icon: 'admin_panel_settings', permission: PERMISSIONS.READ_ROLES },
    { id: 'users', path: paths.USERS, title: 'Usuarios', icon: 'group', permission: PERMISSIONS.READ_USERS },
    { id: 'parameters', path: paths.PARAMETERS, title: 'Parametros', icon: 'fact_check', permission: PERMISSIONS.READ_PARAMETERS },
  ];

  loading = this.loadingService.loading;
  username = this.authService.user.name;
  notifications = this.notificationService.notifications;

  ngOnInit(): void {
    this.notificationService.loadNotifications();
  }

  logout() {
    this.authService.logout();
  }

}
