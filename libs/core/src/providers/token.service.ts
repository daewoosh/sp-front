import { Inject, Injectable, Optional, PLATFORM_ID } from "@angular/core";
import { REQUEST } from "ngx-cookie-service-ssr";
import { isPlatformServer } from "@angular/common";
import { AUTH_TOKEN_NAME } from "../constants";
import { Request } from 'express';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private token: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    @Optional() @Inject(REQUEST) private request: Request,
    private cookieService: SsrCookieService
  ) {
    if (isPlatformServer(this.platformId)) {
      // Server-side: Get token from cookies in the request
      this.token = this.request.cookies[AUTH_TOKEN_NAME] || '';
    } else {
      // Client-side: Get token from cookies
      this.token = this.cookieService.get(AUTH_TOKEN_NAME);
    }
  }

  getToken(): string {
    return this.token;
  }
}
