# FuelStation

ВУЗовский учебный проект: мониторинг сетей АЗС, остатков топлива и (на следующих этапах) авторизация и симуляция расхода.

## Роли пользователей

| Роль | Описание |
|------|----------|
| **USER** | Просмотр списка заправок, карты и деталей (этап 3) |
| **ADMIN** | То же + ручное изменение остатков и цен (этап 2–3) |

На этапе 1 в интерфейсе роли не используются; в БД уже есть админ `admin@gazprom.ru` / `admin123` для будущих этапов.

## Стек (этап 1)

- **Backend:** Node.js, Express, JavaScript, Prisma, PostgreSQL, Zod (заготовка схем)
- **Frontend:** React, Vite, JavaScript, React Router
- **Инфра:** Docker Compose (только PostgreSQL)

## Структура backend (слои)

```
server/src/
  routes/       → URL → controller + middleware
  controllers/  → req/res, вызов service
  services/     → бизнес-логика и Prisma
  schemas/      → Zod
  lib/          → PrismaClient singleton
  middleware/   → errorHandler
```

## Быстрый старт (3 команды + dev)

Из корня репозитория:

```bash
docker compose up -d
```

```bash
cd server && npm install && cp ../.env.example .env 2>/dev/null || true
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

В другом терминале:

```bash
cd client && npm install && npm run dev
```

Скопируйте `.env.example` в `server/.env` (или используйте уже созданный `server/.env` с `DATABASE_URL`).

## Что уже работает (этап 1)

- PostgreSQL в Docker
- Миграции и seed: 5 сетей, 10 АЗС в Москве, 5 типов топлива, по 3 вида топлива на каждой АЗС
- `GET http://localhost:3000/health` — проверка сервера
- `GET http://localhost:3000/api/v1/stations` — список заправок с сетью и топливом
- `http://localhost:5173/stations` — карточки заправок с цветным статусом топлива (зелёный / жёлтый / красный)

## Проверка

1. `curl http://localhost:3000/health` → `{"status":"ok"}`
2. `curl http://localhost:3000/api/v1/stations` → JSON-массив из 10 элементов
3. Браузер: список из 10 заправок, у каждой 3 строки топлива (AI92, AI95, DT)
