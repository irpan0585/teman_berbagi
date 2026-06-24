/**
 * pages/admin/verifikasi.js
 * ─────────────────────────────────────────────────────────────
 * HALAMAN: Verifikasi Donasi
 * Tabel donasi masuk + filter status, modal bukti transfer,
 * serta aksi verifikasi/tolak. Donasi yang diverifikasi disinkronkan
 * ke data publik (donasiData) agar progress di halaman donasi ikut naik.
 *
 * Didaftarkan ke: Admin.pages.verifikasi
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  const Admin = (window.Admin = window.Admin || {});
  Admin.pages = Admin.pages || {};

  Admin.pages.verifikasi = function () {
    const { rpFull, formatDate, badgeHtml, avatarColor } = Admin.utils;
    const { donasiMasuk, filterStatus } = Admin.state;
    const filtered = filterStatus === 'semua' ? donasiMasuk : donasiMasuk.filter(d => d.status === filterStatus);

    return `
      <div class="admin-section-header">
        <div class="admin-section-title">Verifikasi Donasi</div>
        <div class="admin-section-sub">Periksa dan konfirmasi bukti pembayaran dari para donatur</div>
      </div>

      <div class="admin-table-card">
        <div class="admin-table-header">
          <div class="admin-table-header-title">Daftar Transaksi (${filtered.length})</div>
          <div class="admin-filter-row">
            <button class="admin-filter-btn ${filterStatus === 'semua' ? 'active' : ''}" onclick="setFilterStatus('semua')">Semua</button>
            <button class="admin-filter-btn ${filterStatus === 'pending' ? 'active' : ''}" onclick="setFilterStatus('pending')">Menunggu</button>
            <button class="admin-filter-btn ${filterStatus === 'verified' ? 'active' : ''}" onclick="setFilterStatus('verified')">Terverifikasi</button>
            <button class="admin-filter-btn ${filterStatus === 'rejected' ? 'active' : ''}" onclick="setFilterStatus('rejected')">Ditolak</button>
          </div>
        </div>
        <div style="overflow-x:auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Donatur</th>
                <th>Program</th>
                <th>Jumlah</th>
                <th>Metode</th>
                <th>Tanggal</th>
                <th>Bukti</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="verifikasiTableBody">
              ${filtered.map(d => `
                <tr id="row-${d.id}">
                  <td>
                    <div class="admin-donor-cell">
                      <div class="admin-donor-avatar" style="background:${avatarColor(d.nama)}">${d.nama.charAt(0)}</div>
                      <div>
                        <div class="admin-donor-name">${d.nama}</div>
                        <div class="admin-donor-email">${d.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${d.program}">${d.program.substring(0, 32)}...</td>
                  <td style="font-weight:600;color:#4a7a35;">${rpFull(d.jumlah)}</td>
                  <td style="font-size:13px;color:#666;">${d.metode}</td>
                  <td style="font-size:13px;color:#888;">${formatDate(d.tanggal)}</td>
                  <td>
                    ${d.bukti
                      ? `<button class="admin-btn-detail" onclick="openBuktiModal('${d.id}')">Lihat Bukti</button>`
                      : `<span style="color:#c0392b;font-weight:600;font-size:13px;">✗ Tidak Ada</span>`}
                  </td>
                  <td>${badgeHtml(d.status)}</td>
                  <td>
                    <div class="admin-action-btns">
                      ${d.status === 'pending' ? `
                        <button class="admin-btn-verify" onclick="verifyDonasi('${d.id}')">Verifikasi</button>
                        <button class="admin-btn-reject" onclick="rejectDonasi('${d.id}')">Tolak</button>
                      ` : `<button class="admin-btn-detail" onclick="showDonasiDetail('${d.id}')">Detail</button>`}
                    </div>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
          ${filtered.length === 0 ? `<div style="padding:40px;text-align:center;color:#bbb;font-size:14px;">Tidak ada data untuk filter ini</div>` : ''}
        </div>
      </div>
    `;
  };

  /** Render ulang konten halaman verifikasi */
  function _refreshVerifikasi() {
    const c = document.getElementById('adminContent');
    if (c) c.innerHTML = Admin.pages.verifikasi();
  }

  /* ── Aksi (global) ───────────────────────────────────────── */
  window.setFilterStatus = function (st) {
    Admin.state.filterStatus = st;
    _refreshVerifikasi();
  };

  window.verifyDonasi = async function (id) {
    const { toast } = Admin.utils;
    const d = Admin.state.donasiMasuk.find(x => x.id === id);
    if (!d) return;

    // Verifikasi via backend bila id berasal dari database (angka atau ObjectId 24-hex)
    const isDbId = /^\d+$/.test(String(id)) || /^[a-f0-9]{24}$/i.test(String(id));
    try {
      if (typeof window.adminAPI !== 'undefined' && isDbId) {
        const { response, data } = await window.adminAPI.verifyTransaksi(id);
        if (!response.ok || !data.success) {
          toast(data.message || 'Gagal verifikasi di server', 'error');
          return;
        }
      }
    } catch (err) {
      console.warn('Sinkronisasi verifikasi ke backend gagal.', err.message);
    }

    d.status = 'verified';
    _syncVerifiedToPublic(d);
    // Muat ulang data donasi publik dari server agar progress & dermawan ikut terbarui
    if (typeof window.loadDonasiFromAPI === 'function') window.loadDonasiFromAPI();
    // bila sedang di halaman verifikasi, perbarui tabelnya
    if (Admin.state.adminMenu === 'verifikasi') _refreshVerifikasi();
    toast(`Donasi dari ${d.nama} berhasil diverifikasi ✓`);
  };

  window.rejectDonasi = async function (id) {
    const { toast } = Admin.utils;
    const d = Admin.state.donasiMasuk.find(x => x.id === id);
    if (!d) return;

    const isDbId = /^\d+$/.test(String(id)) || /^[a-f0-9]{24}$/i.test(String(id));
    try {
      if (typeof window.adminAPI !== 'undefined' && isDbId) {
        const { response, data } = await window.adminAPI.rejectTransaksi(id);
        if (!response.ok || !data.success) {
          toast(data.message || 'Gagal menolak di server', 'error');
          return;
        }
      }
    } catch (err) {
      console.warn('Sinkronisasi penolakan ke backend gagal.', err.message);
    }

    d.status = 'rejected';
    if (Admin.state.adminMenu === 'verifikasi') _refreshVerifikasi();
    toast(`Donasi dari ${d.nama} ditolak`, 'error');
  };

  window.showDonasiDetail = function (id) {
    const { toast, rpFull } = Admin.utils;
    const d = Admin.state.donasiMasuk.find(x => x.id === id);
    if (!d) return;
    toast(`Detail: ${d.nama} — ${rpFull(d.jumlah)} — ${d.status}`);
  };

  /* ── Modal bukti transfer ────────────────────────────────── */
  window.openBuktiModal = function (id) {
    const { rpFull, formatDate, badgeHtml } = Admin.utils;
    const d = Admin.state.donasiMasuk.find(x => x.id === id);
    if (!d) return;
    const foto = Admin.state.buktiFotoMock[id] || null;
    document.getElementById('buktiModal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'buktiModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);';
    modal.innerHTML = `
      <div style="background:#fff;border-radius:16px;max-width:460px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,0.25);">
        <div style="padding:20px 24px 16px;border-bottom:1px solid #f0ece5;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-size:16px;font-weight:700;color:#1a1a1a;">Bukti Transfer</div>
            <div style="font-size:12px;color:#999;margin-top:2px;">${d.nama} · ${formatDate(d.tanggal)}</div>
          </div>
          <button onclick="document.getElementById('buktiModal').remove()" style="width:32px;height:32px;border-radius:8px;border:1.5px solid #e0dbd3;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#888;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style="padding:20px 24px;">
          ${foto ? `
          <div style="background:#f8f5f0;border-radius:12px;overflow:hidden;margin-bottom:20px;border:1px solid #e8e4de;">
            <img src="${foto}" alt="bukti transfer" style="width:100%;display:block;max-height:280px;object-fit:cover;">
          </div>` : `
          <div style="background:#fdecea;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;color:#c0392b;font-size:13px;font-weight:500;">
            ⚠ Donatur tidak melampirkan foto bukti transfer
          </div>`}
          <div style="background:#f8f5f0;border-radius:12px;padding:16px 18px;margin-bottom:20px;">
            ${[['Nama', d.nama], ['Email', d.email], ['Program', d.program.substring(0, 38) + '...'], ['Nominal', `<strong style="color:#4a7a35">${rpFull(d.jumlah)}</strong>`], ['Metode', d.metode], ['Tanggal', formatDate(d.tanggal)], ['Status', badgeHtml(d.status)]].map(([k, v]) => `
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0ece5;align-items:center;">
                <span style="font-size:13px;color:#888;min-width:90px;">${k}</span>
                <span style="font-size:13px;color:#222;text-align:right;">${v}</span>
              </div>`).join('')}
          </div>
          <div style="display:flex;gap:10px;">
            ${d.status === 'pending' ? `
            <button onclick="verifyDonasi('${d.id}');document.getElementById('buktiModal').remove()" class="admin-btn-verify" style="flex:1;padding:13px;font-size:14px;font-weight:700;border-radius:10px;">✓ Verifikasi</button>
            <button onclick="rejectDonasi('${d.id}');document.getElementById('buktiModal').remove()" class="admin-btn-reject" style="flex:1;padding:13px;font-size:14px;font-weight:600;border-radius:10px;">✗ Tolak</button>` :
            `<div style="flex:1;padding:13px;text-align:center;font-size:14px;color:#888;background:#f5f2ee;border-radius:10px;">${d.status === 'verified' ? '✓ Sudah Diverifikasi' : '✗ Sudah Ditolak'}</div>`}
          </div>
        </div>
      </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  };

  /* ── Sinkronisasi donasi terverifikasi ke data publik ────── */
  function _syncVerifiedToPublic(d) {
    if (typeof donasiData === 'undefined') return;
    const match = donasiData.find(x => x.title.toLowerCase().includes(d.program.substring(0, 20).toLowerCase()));
    if (!match) return;
    match.jumlah = (match.jumlah || 0) + d.jumlah;
    // segarkan grid donasi bila sedang tampil
    const grid = document.getElementById('donasiGrid');
    if (grid && grid.children.length > 0) {
      grid.innerHTML = '';
      donasiData.forEach((item, idx) => {
        const pct = Math.round((item.jumlah / item.target) * 100);
        const card = document.createElement('div');
        card.className = 'donasi-card';
        card.style.animationDelay = `${idx * 0.07}s`;
        card.innerHTML = `
          <img class="donasi-card-img" src="${item.img}" alt="${item.title}" loading="lazy">
          <div class="donasi-card-body">
            <div class="donasi-card-top">
              <div class="donasi-card-title">${item.title}</div>
              <div class="donasi-card-hari"><span>Hari</span><b>${item.hari}</b></div>
            </div>
            <div class="donasi-card-divider"></div>
            <div class="donasi-progress-label">Donasi saat ini</div>
            <div class="donasi-progress-track"><div class="donasi-progress-fill" style="width:${pct}%"></div></div>
            <div class="donasi-amount-row">
              <div class="amt-col"><div class="amt-label">Jumlah</div><div class="amt-val">${'Rp ' + Number(item.jumlah).toLocaleString('id-ID') + '.00'}</div></div>
              <div class="amt-col right"><div class="amt-label">Target</div><div class="amt-val">${'Rp ' + Number(item.target).toLocaleString('id-ID') + '.00'}</div></div>
            </div>
          </div>`;
        card.addEventListener('click', () => { window.selectedDonasi = item; showPage('detail-donasi'); });
        grid.appendChild(card);
      });
    }
  }
})();
