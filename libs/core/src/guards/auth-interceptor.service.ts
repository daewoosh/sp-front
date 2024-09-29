import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { AUTH_TOKEN_NAME } from "../constants";
import { SsrCookieService } from "ngx-cookie-service-ssr";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: SsrCookieService) {
  }

  public intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken = this.cookieService.get(AUTH_TOKEN_NAME);
    if (authToken) {
      return next.handle(this.addAuthToken(httpRequest, authToken));
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
