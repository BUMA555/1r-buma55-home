(function initAntiHome() {
  const slider = document.getElementById('chaosLevel');
  const value = document.getElementById('chaosValue');
  const targets = document.querySelectorAll('.card-1, .card-2, .card-3, .marquee-container');

  if (!slider || !value || !targets.length) {
    return;
  }

  const applyChaos = (raw) => {
    const level = Math.max(0, Math.min(100, Number(raw) || 0));
    value.textContent = level + '%';

    const rotate = (level / 100) * 5.5;
    const shift = (level / 100) * 9;

    targets.forEach((el, index) => {
      const dir = index % 2 === 0 ? 1 : -1;
      const extra = (index % 3) * 0.45;
      el.style.transform = 'translate(' + (dir * shift * 0.24).toFixed(2) + 'px, ' + (-shift * 0.12).toFixed(2) + 'px) rotate(' + (dir * (rotate + extra)).toFixed(2) + 'deg)';
      el.style.transition = 'transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)';
    });

    document.body.style.filter = 'saturate(' + (1 + level / 220).toFixed(2) + ') contrast(' + (1 + level / 300).toFixed(2) + ')';
  };

  slider.addEventListener('input', function onInput(e) {
    applyChaos(e.target.value);
  });

  applyChaos(slider.value);
})();
