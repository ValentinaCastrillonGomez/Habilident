import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultanciesRoutingModule } from './consultancies-routing.module';
import { ConsultanciesComponent } from './consultancies.component';
import { DetailConsultanciesComponent } from './components/detail-consultancies/detail-consultancies.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ConsultanciesComponent,
    DetailConsultanciesComponent
  ],
  imports: [
    CommonModule,
    ConsultanciesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class ConsultanciesModule { }
