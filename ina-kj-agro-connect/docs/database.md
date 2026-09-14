# Database Schema — INA-KJ Agro Connect

PostgreSQL recommended.

## Core tables

### users
- id, phone (unique), email, password_hash, full_name
- role: farmer | buyer | admin | delivery
- is_verified, verification_status: pending | approved | rejected
- location, region, city, avatar_url
- rating_avg, rating_count
- created_at, updated_at

### categories
- id, name_om, name_en, slug, icon

### products
- id, seller_id, category_id, name, description
- price_etb, unit (kg|quintal|ton|piece)
- quantity_available, min_order_qty
- grade (A|B|C|export|organic)
- location, is_export_ready, is_negotiable
- delivery_option: seller | platform | pickup
- status: pending | approved | rejected | sold_out | inactive
- images (JSON), views_count
- created_at, updated_at

### orders
- id, order_number, buyer_id
- status: pending | paid | processing | picked_up | in_transit | delivered | cancelled
- subtotal, delivery_fee, platform_fee, total
- delivery_method, delivery_address (JSON)
- payment_method, payment_status
- notes, created_at, updated_at

### order_items
- id, order_id, product_id, seller_id
- quantity, unit_price, line_total, status

### payments
- id, order_id, amount, method (telebirr|cbe|bank|card)
- transaction_ref, status, raw_response, paid_at

### deliveries
- id, order_id, partner_id
- status: assigned | picked_up | in_transit | delivered
- tracking_updates (JSON), eta, delivered_at

### market_prices
- id, product_name, category, location
- price_etb, unit, change_pct, recorded_at, source

### conversations / conversation_participants / messages
- Chat between buyer and seller (optional product_id)

### reviews
- id, product_id, seller_id, buyer_id, order_id
- rating (1–5), comment, created_at

### notifications
- id, user_id, type, title, body, data, is_read, created_at

## Relationships (summary)

```
users 1──* products
users 1──* orders (as buyer)
products 1──* order_items
orders 1──* order_items
orders 1──* payments
orders 1──1 deliveries
users 1──* reviews (as seller / buyer)
```
