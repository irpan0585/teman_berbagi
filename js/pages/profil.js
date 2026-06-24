/**
 * pages/profil.js
 * Halaman Profil Pengguna — menampilkan data user yang login
 */

document.addEventListener('DOMContentLoaded', () => {
  const pageProfil = document.getElementById('page-profil');
  if (!pageProfil) return;
  _renderProfil(pageProfil);

  // Muat riwayat asli dari database setiap kali halaman profil dibuka
  let _lastVisible = false;
  new MutationObserver(() => {
    const visible = pageProfil.classList.contains('visible');
    if (visible && !_lastVisible) {
      _lastVisible = true;
      _loadRiwayatFromAPI();
    } else if (!visible) {
      _lastVisible = false;
    }
  }).observe(pageProfil, { attributes: true, attributeFilter: ['class'] });

  // Coba juga sekali di awal (jika sudah login)
  setTimeout(_loadRiwayatFromAPI, 400);
});

/* ─────────────────────────────────────────────
   DATA RIWAYAT DONASI
   Diisi dari database (GET /api/transaksi) saat halaman profil dibuka.
   Data di bawah hanya contoh awal sebelum data asli termuat.
───────────────────────────────────────────── */
let _riwayatData = [
  { id: 'D-2024-001', judul: 'Mari membantu keluarga kita yang berada di Sumatra', tanggal: '15 Jan 2025', nominal: 100000, status: 'sukses', kategori: 'Donasi' },
  { id: 'D-2024-002', judul: 'Pengadaan mobile ambulance gratis bagi warga pelosok', tanggal: '28 Feb 2025', nominal: 250000, status: 'sukses', kategori: 'Donasi' },
  { id: 'K-2024-001', judul: 'Kewajiban Zakat Fitrah 1446 H', tanggal: '10 Mar 2025', nominal: 45000, status: 'sukses', kategori: 'Kewajiban' },
  { id: 'D-2024-003', judul: 'Bantu mereka agar dapat melaksanakan ibadah dengan hikmat', tanggal: '02 Apr 2025', nominal: 75000, status: 'pending', kategori: 'Donasi' },
  { id: 'P-2024-001', judul: 'Pilar Kebaikan — Program Pendidikan Anak', tanggal: '18 Apr 2025', nominal: 200000, status: 'sukses', kategori: 'Pilar' },
];

/** Ingat tab profil yang aktif agar tidak loncat saat data dimuat ulang */
let _activeProfilTab = 'info';

/** Ubah tanggal ISO/Date menjadi "15 Jan 2025" */
function _formatTanggalISO(value) {
  if (!value) return '-';
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const d = new Date(value);
  if (isNaN(d)) return String(value);
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

/** Petakan kategori transaksi backend ke label riwayat */
function _mapKategoriRiwayat(k) {
  const m = { donasi: 'Donasi', zakat: 'Kewajiban', persepuhan: 'Kewajiban', stipendium: 'Kewajiban', derma: 'Derma', pilar: 'Pilar' };
  return m[String(k || '').toLowerCase()] || 'Donasi';
}

/**
 * Muat riwayat donasi milik pengguna yang login dari database,
 * lalu render ulang halaman profil dengan data asli.
 */
async function _loadRiwayatFromAPI() {
  if (typeof window.transaksiAPI === 'undefined') return;
  const token = localStorage.getItem('tb_token');
  if (!token) return; // hanya untuk pengguna yang sudah login

  try {
    const { response, data } = await window.transaksiAPI.getAll();
    if (response.ok && data.success && Array.isArray(data.data)) {
      _riwayatData = data.data.map(t => ({
        id: '#' + String(t._id || t.id || '').slice(-6).toUpperCase(),
        judul: t.program || (t.donasi && t.donasi.title) || 'Donasi',
        tanggal: _formatTanggalISO(t.tanggal || t.createdAt),
        nominal: Number(t.jumlah) || 0,
        status: t.status === 'verified' ? 'sukses' : (t.status === 'rejected' ? 'rejected' : 'pending'),
        kategori: _mapKategoriRiwayat(t.kategori),
      }));
      const pageProfil = document.getElementById('page-profil');
      if (pageProfil) {
        _renderProfil(pageProfil);
        _profilTab(_activeProfilTab); // pulihkan tab aktif
      }
    }
  } catch (err) {
    console.warn('Gagal memuat riwayat donasi dari database:', err.message);
  }
}
window._loadRiwayatFromAPI = _loadRiwayatFromAPI;

const _badgeData = [
  { icon: '🌱', nama: 'Donatur Pertama', desc: 'Donasi pertama kali', unlocked: true },
  { icon: '💧', nama: 'Setetes Kebaikan', desc: 'Donasi 5x berturut-turut', unlocked: true },
  { icon: '🌟', nama: 'Bintang Kebaikan', desc: 'Total donasi ≥ Rp 500.000', unlocked: true },
  { icon: '🔥', nama: 'Streak Donatur', desc: '3 bulan berdonasi', unlocked: false },
  { icon: '🏆', nama: 'Dermawan Sejati', desc: 'Total donasi ≥ Rp 2.000.000', unlocked: false },
  { icon: '🕌', nama: 'Pejuang Kewajiban', desc: 'Tunaikan 3 kewajiban', unlocked: false },
];

/* ─────────────────────────────────────────────
   RENDER UTAMA
───────────────────────────────────────────── */
function _renderProfil(container) {
  // Ambil data user dari localStorage
  let user = null;
  try {
    const userStr = localStorage.getItem('tb_user');
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    console.warn('Gagal parse user data:', e);
  }

  // Jika user tidak ditemukan, buat data default
  if (!user || !user.username) {
    user = {
      username: 'Tamu',
      name: 'Tamu',
      email: 'tamu@example.com',
      telepon: '',
      tglLahir: '',
      alamat: ''
    };
  }

  const nama = user.username || user.name || 'Tamu';
  const email = user.email || 'tamu@example.com';
  const telepon = user.telepon || '';
  const tglLahir = user.tglLahir || '';
  const alamat = user.alamat || '';
  const totalDonasi = _riwayatData.filter(r => r.status === 'sukses').reduce((s, r) => s + r.nominal, 0);
  const jumlahDonasi = _riwayatData.filter(r => r.status === 'sukses').length;
  const initials = nama.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Simpan user ke global agar bisa diakses fungsi lain
  window._profilUser = user;

  container.innerHTML = `
  <div class="profil-page">

    <!-- ── HERO HEADER ── -->
    <div class="profil-hero">
      <div class="profil-hero-bg"></div>
      <div class="profil-hero-inner">

        <!-- Avatar -->
        <div class="profil-avatar-wrap">
          <div class="profil-avatar" id="profilAvatarDisplay">
            <span class="profil-avatar-initials" id="profilInitials">${initials}</span>
          </div>
          <button class="profil-avatar-edit-btn" onclick="_profilChangePhoto()" title="Ganti foto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
        </div>

        <!-- Info Singkat — NAMA & EMAIL DARI USER -->
        <div class="profil-hero-info">
          <h1 class="profil-hero-name" id="profilHeroName">${nama}</h1>
          <p class="profil-hero-email" id="profilHeroEmail">${email}</p>
          <div class="profil-hero-badges">
            <span class="profil-hero-badge">🌟 Donatur Aktif</span>
            <span class="profil-hero-badge">✅ Terverifikasi</span>
          </div>
        </div>

        <!-- Statistik singkat -->
        <div class="profil-hero-stats">
          <div class="profil-hero-stat">
            <span class="phs-val">${jumlahDonasi}</span>
            <span class="phs-lbl">Donasi</span>
          </div>
          <div class="profil-hero-stat-divider"></div>
          <div class="profil-hero-stat">
            <span class="phs-val">${_formatRupiah(totalDonasi)}</span>
            <span class="phs-lbl">Total Disalurkan</span>
          </div>
          <div class="profil-hero-stat-divider"></div>
          <div class="profil-hero-stat">
            <span class="phs-val">${_badgeData.filter(b => b.unlocked).length}</span>
            <span class="phs-lbl">Badge</span>
          </div>
        </div>
      </div>

      <!-- Tab navigasi -->
      <div class="profil-tabs">
        <button class="profil-tab active" id="ptabInfo"    onclick="_profilTab('info')">Informasi</button>
        <button class="profil-tab"        id="ptabRiwayat" onclick="_profilTab('riwayat')">Riwayat Donasi</button>
        <button class="profil-tab"        id="ptabBadge"   onclick="_profilTab('badge')">Badge & Pencapaian</button>
        <button class="profil-tab"        id="ptabAman"    onclick="_profilTab('aman')">Keamanan</button>
      </div>
    </div>

    <!-- ── KONTEN TAB ── -->
    <div class="profil-body">

      <!-- TAB: INFORMASI -->
      <div class="profil-panel active" id="ppanelInfo">
        <div class="profil-section-card">
          <div class="profil-card-header">
            <h2 class="profil-card-title">Data Diri</h2>
            <button class="profil-edit-btn" id="btnEditInfo" onclick="_profilToggleEdit()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profil
            </button>
          </div>

          <form class="profil-form" id="profilForm" onsubmit="_profilSave(event)">
            <div class="profil-form-grid">
              <div class="profil-field">
                <label class="profil-label">Nama Pengguna</label>
                <input class="profil-input" id="pfNama" type="text" value="${_escapeHtml(nama)}" disabled />
              </div>
              <div class="profil-field">
                <label class="profil-label">Email</label>
                <input class="profil-input" id="pfEmail" type="email" value="${_escapeHtml(email)}" disabled />
              </div>
              <div class="profil-field">
                <label class="profil-label">Nomor Telepon</label>
                <input class="profil-input" id="pfTelepon" type="tel" value="${_escapeHtml(telepon)}" placeholder="Belum diisi" disabled />
              </div>
              <div class="profil-field">
                <label class="profil-label">Tanggal Lahir</label>
                <input class="profil-input" id="pfTglLahir" type="date" value="${tglLahir}" disabled />
              </div>
              <div class="profil-field profil-field-full">
                <label class="profil-label">Alamat</label>
                <textarea class="profil-input profil-textarea" id="pfAlamat" rows="3" placeholder="Belum diisi" disabled>${_escapeHtml(alamat)}</textarea>
              </div>
            </div>

            <div class="profil-form-actions" id="profilFormActions" style="display:none">
              <button type="button" class="profil-btn-cancel" onclick="_profilCancelEdit()">Batal</button>
              <button type="submit" class="profil-btn-save">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>

        <!-- Preferensi Notifikasi -->
        <div class="profil-section-card" style="margin-top:20px">
          <div class="profil-card-header">
            <h2 class="profil-card-title">Preferensi Notifikasi</h2>
          </div>
          <div class="profil-toggle-list">
            ${_renderToggle('notifDonasi', true, 'Pembaruan Donasi', 'Notifikasi ketika ada update program yang Anda ikuti')}
            ${_renderToggle('notifKewajiban', true, 'Pengingat Kewajiban', 'Ingatkan saya menunaikan zakat & kewajiban lainnya')}
            ${_renderToggle('notifPromo', false, 'Promosi & Berita', 'Penawaran spesial dan informasi program terbaru')}
            ${_renderToggle('notifEmail', true, 'Notifikasi Email', 'Kirimkan ringkasan aktivitas ke email saya')}
          </div>
        </div>
      </div>

      <!-- TAB: RIWAYAT DONASI -->
      <div class="profil-panel" id="ppanelRiwayat">
        <div class="profil-section-card">
          <div class="profil-card-header">
            <h2 class="profil-card-title">Riwayat Donasi</h2>
            <div class="profil-riwayat-filter">
              <select class="profil-select" onchange="_profilFilterRiwayat(this.value)">
                <option value="semua">Semua Kategori</option>
                <option value="Donasi">Donasi</option>
                <option value="Kewajiban">Kewajiban</option>
                <option value="Pilar">Pilar Kebaikan</option>
              </select>
            </div>
          </div>

          <!-- Ringkasan -->
          <div class="profil-riwayat-summary">
            <div class="prs-card">
              <span class="prs-icon">💰</span>
              <span class="prs-val">${_formatRupiah(totalDonasi)}</span>
              <span class="prs-lbl">Total Disalurkan</span>
            </div>
            <div class="prs-card">
              <span class="prs-icon">📋</span>
              <span class="prs-val">${_riwayatData.length}</span>
              <span class="prs-lbl">Total Transaksi</span>
            </div>
            <div class="prs-card">
              <span class="prs-icon">✅</span>
              <span class="prs-val">${jumlahDonasi}</span>
              <span class="prs-lbl">Berhasil</span>
            </div>
          </div>

          <!-- Tabel Riwayat -->
          <div class="profil-riwayat-list" id="profilRiwayatList">
            ${_renderRiwayat(_riwayatData)}
          </div>
        </div>
      </div>

      <!-- TAB: BADGE -->
      <div class="profil-panel" id="ppanelBadge">
        <div class="profil-section-card">
          <div class="profil-card-header">
            <h2 class="profil-card-title">Badge & Pencapaian</h2>
            <span class="profil-badge-progress-label">${_badgeData.filter(b => b.unlocked).length}/${_badgeData.length} terbuka</span>
          </div>

          <!-- Progress bar -->
          <div class="profil-badge-overall-bar">
            <div class="profil-badge-overall-fill" style="width:${Math.round(_badgeData.filter(b => b.unlocked).length / _badgeData.length * 100)}%"></div>
          </div>

          <div class="profil-badge-grid">
            ${_badgeData.map(b => `
              <div class="profil-badge-card ${b.unlocked ? 'unlocked' : 'locked'}">
                <div class="profil-badge-icon">${b.icon}</div>
                <div class="profil-badge-info">
                  <span class="profil-badge-name">${b.nama}</span>
                  <span class="profil-badge-desc">${b.desc}</span>
                </div>
                <div class="profil-badge-status">
                  ${b.unlocked
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a8c30" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
    }
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- TAB: KEAMANAN -->
      <div class="profil-panel" id="ppanelAman">
        <div class="profil-section-card">
          <div class="profil-card-header">
            <h2 class="profil-card-title">Ubah Password</h2>
          </div>
          <form class="profil-form" onsubmit="_profilUbahPassword(event)">
            <div class="profil-form-grid">
              <div class="profil-field profil-field-full">
                <label class="profil-label">Password Saat Ini</label>
                <div class="profil-pw-wrap">
                  <input class="profil-input" id="pfPwLama" type="password" placeholder="Masukkan password lama" />
                  <button type="button" class="profil-pw-eye" onclick="_profilTogglePw('pfPwLama',this)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </div>
              <div class="profil-field">
                <label class="profil-label">Password Baru</label>
                <div class="profil-pw-wrap">
                  <input class="profil-input" id="pfPwBaru" type="password" placeholder="Minimal 8 karakter" oninput="_profilCheckPw(this.value)" />
                  <button type="button" class="profil-pw-eye" onclick="_profilTogglePw('pfPwBaru',this)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
                <div class="profil-pw-strength" id="pwStrengthWrap" style="display:none">
                  <div class="profil-pw-strength-bar"><div class="profil-pw-strength-fill" id="pwStrengthFill"></div></div>
                  <span class="profil-pw-strength-label" id="pwStrengthLabel"></span>
                </div>
              </div>
              <div class="profil-field">
                <label class="profil-label">Konfirmasi Password Baru</label>
                <div class="profil-pw-wrap">
                  <input class="profil-input" id="pfPwKonfirm" type="password" placeholder="Ulangi password baru" />
                  <button type="button" class="profil-pw-eye" onclick="_profilTogglePw('pfPwKonfirm',this)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="profil-form-actions" style="display:flex; margin-top:0">
              <button type="submit" class="profil-btn-save">Ubah Password</button>
            </div>
            <div class="profil-msg" id="pwMsg"></div>
          </form>
        </div>

        <!-- Sesi & Keamanan Akun -->
        <div class="profil-section-card" style="margin-top:20px">
          <div class="profil-card-header">
            <h2 class="profil-card-title">Keamanan Akun</h2>
          </div>
          <div class="profil-security-list">
            <div class="profil-security-item">
              <div class="profil-security-icon" style="background:#eef7eb">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a8c30" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div class="profil-security-text">
                <span class="pst-title">Verifikasi Email</span>
                <span class="pst-status ok">Terverifikasi</span>
              </div>
            </div>
            <div class="profil-security-item">
              <div class="profil-security-icon" style="background:#fff8e8">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e67e22" stroke-width="2" stroke-linecap="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
              </div>
              <div class="profil-security-text">
                <span class="pst-title">Autentikasi 2 Langkah</span>
                <span class="pst-status warn">Belum Aktif</span>
              </div>
              <button class="profil-security-action" onclick="_profilToast('Fitur 2FA segera hadir!')">Aktifkan</button>
            </div>
            <div class="profil-security-item">
              <div class="profil-security-icon" style="background:#f0f0f0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div class="profil-security-text">
                <span class="pst-title">Sesi Terakhir</span>
                <span class="pst-status" style="color:#888">Hari ini, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Zona Berbahaya -->
        <div class="profil-section-card profil-danger-zone" style="margin-top:20px">
          <div class="profil-card-header">
            <h2 class="profil-card-title" style="color:#c0392b">Zona Berbahaya</h2>
          </div>
          <p class="profil-danger-desc">Tindakan berikut tidak dapat dibatalkan. Harap berhati-hati.</p>
          <div class="profil-danger-actions">
            <button class="profil-danger-btn" onclick="_profilKeluar()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Keluar dari Akun
            </button>
            <button class="profil-danger-btn danger-delete" onclick="_profilHapusAkun()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              Hapus Akun
            </button>
          </div>
        </div>
      </div>

    </div><!-- /profil-body -->

    <!-- Toast notifikasi -->
    <div class="profil-toast" id="profilToast"></div>

  </div>`;

  // Pasang event listener toggle setelah render
  _initProfilToggles();
}

// Fungsi escape HTML untuk keamanan
function _escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ─────────────────────────────────────────────
   HELPERS RENDER
───────────────────────────────────────────── */
function _renderToggle(id, checked, title, desc) {
  return `
  <div class="profil-toggle-item">
    <div class="profil-toggle-text">
      <span class="profil-toggle-title">${title}</span>
      <span class="profil-toggle-desc">${desc}</span>
    </div>
    <label class="profil-toggle-switch">
      <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} onchange="_profilToggleSave('${id}',this.checked)">
      <span class="profil-toggle-slider"></span>
    </label>
  </div>`;
}

function _renderRiwayat(data) {
  if (!data.length) return `<div class="profil-riwayat-empty">Belum ada transaksi.</div>`;
  return data.map(r => `
  <div class="profil-riwayat-item">
    <div class="prw-left">
      <div class="prw-icon ${r.kategori.toLowerCase()}">${_kategoriIcon(r.kategori)}</div>
      <div class="prw-info">
        <span class="prw-judul">${r.judul}</span>
        <span class="prw-meta">${r.id} · ${r.tanggal}</span>
      </div>
    </div>
    <div class="prw-right">
      <span class="prw-nominal">-${_formatRupiah(r.nominal)}</span>
      <span class="prw-status ${r.status}">${r.status === 'sukses' ? 'Berhasil' : (r.status === 'rejected' ? 'Ditolak' : 'Menunggu')}</span>
    </div>
  </div>`).join('');
}

function _kategoriIcon(k) {
  const m = { Donasi: '💝', Kewajiban: '🕌', Pilar: '🌿', Derma: '🤲' };
  return m[k] || '📋';
}

function _formatRupiah(n) {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + ' Jt';
  if (n >= 1000) return 'Rp ' + (n / 1000).toFixed(0) + ' Rb';
  return 'Rp ' + n.toLocaleString('id-ID');
}

/* ─────────────────────────────────────────────
   LOGIKA TAB
───────────────────────────────────────────── */
window._profilTab = function (tab) {
  _activeProfilTab = tab;
  ['info', 'riwayat', 'badge', 'aman'].forEach(t => {
    document.getElementById(`ptab${_cap(t)}`)?.classList.toggle('active', t === tab);
    document.getElementById(`ppanel${_cap(t)}`)?.classList.toggle('active', t === tab);
  });
};
function _cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ─────────────────────────────────────────────
   EDIT PROFIL
───────────────────────────────────────────── */
let _editMode = false;

window._profilToggleEdit = function () {
  _editMode = !_editMode;
  ['pfNama', 'pfEmail', 'pfTelepon', 'pfTglLahir', 'pfAlamat'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = !_editMode;
  });
  const actions = document.getElementById('profilFormActions');
  if (actions) actions.style.display = _editMode ? 'flex' : 'none';
  const btn = document.getElementById('btnEditInfo');
  if (btn) btn.classList.toggle('active', _editMode);
};

window._profilCancelEdit = function () {
  _editMode = false;
  // Ambil data user terbaru dari localStorage
  let user = null;
  try {
    const userStr = localStorage.getItem('tb_user');
    if (userStr) user = JSON.parse(userStr);
  } catch (e) { }

  if (!user) {
    user = { username: 'Tamu', name: 'Tamu', email: 'tamu@example.com', telepon: '', tglLahir: '', alamat: '' };
  }

  document.getElementById('pfNama').value = user.username || user.name || 'Tamu';
  document.getElementById('pfEmail').value = user.email || 'tamu@example.com';
  document.getElementById('pfTelepon').value = user.telepon || '';
  document.getElementById('pfTglLahir').value = user.tglLahir || '';
  document.getElementById('pfAlamat').value = user.alamat || '';

  ['pfNama', 'pfEmail', 'pfTelepon', 'pfTglLahir', 'pfAlamat'].forEach(id => {
    const el = document.getElementById(id); if (el) el.disabled = true;
  });
  document.getElementById('profilFormActions').style.display = 'none';
  document.getElementById('btnEditInfo')?.classList.remove('active');
};

window._profilSave = function (e) {
  e.preventDefault();
  const nama = document.getElementById('pfNama')?.value.trim();
  const email = document.getElementById('pfEmail')?.value.trim();
  const telepon = document.getElementById('pfTelepon')?.value.trim();
  const tglLahir = document.getElementById('pfTglLahir')?.value;
  const alamat = document.getElementById('pfAlamat')?.value.trim();

  if (!nama || !email) {
    _profilToast('Nama dan Email wajib diisi!');
    return;
  }

  // Ambil user yang ada atau buat baru
  let user = null;
  try {
    const userStr = localStorage.getItem('tb_user');
    if (userStr) user = JSON.parse(userStr);
  } catch (e) { }

  if (!user) {
    user = { username: 'Tamu', name: 'Tamu', email: 'tamu@example.com' };
  }

  // Update data
  user.username = nama;
  user.name = nama;
  user.email = email;
  user.telepon = telepon || '';
  user.tglLahir = tglLahir || '';
  user.alamat = alamat || '';

  // Simpan ke localStorage (tb_user)
  localStorage.setItem('tb_user', JSON.stringify(user));

  // Update juga di daftar users
  try {
    const users = JSON.parse(localStorage.getItem('tb_users') || '[]');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...user };
      localStorage.setItem('tb_users', JSON.stringify(users));
    }
  } catch (e) { }

  // Perbarui tampilan hero
  document.getElementById('profilHeroName').textContent = nama;
  document.getElementById('profilHeroEmail').textContent = email;
  const initials = nama.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  document.getElementById('profilInitials').textContent = initials;

  // Update navbar
  if (typeof _updateUserDisplay === 'function') _updateUserDisplay();

  _profilCancelEdit();
  _profilToast('Profil berhasil disimpan ✅');
};

/* ─────────────────────────────────────────────
   FILTER RIWAYAT
───────────────────────────────────────────── */
window._profilFilterRiwayat = function (kategori) {
  const filtered = kategori === 'semua' ? _riwayatData
    : _riwayatData.filter(r => r.kategori === kategori);
  const el = document.getElementById('profilRiwayatList');
  if (el) el.innerHTML = _renderRiwayat(filtered);
};

/* ─────────────────────────────────────────────
   KEAMANAN — PASSWORD
───────────────────────────────────────────── */
window._profilTogglePw = function (inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  btn.innerHTML = show
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D2314" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
};

window._profilCheckPw = function (val) {
  const wrap = document.getElementById('pwStrengthWrap');
  const fill = document.getElementById('pwStrengthFill');
  const lbl = document.getElementById('pwStrengthLabel');
  if (!val) { if (wrap) wrap.style.display = 'none'; return; }
  if (wrap) wrap.style.display = 'flex';
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const map = [
    { pct: '25%', color: '#e74c3c', text: 'Lemah' },
    { pct: '50%', color: '#e67e22', text: 'Cukup' },
    { pct: '75%', color: '#f1c40f', text: 'Baik' },
    { pct: '100%', color: '#4a8c30', text: 'Kuat' },
  ];
  const s = map[score - 1] || map[0];
  if (fill) { fill.style.width = s.pct; fill.style.background = s.color; }
  if (lbl) { lbl.textContent = s.text; lbl.style.color = s.color; }
};

window._profilUbahPassword = function (e) {
  e.preventDefault();
  const lama = document.getElementById('pfPwLama')?.value;
  const baru = document.getElementById('pfPwBaru')?.value;
  const konfirm = document.getElementById('pfPwKonfirm')?.value;
  const msg = document.getElementById('pwMsg');

  if (!lama || !baru || !konfirm) {
    _showPwMsg(msg, 'Semua kolom wajib diisi.', 'error'); return;
  }
  if (baru.length < 8) {
    _showPwMsg(msg, 'Password baru minimal 8 karakter.', 'error'); return;
  }
  if (baru !== konfirm) {
    _showPwMsg(msg, 'Konfirmasi password tidak cocok.', 'error'); return;
  }

  // Ambil user saat ini
  let user = null;
  try {
    const userStr = localStorage.getItem('tb_user');
    if (userStr) user = JSON.parse(userStr);
  } catch (e) { }

  if (user && user.password !== lama) {
    _showPwMsg(msg, 'Password lama tidak cocok!', 'error');
    return;
  }

  // Update password
  if (user) {
    user.password = baru;
    localStorage.setItem('tb_user', JSON.stringify(user));

    // Update juga di daftar users
    try {
      const users = JSON.parse(localStorage.getItem('tb_users') || '[]');
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx].password = baru;
        localStorage.setItem('tb_users', JSON.stringify(users));
      }
    } catch (e) { }
  }

  _showPwMsg(msg, 'Password berhasil diubah! ✅', 'success');
  ['pfPwLama', 'pfPwBaru', 'pfPwKonfirm'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('pwStrengthWrap').style.display = 'none';
};

function _showPwMsg(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = 'profil-msg ' + type;
  setTimeout(() => { el.textContent = ''; el.className = 'profil-msg'; }, 4000);
}

/* ─────────────────────────────────────────────
   TOGGLE NOTIFIKASI
───────────────────────────────────────────── */
function _initProfilToggles() {
  const keys = ['notifDonasi', 'notifKewajiban', 'notifPromo', 'notifEmail'];
  keys.forEach(k => {
    const saved = localStorage.getItem('pref_' + k);
    const el = document.getElementById(k);
    if (el && saved !== null) el.checked = saved === 'true';
  });
}

window._profilToggleSave = function (key, val) {
  localStorage.setItem('pref_' + key, val);
  _profilToast((val ? '🔔 ' : '🔕 ') + 'Preferensi disimpan');
};

/* ─────────────────────────────────────────────
   GANTI FOTO (simulasi)
───────────────────────────────────────────── */
window._profilChangePhoto = function () {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = function () {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      const src = ev.target.result;
      const avatarEl = document.getElementById('profilAvatarDisplay');
      if (avatarEl) avatarEl.innerHTML = `<img src="${src}" alt="Foto Profil" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
      _profilToast('Foto profil diperbarui ✅');
    };
    reader.readAsDataURL(file);
  };
  input.click();
};

/* ─────────────────────────────────────────────
   KELUAR & HAPUS AKUN
───────────────────────────────────────────── */
window._profilKeluar = function () {
  if (confirm('Yakin ingin keluar dari akun?')) {
    if (typeof logout === 'function') logout();
    else { localStorage.removeItem('tb_token'); localStorage.removeItem('tb_user'); }
  }
};

window._profilHapusAkun = function () {
  if (confirm('⚠️ Hapus akun secara permanen? Semua data Anda akan terhapus dan tidak bisa dikembalikan.')) {
    _profilToast('Akun dihapus (simulasi)');
    setTimeout(() => {
      if (typeof showPage === 'function') showPage('daftar');
    }, 1500);
  }
};

/* ─────────────────────────────────────────────
   TOAST NOTIFIKASI
───────────────────────────────────────────── */
window._profilToast = function (msg) {
  const t = document.getElementById('profilToast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
};