import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { take, mergeMap, map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppStateService } from "@sp/core/state";
import { LoginResult } from "@sp/core/models";
import { isPlatformBrowser } from "@angular/common";

@Injectable()
export class AppResolver implements Resolve<boolean> {
  constructor(private clientService: ClientService) {
  }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.clientService.checkAuthenticatedStatus();
  }
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(
    private httpClient: HttpClient,
    private appStateService: AppStateService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {}

  public checkAuthenticatedStatus(): any {
    if (!isPlatformBrowser(this.platformId)) {
      return of(false);
    }else
    return this.appStateService.userState.pipe(
      take(1),
      mergeMap(({ isLoggedIn }) => {
        if (!isLoggedIn) {
          return this.validateAuthToken();
        }
        return of(true);
      })
    );
  }

  private validateAuthToken(): Promise<boolean> {
    return firstValueFrom(this.httpClient
      .get<LoginResult>(`${API_URL}/auth/check`)
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
        catchError(() => {
          return of(false)}),
      ));
  }
}
