import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from '@shared/modules/material/material.module';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import { paths } from 'src/app/app.routes';
import { Format } from '@tipos/format';
import { FormatsService } from '@features/formats/services/formats.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, MaterialModule,
    NavbarComponent,
  ],
  providers: [FormatsService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent implements OnInit {
  formats: Format[] = [];
  readonly administration = [
    { id: 'roles', path: paths.ROLES, title: 'Roles', icon: 'admin_panel_settings' },
    { id: 'users', path: paths.USERS, title: 'Usuarios', icon: 'group' },
    { id: 'parameters', path: paths.PARAMETERS, title: 'Parametros', icon: 'fact_check' },
  ];

  constructor(
    private formatsService: FormatsService,
    private router: Router,
  ) { }

  async ngOnInit() {
    await this.loadFormats();

    this.formats[0]?._id
      ? this.goTo(paths.RECORDS, this.formats[0]._id)
      : this.goTo(paths.FORMATS)
  }

  async loadFormats() {
    const { data } = await this.formatsService.getAll();
    this.formats = data;
  }

  async remove(id: string) {
    const result = await this.formatsService.delete(id);
    if (result) this.loadFormats();
  }

  goTo(path: string, id = '') {
    this.router.navigate([path, id]);
  }
}
