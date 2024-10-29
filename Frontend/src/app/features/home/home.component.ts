import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@core/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  readonly administration = [
    { id: 'roles', path: paths.ROLES, title: 'Roles', icon: 'admin_panel_settings' },
    { id: 'users', path: paths.USERS, title: 'Usuarios', icon: 'group' },
    { id: 'parameters', path: paths.PARAMETERS, title: 'Parametros', icon: 'fact_check' },
  ];
  readonly management = [
    { id: 'reports', path: paths.REPORTS, title: 'Reportes', icon: 'description' },
    { id: 'alarms', path: paths.ALARMS, title: 'Alarmas', icon: 'alarm' },
  ];

}
