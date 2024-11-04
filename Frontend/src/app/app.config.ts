import { ApplicationConfig, InjectionToken, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { loadingInterceptor } from '@core/interceptors/loading.interceptor';
import { authInterceptor } from '@core/interceptors/auth.interceptor';

export type Environment = typeof environment;

export const ENV = new InjectionToken<Environment>('ENV');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, loadingInterceptor]),
      withFetch()
    ),
    provideAnimationsAsync(),
    { provide: ENV, useValue: environment },
    { provide: LOCALE_ID, useValue: 'es-CO' }
  ],
};
