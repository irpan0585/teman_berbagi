/**
 * pages/admin/kelola-fanplate.js
 * ─────────────────────────────────────────────────────────────
 * HALAMAN: Kelola Fanplate  (BARU)
 * Menampilkan SELURUH fanplate yang telah dibuat dengan:
 *   • Ringkasan jumlah (total / dipublikasikan / draft)
 *   • Filter status + pencarian judul
 *   • Aksi per item: Detail, Edit, Publikasikan, Hapus
 *
 * + Tampilan DETAIL FANPLATE (tab Perkembangan / Dokumentasi / Edit)
 *   yang dibuka dari halaman ini.
 *
 * Didaftarkan ke: Admin.pages.kelolaFanplate, Admin.pages.fanplateDetail
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  const Admin = (window.Admin = window.Admin || {});
  Admin.pages = Admin.pages || {};

  // state khusus halaman ini
  if (!('kelolaFilter' in Admin.state)) Admin.state.kelolaFilter = 'semua';
  if (!('kelolaSearch' in Admin.state)) Admin.state.kelolaSearch = '';

  /* ════════════════════════════════════════════════════════════
     HALAMAN KELOLA FANPLATE
  ════════════════════════════════════════════════════════════ */
  Admin.pages.kelolaFanplate = function () {
    const list = Admin.state.fanplateList;
    const total = list.length;
    const published = list.filter(f => f.verified).length;
    const draft = total - published;
    const filter = Admin.state.kelolaFilter;
    const search = Admin.state.kelolaSearch;

    return `
      <div class="admin-section-header">
        <div class="admin-section-title">Kelola Fanplate</div>
        <div class="admin-section-sub">Kelola seluruh program donasi yang telah dibuat — edit, publikasikan, atau hapus.</div>
      </div>

      <div class="fp-stat-grid" style="margin-bottom:22px;">
        <div class="fp-stat-card"><div class="fp-stat-label">Total Fanplate</div><div class="fp-stat-val">${total} program</div></div>
        <div class="fp-stat-card green"><div class="fp-stat-label">Dipublikasikan</div><div class="fp-stat-val">${published} program</div></div>
        <div class="fp-stat-card yellow"><div class="fp-stat-label">Masih Draft</div><div class="fp-stat-val">${draft} program</div></div>
      </div>

      <div class="admin-table-card">
        <div class="admin-table-header" style="flex-wrap:wrap;gap:12px;">
          <div class="admin-table-header-title">Daftar Fanplate</div>
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <div style="position:relative;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="2.4" stroke-linecap="round" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);pointer-events:none;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="kelolaSearchInput" class="admin-form-input" placeholder="Cari judul fanplate..."
                value="${(search || '').replace(/"/g, '&quot;')}"
                oninput="searchKelola(this.value)"
                style="width:220px;padding-left:34px;height:38px;font-size:13px;">
            </div>
            <div class="admin-filter-row">
              <button class="admin-filter-btn ${filter === 'semua' ? 'active' : ''}" onclick="setKelolaFilter('semua')">Semua</button>
              <button class="admin-filter-btn ${filter === 'published' ? 'active' : ''}" onclick="setKelolaFilter('published')">Dipublikasikan</button>
              <button class="admin-filter-btn ${filter === 'draft' ? 'active' : ''}" onclick="setKelolaFilter('draft')">Draft</button>
            </div>
          </div>
        </div>
        <div class="admin-fanplate-list" id="kelolaListEl">
          ${_renderKelolaList()}
        </div>
      </div>
    `;
  };

  /** Render hanya daftar item (dipakai untuk update parsial saat mengetik) */
  function _renderKelolaList() {
    const { rpFull, formatDate } = Admin.utils;
    let list = Admin.state.fanplateList.slice();

    // filter status
    if (Admin.state.kelolaFilter === 'published') list = list.filter(f => f.verified);
    if (Admin.state.kelolaFilter === 'draft') list = list.filter(f => !f.verified);

    // pencarian judul/deskripsi
    const q = (Admin.state.kelolaSearch || '').trim().toLowerCase();
    if (q) list = list.filter(f => f.judul.toLowerCase().includes(q) || (f.deskripsi || '').toLowerCase().includes(q));

    if (list.length === 0) {
      const msg = Admin.state.fanplateList.length === 0
        ? 'Belum ada fanplate dibuat.'
        : 'Tidak ada fanplate yang cocok dengan filter/pencarian.';
      return `<div style="padding:40px;text-align:center;color:#bbb;font-size:14px;">
        ${msg}
        <div style="margin-top:12px;"><button onclick="switchAdminMenu('buat-fanplate')" style="background:#c9a97e;color:#fff;border:none;padding:9px 18px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">+ Buat Fanplate Baru</button></div>
      </div>`;
    }

    return list.map(f => `
      <div class="admin-fanplate-item">
        <img class="admin-fanplate-thumb" src="${f.img}" alt="${f.judul}" onerror="this.style.background='#e0dbd3';this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\'/%3E'">
        <div class="admin-fanplate-info">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
            <div class="admin-fanplate-name" style="margin:0;">${f.judul}</div>
            <span style="font-size:11px;font-weight:700;padding:2px 9px;border-radius:100px;${f.verified ? 'background:#e7f1de;color:#4a7a35;' : 'background:#fdf2dd;color:#b07d2a;'}">${f.verified ? '✓ Dipublikasikan' : '⏸ Draft'}</span>
          </div>
          <div class="admin-fanplate-desc">${f.deskripsi}</div>
          <div class="admin-fanplate-meta">
            <div class="admin-fanplate-meta-item">
              <span class="admin-fanplate-meta-label">Target</span>
              <span class="admin-fanplate-meta-val">${f.target ? rpFull(f.target) : 'Rp —'}</span>
            </div>
            <div class="admin-fanplate-meta-item">
              <span class="admin-fanplate-meta-label">Jangka Waktu</span>
              <span class="admin-fanplate-meta-val date">${f.deadline ? formatDate(f.deadline) : '—'}</span>
            </div>
            <div class="admin-fanplate-meta-item">
              <span class="admin-fanplate-meta-label">Fitur</span>
              <span class="admin-fanplate-meta-val" style="color:#555;text-transform:capitalize;">${f.fitur}</span>
            </div>
          </div>
        </div>
        <div class="admin-fanplate-actions">
          ${!f.verified ? `<button class="admin-icon-btn" onclick="publishFanplate('${f.id}')" title="Publikasikan">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </button>` : ''}
          <button class="admin-icon-btn" onclick="openFanplateDetail('${f.id}')" title="Detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="admin-icon-btn" onclick="editFanplate('${f.id}')" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="admin-icon-btn danger" onclick="if(confirm('Hapus fanplate &quot;${f.judul.substring(0, 28).replace(/'/g, '')}...&quot;?')){deleteFanplateItem('${f.id}')}" title="Hapus">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </div>`).join('');
  }

  /** Refresh konten halaman kelola (mempertahankan filter & pencarian dari state) */
  function _refreshKelola() {
    const c = document.getElementById('adminContent');
    if (c && Admin.state.adminMenu === 'kelola-fanplate') c.innerHTML = Admin.pages.kelolaFanplate();
  }

  /* ── Aksi filter & pencarian ─────────────────────────────── */
  window.setKelolaFilter = function (f) {
    Admin.state.kelolaFilter = f;
    _refreshKelola();
  };

  window.searchKelola = function (val) {
    Admin.state.kelolaSearch = val;
    // update hanya daftar agar fokus input tidak hilang saat mengetik
    const listEl = document.getElementById('kelolaListEl');
    if (listEl) listEl.innerHTML = _renderKelolaList();
  };

  /* ── Aksi item: publish / hapus / edit ───────────────────── */
  window.publishFanplate = async function (id) {
    const { toast, daysLeft } = Admin.utils;
    const fp = Admin.state.fanplateList.find(f => f.id === id);
    if (!fp) return;

    // Persist ke backend bila id dari database
    try {
      if (typeof window.adminAPI !== 'undefined' && (/^\d+$/.test(String(id)) || /^[a-f0-9]{24}$/i.test(String(id)))) {
        await window.adminAPI.publishDonasi(id);
      }
    } catch (err) {
      console.warn('Publikasi ke backend gagal.', err.message);
    }

    fp.verified = true;
    if (fp.fitur === 'donasi' && typeof donasiData !== 'undefined') {
      const exists = donasiData.some(d => d.title === fp.judul);
      if (!exists) {
        donasiData.push({ id: donasiData.length + 200, img: fp.img, title: fp.judul, hari: fp.deadline ? (daysLeft(fp.deadline) || 30) : 30, jumlah: 0, target: fp.target || 500000 });
        const grid = document.getElementById('donasiGrid');
        if (grid) grid.innerHTML = '';
      }
    }
    toast(`Fanplate "${fp.judul.substring(0, 30)}..." dipublikasikan! 🚀`);
    if (Admin.state.adminMenu === 'kelola-fanplate') _refreshKelola();
  };

  window.deleteFanplateItem = async function (id) {
    const { toast } = Admin.utils;
    const idx = Admin.state.fanplateList.findIndex(f => f.id === id);
    if (idx === -1) return;
    const name = Admin.state.fanplateList[idx].judul;

    // Persist hapus ke backend bila id dari database
    try {
      if (typeof window.adminAPI !== 'undefined' && (/^\d+$/.test(String(id)) || /^[a-f0-9]{24}$/i.test(String(id)))) {
        await window.adminAPI.deleteDonasi(id);
      }
    } catch (err) {
      console.warn('Hapus di backend gagal.', err.message);
    }

    Admin.state.fanplateList.splice(idx, 1);
    toast(`Fanplate "${name.substring(0, 30)}..." dihapus`);
    // render ulang shell agar badge jumlah di sidebar ikut diperbarui
    if (Admin.state.adminMenu === 'kelola-fanplate') Admin.render();
  };

  /** Buka detail langsung pada tab Edit */
  window.editFanplate = function (id) {
    Admin.state.fanplateDetailId = id;
    Admin.state.fanplateDetailTab = 'edit';
    Admin.state.adminMenu = 'kelola-detail';
    Admin.render();
    window.closeAdminSidebar();
  };

  /* ════════════════════════════════════════════════════════════
     TAMPILAN DETAIL FANPLATE
  ════════════════════════════════════════════════════════════ */
  Admin.pages.fanplateDetail = function () {
    const { rpFull, formatDate, daysLeft } = Admin.utils;
    const { donasiMasuk } = Admin.state;
    const fp = Admin.state.fanplateList.find(f => f.id === Admin.state.fanplateDetailId);
    if (!fp) return `<div style="padding:60px;text-align:center;color:#999;">Fanplate tidak ditemukan. <a style="color:#c9a97e;cursor:pointer;" onclick="switchAdminMenu('kelola-fanplate')">Kembali ke Kelola Fanplate</a></div>`;

    const donasiTerkait = donasiMasuk.filter(d => d.program.toLowerCase().includes(fp.judul.substring(0, 20).toLowerCase()));
    const terkumpul = donasiTerkait.filter(d => d.status === 'verified').reduce((s, d) => s + d.jumlah, 0);
    const pct = fp.target ? Math.min(Math.round((terkumpul / fp.target) * 100), 100) : 0;
    const dl = daysLeft(fp.deadline);
    const tab = Admin.state.fanplateDetailTab;

    return `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;font-size:13px;color:#999;">
        <span style="cursor:pointer;color:#c9a97e;" onclick="switchAdminMenu('kelola-fanplate')">← Kelola Fanplate</span>
        <span style="color:#ccc;">/</span>
        <span style="color:#444;font-weight:600;">${fp.judul.substring(0, 45)}${fp.judul.length > 45 ? '...' : ''}</span>
      </div>

      <div class="fp-detail-hero">
        <div class="fp-detail-cover">
          <img src="${fp.img}" alt="${fp.judul}">
          <div class="fp-detail-cover-overlay">
            <span class="fp-detail-badge ${fp.verified ? 'verified' : 'draft'}">${fp.verified ? '✓ Dipublikasikan' : '⏸ Draft'}</span>
          </div>
        </div>
        <div class="fp-detail-hero-body">
          <div class="fp-detail-title">${fp.judul}</div>
          <div class="fp-detail-desc">${fp.deskripsi}</div>
          <div class="fp-detail-meta-row">
            <div class="fp-detail-meta-item"><div class="fp-detail-meta-label">Target</div><div class="fp-detail-meta-val">${fp.target ? rpFull(fp.target) : '—'}</div></div>
            <div class="fp-detail-meta-item"><div class="fp-detail-meta-label">Terkumpul</div><div class="fp-detail-meta-val" style="color:#4a7a35;">${rpFull(terkumpul)}</div></div>
            <div class="fp-detail-meta-item"><div class="fp-detail-meta-label">Deadline</div><div class="fp-detail-meta-val">${fp.deadline ? formatDate(fp.deadline) : '—'}</div></div>
            <div class="fp-detail-meta-item"><div class="fp-detail-meta-label">Sisa Hari</div><div class="fp-detail-meta-val" style="${dl !== null && dl <= 7 ? 'color:#c0392b;' : ''}">${dl !== null ? dl + ' hari' : '—'}</div></div>
            <div class="fp-detail-meta-item"><div class="fp-detail-meta-label">Kategori</div><div class="fp-detail-meta-val" style="text-transform:capitalize;">${fp.fitur}</div></div>
          </div>
          ${fp.target ? `
          <div style="margin-top:16px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;">
              <span style="color:#666;">Progress Penggalangan</span>
              <span style="font-weight:700;color:#4a7a35;">${pct}%</span>
            </div>
            <div class="admin-prog-track"><div class="admin-prog-fill" style="width:${pct}%"></div></div>
          </div>` : ''}
          <div class="fp-detail-actions">
            ${!fp.verified
              ? `<button class="fp-action-btn primary" onclick="publishFanplate('${fp.id}');openFanplateDetail('${fp.id}')">✓ Publikasikan</button>`
              : `<button class="fp-action-btn warn" onclick="unpublishFanplate('${fp.id}')">⏸ Arsipkan</button>`}
            <button class="fp-action-btn danger-outline" onclick="if(confirm('Hapus fanplate ini?')){deleteFanplateItem('${fp.id}');switchAdminMenu('kelola-fanplate');}">🗑 Hapus</button>
          </div>
        </div>
      </div>

      <div class="fp-detail-tabs">
        <button class="fp-detail-tab ${tab === 'perkembangan' ? 'active' : ''}" onclick="setFanplateDetailTab('perkembangan')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Perkembangan Donasi
        </button>
        <button class="fp-detail-tab ${tab === 'dokumentasi' ? 'active' : ''}" onclick="setFanplateDetailTab('dokumentasi')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Dokumentasi
        </button>
        <button class="fp-detail-tab ${tab === 'edit' ? 'active' : ''}" onclick="setFanplateDetailTab('edit')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit Fanplate
        </button>
      </div>

      <div id="fpDetailTabContent">
        ${tab === 'perkembangan' ? _renderFPTabPerkembangan(fp, donasiTerkait, terkumpul, pct) : ''}
        ${tab === 'dokumentasi' ? _renderFPTabDokumentasi(fp) : ''}
        ${tab === 'edit' ? _renderFPTabEdit(fp) : ''}
      </div>
    `;
  };

  function _renderFPTabPerkembangan(fp, donasiTerkait, terkumpul, pct) {
    const { rpFull, formatDate, badgeHtml, avatarColor } = Admin.utils;
    const verified = donasiTerkait.filter(d => d.status === 'verified');
    const pending = donasiTerkait.filter(d => d.status === 'pending');
    const rejected = donasiTerkait.filter(d => d.status === 'rejected');
    return `
      <div class="fp-stat-grid">
        <div class="fp-stat-card"><div class="fp-stat-label">Total Donatur</div><div class="fp-stat-val">${donasiTerkait.length} orang</div></div>
        <div class="fp-stat-card green"><div class="fp-stat-label">Dana Terverifikasi</div><div class="fp-stat-val">${rpFull(terkumpul)}</div></div>
        <div class="fp-stat-card yellow"><div class="fp-stat-label">Menunggu Verifikasi</div><div class="fp-stat-val">${pending.length} donasi</div></div>
        <div class="fp-stat-card red"><div class="fp-stat-label">Donasi Ditolak</div><div class="fp-stat-val">${rejected.length} donasi</div></div>
      </div>

      ${fp.target && verified.length > 0 ? `
      <div class="admin-form-card" style="margin-bottom:20px;">
        <div class="admin-form-card-header">📊 Grafik Donasi Terverifikasi</div>
        <div class="admin-form-card-body">
          <div style="display:flex;gap:12px;align-items:flex-end;height:110px;padding:0 4px;">
            ${verified.slice(-8).map(d => {
              const h = Math.max(8, Math.round((d.jumlah / fp.target) * 90));
              return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;">
                <div style="font-size:10px;color:#888;">${rpFull(d.jumlah).replace('Rp ', '')}</div>
                <div style="width:100%;background:linear-gradient(180deg,#6b9c4d,#89c25f);border-radius:4px 4px 0 0;height:${h}px;"></div>
                <div style="font-size:10px;color:#bbb;white-space:nowrap;overflow:hidden;max-width:40px;text-overflow:ellipsis;">${d.nama.split(' ')[0]}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>` : ''}

      <div class="admin-table-card">
        <div class="admin-table-header">
          <div class="admin-table-header-title">Riwayat Donasi (${donasiTerkait.length})</div>
          <button onclick="switchAdminMenu('verifikasi')" style="font-size:12px;color:#c9a97e;background:none;border:none;cursor:pointer;font-weight:600;">Ke Halaman Verifikasi →</button>
        </div>
        ${donasiTerkait.length === 0
          ? `<div style="padding:40px;text-align:center;color:#bbb;font-size:14px;">Belum ada donasi untuk program ini</div>`
          : `<div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Donatur</th><th>Jumlah</th><th>Metode</th><th>Tanggal</th><th>Bukti</th><th>Status</th><th>Aksi</th></tr></thead><tbody>
            ${donasiTerkait.map(d => `<tr>
              <td><div class="admin-donor-cell"><div class="admin-donor-avatar" style="background:${avatarColor(d.nama)}">${d.nama.charAt(0)}</div><div><div class="admin-donor-name">${d.nama}</div><div class="admin-donor-email">${d.email}</div></div></div></td>
              <td style="font-weight:700;color:#4a7a35;">${rpFull(d.jumlah)}</td>
              <td style="font-size:13px;color:#666;">${d.metode}</td>
              <td style="font-size:13px;color:#888;">${formatDate(d.tanggal)}</td>
              <td>${d.bukti ? `<button class="admin-btn-detail" onclick="openBuktiModal('${d.id}')">Lihat Bukti</button>` : '<span style="color:#c0392b;font-size:13px;">✗ Tidak</span>'}</td>
              <td>${badgeHtml(d.status)}</td>
              <td><div class="admin-action-btns">
                ${d.status === 'pending' ? `<button class="admin-btn-verify" onclick="verifyDonasi('${d.id}');openFanplateDetail('${fp.id}')">✓</button><button class="admin-btn-reject" onclick="rejectDonasi('${d.id}');openFanplateDetail('${fp.id}')">✗</button>` : `<button class="admin-btn-detail" onclick="openBuktiModal('${d.id}')">Detail</button>`}
              </div></td>
            </tr>`).join('')}
          </tbody></table></div>`}
      </div>
    `;
  }

  function _renderFPTabDokumentasi(fp) {
    return `
      <div class="fp-dok-grid">
        <div class="admin-form-card" style="margin-bottom:0;">
          <div class="admin-form-card-header">📝 Tambah Pembaruan Program</div>
          <div class="admin-form-card-body">
            <div class="admin-form-group">
              <label class="admin-form-label">Judul Pembaruan</label>
              <input type="text" class="admin-form-input" id="dokJudul" placeholder="Contoh: Dana sudah disalurkan 50%">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Isi Pembaruan</label>
              <textarea class="admin-form-textarea" id="dokIsi" placeholder="Ceritakan perkembangan terkini program ini..." style="min-height:100px;"></textarea>
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Foto Dokumentasi</label>
              <div class="admin-img-upload-zone" style="height:90px;" id="dokImgZone" onclick="document.getElementById('dokImgInput').click()">
                <div class="admin-img-upload-overlay"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a97e" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <div style="font-size:12px;color:#aaa;margin-top:4px;">Tambah foto</div>
              </div>
              <input type="file" id="dokImgInput" style="display:none;" accept="image/*" onchange="previewDokImg(event)">
            </div>
            <button class="admin-submit-btn" onclick="saveDokumentasi('${fp.id}')" style="width:100%;">💾 Simpan Pembaruan</button>
          </div>
        </div>
        <div>
          <div style="font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:16px;">📋 Riwayat Pembaruan</div>
          <div id="dokTimeline">${_renderDokTimeline(fp.id)}</div>
        </div>
      </div>
    `;
  }

  function _renderDokTimeline(fpId) {
    const { formatDate } = Admin.utils;
    const updates = (Admin.state.fanplateDokumentasi[fpId] || []);
    if (updates.length === 0) return `<div style="padding:28px 20px;text-align:center;color:#bbb;border:1.5px dashed #e0dbd3;border-radius:12px;font-size:13px;">Belum ada pembaruan. Tambahkan update pertama!</div>`;
    return updates.slice().reverse().map(u => `
      <div class="dok-timeline-item">
        <div class="dok-timeline-dot"></div>
        <div class="dok-timeline-card">
          <div class="dok-timeline-date">${formatDate(u.tanggal)}</div>
          <div class="dok-timeline-title">${u.judul}</div>
          <div class="dok-timeline-isi">${u.isi}</div>
          ${u.img ? `<img src="${u.img}" class="dok-timeline-img" alt="dokumentasi">` : ''}
        </div>
      </div>`).join('');
  }

  function _renderFPTabEdit(fp) {
    return `
      <div class="admin-form-card">
        <div class="admin-form-card-header">✏️ Edit Informasi Fanplate</div>
        <div class="admin-form-card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
            <div>
              <div class="admin-form-group">
                <label class="admin-form-label">Gambar Cover</label>
                <div class="admin-img-upload-zone has-image" id="editImgZone" onclick="document.getElementById('editImgInput').click()" style="height:130px;">
                  <img src="${fp.img}" alt="cover" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">
                  <div class="admin-img-upload-overlay"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
                </div>
                <input type="file" id="editImgInput" style="display:none;" accept="image/*" onchange="handleEditImg(event,'${fp.id}')">
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Kategori</label>
                <div class="admin-fitur-chips" id="editFiturChips">
                  <button class="admin-fitur-chip ${fp.fitur === 'donasi' ? 'selected' : ''}" data-val="donasi" onclick="selectFiturChip(this)">Donasi</button>
                  <button class="admin-fitur-chip ${fp.fitur === 'kewajiban' ? 'selected' : ''}" data-val="kewajiban" onclick="selectFiturChip(this)">Kewajiban</button>
                  <button class="admin-fitur-chip ${fp.fitur === 'derma' ? 'selected' : ''}" data-val="derma" onclick="selectFiturChip(this)">Derma</button>
                  <button class="admin-fitur-chip ${fp.fitur === 'pilar-kebaikan' ? 'selected' : ''}" data-val="pilar-kebaikan" onclick="selectFiturChip(this)">Pilar Kebaikan</button>
                </div>
              </div>
            </div>
            <div>
              <div class="admin-form-group">
                <label class="admin-form-label">Judul Program <span>*</span></label>
                <input type="text" class="admin-form-input" id="editJudul" value="${fp.judul.replace(/"/g, '&quot;')}">
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Deskripsi <span>*</span></label>
                <textarea class="admin-form-textarea" id="editDeskripsi">${fp.deskripsi}</textarea>
              </div>
              <div class="admin-form-row">
                <div class="admin-form-group">
                  <label class="admin-form-label">Target Dana (Rp)</label>
                  <input type="number" class="admin-form-input" id="editTarget" value="${fp.target || ''}">
                </div>
                <div class="admin-form-group">
                  <label class="admin-form-label">Deadline</label>
                  <input type="date" class="admin-form-input" id="editDeadline" value="${fp.deadline || ''}">
                </div>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:12px;margin-top:8px;">
            <button class="admin-submit-btn" onclick="saveEditFanplate('${fp.id}')" style="flex:1;">✅ Simpan Perubahan</button>
            <button onclick="setFanplateDetailTab('perkembangan')" style="padding:13px 20px;border:1.5px solid #e0dbd3;border-radius:10px;background:transparent;font-size:14px;color:#666;cursor:pointer;font-family:inherit;">Batal</button>
          </div>
        </div>
      </div>
    `;
  }

  /* ── Aksi detail (global) ────────────────────────────────── */
  window.openFanplateDetail = function (id) {
    Admin.state.fanplateDetailId = id;
    Admin.state.fanplateDetailTab = 'perkembangan';
    Admin.state.adminMenu = 'kelola-detail';
    Admin.render();
    const c = document.getElementById('adminContent');
    if (c) { c.style.opacity = '0'; requestAnimationFrame(() => { c.style.transition = 'opacity 0.25s ease'; c.style.opacity = '1'; }); }
    window.closeAdminSidebar();
  };

  window.setFanplateDetailTab = function (tab) {
    Admin.state.fanplateDetailTab = tab;
    const fp = Admin.state.fanplateList.find(f => f.id === Admin.state.fanplateDetailId);
    if (!fp) return;
    const donasiTerkait = Admin.state.donasiMasuk.filter(d => d.program.toLowerCase().includes(fp.judul.substring(0, 20).toLowerCase()));
    const terkumpul = donasiTerkait.filter(d => d.status === 'verified').reduce((s, d) => s + d.jumlah, 0);
    const pct = fp.target ? Math.min(Math.round((terkumpul / fp.target) * 100), 100) : 0;
    const c = document.getElementById('fpDetailTabContent');
    if (!c) return;
    if (tab === 'perkembangan') c.innerHTML = _renderFPTabPerkembangan(fp, donasiTerkait, terkumpul, pct);
    if (tab === 'dokumentasi') c.innerHTML = _renderFPTabDokumentasi(fp);
    if (tab === 'edit') c.innerHTML = _renderFPTabEdit(fp);
    document.querySelectorAll('.fp-detail-tab').forEach((t, i) => t.classList.toggle('active', ['perkembangan', 'dokumentasi', 'edit'][i] === tab));
  };

  window.saveDokumentasi = function (fpId) {
    const { toast } = Admin.utils;
    const judul = document.getElementById('dokJudul')?.value.trim();
    const isi = document.getElementById('dokIsi')?.value.trim();
    if (!judul || !isi) { toast('Judul dan isi wajib diisi!', 'error'); return; }
    const imgEl = document.getElementById('dokImgZone')?.querySelector('img');
    if (!Admin.state.fanplateDokumentasi[fpId]) Admin.state.fanplateDokumentasi[fpId] = [];
    Admin.state.fanplateDokumentasi[fpId].push({ judul, isi, img: imgEl?.src || null, tanggal: new Date().toISOString().split('T')[0] });
    toast('Pembaruan berhasil disimpan! 📝');
    window.setFanplateDetailTab('dokumentasi');
  };

  window.previewDokImg = function (e) {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader(); r.onload = ev => {
      const zone = document.getElementById('dokImgZone'); if (!zone) return;
      zone.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;"><div class="admin-img-upload-overlay"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>`;
      zone.classList.add('has-image');
    }; r.readAsDataURL(file);
  };

  window.handleEditImg = function (e, fpId) {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader(); r.onload = ev => {
      const zone = document.getElementById('editImgZone'); if (!zone) return;
      zone.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;"><div class="admin-img-upload-overlay"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>`;
      zone.classList.add('has-image');
    }; r.readAsDataURL(file);
  };

  window.saveEditFanplate = function (id) {
    const { toast } = Admin.utils;
    const fp = Admin.state.fanplateList.find(f => f.id === id); if (!fp) return;
    const judul = document.getElementById('editJudul')?.value.trim();
    const deskripsi = document.getElementById('editDeskripsi')?.value.trim();
    const target = parseInt(document.getElementById('editTarget')?.value) || null;
    const deadline = document.getElementById('editDeadline')?.value || null;
    const fitur = document.querySelector('#editFiturChips .admin-fitur-chip.selected')?.dataset.val || fp.fitur;
    const imgEl = document.getElementById('editImgZone')?.querySelector('img');
    if (!judul || !deskripsi) { toast('Judul dan Deskripsi wajib diisi!', 'error'); return; }
    fp.judul = judul; fp.deskripsi = deskripsi; fp.target = target; fp.deadline = deadline; fp.fitur = fitur;
    if (imgEl) fp.img = imgEl.src;
    toast('Fanplate berhasil diperbarui! ✅');
    window.openFanplateDetail(id);
  };

  window.unpublishFanplate = function (id) {
    const { toast } = Admin.utils;
    const fp = Admin.state.fanplateList.find(f => f.id === id); if (!fp) return;
    fp.verified = false;
    toast('Fanplate diarsipkan');
    window.openFanplateDetail(id);
  };
})();
