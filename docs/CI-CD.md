# CI/CD для sp-front (обучение)

Схема: **push в `develop` → деплой на dev**, **push тега `v*` → деплой на prod**. Деплоится только фронт (SSR + browser); бэкенд не затрагивается. Workflow: [.github/workflows/deploy.yml](../.github/workflows/deploy.yml).

Прод-топология (для справки): edge-nginx `safe-poker.io` проксирует `/learn/` → `84.201.149.19:4000` (docker-контейнер `nodessr`, `node /var/www/safe-poker/server/server.mjs`); файлы монтируются с хоста `/var/www/safe-poker/{server,browser}`. Поэтому деплой = rsync файлов на хост + `docker restart nodessr`.

---

## Шаг 1. Перенос репозитория Bitbucket → GitHub

Те самые «команды в консоль» — это зеркальный перенос. На своей машине:

```bash
# 1. Создайте на github.com пустой ПРИВАТНЫЙ репозиторий sp-front (без README/.gitignore)

# 2. Склонируйте зеркало текущего репо (все ветки и теги)
cd /c/Work/tmp
git clone --mirror https://bitbucket.org/sp373/sp-front.git sp-front-mirror
cd sp-front-mirror

# 3. Запушьте зеркало в GitHub (замените YOUR_GH_USER)
git push --mirror https://github.com/YOUR_GH_USER/sp-front.git

# 4. В рабочей копии переключите origin на GitHub
cd "/c/Work Projects/poker/sp-front"
git remote set-url origin https://github.com/YOUR_GH_USER/sp-front.git
git fetch origin
```

При пуше GitHub спросит логин/пароль — используйте Personal Access Token (github.com → Settings → Developer settings → Personal access tokens, права `repo`) вместо пароля, либо заранее настроенный SSH-ключ (`git@github.com:YOUR_GH_USER/sp-front.git`).

⚠️ **Важно про безопасность**: в текущем `origin` Bitbucket-URL зашит плейнтекстовый `x-token-auth` токен (то же в poker_learn). После переезда ротируйте/отзовите эти Bitbucket-токены. В GitHub токен в remote-URL не вшивайте — используйте SSH-ключ или credential manager.

## Шаг 2. Secrets в GitHub

Репозиторий → Settings → **Environments** → создайте два окружения: `dev` и `prod`. В каждом задайте:

| Тип | Имя | Значение |
|---|---|---|
| Secret | `DEPLOY_HOST` | IP/хост сервера (prod: `84.201.149.19`; dev: хост dev-стенда) |
| Secret | `DEPLOY_USER` | SSH-пользователь деплоя |
| Secret | `DEPLOY_SSH_KEY` | **Приватный** SSH-ключ (сгенерируйте отдельный: `ssh-keygen -t ed25519 -f deploy_key -C sp-front-deploy`, публичную часть — в `~/.ssh/authorized_keys` пользователя на сервере) |
| Variable | `DEPLOY_PATH` | (опц.) путь, по умолчанию `/var/www/safe-poker` |
| Variable | `RESTART_CMD` | (опц.) команда рестарта, по умолчанию `docker restart nodessr` |

Для `prod` рекомендую в настройках environment включить **Required reviewers** (ручное подтверждение перед прод-деплоем) — по желанию.

Пользователь деплоя должен иметь право писать в `/var/www/safe-poker/{server,browser}` и выполнять `docker restart nodessr` (если это не root — добавьте его в группу `docker`).

## Шаг 3. Как пользоваться

- **Дев**: просто `git push origin develop` — соберётся `build:dev` (конфигурация `dev`, URL `dev.safe-poker.ru`) и уедет на dev-сервер.
- **Прод**:
  ```bash
  git tag v1.0.0
  git push origin v1.0.0
  ```
  Соберётся production-конфигурация (`safe-poker.io`, base-href `/learn/`) и уедет на прод.

Прогресс — во вкладке **Actions**. Пайплайн: `npm ci` → lint + test → build → rsync (`server/` полностью; `browser/` с `--delete`, но каталог `media/` не трогается — как в старых PuTTY-скриптах) → `docker restart nodessr` → smoke-проверка `curl localhost:4000` (при падении печатает логи контейнера).

## Примечания

- Нода в CI — v20, как в проде (`Dockerfile: FROM node:20`).
- Если dev-стенд устроен иначе (другой путь/имя контейнера) — поменяйте `DEPLOY_PATH`/`RESTART_CMD` в environment `dev`, workflow править не нужно.
- Приложения `only-poker`/`booster` этим пайплайном не собираются и не деплоятся (сознательно).
