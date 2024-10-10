import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DEFAULT_DIALOG_CONFIG } from '@angular/cdk/dialog';
import { AppPaginatorIntl } from './material.paginator';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  exports: [
    CommonModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatMenuModule,
    MatDialogModule,
    MatCardModule,
    MatGridListModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
  providers: [
    { provide: DEFAULT_DIALOG_CONFIG, useValue: { maxWidth: '70vw' } },
    { provide: MAT_PAGINATOR_DEFAULT_OPTIONS, useValue: { hidePageSize: true, showFirstLastButtons: true } },
    { provide: MatPaginatorIntl, useClass: AppPaginatorIntl }
  ]
})
export class MaterialModule { }
