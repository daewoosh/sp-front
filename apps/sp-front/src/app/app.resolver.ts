import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppStateService } from "@sp/core/state";
import { LoginResult } from "@sp/core/models";

@Injectable()
export class AppResolver implements Resolve<any> {
  constructor(private clientService: ClientService) {
  }

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
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

  public checkAuthenticatedStatus(): Observable<boolean> {

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

  private validateAuthToken(): Observable<boolean> {
    return this.httpClient
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
      );
  }
}
