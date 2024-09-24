import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { AUTH_TOKEN_NAME } from "../constants";
import { LocalStorageService } from "../providers";

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
