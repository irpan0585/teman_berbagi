/**
 * pages/admin/buat-fanplate.js
 * ─────────────────────────────────────────────────────────────
 * HALAMAN: Buat Fanplate
 * Form pembuatan program donasi baru + preview kartu langsung.
 * Daftar fanplate yang sudah ada kini berada di halaman
 * "Kelola Fanplate" (kelola-fanplate.js) agar tiap halaman fokus.
 *
 * Didaftarkan ke: Admin.pages.buatFanplate
 * Aksi global    : handleAdminImgUpload, updateAdminPreview,
 *                  selectFiturChip, submitFanplate, resetFanplateForm
 * ─────────────────────────────────────────────────────────────
 */

(function () {
  const Admin = (window.Admin = window.Admin || {});
  Admin.pages = Admin.pages || {};

  Admin.pages.buatFanplate = function () {
    return `
      <div class="admin-section-header">
        <div class="admin-section-title">Buat Fanplate</div>
        <div class="admin-section-sub">Buat program donasi baru yang akan tampil di halaman publik. Kelola program yang sudah ada di menu <strong>Kelola Fanplate</strong>.</div>
      </div>

      <div class="admin-fanplate-layout">
        <!-- FORM -->
        <div>
          <div class="admin-form-card" style="margin-bottom:24px;">
            <div class="admin-form-card-header">📋 Informasi Program</div>
            <div class="admin-form-card-body">

              <div class="admin-form-group">
                <label class="admin-form-label">Gambar Cover <span>*</span></label>
                <div class="admin-img-upload-zone" id="imgUploadZone" onclick="document.getElementById('imgUploadInput').click()">
                  <div class="admin-img-upload-overlay">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <svg class="admin-img-upload-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c9a97e" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <div class="admin-img-upload-text">Klik untuk unggah gambar<br><strong>JPG, PNG, GIF</strong> maks 5MB</div>
                </div>
                <input type="file" id="imgUploadInput" class="admin-img-upload-input" accept="image/*" onchange="handleAdminImgUpload(event)">
              </div>

              <div class="admin-form-group">
                <label class="admin-form-label">Judul Program <span>*</span></label>
                <input type="text" class="admin-form-input" id="fpJudul" placeholder="Contoh: Mari membantu korban banjir Sulawesi" oninput="updateAdminPreview()">
              </div>

              <div class="admin-form-group">
                <label class="admin-form-label">Deskripsi Program <span>*</span></label>
                <textarea class="admin-form-textarea" id="fpDeskripsi" placeholder="Jelaskan program donasi ini secara singkat dan jelas..." oninput="updateAdminPreview()"></textarea>
              </div>

              <div class="admin-form-group">
                <label class="admin-form-label">Konten / Isi Lengkap</label>
                <textarea class="admin-form-textarea" id="fpKonten" placeholder="Ceritakan lebih lengkap tentang program ini untuk tab 'Tentang'..." style="min-height:120px;"></textarea>
              </div>

            </div>
          </div>

          <div class="admin-form-card" style="margin-bottom:24px;">
            <div class="admin-form-card-header">🎯 Target & Waktu</div>
            <div class="admin-form-card-body">

              <div class="admin-form-row">
                <div class="admin-form-group">
                  <label class="admin-form-label">Target Dana (Rp)</label>
                  <input type="number" class="admin-form-input" id="fpTarget" placeholder="500000" min="0" oninput="updateAdminPreview()">
                </div>
                <div class="admin-form-group">
                  <label class="admin-form-label">Batas Waktu (Deadline)</label>
                  <input type="date" class="admin-form-input" id="fpDeadline" oninput="updateAdminPreview()">
                </div>
              </div>

              <div class="admin-form-group">
                <label class="admin-form-label">Fitur / Kategori <span>*</span></label>
                <div class="admin-fitur-chips" id="fpFiturChips">
                  <button class="admin-fitur-chip selected" data-val="donasi" onclick="selectFiturChip(this)">Donasi</button>
                  <button class="admin-fitur-chip" data-val="kewajiban" onclick="selectFiturChip(this)">Kewajiban</button>
                  <button class="admin-fitur-chip" data-val="derma" onclick="selectFiturChip(this)">Derma</button>
                  <button class="admin-fitur-chip" data-val="pilar-kebaikan" onclick="selectFiturChip(this)">Pilar Kebaikan</button>
                </div>
              </div>

              <div class="admin-form-group">
                <label class="admin-form-label">Nomor Rekening Tujuan <span>*</span></label>
                <div class="admin-form-row">
                  <select class="admin-form-select" id="fpBank">
                    <option value="">Pilih Bank</option>
                    <option value="BCA">Bank BCA</option>
                    <option value="BRI">Bank BRI</option>
                    <option value="Mandiri">Bank Mandiri</option>
                    <option value="BNI">Bank BNI</option>
                    <option value="BSI">Bank Syariah Indonesia</option>
                    <option value="Muamalat">Bank Muamalat</option>
                  </select>
                  <input type="text" class="admin-form-input" id="fpNoRek" placeholder="Nomor rekening">
                </div>
              </div>

              <div class="admin-form-group">
                <label class="admin-form-label">Nama Pemilik Rekening</label>
                <input type="text" class="admin-form-input" id="fpNamaRek" placeholder="Atas nama">
              </div>

            </div>
          </div>

          <div style="display:flex;gap:12px;">
            <button class="admin-submit-btn" onclick="submitFanplate()" style="flex:1;">
              ✅ Simpan & Publikasikan Fanplate
            </button>
            <button onclick="resetFanplateForm()" style="padding:13px 20px;border:1.5px solid #e0dbd3;border-radius:10px;background:transparent;font-size:14px;color:#666;cursor:pointer;font-family:inherit;white-space:nowrap;">
              Reset
            </button>
          </div>
        </div>

        <!-- PREVIEW -->
        <div>
          <div class="admin-preview-card">
            <div class="admin-preview-header">
              <div class="admin-preview-dot"></div>
              Preview Kartu Donasi
            </div>
            <div class="admin-preview-donasi-card">
              <div id="previewImgWrap">
                <div class="admin-preview-img empty" style="height:170px;background:#f0ece5;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:13px;">
                  Gambar belum diunggah
                </div>
              </div>
              <div class="admin-preview-body">
                <div class="admin-preview-title" id="previewTitle" style="color:#bbb;font-weight:400;font-style:italic;">Judul program akan muncul di sini...</div>
                <div class="admin-preview-meta">
                  <span>Donasi saat ini</span>
                  <span>Hari <b id="previewHari">—</b></span>
                </div>
                <div class="admin-preview-divider"></div>
                <div class="admin-preview-progress-track">
                  <div class="admin-preview-progress-fill" id="previewPct" style="width:0%"></div>
                </div>
                <div class="admin-preview-amounts">
                  <div>
                    <div class="admin-preview-amt-label">Jumlah</div>
                    <div class="admin-preview-amt-val">Rp 0.00</div>
                  </div>
                  <div style="text-align:right;">
                    <div class="admin-preview-amt-label">Target</div>
                    <div class="admin-preview-amt-val" id="previewTarget">Rp —</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-top:20px;background:#f8f5f0;border:1px solid #ece5d8;border-radius:12px;padding:16px 18px;font-size:13px;color:#7a6b54;line-height:1.6;">
            💡 Setelah disimpan, fanplate akan muncul di halaman
            <strong style="color:#5a4a32;cursor:pointer;text-decoration:underline;" onclick="switchAdminMenu('kelola-fanplate')">Kelola Fanplate</strong>
            tempat Anda dapat mengedit, mempublikasikan, atau menghapusnya.
          </div>
        </div>
      </div>
    `;
  };

  /* ────────────────────────────────────────────────────────────
     AKSI FORM (global — dipanggil oleh onclick/oninput)
  ──────────────────────────────────────────────────────────── */
  window.handleAdminImgUpload = function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const zone = document.getElementById('imgUploadZone');
      zone.innerHTML = `
        <img src="${ev.target.result}" alt="preview">
        <div class="admin-img-upload-overlay">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>`;
      zone.classList.add('has-image');
      zone.onclick = () => document.getElementById('imgUploadInput').click();
      document.getElementById('previewImgWrap').innerHTML = `<img src="${ev.target.result}" style="width:100%;height:170px;object-fit:cover;display:block;">`;
    };
    reader.readAsDataURL(file);
  };

  window.updateAdminPreview = function () {
    const { rpFull, daysLeft } = Admin.utils;
    const judul = document.getElementById('fpJudul')?.value || '';
    const target = parseInt(document.getElementById('fpTarget')?.value) || 0;
    const deadline = document.getElementById('fpDeadline')?.value;

    const titleEl = document.getElementById('previewTitle');
    if (titleEl) {
      titleEl.textContent = judul || 'Judul program akan muncul di sini...';
      titleEl.style.color = judul ? '#1a1a1a' : '#bbb';
      titleEl.style.fontStyle = judul ? 'normal' : 'italic';
      titleEl.style.fontWeight = judul ? '600' : '400';
    }
    const hariEl = document.getElementById('previewHari');
    if (hariEl) hariEl.textContent = deadline ? (daysLeft(deadline) || '—') : '—';
    const targetEl = document.getElementById('previewTarget');
    if (targetEl) targetEl.textContent = target ? rpFull(target) : 'Rp —';
  };

  window.selectFiturChip = function (btn) {
    // hanya pengaruhi grup chip milik tombol yang diklik
    const group = btn.closest('.admin-fitur-chips') || document;
    group.querySelectorAll('.admin-fitur-chip').forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');
  };

  window.submitFanplate = async function () {
    const { toast, daysLeft } = Admin.utils;
    const judul = document.getElementById('fpJudul')?.value.trim();
    const deskripsi = document.getElementById('fpDeskripsi')?.value.trim();
    const konten = document.getElementById('fpKonten')?.value.trim();
    const target = parseInt(document.getElementById('fpTarget')?.value) || null;
    const deadline = document.getElementById('fpDeadline')?.value || null;
    const fitur = document.querySelector('#fpFiturChips .admin-fitur-chip.selected')?.dataset.val || 'donasi';
    const bank = document.getElementById('fpBank')?.value || null;
    const noRek = document.getElementById('fpNoRek')?.value.trim() || null;
    const namaRek = document.getElementById('fpNamaRek')?.value.trim() || null;
    const imgZone = document.getElementById('imgUploadZone');
    const img = imgZone?.querySelector('img')?.src || `https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80`;

    if (!judul || !deskripsi) {
      toast('Judul dan Deskripsi wajib diisi!', 'error');
      return;
    }

    // ─── Simpan & publikasikan ke backend (POST /api/donasi) ──────────────
    try {
      if (typeof window.adminAPI !== 'undefined') {
        const { response, data } = await window.adminAPI.createDonasi({
          title: judul, deskripsi, konten, img, target, deadline,
          fitur, bank, no_rekening: noRek, nama_rekening: namaRek,
          hari: target ? (daysLeft(deadline) || 30) : 30,
          verified: true, // tombol "Simpan & Publikasikan" → langsung tampil di publik
        });

        if (response.ok && data.success) {
          const created = data.data || {};
          Admin.state.fanplateList.unshift({
            id: created._id || created.id,
            img: created.img, judul: created.title,
            deskripsi: created.deskripsi, target: created.target,
            deadline: created.deadline, fitur: created.fitur, verified: created.verified,
          });
          // Segarkan daftar donasi publik agar program baru langsung muncul
          if (typeof window.loadDonasiFromAPI === 'function') window.loadDonasiFromAPI();
          toast(`Fanplate "${judul.substring(0, 30)}..." berhasil dipublikasikan! 🎉`);
          switchAdminMenu('kelola-fanplate');
          return;
        }

        // Gagal di server → tampilkan alasan yang jelas
        if (response.status === 401 || response.status === 403) {
          toast('Sesi admin tidak valid. Muat ulang halaman lalu coba lagi.', 'error');
        } else {
          toast(data.message || (data.errors && data.errors[0]) || 'Gagal menyimpan fanplate', 'error');
        }
        return;
      }
    } catch (err) {
      console.warn('Backend tidak tersedia, simpan lokal.', err.message);
    }

    // ─── Fallback: simpan ke state lokal (backend mati) ───────────────────
    const newFP = {
      id: 'fp' + Date.now(),
      img, judul, deskripsi,
      target, deadline, fitur,
      verified: true,
    };
    Admin.state.fanplateList.unshift(newFP);

    if (fitur === 'donasi' && typeof donasiData !== 'undefined') {
      donasiData.push({
        id: donasiData.length + 100,
        img,
        title: judul,
        hari: target ? (daysLeft(deadline) || 30) : 30,
        jumlah: 0,
        target: target || 500000,
        fromAdmin: true,
        verified: true,
      });
      if (typeof window.renderDonasiGrid === 'function') window.renderDonasiGrid();
    }

    toast(`Fanplate "${judul.substring(0, 30)}..." berhasil disimpan! 🎉`);
    switchAdminMenu('kelola-fanplate');
  };

  window.resetFanplateForm = function () {
    ['fpJudul', 'fpDeskripsi', 'fpKonten', 'fpTarget', 'fpDeadline', 'fpNoRek', 'fpNamaRek'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const sel = document.getElementById('fpBank');
    if (sel) sel.value = '';
    document.querySelectorAll('#fpFiturChips .admin-fitur-chip').forEach((c, i) => {
      c.classList.toggle('selected', i === 0);
    });
    const zone = document.getElementById('imgUploadZone');
    if (zone) {
      zone.classList.remove('has-image');
      zone.innerHTML = `
        <div class="admin-img-upload-overlay">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </div>
        <svg class="admin-img-upload-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c9a97e" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <div class="admin-img-upload-text">Klik untuk unggah gambar<br><strong>JPG, PNG, GIF</strong> maks 5MB</div>`;
      zone.onclick = () => document.getElementById('imgUploadInput').click();
    }
    const wrap = document.getElementById('previewImgWrap');
    if (wrap) wrap.innerHTML = `<div class="admin-preview-img empty" style="height:170px;background:#f0ece5;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:13px;">Gambar belum diunggah</div>`;
    const titleEl = document.getElementById('previewTitle');
    if (titleEl) { titleEl.textContent = 'Judul program akan muncul di sini...'; titleEl.style.color = '#bbb'; titleEl.style.fontStyle = 'italic'; titleEl.style.fontWeight = '400'; }
    const hariEl = document.getElementById('previewHari');
    if (hariEl) hariEl.textContent = '—';
    const targetEl = document.getElementById('previewTarget');
    if (targetEl) targetEl.textContent = 'Rp —';
  };
})();
