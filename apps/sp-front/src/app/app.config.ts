import { NG_EVENT_PLUGINS } from "@taiga-ui/event-plugins";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  Injectable,
  isDevMode,
  provideZoneChangeDetection
} from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from "@angular/common/http";
import { AuthInterceptor, ErrorInterceptor } from "@sp/core/guards";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { AppResolver, ClientService } from "./app.resolver";
import { initializeApplication } from "./applnitializer";
import { CONFIG, EXCHANGE_URL } from "@sp/config";
import { environment } from "../environments/environment";

@Injectable()
class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global error handler', error);
  }
}

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',

};
const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideRouter(appRoutes, inMemoryScrollingFeature),
    provideAnimations(),
    provideClientHydration(),
    provideZoneChangeDetection({eventCoalescing: true}),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    NG_EVENT_PLUGINS,
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimationsAsync(),
    {provide: EXCHANGE_URL, useValue: environment.exchangeUrl},
    {provide: CONFIG, useValue: environment},
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApplication,
      multi: true,
      deps: [ClientService],
    },
  ],
};


