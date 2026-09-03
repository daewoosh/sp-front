function parseUrl(url: string, baseUrl: string): URL | null {
  try {
    const base = new URL(baseUrl);
    const resolutionBase = new URL(base.toString());
    resolutionBase.pathname = `${base.pathname.replace(/\/+$/, '')}/`;
    return new URL(url, resolutionBase);
  } catch {
    return null;
  }
}

function normalizePath(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized || '/';
}

export function isUrlWithinBase(url: string, baseUrl: string): boolean {
  const requestUrl = parseUrl(url, baseUrl);
  const parsedBase = parseUrl(baseUrl, baseUrl);
  if (!requestUrl || !parsedBase || requestUrl.origin !== parsedBase.origin) {
    return false;
  }

  const requestPath = normalizePath(requestUrl.pathname);
  const basePath = normalizePath(parsedBase.pathname);
  return basePath === '/'
    || requestPath === basePath
    || requestPath.startsWith(`${basePath}/`);
}

export function isScopedApiUrl(
  url: string,
  apiPath: string,
  authUrl: string
): boolean {
  return isUrlWithinBase(url, apiPath) || isUrlWithinBase(url, authUrl);
}

export function isExcludedAuthUrl(url: string, authUrl: string): boolean {
  const requestUrl = parseUrl(url, authUrl);
  const parsedBase = parseUrl(authUrl, authUrl);
  if (!requestUrl || !parsedBase || requestUrl.origin !== parsedBase.origin) {
    return false;
  }

  const basePath = normalizePath(parsedBase.pathname).toLowerCase();
  const requestPath = normalizePath(requestUrl.pathname).toLowerCase();
  return ['/auth', '/auth/refresh', '/auth/prepareauth', '/auth/logout']
    .some((endpoint) => requestPath === `${basePath}${endpoint}`);
}
