# INA-KJ Agro Connect — REST API Design

**Base URL:** `https://api.yourdomain.com/api/v1`  
**Auth:** `Authorization: Bearer <access_token>`  
**Format:** JSON

---

## 1. Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Register farmer/buyer |
| POST | `/auth/login` | No | Login → tokens |
| POST | `/auth/refresh` | Refresh | New access token |
| POST | `/auth/logout` | Yes | Invalidate refresh |
| GET | `/auth/me` | Yes | Current user |

### POST /auth/register
```json
{
  "phone": "+251911234567",
  "password": "secret123",
  "fullName": "Ahmed Hassan",
  "role": "farmer",
  "email": "optional@email.com",
  "location": "West Hararghe",
  "city": "Chiro"
}
```

### POST /auth/login
```json
{ "phone": "+251911234567", "password": "secret123" }
```
**Response:** `{ accessToken, refreshToken, user }`

---

## 2. Products

| Method | Path | Auth | Role |
|--------|------|------|------|
| GET | `/products` | No | Public list + filters |
| GET | `/products/:id` | No | Detail |
| POST | `/products` | Yes | farmer |
| PATCH | `/products/:id` | Yes | farmer (owner) |
| DELETE | `/products/:id` | Yes | farmer (owner) |
| POST | `/products/:id/images` | Yes | farmer (owner) |

### GET /products query params
`category`, `location`, `min_price`, `max_price`, `grade`, `q`, `seller_id`, `status`, `page`, `limit`

### POST /products
```json
{
  "name": "Jimaa Goggogaa – Grade A",
  "categoryId": "uuid",
  "priceEtb": 1200,
  "unit": "kg",
  "quantityAvailable": 500,
  "minOrderQty": 10,
  "grade": "A",
  "location": "West Hararghe, Chiro",
  "description": "...",
  "isExportReady": true,
  "isNegotiable": true,
  "deliveryOption": "platform"
}
```

---

## 3. Orders

| Method | Path | Auth | Role |
|--------|------|------|------|
| POST | `/orders` | Yes | buyer |
| GET | `/orders` | Yes | buyer/farmer/admin |
| GET | `/orders/:id` | Yes | participant/admin |
| PATCH | `/orders/:id/status` | Yes | seller/admin |

### POST /orders
```json
{
  "items": [
    { "productId": "uuid", "quantity": 50 }
  ],
  "deliveryMethod": "platform",
  "deliveryAddress": {
    "fullName": "Sara Bekele",
    "phone": "+2519...",
    "address": "Bole",
    "city": "Addis Ababa"
  },
  "paymentMethod": "telebirr",
  "notes": ""
}
```
**Server recalculates** subtotal, platformFee (commission %), deliveryFee, total.

---

## 4. Payments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/payments/initiate` | Yes | Start payment for order |
| POST | `/payments/webhook` | Signature | Telebirr/CBE/Chapa callback |
| GET | `/payments/order/:orderId` | Yes | Payment status |

### POST /payments/initiate
```json
{ "orderId": "uuid", "method": "telebirr" }
```

---

## 5. Market prices

| Method | Path | Auth |
|--------|------|------|
| GET | `/market-prices` | No |
| POST | `/market-prices` | admin |
| PATCH | `/market-prices/:id` | admin |

Query: `location`, `category`, `from`, `to`

---

## 6. Chat

| Method | Path | Auth |
|--------|------|------|
| GET | `/conversations` | Yes |
| POST | `/conversations` | Yes |
| GET | `/conversations/:id/messages` | Yes (participant) |
| POST | `/conversations/:id/messages` | Yes (participant) |

### POST /conversations
```json
{ "participantId": "uuid", "productId": "uuid" }
```

### Socket.io events
- `join` → conversation room  
- `message:new` → new message payload  
- `message:read`  
- `typing`  

---

## 7. Reviews & Sellers

| Method | Path | Auth |
|--------|------|------|
| GET | `/sellers/:id` | No |
| GET | `/sellers/:id/reviews` | No |
| POST | `/reviews` | Yes (buyer) |

### POST /reviews
```json
{
  "sellerId": "uuid",
  "productId": "uuid",
  "orderId": "uuid",
  "rating": 5,
  "comment": "Excellent quality"
}
```

---

## 8. Delivery

| Method | Path | Auth | Role |
|--------|------|------|------|
| GET | `/deliveries/:orderId` | Yes | buyer/seller/admin |
| PATCH | `/deliveries/:orderId/status` | Yes | delivery/admin |

Status flow: `assigned` → `picked_up` → `in_transit` → `delivered`

---

## 9. Admin

| Method | Path | Role |
|--------|------|------|
| GET | `/admin/users` | admin |
| PATCH | `/admin/users/:id/verify` | admin |
| GET | `/admin/products/pending` | admin |
| PATCH | `/admin/products/:id/approve` | admin |
| GET | `/admin/orders` | admin |
| GET | `/admin/reports/summary` | admin |

### PATCH /admin/users/:id/verify
```json
{ "status": "approved" }
```

### GET /admin/reports/summary
Returns: totalSales, commission, pendingPayments, ordersCount, farmersCount, buyersCount

---

## 10. Categories

| Method | Path | Auth |
|--------|------|------|
| GET | `/categories` | No |
| POST | `/categories` | admin |

---

## Error format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": []
  }
}
```

HTTP: 400 validation · 401 unauthorized · 403 forbidden · 404 not found · 429 rate limit · 500 server

---

## Commission (server-side)

```
platformFee = subtotal * COMMISSION_RATE  // e.g. 0.03
total = subtotal + deliveryFee + platformFee  // if buyer pays fee
```

Configurable via env: `COMMISSION_RATE=0.03`
