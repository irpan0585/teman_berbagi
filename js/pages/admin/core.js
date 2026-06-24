/**
 * pages/admin/core.js
 * ─────────────────────────────────────────────────────────────
 * INTI ADMIN PANEL (shared core)
 *
 * Berisi fondasi yang dipakai bersama oleh seluruh halaman admin:
 *   • Namespace global  → window.Admin
 *   • State bersama     → Admin.state (data donasi, daftar fanplate, dll.)
 *   • Helper bersama    → Admin.utils (format rupiah, tanggal, toast, dll.)
 *   • Kerangka (shell)  → sidebar + topbar + kontainer konten
 *   • Navigasi konsisten→ switchAdminMenu / toggle sidebar
 *
 * Setiap halaman admin berada di file terpisah dan mendaftarkan
 * fungsi render-nya ke Admin.pages.* :
 *   - home.js            → Admin.pages.home
 *   - buat-fanplate.js   → Admin.pages.buatFanplate
 *   - kelola-fanplate.js → Admin.pages.kelolaFanplate + Admin.pages.fanplateDetail
 *   - verifikasi.js      → Admin.pages.verifikasi
 *
 * Urutan pemuatan: core.js HARUS dimuat lebih dulu agar namespace
 * tersedia sebelum file halaman menambahkan fungsinya.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  const Admin = (window.Admin = window.Admin || {});
  Admin.pages = Admin.pages || {};

  /* ────────────────────────────────────────────────────────────
     STATE BERSAMA
  ──────────────────────────────────────────────────────────── */
  Admin.state = {
    /* menu aktif: home | buat-fanplate | kelola-fanplate | kelola-detail | verifikasi */
    adminMenu: 'home',

    /* filter pada halaman Verifikasi */
    filterStatus: 'semua',

    /* state tampilan detail fanplate */
    fanplateDetailId: null,
    fanplateDetailTab: 'perkembangan',

    /* dokumentasi/pembaruan per fanplate { [fpId]: [ {judul, isi, img, tanggal} ] } */
    fanplateDokumentasi: {},

    /* DATA MOCK — donasi masuk (menunggu verifikasi) */
    donasiMasuk: [
      { id: 'd001', nama: 'Ahmad Fauzi', email: 'ahmad.fauzi@gmail.com', program: 'Mari membantu keluarga di Sumatra', jumlah: 150000, tanggal: '2026-06-01', metode: 'Transfer BCA', bukti: true, status: 'pending' },
      { id: 'd002', nama: 'Siti Rahma', email: 'siti.r@gmail.com', program: 'Bantu ibadah dengan hikmat', jumlah: 75000, tanggal: '2026-06-01', metode: 'Transfer BRI', bukti: true, status: 'pending' },
      { id: 'd003', nama: 'Budi Santoso', email: 'budisan@yahoo.com', program: 'Pengadaan ambulance warga pelosok', jumlah: 500000, tanggal: '2026-05-31', metode: 'Transfer Mandiri', bukti: true, status: 'verified' },
      { id: 'd004', nama: 'Dewi Lestari', email: 'dewi.l@hotmail.com', program: 'Saat ini Ibu suri stadium 3', jumlah: 200000, tanggal: '2026-05-31', metode: 'Transfer BCA', bukti: false, status: 'pending' },
      { id: 'd005', nama: 'Rizky Pratama', email: 'rizky.p@gmail.com', program: 'Mari membantu keluarga di Sumatra', jumlah: 100000, tanggal: '2026-05-30', metode: 'Transfer BNI', bukti: true, status: 'rejected' },
      { id: 'd006', nama: 'Nur Hidayah', email: 'nur.h@gmail.com', program: 'Pengadaan ambulance warga pelosok', jumlah: 250000, tanggal: '2026-05-30', metode: 'Transfer BRI', bukti: true, status: 'pending' },
      { id: 'd007', nama: 'Hasan Basri', email: 'hasan.b@gmail.com', program: 'Bantu ibadah dengan hikmat', jumlah: 50000, tanggal: '2026-05-29', metode: 'Transfer Mandiri', bukti: true, status: 'verified' },
    ],

    /* DATA — daftar fanplate yang telah dibuat */
    fanplateList: [
      {
        id: 'fp001',
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
        judul: 'Mari membantu keluarga kita yang berada di sumatra',
        deskripsi: 'Dengan berbagi, kita bisa membantu mereka yang membutuhkan mulai dari memenuhi kebutuhan pangan, membantu......',
        target: 500000,
        deadline: '2026-12-04',
        fitur: 'donasi',
        verified: true,
      },
      {
        id: 'fp002',
        img: 'https://images.unsplash.com/photo-1609234334335-5f6d3a5b3d9a?w=600&q=80',
        judul: 'Bantu mereka agar dapat melaksanakan ibadah dengan hikmat',
        deskripsi: 'Dengan berbagi, kita bisa membantu mereka yang membutuhkan mulai dari memenuhi kebutuhan pangan, membantu......',
        target: 200000,
        deadline: '2026-12-04',
        fitur: 'donasi',
        verified: true,
      },
      {
        id: 'fp003',
        img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
        judul: 'Mari sempurnakan Ramadan dengan membayar Zakat Fitrah',
        deskripsi: 'Dengan berbagi, kita bisa membantu mereka yang membutuhkan mulai dari memenuhi kebutuhan pangan, membantu......',
        target: null,
        deadline: null,
        fitur: 'kewajiban',
        verified: false,
      },
    ],

    /* foto bukti transfer (mock) per id donasi */
    buktiFotoMock: {
      'd001': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80',
      'd002': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80',
      'd003': 'https://images.unsplash.com/photo-1616091093239-a21c2b56f24b?w=400&q=80',
      'd006': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=80',
      'd007': 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400&q=80',
    },
  };

  /* ────────────────────────────────────────────────────────────
     HELPER BERSAMA  → Admin.utils
  ──────────────────────────────────────────────────────────── */
  const _COLORS = ['#4a7a35', '#b8956a', '#3D2314', '#4a79c4', '#9b59b6', '#16a085', '#e67e22'];

  Admin.utils = {
    /** Rupiah ringkas (mis. Rp 1.5Jt / Rp 500Rb) */
    rp(n) {
      if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1) + 'Jt';
      if (n >= 1000) return 'Rp ' + (n / 1000).toFixed(0) + 'Rb';
      return 'Rp ' + n;
    },
    /** Rupiah penuh (mis. Rp 150.000.00) */
    rpFull(n) {
      return 'Rp ' + Number(n).toLocaleString('id-ID') + '.00';
    },
    formatDate(str) {
      if (!str) return '—';
      const d = new Date(str);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    },
    daysLeft(deadline) {
      if (!deadline) return null;
      const diff = new Date(deadline) - new Date();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    },
    badgeHtml(status) {
      const map = { pending: '⏳ Menunggu', verified: '✓ Terverifikasi', rejected: '✗ Ditolak' };
      return `<span class="admin-badge ${status}">${map[status] || status}</span>`;
    },
    avatarColor(name) {
      let h = 0;
      for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
      return _COLORS[Math.abs(h) % _COLORS.length];
    },
    toast(msg, type = 'success') {
      const t = document.createElement('div');
      t.className = `admin-toast ${type}`;
      t.innerHTML = `<span>${type === 'success' ? '✓' : '✗'}</span> ${msg}`;
      document.body.appendChild(t);
      setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateX(40px)';
        t.style.transition = 'all 0.3s';
        setTimeout(() => t.remove(), 300);
      }, 3000);
    },
  };

  /* ────────────────────────────────────────────────────────────
     KERANGKA (SHELL) — sidebar + topbar + konten
  ──────────────────────────────────────────────────────────── */
  function menuTitle() {
    const titles = {
      home: 'Dashboard',
      'buat-fanplate': 'Buat Fanplate',
      'kelola-fanplate': 'Kelola Fanplate',
      'kelola-detail': 'Detail Fanplate',
      verifikasi: 'Verifikasi Donasi',
    };
    return titles[Admin.state.adminMenu] || 'Admin';
  }

  /** Pilih fungsi render halaman berdasarkan menu aktif */
  function renderContent() {
    const m = Admin.state.adminMenu;
    const p = Admin.pages;
    if (m === 'home') return p.home ? p.home() : '';
    if (m === 'buat-fanplate') return p.buatFanplate ? p.buatFanplate() : '';
    if (m === 'kelola-fanplate') return p.kelolaFanplate ? p.kelolaFanplate() : '';
    if (m === 'kelola-detail') return p.fanplateDetail ? p.fanplateDetail() : '';
    if (m === 'verifikasi') return p.verifikasi ? p.verifikasi() : '';
    return '';
  }

  /** Item navigasi sidebar (dipakai untuk highlight aktif yang konsisten) */
  function navItemClass(...menus) {
    return menus.includes(Admin.state.adminMenu) ? 'active' : '';
  }

  /** Render seluruh kerangka admin ke #page-admin */
  Admin.render = function () {
    const el = document.getElementById('page-admin');
    if (!el) return;
    const pendingCount = Admin.state.donasiMasuk.filter(d => d.status === 'pending').length;

    el.innerHTML = `
      <button class="admin-hamburger" id="adminHamburger" onclick="toggleAdminSidebar()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <div class="admin-sidebar-overlay" id="adminOverlay" onclick="closeAdminSidebar()"></div>

      <div class="admin-root">
        <!-- SIDEBAR -->
        <aside class="admin-sidebar" id="adminSidebar">
          <div class="admin-sidebar-header">
            <div class="admin-sidebar-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="3" width="9" height="9" rx="2" fill="white" opacity="0.9"/>
                <rect x="13" y="3" width="9" height="9" rx="2" fill="white" opacity="0.9"/>
                <rect x="2" y="14" width="9" height="9" rx="2" fill="white" opacity="0.9"/>
                <rect x="13" y="14" width="9" height="9" rx="2" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <div class="admin-sidebar-brand">
              <span class="admin-sidebar-brand-name">Teman Berbagi</span>
              <span class="admin-sidebar-brand-tag">Admin Panel</span>
            </div>
          </div>

          <div class="admin-sidebar-label">Menu</div>

          <!-- Home -->
          <div class="admin-nav-item ${navItemClass('home')}" onclick="switchAdminMenu('home')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Home
          </div>

          <!-- Buat Fanplate -->
          <div class="admin-nav-item ${navItemClass('buat-fanplate')}" onclick="switchAdminMenu('buat-fanplate')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Buat Fanplate
          </div>

          <!-- Kelola Fanplate (aktif juga saat membuka detail) -->
          <div class="admin-nav-item ${navItemClass('kelola-fanplate', 'kelola-detail')}" onclick="switchAdminMenu('kelola-fanplate')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            Kelola Fanplate
            <span style="margin-left:auto;background:#ece5d8;color:#7a6b54;font-size:11px;font-weight:700;padding:1px 7px;border-radius:100px;">${Admin.state.fanplateList.length}</span>
          </div>

          <!-- Verifikasi Donasi -->
          <div class="admin-nav-item ${navItemClass('verifikasi')}" onclick="switchAdminMenu('verifikasi')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Verifikasi Donasi
            ${pendingCount > 0 ? `<span style="margin-left:auto;background:#e8a045;color:#fff;font-size:11px;font-weight:700;padding:1px 7px;border-radius:100px;">${pendingCount}</span>` : ''}
          </div>

          <div class="admin-sidebar-footer">
            <div class="admin-sidebar-back-btn" onclick="showPage('donasi')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
              </svg>
              Kembali ke Donasi
            </div>
          </div>
        </aside>

        <!-- MAIN -->
        <div class="admin-main">
          <div class="admin-topbar">
            <div class="admin-topbar-title" id="adminTopbarTitle">${menuTitle()}</div>
            <div class="admin-topbar-right">
              <span class="admin-topbar-badge">Admin</span>
            </div>
          </div>
          <div class="admin-content" id="adminContent">
            ${renderContent()}
          </div>
        </div>
      </div>
    `;
  };

  /* ────────────────────────────────────────────────────────────
     NAVIGASI KONSISTEN (global, dipakai oleh onclick di seluruh modul)
  ──────────────────────────────────────────────────────────── */
  window.switchAdminMenu = function (menu) {
    Admin.state.adminMenu = menu;
    Admin.render();
    // animasi masuk konten
    const c = document.getElementById('adminContent');
    if (c) {
      c.style.opacity = '0';
      requestAnimationFrame(() => {
        c.style.transition = 'opacity 0.25s ease';
        c.style.opacity = '1';
      });
    }
    window.closeAdminSidebar();
  };

  window.toggleAdminSidebar = function () {
    document.getElementById('adminSidebar')?.classList.toggle('open');
    document.getElementById('adminOverlay')?.classList.toggle('open');
  };

  window.closeAdminSidebar = function () {
    document.getElementById('adminSidebar')?.classList.remove('open');
    document.getElementById('adminOverlay')?.classList.remove('open');
  };

  /* ────────────────────────────────────────────────────────────
     MUAT DATA DARI BACKEND (REST API)
     Mengisi Admin.state dengan transaksi & program donasi nyata.
     Jika backend tidak tersedia, data mock tetap dipakai.
  ──────────────────────────────────────────────────────────── */
  Admin.loadFromAPI = async function () {
    if (typeof window.adminAPI === 'undefined') return;
    try {
      // Transaksi donasi masuk (semua transaksi — perlu token admin)
      const txRes = await window.adminAPI.getTransaksi();
      if (txRes.response.ok && txRes.data.success && Array.isArray(txRes.data.data)) {
        Admin.state.donasiMasuk = txRes.data.data.map(t => {
          const id = t._id || t.id;
          // Simpan foto bukti (jika ada) agar muncul di modal verifikasi
          if (t.bukti_foto) Admin.state.buktiFotoMock[id] = t.bukti_foto;
          return {
            id,
            nama: t.nama,
            email: t.email || '-',
            program: t.program,
            jumlah: Number(t.jumlah),
            tanggal: t.tanggal,
            metode: t.metode || 'Transfer',
            bukti: !!t.bukti,
            status: t.status,
          };
        });
        if (Admin.state.adminMenu === 'verifikasi' || Admin.state.adminMenu === 'home') {
          Admin.render();
        }
      }

      // Daftar program donasi (semua, termasuk draft)
      const dnRes = await window.adminAPI.getDonasi();
      if (dnRes.response.ok && dnRes.data.success && Array.isArray(dnRes.data.data) && dnRes.data.data.length > 0) {
        Admin.state.fanplateList = dnRes.data.data.map(d => ({
          id: d._id || d.id,
          img: d.img,
          judul: d.title,
          deskripsi: d.deskripsi || '',
          target: d.target,
          deadline: d.deadline,
          fitur: d.fitur,
          verified: d.verified,
        }));
        if (Admin.state.adminMenu === 'kelola-fanplate' || Admin.state.adminMenu === 'home') {
          Admin.render();
        }
      }
    } catch (err) {
      console.warn('Admin: backend tidak tersedia, memakai data mock.', err.message);
    }
  };

  /* ────────────────────────────────────────────────────────────
     INIT — render saat halaman admin pertama kali terlihat
  ──────────────────────────────────────────────────────────── */
  function init() {
    const el = document.getElementById('page-admin');
    if (!el) return;
    el.innerHTML = '';
    if (typeof _observePage === 'function') {
      _observePage('page-admin', () => {
        Admin.render();
        Admin.loadFromAPI();
      });
    } else {
      // fallback: observer langsung
      new MutationObserver(() => {
        if (el.classList.contains('visible') && !el.dataset.rendered) {
          el.dataset.rendered = '1';
          Admin.render();
          Admin.loadFromAPI();
        } else if (!el.classList.contains('visible')) {
          delete el.dataset.rendered;
        }
      }).observe(el, { attributes: true, attributeFilter: ['class'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
