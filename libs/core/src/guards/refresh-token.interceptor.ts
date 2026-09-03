import { isPlatformBrowser } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { API_PATH, AUTH_URL } from '@sp/config';
import {
  catchError,
  defer,
  finalize,
  Observable,
  of,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';

import {
  AuthTokenStorageService,
  DecodedAuthTokenClaims,
} from '../providers/auth-token-storage.service';
import { CoursesStateService } from '../providers/courses-state.service';
import { AppStateService } from '../state/app-state.service';
import { isExcludedAuthUrl, isScopedApiUrl } from './api-url.util';

export const SESSION_EXPIRED_HANDLER = new InjectionToken<() => void>(
  'SESSION_EXPIRED_HANDLER'
);

export interface RefreshResult {
  accessToken?: string;
}

type ValidClaims = Extract<DecodedAuthTokenClaims, { valid: true }>;
type IdentityClaims = ValidClaims & { SessionId: string; UserId: string };

interface RequestSnapshot {
  token: string;
  claims: DecodedAuthTokenClaims;
  ours: boolean;
}

type RefreshOutcome =
  | { kind: 'committed'; token: string }
  | { kind: 'stale' }
  | { kind: 'terminal' }
  | { kind: 'retryable'; status: number };

interface InFlightRefresh {
  sessionId: string;
  outcome$: Observable<RefreshOutcome>;
}

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private inFlightRefresh?: InFlightRefresh;

  constructor(
    private readonly injector: Injector,
    private readonly tokenStorage: AuthTokenStorageService,
    private readonly appStateService: AppStateService,
    private readonly coursesStateService: CoursesStateService,
    private readonly router: Router,
    @Inject(API_PATH) private readonly apiPath: string,
    @Inject(AUTH_URL) private readonly authUrl: string,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    @Inject(SESSION_EXPIRED_HANDLER) private readonly sessionExpiredHandler: () => void
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      !isPlatformBrowser(this.platformId)
      || !isScopedApiUrl(request.url, this.apiPath, this.authUrl)
      || isExcludedAuthUrl(request.url, this.authUrl)
    ) {
      return next.handle(request);
    }

    const snapshot = this.snapshotRequest(request);
    return next.handle(request).pipe(
      catchError((error: unknown) => {
        if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
          return throwError(() => error);
        }

        return this.handleUnauthorized(request, next, error, snapshot);
      })
    );
  }

  private snapshotRequest(request: HttpRequest<unknown>): RequestSnapshot | undefined {
    if (request.headers.has('Authorization')) {
      const authorization = request.headers.get('Authorization') || '';
      const bearer = /^Bearer\s+(.+)$/i.exec(authorization);
      const token = bearer?.[1] || '';
      return {
        token,
        claims: this.tokenStorage.decodeClaims(token),
        ours: false,
      };
    }

    const token = this.tokenStorage.getToken();
    return token
      ? { token, claims: this.tokenStorage.decodeClaims(token), ours: true }
      : undefined;
  }

  private handleUnauthorized(
    request: HttpRequest<unknown>,
    next: HttpHandler,
    error: HttpErrorResponse,
    snapshot?: RequestSnapshot
  ): Observable<HttpEvent<unknown>> {
    if (!snapshot || !snapshot.ours) {
      return throwError(() => error);
    }

    const currentToken = this.tokenStorage.getToken();
    if (currentToken !== snapshot.token) {
      const currentClaims = this.tokenStorage.decodeClaims(currentToken);
      if (this.sameIdentity(snapshot.claims, currentClaims)) {
        console.warn('[auth-refresh] late-token retry');
        return next.handle(this.withBearer(request, currentToken));
      }

      return throwError(() => error);
    }

    if (!this.hasIdentity(snapshot.claims)) {
      this.resetMalformedSnapshot(snapshot.token);
      return throwError(() => error);
    }

    const challenge = error.headers.get('WWW-Authenticate') || '';
    const invalidTokenChallenge = /^Bearer\b.*\berror\s*=\s*["']?invalid_token["']?/i
      .test(challenge);
    if (!invalidTokenChallenge && !this.tokenStorage.isExpired(snapshot.token, 0)) {
      return throwError(() => error);
    }

    const refresh$ = this.getRefreshOutcome(snapshot.claims);
    if (!refresh$) {
      return throwError(() => error);
    }

    return refresh$.pipe(
      switchMap((outcome) => {
        if (
          outcome.kind === 'committed'
          && this.sameIdentity(
            snapshot.claims,
            this.tokenStorage.decodeClaims(outcome.token)
          )
        ) {
          return next.handle(this.withBearer(request, outcome.token));
        }

        return throwError(() => error);
      })
    );
  }

  private getRefreshOutcome(claims: IdentityClaims): Observable<RefreshOutcome> | null {
    if (this.inFlightRefresh) {
      return this.inFlightRefresh.sessionId === claims.SessionId
        ? this.inFlightRefresh.outcome$
        : null;
    }

    const sessionId = claims.SessionId;
    const outcome$ = defer(() => {
      const epoch = this.tokenStorage.sessionEpoch;
      return this.injector.get(HttpClient)
        .post<RefreshResult>(`${this.authUrl}/auth/refresh`, {}, {
          withCredentials: true,
        })
        .pipe(
          switchMap((result) => of(this.handleRefreshSuccess(result, epoch, claims))),
          catchError((error: unknown) => of(this.handleRefreshFailure(error, epoch, claims)))
        );
    }).pipe(
      finalize(() => {
        if (this.inFlightRefresh?.sessionId === sessionId) {
          this.inFlightRefresh = undefined;
        }
      }),
      shareReplay(1)
    );

    this.inFlightRefresh = {
      sessionId,
      outcome$,
    };
    return outcome$;
  }

  private handleRefreshSuccess(
    result: RefreshResult,
    epoch: number,
    claims: IdentityClaims
  ): RefreshOutcome {
    if (!this.ownsSession(epoch, claims)) {
      console.warn('[auth-refresh] stale');
      return { kind: 'stale' };
    }

    if (!result.accessToken) {
      return this.resetTerminalSession();
    }

    const returnedClaims = this.tokenStorage.decodeClaims(result.accessToken);
    if (!this.sameIdentity(claims, returnedClaims)) {
      return this.resetTerminalSession();
    }

    this.tokenStorage.setToken(result.accessToken);
    console.warn('[auth-refresh] refresh_ok');
    return { kind: 'committed', token: result.accessToken };
  }

  private handleRefreshFailure(
    error: unknown,
    epoch: number,
    claims: IdentityClaims
  ): RefreshOutcome {
    if (!this.ownsSession(epoch, claims)) {
      console.warn('[auth-refresh] stale');
      return { kind: 'stale' };
    }

    const status = error instanceof HttpErrorResponse ? error.status : 0;
    if (status === 401) {
      return this.resetTerminalSession();
    }

    console.warn(`[auth-refresh] retryable status=${status}`);
    return { kind: 'retryable', status };
  }

  private resetMalformedSnapshot(token: string): void {
    if (this.tokenStorage.getToken() !== token) {
      return;
    }

    this.resetSession();
    console.warn('[auth-refresh] session_invalid');
  }

  private resetTerminalSession(): RefreshOutcome {
    this.resetSession();
    console.warn('[auth-refresh] session_invalid');
    return { kind: 'terminal' };
  }

  private resetSession(): void {
    this.tokenStorage.clearToken();
    this.appStateService.logout();
    this.coursesStateService.clearCourses();
    void this.router.navigate(['/']);
    this.sessionExpiredHandler();
  }

  private ownsSession(epoch: number, claims: IdentityClaims): boolean {
    return epoch === this.tokenStorage.sessionEpoch
      && this.sameIdentity(
        claims,
        this.tokenStorage.decodeClaims(this.tokenStorage.getToken())
      );
  }

  private hasIdentity(claims: DecodedAuthTokenClaims): claims is IdentityClaims {
    return claims.valid && !!claims.SessionId && !!claims.UserId;
  }

  private sameIdentity(
    left: DecodedAuthTokenClaims,
    right: DecodedAuthTokenClaims
  ): boolean {
    return this.hasIdentity(left)
      && this.hasIdentity(right)
      && left.SessionId === right.SessionId
      && left.UserId === right.UserId;
  }

  private withBearer(
    request: HttpRequest<unknown>,
    token: string
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
}
