import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { StatePipe } from './pipes/state.pipe';
import { ConsultanciesService } from './services/consultancies.service';

@NgModule({
  declarations: [
    NavbarComponent,
    StatePipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    NavbarComponent,
    StatePipe,
  ],
  providers: [ConsultanciesService]
})
export class SharedModule { }
