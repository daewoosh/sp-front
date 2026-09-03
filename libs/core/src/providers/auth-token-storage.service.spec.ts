import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

import { AUTH_HASH_NAME, AUTH_TOKEN_NAME } from '../constants';
import { AuthTokenStorageService } from './auth-token-storage.service';
import { LocalStorageService } from './local-storage.service';

function token(payload: Record<string, unknown>): string {
  return `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;
}

describe('AuthTokenStorageService', () => {
  const cookieService = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  };
  const localStorageService = { remove: jest.fn() };
  let service: AuthTokenStorageService;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        AuthTokenStorageService,
        { provide: SsrCookieService, useValue: cookieService },
        { provide: LocalStorageService, useValue: localStorageService },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(AuthTokenStorageService);
  });

  it('writes the canonical secure Lax cookie after removing legacy path variants', () => {
    service.setToken('fresh');

    expect(cookieService.delete.mock.calls).toEqual([
      [AUTH_TOKEN_NAME, '/learn'],
      [AUTH_TOKEN_NAME, '/learn/'],
    ]);
    expect(cookieService.set).toHaveBeenCalledWith(AUTH_TOKEN_NAME, 'fresh', {
      path: '/',
      sameSite: 'Lax',
      secure: true,
    });
  });

  it('re-writes a cookie issued by the exchanger front as a canonical session cookie', () => {
    cookieService.get.mockReturnValue('from-exchanger');

    expect(service.adoptExistingToken()).toBe(true);

    expect(cookieService.set).toHaveBeenCalledTimes(1);
    expect(cookieService.set).toHaveBeenCalledWith(AUTH_TOKEN_NAME, 'from-exchanger', {
      path: '/',
      sameSite: 'Lax',
      secure: true,
    });
    expect(service.sessionEpoch).toBe(0);
  });

  it('does not write anything when no token cookie is present', () => {
    cookieService.get.mockReturnValue('');

    expect(service.adoptExistingToken()).toBe(false);
    expect(cookieService.set).not.toHaveBeenCalled();
    expect(cookieService.delete).not.toHaveBeenCalled();
  });

  it('clears every cookie path, legacy storage, and increments the session epoch', () => {
    service.clearToken();

    expect(service.sessionEpoch).toBe(1);
    expect(cookieService.delete.mock.calls).toEqual([
      [AUTH_TOKEN_NAME],
      [AUTH_TOKEN_NAME, '/'],
      [AUTH_TOKEN_NAME, '/learn'],
      [AUTH_TOKEN_NAME, '/learn/'],
    ]);
    expect(localStorageService.remove).toHaveBeenCalledWith(AUTH_TOKEN_NAME);
    expect(localStorageService.remove).toHaveBeenCalledWith(AUTH_HASH_NAME);
  });

  it('decodes identity claims and expiration without throwing', () => {
    const encoded = token({
      exp: 2_000_000_000,
      SessionId: 'session-1',
      UserId: 'user-1',
    });

    expect(service.decodeClaims(encoded)).toEqual({
      valid: true,
      exp: 2_000_000_000,
      SessionId: 'session-1',
      UserId: 'user-1',
    });
    expect(service.isExpired(encoded, 0)).toBe(false);
  });

  it.each([
    '',
    'not-a-jwt',
    'a.%%%.c',
    `a.${Buffer.from('{bad json').toString('base64url')}.c`,
    token({ SessionId: 'session-1', UserId: 'user-1' }),
    token({ exp: 'tomorrow', SessionId: 'session-1', UserId: 'user-1' }),
    `a.${'x'.repeat(16_384)}.c`,
  ])('classifies malformed, oversized, or claim-less expiration input as invalid', (value) => {
    expect(() => service.decodeClaims(value)).not.toThrow();
    expect(service.decodeClaims(value)).toEqual({ valid: false });
    expect(service.isExpired(value, 0)).toBe(true);
  });
});
