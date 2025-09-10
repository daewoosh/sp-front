import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { API_PATH, EXCHANGE_URL as EXCHANGE_URL_TOKEN } from '@sp/config';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',

};
const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideAnimations(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, inMemoryScrollingFeature),
    NG_EVENT_PLUGINS,
    provideAnimationsAsync(),
    { provide: API_PATH, useValue: API_URL },
    { provide: EXCHANGE_URL_TOKEN, useValue: EXCHANGE_URL },
  ],
};
