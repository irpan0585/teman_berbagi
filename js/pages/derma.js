/**
 * pages/derma.js
 * Halaman: #page-derma (hero + 3 tab) dan #page-bayar-derma
 */

const _SIL_MALE_D   = '<svg viewBox="0 0 24 24" fill="#1d1d1d"><circle cx="12" cy="8" r="4.2"/><path d="M3.5 21c0-4.7 3.8-8 8.5-8s8.5 3.3 8.5 8z"/></svg>';
const _SIL_FEMALE_D = '<svg viewBox="0 0 24 24" fill="#1d1d1d"><path d="M12 1.6c-3 0-5.4 2.3-5.4 5.6 0 1.3.4 2.4 1.1 3.3-.6.3-1.1.9-1.4 1.7-.5 1.2-.7 3-.7 5.2 0 .4.1.7.2 1h2.1c-.1-2.1 0-3.8.3-4.6.2-.5.4-.7.6-.8.9.7 2 1.1 3.3 1.1s2.4-.4 3.3-1.1c.2.1.4.3.6.8.3.8.4 2.5.3 4.6h2.1c.1-.3.2-.6.2-1 0-2.2-.2-4-.7-5.2-.3-.8-.8-1.4-1.4-1.7.7-.9 1.1-2 1.1-3.3 0-3.3-2.4-5.6-5.4-5.6z"/></svg>';
const _COPY_SVG_D   = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const _CHECK_SVG_D  = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3f9e2f" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
const _CAM_SVG_D    = '<svg width="44" height="44" viewBox="0 0 24 24" fill="#bbb"><path d="M9 3 7.5 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.5L15 3H9z"/><circle cx="12" cy="13" r="3.4" fill="#ddd"/></svg><span class="bukti-camera-hint">Ketuk untuk unggah bukti pembayaran</span>';

document.addEventListener('DOMContentLoaded', function() {

  /* ═══════════════ HALAMAN DERMA ═══════════════ */
  var dermawanHtml = [
    { nama: '',           jumlah: 100000, gender: 'female' },
    { nama: 'Hamba Allah', jumlah: 100000, gender: 'male'   },
  ].map(function(dw) {
    return '<div class="derma-dermawan-item">' +
      '<div class="derma-dermawan-avatar">' + (dw.gender === 'female' ? _SIL_FEMALE_D : _SIL_MALE_D) + '</div>' +
      '<div class="derma-dermawan-info">' +
        '<div class="derma-dermawan-name">' + dw.nama + '</div>' +
        '<div class="derma-dermawan-type">Donasi</div>' +
        '<div class="derma-dermawan-amount">Rp.' + Number(dw.jumlah).toLocaleString('id-ID') + '</div>' +
      '</div></div>';
  }).join('');

  document.getElementById('page-derma').innerHTML =
    '<div class="derma-page">' +
      '<div class="derma-hero">' +
        '<img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1400&q=80" alt="Derma">' +
        '<button class="derma-hero-cta" onclick="showPage(\'bayar-derma\')">Lakukan kebaikan</button>' +
      '</div>' +
      '<div class="derma-tabs-bar">' +
        '<span class="derma-tab active" id="dtab-tentang"   onclick="switchDermaTab(\'tentang\')">Tentang</span>' +
        '<span class="derma-tab"       id="dtab-imformasi"  onclick="switchDermaTab(\'imformasi\')">Imformasi</span>' +
        '<span class="derma-tab"       id="dtab-dermawan"   onclick="switchDermaTab(\'dermawan\')">Dermawan</span>' +
      '</div>' +
      '<div class="derma-tab-content active" id="dcontent-tentang">' +
        '<div class="derma-text-body">' +
          '<p>Dengan berbagi, kita bisa membantu mereka yang membutuhkan mulai dari memenuhi kebutuhan pangan, membantu pendidikan, mendukung pembangunan rumah ibadah, hingga meringankan beban hidup masyarakat kurang mampu. Setiap donasi yang Sahabat berikan bukan sekadar bantuan materi, tetapi juga menjadi sumber harapan, kebahagiaan, dan masa depan yang lebih baik bagi mereka.</p>' +
          '<p>Diriwayatkan oleh Anas bin Malik, Nabi Muhammad bersabda:<br>' +
             '&ldquo;Sedekah itu dapat memadamkan dosa sebagaimana air memadamkan api.&rdquo; (HR. Tirmidzi)</p>' +
          '<p>Dalam Alkitab tertulis:<br>' +
             '&ldquo;Segala sesuatu yang kamu lakukan untuk salah seorang dari saudara-Ku yang paling hina ini, kamu telah melakukannya untuk Aku.&rdquo; (Matius 25:40)</p>' +
        '</div>' +
      '</div>' +
      '<div class="derma-tab-content" id="dcontent-imformasi">' +
        '<div class="derma-info-list">' +
          '<div class="derma-info-article">' +
            '<img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&q=80" alt="">' +
            '<p>Dengan berbagi, kita bisa membantu mereka yang membutuhkan mulai dari memenuhi kebutuhan pangan, membantu pendidikan, mendukung pembangunan rumah</p>' +
          '</div>' +
          '<div class="derma-info-article reverse">' +
            '<p>Dengan berbagi, kita bisa membantu mereka yang membutuhkan mulai dari memenuhi kebutuhan pangan, membantu pendidikan, mendukung pembangunan rumah</p>' +
            '<img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&q=80" alt="">' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="derma-tab-content" id="dcontent-dermawan">' +
        '<div class="derma-dermawan-list">' + dermawanHtml + '</div>' +
      '</div>' +
    '</div>';

  /* ═══════════════ HALAMAN BAYAR DERMA ═══════════════ */
  document.getElementById('page-bayar-derma').innerHTML =
    '<div class="bayar-page">' +
      '<div class="bayar-mini-banner">' +
        '<div class="bayar-mini-img"><img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=80" alt=""></div>' +
        '<div class="bayar-mini-title">Derma &mdash; Mari lakukan kebaikan bersama</div>' +
      '</div>' +
      '<div class="bayar-body">' +
        '<div class="bayar-label">Masukan Nominal</div>' +
        '<input type="text" class="bayar-nominal-input" id="dermaNominalInput" placeholder="Rp." readonly>' +
        '<div class="bayar-label">Pilih Nominal</div>' +
        '<div class="nominal-grid" id="dermaNominalGrid">' +
          '<button class="nominal-btn" data-val="10000">Rp.10.000</button>' +
          '<button class="nominal-btn" data-val="50000">Rp.50.000</button>' +
          '<button class="nominal-btn" data-val="100000">Rp.100.000</button>' +
          '<button class="nominal-btn" data-val="150000">Rp.150.000</button>' +
          '<button class="nominal-btn" data-val="200000">Rp.200.000</button>' +
          '<button class="nominal-btn" data-val="250000">Rp.250.000</button>' +
        '</div>' +
        '<div class="bayar-label">No.Bank</div>' +
        '<div class="bayar-bank-card">' +
          '<span class="bri-logo">BRI</span>' +
          '<span class="bayar-bank-number" id="dermaBankNumber">2429529058325025-52</span>' +
          '<button class="bayar-copy-btn" id="dermaCopyBank" aria-label="Salin">' + _COPY_SVG_D + '</button>' +
        '</div>' +
        '<div class="bayar-label">Bukti Pembayaran</div>' +
        '<div class="bayar-bukti-area" id="dermaBuktiArea">' +
          '<img id="dermaBuktiImg" alt="" style="display:none">' +
          '<div class="bukti-camera" id="dermaBuktiCam">' + _CAM_SVG_D + '</div>' +
          '<input type="file" id="dermaBuktiInput" accept="image/*" style="display:none"' +
                 ' data-bukti-for="dermaBuktiImg" data-bukti-cam="dermaBuktiCam">' +
        '</div>' +
        '<div class="bayar-label-big">Profil Anda</div>' +
        '<div class="bayar-field-label">Nama</div>' +
        '<input type="text" class="bayar-input" id="dermaNama">' +
        '<div class="bayar-field-label">No.WA</div>' +
        '<input type="text" class="bayar-input" id="dermaWa">' +
      '</div>' +
      '<button class="bayar-submit-btn" id="dermaSubmitBtn">LAKUKAN TRANGSAKSI</button>' +
    '</div>';

  /* ═══════════════ OBSERVER ═══════════════ */
  if (typeof _observePage === 'function') {
    _observePage('page-bayar-derma', function() {
      document.getElementById('dermaNominalInput').value = '';
      document.querySelectorAll('#dermaNominalGrid .nominal-btn').forEach(function(b) { b.classList.remove('active'); });
      document.getElementById('dermaBuktiImg').style.display   = 'none';
      document.getElementById('dermaBuktiCam').style.display   = 'flex';
      window.__buktiUploaded = false;
    });
  }

  /* ═══════════════ EVENTS ═══════════════ */
  // Pilih nominal
  document.getElementById('dermaNominalGrid').addEventListener('click', function(e) {
    var btn = e.target.closest('.nominal-btn');
    if (!btn) return;
    document.querySelectorAll('#dermaNominalGrid .nominal-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('dermaNominalInput').value = 'Rp.' + Number(btn.dataset.val).toLocaleString('id-ID');
  });

  // Salin nomor bank
  document.getElementById('dermaCopyBank').addEventListener('click', function() {
    var num = document.getElementById('dermaBankNumber').textContent;
    navigator.clipboard.writeText(num).catch(function() {});
    var btn = document.getElementById('dermaCopyBank');
    btn.innerHTML = _CHECK_SVG_D;
    setTimeout(function() { btn.innerHTML = _COPY_SVG_D; }, 1600);
  });

  // Klik area bukti → buka file picker
  document.getElementById('dermaBuktiArea').addEventListener('click', function() {
    document.getElementById('dermaBuktiInput').click();
  });

  // Upload bukti
  document.getElementById('dermaBuktiInput').addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      var img = document.getElementById('dermaBuktiImg');
      img.src = ev.target.result;
      img.style.display = 'block';
      document.getElementById('dermaBuktiCam').style.display = 'none';
      window.__buktiUploaded = true;
    };
    reader.readAsDataURL(file);
  });

  // Submit → sukses
  document.getElementById('dermaSubmitBtn').addEventListener('click', function() {
    showPage('sukses-donasi');
  });

  /* ═══════════════ SWITCH TAB DERMA ═══════════════ */
  window.switchDermaTab = function(name) {
    document.querySelectorAll('#page-derma .derma-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('#page-derma .derma-tab-content').forEach(function(c) { c.classList.remove('active'); });
    var tab = document.getElementById('dtab-' + name);
    var content = document.getElementById('dcontent-' + name);
    if (tab) tab.classList.add('active');
    if (content) content.classList.add('active');
  };
});
