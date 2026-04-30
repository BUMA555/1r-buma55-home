// BUMA site progressive interaction layer.
(function () {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    root.classList.add('ui-enhanced');

    enhanceTopbar();
    markCurrentNavigation();
    setupAnchorScroll(reducedMotion);
    setupReveal(reducedMotion);
    setupPressFeedback();
    setupStaticIntakeForms(reducedMotion);
  });

  function enhanceTopbar() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    const sync = function () {
      topbar.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    sync();
    window.addEventListener('scroll', sync, { passive: true });
  }

  function markCurrentNavigation() {
    const file = normalizePath(window.location.pathname) || 'index.html';

    document.querySelectorAll('.nav-links a[href], .mobile-quick-bar a[href]').forEach(function (link) {
      const href = normalizePath(link.getAttribute('href'));
      if (!href || href.startsWith('#')) return;

      if (href === file || (href === 'index.html' && file === '')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else if (link.getAttribute('aria-current') === 'page') {
        link.removeAttribute('aria-current');
      }
    });
  }

  function normalizePath(value) {
    if (!value) return '';
    const clean = value.split('#')[0].split('?')[0].replace(/\\/g, '/');
    return clean.substring(clean.lastIndexOf('/') + 1);
  }

  function setupAnchorScroll(reduced) {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;

        let targetId = id.slice(1).trim();
        try {
          targetId = decodeURIComponent(targetId).trim();
        } catch (error) {
          return;
        }
        if (!targetId) return;

        const target = document.getElementById(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'start'
        });
        history.pushState(null, '', id);
      });
    });
  }

  function setupStaticIntakeForms(reduced) {
    document.querySelectorAll('form[data-static-intake]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();

        const action = form.getAttribute('action') || '';
        const targetId = action.includes('#') ? action.split('#').pop().trim() : '';
        const target = targetId ? document.getElementById(targetId) : null;
        if (!target) return;

        target.classList.add('is-visible');
        target.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'start'
        });
        history.pushState(null, '', '#' + targetId);
      });
    });
  }

  function setupReveal(reduced) {
    const selectors = [
      '[data-reveal]',
      'main > .section',
      '.section-header',
      '.card',
      '.home-entry-link',
      '.topic-nav-card',
      '.path-card',
      '.article-card',
      '.contact-card',
      '.contact-panel',
      '.contact-route-card',
      '.metrics-snapshot-shell',
      '.outcomes-strip-shell',
      '.trust-proof-card',
      '.outcome-strip-card'
    ].join(',');

    const targets = Array.from(document.querySelectorAll(selectors))
      .filter(function (element) {
        return !element.closest('.topbar') && !element.closest('.mobile-quick-bar');
      });

    if (!targets.length) return;

    targets.forEach(function (element, index) {
      if (!element.hasAttribute('data-reveal')) {
        element.setAttribute('data-reveal', '');
      }
      if (!element.hasAttribute('data-reveal-delay') && index % 4 !== 0) {
        element.setAttribute('data-reveal-delay', String(Math.min(index % 4, 3)));
      }
    });

    root.classList.add('js-ready');

    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(function (element) {
        element.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    targets.forEach(function (element) {
      if (isInitiallyVisible(element)) {
        element.classList.add('is-visible');
      } else {
        observer.observe(element);
      }
    });
  }

  function isInitiallyVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
  }

  function setupPressFeedback() {
    const pressables = document.querySelectorAll(
      '.btn-primary, .btn-secondary, .nav-cta, .mobile-quick-bar a, .contact-route-card, .article-card, .path-card, .topic-nav-card, .home-entry-link'
    );

    pressables.forEach(function (element) {
      element.addEventListener('pointerdown', function (event) {
        const rect = element.getBoundingClientRect();
        element.style.setProperty('--press-x', (event.clientX - rect.left) + 'px');
        element.style.setProperty('--press-y', (event.clientY - rect.top) + 'px');
        pulse(element);
      });

      element.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          pulse(element);
        }
      });
    });
  }

  function pulse(element) {
    element.classList.remove('is-pressing');
    window.requestAnimationFrame(function () {
      element.classList.add('is-pressing');
      window.setTimeout(function () {
        element.classList.remove('is-pressing');
      }, 360);
    });
  }
})();
