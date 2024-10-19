import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '@shared/modules/material/material.module';
import { FormatsService } from './services/formats.service';
import { Format } from '@tipos/format';

@Component({
  selector: 'app-formats',
  standalone: true,
  imports: [
    MaterialModule
  ],
  providers: [FormatsService],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss'
})
export class FormatsComponent implements OnInit {
  formats: Format[] = [];

  constructor(private formatsService: FormatsService) { }

  ngOnInit(): void {
    this.loadFormats();
  }

  async loadFormats() {
    const { data } = await this.formatsService.getAll();
    this.formats = data;
  }

  goto(formatId?: string) {

  }

  async remove(id: string) {
    const result = await this.formatsService.delete(id);
    if (result) this.loadFormats();
  }

}
