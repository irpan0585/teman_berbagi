/**
 * api.js
 * ─────────────────────────────────────────────────────────────
 * Modul komunikasi Frontend ↔ Backend melalui RESTful API
 * Materi: Integrasi Frontend dan Backend melalui API
 *
 * Menyediakan:
 *   • API_BASE   — URL dasar backend
 *   • api.get()  — HTTP GET
 *   • api.post() — HTTP POST
 *   • api.put()  — HTTP PUT
 *   • api.patch()— HTTP PATCH
 *   • api.delete()— HTTP DELETE
 *
 * Semua method otomatis menambahkan header Authorization
 * jika token JWT tersimpan di localStorage.
 * ─────────────────────────────────────────────────────────────
 */

/* ════════════════════════════════════════════════════════════════
   KONFIGURASI ALAMAT BACKEND
   • Saat FRONTEND & BACKEND DIPISAH (mis. Vercel + Render), isi alamat
     backend di bawah ini. Contoh: 'https://teman-berbagi-api.onrender.com'
   • Biarkan KOSONG ('') jika frontend dijalankan oleh backend yang sama
     (lokal: backend menyajikan frontend pada origin yang sama).
═══════════════════════════════════════════════════════════════════ */
const BACKEND_URL = ''; // <-- ISI dengan URL backend (Render) saat deploy

/**
 * URL dasar API. Diambil dari BACKEND_URL bila diisi; jika tidak,
 * dideteksi otomatis dari alamat yang sedang dibuka.
 */
const API_BASE = (() => {
  if (BACKEND_URL && BACKEND_URL.trim()) {
    return BACKEND_URL.trim().replace(/\/+$/, '') + '/api';
  }
  try {
    const loc = window.location;
    if (loc && /^https?:$/.test(loc.protocol)) {
      // Live Server (VS Code) biasanya port 5500/5501 & tidak melayani API.
      if (loc.port === '5500' || loc.port === '5501') {
        return `${loc.protocol}//${loc.hostname}:5000/api`;
      }
      return `${loc.origin}/api`;
    }
  } catch (_) { /* abaikan */ }
  return 'http://localhost:5000/api';
})();

const api = {
  /**
   * Mengirim HTTP request ke backend
   * @param {string} endpoint - path setelah /api
   * @param {object} options  - fetch options
   * @returns {Promise<{response: Response, data: object}>}
   */
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('tb_token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Hapus headers dari options agar tidak duplikat
    delete config.headers.undefined;

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json();

      // Jika token expired, logout
      if (response.status === 401 && token) {
        console.warn('Token expired, logging out...');
        localStorage.removeItem('tb_token');
        localStorage.removeItem('tb_user');
        if (typeof window._updateUserDisplay === 'function') {
          window._updateUserDisplay();
        }
      }

      return { response, data };
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

// ─── Shortcut API functions ─────────────────────────────────

/** Auth API */
const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

/** Donasi API */
const donasiAPI = {
  getAll: (params = '') => api.get(`/donasi${params ? '?' + params : ''}`),
  getById: (id) => api.get(`/donasi/${id}`),
  create: (data) => api.post('/donasi', data),
  update: (id, data) => api.put(`/donasi/${id}`, data),
  delete: (id) => api.delete(`/donasi/${id}`),
  publish: (id) => api.patch(`/donasi/${id}/publish`),
  search: (q) => api.get(`/donasi/search?q=${encodeURIComponent(q)}`),
};

/** Transaksi API */
const transaksiAPI = {
  getAll: (params = '') => api.get(`/transaksi${params ? '?' + params : ''}`),
  getById: (id) => api.get(`/transaksi/${id}`),
  create: (data) => api.post('/transaksi', data),
  verify: (id) => api.patch(`/transaksi/${id}/verify`),
  reject: (id) => api.patch(`/transaksi/${id}/reject`),
  getStats: () => api.get('/transaksi/stats'),
};

/** Kontak API */
const kontakAPI = {
  send: (data) => api.post('/kontak', data),
  getAll: () => api.get('/kontak'),
  getById: (id) => api.get(`/kontak/${id}`),
  delete: (id) => api.delete(`/kontak/${id}`),
};

/** Pilar API */
const pilarAPI = {
  register: (data) => api.post('/pilar', data),
  getAll: () => api.get('/pilar'),
};

/* ════════════════════════════════════════════════════════════════
   SESI ADMIN
   Panel Admin perlu token ber-role "admin" agar bisa melihat SEMUA
   transaksi dan melakukan verifikasi. Token admin disimpan TERPISAH
   (tb_admin_token) supaya tidak menimpa sesi pengguna biasa (tb_token).

   Untuk kemudahan demo, panel admin login otomatis memakai akun admin
   hasil seed. (Pada aplikasi produksi sebaiknya diganti halaman login
   admin sungguhan.)
═══════════════════════════════════════════════════════════════════ */
const ADMIN_DEMO = { login: 'admin@temanberbagi.id', password: 'admin123' };

/**
 * Pastikan ada token admin yang valid. Mengembalikan token admin,
 * atau null bila backend tidak tersedia.
 */
async function ensureAdminAuth() {
  let token = localStorage.getItem('tb_admin_token');
  if (token) return token;

  // Belum ada token admin → login otomatis sebagai admin demo
  try {
    const { response, data } = await api.post('/auth/login', ADMIN_DEMO);
    if (response.ok && data.success && data.data?.user?.role === 'admin') {
      localStorage.setItem('tb_admin_token', data.data.token);
      localStorage.setItem('tb_admin_user', JSON.stringify(data.data.user));
      return data.data.token;
    }
    console.warn('Login admin gagal:', data.message);
  } catch (err) {
    console.warn('Tidak bisa login admin (backend mati?):', err.message);
  }
  return null;
}

/** Request yang SELALU memakai token admin (bukan tb_token). */
async function adminRequest(endpoint, options = {}) {
  const token = await ensureAdminAuth();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  delete config.headers.undefined;

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  // Token admin kedaluwarsa → hapus agar login ulang pada panggilan berikutnya
  if (response.status === 401) {
    localStorage.removeItem('tb_admin_token');
    localStorage.removeItem('tb_admin_user');
  }
  return { response, data };
}

/** API khusus admin (memakai token admin). */
const adminAPI = {
  // transaksi
  getTransaksi: (params = '') => adminRequest(`/transaksi${params ? '?' + params : ''}`, { method: 'GET' }),
  verifyTransaksi: (id) => adminRequest(`/transaksi/${id}/verify`, { method: 'PATCH' }),
  rejectTransaksi: (id) => adminRequest(`/transaksi/${id}/reject`, { method: 'PATCH' }),
  getStats: () => adminRequest('/transaksi/stats', { method: 'GET' }),
  // donasi (program)
  getDonasi: (params = '') => adminRequest(`/donasi${params ? '?' + params : ''}`, { method: 'GET' }),
  createDonasi: (body) => adminRequest('/donasi', { method: 'POST', body: JSON.stringify(body) }),
  updateDonasi: (id, body) => adminRequest(`/donasi/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  publishDonasi: (id) => adminRequest(`/donasi/${id}/publish`, { method: 'PATCH' }),
  deleteDonasi: (id) => adminRequest(`/donasi/${id}`, { method: 'DELETE' }),
  // kontak & pilar (untuk panel admin)
  getKontak: () => adminRequest('/kontak', { method: 'GET' }),
  getPilar: () => adminRequest('/pilar', { method: 'GET' }),
};

// Ekspor ke global window
window.API_BASE = API_BASE;
window.api = api;
window.authAPI = authAPI;
window.donasiAPI = donasiAPI;
window.transaksiAPI = transaksiAPI;
window.kontakAPI = kontakAPI;
window.pilarAPI = pilarAPI;
window.adminAPI = adminAPI;
window.ensureAdminAuth = ensureAdminAuth;
