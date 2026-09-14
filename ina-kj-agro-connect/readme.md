# 🌱 INA-KJ Agro Connect

**Qonnaan Bulaa → Gabaa → Buyer → Delivery → Kaffaltii**

Agricultural marketplace platform for Ethiopia — connecting farmers, buyers, wholesalers, and exporters.

Bilingual: **Afaan Oromoo + English**

---

## Project structure

```
ina-kj-agro-connect/
│
├── index.html                 # Home
├── marketplace.html           # Product marketplace + filters
├── product-details.html       # Single product view
├── market-price.html          # Live market prices
├── cart.html                  # Shopping cart
├── checkout.html              # Checkout (address, delivery, payment method)
├── order-confirmed.html       # Order confirmation
├── payment.html               # Payment (Telebirr, CBE, Bank, Card)
├── delivery-tracking.html     # Order tracking timeline
├── messages.html              # Buyer ↔ Seller chat
├── seller-profile.html        # Verification + ratings + reviews
│
├── css/
│   └── style.css              # Global design system
│
├── js/
│   └── script.js              # Language toggle + shared interactions
│
├── farmer/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── add-product.html
│
├── buyer/
│   ├── login.html
│   ├── register.html
│   └── dashboard.html
│
├── admin/
│   ├── login.html
│   └── dashboard.html
│
├── assets/
│   └── images/                # Images (placeholder)
│
├── docs/                      # Architecture notes
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── SECURITY.md
│   ├── BUSINESS-MODEL.md
│   └── DEPLOYMENT.md
│
├── README.md
└── .gitignore
```

---

## Features (Frontend MVP)

| Area | Pages / Features |
|------|------------------|
| **Public** | Home, Marketplace, Product details, Market prices |
| **Commerce** | Cart, Checkout, Order confirmed, Payment |
| **Logistics** | Delivery tracking |
| **Trust** | Seller profile, verification, ratings, reviews |
| **Chat** | Messages (buyer–seller) |
| **Farmer** | Login, register, dashboard, add product |
| **Buyer** | Login, register, dashboard |
| **Admin** | Login, dashboard (users, products, orders, finance) |

---

## How to run locally

1. Open the folder `ina-kj-agro-connect`
2. Open `index.html` in a browser  
   **or** use a local server:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

3. Visit: `http://localhost:8080`

---

## Language

Toggle **OM | EN** (top right on most pages).  
Default: Afaan Oromoo. Preference saved in `localStorage`.

---

## User flows

```
Farmer:  Register/Login → Dashboard → Add Product → Orders → Messages
Buyer:   Register/Login → Marketplace → Product → Cart → Checkout → Payment → Tracking
Admin:   Login → Dashboard → Verify users/products → Orders / Finance
```

---

## Tech (current)

- HTML5 + CSS3 + Vanilla JavaScript
- No build step required
- Mobile-responsive
- Ready for static hosting (Netlify, Cloudflare Pages, GitHub Pages)

---

## Next steps (backend)

See `docs/` for:

- Database schema
- API architecture
- Security checklist
- Business / revenue model
- Domain & deployment guide

---

## Brand

- **Name:** INA-KJ Agro Connect  
- **Colors:** Agriculture green (`#1B7A3D`) + white  
- **Market:** Ethiopia (ETB, Telebirr, CBE Birr)

---

© 2026 INA-KJ Agro Connect — Built for Ethiopia
