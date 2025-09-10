import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppStateService } from "../state";
import { API_PATH } from "@sp/config";
import { catchError, Observable, of, take } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { LoginResult } from "../models";

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

  public validateAuthToken(): Observable<boolean> {
    return this.httpClient
      .get<LoginResult>(`${this.apiUrl}/auth/check`, { withCredentials: true })
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
