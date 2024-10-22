import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from '@shared/modules/material/material.module';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import { paths } from 'src/app/app.routes';
import { FormatsService } from '@features/formats/services/formats.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, MaterialModule,
    NavbarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent implements OnInit {
  private router = inject(Router);
  formatsService = inject(FormatsService);

  readonly administration = [
    { id: 'roles', path: paths.ROLES, title: 'Roles', icon: 'admin_panel_settings' },
    { id: 'users', path: paths.USERS, title: 'Usuarios', icon: 'group' },
    { id: 'parameters', path: paths.PARAMETERS, title: 'Parametros', icon: 'fact_check' },
  ];

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.formatsService.formats.pipe(first()).subscribe((formats) => {
        formats[0]?._id
          ? this.goTo(paths.RECORDS, formats[0]._id)
          : this.goTo(paths.FORMATS);
      });
    }
  }

  async remove(id: string) {
    const result = await this.formatsService.delete(id);
    if (result) this.formatsService.loadFormats();
  }

  goTo(path: string, id = '') {
    this.router.navigate([path, id]);
  }
}
