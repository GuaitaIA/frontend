import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  applicationProviders: [
    provideZoneChangeDetection(),
    providePrimeNG({
      ripple: false,
      inputVariant: 'outlined',
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
  ],
})
  .catch(err => console.error(err));
