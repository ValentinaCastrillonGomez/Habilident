import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import FormatsComponent from '@features/formats/formats.component';
import { MaterialModule } from '@shared/modules/material/material.module';
import { ParametersService } from '@shared/services/parameters.service';
import { ReportsService } from '@shared/services/reports.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    NavbarComponent,
    MaterialModule,
    FormatsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent implements OnInit {
  private readonly reportsService = inject(ReportsService);
  private readonly parametersService = inject(ParametersService);

  @ViewChild('pdfIframe', { static: false }) pdfIframe!: ElementRef;

  ngOnInit(): void {
    this.parametersService.loadParameters();

    this.reportsService.pdf$.subscribe(pdfUrl => {
      const iframe = this.pdfIframe.nativeElement as HTMLIFrameElement;
      iframe.src = pdfUrl;
      iframe.onload = () => iframe.contentWindow?.print();
    });
  }
}
