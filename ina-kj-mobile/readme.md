# INA-KJ Agro Connect — Expo Mobile App

React Native (Expo Router) client integrated with **ina-kj-api**.

## Features

- OM / EN language toggle
- Auth (login / register) → JWT in SecureStore
- Home + Marketplace (products from API)
- Product detail → Add to cart
- Cart + Checkout → `POST /orders`
- Orders list
- Profile (role-aware)

## Setup

```bash
# 1. Backend must be running
cd ../ina-kj-api && npm run dev

# 2. Mobile
cd ina-kj-mobile
npm install
npx expo start
```

Scan QR with Expo Go app (Android/iOS).

### API URL

Edit `app.json` → `extra.apiUrl`:

```json
"apiUrl": "http://YOUR_LAN_IP:4000/api/v1"
```

On a physical device, `localhost` will not work — use your computer’s LAN IP.

## Project structure

```
app/
  (tabs)/          Home, Market, Cart, Orders, Profile
  (auth)/          Login, Register
  product/[id]     Product detail
  checkout.tsx
src/
  api/client.ts    Fetch + JWT
  store/           auth, cart (Zustand)
  i18n/            Oromo + English
  constants/       colors, API_URL
```

## Integration map

| Screen | API |
|--------|-----|
| Login / Register | `POST /auth/login`, `/auth/register` |
| Home / Market | `GET /products` |
| Product | `GET /products/:id` |
| Checkout | `POST /orders` |
| Orders | `GET /orders` |
| Profile | `GET /auth/me` |

## Next steps

- [ ] Socket.io chat screen
- [ ] Push notifications
- [ ] Image picker for farmer add-product
- [ ] Telebirr deep link / WebView payment
- [ ] EAS Build → Play Store

## License

INA-KJ Agro Connect © 2026
