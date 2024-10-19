import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from './services/formats.service';
import { FormatComponent, RowsFormType } from '@features/formats/components/format/format.component';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Format } from '@tipos/format';

@Component({
  selector: 'app-formats',
  standalone: true,
  imports: [
    MaterialModule, FormatComponent
  ],
  providers: [FormatsService],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss'
})
export default class FormatsComponent implements OnInit {
  formatForm: FormGroup<{
    name: FormControl<string>;
    rows: FormArray<FormGroup<RowsFormType>>;
  }>;
  format: Format | null = null;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private formatsService: FormatsService,
    private route: ActivatedRoute,
  ) {
    this.formatForm = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      rows: this.formBuilder.array<FormGroup<RowsFormType>>([]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.format = params.get('id')
        ? await this.formatsService.get(params.get('id')!)
        : null;
    });
  }

}
