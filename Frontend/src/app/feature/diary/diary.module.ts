import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiaryRoutingModule } from './diary-routing.module';
import { DiaryComponent } from './diary.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DiaryComponent
  ],
  imports: [
    CommonModule,
    DiaryRoutingModule,
    FullCalendarModule,
    SharedModule
  ]
})
export class DiaryModule { }
