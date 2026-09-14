# INA-KJ Agro Connect — Complete Package

**Qonnaan Bulaa → Gabaa → Buyer → Delivery → Kaffaltii**

## Folders inside this ZIP

| Folder | What it is |
|--------|------------|
| `ina-kj-agro-connect/` | Website + PWA (HTML/CSS/JS) |
| `ina-kj-api/` | Backend API (Node + Express + Prisma) |
| `ina-kj-mobile/` | Expo / React Native mobile app |

## Quick start

### 1. Website
```bash
cd ina-kj-agro-connect
# Open index.html in browser
# Or: python3 -m http.server 8080
```

### 2. Backend
```bash
cd ina-kj-api
npm install
cp .env.example .env
# Set DATABASE_URL and JWT secrets
npx prisma generate && npx prisma db push
npm run dev
# → http://localhost:4000
```

### 3. Mobile (Expo)
```bash
cd ina-kj-mobile
npm install
# Set apiUrl in app.json to your LAN IP
npx expo start
```

## Docs

- Web: `ina-kj-agro-connect/docs/`
- API: `ina-kj-api/docs/API.md`
- Mobile: `ina-kj-mobile/README.md`

© 2026 INA-KJ Agro Connect
