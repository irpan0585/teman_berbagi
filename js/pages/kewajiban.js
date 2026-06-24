/**
 * pages/kewajiban.js
 * ─────────────────────────────────────────────────────────────
 * 6 halaman (kewajiban + bayar) dalam 1 file.
 * Dua mode hitung:
 *   - mode 'count'  : nominal = jumlah × harga satuan (Zakat, Stipendium)
 *   - mode 'income' : Persepuluhan = 10% dari penghasilan (Persepuhan)
 * ─────────────────────────────────────────────────────────────
 */

function _rpDot(n) { return 'Rp.' + Number(n).toLocaleString('id-ID'); }
function _rpSpace(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); }

document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════ KONFIG & STATE ═══════════════ */
  const KEWAJIBAN = {
    zakat: {
      mode: 'count', harga: 50000, satuan: 'orang', count: 0,
      pageId: 'kewajiban', bayarPageId: 'bayar-kewajiban',
      idJumlah: 'zakatJumlah', idNominal: 'zakatNominal', idBayarNom: 'bayarKewajibNominal',
      idBuktiImg: 'buktiKewajibImg', idBuktiCam: 'buktiKewajibCam', idBuktiInp: 'buktiKewajibInput',
    },
    persepuhan: {
      mode: 'income', persen: 0.10, income: 0,
      pageId: 'persepuhan', bayarPageId: 'bayar-persepuhan',
      idNominal: 'persepuhanNominal', idIncome: 'persepuhanIncome', idSimulasi: 'persepuhanSimulasi',
      idBayarNom: 'bayarPersepuhanNominal',
      idBuktiImg: 'buktiPersepuhanImg', idBuktiCam: 'buktiPersepuhanCam', idBuktiInp: 'buktiPersepuhanInput',
    },
    stipendium: {
      mode: 'count', harga: 100000, satuan: 'siswa', count: 0, ikhlas: 0,
      pageId: 'stipendium', bayarPageId: 'bayar-stipendium',
      idJumlah: 'stipendiumJumlah', idNominal: 'stipendiumNominal', idBayarNom: 'bayarStipendiumNominal',
      idIkhlas: 'stipendiumIkhlas',
      idBuktiImg: 'buktiStipendiumImg', idBuktiCam: 'buktiStipendiumCam', idBuktiInp: 'buktiStipendiumInput',
    },
  };

  /* ═══════════════ RENDER HALAMAN KEWAJIBAN ═══════════════ */
  _renderKewajiban({
    pageId: 'page-kewajiban', key: 'zakat',
    judul: 'Zakat Fitrah',
    sub: 'Sempurnakan ibadah puasa Ramadan dengan tunaikan zakat fitrah Rp 50.000/Jiwa',
    labelJumlah: 'Jumlah orang yang ingin membayar zakat',
    badgeText: 'ZAKAT\nFITRAH', badgeColor: '#2ecc40',
    heroImg: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    heroDesc: 'Mari sempurnakan\nRamadhan dengan\nmenunaikan kewajiban\nZakat Fitrah kita',
    idJumlah: 'zakatJumlah', idNominal: 'zakatNominal',
    deskripsi: [
      'Zakat fitrah adalah zakat yang harus ditunaikan bagi seorang muzakki yang telah memiliki kemampuan untuk menunaikannya. Zakat fitrah adalah zakat wajib yang harus dikeluarkan sekali setahun yaitu saat bulan ramadhan menjelang idul fitri. Pada prinsipnya, zakat fitrah haruslah dikeluarkan sebelum sholat idul fitri dilangsungkan. Hal tersebut yang menjadi pembeda zakat fitrah dengan zakat lainnya.',
      'Zakat fitrah hukumnya wajib ditunaikan bagi setiap muslim yang mampu. Besar zakat fitrah yang harus dikeluarkan sebesar satu sha\u2019 yang nilainya sama dengan 2,5 kilogram beras, gandum, kurma, sagu, dan sebagainya atau 3,5 liter beras yang disesuaikan dengan konsumsi per-orangan sehari-hari.',
    ],
  });

  _renderKewajiban({
    pageId: 'page-persepuhan', key: 'persepuhan', mode: 'income',
    judul: 'Persepuluhan',
    sub: 'Tunaikan persepuluhan sebesar 10% dari penghasilan Anda sebagai bentuk syukur dan kepedulian',
    labelIncome: 'Masukkan penghasilan Anda',
    labelHasil: 'Persepuluhan yang harus dibayar (10%)',
    badgeText: 'PERSE\nPULUHAN', badgeColor: '#f7c948',
    heroImg: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    heroDesc: 'Sisihkan 10% dari\npenghasilan sebagai\nwujud syukur dan\nberbagi kepada sesama',
    idIncome: 'persepuhanIncome', idNominal: 'persepuhanNominal', idSimulasi: 'persepuhanSimulasi',
    deskripsi: [
      'Persepuluhan adalah praktik menyisihkan sepersepuluh (10%) dari penghasilan untuk diberikan sebagai bentuk syukur dan kepedulian kepada sesama yang membutuhkan.',
      'Cukup masukkan jumlah penghasilan Anda, dan sistem akan menghitung secara otomatis besar persepuluhan yang dianjurkan. Contoh: penghasilan Rp 1.000.000 maka persepuluhannya adalah Rp 100.000.',
    ],
  });

  _renderKewajiban({
    pageId: 'page-stipendium', key: 'stipendium',
    judul: 'Stipendium',
    sub: 'Bantu pendidikan anak-anak kurang mampu dengan stipendium Rp 100.000/Siswa',
    labelJumlah: 'Jumlah siswa yang ingin dibantu',
    badgeText: 'STIPEN\nDIUM', badgeColor: '#7ee8a0',
    heroImg: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    heroDesc: 'Investasikan masa\ndepan generasi penerus\nmelalui beasiswa\npendidikan',
    idJumlah: 'stipendiumJumlah', idNominal: 'stipendiumNominal',
    allowIkhlas: true, idIkhlas: 'stipendiumIkhlas',
    deskripsi: [
      'Stipendium adalah bantuan dana pendidikan bagi siswa berprestasi namun kurang mampu secara ekonomi.',
      'Setiap kontribusi Anda adalah investasi nyata untuk mencetak generasi penerus yang cerdas dan berakhlak mulia.',
    ],
  });


  /* ═══════════════ RENDER HALAMAN MENU KEWAJIBAN ═══════════════ */
  _renderMenuKewajiban();

  /* ═══════════════ RENDER HALAMAN BAYAR ═══════════════ */
  _renderBayar({
    pageId: 'page-bayar-kewajiban', bannerImg: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    bannerJudul: 'Zakat Fitrah \u2014 Mari sempurnakan Ramadhan dengan menunaikan kewajiban',
    idBayarNom: 'bayarKewajibNominal', idBuktiImg: 'buktiKewajibImg', idBuktiCam: 'buktiKewajibCam',
    idBuktiInp: 'buktiKewajibInput', labelNama: 'Nama Pembayaran Zakat', idNama: 'zakatNama', idWa: 'zakatWa',
  });
  _renderBayar({
    pageId: 'page-bayar-persepuhan', bannerImg: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
    bannerJudul: 'Persepuluhan \u2014 Tunaikan 10% dari penghasilan Anda',
    idBayarNom: 'bayarPersepuhanNominal', idBuktiImg: 'buktiPersepuhanImg', idBuktiCam: 'buktiPersepuhanCam',
    idBuktiInp: 'buktiPersepuhanInput', labelNama: 'Nama Pembayar Persepuluhan', idNama: 'persepuhanNama', idWa: 'persepuhanWa',
  });
  _renderBayar({
    pageId: 'page-bayar-stipendium', bannerImg: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80',
    bannerJudul: 'Stipendium \u2014 Investasi pendidikan generasi bangsa',
    idBayarNom: 'bayarStipendiumNominal', idBuktiImg: 'buktiStipendiumImg', idBuktiCam: 'buktiStipendiumCam',
    idBuktiInp: 'buktiStipendiumInput', labelNama: 'Nama Pembayar Stipendium', idNama: 'stipendiumNama', idWa: 'stipendiumWa',
  });

  /* ═══════════════ OBSERVER ═══════════════ */
  Object.values(KEWAJIBAN).forEach(k => {
    _observePage(`page-${k.pageId}`, () => {
      if (k.mode === 'income') {
        k.income = 0;
        const inp = document.getElementById(k.idIncome);
        if (inp) inp.value = '';
      } else {
        k.count = 0;
        if ('ikhlas' in k) { k.ikhlas = 0; const ik = document.getElementById(k.idIkhlas); if (ik) ik.value = ''; }
      }
      _updateDisplay(k);
    });

    _observePage(`page-${k.bayarPageId}`, () => {
      const nominal = _nominalOf(k);
      const nomEl = document.getElementById(k.idBayarNom);
      if (nomEl) nomEl.textContent = nominal.toLocaleString('id-ID');
      // Reset bukti
      const img = document.getElementById(k.idBuktiImg);
      const cam = document.getElementById(k.idBuktiCam);
      if (img) { img.style.display = 'none'; img.src = ''; }
      if (cam) cam.style.display = 'flex';
      window.__buktiUploaded = false;
      // Ingat kewajiban yang sedang dibayar (untuk disimpan ke database saat submit)
      _activeKewajiban = k;
    });
  });

  // Kewajiban yang sedang aktif di halaman bayar
  let _activeKewajiban = null;

  // Petakan jenis kewajiban (k.pageId) → kategori transaksi, judul program, id input nama
  const _KEWAJIBAN_META = {
    kewajiban: { kategori: 'zakat', program: 'Zakat Fitrah', idNama: 'zakatNama' },
    persepuhan: { kategori: 'persepuhan', program: 'Persepuluhan', idNama: 'persepuhanNama' },
    stipendium: { kategori: 'stipendium', program: 'Stipendium Pendidikan', idNama: 'stipendiumNama' },
  };

  /** Simpan transaksi kewajiban ke database (status pending) */
  async function _submitKewajibanKeDatabase() {
    if (!_activeKewajiban) return;
    const k = _activeKewajiban;
    const meta = _KEWAJIBAN_META[k.pageId] || { kategori: 'donasi', program: 'Kewajiban', idNama: null };
    const nominal = _nominalOf(k);
    if (!nominal || nominal <= 0) return;

    const namaEl = meta.idNama ? document.getElementById(meta.idNama) : null;
    const nama = (namaEl?.value || '').trim() || 'Donatur';
    const buktiUploaded = !!window.__buktiUploaded;
    const buktiImg = k.idBuktiImg ? document.getElementById(k.idBuktiImg) : null;
    const buktiFoto = (buktiUploaded && buktiImg && buktiImg.src) ? buktiImg.src : null;

    try {
      if (typeof window.transaksiAPI !== 'undefined') {
        await window.transaksiAPI.create({
          nama,
          program: meta.program,
          jumlah: nominal,
          metode: 'Transfer Bank',
          bukti: buktiUploaded,
          bukti_foto: buktiFoto,
          kategori: meta.kategori,
        });
      }
    } catch (err) {
      console.warn('Gagal menyimpan transaksi kewajiban:', err.message);
    }
  }

  /* ═══════════════ EVENT: klik (counter, bayar, reset, copy, submit) ═══════════════ */
  document.addEventListener('click', e => {
    const incBtn = e.target.closest('[data-kewajiban-inc]');
    const decBtn = e.target.closest('[data-kewajiban-dec]');
    const bayBtn = e.target.closest('[data-kewajiban-bayar]');
    const rstBtn = e.target.closest('[data-kewajiban-reset]');
    const submitBtn = e.target.closest('[data-submit-kewajiban]');

    if (incBtn) { const k = KEWAJIBAN[incBtn.dataset.kewajibanInc]; if (k) { k.count++; _updateDisplay(k); } }
    if (decBtn) { const k = KEWAJIBAN[decBtn.dataset.kewajibanDec]; if (k) { k.count = Math.max(0, k.count - 1); _updateDisplay(k); } }
    if (rstBtn) {
      const k = KEWAJIBAN[rstBtn.dataset.kewajibanReset];
      if (k) {
        if (k.mode === 'income') { k.income = 0; const inp = document.getElementById(k.idIncome); if (inp) inp.value = ''; }
        else {
          k.count = 0;
          if ('ikhlas' in k) { k.ikhlas = 0; const ik = document.getElementById(k.idIkhlas); if (ik) ik.value = ''; }
        }
        _updateDisplay(k);
      }
    }
    if (bayBtn) {
      const k = KEWAJIBAN[bayBtn.dataset.kewajibanBayar];
      if (!k) return;
      if (_nominalOf(k) <= 0) {
        alert(k.mode === 'income' ? 'Masukkan penghasilan Anda terlebih dahulu.' : `Silakan tentukan jumlah ${k.satuan} terlebih dahulu.`);
        return;
      }
      showPage(k.bayarPageId);
    }
    if (submitBtn) { _submitKewajibanKeDatabase(); showPaymentSuccess(); }
  });

  /* ═══════════════ EVENT: input penghasilan (mode persepuluhan) ═══════════════ */
  document.addEventListener('input', e => {
    const inp = e.target.closest('[data-income]');
    if (!inp) return;
    const k = KEWAJIBAN[inp.dataset.income];
    if (!k) return;
    const digits = inp.value.replace(/\D/g, '');
    k.income = digits ? parseInt(digits, 10) : 0;
    inp.value = k.income > 0 ? k.income.toLocaleString('id-ID') : '';
    _updateDisplay(k);
  });

  /* ═══════════════ EVENT: input donasi seikhlasnya (Stipendium) ═══════════════ */
  document.addEventListener('input', e => {
    const inp = e.target.closest('[data-ikhlas]');
    if (!inp) return;
    const k = KEWAJIBAN[inp.dataset.ikhlas];
    if (!k) return;
    const digits = inp.value.replace(/\D/g, '');
    k.ikhlas = digits ? parseInt(digits, 10) : 0;
    inp.value = k.ikhlas > 0 ? k.ikhlas.toLocaleString('id-ID') : '';
    _updateDisplay(k);
  });

  /* ═══════════════ EVENT: upload bukti ═══════════════ */
  document.addEventListener('change', e => {
    const input = e.target;
    if (!input.dataset.buktiFor) return;
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = document.getElementById(input.dataset.buktiFor);
      const cam = document.getElementById(input.dataset.buktiCam);
      if (img) { img.src = ev.target.result; img.style.display = 'block'; }
      if (cam) cam.style.display = 'none';
      window.__buktiUploaded = true;
    };
    reader.readAsDataURL(file);
  });

  /* ═══════════════ TEMPLATE BUILDERS ═══════════════ */

  function _renderMenuKewajiban() {
    const el = document.getElementById('page-menu-kewajiban');
    if (!el) return;

    el.innerHTML = `
      <div class="kewmenu-page">
        <div class="kewmenu-header">
          <h1 class="kewmenu-title">Kewajiban</h1>
          <p class="kewmenu-sub">Tunaikan kewajiban Anda dengan mudah dan terpercaya</p>
        </div>

        <div class="kewmenu-grid">

          <div class="kewmenu-card" onclick="pilihKewajiban('zakat-fitrah')">
            <div class="kewmenu-card-img">
              <img src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80" alt="Zakat Fitrah">
              <div class="kewmenu-card-badge" style="color:#2ecc40">ZAKAT<br>FITRAH</div>
            </div>
            <div class="kewmenu-card-body">
              <div class="kewmenu-card-title">Zakat Fitrah</div>
              <div class="kewmenu-card-desc">Sempurnakan ibadah puasa Ramadan dengan menunaikan zakat fitrah <strong>Rp 50.000/Jiwa</strong></div>
              <button class="kewmenu-card-btn">Bayar Sekarang</button>
            </div>
          </div>

          <div class="kewmenu-card" onclick="pilihKewajiban('persepuhan')">
            <div class="kewmenu-card-img">
              <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80" alt="Persepuluhan">
              <div class="kewmenu-card-badge" style="color:#f7c948">PERSE<br>PULUHAN</div>
            </div>
            <div class="kewmenu-card-body">
              <div class="kewmenu-card-title">Persepuluhan</div>
              <div class="kewmenu-card-desc">Sisihkan <strong>10%</strong> dari penghasilan Anda sebagai bentuk syukur dan kepedulian kepada sesama</div>
              <button class="kewmenu-card-btn">Bayar Sekarang</button>
            </div>
          </div>

          <div class="kewmenu-card" onclick="pilihKewajiban('stipendium')">
            <div class="kewmenu-card-img">
              <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80" alt="Stipendium">
              <div class="kewmenu-card-badge" style="color:#7ee8a0">STIPEN<br>DIUM</div>
            </div>
            <div class="kewmenu-card-body">
              <div class="kewmenu-card-title">Stipendium</div>
              <div class="kewmenu-card-desc">Bantu pendidikan anak-anak kurang mampu dengan stipendium <strong>Rp 100.000/Siswa</strong></div>
              <button class="kewmenu-card-btn">Bayar Sekarang</button>
            </div>
          </div>

        </div>
      </div>`;
  }

  function _renderKewajiban(cfg) {
    const el = document.getElementById(cfg.pageId);
    if (!el) return;

    const heroDescHtml = cfg.heroDesc.split('\n').join('<br>');
    const badgeHtml = cfg.badgeText.split('\n').join('<br>');
    const deskHtml = cfg.deskripsi.map(p => `<p>${p}</p>`).join('');

    const icCalc = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="9" y2="11"/><line x1="12" y1="11" x2="13" y2="11"/><line x1="16" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="9" y2="15"/><line x1="12" y1="15" x2="13" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></svg>`;
    const icMoney = `<svg width="28" height="28" viewBox="0 0 24 24" fill="#1a1a1a"><path d="M7 7h10l-1.4-2.8a1 1 0 0 0-.9-.55H9.3a1 1 0 0 0-.9.55L7 7z" opacity="0.85"/><path d="M5.5 8.2C4.6 9 4 10.5 4 12.5 4 16.6 7.6 20 12 20s8-3.4 8-7.5c0-2-0.6-3.5-1.5-4.3C17.7 7.5 15 7 12 7s-5.7.5-6.5 1.2zM12 10.2c1.4 0 2.5.6 2.5 1.6h-1.6c0-.3-.4-.5-.9-.5s-.9.2-.9.5c0 .3.4.4 1.1.6 1.1.2 2.3.6 2.3 1.9 0 1-.9 1.5-2 1.7v.9h-1.3v-.9c-1.3-.2-2.2-.8-2.2-1.8h1.6c0 .4.4.6 1 .6.5 0 .9-.2.9-.5 0-.3-.4-.5-1.2-.7-1-.2-2.2-.6-2.2-1.8 0-.9.8-1.5 1.9-1.7v-.9h1.3v.9z" fill="#fff"/><path d="M5.5 8.2C4.6 9 4 10.5 4 12.5 4 16.6 7.6 20 12 20s8-3.4 8-7.5c0-2-0.6-3.5-1.5-4.3C17.7 7.5 15 7 12 7s-5.7.5-6.5 1.2z" fill="none"/></svg>`;
    const icPlus = `<svg width="20" height="20" viewBox="0 0 16 16"><rect x="6.5" y="0" width="3" height="16" rx="1.5" fill="#1a1a1a"/><rect x="0" y="6.5" width="16" height="3" rx="1.5" fill="#1a1a1a"/></svg>`;
    const icMinus = `<svg width="20" height="4" viewBox="0 0 16 3"><rect width="16" height="3" rx="1.5" fill="#1a1a1a"/></svg>`;
    const icRefresh = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`;
    const icHeart = `<svg width="26" height="26" viewBox="0 0 24 24" fill="#4f8a3a"><path d="M12 21s-7.5-4.8-10-9.2C.6 9.1 1.6 5.7 4.6 4.8c1.9-.6 3.9.2 5 1.7l.9 1.2.9-1.2c1.1-1.5 3.1-2.3 5-1.7 3 .9 4 4.3 2.6 7C19.5 16.2 12 21 12 21z"/></svg>`;

    let middleHtml;
    if (cfg.mode === 'income') {
      middleHtml = `
        <div class="kewajiban-field-label">${cfg.labelIncome}</div>
        <div class="kewajiban-counter-row">
          <div class="kewajiban-icon-box">${icCalc}</div>
          <div class="kewajiban-input-box">
            <span class="kib-prefix">Rp.</span>
            <input class="kewajiban-income-input" id="${cfg.idIncome}" inputmode="numeric"
                   placeholder="0" data-income="${cfg.key}">
          </div>
        </div>

        <div class="kewajiban-field-label">${cfg.labelHasil}</div>
        <div class="kewajiban-counter-row">
          <div class="kewajiban-icon-box money">${icMoney}</div>
          <div class="kewajiban-nominal-row">
            <span class="kewajiban-nominal-val" id="${cfg.idNominal}">Rp.</span>
            <button class="kewajiban-refresh-btn" data-kewajiban-reset="${cfg.key}">${icRefresh}</button>
          </div>
        </div>

        <div class="kewajiban-simulasi" id="${cfg.idSimulasi}">
          Contoh: penghasilan <b>Rp 1.000.000</b> &rarr; persepuluhan <b style="color:#5f8f3f">Rp 100.000</b>
        </div>`;
    } else {
      middleHtml = `
        <div class="kewajiban-field-label">${cfg.labelJumlah}</div>
        <div class="kewajiban-counter-row">
          <div class="kewajiban-icon-box">${icCalc}</div>
          <div class="kewajiban-counter">
            <button class="kewajiban-counter-btn" data-kewajiban-dec="${cfg.key}">${icMinus}</button>
            <span class="kewajiban-counter-val" id="${cfg.idJumlah}"></span>
            <button class="kewajiban-counter-btn" data-kewajiban-inc="${cfg.key}">${icPlus}</button>
          </div>
        </div>

        <div class="kewajiban-field-label">Kewajiban yang harus dibayar</div>
        <div class="kewajiban-counter-row">
          <div class="kewajiban-icon-box money">${icMoney}</div>
          <div class="kewajiban-nominal-row">
            <span class="kewajiban-nominal-val" id="${cfg.idNominal}">Rp.</span>
            <button class="kewajiban-refresh-btn" data-kewajiban-reset="${cfg.key}">${icRefresh}</button>
          </div>
        </div>${cfg.allowIkhlas ? `

        <div class="kewajiban-or-divider"><span>atau</span></div>

        <div class="kewajiban-field-label">Donasi Seikhlasnya</div>
        <div class="kewajiban-counter-row">
          <div class="kewajiban-icon-box">${icHeart}</div>
          <div class="kewajiban-input-box">
            <span class="kib-prefix">Rp.</span>
            <input class="kewajiban-income-input" id="${cfg.idIkhlas}" inputmode="numeric"
                   placeholder="0" data-ikhlas="${cfg.key}">
          </div>
        </div>
        <div class="kewajiban-simulasi kewajiban-ikhlas-hint">
          Isi nominal bebas sesuai keikhlasan Anda. Jika diisi, nominal inilah yang akan dibayarkan.
        </div>` : ''}`;
    }

    el.innerHTML = `
      <div class="kewajiban-page">
        <div class="kewajiban-hero-wrap">
          <div class="kewajiban-hero-img">
            <img src="${cfg.heroImg}" alt="${cfg.judul}">
            <div class="kewajiban-hero-overlay">
              <div class="kewajiban-hero-badge" style="color:${cfg.badgeColor}">${badgeHtml}</div>
              <p class="kewajiban-hero-desc">${heroDescHtml}</p>
            </div>
          </div>

          <div class="kewajiban-form-card">
            <h2 class="kewajiban-form-title">${cfg.judul}</h2>
            <p class="kewajiban-form-sub">${cfg.sub}</p>
            ${middleHtml}
            <button class="kewajiban-bayar-btn" data-kewajiban-bayar="${cfg.key}">Bayar Kewajiban</button>
          </div>
        </div>
        <div class="kewajiban-desc-block">${deskHtml}</div>
      </div>`;
  }

  function _renderBayar(cfg) {
    const el = document.getElementById(cfg.pageId);
    if (!el) return;

    const icCamera = `<svg width="44" height="44" viewBox="0 0 24 24" fill="#bbb"><path d="M9 3 7.5 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.5L15 3H9z"/><circle cx="12" cy="13" r="3.4" fill="#ddd"/></svg><span class="bukti-camera-hint">Ketuk untuk unggah bukti pembayaran</span>`;

    el.innerHTML = `
      <div class="bayar-page bayar-kewajiban-page">
        <div class="bayar-mini-banner">
          <div class="bayar-mini-img"><img src="${cfg.bannerImg}" alt=""></div>
          <div class="bayar-mini-title">${cfg.bannerJudul}</div>
        </div>

        <div class="bayar-body">
          <div class="bayar-label">Jumlah Kewajiban Dibayar</div>
          <div class="bayar-amount-box">Rp. <span id="${cfg.idBayarNom}" class="bkn-green">0</span></div>

          <div class="bayar-label">No.Bank</div>
          <div class="bayar-bank-box"><span class="bayar-bank-number">2429529058325025-52</span></div>

          <div class="bayar-label">Bukti Pembayaran</div>
          <div class="bayar-bukti-area" id="${cfg.idBuktiImg}Area"
               onclick="document.getElementById('${cfg.idBuktiInp}').click()">
            <img id="${cfg.idBuktiImg}" alt="" style="display:none">
            <div class="bukti-camera" id="${cfg.idBuktiCam}">${icCamera}</div>
            <input type="file" id="${cfg.idBuktiInp}" accept="image/*" style="display:none"
                   data-bukti-for="${cfg.idBuktiImg}" data-bukti-cam="${cfg.idBuktiCam}">
          </div>

          <div class="bayar-label-big">Profil Anda</div>
          <div class="bayar-field-label">${cfg.labelNama}</div>
          <input type="text" class="bayar-input" id="${cfg.idNama}">
          <div class="bayar-field-label">No.WA</div>
          <input type="text" class="bayar-input" id="${cfg.idWa}">
        </div>

        <button class="bayar-submit-btn" data-submit-kewajiban="true">LAKUKAN TRANGSAKSI</button>
      </div>`;
  }

  /* ═══════════════ UTIL ═══════════════ */
  function _nominalOf(k) {
    if (k.mode === 'income') return Math.floor(k.income * k.persen);
    if (k.ikhlas && k.ikhlas > 0) return k.ikhlas; // donasi seikhlasnya menggantikan hitungan jumlah
    return k.count * k.harga;
  }

  function _updateDisplay(k) {
    if (k.mode === 'income') {
      const nominal = _nominalOf(k);
      const nomEl = document.getElementById(k.idNominal);
      if (nomEl) nomEl.textContent = k.income > 0 ? _rpDot(nominal) : 'Rp.';
      const simEl = document.getElementById(k.idSimulasi);
      if (simEl) {
        simEl.innerHTML = k.income > 0
          ? `Penghasilan <b>${_rpSpace(k.income)}</b> &times; 10% = Persepuluhan <b style="color:#5f8f3f">${_rpSpace(nominal)}</b>`
          : `Contoh: penghasilan <b>Rp 1.000.000</b> &rarr; persepuluhan <b style="color:#5f8f3f">Rp 100.000</b>`;
      }
    } else {
      const valEl = document.getElementById(k.idJumlah);
      const nomEl = document.getElementById(k.idNominal);
      const nominal = _nominalOf(k);
      if (valEl) valEl.textContent = k.count === 0 ? '' : k.count;
      if (nomEl) nomEl.textContent = nominal === 0 ? 'Rp.' : _rpDot(nominal);
    }
  }
});

/* ═══════════════ UTILITY GLOBAL — observer halaman ═══════════════ */
if (typeof _observePage === 'undefined') {
  function _observePage(pageId, callback) {
    const el = document.getElementById(pageId);
    if (!el) return;
    let last = false;
    new MutationObserver(() => {
      const visible = el.classList.contains('visible');
      if (visible && !last) { last = true; callback(); }
      else if (!visible) { last = false; }
    }).observe(el, { attributes: true, attributeFilter: ['class'] });
  }
}
