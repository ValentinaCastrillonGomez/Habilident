import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import { Format, PERMISSIONS } from '@habilident/types';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { ParametersService } from '@shared/services/parameters.service';
import { ReportsService } from '@shared/services/reports.service';
import { filter, first, take } from 'rxjs';
import { paths } from 'src/app/app.routes';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    NavbarComponent,
    MaterialModule,
    PermissionDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent implements OnInit {
  readonly permissions = PERMISSIONS;
  readonly formatsService = inject(FormatsService);
  readonly router = inject(Router);
  private readonly reportsService = inject(ReportsService);
  private readonly parametersService = inject(ParametersService);

  @ViewChild('pdfIframe', { static: false }) pdfIframe!: ElementRef;

  formats = computed<Format[] | null>(() => this.formatsService.formats());

  ngOnInit(): void {
    this.formatsService.loadFormats();
    this.parametersService.loadParameters();

    this.formatsService.formats$.pipe(first())
      .subscribe(formats => {
        (formats.length > 0)
          ? this.formatsService.formatSelected.set(formats[0])
          : this.goToFormats();
      });

    this.reportsService.pdf$.subscribe(pdfUrl => {
      const iframe = this.pdfIframe.nativeElement as HTMLIFrameElement;
      iframe.src = pdfUrl;
      iframe.onload = () => iframe.contentWindow?.print();
    });
  }

  goToFormats() {
    this.router.navigate([paths.FORMATS]);
  }
}
