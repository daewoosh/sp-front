# Образ старого фронта курсов (apps/sp-front, SSR). Собирается workflow build-image.yml по тегу v*,
# выкатывается из safe-poker-deploy (hosts/poker-learn-prod, контейнер nodessr, порт 4000).

# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# production-конфигурация, --base-href=/learn/ --deploy-url=/learn/ (см. package.json)
RUN npm run build

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-slim

WORKDIR /app

# dist/apps/sp-front/{browser,server} → /app/dist/{browser,server}.
# server.ts берёт статику из ../browser относительно server.mjs, т.е. /app/dist/browser.
# На сервере поверх монтируется /app/dist/browser/media (медиа, которых нет в репозитории).
# Серверный бандл самодостаточен, node_modules в рантайме не нужны.
COPY --from=builder /app/dist/apps/sp-front ./dist

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "dist/server/server.mjs"]
