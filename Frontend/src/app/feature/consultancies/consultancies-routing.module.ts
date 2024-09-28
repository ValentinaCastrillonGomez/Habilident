import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultanciesComponent } from './consultancies.component';

const routes: Routes = [
  { path: '', component: ConsultanciesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultanciesRoutingModule { }
