import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import { Format, PERMISSIONS } from '@habilident/types';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from '@shared/services/formats.service';
import { ParametersService } from '@shared/services/parameters.service';
import { ReportsService } from '@shared/services/reports.service';
import { paths } from 'src/app/app.routes';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    RouterLink,
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
  readonly paths = paths;
  private readonly router = inject(Router);
  private readonly formatsService = inject(FormatsService);
  private readonly reportsService = inject(ReportsService);
  private readonly parametersService = inject(ParametersService);

  readonly isReady = signal<boolean>(false);

  formats = this.formatsService.formats;
  formatSelected = this.formatsService.formatIdSelected;
  @ViewChild('pdfIframe', { static: false }) pdfIframe!: ElementRef;

  ngOnInit(): void {
    this.loadData();

    this.reportsService.pdf$.subscribe(pdfUrl => {
      const iframe = this.pdfIframe.nativeElement as HTMLIFrameElement;
      iframe.src = pdfUrl;
      iframe.onload = () => iframe.contentWindow?.print();
    });
  }

  async loadData() {
    await this.formatsService.loadFormats();
    await this.parametersService.loadParameters();

    this.isReady.set(true);
  }

  goToRecords(formatId: string) {
    this.formatsService.formatIdSelected.next(formatId);
    this.router.navigate([paths.RECORDS]);
  }

}
