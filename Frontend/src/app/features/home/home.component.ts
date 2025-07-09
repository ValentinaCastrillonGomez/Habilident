import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import { NavlistComponent } from '@core/components/navlist/navlist.component';
import { PERMISSIONS } from '@habilident/types';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { MaterialModule } from '@shared/modules/material/material.module';
import { ReportsService } from '@shared/services/reports.service';
import { PATHS } from 'src/app/app.routes';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    RouterLink,
    NavbarComponent,
    NavlistComponent,
    MaterialModule,
    PermissionDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent implements OnInit {
  readonly permissions = PERMISSIONS;
  readonly paths = PATHS;
  private readonly reportsService = inject(ReportsService);
  @ViewChild('pdfIframe', { static: false }) pdfIframe!: ElementRef;

  ngOnInit(): void {
    this.reportsService.pdf$.subscribe(pdfUrl => {
      const iframe = this.pdfIframe.nativeElement as HTMLIFrameElement;
      iframe.src = pdfUrl;
      iframe.onload = () => iframe.contentWindow?.print();
    });
  }

}
