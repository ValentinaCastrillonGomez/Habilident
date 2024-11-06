import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LoadingService } from '@core/services/loading.service';
import { NotificationService } from '@core/services/notification.service';
import { MaterialModule } from '@shared/modules/material/material.module';
import { paths } from 'src/app/app.routes';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    MaterialModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  loadingService = inject(LoadingService);

  readonly administration = [
    { id: 'roles', path: paths.ROLES, title: 'Roles', icon: 'admin_panel_settings' },
    { id: 'users', path: paths.USERS, title: 'Usuarios', icon: 'group' },
    { id: 'parameters', path: paths.PARAMETERS, title: 'Parametros', icon: 'fact_check' },
  ];
  readonly management = [
    { id: 'formats', path: paths.FORMATS, title: 'Formatos' },
    { id: 'reports', path: paths.REPORTS, title: 'Reportes' },
    { id: 'alarms', path: paths.ALERTS, title: 'Alarmas' },
  ];

  username = this.authService.getUser().name;
  notifications = this.notificationService.notifications;

  logout() {
    this.authService.logout();
  }

}
