# Frontend — Teman Berbagi (Tampilan)

Aplikasi sisi pengguna (HTML, CSS, JavaScript). Folder ini di-deploy ke **Vercel** (gratis).

## PENTING: arahkan ke backend
Sebelum deploy, buka `js/api.js`, lalu isi alamat backend (dari Render) di baris paling atas:
```js
const BACKEND_URL = 'https://teman-berbagi-api.onrender.com';
```
Biarkan `''` jika dijalankan lokal bersama backend.

## Deploy ke Vercel
1. Push proyek ke GitHub.
2. Vercel → Add New → **Project** → import repo.
3. **Framework Preset**: Other.
4. **Root Directory**: `frontend` (jika repo berisi tiga folder). Jika folder ini jadi repo sendiri, kosongkan.
5. **Build Command**: kosongkan  •  **Output Directory**: kosongkan.
6. Deploy → dapat alamat `https://....vercel.app`.

## Coba lokal cepat
Cukup buka `index.html` lewat Live Server, atau jalankan backend lalu buka `http://localhost:5000`.
