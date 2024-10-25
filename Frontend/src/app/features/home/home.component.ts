import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from '@shared/modules/material/material.module';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import { paths } from 'src/app/app.routes';
import { FormatsComponent } from '@features/formats/formats.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MaterialModule,
    NavbarComponent,
    FormatsComponent,
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
