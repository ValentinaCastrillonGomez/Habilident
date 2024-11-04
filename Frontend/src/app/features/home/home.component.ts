import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import { ReportsService } from '@shared/services/reports.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent implements OnInit {
  private reportsService = inject(ReportsService);

  @ViewChild('pdfIframe', { static: false }) pdfIframe!: ElementRef;

  ngOnInit(): void {
    this.reportsService.pdf$.subscribe(pdfUrl => {
      const iframe = this.pdfIframe.nativeElement as HTMLIFrameElement;
      iframe.src = pdfUrl;

      iframe.onload = () => iframe.contentWindow?.print();
    });
  }

}
