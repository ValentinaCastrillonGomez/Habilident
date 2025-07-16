import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppPaginatorIntl } from './material.paginator';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MAT_ICON_DEFAULT_OPTIONS, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { APP_FORMATS, AppDateAdapter } from './material-date.adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
    MatDatepickerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatStepperModule,
    MatProgressBarModule,
    MatChipsModule,
    MatBadgeModule,
    MatTimepickerModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: APP_FORMATS },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MatPaginatorIntl, useClass: AppPaginatorIntl },
    { provide: MAT_PAGINATOR_DEFAULT_OPTIONS, useValue: { hidePageSize: true, showFirstLastButtons: true } },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { maxWidth: '90vw', disableClose: true, hasBackdrop: true, } },
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
  ]
})
export class MaterialModule { }
