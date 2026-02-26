import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { CustomGlobalErrorHandler } from './GlobalExceptionHandler/GlobalErrorHandler';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { GlobalErrorInterceptor } from './GlobalExceptionHandler/GlobalErrorInterceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {provide: ErrorHandler, useClass: CustomGlobalErrorHandler}, // for global exception handling in Angular.
    provideHttpClient(withInterceptors([GlobalErrorInterceptor])) // for global exception handling in Angular.
  ]
};
