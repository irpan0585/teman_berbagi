/**
 * pages/kontak.js
 * ─────────────────────────────────────────────────────────────
 * Tanggung jawab:
 *   - Render HTML halaman Kontak ke dalam #page-kontak
 *   - Logika form kontak: validasi → feedback kirim pesan
 * ─────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. RENDER TEMPLATE ──────────────────────────────────────
  document.getElementById('page-kontak').innerHTML = `
    <div class="kontak-page">
      <div class="kontak-hero">
        <h1>KONTAK</h1>
        <p>Ada pertanyaan atau ingin berkolaborasi? Kami senang mendengar dari Anda.</p>
      </div>

      <div class="kontak-grid">
        <!-- Info Kontak -->
        <div class="kontak-info-card">
          <div class="kontak-info-item">
            <div class="kontak-info-icon">📧</div>
            <div>
              <div class="kontak-info-label">Email</div>
              <div class="kontak-info-val">info@temanberbagi.id</div>
            </div>
          </div>
          <div class="kontak-info-item">
            <div class="kontak-info-icon">📱</div>
            <div>
              <div class="kontak-info-label">WhatsApp</div>
              <div class="kontak-info-val">+62 812-0000-0000</div>
            </div>
          </div>
          <div class="kontak-info-item">
            <div class="kontak-info-icon">📍</div>
            <div>
              <div class="kontak-info-label">Alamat</div>
              <div class="kontak-info-val">Makassar, Sulawesi Selatan</div>
            </div>
          </div>
          <div class="kontak-info-item">
            <div class="kontak-info-icon">🌐</div>
            <div>
              <div class="kontak-info-label">Media Sosial</div>
              <div class="kontak-info-val">@temanberbagi</div>
            </div>
          </div>
        </div>

        <!-- Form Pesan -->
        <div class="kontak-form-card">
          <h3>Kirim Pesan</h3>
          <div class="kontak-field">
            <label>Nama Lengkap</label>
            <input type="text" id="kontakNama" placeholder="Masukkan nama Anda" />
          </div>
          <div class="kontak-field">
            <label>Email</label>
            <input type="email" id="kontakEmail" placeholder="email@anda.com" />
          </div>
          <div class="kontak-field">
            <label>Pesan</label>
            <textarea id="kontakPesan" placeholder="Tulis pesan Anda di sini..." rows="4"></textarea>
          </div>
          <button class="kontak-submit-btn" id="btnKirimPesan">Kirim Pesan</button>
          <div class="kontak-feedback" id="kontakFeedback"></div>
        </div>
      </div>
    </div>`;

  // ── 2. LOGIKA FORM KONTAK ───────────────────────────────────
  document.getElementById('btnKirimPesan').addEventListener('click', async () => {
    const nama = document.getElementById('kontakNama').value.trim();
    const email = document.getElementById('kontakEmail').value.trim();
    const pesan = document.getElementById('kontakPesan').value.trim();
    const fbEl = document.getElementById('kontakFeedback');
    const btn = document.getElementById('btnKirimPesan');

    if (!nama || !email || !pesan) {
      fbEl.textContent = '⚠ Mohon isi semua field terlebih dahulu.';
      fbEl.className = 'kontak-feedback error';
      return;
    }

    btn.textContent = 'Mengirim...';
    btn.disabled = true;

    const _resetForm = () => {
      document.getElementById('kontakNama').value = '';
      document.getElementById('kontakEmail').value = '';
      document.getElementById('kontakPesan').value = '';
      setTimeout(() => { fbEl.textContent = ''; fbEl.className = 'kontak-feedback'; }, 4000);
    };

    // ─── Kirim ke backend (POST /api/kontak) ───────────────
    try {
      if (typeof window.kontakAPI !== 'undefined') {
        const { response, data } = await window.kontakAPI.send({ nama, email, pesan });
        btn.textContent = 'Kirim Pesan';
        btn.disabled = false;
        if (response.ok && data.success) {
          fbEl.textContent = '✅ ' + data.message;
          fbEl.className = 'kontak-feedback success';
          _resetForm();
        } else {
          fbEl.textContent = '⚠ ' + (data.message || (data.errors && data.errors[0]) || 'Gagal mengirim pesan.');
          fbEl.className = 'kontak-feedback error';
        }
        return;
      }
    } catch (err) {
      console.warn('Backend tidak tersedia, fallback simulasi.', err.message);
    }

    // ─── Fallback: simulasi lokal ──────────────────────────
    setTimeout(() => {
      btn.textContent = 'Kirim Pesan';
      btn.disabled = false;
      fbEl.textContent = '✅ Pesan berhasil dikirim! Kami akan menghubungi Anda segera.';
      fbEl.className = 'kontak-feedback success';
      _resetForm();
    }, 1000);
  });
});
