// BUMA website interaction script (UI-only refresh)
(function initBumaUi() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.toggle('reduced-motion', prefersReducedMotion);

  window.addEventListener('DOMContentLoaded', function onReady() {
    setupSmoothScroll(prefersReducedMotion);
    setupTopbarScrollState();
    setupCardDynamics(prefersReducedMotion);
    setupAntiIndexOffsets(prefersReducedMotion);
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
        const tiltSeed = ((index % 7) - 3) * 0.9;
        const shiftSeed = ((index % 6) - 2.5) * 3.2;
        card.style.setProperty('--card-tilt', tiltSeed.toFixed(2) + 'deg');
        card.style.setProperty('--card-shift', shiftSeed.toFixed(1) + 'px');
      }

      card.addEventListener('mouseenter', function onEnter() {
        card.classList.add('is-hovered');
      });

      card.addEventListener('mouseleave', function onLeave() {
        card.classList.remove('is-hovered');
        card.style.setProperty('--card-hover-rotate', '0deg');
        card.style.setProperty('--card-hover-lift', '0px');
      });

      if (!reducedMotion) {
        card.addEventListener('mousemove', function onMove(event) {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          const rotate = px * 6;
          const lift = -Math.abs(py * 7);

          card.style.setProperty('--card-hover-rotate', rotate.toFixed(2) + 'deg');
          card.style.setProperty('--card-hover-lift', lift.toFixed(1) + 'px');
        });
      }
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

  function setupAntiIndexOffsets(reducedMotion) {
    if (!document.body.classList.contains('anti-index-minimal')) return;

    const offsetGroups = [
      {
        selector: '.hero-stat',
        offsets: [
          { x: -4, y: 2, rotate: -1.9 },
          { x: 3, y: -1, rotate: 1.4 },
          { x: -2, y: 3, rotate: -0.8 }
        ]
      },
      {
        selector: 'main > section:nth-of-type(2) .home-card',
        offsets: [
          { x: -8, y: 3, rotate: -2.3 },
          { x: 6, y: -5, rotate: 1.8 },
          { x: -3, y: 5, rotate: -1.2 }
        ]
      },
      {
        selector: '.trust-bar-item',
        offsets: [
          { x: -3, y: 1, rotate: -1.1 },
          { x: 2, y: -2, rotate: 0.9 },
          { x: -1, y: 3, rotate: -0.6 },
          { x: 4, y: -1, rotate: 1.2 }
        ]
      }
    ];

    offsetGroups.forEach(function applyGroup(group) {
      const nodes = Array.from(document.querySelectorAll(group.selector));
      if (!nodes.length) return;

      nodes.forEach(function applyNode(node, index) {
        const offset = group.offsets[index % group.offsets.length];
        node.setAttribute('data-anti-offset', 'true');
        node.style.setProperty('--anti-shift-x', offset.x + 'px');
        node.style.setProperty('--anti-shift-y', offset.y + 'px');
        node.style.setProperty('--anti-rotate', offset.rotate + 'deg');
      });
    });

    const heroCard = document.querySelector('.hero-v2-copy');
    if (!heroCard) return;

    const resetHero = function resetHero() {
      heroCard.style.setProperty('--hero-rotate', '0deg');
      heroCard.style.setProperty('--hero-shift-x', '0px');
      heroCard.style.setProperty('--hero-shift-y', '0px');
    };

    if (reducedMotion) {
      resetHero();
      return;
    }

    heroCard.addEventListener('mousemove', function onHeroMove(event) {
      const rect = heroCard.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      const rotate = px * 2.4;
      const shiftX = px * 7;
      const shiftY = py * 5;

      heroCard.style.setProperty('--hero-rotate', rotate.toFixed(2) + 'deg');
      heroCard.style.setProperty('--hero-shift-x', shiftX.toFixed(2) + 'px');
      heroCard.style.setProperty('--hero-shift-y', shiftY.toFixed(2) + 'px');
    });

    heroCard.addEventListener('mouseleave', resetHero);
    resetHero();
  }
})();
