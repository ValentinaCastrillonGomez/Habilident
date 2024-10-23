import { CdkDrag } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    MaterialModule,
    CdkDrag
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportComponent {

}
