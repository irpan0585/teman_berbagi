/**
 * pages/masuk.js
 * Halaman login — terintegrasi dengan backend (POST /api/auth/login)
 * Jika backend tidak tersedia, fallback ke verifikasi localStorage.
 *
 * FIX: - Tombol selalu di-reset saat halaman ditampilkan ulang
 *      - Admin langsung diarahkan ke Panel Admin, user biasa ke Donasi
 */

document.addEventListener('DOMContentLoaded', () => {
  const pageMasuk = document.getElementById('page-masuk');
  if (!pageMasuk) return;

  pageMasuk.innerHTML = `
    <div class="auth-page">
      <div class="auth-bg"></div>
      <div class="auth-card">
        <h2>MASUK</h2>

        <div class="auth-field">
          <input type="text" id="masukUser" placeholder="Nama Pengguna / Email" autocomplete="off" />
        </div>
        <div class="auth-field">
          <input type="password" id="masukPassword" placeholder="Password" />
        </div>

        <div class="auth-links">
          <span>Lupa Password?&nbsp;</span>
          <span onclick="showPage('daftar')">Daftar</span>
        </div>

        <div class="auth-message" id="masukMessage"></div>

        <button class="auth-btn" id="btnMasuk">MASUK</button>

        <div class="auth-bottom">
          Belum punya Akun? <span onclick="showPage('daftar')">Daftar</span>
        </div>
      </div>
    </div>`;

  const btnMasuk = document.getElementById('btnMasuk');
  if (btnMasuk) {
    btnMasuk.addEventListener('click', handleLogin);
  }

  const passwordInput = document.getElementById('masukPassword');
  if (passwordInput) {
    passwordInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') handleLogin();
    });
  }

  /* ─── Reset form setiap kali halaman masuk ditampilkan ─── */
  new MutationObserver(() => {
    if (pageMasuk.classList.contains('visible') || pageMasuk.style.display !== 'none') {
      _resetMasukForm();
    }
  }).observe(pageMasuk, { attributes: true, attributeFilter: ['class', 'style'] });

  window._resetMasukForm = _resetMasukForm;
});

/** Reset form login ke keadaan awal */
function _resetMasukForm() {
  const btn = document.getElementById('btnMasuk');
  if (btn) {
    btn.disabled = false;
    btn.textContent = 'MASUK';
  }
  const msgEl = document.getElementById('masukMessage');
  if (msgEl) {
    msgEl.textContent = '';
    msgEl.className = 'auth-message';
  }
  const userInput = document.getElementById('masukUser');
  if (userInput) userInput.value = '';
  const passInput = document.getElementById('masukPassword');
  if (passInput) passInput.value = '';
}

async function handleLogin() {
  const userInput = document.getElementById('masukUser')?.value.trim();
  const password = document.getElementById('masukPassword')?.value;
  const msgEl = document.getElementById('masukMessage');

  if (!userInput || !password) {
    _setMasukMsg(msgEl, '⚠ Semua field wajib diisi!', 'error');
    _shakeMasukCard();
    return;
  }

  const btn = document.getElementById('btnMasuk');
  if (btn) { btn.disabled = true; btn.textContent = 'MEMPROSES...'; }

  let loginSuccess = false;

  try {
    let backendAvailable = false;

    try {
      if (typeof window.authAPI !== 'undefined') {
        const { response, data } = await window.authAPI.login({
          login: userInput,
          password,
        });

        backendAvailable = true;

        if (response.ok && data.success) {
          const user = data.data.user;
          localStorage.setItem('tb_token', data.data.token);
          localStorage.setItem('tb_user', JSON.stringify(user));

          // ── Cek role: admin → Panel Admin, user → Donasi ──
          if (user.role === 'admin') {
            // Simpan juga sebagai token admin untuk adminAPI
            localStorage.setItem('tb_admin_token', data.data.token);
            localStorage.setItem('tb_admin_user', JSON.stringify(user));

            _setMasukMsg(msgEl, `✅ Selamat datang, Admin ${user.username}!`, 'success');
            loginSuccess = true;
            _afterLoginSuccess('admin');
          } else {
            _setMasukMsg(msgEl, `✅ Selamat datang kembali, ${user.username}!`, 'success');
            loginSuccess = true;
            _afterLoginSuccess('donasi');
          }
          return;
        } else {
          _setMasukMsg(msgEl, '⚠ ' + (data.message || 'Login gagal'), 'error');
          _shakeMasukCard();
          return;
        }
      }
    } catch (err) {
      console.warn('Backend tidak tersedia, fallback ke localStorage.', err.message);
    }

    if (!backendAvailable) {
      loginSuccess = _loginLocal(userInput, password, msgEl);
    }

  } finally {
    if (!loginSuccess && btn) {
      btn.disabled = false;
      btn.textContent = 'MASUK';
    }
  }
}

function _loginLocal(userInput, password, msgEl) {
  let users = [];
  try { users = JSON.parse(localStorage.getItem('tb_users') || '[]'); } catch (e) { users = []; }

  const user = users.find(u =>
    (u.username === userInput || u.email === userInput) && u.password === password
  );

  if (user) {
    const userData = {
      id: user.id, username: user.username,
      name: user.name || user.username, email: user.email,
      tglLahir: user.tglLahir || '', telepon: user.telepon || '',
      alamat: user.alamat || '', password: user.password,
      role: user.role || 'user',
      registeredAt: user.registeredAt || new Date().toISOString(),
    };
    localStorage.setItem('tb_user', JSON.stringify(userData));
    localStorage.setItem('tb_token', 'dummy-token-' + Date.now());

    const targetPage = userData.role === 'admin' ? 'admin' : 'donasi';
    _setMasukMsg(msgEl, '✅ Selamat datang kembali, ' + user.username + '!', 'success');
    _afterLoginSuccess(targetPage);
    return true;
  } else {
    const userExists = users.find(u => u.username === userInput || u.email === userInput);
    if (userExists) {
      _setMasukMsg(msgEl, '⚠ Password salah! Silakan coba lagi.', 'error');
    } else {
      _setMasukMsg(msgEl, '⚠ Akun tidak ditemukan. Silakan daftar terlebih dahulu.', 'error');
    }
    _shakeMasukCard();
    return false;
  }
}

/**
 * @param {string} targetPage - 'admin' untuk admin, 'donasi' untuk user biasa
 */
function _afterLoginSuccess(targetPage) {
  try {
    if (typeof window._updateUserDisplay === 'function') window._updateUserDisplay();
  } catch (e) { console.warn('_updateUserDisplay error:', e); }

  try {
    if (typeof window._syncProfileDropdown === 'function') window._syncProfileDropdown();
  } catch (e) { console.warn('_syncProfileDropdown error:', e); }

  try {
    if (typeof window.forceUpdateUserDisplay === 'function') window.forceUpdateUserDisplay();
  } catch (e) { console.warn('forceUpdateUserDisplay error:', e); }

  setTimeout(() => {
    if (typeof showPage === 'function') showPage(targetPage || 'donasi');
    else window.location.href = '/';
  }, 500);
}

function _setMasukMsg(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = 'auth-message ' + type;
}

function _shakeMasukCard() {
  const card = document.querySelector('#page-masuk .auth-card');
  if (!card) return;
  card.style.animation = 'shake 0.4s ease';
  setTimeout(() => (card.style.animation = ''), 400);
}