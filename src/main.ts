import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { limpiarStateDeLogout } from './app/core/auth/logout-url.util';

limpiarStateDeLogout();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
