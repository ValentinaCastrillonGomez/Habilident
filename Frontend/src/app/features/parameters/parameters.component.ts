import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ParametersService } from './services/parameters.service';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormArray, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { List } from '@tipos/parameter';
import { MatDialog } from '@angular/material/dialog';
import { ListComponent } from './components/list/list.component';

export type ListFormType = {
  name: FormControl<string>;
  protected: FormControl<boolean>;
  values: FormArray<FormControl<string>>;
};

@Component({
  selector: 'app-parameters',
  standalone: true,
  imports: [
    MaterialModule,
  ],
  providers: [ParametersService],
  templateUrl: './parameters.component.html',
  styleUrl: './parameters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ParametersComponent implements OnInit {
  private parametersService = inject(ParametersService);
  private formBuilder = inject(NonNullableFormBuilder);
  private dialog = inject(MatDialog);

  parameterForm = this.formBuilder.group({
    office: this.formBuilder.control('01'),
    list: this.formBuilder.array([]),
  });
  displayedColumns: string[] = ['name', 'values', 'actions'];

  async ngOnInit() {
    const { data } = await this.parametersService.getAll(0, 0, '01');

  }

  async remove(id: string) {
    const result = await this.parametersService.delete(id);
    // if (result) this.actions.next();
  }

  open(data?: List) {
    const dialogRef = this.dialog.open(ListComponent, { data });

    dialogRef.afterClosed().subscribe(result => {
      // if (result) this.actions.next();
    });
  }

}
