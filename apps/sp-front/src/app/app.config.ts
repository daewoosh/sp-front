import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  Injectable,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  AdminGuard,
  AuthGuard,
  AuthInterceptor,
  ClientService,
  ErrorInterceptor,
} from '@sp/core/guards';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CourseActivationService } from '@sp/core/providers';
import { API_PATH, EXCHANGE_URL as EXCHANGE_URL_TOKEN, APP_URL as APP_URL_TOKEN, AUTH_URL as AUTH_URL_TOKEN, AUTH_BOT_NAME as AUTH_BOT_NAME_TOKEN } from '@sp/config';
import { CoursesStateService } from '@sp/core/providers/courses-state.service';
import { initializeApplication } from './applnitializer';
import { provideStore } from '@ngrx/store';
import { applicationReducer } from '@sp/core/store/application';
import { CourseAccessGuard } from '@sp/courses-page';

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
    provideRouter(appRoutes, inMemoryScrollingFeature, withComponentInputBinding()),
    provideAnimations(),
    provideClientHydration(),
    provideZoneChangeDetection({eventCoalescing: true}),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    NG_EVENT_PLUGINS,
    provideStore({application: applicationReducer}),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimationsAsync(),
    {provide: API_PATH, useValue: API_URL},
    {provide: EXCHANGE_URL_TOKEN, useValue: EXCHANGE_URL},
    {provide: APP_URL_TOKEN, useValue: APP_URL},
    {provide: AUTH_URL_TOKEN, useValue: AUTH_URL},
    {provide: AUTH_BOT_NAME_TOKEN, useValue: AUTH_BOT_NAME},
    CourseActivationService,
    AdminGuard,
    AuthGuard,
    CourseAccessGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApplication,
      multi: true,
      deps: [ClientService, CoursesStateService, HttpClient],
    },
  ],
};
