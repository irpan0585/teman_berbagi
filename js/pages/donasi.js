/**
 * pages/donasi.js
 * ─────────────────────────────────────────────────────────────
 * 4 halaman dalam 1 file (disesuaikan dengan gambar referensi):
 *   1. #page-donasi        — grid kartu donasi
 *   2. #page-detail-donasi — detail + tab (Tentang / Informasi / Dermawan)
 *   3. #page-bayar-donasi  — nominal, no. bank, bukti, profil
 *   4. #page-sukses-donasi — proses → berhasil
 * ─────────────────────────────────────────────────────────────
 */

/* Format mata uang */
function _rpFull(n) { return 'Rp ' + Number(n).toLocaleString('id-ID') + '.00'; }
function _rpDot(n) { return 'Rp.' + Number(n).toLocaleString('id-ID'); }

/* SVG siluet untuk avatar dermawan */
const _SIL_MALE = `<svg viewBox="0 0 24 24" fill="#1d1d1d"><circle cx="12" cy="8" r="4.2"/><path d="M3.5 21c0-4.7 3.8-8 8.5-8s8.5 3.3 8.5 8z"/></svg>`;
const _SIL_FEMALE = `<svg viewBox="0 0 24 24" fill="#1d1d1d"><path d="M12 1.6c-3 0-5.4 2.3-5.4 5.6 0 1.3.4 2.4 1.1 3.3-.6.3-1.1.9-1.4 1.7-.5 1.2-.7 3-.7 5.2 0 .4.1.7.2 1h2.1c-.1-2.1 0-3.8.3-4.6.2-.5.4-.7.6-.8.9.7 2 1.1 3.3 1.1s2.4-.4 3.3-1.1c.2.1.4.3.6.8.3.8.4 2.5.3 4.6h2.1c.1-.3.2-.6.2-1 0-2.2-.2-4-.7-5.2-.3-.8-.8-1.4-1.4-1.7.7-.9 1.1-2 1.1-3.3 0-3.3-2.4-5.6-5.4-5.6z"/></svg>`;

document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════════════════
     1. HALAMAN DONASI — Grid kartu program
  ═══════════════════════════════════════════════════════════ */
  document.getElementById('page-donasi').innerHTML = `
    <div class="donasi-page">
      <div class="donasi-section-title">Sedikit dari Kita, Berarti Banyak untuk Mereka</div>
      <div class="donasi-grid" id="donasiGrid"></div>
    </div>`;

  _observePage('page-donasi', () => {
    renderDonasiGrid();
  });

  /**
   * Render ulang grid kartu donasi dari array donasiData.
   * Diekspor ke window agar bisa dipanggil setelah data dimuat dari API.
   */
  function renderDonasiGrid() {
    const grid = document.getElementById('donasiGrid');
    if (!grid) return;
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
          <div class="donasi-progress-track">
            <div class="donasi-progress-fill" data-pct="${pct}" style="width:0%"></div>
          </div>
          <div class="donasi-amount-row">
            <div class="amt-col">
              <div class="amt-label">Jumlah</div>
              <div class="amt-val">${_rpFull(item.jumlah)}</div>
            </div>
            <div class="amt-col right">
              <div class="amt-label">Target</div>
              <div class="amt-val">${_rpFull(item.target)}</div>
            </div>
          </div>
        </div>`;

      card.addEventListener('click', () => {
        selectedDonasi = item;
        showPage('detail-donasi');
      });
      grid.appendChild(card);
    });

    // Animasikan progress bar kartu dari 0 → nilai asli setelah kartu masuk
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        grid.querySelectorAll('.donasi-progress-fill').forEach(fill => {
          fill.style.width = fill.dataset.pct + '%';
        });
      });
    });
  }

  // Ekspor agar router.js dapat me-render ulang setelah memuat data API
  window.renderDonasiGrid = renderDonasiGrid;

  /* ═══════════════════════════════════════════════════════════
     2. HALAMAN DETAIL DONASI
  ═══════════════════════════════════════════════════════════ */
  document.getElementById('page-detail-donasi').innerHTML = `
    <div class="detail-page">
      <div class="detail-hero">
        <div class="detail-hero-img-wrap">
          <img id="detailHeroImg" src="" alt="">
        </div>
        <div class="detail-hero-card">
          <h2 id="detailTitle"></h2>
          <div class="detail-hari-row"><span>Hari</span><b id="detailHari"></b></div>
          <div class="detail-divider"></div>
          <div class="detail-donasi-label">Donasi saat ini</div>
          <div class="detail-progress-track">
            <div class="detail-progress-fill" id="detailProgressFill"></div>
          </div>
          <div class="detail-amount-row">
            <div class="amt-col">
              <div class="amt-label">Jumlah</div>
              <div class="amt-val" id="detailJumlah"></div>
            </div>
            <div class="amt-col right">
              <div class="amt-label">Target</div>
              <div class="amt-val" id="detailTarget"></div>
            </div>
          </div>
          <button class="detail-donate-btn" id="btnDonasiSekarang">Lakukan Berdonasi</button>
        </div>
      </div>

      <!-- Tab Bar -->
      <div class="detail-tabs-bar">
        <span class="detail-tab active" id="dtab-tentang"   onclick="switchDetailTab('tentang')">Tentang</span>
        <span class="detail-tab"        id="dtab-informasi" onclick="switchDetailTab('informasi')">Informasi</span>
        <span class="detail-tab"        id="dtab-dermawan"  onclick="switchDetailTab('dermawan')">Dermawan</span>
      </div>

      <!-- Tab: Tentang -->
      <div class="detail-tab-content active" id="dcontent-tentang">
        <div class="detail-text-body">
          <p>Dengan berbagi, kita bisa membantu mereka yang membutuhkan mulai dari memenuhi
             kebutuhan pangan, membantu pendidikan, mendukung pembangunan rumah ibadah,
             hingga meringankan beban hidup masyarakat kurang mampu.</p>
          <p>Setiap donasi yang Sahabat berikan bukan sekadar bantuan materi, tetapi juga
             menjadi sumber harapan, kebahagiaan, dan masa depan yang lebih baik bagi mereka.</p>
        </div>
      </div>

      <!-- Tab: Informasi -->
      <div class="detail-tab-content" id="dcontent-informasi">
        <div class="info-article-list">
          <div class="info-article">
            <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&q=80" alt="">
            <p>Saat ini Masyarakat yang mengalmi bencana dari Banjir sangat membutuhkan bantuan
               dari kita, mari kita membantu sodara kita yang mengalami musibah</p>
          </div>
          <div class="info-article reverse">
            <p>Beberapa Ibu hamil dan bayi sangat membutuhkan nutrisi bagi ibu yang hamil dan
               susu bagi bayi, akibat dari bencana semuanya hanyut segala hal tanpa tersisah apapun</p>
            <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&q=80" alt="">
          </div>
        </div>
      </div>

      <!-- Tab: Dermawan -->
      <div class="detail-tab-content" id="dcontent-dermawan">
        <div class="dermawan-list" id="dermawanList"></div>
      </div>
    </div>`;

  _observePage('page-detail-donasi', () => {
    const d = selectedDonasi;
    if (!d) return;

    document.getElementById('detailHeroImg').src = d.img;
    document.getElementById('detailTitle').textContent = d.title;
    document.getElementById('detailHari').textContent = d.hari;
    document.getElementById('detailJumlah').textContent = _rpFull(d.jumlah);
    document.getElementById('detailTarget').textContent = _rpFull(d.target);

    // Animasi progress bar dari 0 → nilai asli (smooth)
    const fill = document.getElementById('detailProgressFill');
    const pct = Math.round((d.jumlah / d.target) * 100);
    fill.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { fill.style.width = pct + '%'; });
    });

    switchDetailTab('tentang');

    // Muat daftar dermawan (donatur terverifikasi) dari database
    _loadDermawan(d);
  });

  /**
   * Ambil donatur yang sudah diverifikasi admin dari backend, lalu tampilkan
   * di daftar dermawan. Sekaligus perbarui jumlah terkumpul bila tersedia.
   */
  async function _loadDermawan(d) {
    const listEl = document.getElementById('dermawanList');
    if (!listEl) return;
    const id = d._id || d.id;
    let donors = [];

    try {
      if (typeof window.donasiAPI !== 'undefined' && id && /^[a-f0-9]{24}$/i.test(String(id))) {
        const { response, data } = await window.donasiAPI.getById(id);
        if (response.ok && data.success && data.data) {
          if (Array.isArray(data.data.donatur)) {
            donors = data.data.donatur.map((t, i) => ({
              nama: t.nama,
              jumlah: Number(t.jumlah),
              gender: i % 2 === 0 ? 'male' : 'female',
            }));
          }
          // Perbarui angka terkumpul + progress dengan data terbaru dari server
          if (typeof data.data.jumlah !== 'undefined') {
            const jml = Number(data.data.jumlah);
            const tgt = Number(data.data.target) || d.target;
            const jEl = document.getElementById('detailJumlah');
            if (jEl) jEl.textContent = _rpFull(jml);
            const fill2 = document.getElementById('detailProgressFill');
            if (fill2) fill2.style.width = Math.min(100, Math.round((jml / tgt) * 100)) + '%';
          }
        }
      }
    } catch (err) {
      console.warn('Gagal memuat dermawan dari database:', err.message);
    }

    if (!donors.length) {
      listEl.innerHTML = `<div style="text-align:center;color:#bbb;padding:24px 12px;font-size:13px;line-height:1.5;">Belum ada dermawan terverifikasi.<br>Jadilah yang pertama berdonasi!</div>`;
      return;
    }

    listEl.innerHTML = donors.map(dw => `
      <div class="dermawan-item">
        <div class="dermawan-avatar">${dw.gender === 'female' ? _SIL_FEMALE : _SIL_MALE}</div>
        <div class="dermawan-info">
          <div class="dermawan-name">${dw.nama}</div>
          <div class="dermawan-sub">
            <div class="dermawan-type">Donasi</div>
            <div class="dermawan-amount">${_rpDot(dw.jumlah)}</div>
          </div>
        </div>
      </div>`).join('');
  }

  document.addEventListener('click', e => {
    if (e.target.id === 'btnDonasiSekarang') showPage('bayar-donasi');
  });

  window.switchDetailTab = function (name) {
    document.querySelectorAll('#page-detail-donasi .detail-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#page-detail-donasi .detail-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`dtab-${name}`).classList.add('active');
    document.getElementById(`dcontent-${name}`).classList.add('active');
  };

  /* ═══════════════════════════════════════════════════════════
     3. HALAMAN BAYAR DONASI
  ═══════════════════════════════════════════════════════════ */
  document.getElementById('page-bayar-donasi').innerHTML = `
    <div class="bayar-page">
      <div class="bayar-mini-banner">
        <div class="bayar-mini-img"><img id="bayarMiniImg" src="" alt=""></div>
        <div class="bayar-mini-title" id="bayarMiniTitle">—</div>
      </div>

      <div class="bayar-body">
        <div class="bayar-label">Masukan Nominal</div>
        <input type="text" class="bayar-nominal-input" id="nominalInput" placeholder="Rp." readonly>

        <div class="bayar-label">Pilih Nominal</div>
        <div class="nominal-grid" id="nominalGrid">
          <button class="nominal-btn" data-val="10000">Rp.10.000</button>
          <button class="nominal-btn" data-val="50000">Rp.50.000</button>
          <button class="nominal-btn" data-val="100000">Rp.100.000</button>
          <button class="nominal-btn" data-val="150000">Rp.150.000</button>
          <button class="nominal-btn" data-val="200000">Rp.200.000</button>
          <button class="nominal-btn" data-val="250000">Rp.250.000</button>
        </div>

        <div class="bayar-label">No.Bank</div>
        <div class="bayar-bank-card">
          <span class="bri-logo">BRI</span>
          <span class="bayar-bank-number" id="bankNumber">2429529058325025-52</span>
          <button class="bayar-copy-btn" id="btnCopyBank" aria-label="Salin">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
        </div>

        <div class="bayar-label">Bukti Pembayaran</div>
        <div class="bayar-bukti-area" id="bayarBuktiArea">
          <img id="buktiImg" alt="" style="display:none">
          <div class="bukti-camera" id="buktiCamera">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="#bbb">
              <path d="M9 3 7.5 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.5L15 3H9z"/>
              <circle cx="12" cy="13" r="3.4" fill="#ddd"/>
            </svg>
            <span class="bukti-camera-hint">Ketuk untuk unggah bukti pembayaran</span>
          </div>
          <input type="file" id="buktiInput" accept="image/*" style="display:none">
        </div>

        <div class="bayar-label-big">Profil Anda</div>
        <div class="bayar-field-label">Nama</div>
        <input type="text" class="bayar-input" id="profileNama">
        <div class="bayar-field-label">No.WA</div>
        <input type="text" class="bayar-input" id="profileWa">
      </div>

      <button class="bayar-submit-btn" id="btnSubmitDonasi">LAKUKAN TRANGSAKSI</button>
    </div>`;

  _observePage('page-bayar-donasi', () => {
    const d = selectedDonasi;
    if (d) {
      document.getElementById('bayarMiniImg').src = d.img;
      document.getElementById('bayarMiniTitle').textContent = d.title;
    }
    // Reset
    document.getElementById('nominalInput').value = '';
    document.querySelectorAll('#nominalGrid .nominal-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('buktiImg').style.display = 'none';
    document.getElementById('buktiCamera').style.display = 'flex';
    window.__buktiUploaded = false;
  });

  document.getElementById('nominalGrid').addEventListener('click', e => {
    const btn = e.target.closest('.nominal-btn');
    if (!btn) return;
    const amount = parseInt(btn.dataset.val, 10);
    selectedNominal = amount;
    document.querySelectorAll('#nominalGrid .nominal-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('nominalInput').value = _rpDot(amount);
  });

  document.getElementById('btnCopyBank').addEventListener('click', () => {
    const num = document.getElementById('bankNumber').textContent;
    navigator.clipboard.writeText(num).catch(() => { });
    _flashCopyBtn('btnCopyBank');
  });

  document.getElementById('bayarBuktiArea').addEventListener('click', () =>
    document.getElementById('buktiInput').click()
  );
  document.getElementById('buktiInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = document.getElementById('buktiImg');
      img.src = ev.target.result;
      img.style.display = 'block';
      document.getElementById('buktiCamera').style.display = 'none';
      window.__buktiUploaded = true;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('btnSubmitDonasi').addEventListener('click', async () => {
    const namaEl = document.getElementById('profileNama');
    const nama = (namaEl?.value || '').trim();
    const nominalRaw = document.getElementById('nominalInput')?.value || '';
    const nominal = selectedNominal || parseInt(nominalRaw.replace(/\D/g, ''), 10) || 0;
    const d = selectedDonasi || {};

    // Validasi sederhana
    if (!nominal || nominal < 10000) {
      alert('Silakan pilih nominal minimal Rp 10.000 terlebih dahulu.');
      return;
    }
    if (!nama) {
      alert('Mohon isi nama Anda pada bagian "Profil Anda".');
      return;
    }

    const btn = document.getElementById('btnSubmitDonasi');
    if (btn) { btn.disabled = true; btn.textContent = 'MENGIRIM...'; }

    // Siapkan data transaksi
    const buktiUploaded = !!window.__buktiUploaded;
    const buktiFoto = buktiUploaded ? (document.getElementById('buktiImg')?.src || null) : null;
    const idDonasi = d._id || d.id;
    const payload = {
      donasi_id: (idDonasi && /^[a-f0-9]{24}$/i.test(String(idDonasi))) ? idDonasi : undefined,
      nama,
      program: d.title || 'Donasi',
      jumlah: nominal,
      metode: 'Transfer Bank',
      bukti: buktiUploaded,
      bukti_foto: buktiFoto,
      kategori: 'donasi',
    };

    // Kirim ke backend (tersimpan ke database dengan status "pending")
    try {
      if (typeof window.transaksiAPI !== 'undefined') {
        await window.transaksiAPI.create(payload);
      }
    } catch (err) {
      console.warn('Gagal menyimpan transaksi ke database:', err.message);
    }

    if (btn) { btn.disabled = false; btn.textContent = 'LAKUKAN TRANGSAKSI'; }

    // Tampilkan hasil sebagai overlay (tidak pindah halaman)
    showPaymentSuccess();
  });

  /* ═══════════════════════════════════════════════════════════
     4. HALAMAN SUKSES DONASI (proses → berhasil) - DIPERBAIKI
  ═══════════════════════════════════════════════════════════ */
  document.getElementById('page-sukses-donasi').innerHTML = `
    <div class="sukses-page">
      <div class="sukses-content">
        <h1 class="sukses-title">TERIMA KASIH TELAH BERDONASI</h1>
        <p class="sukses-subtitle" id="suksesSubtitle">Pembayaran kamu sedang diproses</p>
        <div class="sukses-spinner" id="suksesSpinner"><div class="sukses-spinner-ring"></div></div>
        <div class="sukses-status-label">STATUS</div>
        <div class="sukses-status-badge processing" id="suksesBadge">Diproses.....</div>
        <!-- Tombol Kembali ke Beranda -->
        <button class="sukses-back-btn" id="suksesBackBtn" style="display:none;margin-top:30px;" onclick="kembaliKeBeranda()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12l9-9 9 9"/>
            <path d="M5 10v10a1 1 0 001 1h3"/>
            <path d="M9 5h9a1 1 0 011 1v12a1 1 0 01-1 1h-3"/>
          </svg>
          Kembali ke Beranda
        </button>
      </div>
    </div>`;

  let _suksesTimer = null;
  _observePage('page-sukses-donasi', () => {
    const sub = document.getElementById('suksesSubtitle');
    const spin = document.getElementById('suksesSpinner');
    const badge = document.getElementById('suksesBadge');
    const backBtn = document.getElementById('suksesBackBtn');

    // State awal: diproses
    sub.style.display = 'block';
    spin.style.display = 'flex';
    badge.className = 'sukses-status-badge processing';
    badge.textContent = 'Diproses.....';
    if (backBtn) backBtn.style.display = 'none';

    clearTimeout(_suksesTimer);
    _suksesTimer = setTimeout(() => {
      sub.style.display = 'none';
      spin.style.display = 'none';
      if (window.__buktiUploaded) {
        badge.className = 'sukses-status-badge success';
        badge.textContent = 'BERHASIL';
      } else {
        badge.className = 'sukses-status-badge gagal';
        badge.textContent = 'GAGAL';
      }
      // Tampilkan tombol kembali
      if (backBtn) backBtn.style.display = 'inline-flex';
    }, 2600);
  });

  /* ═══════════════════════════════════════════════════════════
     HELPERS PRIVAT
  ═══════════════════════════════════════════════════════════ */
  function _flashCopyBtn(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"
      stroke="#3f9e2f" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    setTimeout(() => {
      btn.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"
        stroke="#1a1a1a" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
    }, 1600);
  }
});

/* ═══════════════════════════════════════════════════════════════
   FUNGSI KEMBALI KE BERANDA
═══════════════════════════════════════════════════════════════ */
function kembaliKeBeranda() {
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
}

// Ekspor fungsi ke global
window.kembaliKeBeranda = kembaliKeBeranda;

/* ═══════════════════════════════════════════════════════════════
   UTILITY — Observer halaman aktif
═══════════════════════════════════════════════════════════════ */
function _observePage(pageId, callback) {
  const el = document.getElementById(pageId);
  if (!el) return;
  let lastVisible = false;
  new MutationObserver(() => {
    const isVisible = el.classList.contains('visible');
    if (isVisible && !lastVisible) {
      lastVisible = true;
      callback();
    } else if (!isVisible) {
      lastVisible = false;
    }
  }).observe(el, { attributes: true, attributeFilter: ['class'] });
}