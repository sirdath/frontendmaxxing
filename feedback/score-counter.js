/* ============================================
   SCORE COUNTER — Add/subtract score with flying +N popup
   ============================================
   Usage:
     ScoreCounter.add('[data-score-counter]', 50);   // adds +50, shows green
     ScoreCounter.add('[data-score-counter]', -10);  // shows -10 red

     // Or set absolute:
     ScoreCounter.set('[data-score-counter]', 1234);
   ============================================ */
(function (root) {
  'use strict';

  function value(el) {
    var v = el.querySelector('.scnt-value');
    return parseFloat((v && v.textContent || '0').replace(/[^\d.\-]/g, '')) || 0;
  }

  function format(n) {
    return Math.round(n).toLocaleString();
  }

  function add(target, delta) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    var v = el.querySelector('.scnt-value');
    var bump = el.querySelector('.scnt-bump');
    var from = value(el);
    var to   = from + delta;
    animate(v, from, to, 600);
    if (bump) {
      bump.textContent = (delta >= 0 ? '+' : '−') + Math.abs(delta);
      bump.classList.toggle('is-bad', delta < 0);
      bump.classList.remove('is-active');
      void bump.offsetWidth;
      bump.classList.add('is-active');
    }
    v.classList.remove('is-bumping');
    void v.offsetWidth;
    v.classList.add('is-bumping');
  }

  function set(target, val) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    var v = el.querySelector('.scnt-value');
    animate(v, value(el), val, 600);
  }

  function animate(el, from, to, duration) {
    var t0 = null;
    function step(t) {
      if (t0 == null) t0 = t;
      var p = Math.min(1, (t - t0) / duration);
      var eased = 1 - Math.pow(1 - p, 4);
      var v = from + (to - from) * eased;
      el.textContent = format(v);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var ScoreCounter = { add: add, set: set, value: value };

  if (typeof module !== 'undefined' && module.exports) module.exports = ScoreCounter;
  else root.ScoreCounter = ScoreCounter;
})(typeof window !== 'undefined' ? window : this);
