(() => {
  // ========================================================================
  // Sileo-Inspired Liquid Gooey Toast Notification System
  // ========================================================================
  let toastCounter = 0;
  let toasterEl = document.getElementById('liquidToaster');

  if (!toasterEl) {
    toasterEl = document.createElement('div');
    toasterEl.id = 'liquidToaster';
    toasterEl.className = 'sileo-toaster';
    toasterEl.setAttribute('aria-live', 'polite');
    toasterEl.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toasterEl);
  }

  function showLiquidToast(opts = {}) {
    const {
      title = 'Notifikasi',
      description = '',
      type = 'success', // 'success' | 'info' | 'warn' | 'copy'
      duration = 4200
    } = typeof opts === 'string' ? { title: opts } : opts;

    const id = ++toastCounter;
    const filterId = 'liquid-goo-' + id;
    const totalWidth = 350;
    const pillHeight = 42;
    const roundness = 16;

    let badgeClass = '';
    let titleClass = '';
    let badgeIcon = '✓';

    if (type === 'info') {
      badgeClass = 'badge-info';
      titleClass = 'title-info';
      badgeIcon = 'ℹ';
    } else if (type === 'warn') {
      badgeClass = 'badge-warn';
      titleClass = 'title-warn';
      badgeIcon = '⚠';
    } else if (type === 'copy') {
      badgeClass = 'badge-info';
      titleClass = 'title-info';
      badgeIcon = '📋';
    }

    const toast = document.createElement('div');
    toast.className = 'sileo-toast toast-entering';
    toast.setAttribute('role', 'status');

    // Dynamic pill width based on title length
    const approxPillWidth = Math.min(320, Math.max(160, Math.round(title.length * 9.5) + 64));

    toast.innerHTML = `
      <svg class="sileo-canvas" width="${totalWidth}" height="140" viewBox="0 0 ${totalWidth} 140">
        <defs>
          <filter id="${filterId}" color-interpolation-filters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
        <g filter="url(#${filterId})">
          <rect id="pill-${id}" x="0" y="0" width="${approxPillWidth}" height="${pillHeight}" rx="${roundness}" ry="${roundness}" />
          <rect id="body-${id}" x="0" y="34" width="${totalWidth}" height="0" rx="${roundness}" ry="${roundness}" opacity="0" />
        </g>
      </svg>
      <div class="sileo-header">
        <span class="sileo-badge ${badgeClass}">${badgeIcon}</span>
        <span class="sileo-title ${titleClass}">${title}</span>
      </div>
      ${description ? `<div class="sileo-body" id="desc-${id}">${description}</div>` : ''}
    `;

    toasterEl.appendChild(toast);

    // Entrance and gooey expansion
    requestAnimationFrame(() => {
      toast.classList.remove('toast-entering');
      toast.classList.add('toast-active');

      if (description) {
        setTimeout(() => {
          const descEl = document.getElementById('desc-' + id);
          if (!descEl) return;
          const descHeight = descEl.offsetHeight + 14;
          const totalH = pillHeight + descHeight;

          const pillRect = document.getElementById('pill-' + id);
          const bodyRect = document.getElementById('body-' + id);
          const svgEl = toast.querySelector('.sileo-canvas');

          if (svgEl) {
            svgEl.setAttribute('height', (totalH + 20).toString());
            svgEl.setAttribute('viewBox', `0 0 ${totalWidth} ${totalH + 20}`);
          }
          toast.style.height = totalH + 'px';

          if (pillRect && bodyRect) {
            pillRect.setAttribute('height', (pillHeight + 14).toString());
            bodyRect.setAttribute('height', descHeight.toString());
            bodyRect.setAttribute('opacity', '1');
          }

          toast.classList.add('expanded');
        }, 100);
      }
    });

    const dismiss = () => {
      if (toast.classList.contains('toast-exiting')) return;
      toast.classList.remove('toast-active');
      toast.classList.add('toast-exiting');
      setTimeout(() => {
        toast.remove();
      }, 450);
    };

    let dismissTimer = setTimeout(dismiss, duration);

    toast.addEventListener('click', () => {
      clearTimeout(dismissTimer);
      dismiss();
    });

    return { dismiss };
  }

  window.showLiquidToast = showLiquidToast;

  // ========================================================================
  // Theme Management with robust error handling
  // ========================================================================
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const themeText = document.getElementById('themeText');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getTheme() {
    try {
      const saved = localStorage.getItem('wafy-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {}
    return systemDark.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeText) {
      themeText.textContent = theme === 'dark' ? 'Terang' : 'Gelap';
    }
  }

  let currentTheme = getTheme();
  applyTheme(currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('wafy-theme', currentTheme);
      } catch (_) {}
      applyTheme(currentTheme);
      showLiquidToast({
        title: currentTheme === 'dark' ? 'Mode Gelap Aktif' : 'Mode Terang Aktif',
        description: 'Preferensi tampilan tersimpan otomatis.',
        type: 'info',
        duration: 3200
      });
    });
  }

  systemDark.addEventListener('change', (e) => {
    try {
      if (!localStorage.getItem('wafy-theme')) {
        currentTheme = e.matches ? 'dark' : 'light';
        applyTheme(currentTheme);
      }
    } catch (_) {}
  });

  // ========================================================================
  // Mobile Drawer Navigation
  // ========================================================================
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', !isExpanded);
      mobileDrawer.hidden = isExpanded;
    });

    // Close on link click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.hidden = true;
      });
    });
  }

  // ========================================================================
  // Active Navigation Highlighting with IntersectionObserver
  // ========================================================================
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-item');
  const mobileLinks = document.querySelectorAll('.mobile-nav .mob-nav-item');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          desktopLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
          mobileLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));
  }

  // ========================================================================
  // Certificate Filter Tabs
  // ========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const certCards = document.querySelectorAll('.cert-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');
      certCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ========================================================================
  // Accessible Lightbox Dialog Modal
  // ========================================================================
  const dialog = document.getElementById('certLightbox');
  const modalImg = document.getElementById('modalCertImg');
  const modalTitle = document.getElementById('modalCertTitle');
  const modalWrap = document.getElementById('modalImgWrap');

  window.openLightbox = function(src, title) {
    if (!dialog || !modalImg) return;
    modalTitle.textContent = title || 'Pratinjau Sertifikat';
    modalWrap.classList.add('skeleton-loader');
    modalImg.src = src;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  };

  window.closeLightbox = function() {
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  };

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog && dialog.open) {
      window.closeLightbox();
    }
  });

  // ========================================================================
  // Contact & CV Copy / Download Interactivity with Liquid Toast Feedback
  // ========================================================================
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
      const email = link.getAttribute('href').replace('mailto:', '');
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).catch(() => {});
        }
      } catch (_) {}
      showLiquidToast({
        title: email.includes('unesa') ? 'Email UNESA Disalin!' : 'Email Pribadi Disalin!',
        description: `Alamat ${email} berhasil disalin ke clipboard.`,
        type: 'copy',
        duration: 4000
      });
    });
  });

  document.querySelectorAll('a[href*="CV_ATS_Taufiq_Mahdi_Wafy.pdf"]').forEach(link => {
    link.addEventListener('click', () => {
      showLiquidToast({
        title: 'Mengunduh CV ATS',
        description: 'Membuka berkas resume resmi Taufiq Mahdi Wafy (PDF)...',
        type: 'info',
        duration: 3500
      });
    });
  });

})();
