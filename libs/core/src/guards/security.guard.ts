import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, concatMap, Observable, of, take, tap, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { map, mergeMap } from "rxjs/operators";
import { TuiAlertService } from "@taiga-ui/core";
import { AppStateService } from "../state";
import { LoginResult, UserRole } from "../models";
import { API_PATH } from "@sp/config";
import { isPlatformBrowser } from "@angular/common";
import { LocalStorageService } from "@sp/core/providers";
import { AUTH_TOKEN_NAME } from "@sp/core";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private httpClient: HttpClient,
              private appStateService: AppStateService,
              private router: Router,
              private clientService: ClientService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canLoad();
  }

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.clientService.checkAuthenticatedStatus().pipe(
      concatMap((result) => {
        if (!result) {
          return of(false);
        }

        return this.appStateService.role.pipe(
          map((role) => role !== UserRole.User)
        );
      }),
      tap((result: boolean) => {
        if (!result) {
          this.router.navigate(['/admin/login']);
        }
      })
    );
  }

}

@Injectable({providedIn: 'root'})
export class ClientService {
  constructor(
    private httpClient: HttpClient,
    private appStateService: AppStateService,
    @Inject(API_PATH) private apiUrl: string
  ) {
  }

  public checkAuthenticatedStatus(): Observable<boolean> {
    return this.appStateService.userState.pipe(
      take(1),
      mergeMap(({isLoggedIn}) => {
        if (!isLoggedIn) {
          return this.validateAuthToken();
        }
        return of(true);
      })
    );
  }

  private validateAuthToken(): Observable<boolean> {
    return this.httpClient
      .get<LoginResult>(`${this.apiUrl}/auth/check`)
      .pipe(
        map((loginResult) => {
          if (!loginResult.isSuccessLogin) {
            return false;
          }

          this.appStateService.setUserState({
            isLoggedIn: true,
            user: loginResult.user,
          });

          return true;
        }),
        catchError(() => of(false))
      );
  }
}


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private localStorage: LocalStorageService) {
  }

  public intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (isPlatformBrowser(this.platformId)) {
      const authToken = this.localStorage.get(AUTH_TOKEN_NAME);
      if (authToken) {
        return next.handle(this.addAuthToken(httpRequest, authToken));
      }
    }
    return next.handle(httpRequest);
  }

  private addAuthToken(
    request: HttpRequest<unknown>,
    token: string
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(@Inject(TuiAlertService)
              private readonly alertService: TuiAlertService) {
  }

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(request=>console.log({request})),
      catchError((response: any) => {
        if (response instanceof HttpErrorResponse && response.status !== 401) {
          if (response.status === 403) {
            this.alertService.open(
              'Доступ запрещен', {appearance: "error", autoClose: 5000}
            ).subscribe();
          } else {
            this.alertService.open(
              (response.error || response.error?.message), {appearance: "error", autoClose: 5000}
            ).subscribe();
          }
        }
        return throwError(() => {
          new Error(response.error);
        });
      })
    );
  }
}
