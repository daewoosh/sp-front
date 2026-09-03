import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('appConfig auth providers', () => {
  const source = readFileSync(
    join(process.cwd(), 'apps/sp-front/src/app/app.config.ts'),
    'utf8'
  );

  it('registers Refresh before Auth before Error and provides the expiry handler', () => {
    const refresh = source.indexOf('useClass: RefreshTokenInterceptor');
    const auth = source.indexOf('useClass: AuthInterceptor');
    const error = source.indexOf('useClass: ErrorInterceptor');

    expect(refresh).toBeGreaterThan(-1);
    expect(refresh).toBeLessThan(auth);
    expect(auth).toBeLessThan(error);
    expect(source).toContain('provide: SESSION_EXPIRED_HANDLER');
    expect(source).toContain('loginDialogService.open()');
  });
});
