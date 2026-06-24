/**
 * pages/pilar.js  —  Pilar Kebaikan
 */
document.addEventListener('DOMContentLoaded', function () {

  /* ── SVG Icons ── */
  var IC_CHK  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3a6b28" stroke-width="2.8" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var IC_BELL = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
  var IC_BELL_G = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
  var IC_OK   = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4a8c30" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>';

  /* ── Donatur data ── */
  var donaturList = [
    { inisial:'AR', nama:'Ahmad R.',     meta:'Bergabung Mar 2024 · 15 bln aktif', nominal:'Rp.100.000', badge:'SETIA'  },
    { inisial:'SN', nama:'Siti N.',      meta:'Bergabung Jan 2024 · 17 bln aktif', nominal:'Rp.50.000',  badge:'AKTIF'  },
    { inisial:'B',  nama:'Hamba Allah',  meta:'Bergabung Apr 2025 · 2 bln aktif',  nominal:'Rp.200.000', badge:'BARU'   },
    { inisial:'YP', nama:'Yusuf P.',     meta:'Bergabung Okt 2023 · 20 bln aktif', nominal:'Rp.150.000', badge:'SETIA'  },
  ];

  var donaturHtml = donaturList.map(function(d){
    return '<div class="pilar-donatur-row">' +
      '<div class="pilar-donatur-avatar">' + d.inisial + '</div>' +
      '<div class="pilar-donatur-info">' +
        '<div class="pilar-donatur-name">' + d.nama + '</div>' +
        '<div class="pilar-donatur-meta">' + d.meta + '</div>' +
      '</div>' +
      '<span class="pilar-donatur-badge">' + d.badge + '</span>' +
      '<div class="pilar-donatur-amount">' + d.nominal + '</div>' +
    '</div>';
  }).join('');

  /* ── Build Page ── */
  document.getElementById('page-pilar-kebaikan').innerHTML =
    '<div class="pilar-page">' +

    /* HERO */
    '<div class="pilar-hero">' +
      '<div class="pilar-hero-left">' +
        '<div class="pilar-hero-title">Menjadi Bagian<br>Pengingat Setiap<br>Bulannya</div>' +
        '<p class="pilar-hero-sub">Bergabunglah sebagai donatur tetap dan kami akan mengingatkan Anda setiap bulan untuk terus menyebarkan kebaikan bersama.</p>' +
        '<div class="pilar-hero-chips">' +
          '<span class="pilar-chip">' + IC_CHK + ' Notifikasi bulanan otomatis</span>' +
          '<span class="pilar-chip">' + IC_CHK + ' Laporan donasi transparan</span>' +
          '<span class="pilar-chip">' + IC_CHK + ' Bebas berhenti kapan saja</span>' +
        '</div>' +
        '<button class="pilar-cta-btn" onclick="document.getElementById(\'pilar-form-anchor\').scrollIntoView({behavior:\'smooth\'})">DAFTAR SEKARANG</button>' +
      '</div>' +
      '<div class="pilar-hero-right">' +
        '<img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80" alt="Pilar Kebaikan">' +
      '</div>' +
    '</div>' +

    /* STATS */
    '<div class="pilar-stats">' +
      '<div class="pilar-stat"><div class="pilar-stat-num">1.240+</div><div class="pilar-stat-lbl">Donatur Tetap Aktif</div></div>' +
      '<div class="pilar-stat"><div class="pilar-stat-num">Rp.148 Jt</div><div class="pilar-stat-lbl">Disalurkan Bulan Ini</div></div>' +
      '<div class="pilar-stat"><div class="pilar-stat-num">98%</div><div class="pilar-stat-lbl">Tingkat Kelanjutan</div></div>' +
    '</div>' +

    /* CARA KERJA */
    '<div class="pilar-section">' +
      '<div class="pilar-section-title">Cara Kerjanya</div>' +
      '<div class="pilar-section-desc">Empat langkah mudah untuk menjadi donatur tetap Pilar Kebaikan.</div>' +
      '<div class="pilar-steps">' +
        '<div class="pilar-step"><div class="pilar-step-num-circle"><span>1</span></div><div class="pilar-step-name">Isi Formulir</div><div class="pilar-step-desc">Lengkapi data diri dan pilih nominal donasi bulanan</div></div>' +
        '<div class="pilar-step"><div class="pilar-step-num-circle"><span>2</span></div><div class="pilar-step-name">Verifikasi</div><div class="pilar-step-desc">Lakukan donasi pertama, tim kami verifikasi pendaftaran</div></div>' +
        '<div class="pilar-step"><div class="pilar-step-num-circle"><span>3</span></div><div class="pilar-step-name">Terima Notifikasi</div><div class="pilar-step-desc">Pengingat WhatsApp/email setiap tanggal 1 bulan</div></div>' +
        '<div class="pilar-step"><div class="pilar-step-num-circle"><span>4</span></div><div class="pilar-step-name">Terus Berbagi</div><div class="pilar-step-desc">Terima laporan dan lihat dampak nyata donasi Anda</div></div>' +
      '</div>' +
    '</div>' +

    /* SYARAT */
    '<div class="pilar-section" style="padding-top:0">' +
      '<div class="pilar-section-title">Syarat Donatur Tetap</div>' +
      '<div class="pilar-section-desc">Yang perlu Anda siapkan sebelum mendaftar sebagai donatur tetap.</div>' +
      '<div class="pilar-syarat-grid">' +
        '<div class="pilar-syarat-card"><div class="pilar-syarat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a8c30" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 10h.01"/><path d="M8 14h8"/><path d="M12 10h4"/></svg></div><div class="pilar-syarat-text"><h4>Identitas Diri (KTP/SIM)</h4><p>Foto KTP atau SIM yang masih berlaku untuk verifikasi identitas donatur.</p></div></div>' +
        '<div class="pilar-syarat-card"><div class="pilar-syarat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a8c30" stroke-width="2" stroke-linecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" stroke-width="3"/></svg></div><div class="pilar-syarat-text"><h4>Nomor WhatsApp Aktif</h4><p>Nomor WA aktif untuk pengiriman notifikasi dan laporan bulanan.</p></div></div>' +
        '<div class="pilar-syarat-card"><div class="pilar-syarat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a8c30" stroke-width="2" stroke-linecap="round"><path d="M3 22h18M3 10h18M5 6l7-4 7 4M4 10v12M20 10v12M9 10v12M15 10v12"/></svg></div><div class="pilar-syarat-text"><h4>Rekening / Dompet Digital</h4><p>Rekening bank atau dompet digital (GoPay, OVO, DANA) untuk donasi rutin.</p></div></div>' +
        '<div class="pilar-syarat-card"><div class="pilar-syarat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a8c30" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div><div class="pilar-syarat-text"><h4>Izin Notifikasi</h4><p>Mengizinkan pengiriman 1–2 notifikasi per bulan via WhatsApp atau email.</p></div></div>' +
        '<div class="pilar-syarat-card"><div class="pilar-syarat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a8c30" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div><div class="pilar-syarat-text"><h4>Persetujuan Privasi</h4><p>Menyetujui penggunaan data untuk pelaporan internal. Data tidak dibagikan ke pihak lain.</p></div></div>' +
        '<div class="pilar-syarat-card"><div class="pilar-syarat-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a8c30" stroke-width="2" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><div class="pilar-syarat-text"><h4>Komitmen Nominal Tetap</h4><p>Bersedia menyisihkan minimal Rp.10.000 setiap bulan. Bebas berhenti kapan saja.</p></div></div>' +
      '</div>' +
    '</div>' +

    /* NOTIFIKASI */
    '<div class="pilar-section" style="padding-top:0">' +
      '<div class="pilar-notif-banner">' +
        '<div>' +
          '<div class="pilar-notif-tag">' + IC_BELL_G + '&nbsp; Pengingat Otomatis</div>' +
          '<div class="pilar-notif-h">Jangan Sampai Terlewat<br>Berbuat Kebaikan</div>' +
          '<div class="pilar-notif-p">Setiap tanggal 1 bulan berjalan, notifikasi pengingat akan dikirim langsung ke WhatsApp atau email Anda. Pilih channel yang paling nyaman dan pastikan Anda tidak pernah melewatkan momen berbagi.</div>' +
        '</div>' +
        '<div class="pilar-notif-cards">' +
          '<div class="pilar-ncard"><div class="pilar-ncard-icon">' + IC_BELL + '</div><div><div class="pilar-ncard-app">Teman Berbagi</div><div class="pilar-ncard-msg">Saatnya donasi bulan Juli, Kak! Kebaikan Anda sangat berarti.</div><div class="pilar-ncard-time">1 Jul · 08:00</div></div></div>' +
          '<div class="pilar-ncard"><div class="pilar-ncard-icon">' + IC_BELL + '</div><div><div class="pilar-ncard-app">WhatsApp · Teman Berbagi</div><div class="pilar-ncard-msg">Terima kasih sudah berbagi bulan lalu! Yuk lanjutkan kebaikan.</div><div class="pilar-ncard-time">1 Jun · 08:00</div></div></div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    /* FORM */
    '<div class="pilar-section" style="padding-top:0" id="pilar-form-anchor">' +
      '<div class="pilar-form-wrap" id="pilarFormWrap">' +
        '<div class="pilar-form-title">Daftar Sebagai Donatur Tetap</div>' +
        '<div class="pilar-form-sub">Isi formulir berikut dan tim kami akan menghubungi Anda dalam 1×24 jam untuk konfirmasi.</div>' +
        '<div class="pilar-form-grid">' +
          '<div class="pilar-field"><label>Nama Lengkap *</label><input type="text" id="pilarNama" placeholder="Nama lengkap Anda"></div>' +
          '<div class="pilar-field"><label>No. WhatsApp *</label><input type="text" id="pilarWa" placeholder="08123456789"></div>' +
          '<div class="pilar-field"><label>Email (Opsional)</label><input type="email" id="pilarEmail" placeholder="email@contoh.com"></div>' +
          '<div class="pilar-field"><label>Kota / Domisili *</label><input type="text" id="pilarKota" placeholder="Kota Anda"></div>' +
          '<div class="pilar-field full"><label>Nominal Donasi per Bulan *</label>' +
            '<div class="pilar-nom-chips" id="pilarChips">' +
              '<button class="pilar-nom-chip" data-val="10000">Rp.10.000</button>' +
              '<button class="pilar-nom-chip" data-val="25000">Rp.25.000</button>' +
              '<button class="pilar-nom-chip" data-val="50000">Rp.50.000</button>' +
              '<button class="pilar-nom-chip" data-val="100000">Rp.100.000</button>' +
              '<button class="pilar-nom-chip" data-val="150000">Rp.150.000</button>' +
              '<button class="pilar-nom-chip" data-val="200000">Rp.200.000</button>' +
            '</div>' +
            '<input type="text" id="pilarNominal" placeholder="Atau ketik nominal lain…">' +
          '</div>' +
          '<div class="pilar-field full"><label>Channel Notifikasi *</label>' +
            '<select id="pilarChannel"><option value="">-- Pilih channel --</option><option value="wa">WhatsApp</option><option value="email">Email</option><option value="wa-email">WhatsApp & Email</option></select>' +
          '</div>' +
          '<div class="pilar-field full">' +
            '<div class="pilar-toggle-row"><div><strong>Aktifkan Pengingat Donasi Bulanan</strong><span>Notifikasi dikirim setiap tanggal 1 bulan berjalan</span></div><label class="pilar-switch"><input type="checkbox" id="pilarToggleNotif" checked><span class="pilar-slider"></span></label></div>' +
          '</div>' +
          '<div class="pilar-field full">' +
            '<div class="pilar-toggle-row"><div><strong>Saya menyetujui syarat & kebijakan privasi</strong><span>Data Anda aman dan tidak dibagikan ke pihak ketiga</span></div><label class="pilar-switch"><input type="checkbox" id="pilarTogglePrivacy"><span class="pilar-slider"></span></label></div>' +
          '</div>' +
        '</div>' +
        '<button class="pilar-submit-btn" id="pilarSubmit">DAFTAR JADI DONATUR TETAP</button>' +
      '</div>' +
      '<div class="pilar-success" id="pilarSuccess">' +
        '<div class="pilar-success-check">' + IC_OK + '</div>' +
        '<div class="pilar-success-title">Pendaftaran Berhasil!</div>' +
        '<div class="pilar-success-desc">Anda resmi terdaftar sebagai donatur tetap Pilar Kebaikan. Tim kami akan menghubungi melalui WhatsApp dalam 1×24 jam.</div>' +
        '<button class="pilar-success-back" onclick="showPage(\'donasi\')">Kembali ke Beranda</button>' +
      '</div>' +
    '</div>' +

    /* DONATUR LIST */
    '<div class="pilar-donatur-section">' +
      '<div class="pilar-section-title" style="margin-bottom:20px">Donatur Tetap Aktif</div>' +
      donaturHtml +
    '</div>' +

    '</div>'; /* end pilar-page */

  /* ── Events ── */

  document.getElementById('pilarChips').addEventListener('click', function(e){
    var btn = e.target.closest('.pilar-nom-chip');
    if (!btn) return;
    document.querySelectorAll('.pilar-nom-chip').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('pilarNominal').value = 'Rp.' + Number(btn.dataset.val).toLocaleString('id-ID');
  });

  document.getElementById('pilarNominal').addEventListener('input', function(){
    document.querySelectorAll('.pilar-nom-chip').forEach(function(b){ b.classList.remove('active'); });
  });

  document.getElementById('pilarSubmit').addEventListener('click', function(){
    var nama    = document.getElementById('pilarNama').value.trim();
    var wa      = document.getElementById('pilarWa').value.trim();
    var kota    = document.getElementById('pilarKota').value.trim();
    var nominal = document.getElementById('pilarNominal').value.trim();
    var channel = document.getElementById('pilarChannel').value;
    var privacy = document.getElementById('pilarTogglePrivacy').checked;

    if (!nama || !wa || !kota || !nominal || !channel) {
      _toast('Mohon lengkapi semua bidang yang wajib diisi (*).');
      return;
    }
    if (!privacy) {
      _toast('Silakan setujui syarat & kebijakan privasi terlebih dahulu.');
      return;
    }

    try {
      localStorage.setItem('tb_pilar_donatur', JSON.stringify({
        nama: nama, wa: wa, kota: kota, nominal: nominal,
        channel: channel,
        notifAktif: document.getElementById('pilarToggleNotif').checked,
        terdaftar: new Date().toISOString()
      }));
    } catch(e){}

    document.getElementById('pilarFormWrap').style.display = 'none';
    document.getElementById('pilarSuccess').classList.add('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function _toast(msg){
    var el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = 'position:fixed;top:90px;left:50%;transform:translateX(-50%);background:#c0392b;color:#fff;padding:11px 26px;border-radius:100px;z-index:9999;font-size:13.5px;font-weight:600;box-shadow:0 4px 14px rgba(0,0,0,0.15);white-space:nowrap';
    document.body.appendChild(el);
    setTimeout(function(){ el.remove(); }, 3000);
  }

});
