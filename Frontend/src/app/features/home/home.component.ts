import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import { PERMISSIONS } from '@habilident/types';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { ParametersService } from '@shared/services/parameters.service';
import { ReportsService } from '@shared/services/reports.service';
import { filter } from 'rxjs';
import { paths } from 'src/app/app.routes';

const urlRecords = `/${paths.RECORDS}/`;

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
  private readonly router = inject(Router);
  private readonly formatsService = inject(FormatsService);
  private readonly reportsService = inject(ReportsService);
  private readonly parametersService = inject(ParametersService);

  formats = this.formatsService.formats;
  formatSelected = this.formatsService.formatSelected;
  @ViewChild('pdfIframe', { static: false }) pdfIframe!: ElementRef;

  ngOnInit(): void {
    this.selectFirstFormat();
    this.parametersService.loadParameters();

    this.reportsService.pdf$.subscribe(pdfUrl => {
      const iframe = this.pdfIframe.nativeElement as HTMLIFrameElement;
      iframe.src = pdfUrl;
      iframe.onload = () => iframe.contentWindow?.print();
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.selectFormat(url);
      });
  }

  private async selectFirstFormat() {
    await this.formatsService.loadFormats();
    this.selectFormat(this.router.url);

    if (this.router.url.substring(1) === paths.HOME) this.goToDefault();
  }

  private selectFormat(url: string) {
    if (!url.startsWith(urlRecords)) {
      this.formatSelected.set(null);
      return;
    }

    const format = this.formats()
      .find(format => format._id === url.replace(urlRecords, '')) || null;

    (format)
      ? this.formatSelected.set(format)
      : this.goToDefault();
  }

  private goToDefault() {
    (this.formats().length > 0)
      ? this.goToRecords(this.formats()[0]._id)
      : this.goToFormats();
  }

  goToRecords(formatId: string) {
    this.router.navigate([paths.RECORDS, formatId]);
  }

  goToFormats() {
    this.router.navigate([paths.FORMATS]);
  }
}
