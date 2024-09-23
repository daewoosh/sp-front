import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, delay, filter, map, of, startWith, Subject, switchMap } from "rxjs";
import { WINDOW } from "@sp/sdk/common";
import { CourseActivationService, LocalStorageService } from "@sp/core/providers";
import { HttpClient } from "@angular/common/http";
import { AppStateService } from "@sp/core/state/app-state.service";
import { ActivatedRoute, Router } from "@angular/router";
import { v4 as uuid } from 'uuid';
import { LoginResult } from "@sp/core/models";
import { AUTH_HASH_NAME, AUTH_TOKEN_NAME } from "@sp/core";
import { CONFIG, Environment } from "@sp/config";

import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiDialogContext } from "@taiga-ui/core";

const FORM_CLOSE_TIMEOUT = 100000;
const AUTH_REQUEST_INTERVAL = 2000;

@Component({
  selector: 'sp-login-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent {

  private token = '';
  private ticker: Subject<boolean> = new Subject();

  private readonly context = injectContext<TuiDialogContext<LoginResult | undefined>>();

  constructor(
    @Inject(WINDOW) private window: Window,
    private localStorage: LocalStorageService,
    private httpClient: HttpClient,
    private appStateService: AppStateService,
    private readonly router: Router,
    @Inject(CONFIG) private config: Environment,
    private activatedRoute: ActivatedRoute,
    private courseActivationService: CourseActivationService
  ) {
  }

  public ngOnInit(): void {
    this.token = uuid();
    const token = this.activatedRoute.snapshot.paramMap.get('token');
    console.log('token', token);
    this.ticker
      .pipe(
        startWith(true),
        filter((result: boolean) => result),
        debounceTime(FORM_CLOSE_TIMEOUT)
      )
      .subscribe(() => this.context.completeWith(undefined));

    this.ticker
      .pipe(
        switchMap(() =>
          this.httpClient
            .post<LoginResult>(`${this.config.apiUrl}/auth`, {
              authHash: this.token,
            })
            .pipe(
              switchMap((result) => {
                if (result) {
                  this.localStorage.set(AUTH_TOKEN_NAME, result.accessToken!);
                  if (token) {
                    // Активация курса выполняется только после успешного логина и при наличии токена
                    return this.courseActivationService.activateCourse(token).pipe(
                      catchError((err) => {
                        console.error('Course activation failed', err);
                        return of(result); // Мы продолжаем, даже если активация не удалась
                      }),
                      map(() => result) // Возвращаем результат логина
                    );
                  }
                  return of(result); // Если токена нет, просто возвращаем результат логина
                }else {
                  return of(undefined);
                }
              }),
              catchError(() => of(undefined).pipe(delay(AUTH_REQUEST_INTERVAL)))
            )
        )
      )
      .subscribe((result?: LoginResult) => {
        if (result) {

          this.appStateService.setUserState({
            isLoggedIn: result.isSuccessLogin,
            user: result.user,
          });

          this.router.navigate(['/courses']);
          this.context.completeWith(result);

        } else {
          this.ticker.next(false);
        }
      });
  }

  public ngOnDestroy(): void {
    this.ticker.complete();
  }

  login() {
    const authUrl = `https://t.me/${this.config.authBotName}?start=${this.token}`;
    this.localStorage.set(AUTH_HASH_NAME, this.token);
    this.ticker.next(true);
    this.window.open(authUrl);
  }
}
