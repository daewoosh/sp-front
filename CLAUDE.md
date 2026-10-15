# CLAUDE.md — sp-front

Legacy Angular frontend for the poker learning/courses portal, served under `/learn/` on `safe-poker.io`. Nx monorepo with three apps; `sp-front` is the main one.

## Tech stack

- Nx 19.7 monorepo, Angular ~18.2 (standalone components, no NgModules), SSR via `@angular/ssr` + Express (`apps/sp-front/server.ts`)
- Taiga UI v4, Tailwind 3 + SCSS, NgRx ~18 (vestigial — see gotchas), `ngx-cookie-service-ssr` (auth-critical)
- Jest (no real tests, `passWithNoTests`), ESLint + Prettier

## Commands

```
npm start                # nx serve sp-front (dev, port 4200)
npm run build            # production build, --base-href=/learn/ --deploy-url=/learn/
npm run build:dev        # dev-config build
npm run serve:ssr        # node dist/apps/sp-front/server/server.mjs
npx nx lint sp-front / npx nx test sp-front
```

## Layout

- `apps/sp-front/` — main courses portal (`/learn`); `apps/only-poker/`, `apps/booster/` — standalone course landings with their OWN env defines
- `libs/core/` — guards, interceptors, API services, hand-rolled state (`AppStateService`), constants
- `libs/common/` — header, footer, login-modal, one-time-login, logout, page layout
- `libs/features/*` — 12 feature libs (admin, courses-page, main-page, publications, ranges, …)
- `libs/app-config/` — DI tokens `API_PATH`, `AUTH_URL`, `EXCHANGE_URL`, `APP_URL`, `AUTH_BOT_NAME`
- Path aliases `@sp/*` in `tsconfig.base.json`

## Environment config (IMPORTANT: no environment.ts)

All env values are compile-time `define` globals in `apps/sp-front/project.json` per configuration, declared in `apps/sp-front/src/types.d.ts`, wired to DI tokens in `app.config.ts`.

| Config | API_URL (learning backend) | AUTH_URL (exchanger) |
|---|---|---|
| local | `https://localhost:43802/api/v1` | `http://localhost:5003/api/v1` |
| dev | `https://dev2.safe-poker.io/learn/api/v1` | `https://dev2.safe-poker.io/api/v1` |
| production | `https://safe-poker.io/learn/api/v1` | `https://safe-poker.io/api/v1` |

`only-poker`/`booster` apps use different values (see their `project.json`); `only-poker` declares `AUTH_URL`/`AUTH_BOT_NAME` types but never provides the DI tokens — login modal would crash there.

## Authentication (two-backend split — the crux)

No password login; auth is Telegram-bot based:

1. `login-modal.component.ts` — POST `{AUTH_URL}/auth/PrepareAuth` with client uuid + returnUrl, open `https://t.me/{AUTH_BOT_NAME}?start={uuid}`, then poll POST `{AUTH_URL}/auth` (2s interval) until `accessToken` arrives. **Login talks to the exchanger backend.**
2. Token stored as cookie `authToken` (path `/`, `SameSite=None; Secure`, session cookie, host-only — this shared cookie on the apex domain IS the SSO with the exchanger front) and mirrored to localStorage `sp_authToken` (never read back).
3. `auth-interceptor.service.ts` attaches `Authorization: Bearer <cookie>` to EVERY outbound request (no URL allow-list).
4. Session check: `client.service.ts` → `GET {API_PATH}/auth/check` with `withCredentials` — **validation talks to the learning backend**, which must accept the exchanger-issued token.
5. `one-time-login.component.ts` (`/login?hash=&authId=`) — SSO deep-link landing; writes the cookie WITHOUT path options (:64) → duplicate-cookie bug; logout deletes 4 path variants as a workaround.
6. **No refresh tokens, no expiry handling; 401 is explicitly ignored** in `error-interceptor.service.ts:21` (no logout/redirect/clear). `REFRESH_TOKEN_NAME` in `constants.ts` is dead. Any "kicked out after N minutes" behavior comes from the backends, and the UI degrades silently.
7. Guards: `AuthGuard` (`/courses`), `AdminGuard` (`/admin`, `/manageRanges`; admin = role Admin|Support), `CourseAccessGuard` (client-side entitlement UI gate only).
8. Logout (`/logout`) is local-only (no server revoke) + hard redirect to `EXCHANGE_URL`.

## Gotchas

- App lives under `/learn/` — builds without `--base-href=/learn/` 404 on assets.
- SSR is real: guard browser APIs with `isPlatformBrowser`; `server.ts` polyfills localStorage.
- NgRx store `libs/core/src/store/auth/*` is dead code (empty reducer/effects); real state is `AppStateService`. `libs/core/src/providers/token.service.ts` is also dead.
- `error-interceptor.service.ts:32` `throwError(() => { new Error(...) })` returns `undefined` downstream.
- Three index.html variants per configuration (`index.html` / `index.dev.html` / `index.prod.html`); local one embeds a Meta Pixel.
- Deploy was PuTTY pscp/plink to 51.250.16.76 (`deploy/deploy_with_putty.ps1`, deleted in working tree but in git history).
- Deploy now (see `docs/CI-CD.md`): tag `v*` triggers `build-image.yml` (`Dockerfile` → `ghcr.io/daewoosh/sp-front:<tag>` → version sent to `safe-poker-deploy`, key `LEARN_OLD_FRONT_TAG`); push to `develop` triggers `deploy.yml` (lint/test/dev build only) and `build-image-dev.yml` (`sp-front:dev` for the AWS dev stand). The old rsync deploy to the Yandex host is gone. In the image `server.mjs` serves static from `../browser` = `/app/dist/browser`; `media/` is mounted there from the host.
- Mixed RU/EN comments; cookie auth landed in commits `ffb3497` "Finish new_auth" / `246b854` "new auth url".
