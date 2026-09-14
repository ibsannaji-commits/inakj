# PWA — Install as Mobile App

INA-KJ Agro Connect can be installed on Android / iPhone home screen.

## Files added

| File | Role |
|------|------|
| `manifest.json` | App name, icons, theme, shortcuts |
| `sw.js` | Service worker — offline cache |
| `assets/icons/icon-*.png` | 72–512px icons |
| `js/script.js` | Registers service worker |
| `index.html` | manifest + Apple meta tags |

## How users install

### Android (Chrome)
1. Open the site (HTTPS required)
2. Menu → **Install app** / **Add to Home screen**
3. Icon appears like a native app

### iPhone (Safari)
1. Open site in Safari
2. Share → **Add to Home Screen**
3. Confirm

## Requirements

- Site must be served over **HTTPS** (or localhost)
- Service worker only works on secure origins

## Test locally

```bash
cd ina-kj-agro-connect
npx serve .
# open http://localhost:3000
# Chrome DevTools → Application → Manifest / Service Workers
```

## Shortcuts (long-press app icon)

- Marketplace  
- Market Prices  
- Cart  
