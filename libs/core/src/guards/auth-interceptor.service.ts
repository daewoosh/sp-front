import { Inject, Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_PATH, AUTH_URL } from '@sp/config';

import { AuthTokenStorageService } from '../providers/auth-token-storage.service';
import { isScopedApiUrl } from './api-url.util';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private readonly tokenStorage: AuthTokenStorageService,
    @Inject(API_PATH) private readonly apiPath: string,
    @Inject(AUTH_URL) private readonly authUrl: string
  ) {}

  public intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken = this.tokenStorage.getToken();
    if (
      authToken
      && !httpRequest.headers.has('Authorization')
      && isScopedApiUrl(httpRequest.url, this.apiPath, this.authUrl)
    ) {
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
