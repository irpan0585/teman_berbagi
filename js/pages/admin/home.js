/**
 * pages/admin/home.js
 * ─────────────────────────────────────────────────────────────
 * HALAMAN: Home Admin (Dashboard)
 * Menampilkan ringkasan statistik, progress per program,
 * dan daftar donasi terbaru.
 *
 * Didaftarkan ke: Admin.pages.home
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  const Admin = (window.Admin = window.Admin || {});
  Admin.pages = Admin.pages || {};

  Admin.pages.home = function () {
    const { donasiMasuk, fanplateList } = Admin.state;
    const { rp, rpFull, badgeHtml, avatarColor } = Admin.utils;

    const totalDonasi = donasiMasuk.reduce((s, d) => (d.status === 'verified' ? s + d.jumlah : s), 0);
    const pending = donasiMasuk.filter(d => d.status === 'pending').length;
    const verified = donasiMasuk.filter(d => d.status === 'verified').length;
    const totalFanplate = fanplateList.length;

    return `
      <div class="admin-section-header">
        <div class="admin-section-title">Selamat Datang, Admin 👋</div>
        <div class="admin-section-sub">Berikut ringkasan aktivitas platform Teman Berbagi</div>
      </div>

      <div class="admin-stats-grid">
        <div class="admin-stat-card">
          <div class="admin-stat-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a7a35" stroke-width="2" stroke-linecap="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M21.2 8H12V2.8"/></svg>
          </div>
          <div class="admin-stat-value">${rp(totalDonasi)}</div>
          <div class="admin-stat-label">Total Donasi Terverifikasi</div>
          <div class="admin-stat-delta">↑ +12% bulan ini</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon brown">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b8956a" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="admin-stat-value">${donasiMasuk.length}</div>
          <div class="admin-stat-label">Total Transaksi Donasi</div>
          <div class="admin-stat-delta">↑ +5 hari ini</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a79c4" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
          </div>
          <div class="admin-stat-value">${totalFanplate}</div>
          <div class="admin-stat-label">Total Fanplate Dibuat</div>
          <div class="admin-stat-delta">↑ +1 minggu ini</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-icon red">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div class="admin-stat-value">${pending}</div>
          <div class="admin-stat-label">Menunggu Verifikasi</div>
          <div style="font-size:12px;color:#e8a045;font-weight:600;">⚠ Perlu perhatian</div>
        </div>
      </div>

      <div class="admin-dash-grid">
        <div class="admin-prog-chart">
          <div class="admin-prog-chart-title">Progress Donasi per Program</div>
          ${fanplateList.filter(f => f.target).map(f => {
            const collected = donasiMasuk
              .filter(d => d.program.toLowerCase().includes(f.judul.substring(0, 20).toLowerCase()) && d.status === 'verified')
              .reduce((s, d) => s + d.jumlah, 0);
            const pct = f.target ? Math.min(Math.round((collected / f.target) * 100), 100) : 0;
            return `
              <div class="admin-prog-item">
                <div class="admin-prog-label-row">
                  <div class="admin-prog-name">${f.judul.substring(0, 42)}${f.judul.length > 42 ? '...' : ''}</div>
                  <div class="admin-prog-pct">${pct}%</div>
                </div>
                <div class="admin-prog-track">
                  <div class="admin-prog-fill" style="width:${pct}%"></div>
                </div>
              </div>`;
          }).join('')}
          <div class="admin-prog-item" style="margin-top:8px">
            <div class="admin-prog-label-row">
              <div class="admin-prog-name">Rate Verifikasi</div>
              <div class="admin-prog-pct">${Math.round((verified / donasiMasuk.length) * 100)}%</div>
            </div>
            <div class="admin-prog-track">
              <div class="admin-prog-fill tan" style="width:${Math.round((verified / donasiMasuk.length) * 100)}%"></div>
            </div>
          </div>
        </div>

        <div class="admin-recent-card">
          <div class="admin-recent-card-header">
            Donasi Terbaru
            <a onclick="switchAdminMenu('verifikasi')">Lihat semua →</a>
          </div>
          ${donasiMasuk.slice(0, 5).map(d => `
            <div class="admin-recent-item">
              <div class="admin-recent-avatar" style="background:${avatarColor(d.nama)}">${d.nama.charAt(0).toUpperCase()}</div>
              <div class="admin-recent-info">
                <div class="admin-recent-name">${d.nama}</div>
                <div class="admin-recent-prog">${d.program.substring(0, 30)}...</div>
              </div>
              <div>
                <div class="admin-recent-amount">${rpFull(d.jumlah)}</div>
                <div style="text-align:right;margin-top:2px;">${badgeHtml(d.status)}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    `;
  };
})();
