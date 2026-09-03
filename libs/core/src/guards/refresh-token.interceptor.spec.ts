import { isPlatformBrowser } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { PLATFORM_ID, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
import { API_PATH, AUTH_URL } from '@sp/config';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

import { AuthTokenStorageService } from '../providers/auth-token-storage.service';
import { CoursesStateService } from '../providers/courses-state.service';
import { LocalStorageService } from '../providers/local-storage.service';
import { AppStateService } from '../state/app-state.service';
import { AuthInterceptor } from './auth-interceptor.service';
import { ErrorInterceptor } from './error-interceptor.service';
import {
  RefreshTokenInterceptor,
  SESSION_EXPIRED_HANDLER,
} from './refresh-token.interceptor';

const API_PATH_VALUE = 'https://safe-poker.io/learn/api/v1';
const AUTH_URL_VALUE = 'https://safe-poker.io/api/v1';
const REFRESH_URL = `${AUTH_URL_VALUE}/auth/refresh`;

function jwt(
  sessionId: string,
  userId: string,
  exp = Math.floor(Date.now() / 1000) - 10
): string {
  const payload = Buffer.from(JSON.stringify({
    exp,
    SessionId: sessionId,
    UserId: userId,
  })).toString('base64url');
  return `header.${payload}.signature`;
}

function claimlessJwt(): string {
  const payload = Buffer.from(JSON.stringify({
    exp: Math.floor(Date.now() / 1000) - 10,
  })).toString('base64url');
  return `header.${payload}.signature`;
}

function flushUnauthorized(request: TestRequest, challenge = false): void {
  request.flush(null, {
    status: 401,
    statusText: 'Unauthorized',
    headers: challenge
      ? new HttpHeaders({ 'WWW-Authenticate': 'Bearer error="invalid_token"' })
      : undefined,
  });
}

describe('RefreshTokenInterceptor', () => {
  let cookieToken = '';
  const cookieService = {
    get: jest.fn(() => cookieToken),
    set: jest.fn((_name: string, value: string) => cookieToken = value),
    delete: jest.fn((_name: string, path?: string) => {
      if (path === undefined || path === '/') {
        cookieToken = '';
      }
    }),
  };
  const localStorageService = { remove: jest.fn() };
  const appStateService = { logout: jest.fn() };
  const coursesStateService = { clearCourses: jest.fn() };
  const router = { navigate: jest.fn(() => Promise.resolve(true)) };
  const sessionExpiredHandler = jest.fn();
  const alertService = { open: jest.fn() };
  let http: HttpClient;
  let controller: HttpTestingController;
  let storage: AuthTokenStorageService;

  beforeEach(() => {
    cookieToken = '';
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    controller?.verify();
    jest.restoreAllMocks();
  });

  function configure(options: { fullChain?: boolean; platformId?: string } = {}): void {
    const interceptorProviders: Provider[] = [
      { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ];
    if (options.fullChain) {
      interceptorProviders.push({
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorInterceptor,
        multi: true,
      });
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ...interceptorProviders,
        AuthTokenStorageService,
        { provide: SsrCookieService, useValue: cookieService },
        { provide: LocalStorageService, useValue: localStorageService },
        { provide: AppStateService, useValue: appStateService },
        { provide: CoursesStateService, useValue: coursesStateService },
        { provide: Router, useValue: router },
        { provide: API_PATH, useValue: API_PATH_VALUE },
        { provide: AUTH_URL, useValue: AUTH_URL_VALUE },
        { provide: PLATFORM_ID, useValue: options.platformId || 'browser' },
        { provide: SESSION_EXPIRED_HANDLER, useValue: sessionExpiredHandler },
        { provide: TuiAlertService, useValue: alertService },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    storage = TestBed.inject(AuthTokenStorageService);
  }

  function request(url = `${API_PATH_VALUE}/courses`): unknown[] {
    const errors: unknown[] = [];
    http.get(url).subscribe({ error: (error) => errors.push(error) });
    return errors;
  }

  it('refreshes an expired token once, commits it, and retries with the pinned bearer', () => {
    configure();
    const oldToken = jwt('session-1', 'user-1');
    const newToken = jwt('session-1', 'user-1', Math.floor(Date.now() / 1000) + 900);
    storage.setToken(oldToken);

    http.get(`${API_PATH_VALUE}/courses`).subscribe((value) => expect(value).toEqual({ ok: true }));
    const initial = controller.expectOne(`${API_PATH_VALUE}/courses`);
    expect(initial.request.headers.get('Authorization')).toBe(`Bearer ${oldToken}`);
    flushUnauthorized(initial);

    const refresh = controller.expectOne(REFRESH_URL);
    expect(refresh.request.withCredentials).toBe(true);
    refresh.flush({ accessToken: newToken });

    const retry = controller.expectOne(`${API_PATH_VALUE}/courses`);
    expect(retry.request.headers.get('Authorization')).toBe(`Bearer ${newToken}`);
    retry.flush({ ok: true });
    expect(storage.getToken()).toBe(newToken);
    expect(cookieService.delete).toHaveBeenCalledWith('authToken', '/learn');
    expect(sessionExpiredHandler).not.toHaveBeenCalled();
  });

  it('shares one refresh across parallel 401s and resets exactly once on failure', () => {
    configure();
    storage.setToken(jwt('session-1', 'user-1'));
    const clearToken = jest.spyOn(storage, 'clearToken');
    const errors = [request(`${API_PATH_VALUE}/one`), request(`${API_PATH_VALUE}/two`)];

    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/one`));
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/two`));
    const refresh = controller.expectOne(REFRESH_URL);
    refresh.flush(
      { message: 'invalid' },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(errors[0][0]).toBeInstanceOf(HttpErrorResponse);
    expect(errors[1][0]).toBeInstanceOf(HttpErrorResponse);
    expect(clearToken).toHaveBeenCalledTimes(1);
    expect(appStateService.logout).toHaveBeenCalledTimes(1);
    expect(coursesStateService.clearCourses).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(sessionExpiredHandler).toHaveBeenCalledTimes(1);
  });

  it('creates a fresh shared observable for two consecutive refresh cycles', () => {
    configure();
    const first = jwt('session-1', 'user-1');
    const second = jwt('session-1', 'user-1', Math.floor(Date.now() / 1000) + 900);
    const third = jwt('session-1', 'user-1', Math.floor(Date.now() / 1000) + 1800);
    storage.setToken(first);

    http.get(`${API_PATH_VALUE}/first`).subscribe();
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/first`));
    controller.expectOne(REFRESH_URL).flush({ accessToken: second });
    controller.expectOne(`${API_PATH_VALUE}/first`).flush({ ok: true });

    http.get(`${API_PATH_VALUE}/second`).subscribe();
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/second`), true);
    controller.expectOne(REFRESH_URL).flush({ accessToken: third });
    controller.expectOne(`${API_PATH_VALUE}/second`).flush({ ok: true });
    expect(storage.getToken()).toBe(third);
  });

  it('retries a late 401 with a newer token from the same session without refreshing', () => {
    configure();
    const oldToken = jwt('session-1', 'user-1');
    const newToken = jwt('session-1', 'user-1', Math.floor(Date.now() / 1000) + 900);
    storage.setToken(oldToken);
    http.get(`${API_PATH_VALUE}/courses`).subscribe();
    const initial = controller.expectOne(`${API_PATH_VALUE}/courses`);
    storage.setToken(newToken);

    flushUnauthorized(initial);
    const retry = controller.expectOne(`${API_PATH_VALUE}/courses`);
    expect(retry.request.headers.get('Authorization')).toBe(`Bearer ${newToken}`);
    retry.flush({ ok: true });
    controller.expectNone(REFRESH_URL);
    expect(sessionExpiredHandler).not.toHaveBeenCalled();
  });

  it.each([
    { name: 'empty token', body: {}, status: 200 },
    { name: 'refresh 401', body: { message: 'invalid' }, status: 401 },
  ])('resets on terminal $name and propagates the original error', ({ body, status }) => {
    configure();
    storage.setToken(jwt('session-1', 'user-1'));
    const errors = request();
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/courses`));
    const refresh = controller.expectOne(REFRESH_URL);
    if (status === 200) {
      refresh.flush(body);
    } else {
      refresh.flush(body, { status, statusText: 'Unauthorized' });
    }

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    expect(storage.getToken()).toBe('');
    expect(sessionExpiredHandler).toHaveBeenCalledTimes(1);
  });

  it.each([403, 429, 500])('keeps the session on retryable refresh status %s', (status) => {
    configure();
    const oldToken = jwt('session-1', 'user-1');
    storage.setToken(oldToken);
    const errors = request();
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/courses`));
    controller.expectOne(REFRESH_URL).flush(
      { message: 'temporary' },
      { status, statusText: 'Temporary failure' }
    );

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    expect(storage.getToken()).toBe(oldToken);
    expect(sessionExpiredHandler).not.toHaveBeenCalled();
  });

  it('keeps the session on a network refresh failure', () => {
    configure();
    const oldToken = jwt('session-1', 'user-1');
    storage.setToken(oldToken);
    const errors = request();
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/courses`));
    controller.expectOne(REFRESH_URL).error(new ProgressEvent('network'));

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    expect(storage.getToken()).toBe(oldToken);
    expect(sessionExpiredHandler).not.toHaveBeenCalled();
  });

  it('propagates a valid-token domain 401 without refresh or retry', () => {
    configure();
    storage.setToken(jwt('session-1', 'user-1', Math.floor(Date.now() / 1000) + 900));
    const errors = request();
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/courses`));

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    controller.expectNone(REFRESH_URL);
  });

  it('does not refresh anonymous requests', () => {
    configure();
    const errors = request();
    const initial = controller.expectOne(`${API_PATH_VALUE}/courses`);
    expect(initial.request.headers.has('Authorization')).toBe(false);
    flushUnauthorized(initial, true);

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    controller.expectNone(REFRESH_URL);
  });

  it('does not refresh a caller-provided bearer', () => {
    configure();
    storage.setToken(jwt('session-1', 'user-1'));
    const errors: unknown[] = [];
    http.get(`${API_PATH_VALUE}/courses`, {
      headers: { Authorization: 'Bearer integration-token' },
    }).subscribe({ error: (error) => errors.push(error) });
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/courses`), true);

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    controller.expectNone(REFRESH_URL);
  });

  it('discards a successful refresh after logout bumps the epoch', () => {
    configure();
    const oldToken = jwt('session-1', 'user-1');
    const newToken = jwt('session-1', 'user-1', Math.floor(Date.now() / 1000) + 900);
    storage.setToken(oldToken);
    const errors = request();
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/courses`));
    const refresh = controller.expectOne(REFRESH_URL);

    storage.clearToken();
    refresh.flush({ accessToken: newToken });

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    expect(storage.getToken()).toBe('');
    expect(appStateService.logout).not.toHaveBeenCalled();
    expect(sessionExpiredHandler).not.toHaveBeenCalled();
  });

  it('leaves a newer session untouched when an old refresh failure arrives', () => {
    configure();
    storage.setToken(jwt('session-1', 'user-1'));
    const newerToken = jwt('session-2', 'user-1', Math.floor(Date.now() / 1000) + 900);
    const errors = request();
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/courses`));
    const refresh = controller.expectOne(REFRESH_URL);

    storage.clearToken();
    storage.setToken(newerToken);
    refresh.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    expect(storage.getToken()).toBe(newerToken);
    expect(sessionExpiredHandler).not.toHaveBeenCalled();
  });

  it('rejects a refresh commit when another tab installed a same-user new session', () => {
    configure();
    storage.setToken(jwt('session-1', 'user-1'));
    const replacement = jwt('session-2', 'user-1', Math.floor(Date.now() / 1000) + 900);
    const errors = request();
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/courses`));
    const refresh = controller.expectOne(REFRESH_URL);

    storage.setToken(replacement);
    refresh.flush({
      accessToken: jwt('session-1', 'user-1', Math.floor(Date.now() / 1000) + 900),
    });

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    expect(storage.getToken()).toBe(replacement);
    expect(sessionExpiredHandler).not.toHaveBeenCalled();
  });

  it('rejects a late retry across a session boundary', () => {
    configure();
    storage.setToken(jwt('session-1', 'user-1'));
    const errors = request();
    const initial = controller.expectOne(`${API_PATH_VALUE}/courses`);
    const replacement = jwt('session-2', 'user-1', Math.floor(Date.now() / 1000) + 900);
    storage.setToken(replacement);
    flushUnauthorized(initial);

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    expect(storage.getToken()).toBe(replacement);
    controller.expectNone(REFRESH_URL);
  });

  it('performs one terminal reset when the returned token changes identity', () => {
    configure();
    storage.setToken(jwt('session-1', 'user-1'));
    const errors = request();
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/courses`));
    controller.expectOne(REFRESH_URL).flush({
      accessToken: jwt('session-2', 'user-2', Math.floor(Date.now() / 1000) + 900),
    });

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    expect(storage.getToken()).toBe('');
    expect(sessionExpiredHandler).toHaveBeenCalledTimes(1);
  });

  it.each(['malformed', 'claimless'])('resets an identity-less $malformed snapshot without refreshing', (kind) => {
    configure();
    storage.setToken(kind === 'malformed' ? 'garbage' : claimlessJwt());
    const errors = request();
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/courses`), true);

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    expect(storage.getToken()).toBe('');
    expect(sessionExpiredHandler).toHaveBeenCalledTimes(1);
    controller.expectNone(REFRESH_URL);
  });

  it('does not let a foreign-session 401 join an in-flight refresh', () => {
    configure();
    const sessionOne = jwt('session-1', 'user-1');
    const sessionTwo = jwt('session-2', 'user-2');
    storage.setToken(sessionOne);
    const firstErrors = request(`${API_PATH_VALUE}/one`);
    const first = controller.expectOne(`${API_PATH_VALUE}/one`);
    flushUnauthorized(first);
    const refresh = controller.expectOne(REFRESH_URL);

    storage.setToken(sessionTwo);
    const secondErrors = request(`${API_PATH_VALUE}/two`);
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/two`));
    controller.expectNone(REFRESH_URL);
    refresh.flush({
      accessToken: jwt('session-1', 'user-1', Math.floor(Date.now() / 1000) + 900),
    });

    expect((firstErrors[0] as HttpErrorResponse).status).toBe(401);
    expect((secondErrors[0] as HttpErrorResponse).status).toBe(401);
    expect(storage.getToken()).toBe(sessionTwo);
    expect(sessionExpiredHandler).not.toHaveBeenCalled();
  });

  it.each([
    `${AUTH_URL_VALUE}/auth`,
    `${AUTH_URL_VALUE}/AUTH/REFRESH?x=1`,
    `${AUTH_URL_VALUE}/auth/PrepareAuth`,
    `${AUTH_URL_VALUE}/auth/logout`,
    'https://third-party.example/data',
    'https://safe-poker.io.evil.example/learn/api/v1/data',
  ])('does not intercept excluded or foreign URL %s', (url) => {
    configure();
    storage.setToken(jwt('session-1', 'user-1'));
    const errors = request(url);
    flushUnauthorized(controller.expectOne(url), true);

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    controller.expectNone(REFRESH_URL);
  });

  it('passes through on SSR without refreshing', () => {
    configure({ platformId: 'server' });
    expect(isPlatformBrowser('server')).toBe(false);
    cookieToken = jwt('session-1', 'user-1');
    const errors = request();
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/courses`), true);

    expect((errors[0] as HttpErrorResponse).status).toBe(401);
    controller.expectNone(REFRESH_URL);
  });

  it('sees the original 401 through the full Refresh -> Auth -> Error chain', () => {
    configure({ fullChain: true });
    const oldToken = jwt('session-1', 'user-1', Math.floor(Date.now() / 1000) + 900);
    const newToken = jwt('session-1', 'user-1', Math.floor(Date.now() / 1000) + 1800);
    storage.setToken(oldToken);
    http.get(`${API_PATH_VALUE}/courses`).subscribe();
    flushUnauthorized(controller.expectOne(`${API_PATH_VALUE}/courses`), true);

    controller.expectOne(REFRESH_URL).flush({ accessToken: newToken });
    const retry = controller.expectOne(`${API_PATH_VALUE}/courses`);
    expect(retry.request.headers.get('Authorization')).toBe(`Bearer ${newToken}`);
    retry.flush({ ok: true });
    expect(alertService.open).not.toHaveBeenCalled();
  });
});
