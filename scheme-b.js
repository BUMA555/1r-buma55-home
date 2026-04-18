(function initSchemeB() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  setupSmoothScroll();
  setupReveal(prefersReduced);
  setupCursor(prefersReduced);
  setupParallax(prefersReduced);
  setupTilt(prefersReduced);

  function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function each(link) {
      link.addEventListener('click', function onClick(event) {
        const href = link.getAttribute('href');
        if (!href || href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 110;
        window.scrollTo({ top: Math.max(0, top), behavior: prefersReduced ? 'auto' : 'smooth' });
      });
    });
  }

  function setupReveal(reduced) {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(function show(el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function onObserve(entries, obs) {
        entries.forEach(function each(entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach(function watch(el) {
      observer.observe(el);
    });
  }

  function setupCursor(reduced) {
    const cursor = document.querySelector('.sb-cursor');
    if (!cursor || reduced) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    window.addEventListener('mousemove', function onMove(event) {
      tx = event.clientX;
      ty = event.clientY;
    });

    function frame() {
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      cursor.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px)';
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function setupParallax(reduced) {
    const orbA = document.querySelector('.sb-orb-a');
    const orbB = document.querySelector('.sb-orb-b');
    if (!orbA || !orbB || reduced) return;

    window.addEventListener('mousemove', function onMove(event) {
      const px = event.clientX / window.innerWidth - 0.5;
      const py = event.clientY / window.innerHeight - 0.5;
      orbA.style.transform = 'translate(' + (px * 32).toFixed(2) + 'px,' + (py * 28).toFixed(2) + 'px)';
      orbB.style.transform = 'translate(' + (px * -24).toFixed(2) + 'px,' + (py * -16).toFixed(2) + 'px)';
    });
  }

  function setupTilt(reduced) {
    const cards = document.querySelectorAll('[data-tilt]');
    if (!cards.length || reduced) return;

    cards.forEach(function mount(card) {
      const reset = function reset() {
        card.style.transform = '';
      };

      card.addEventListener('mousemove', function onMove(event) {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        const rotate = px * 4;
        const lift = -Math.abs(py * 8);
        card.style.transform = 'translateY(' + lift.toFixed(2) + 'px) rotate(' + rotate.toFixed(2) + 'deg)';
      });

      card.addEventListener('mouseleave', reset);
      card.addEventListener('blur', reset);
    });
  }
})();
