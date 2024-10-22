import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ParametersService } from '@features/parameters/services/parameters.service';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [ParametersService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {

}
