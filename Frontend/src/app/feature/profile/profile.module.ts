import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { AccountService } from './services/account.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule } from '@abacritt/angularx-social-login';


@NgModule({
  declarations: [
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    SocialLoginModule,
  ],
  providers: [AccountService]
})
export class ProfileModule { }
