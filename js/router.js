/**
 * ROUTER UTAMA
 * Menangani navigasi, autentikasi, dan state global
 */

/* ═══════════════════════════════════════════════════════════════
   1. AUTHENTICATION HELPERS
═══════════════════════════════════════════════════════════════ */

// Ambil token dari localStorage
function getAuthToken() {
  return localStorage.getItem('tb_token');
}

// Cek apakah user sudah login
function isAuthenticated() {
  return !!getAuthToken();
}

// Ambil data user yang login
function getCurrentUser() {
  const userStr = localStorage.getItem('tb_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Logout user
function logout() {
  localStorage.removeItem('tb_token');
  localStorage.removeItem('tb_user');
  showPage('masuk');
  // Tampilkan pesan sukses logout
  const messageDiv = document.createElement('div');
  messageDiv.textContent = 'Anda telah logout';
  messageDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:#4a6741;color:white;padding:12px 24px;border-radius:8px;z-index:9999;animation:fadeOut 3s forwards';
  document.body.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 3000);

  // Update tampilan user
  _updateUserDisplay();
  _syncProfileDropdown();
}

// Request API dengan autentikasi otomatis
// Catatan: untuk endpoint backend gunakan window.api (api.js).
// Fungsi ini dipertahankan untuk kompatibilitas mundur.
async function authFetch(url, options = {}) {
  const token = getAuthToken();

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };
  mergedOptions.headers = { ...defaultOptions.headers, ...options.headers };

  try {
    const response = await fetch(url, mergedOptions);
    const data = await response.json();

    if (!response.ok && response.status === 401) {
      // Token expired atau invalid
      logout();
      throw new Error('Sesi berakhir. Silakan login kembali.');
    }

    return { response, data };
  } catch (error) {
    throw error;
  }
}

/* ═══════════════════════════════════════════════════════════════
   2. STATE GLOBAL
═══════════════════════════════════════════════════════════════ */
let currentPage = 'daftar';
let selectedDonasi = null;
let selectedNominal = 50000;

/* Riwayat navigasi untuk tombol "Kembali" yang muncul di setiap halaman */
let navHistory = [];
/** Halaman auth/landing — tidak dicatat sebagai tujuan "Kembali" */
const AUTH_PAGES = ['daftar', 'masuk'];

/** Halaman utama (tab menu) — tombol Kembali tidak ditampilkan */
const MAIN_PAGES = ['donasi', 'menu-kewajiban', 'derma', 'pilar-kebaikan'];

/** Halaman yang menggunakan navbar putih */
const LIGHT_PAGES = [
  'donasi', 'detail-donasi', 'bayar-donasi', 'sukses-donasi',
  'menu-kewajiban',
  'kewajiban', 'bayar-kewajiban',
  'persepuhan', 'bayar-persepuhan',
  'stipendium', 'bayar-stipendium',
  'derma', 'bayar-derma',
  'pilar-kebaikan',
  'profil',
];

/* ═══════════════════════════════════════════════════════════════
   3. DATA DONASI
   Data awal dipakai sebagai fallback bila backend belum tersedia.
   Saat halaman dimuat, data ini akan diisi ulang dari REST API
   (GET /api/donasi?verified=true) melalui loadDonasiFromAPI().
═══════════════════════════════════════════════════════════════ */
const donasiData = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    title: 'Mari membantu keluarga kita yang berada di sumatra',
    hari: 4, jumlah: 295000, target: 500000,
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1609234334335-5f6d3a5b3d9a?w=600&q=80',
    title: 'Bantu mereka agar dapat melaksanakan ibadah dengan hikmat',
    hari: 4, jumlah: 295000, target: 500000,
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1587134160474-2f1b940a5a0d?w=600&q=80',
    title: 'Pengadaan mobile ambulance gratis bagi warga pelosok',
    hari: 20, jumlah: 295000, target: 500000,
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80',
    title: 'Mari membantu keluarga kita yang berada di sumatra',
    hari: 4, jumlah: 295000, target: 500000,
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?w=600&q=80',
    title: 'Saat ini Ibu suri memasuki stadium 3 kanker yang di derita',
    hari: 4, jumlah: 295000, target: 500000,
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/photo-1588859519748-d56d71e67e03?w=600&q=80',
    title: 'Pengadaan mobile ambulance gratis bagi warga pelosok',
    hari: 20, jumlah: 295000, target: 500000,
  },
];

/**
 * Muat data donasi dari backend (REST API) dan render ulang grid.
 * Jika backend tidak tersedia, data fallback tetap dipakai.
 */
async function loadDonasiFromAPI() {
  if (typeof window.donasiAPI === 'undefined') return;
  try {
    const { response, data } = await window.donasiAPI.getAll('fitur=donasi&verified=true');
    if (response.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
      // Ganti isi array tanpa mengubah referensi (agar binding lain tetap valid)
      donasiData.length = 0;
      data.data.forEach((d) => {
        donasiData.push({
          id: d._id || d.id,
          img: d.img,
          title: d.title,
          deskripsi: d.deskripsi,
          hari: d.hari || 30,
          jumlah: Number(d.jumlah) || 0,
          target: Number(d.target) || 500000,
          bank: d.bank,
          no_rekening: d.no_rekening,
          nama_rekening: d.nama_rekening,
        });
      });
      window.donasiData = donasiData;
      // Render ulang grid bila fungsi tersedia
      if (typeof window.renderDonasiGrid === 'function') {
        window.renderDonasiGrid();
      }
    }
  } catch (err) {
    console.warn('Backend donasi tidak tersedia, memakai data lokal.', err.message);
  }
}
window.loadDonasiFromAPI = loadDonasiFromAPI;

// Muat data donasi saat aplikasi siap
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(loadDonasiFromAPI, 300);
});

/* ═══════════════════════════════════════════════════════════════
   4. ROUTER — showPage() dengan proteksi autentikasi
═══════════════════════════════════════════════════════════════ */

/**
 * Navigasi ke halaman tertentu dengan proteksi autentikasi
 * @param {string} pageName
 */
function showPage(pageName) {
  // Proteksi autentikasi DINONAKTIFKAN — daftar dikosongkan agar seluruh halaman
  // (donasi, kewajiban, dll.) bisa diakses tanpa registrasi/login terlebih dahulu.
  // Untuk mengaktifkan kembali, tambahkan nama halaman ke array di bawah.
  const protectedPages = [];

  // Cek autentikasi untuk halaman yang dilindungi (saat ini tidak ada)
  if (!isAuthenticated() && protectedPages.includes(pageName)) {
    originalShowPage('masuk');
    return;
  }

  originalShowPage(pageName);
}

// Simpan fungsi asli
const originalShowPage = (pageName, skipHistory = false) => {
  // Catat halaman saat ini ke riwayat (untuk tombol "Kembali"),
  // kecuali saat navigasi mundur atau saat meninggalkan halaman auth/landing.
  if (!skipHistory && currentPage !== pageName && !AUTH_PAGES.includes(currentPage)) {
    navHistory.push(currentPage);
  }

  // Tutup pencarian bila sedang terbuka agar tidak ikut terbawa antar halaman
  if (typeof window.closeSearch === 'function') window.closeSearch();

  // Sembunyikan halaman lama
  const oldEl = document.getElementById(`page-${currentPage}`);
  if (oldEl) {
    oldEl.classList.remove('visible');
    setTimeout(() => oldEl.classList.remove('active'), 320);
  }

  currentPage = pageName;

  // Tampilkan halaman baru (sedikit delay agar transisi keluar terlihat dulu)
  const newEl = document.getElementById(`page-${pageName}`);
  if (newEl) {
    newEl.classList.add('active');
    newEl.offsetHeight; // reflow agar animasi CSS terpicu
    setTimeout(() => requestAnimationFrame(() => newEl.classList.add('visible')), 40);
  }

  _updateNav(pageName);
  _updateUserDisplay();
  _syncProfileDropdown();
  // Tunda sedikit agar konten halaman sempat dirender sebelum tombol disisipkan
  requestAnimationFrame(() => _updateBackButton(pageName));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Override showPage
window.showPage = showPage;

/* ═══════════════════════════════════════════════════════════════
   5. NAVBAR & USER DISPLAY
═══════════════════════════════════════════════════════════════ */
function _updateNav(pageName) {
  const isAdmin = pageName === 'admin';
  const isLight = LIGHT_PAGES.includes(pageName);

  const mainNav = document.getElementById('mainNav');
  const mainNavLight = document.getElementById('mainNavLight');

  if (isAdmin) {
    if (mainNav) mainNav.style.display = 'none';
    if (mainNavLight) mainNavLight.style.display = 'none';
    // Inject tombol logout di sidebar admin (jika belum ada)
    _injectAdminLogout();
    return;
  }

  if (mainNav) mainNav.style.display = isLight ? 'none' : 'flex';
  if (mainNavLight) mainNavLight.style.display = isLight ? 'flex' : 'none';
  // Hentikan observer admin saat meninggalkan halaman admin
  _stopAdminLogoutObserver();

  // Highlight link aktif di navbar dark
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-nav'));
  if (pageName === 'tentang') document.getElementById('navTentang')?.classList.add('active-nav');
  if (pageName === 'kontak') document.getElementById('navKontak')?.classList.add('active-nav');

  if (isLight) _syncLightTab(pageName);
}

function _syncLightTab(pageName) {
  const tabMap = {
    'donasi': 'lnDonasi',
    'detail-donasi': 'lnDonasi',
    'bayar-donasi': 'lnDonasi',
    'sukses-donasi': 'lnDonasi',
    'menu-kewajiban': 'lnKewajiban',
    'kewajiban': 'lnKewajiban',
    'bayar-kewajiban': 'lnKewajiban',
    'persepuhan': 'lnKewajiban',
    'bayar-persepuhan': 'lnKewajiban',
    'stipendium': 'lnKewajiban',
    'bayar-stipendium': 'lnKewajiban',
    'derma': 'lnDerma',
    'bayar-derma': 'lnDerma',
    'pilar-kebaikan': 'lnPilar',
  };
  const activeId = tabMap[pageName];

  ['lnDonasi', 'lnKewajiban', 'lnDerma', 'lnPilar'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === activeId) {
      el.classList.add('nav-pill');
      el.classList.remove('nav-light-link');
    } else {
      el.classList.remove('nav-pill');
      el.classList.add('nav-light-link');
    }
  });
}

/**
 * Inject tombol Logout ke sidebar admin.
 * Menggunakan MutationObserver agar tombol selalu ada meskipun
 * sidebar di-render ulang saat pindah sub-halaman admin
 * (Home, Buat Fanplate, Kelola Fanplate, Verifikasi).
 */
let _adminLogoutObserver = null;

function _injectAdminLogout() {
  // Hentikan observer lama kalau ada
  _stopAdminLogoutObserver();

  // Fungsi utama: sisipkan tombol jika belum ada
  function _ensureLogoutBtn() {
    const footer = document.querySelector('.admin-sidebar-footer');
    if (!footer) return;
    if (footer.querySelector('.admin-sidebar-logout-btn')) return;

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'admin-sidebar-logout-btn';
    logoutBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      <span>Keluar</span>`;
    logoutBtn.onclick = function () {
      _stopAdminLogoutObserver();
      // Hapus sesi admin
      localStorage.removeItem('tb_admin_token');
      localStorage.removeItem('tb_admin_user');
      // Hapus sesi pengguna (sama seperti logout pengguna)
      localStorage.removeItem('tb_token');
      localStorage.removeItem('tb_user');
      // Navigasi ke halaman masuk
      showPage('masuk');
      // Tampilkan notifikasi
      const toast = document.createElement('div');
      toast.textContent = 'Anda telah logout dari panel admin';
      toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#4a6741;color:white;padding:12px 24px;border-radius:8px;z-index:9999;animation:fadeOut 3s forwards';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      // Update tampilan user
      if (typeof _updateUserDisplay === 'function') _updateUserDisplay();
      if (typeof _syncProfileDropdown === 'function') _syncProfileDropdown();
    };
    footer.appendChild(logoutBtn);
  }

  // Inject pertama kali (dengan sedikit delay agar core.js sempat render)
  setTimeout(_ensureLogoutBtn, 150);

  // Pasang MutationObserver pada page-admin agar setiap kali DOM berubah
  // (misal klik Home / Kelola Fanplate) tombol logout tetap ada
  const adminPage = document.getElementById('page-admin');
  if (adminPage) {
    _adminLogoutObserver = new MutationObserver(() => {
      _ensureLogoutBtn();
    });
    _adminLogoutObserver.observe(adminPage, { childList: true, subtree: true });
  }
}

function _stopAdminLogoutObserver() {
  if (_adminLogoutObserver) {
    _adminLogoutObserver.disconnect();
    _adminLogoutObserver = null;
  }
}

function _updateUserDisplay() {
  const user = getCurrentUser();

  // Update nama di dropdown
  const userNameSpan = document.querySelector('.nav-profile-name');
  const btnAvatar = document.getElementById('navProfileAvatar');
  const btnName = document.getElementById('navProfileName');

  if (user && (user.username || user.name)) {
    const displayName = user.username || user.name || 'Akun';
    const initials = displayName
      .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    if (btnName) btnName.textContent = displayName;
    if (userNameSpan) userNameSpan.textContent = displayName;
    if (btnAvatar) {
      btnAvatar.innerHTML = `<span style="font-size:12px;font-weight:700;color:#3D2314">${initials}</span>`;
    }
  } else {
    if (btnName) btnName.textContent = 'Akun';
    if (userNameSpan) userNameSpan.textContent = 'Akun';
    if (btnAvatar) {
      btnAvatar.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D2314" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
    }
  }

  // Sinkronkan dropdown
  _syncProfileDropdown();
}

// Fungsi global untuk navbar
window.navTab = function (el, target) {
  showPage(target);
};

/* ── Tombol Kembali — ikon di pojok kiri atas konten halaman ── */
function _updateBackButton(pageName) {
  // Bersihkan tombol lama dari halaman manapun
  document.querySelectorAll('.global-back-btn').forEach(el => el.remove());

  const isLight = LIGHT_PAGES.includes(pageName);
  const show = isLight
    && !AUTH_PAGES.includes(pageName)
    && !MAIN_PAGES.includes(pageName)
    && pageName !== 'admin'
    && navHistory.length > 0;
  if (!show) return;

  const btn = document.createElement('button');
  btn.className = 'global-back-btn';
  btn.setAttribute('aria-label', 'Kembali');
  btn.onclick = () => window.goBack();
  btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
  </svg>`;

  // Cari anchor: section/hero paling atas di halaman aktif
  const pageEl = document.getElementById(`page-${pageName}`);
  if (!pageEl) return;

  const anchor =
    pageEl.querySelector('.detail-hero') ||
    pageEl.querySelector('.kewajiban-hero-wrap') ||
    pageEl.querySelector('.derma-hero') ||
    pageEl.querySelector('.pilar-hero') ||
    pageEl.querySelector('.bayar-mini-banner') ||
    pageEl.querySelector('.sukses-content') ||
    pageEl.querySelector('.donasi-page') ||
    pageEl.querySelector('[class$="-page"]') ||
    pageEl.firstElementChild;

  if (anchor) {
    // Pastikan anchor punya position relative agar tombol absolute di dalamnya
    const pos = getComputedStyle(anchor).position;
    if (pos === 'static') anchor.style.position = 'relative';
    anchor.insertBefore(btn, anchor.firstChild);
  }
}

window.goBack = function () {
  if (typeof window.closeSearch === 'function') window.closeSearch();
  const prev = navHistory.pop();
  originalShowPage(prev || 'donasi', true);
};

window.pilihKewajiban = function (jenis) {
  const tujuan = { 'zakat-fitrah': 'kewajiban', 'persepuhan': 'persepuhan', 'stipendium': 'stipendium' };
  if (tujuan[jenis]) showPage(tujuan[jenis]);
};

window.logout = logout;

/* ═══════════════════════════════════════════════════════════════
   6. SEARCH
═══════════════════════════════════════════════════════════════ */
window.openSearch = function () {
  const pill = document.getElementById('navLightPill');
  if (pill) pill.classList.add('searching');
  setTimeout(() => document.getElementById('searchOverlayInput')?.focus(), 220);
  setTimeout(() => document.addEventListener('click', _outsideSearchClick), 60);
};

window.closeSearch = function () {
  const pill = document.getElementById('navLightPill');
  if (pill) pill.classList.remove('searching');
  const results = document.getElementById('searchResults');
  if (results) results.classList.remove('open');
  const input = document.getElementById('searchOverlayInput');
  if (input) input.value = '';
  document.removeEventListener('click', _outsideSearchClick);
};

window.triggerSearch = function () {
  const val = document.getElementById('searchOverlayInput')?.value.trim();
  if (val) handleSearch(val);
};

function handleSearch(query) {
  const resultsEl = document.getElementById('searchResults');
  const innerEl = document.getElementById('searchResultsInner');
  if (!query.trim()) {
    if (resultsEl) resultsEl.classList.remove('open');
    return;
  }

  const filtered = donasiData.filter(d =>
    d.title.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    innerEl.innerHTML = `<div style="padding:16px 24px;color:#999;font-size:13px;">
      Tidak ada hasil untuk "<strong>${query}</strong>"</div>`;
  } else {
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    innerEl.innerHTML = filtered.map(d => `
      <div class="search-result-item" onclick="selectedDonasi=donasiData.find(x=>String(x.id)===String('${d.id}'));closeSearch();showPage('detail-donasi')">
        <img class="search-result-img" src="${d.img}" alt="">
        <div class="search-result-text">${d.title.replace(re, '<strong>$1</strong>')}</div>
      </div>`).join('');
  }
  resultsEl.classList.add('open');
}

function _outsideSearchClick(e) {
  const pill = document.getElementById('navLightPill');
  const results = document.getElementById('searchResults');
  if (pill && pill.contains(e.target)) return;
  if (results && results.contains(e.target)) return;
  closeSearch();
}

/* ═══════════════════════════════════════════════════════════════
   7. HASIL PEMBAYARAN INLINE (tanpa berpindah halaman)
   Menampilkan status Diproses → BERHASIL/GAGAL sebagai overlay di
   atas halaman bayar saat ini. currentPage TIDAK berubah, sehingga
   setelah pembayaran pengguna tetap berada di halaman yang sama.
═══════════════════════════════════════════════════════════════ */
window.showPaymentSuccess = function () {
  let overlay = document.getElementById('paymentResultOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'paymentResultOverlay';
    overlay.className = 'pay-result-overlay';
    overlay.innerHTML = `
      <div class="pay-result-card">
        <h2 class="pay-result-title">TERIMA KASIH TELAH BERDONASI</h2>
        <p class="pay-result-sub" id="payResultSub">Pembayaran kamu sedang diproses</p>
        <div class="pay-result-spinner" id="payResultSpinner"><div class="pay-result-ring"></div></div>
        <div class="pay-result-status-label">STATUS</div>
        <div class="pay-result-badge processing" id="payResultBadge">Diproses.....</div>
        <button class="pay-result-back" id="payResultBack" onclick="kembaliKeBeranda()" style="display:none">Kembali ke Beranda</button>
      </div>`;
    document.body.appendChild(overlay);
  }

  const sub = overlay.querySelector('#payResultSub');
  const spin = overlay.querySelector('#payResultSpinner');
  const badge = overlay.querySelector('#payResultBadge');
  const back = overlay.querySelector('#payResultBack');

  // state awal: diproses
  sub.style.display = 'block';
  spin.style.display = 'flex';
  badge.className = 'pay-result-badge processing';
  badge.textContent = 'Diproses.....';
  back.style.display = 'none';

  requestAnimationFrame(() => overlay.classList.add('open'));

  clearTimeout(window.__payResultTimer);
  window.__payResultTimer = setTimeout(() => {
    sub.style.display = 'none';
    spin.style.display = 'none';
    if (window.__buktiUploaded) {
      badge.className = 'pay-result-badge success';
      badge.textContent = 'BERHASIL';
    } else {
      badge.className = 'pay-result-badge gagal';
      badge.textContent = 'GAGAL';
    }
    back.style.display = 'inline-flex';
  }, 2400);
};

window.closePaymentResult = function () {
  const overlay = document.getElementById('paymentResultOverlay');
  if (overlay) overlay.classList.remove('open');
};

// Fungsi kembali ke beranda
window.kembaliKeBeranda = function () {
  // Reset state
  window.__buktiUploaded = false;
  // Tutup overlay payment jika ada
  if (typeof window.closePaymentResult === 'function') {
    window.closePaymentResult();
  }
  // Kembali ke halaman donasi
  if (typeof showPage === 'function') {
    showPage('donasi');
  } else {
    window.location.href = '/';
  }
};

// Ekspor global
window.handleSearch = handleSearch;
window.donasiData = donasiData;
window.selectedDonasi = selectedDonasi;
window.selectedNominal = selectedNominal;
window.getAuthToken = getAuthToken;
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.authFetch = authFetch;

/* ═══════════════════════════════════════════════════════════════
   PROFIL DROPDOWN
═══════════════════════════════════════════════════════════════ */

// Toggle buka/tutup dropdown profil
function toggleProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  const btn = document.getElementById('navProfileBtn');
  if (!dropdown) return;
  const isOpen = dropdown.classList.contains('open');
  if (isOpen) {
    closeProfileDropdown();
  } else {
    _syncProfileDropdown();
    dropdown.classList.add('open');
    btn.classList.add('active');
  }
}

function closeProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  const btn = document.getElementById('navProfileBtn');
  if (dropdown) dropdown.classList.remove('open');
  if (btn) btn.classList.remove('active');
}

// Sinkronkan info user ke dropdown
function _syncProfileDropdown() {
  const user = getCurrentUser();

  const ddName = document.getElementById('profileDdName');
  const ddEmail = document.getElementById('profileDdEmail');
  const ddAvatar = document.getElementById('profileDdAvatar');
  const btnName = document.getElementById('navProfileName');
  const btnAvatar = document.getElementById('navProfileAvatar');
  const authBtn = document.getElementById('profileAuthBtn');
  const authLabel = document.getElementById('profileAuthLabel');
  const authIcon = document.getElementById('profileAuthIcon');

  if (user && (user.username || user.name)) {
    const displayName = user.username || user.name || 'Pengguna';
    const initials = displayName
      .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    // Tombol navbar kecil
    if (btnName) btnName.textContent = displayName;
    if (btnAvatar) btnAvatar.innerHTML = `<span style="font-size:12px;font-weight:700;color:#3D2314">${initials}</span>`;

    // Header dropdown
    if (ddName) ddName.textContent = displayName;
    if (ddEmail) ddEmail.textContent = user.email || 'Email belum diatur';
    if (ddAvatar) ddAvatar.innerHTML = `<span style="font-size:15px;font-weight:700">${initials}</span>`;

    // Tombol auth → Keluar
    if (authLabel) authLabel.textContent = 'Keluar';
    if (authIcon) authIcon.innerHTML = `
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>`;
    if (authBtn) authBtn.style.color = '#c0392b';

  } else {
    // Belum login
    const iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D2314" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
    if (btnName) btnName.textContent = 'Akun';
    if (btnAvatar) btnAvatar.innerHTML = iconSvg;
    if (ddName) ddName.textContent = 'Tamu';
    if (ddEmail) ddEmail.textContent = 'Belum login';
    if (ddAvatar) ddAvatar.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;

    // Tombol auth → Masuk
    if (authLabel) authLabel.textContent = 'Masuk';
    if (authIcon) authIcon.innerHTML = `
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
      <polyline points="10 17 15 12 10 7"/>
      <line x1="15" y1="12" x2="3" y2="12"/>`;
    if (authBtn) authBtn.style.color = '#3D2314';
  }
}

// Aksi tombol masuk/keluar di dropdown
window.handleProfileAuth = function () {
  closeProfileDropdown();
  if (isAuthenticated()) {
    logout();
  } else {
    showPage('masuk');
  }
};

// Navigasi dari dropdown
window.openProfilePage = function () {
  closeProfileDropdown();
  // Jika ada halaman profil, navigasi ke sana; fallback ke masuk
  if (document.getElementById('page-profil')) {
    showPage('profil');
  } else {
    alert('Halaman profil belum tersedia.');
  }
};

window.openRiwayatPage = function () {
  closeProfileDropdown();
  // Fallback — bisa diarahkan ke halaman riwayat donasi
  showPage('donasi');
};

window.openPengaturanPage = function () {
  closeProfileDropdown();
  alert('Fitur pengaturan segera hadir!');
};

// Tutup dropdown saat klik di luar
document.addEventListener('click', function (e) {
  const wrap = document.getElementById('navProfileWrap');
  if (wrap && !wrap.contains(e.target)) {
    closeProfileDropdown();
  }
});

// Sinkron saat user state berubah (misalnya setelah login/logout)
window.toggleProfileDropdown = toggleProfileDropdown;

/* ═══════════════════════════════════════════════════════════════
   8. UPDATE USER DISPLAY — Ekspor fungsi agar bisa dipanggil dari luar
═══════════════════════════════════════════════════════════════ */
// Pastikan fungsi update user display bisa dipanggil dari file lain
window._updateUserDisplay = _updateUserDisplay;
window._syncProfileDropdown = _syncProfileDropdown;

/* ═══════════════════════════════════════════════════════════════
   9. FORCE UPDATE - Untuk memaksa pembaruan tampilan user
═══════════════════════════════════════════════════════════════ */

// Fungsi untuk memaksa pembaruan tampilan user dari localStorage
function forceUpdateUserDisplay() {
  console.log('Force update user display...');
  const user = getCurrentUser();
  console.log('Current user:', user);

  if (user && (user.username || user.name)) {
    const displayName = user.username || user.name || 'Pengguna';
    // GUNAKAN EMAIL DARI USER, BUKAN DEFAULT
    const email = user.email || 'Email belum diatur';
    const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    console.log('Menampilkan email:', email);

    // Update semua elemen yang menampilkan nama user
    const nameElements = document.querySelectorAll('.nav-profile-name, #navProfileName, #profileDdName, #profilHeroName');
    const emailElements = document.querySelectorAll('#profileDdEmail, #profilHeroEmail');

    nameElements.forEach(el => {
      if (el) {
        el.textContent = displayName;
        console.log('Updated name element:', el.id, 'to', displayName);
      }
    });

    emailElements.forEach(el => {
      if (el) {
        el.textContent = email;
        console.log('Updated email element:', el.id, 'to', email);
      }
    });

    // Update avatar
    const avatarEls = document.querySelectorAll('#navProfileAvatar, #profileDdAvatar');
    avatarEls.forEach(el => {
      if (el) {
        el.innerHTML = `<span style="font-size:12px;font-weight:700;color:#3D2314">${initials}</span>`;
      }
    });

    // Update tombol auth menjadi Keluar
    const authLabel = document.getElementById('profileAuthLabel');
    const authIcon = document.getElementById('profileAuthIcon');
    const authBtn = document.getElementById('profileAuthBtn');
    if (authLabel) authLabel.textContent = 'Keluar';
    if (authIcon) {
      authIcon.innerHTML = `
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>`;
    }
    if (authBtn) authBtn.style.color = '#c0392b';

    // Update hero profil jika ada
    const heroName = document.getElementById('profilHeroName');
    const heroEmail = document.getElementById('profilHeroEmail');
    const profilInitials = document.getElementById('profilInitials');
    if (heroName) heroName.textContent = displayName;
    if (heroEmail) heroEmail.textContent = email;
    if (profilInitials) profilInitials.textContent = initials;

    console.log('User display updated successfully!');

  } else {
    console.log('No user found, resetting to guest');
    // Reset ke Tamu
    const nameElements = document.querySelectorAll('.nav-profile-name, #navProfileName, #profileDdName, #profilHeroName');
    const emailElements = document.querySelectorAll('#profileDdEmail, #profilHeroEmail');

    nameElements.forEach(el => {
      if (el) el.textContent = 'Akun';
    });
    emailElements.forEach(el => {
      if (el) el.textContent = 'Belum login';
    });

    const avatarEls = document.querySelectorAll('#navProfileAvatar, #profileDdAvatar');
    avatarEls.forEach(el => {
      if (el) {
        el.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D2314" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
      }
    });
  }
}

// Ekspor fungsi force update
window.forceUpdateUserDisplay = forceUpdateUserDisplay;