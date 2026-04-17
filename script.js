// BUMA website interaction script (UI-only refresh)
(function initBumaUi() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.toggle('reduced-motion', prefersReducedMotion);

  window.addEventListener('DOMContentLoaded', function onReady() {
    setupSmoothScroll(prefersReducedMotion);
    setupTopbarScrollState();
    setupCardDynamics(prefersReducedMotion);
    setupButtonPressFeedback();
    setupRevealAnimations(prefersReducedMotion);
  });

  function setupSmoothScroll(reducedMotion) {
    const links = document.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    links.forEach(function bindLink(link) {
      link.addEventListener('click', function onAnchorClick(event) {
        const href = link.getAttribute('href') || '';
        if (href.length < 2 || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - 88;
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: reducedMotion ? 'auto' : 'smooth'
        });
      });
    });
  }

  function setupTopbarScrollState() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    const updateTopbar = function updateTopbar() {
      topbar.classList.toggle('is-compact', window.scrollY > 18);
    };

    updateTopbar();
    window.addEventListener('scroll', updateTopbar, { passive: true });
  }

  function setupCardDynamics(reducedMotion) {
    const cards = Array.from(document.querySelectorAll('.card'));
    if (!cards.length) return;

    cards.forEach(function initCard(card, index) {
      if (!reducedMotion) {
        const tiltSeed = ((index % 7) - 3) * 0.35;
        const shiftSeed = ((index % 5) - 2) * 1.5;
        card.style.setProperty('--card-tilt', tiltSeed.toFixed(2) + 'deg');
        card.style.setProperty('--card-shift', shiftSeed.toFixed(1) + 'px');
      }

      card.addEventListener('mouseenter', function onEnter() {
        card.classList.add('is-hovered');
      });

      card.addEventListener('mouseleave', function onLeave() {
        card.classList.remove('is-hovered');
      });
    });
  }

  function setupButtonPressFeedback() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta');
    if (!buttons.length) return;

    buttons.forEach(function bindPress(button) {
      const addPressed = function addPressed() {
        button.classList.add('is-pressed');
      };

      const removePressed = function removePressed() {
        button.classList.remove('is-pressed');
      };

      button.addEventListener('pointerdown', addPressed);
      button.addEventListener('pointerup', removePressed);
      button.addEventListener('pointercancel', removePressed);
      button.addEventListener('blur', removePressed);
      button.addEventListener('mouseleave', removePressed);
    });
  }

  function setupRevealAnimations(reducedMotion) {
    const targets = document.querySelectorAll(
      '.section-header, .card, .hero-v2-copy, .hero-v2-visual-wrap, .trust-bar, .cta-wrap-home'
    );
    if (!targets.length) return;

    targets.forEach(function mark(el) {
      el.setAttribute('data-reveal', 'true');
    });

    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function reveal(el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function onIntersect(entries, obs) {
        entries.forEach(function eachEntry(entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    targets.forEach(function observe(el) {
      observer.observe(el);
    });
  }
})();
