/* ============================================
   GOOGLE GEMINI EFFECT — Draws each curve from 0 → full length as you scroll
   Inspired by Aceternity UI
   ============================================
   Usage:
     GoogleGeminiEffect.init('.gge-host', {
       stagger: 0.08    // 0 = all curves draw together; 0.1 = each lags 10% behind the previous
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { stagger: 0.08 };

  function clamp(v,lo,hi){return v<lo?lo:v>hi?hi:v;}

  function create(host, opts) {
    var o = Object.assign({}, defaults, opts || {});
    var curves = Array.from(host.querySelectorAll('.gge-curve'));
    if (!curves.length) return null;

    var lengths = curves.map(function (c) {
      var L = c.getTotalLength();
      c.style.strokeDasharray  = L;
      c.style.strokeDashoffset = L;
      return L;
    });

    function onScroll() {
      var rect = host.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = host.offsetHeight - vh;
      var p = clamp(-rect.top / total, 0, 1);
      curves.forEach(function (c, i) {
        var lag = i * o.stagger;
        var range = 1 - lag - (curves.length - 1 - i) * o.stagger * 0.0;
        var local = clamp((p - lag) / Math.max(range, 0.001), 0, 1);
        c.style.strokeDashoffset = (lengths[i] * (1 - local)).toFixed(1);
      });
    }

    var ticking = false;
    function tick() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { onScroll(); ticking = false; });
    }

    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    onScroll();

    return { el: host, destroy: function () { window.removeEventListener('scroll', tick); window.removeEventListener('resize', tick); } };
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return create(nodes[0], opts);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n, opts)); });
      return arr;
    }
    return create(target, opts);
  }

  var GoogleGeminiEffect = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = GoogleGeminiEffect;
  else root.GoogleGeminiEffect = GoogleGeminiEffect;
})(typeof window !== 'undefined' ? window : this);
