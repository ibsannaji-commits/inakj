# Backend Architecture — INA-KJ Agro Connect

## Recommended stack

| Layer | Choice |
|-------|--------|
| Backend | Node.js + Express (or NestJS) |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcrypt + refresh tokens |
| Realtime chat | Socket.io |
| Files | Cloudinary / S3 |
| Payments | Telebirr, CBE Birr, Bank, Card gateway |

## High-level diagram

```
Mobile (optional) ──┐
Website (static)  ──┼──► API (REST + Socket) ──► PostgreSQL
Admin (same API)  ──┘         │
                              ├── Storage (images)
                              └── Payment gateways
```

## API base

`/api/v1`

### Main route groups

- `/auth` — register, login, refresh, me
- `/products` — CRUD, filters, images
- `/orders` — create, list, status
- `/payments` — initiate, webhook
- `/market-prices`
- `/conversations` + Socket.io for chat
- `/reviews`
- `/admin` — verify users/products, reports

## Implementation phases

1. Auth + Users + Prisma schema  
2. Products CRUD + categories  
3. Orders + items  
4. Admin verification  
5. Market prices  
6. Chat (REST + Socket)  
7. Reviews + seller profile  
8. Payments (manual → Telebirr)  
9. Delivery tracking updates  

## Folder structure (API)

```
ina-kj-api/
├── prisma/schema.prisma
├── src/
│   ├── index.js
│   ├── config/
│   ├── middleware/   (auth, role)
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── sockets/
│   └── utils/
├── .env
└── package.json
```
