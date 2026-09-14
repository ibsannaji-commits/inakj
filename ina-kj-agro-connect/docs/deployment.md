# Domain, Hosting & Deployment — INA-KJ Agro Connect

## Stage 1 — Frontend only (current MVP)

### Hosting (free SSL + custom domain)

- **Cloudflare Pages** (recommended)
- **Netlify**
- **Vercel**
- **GitHub Pages**

### Steps (Netlify example)

1. Push this folder to GitHub  
2. Netlify → New site → Import from Git  
3. Publish directory = repository root (where `index.html` is)  
4. Deploy  
5. Domain settings → add `yourdomain.com`  
6. Set DNS (CNAME/A as instructed)  

### Local test

```bash
cd ina-kj-agro-connect
python3 -m http.server 8080
# open http://localhost:8080
```

## Domain

Examples: `inakj.com`, `ina-kj.com`, `inakj.et`  

Registrars: Namecheap, Cloudflare, Porkbun, or local `.et` reseller.

## Stage 2 — Backend

| Service | Example host |
|---------|----------------|
| API | Railway, Render, DigitalOcean, VPS |
| Database | PostgreSQL (same host or Supabase) |
| Files | Cloudinary / S3 |
| Subdomain | `api.yourdomain.com` |

## DNS example

| Type | Name | Target |
|------|------|--------|
| CNAME | www | your-site.netlify.app |
| CNAME | api | your-api.up.railway.app |

## Cost (MVP frontend)

- Domain: ~10–15 USD/year  
- Static host + SSL: **free** on Netlify/Cloudflare  

## Checklist before go-live

- [ ] All pages open without broken links  
- [ ] HTTPS works  
- [ ] OM/EN toggle works  
- [ ] No secrets in the repo  
- [ ] Mobile layout checked  
