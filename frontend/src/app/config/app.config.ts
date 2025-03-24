import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'
import { routes } from '../app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { authInterceptor } from '../core/interceptors/auth.interceptor';
import { provideToastr } from 'ngx-toastr'
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    AuthService,
    provideAnimations(),
    provideToastr(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
};
