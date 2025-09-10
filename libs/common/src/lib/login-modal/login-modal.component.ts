import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  catchError,
  debounceTime,
  delay,
  filter,
  map,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { WINDOW } from '@sp/sdk/common';
import {
  CourseActivationService,
  LocalStorageService,
} from '@sp/core/providers';
import { HttpClient } from '@angular/common/http';
import { AppStateService } from '@sp/core/state/app-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { LoginResult } from '@sp/core/models';
import { AUTH_HASH_NAME, AUTH_TOKEN_NAME } from '@sp/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { ClientService } from '@sp/core/guards';
import {
  AUTH_BOT_NAME as AUTH_BOT_NAME_TOKEN,
  AUTH_URL as AUTH_URL_TOKEN,
} from '@sp/config';
import { APP_BASE_HREF } from '@angular/common';

const FORM_CLOSE_TIMEOUT = 100000;
const AUTH_REQUEST_INTERVAL = 2000;

@Component({
  selector: 'sp-login-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
  providers: [{provide: APP_BASE_HREF, useValue: '/learn'}]
})
export class LoginModalComponent implements OnDestroy, OnInit{
  private token = '';
  private ticker: Subject<boolean> = new Subject();

  private readonly context = injectContext<TuiDialogContext<LoginResult | undefined>>();

  constructor(
    @Inject(WINDOW) private window: Window,
    private localStorage: LocalStorageService,
    private httpClient: HttpClient,
    private appStateService: AppStateService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute,
    private courseActivationService: CourseActivationService,
    private cookieService: SsrCookieService,
    private clientService: ClientService,
    @Inject(AUTH_URL_TOKEN) private authUrl: string,
    @Inject(AUTH_BOT_NAME_TOKEN) private authBotName: string,
    @Inject(APP_BASE_HREF) private baseHref: string,
  ) {
  }

  public ngOnInit(): void {
    this.token = uuid();
    // Формируем полный ReturnUrl: origin + baseHref + 'courses'
    const base = this.baseHref || '/';
    const normalizedBase = base.endsWith('/') ? base : base + '/';
    const returnUrl = `${this.window.location.origin}${normalizedBase}courses`;
    this.httpClient
      .post(`${this.authUrl}/auth/PrepareAuth`, {
        authHash: this.token,
        returnUrl
      })
      .pipe(
        // В любом случае открываем Telegram-бота (даже при ошибке)
        catchError(() => of(null))
      )
      .subscribe();
    const token = this.activatedRoute.snapshot.paramMap.get('token');
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
            .post<LoginResult>(`${this.authUrl}/auth`, {
              authHash: this.token,
            })
            .pipe(
              switchMap((result) => {
                if (result) {
                  this.cookieService.set(AUTH_TOKEN_NAME, result.accessToken!, {
                    path: '/',
                    sameSite: 'None',
                    secure: true, // Ensure your site is served over HTTPS
                  } );
                  this.localStorage.set(AUTH_TOKEN_NAME, result.accessToken ?? '');
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

          this.clientService.validateAuthToken().subscribe(() => {
            this.context.completeWith(result);
          });

          this.router.navigate(['/courses']);
          // this.context.completeWith(result);
        } else {
          this.ticker.next(false);
        }
      });
  }

  public ngOnDestroy(): void {
    this.ticker.complete();
  }

  login() {
    const authUrl = `https://t.me/${this.authBotName}?start=${this.token}`;
    this.localStorage.set(AUTH_HASH_NAME, this.token);
    this.ticker.next(true);
    this.window.open(authUrl);
  }
}
