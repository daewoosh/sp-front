import { isExcludedAuthUrl, isScopedApiUrl, isUrlWithinBase } from './api-url.util';

describe('API URL scoping', () => {
  const apiPath = 'https://safe-poker.io/learn/api/v1';
  const authUrl = 'https://safe-poker.io/api/v1';

  it('matches exact bases and slash-bounded descendants', () => {
    expect(isScopedApiUrl(apiPath, apiPath, authUrl)).toBe(true);
    expect(isScopedApiUrl(`${apiPath}/courses`, apiPath, authUrl)).toBe(true);
    expect(isScopedApiUrl(`${authUrl}/auth`, apiPath, authUrl)).toBe(true);
  });

  it('rejects path-prefix and origin lookalikes', () => {
    expect(isUrlWithinBase(`${apiPath}evil/courses`, apiPath)).toBe(false);
    expect(isScopedApiUrl('https://safe-poker.io.evil.example/learn/api/v1', apiPath, authUrl)).toBe(false);
    expect(isScopedApiUrl('https://evil.example/api/v1', apiPath, authUrl)).toBe(false);
  });

  it.each([
    '/auth',
    '/auth/refresh',
    '/AUTH/PREPAREAUTH?return=true',
    '/Auth/Logout',
  ])('recognizes excluded auth endpoint %s case-insensitively', (endpoint) => {
    expect(isExcludedAuthUrl(`${authUrl}${endpoint}`, authUrl)).toBe(true);
  });

  it('does not exclude descendants or lookalike origins', () => {
    expect(isExcludedAuthUrl(`${authUrl}/auth/refresh/extra`, authUrl)).toBe(false);
    expect(isExcludedAuthUrl('https://safe-poker.io.evil.example/api/v1/auth', authUrl)).toBe(false);
  });
});
