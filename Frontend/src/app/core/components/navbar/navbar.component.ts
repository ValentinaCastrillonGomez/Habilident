import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LoadingService } from '@core/services/loading.service';
import { NotificationService } from '@core/services/notification.service';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { MaterialModule } from '@shared/modules/material/material.module';
import { Alert, PERMISSIONS } from '@habilident/types';
import { PATHS } from 'src/app/app.routes';
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
  private readonly loadingService = inject(LoadingService);

  readonly administration = [
    { id: 'roles', path: PATHS.ROLES, title: 'Roles', icon: 'admin_panel_settings', permission: PERMISSIONS.READ_ROLES },
    { id: 'users', path: PATHS.USERS, title: 'Usuarios', icon: 'group', permission: PERMISSIONS.READ_USERS },
    { id: 'parameters', path: PATHS.PARAMETERS, title: 'Parametros', icon: 'fact_check', permission: PERMISSIONS.READ_PARAMETERS },
  ];

  username = this.authService.user.name;
  loading = computed<boolean>(() => this.loadingService.loading());
  notifications = computed<Alert[]>(() => this.notificationService.notifications());

  ngOnInit(): void {
    this.notificationService.loadNotifications();
  }

  logout() {
    this.authService.logout();
  }

}
