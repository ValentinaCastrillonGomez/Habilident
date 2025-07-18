import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { Format, PERMISSIONS } from '@habilident/types';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PATHS } from 'src/app/app.routes';

@Component({
  selector: 'app-formats',
  imports: [
    RouterLink,
    RouterLinkActive,
    MaterialModule,
    PermissionDirective,
  ],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormatsComponent implements OnInit {
  readonly permissions = PERMISSIONS;
  readonly paths = PATHS;
  private readonly formatsService = inject(FormatsService);

  formats = computed<Format[]>(() => this.formatsService.data());

  ngOnInit(): void {
    this.formatsService.load();
  }

}
