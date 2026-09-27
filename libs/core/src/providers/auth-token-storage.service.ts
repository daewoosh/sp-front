import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

import { AUTH_HASH_NAME, AUTH_TOKEN_NAME, SESSION_MARKER_NAME } from '../constants';
import { LocalStorageService } from './local-storage.service';

const MAX_TOKEN_LENGTH = 16_384;

export type DecodedAuthTokenClaims =
  | {
      valid: true;
      exp: number;
      SessionId?: string;
      UserId?: string;
    }
  | { valid: false };

@Injectable({ providedIn: 'root' })
export class AuthTokenStorageService {
  private epoch = 0;

  constructor(
    private readonly cookieService: SsrCookieService,
    private readonly localStorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  get sessionEpoch(): number {
    return this.epoch;
  }

  setToken(token: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.cookieService.delete(AUTH_TOKEN_NAME, '/learn');
    this.cookieService.delete(AUTH_TOKEN_NAME, '/learn/');
    this.cookieService.set(AUTH_TOKEN_NAME, token, {
      path: '/',
      sameSite: 'Lax',
      secure: true,
    });
  }

  /**
   * Перезаписывает уже имеющуюся cookie `authToken` в каноническом виде (сессионная, Path=/).
   * Cookie может быть выписана биржевым фронтом (тот же origin) с `Max-Age`, равным сроку
   * access-токена: тогда браузер удалит её ровно в момент истечения, и refresh станет
   * невозможен — интерцептор сознательно не обновляет анонимные запросы. Перезапись тем же
   * значением снимает чужой срок жизни; refresh дальше поддерживает cookie сам.
   * @returns true, если cookie была найдена и перезаписана.
   */
  adoptExistingToken(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const token = this.getToken();
    if (!token) {
      return false;
    }

    this.setToken(token);
    return true;
  }

  clearToken(): void {
    this.epoch += 1;

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.cookieService.delete(AUTH_TOKEN_NAME);
    this.cookieService.delete(AUTH_TOKEN_NAME, '/');
    this.cookieService.delete(AUTH_TOKEN_NAME, '/learn');
    this.cookieService.delete(AUTH_TOKEN_NAME, '/learn/');
    this.localStorageService.remove(AUTH_TOKEN_NAME);
    this.localStorageService.remove(AUTH_HASH_NAME);
  }

  getToken(): string {
    return this.cookieService.get(AUTH_TOKEN_NAME);
  }

  /** У браузера есть сессия обменника (признак `sp_session` от бэкенда), возможно начатая на другом поддомене. */
  hasSessionMarker(): boolean {
    return isPlatformBrowser(this.platformId) && this.cookieService.check(SESSION_MARKER_NAME);
  }

  decodeClaims(token: string): DecodedAuthTokenClaims {
    if (!token || token.length > MAX_TOKEN_LENGTH) {
      return { valid: false };
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3 || !/^[A-Za-z0-9_-]+$/.test(parts[1])) {
        return { valid: false };
      }

      const remainder = parts[1].length % 4;
      if (remainder === 1) {
        return { valid: false };
      }

      const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        + '='.repeat((4 - remainder) % 4);
      const binary = globalThis.atob(padded);
      const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      const payload = JSON.parse(
        new TextDecoder('utf-8', { fatal: true }).decode(bytes)
      ) as Record<string, unknown>;

      if (typeof payload['exp'] !== 'number' || !Number.isFinite(payload['exp'])) {
        return { valid: false };
      }

      return {
        valid: true,
        exp: payload['exp'],
        SessionId: typeof payload['SessionId'] === 'string' ? payload['SessionId'] : undefined,
        UserId: typeof payload['UserId'] === 'string' ? payload['UserId'] : undefined,
      };
    } catch {
      return { valid: false };
    }
  }

  isExpired(token: string, skewSec: number): boolean {
    const claims = this.decodeClaims(token);
    return !claims.valid || claims.exp <= Date.now() / 1000 + skewSec;
  }
}
