# INA-KJ Agro Connect — Backend API

REST API + Socket.io for the agricultural marketplace.

## What's included

| Path | Description |
|------|-------------|
| `prisma/schema.prisma` | Full PostgreSQL data model |
| `docs/API.md` | Complete REST endpoint design |
| `src/index.js` | Express + Socket.io entry |
| `src/routes/` | auth, products, orders |
| `src/controllers/` | Working implementations (auth, products, orders) |
| `src/middleware/auth.js` | JWT + RBAC |
| `.env.example` | Environment variables |

## Quick start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET, etc.

# 3. Database
npx prisma generate
npx prisma db push

# 4. Run
npm run dev
```

- Health: `GET http://localhost:4000/health`
- API base: `http://localhost:4000/api/v1`

## Implemented endpoints

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET  /api/v1/auth/me`

### Products
- `GET    /api/v1/products`
- `GET    /api/v1/products/:id`
- `POST   /api/v1/products` (farmer)
- `PATCH  /api/v1/products/:id`
- `DELETE /api/v1/products/:id`

### Orders
- `POST   /api/v1/orders` (buyer) — **server-side price calculation**
- `GET    /api/v1/orders`
- `GET    /api/v1/orders/:id`
- `PATCH  /api/v1/orders/:id/status`

## Stubs (see docs/API.md)

- Market prices
- Conversations / chat (Socket.io skeleton in `index.js`)
- Admin verify / reports
- Payments webhooks
- Reviews

## Security defaults

- helmet, CORS locked to `FRONTEND_URL`
- Rate limit on auth
- bcrypt (12 rounds)
- JWT access + refresh
- Role checks on mutations
- Order totals recalculated on server (`COMMISSION_RATE`)

## Frontend

Connect the static site in `ina-kj-agro-connect/` by setting:

```js
const API_BASE = 'http://localhost:4000/api/v1';
```

## License

Private — INA-KJ Agro Connect © 2026
