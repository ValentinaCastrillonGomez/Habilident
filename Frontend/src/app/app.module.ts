import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import SocialAuthServiceConfig from './feature/auth/auth-social.config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
  ],
  providers: [
    { provide: 'BASE_API_URL', useValue: environment.apiUrl },
    { provide: 'SocialAuthServiceConfig', useValue: SocialAuthServiceConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
