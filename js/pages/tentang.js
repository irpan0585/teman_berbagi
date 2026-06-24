/**
 * pages/tentang.js
 * ─────────────────────────────────────────────────────────────
 * Tanggung jawab:
 *   - Render HTML halaman Tentang (Profil, Struktur Org, Cabang)
 *   - Logika switch tab (Profil / Struktur / Cabang)
 *   - Scroll-triggered animations via IntersectionObserver
 * ─────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. RENDER TEMPLATE ──────────────────────────────────────
  document.getElementById('page-tentang').innerHTML = `
    <div class="about-page">
      <div class="about-header">
        <h1>TENTANG</h1>
        <h2>TEMAN BERBAGI KEBAIKAN</h2>
      </div>

      <div class="about-tabs">
        <span class="about-tab active" id="tab-profil"   onclick="switchAboutTab('profil')">Profil</span>
        <span class="about-tab"        id="tab-struktur" onclick="switchAboutTab('struktur')">Struktur Organisasi</span>
        <span class="about-tab"        id="tab-cabang"   onclick="switchAboutTab('cabang')">Cabang</span>
      </div>

      <!-- TAB: PROFIL -->
      <div class="tab-content active" id="content-profil">
        <div class="profile-cards">
          <div class="profile-card" data-scroll-animate>
            <h3>Teman Berbagi</h3>
            <p>Platform berbagi kebaikan yang menghubungkan para dermawan dengan mereka yang membutuhkan di seluruh pelosok Indonesia.</p>
          </div>
          <div class="profile-card" data-scroll-animate>
            <h3>Visi</h3>
            <p>Dengan berbagi, kita bisa membantu mereka yang membutuhkan mulai dari memenuhi kebutuhan pangan, pendidikan, hingga pembangunan rumah ibadah.</p>
          </div>
          <div class="profile-card" data-scroll-animate>
            <h3>Misi</h3>
            <p>Mewujudkan masyarakat yang saling peduli melalui kemudahan berdonasi secara transparan, amanah, dan berdampak nyata.</p>
          </div>
        </div>

        <div class="banner-section" data-scroll-animate>
          <div class="banner-inner">
            <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&q=80" alt="">
            <div class="banner-text"><h3>Little Things Mean a lot</h3></div>
          </div>
        </div>

        <div class="super-hiro">
          <div class="super-hiro-header" data-scroll-animate><h3>Para Super Hiro</h3></div>
          <div class="super-hiro-content">
            <div class="super-hiro-text" data-scroll-animate>
              <p>Senyum merekalah yang membuat kami tetap bertahan sampai saat ini</p>
            </div>
            <div class="photo-grid" data-scroll-animate>
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&q=80" alt="">
              <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=300&q=80" alt="">
              <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&q=80" alt="">
              <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&q=80" alt="">
              <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=300&q=80" alt="">
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=300&q=80&sig=2" alt="">
              <img src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=300&q=80" alt="">
              <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=300&q=80" alt="">
            </div>
          </div>
        </div>

        <div class="ketentuan-section" data-scroll-animate>
          <div class="ketentuan-card">
            <h3>Ketentuan Teman Berbagi</h3>
            <p>Setiap donasi yang disalurkan melalui Teman Berbagi dijamin transparan dan amanah.
               Dana akan disalurkan langsung kepada penerima manfaat dengan laporan berkala
               yang dapat diakses oleh seluruh donatur.</p>
          </div>
        </div>
      </div>

      <!-- TAB: STRUKTUR ORGANISASI -->
      <div class="tab-content" id="content-struktur">
        <div class="org-container">
          <div class="org-box">
            <div class="org-level" data-org-animate>
              <div class="org-member-label">Dewan Pembina</div>
              <div class="org-photo large"></div>
            </div>
            <div class="org-row" data-org-animate>
              <div class="org-member"><div class="org-member-label">Sekertaris</div><div class="org-photo medium"></div></div>
              <div class="org-member"><div class="org-member-label">Bendahara</div><div class="org-photo medium"></div></div>
              <div class="org-member"><div class="org-member-label">Humas</div><div class="org-photo medium"></div></div>
              <div class="org-member"><div class="org-member-label">Perlengkapan</div><div class="org-photo medium"></div></div>
            </div>
            <div class="org-row" data-org-animate>
              <div class="org-member"><div class="org-member-label">Anggota</div><div class="org-photo small"></div></div>
              <div class="org-member"><div class="org-member-label">Anggota</div><div class="org-photo small"></div></div>
              <div class="org-member"><div class="org-member-label">Anggota</div><div class="org-photo small"></div></div>
            </div>
            <div class="org-row" data-org-animate>
              <div class="org-member"><div class="org-member-label">Anggota</div><div class="org-photo small"></div></div>
              <div class="org-member"><div class="org-member-label">Anggota</div><div class="org-photo small"></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: CABANG -->
      <div class="tab-content" id="content-cabang">
        <div style="text-align:center;padding:80px 20px;color:rgba(255,255,255,0.5);font-size:16px;">
          Informasi cabang akan segera hadir.
        </div>
      </div>
    </div>`;

  // ── 2. LOGIKA TAB TENTANG ───────────────────────────────────
  // Fungsi dipasang ke window agar bisa dipanggil dari onclick di HTML
  window.switchAboutTab = function (tabName) {
    document.querySelectorAll('#page-tentang .about-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#page-tentang .tab-content').forEach(c => c.classList.remove('active'));

    document.getElementById(`tab-${tabName}`).classList.add('active');
    const content = document.getElementById(`content-${tabName}`);
    content.classList.add('active');

    // Re-trigger scroll animations untuk tab yang baru dibuka
    setTimeout(() => _initScrollAnimations(), 100);
  };

  // ── 3. SCROLL ANIMATIONS ────────────────────────────────────
  // Dijalankan saat halaman tentang pertama kali ditampilkan
  // Observasi dijalankan ulang saat router memanggil kembali halaman ini
  const _observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          _observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
  );

  function _initScrollAnimations() {
    const activeTab = document.querySelector('#page-tentang .tab-content.active');
    if (!activeTab) return;

    activeTab.querySelectorAll('[data-scroll-animate], [data-org-animate]').forEach((el, i) => {
      if (!el.style.transitionDelay) el.style.transitionDelay = `${i * 0.08}s`;
      _observer.observe(el);
    });

    // Langsung tampilkan elemen yang sudah terlihat di viewport
    setTimeout(() => {
      activeTab.querySelectorAll('[data-scroll-animate], [data-org-animate]').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('animate-in');
      });
    }, 100);
  }

  // Pasang observer saat halaman tentang pertama kali aktif
  // Router akan memanggil _initScrollAnimations() via MutationObserver di bawah
  const tentangPage = document.getElementById('page-tentang');
  new MutationObserver(() => {
    if (tentangPage.classList.contains('visible')) {
      setTimeout(() => _initScrollAnimations(), 200);
    }
  }).observe(tentangPage, { attributes: true, attributeFilter: ['class'] });
});
