/**
 * pages/daftar.js
 * Halaman registrasi — terintegrasi dengan backend (POST /api/auth/register)
 * Jika backend tidak tersedia, fallback ke penyimpanan localStorage.
 *
 * Materi: Autentikasi JWT + Integrasi Frontend-Backend melalui API
 */

document.addEventListener('DOMContentLoaded', () => {
  const pageDaftar = document.getElementById('page-daftar');
  if (!pageDaftar) return;

  pageDaftar.innerHTML = `
    <div class="auth-page">
      <div class="auth-bg"></div>
      <div class="auth-card">
        <h2>DAFTAR</h2>

        <div class="auth-field">
          <input type="text" id="daftarNama" placeholder="Nama Pengguna" autocomplete="off" />
        </div>
        <div class="auth-field">
          <input type="email" id="daftarEmail" placeholder="Email" autocomplete="off" />
        </div>
        <div class="auth-field">
          <input type="date" id="daftarTanggal" />
        </div>
        <div class="auth-field">
          <input type="password" id="daftarPassword" placeholder="Password minimal 6 karakter" />
        </div>

        <div class="auth-links">
          <span onclick="showPage('masuk')">Sudah punya Akun? Masuk</span>
        </div>

        <div class="auth-message" id="daftarMessage"></div>

        <button class="auth-btn" id="btnDaftar">DAFTAR</button>

        <div style="margin-top:16px;text-align:center;">
          <span onclick="showPage('admin')" style="font-size:12px;color:rgba(255,255,255,0.4);cursor:pointer;text-decoration:underline;letter-spacing:0.3px;">Panel Admin</span>
        </div>
      </div>
    </div>`;

  const btnDaftar = document.getElementById('btnDaftar');
  if (btnDaftar) {
    btnDaftar.addEventListener('click', handleRegister);
  }

  const passwordInput = document.getElementById('daftarPassword');
  if (passwordInput) {
    passwordInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') handleRegister();
    });
  }
});

async function handleRegister() {
  const nama = document.getElementById('daftarNama')?.value.trim();
  const email = document.getElementById('daftarEmail')?.value.trim();
  const tanggal = document.getElementById('daftarTanggal')?.value;
  const password = document.getElementById('daftarPassword')?.value;
  const msgEl = document.getElementById('daftarMessage');

  // Validasi
  if (!nama || !email || !tanggal || !password) {
    _setDaftarMsg(msgEl, '⚠ Semua field wajib diisi!', 'error');
    _shakeDaftarCard();
    return;
  }

  if (password.length < 6) {
    _setDaftarMsg(msgEl, '⚠ Password minimal 6 karakter!', 'error');
    _shakeDaftarCard();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    _setDaftarMsg(msgEl, '⚠ Email tidak valid! Contoh: nama@domain.com', 'error');
    _shakeDaftarCard();
    return;
  }

  const btn = document.getElementById('btnDaftar');
  if (btn) { btn.disabled = true; btn.textContent = 'MEMPROSES...'; }

  // ─── Coba registrasi ke backend ──────────────────────────
  try {
    if (typeof window.authAPI !== 'undefined') {
      const { response, data } = await window.authAPI.register({
        username: nama,
        email,
        password,
        tgl_lahir: tanggal,
      });

      if (response.ok && data.success) {
        // Simpan token JWT & data user dari backend
        localStorage.setItem('tb_token', data.data.token);
        localStorage.setItem('tb_user', JSON.stringify(data.data.user));

        _setDaftarMsg(msgEl, `✅ Pendaftaran berhasil! Selamat datang, ${nama}!`, 'success');
        _afterAuthSuccess();
        return;
      } else {
        _setDaftarMsg(msgEl, '⚠ ' + (data.message || (data.errors && data.errors[0]) || 'Pendaftaran gagal'), 'error');
        _shakeDaftarCard();
        if (btn) { btn.disabled = false; btn.textContent = 'DAFTAR'; }
        return;
      }
    }
  } catch (err) {
    console.warn('Backend tidak tersedia, fallback ke localStorage.', err.message);
  }

  // ─── Fallback: simpan ke localStorage ────────────────────
  _registerLocal(nama, email, tanggal, password, msgEl);
  if (btn) { btn.disabled = false; btn.textContent = 'DAFTAR'; }
}

/** Registrasi lokal (fallback bila backend mati) */
function _registerLocal(nama, email, tanggal, password, msgEl) {
  let users = [];
  try { users = JSON.parse(localStorage.getItem('tb_users') || '[]'); } catch (e) { users = []; }

  const existingUser = users.find(u => u.email === email || u.username === nama);
  if (existingUser) {
    _setDaftarMsg(msgEl, '⚠ Email atau Username sudah terdaftar!', 'error');
    _shakeDaftarCard();
    return;
  }

  const userData = {
    id: 'user_' + Date.now(),
    username: nama, name: nama, email,
    tglLahir: tanggal, telepon: '', alamat: '',
    password, registeredAt: new Date().toISOString(),
  };

  users.push(userData);
  localStorage.setItem('tb_users', JSON.stringify(users));
  localStorage.setItem('tb_user', JSON.stringify(userData));
  localStorage.setItem('tb_token', 'dummy-token-' + Date.now());

  _setDaftarMsg(msgEl, `✅ Pendaftaran berhasil! Selamat datang, ${nama}!`, 'success');
  _afterAuthSuccess();
}

/** Update tampilan user lalu arahkan ke halaman donasi */
function _afterAuthSuccess() {
  if (typeof window._updateUserDisplay === 'function') window._updateUserDisplay();
  if (typeof window._syncProfileDropdown === 'function') window._syncProfileDropdown();
  if (typeof window.forceUpdateUserDisplay === 'function') window.forceUpdateUserDisplay();

  setTimeout(() => {
    if (typeof showPage === 'function') showPage('donasi');
    else window.location.href = '/';
  }, 500);
}

function _setDaftarMsg(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = 'auth-message ' + type;
}

function _shakeDaftarCard() {
  const card = document.querySelector('#page-daftar .auth-card');
  if (!card) return;
  card.style.animation = 'shake 0.4s ease';
  setTimeout(() => (card.style.animation = ''), 400);
}
