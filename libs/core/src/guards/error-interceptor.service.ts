import { Inject, Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { TuiAlertService } from "@taiga-ui/core";
import { catchError, Observable, tap, throwError } from "rxjs";

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
      tap(request => console.log({request})),
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
