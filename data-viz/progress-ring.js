/* ============================================
   PROGRESS RING — Bind SVG offset to a value (0..100); auto-build if missing
   Inspired by Apple Activity rings / circular progress patterns
   ============================================
   Usage:
     ProgressRing.init('[data-pring]');             // animates to data-pring-value on inview
     ProgressRing.set('#myRing', 42);               // manual update
   ============================================ */
(function (root) {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var R = 42;
  var CIRC = 2 * Math.PI * R; // ≈ 263.894

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(setup(el, opts || {})); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function ensureMarkup(el) {
    var svg = el.querySelector('svg');
    if (!svg) {
      svg = document.createElementNS(SVGNS, 'svg');
      svg.setAttribute('viewBox', '0 0 100 100');
      el.appendChild(svg);
    }
    if (!el.querySelector('.pring-track')) {
      var track = document.createElementNS(SVGNS, 'circle');
      track.setAttribute('class', 'pring-track');
      track.setAttribute('cx', '50'); track.setAttribute('cy', '50'); track.setAttribute('r', R);
      svg.appendChild(track);
    }
    if (!el.querySelector('.pring-bar')) {
      var bar = document.createElementNS(SVGNS, 'circle');
      bar.setAttribute('class', 'pring-bar');
      bar.setAttribute('cx', '50'); bar.setAttribute('cy', '50'); bar.setAttribute('r', R);
      svg.appendChild(bar);
    }
    return el.querySelector('.pring-bar');
  }

  function setup(el, opts) {
    var bar = ensureMarkup(el);
    bar.setAttribute('stroke-dasharray', CIRC.toFixed(2));
    bar.setAttribute('stroke-dashoffset', CIRC.toFixed(2));

    var target = parseFloat(el.getAttribute('data-pring-value'));
    if (isNaN(target)) target = opts.value != null ? opts.value : 0;
    target = Math.max(0, Math.min(100, target));

    function set(val) {
      val = Math.max(0, Math.min(100, val));
      bar.setAttribute('stroke-dashoffset', (CIRC * (1 - val / 100)).toFixed(3));
      var label = el.querySelector('.pring-label');
      if (label) label.textContent = Math.round(val) + '%';
    }

    if (opts.trigger === 'auto') {
      requestAnimationFrame(function () { set(target); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { set(target); io.unobserve(el); }
        });
      }, { threshold: 0.4 });
      io.observe(el);
    }

    return { el: el, set: set };
  }

  function set(target, value) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) {
      var bar = ensureMarkup(el);
      bar.setAttribute('stroke-dasharray', CIRC.toFixed(2));
      bar.setAttribute('stroke-dashoffset', (CIRC * (1 - value / 100)).toFixed(3));
      var label = el.querySelector('.pring-label');
      if (label) label.textContent = Math.round(value) + '%';
    });
  }

  var ProgressRing = { init: init, set: set };

  if (typeof module !== 'undefined' && module.exports) module.exports = ProgressRing;
  else root.ProgressRing = ProgressRing;
})(typeof window !== 'undefined' ? window : this);
