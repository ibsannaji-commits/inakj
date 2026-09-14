# Security — INA-KJ Agro Connect

## Priorities (P0 first)

1. HTTPS only in production  
2. Password hashing (bcrypt cost ≥ 12 or Argon2)  
3. JWT access (short) + refresh token (httpOnly / rotated)  
4. Role-based access: farmer | buyer | admin | delivery  
5. Ownership checks (seller can only edit own products)  
6. Input validation (Zod/Joi); ORM only — no SQL string concat  
7. Server-side order total recalculation (never trust client amount)  
8. Rate limit login/register  
9. Helmet + strict CORS  
10. Payment webhook signature verification  

## Auth

- Never store plain passwords  
- Generic error on failed login (“Invalid credentials”)  
- Optional SMS OTP for phone verify  

## Uploads

- Max size, MIME whitelist, random filenames  
- ID documents: private storage, admin-only access  

## Payments

- No full card data on your servers (use gateway)  
- Idempotent webhooks  
- Audit log for payment status changes  

## Secrets

- `.env` never committed  
- Different keys for dev/staging/production  

## Frontend

- Prefer httpOnly cookies / memory over localStorage for tokens  
- Sanitize any user-generated HTML  
- No API secrets in client code  
