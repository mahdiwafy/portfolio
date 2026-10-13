(() => {
  // Theme Management with robust error handling
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

  // Mobile Drawer Navigation
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

  // Active Navigation Highlighting with IntersectionObserver
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

  // Certificate Filter Tabs
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

  // Accessible Lightbox Dialog Modal
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

})();
