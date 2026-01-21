# 🚀 Quick Deployment Guide - Portfolio Riski Permana

## ⚠️ Current Issue
Sistem menggunakan Node.js v18.19.1, sedangkan Vite 7 memerlukan Node v20.19+ atau v22.12+.
Hal ini menyebabkan esbuild crash dengan SIGSEGV error.

## ✅ Solusi Tercepat

### Opsi 1: Upgrade Node.js (Recommended)

Jika menggunakan nvm (Node Version Manager):
```bash
# Install Node 20
nvm install 20
nvm use 20

# Install dependencies dan jalankan
cd /home/wonyoung/portofolio
rm -rf node_modules package-lock.json
npm install
npm run dev
```

Jika tidak menggunakan nvm, download dari nodejs.org:
- https://nodejs.org/ (pilih LTS version 20+)

---

### Opsi 2: Deploy ke Vercel (No Local Build Required)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (akan build di cloud dengan Node 20+)
cd /home/wonyoung/portofolio
vercel
```

Follow wizard:
1. Setup dan deploy? → Yes
2. Scope? → pilih account Anda
3. Link to existing project? → No
4. Project name? → (tekan Enter)
5. Directory? → ./ (tekan Enter)
6. Build settings? → (deteksi otomatis Vite)

Website akan live dalam ~2 menit! 🚀

---

### Opsi 3: Deploy ke Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd /home/wonyoung/portofolio
netlify deploy --prod
```

---

### Opsi 4: Push ke GitHub + GitHub Pages

```bash
cd /home/wonyoung/portofolio

# Initialize git (jika belum)
git init
git add .
git commit -m "Initial commit: Portfolio Riski Permana"

# Create repo di GitHub, lalu:
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main

# Enable GitHub Pages di repo settings
# GitHub akan auto-build dengan Node 20+
```

Add file `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 📂 File yang Perlu Diupdate (Opsional)

1. **Profile Photo**: Replace `/public/profil.jpg` dengan foto asli
2. **Certificates**: Add certificate images di `/public/certificates/`:
   - ceh.jpg
   - oscp.jpg
   - security-plus.jpg
   - cissp.jpg
   - hackerone.jpg

---

## 🧪 Test Locally (Setelah Node Upgrade)

```bash
cd /home/wonyoung/portofolio
npm run dev
```

Buka browser: http://localhost:5173

---

## 🏗️ Build untuk Production

```bash
npm run build
```

File build akan ada di folder `dist/`

Preview build:
```bash
npm run preview
```

---

## 📝 Notes

- Semua code sudah ready, hanya perlu Node.js yang compatible
- Deploy ke cloud platform akan automatic build dengan Node 20+
- Tidak perlu edit code apapun untuk deployment
