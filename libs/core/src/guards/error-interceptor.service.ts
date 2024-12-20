import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { TuiAlertService } from "@taiga-ui/core";
import { catchError, EMPTY, Observable, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from "@angular/common";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(@Inject(TuiAlertService)
              private readonly alertService: TuiAlertService,
              @Inject(PLATFORM_ID) private platformId: any) {
  }

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((response: any) => {
        console.log({response});
        if (response instanceof HttpErrorResponse && response.status !== 401 && isPlatformBrowser(this.platformId)) {
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
