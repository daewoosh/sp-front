import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { catchError, map, Observable, of, tap } from "rxjs";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { LocalStorageService } from "@sp/core/providers";
import { HttpClient } from "@angular/common/http";
import { AppStateService } from "@sp/core/state";
import { AUTH_HASH_NAME, AUTH_TOKEN_NAME } from "@sp/core";
import { LoginResult } from "@sp/core/models";
import { SsrCookieService } from "ngx-cookie-service-ssr";

@Component({
  selector: 'sp-one-time-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './one-time-login.component.html',
  styleUrl: './one-time-login.component.scss',
})
export class OneTimeLoginComponent implements OnInit{
  inputParams$: Observable<{ authHash: string | null; authId: string | null }>;
  constructor(
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private router: Router,
    private httpClient: HttpClient,
    private appStateService: AppStateService,
    private cookieService: SsrCookieService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    this.inputParams$ = this.route.queryParamMap.pipe(
      map((params: ParamMap) => {
        const authHash = params.get('hash');
        const authId = params.get('authId');
        return {authHash, authId};
      })
    );
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.inputParams$.subscribe((authInfo) => {
        const hashInStorage = this.localStorageService.get(AUTH_HASH_NAME);
        // const token = this.localStorageService.get(AUTH_TOKEN_NAME);
        const token = this.cookieService.get(AUTH_TOKEN_NAME);
        if (hashInStorage && hashInStorage == authInfo.authHash && token) {
          this.router.navigate(['/courses']);
        } else {
          this.httpClient
            .post<LoginResult>(`${API_URL}/auth`, {
              authHash: authInfo.authHash,
              authId: authInfo.authId,
            })
            .pipe(
              catchError(() =>
                of(undefined).pipe(tap((_) => this.router.navigate(['/'])))
              )
            )
            .subscribe((result?: LoginResult) => {
              if (result) {
                this.cookieService.set(AUTH_TOKEN_NAME, result.accessToken!);
                this.appStateService.setUserState({
                  isLoggedIn: result.isSuccessLogin,
                  user: result.user,
                });

                this.router.navigate(['/courses']);
              }
            });
        }
      });
    }
  }
}
