import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Format, PERMISSIONS } from '@habilident/types';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { PATHS } from 'src/app/app.routes';

@Component({
  selector: 'app-navlist',
  imports: [
    MaterialModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './navlist.component.html',
  styleUrl: './navlist.component.scss'
})
export class NavlistComponent implements OnInit {
  readonly permissions = PERMISSIONS;
  readonly paths = PATHS;
  private readonly formatsService = inject(FormatsService);

  formats = computed<Format[]>(() => this.formatsService.data());

  ngOnInit(): void {
    this.formatsService.load();
  }

}
