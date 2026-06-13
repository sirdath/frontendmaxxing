/* ============================================
   BUTTONS FX 2 — particle burst on click for buttons-fx2.css
   Inspired by celebratory CTA micro-interactions
   ============================================
   Only bf2-burst needs JS; the other buttons-fx2 variants are pure CSS.
   On click, confetti-like particles fly out from the pointer (appended to
   <body> with fixed positioning so they escape the button's clip).

   Usage:
     ButtonFX.init('[data-button-fx]');     // reads data-button-fx="burst"
     ButtonFX.burst('.cta', { count: 22 });

   Methods: init(sel, opts) · burst(sel, opts) — return instances with destroy().
   Respects prefers-reduced-motion (no particles).
   ============================================ */
(function (root) {
  'use strict';

  var REDUCED = typeof window !== 'undefined' && window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var defaults = { effect: 'burst', count: 18 };

  function getVar(el, name, fb) { var v = getComputedStyle(el).getPropertyValue(name).trim(); return v || fb; }

  function spawn(x, y, color) {
    var p = document.createElement('span');
    p.className = 'bf2-particle';
    p.style.position = 'fixed'; p.style.left = x + 'px'; p.style.top = y + 'px';
    p.style.background = color; p.style.zIndex = '9999';
    document.body.appendChild(p);
    var ang = Math.random() * Math.PI * 2, dist = 30 + Math.random() * 75;
    var anim = p.animate([
      { transform: 'translate(-50%,-50%) translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: 'translate(-50%,-50%) translate(' + (Math.cos(ang) * dist).toFixed(1) + 'px,' + (Math.sin(ang) * dist + 42).toFixed(1) + 'px) rotate(' + (Math.random() * 360).toFixed(0) + 'deg)', opacity: 0 }
    ], { duration: 650 + Math.random() * 450, easing: 'cubic-bezier(0.2,0.7,0.3,1)' });
    anim.onfinish = function () { if (p.parentNode) p.parentNode.removeChild(p); };
  }

  function bind(el, opts) {
    opts = Object.assign({}, defaults, opts || {});
    el.classList.add('bf2', 'bf2-' + (el.getAttribute('data-button-fx') || opts.effect));
    function onClick(e) {
      if (REDUCED) return;
      var colors = [getVar(el, '--bf2-c1', '#8b5cf6'), getVar(el, '--bf2-c2', '#ec4899'), '#fbbf24', '#34d399', '#38bdf8'];
      var x = e.clientX, y = e.clientY;
      if (x == null || (x === 0 && y === 0)) { var r = el.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
      for (var i = 0; i < opts.count; i++) spawn(x, y, colors[i % colors.length]);
    }
    el.addEventListener('click', onClick);
    return { el: el, destroy: function () { el.removeEventListener('click', onClick); } };
  }

  function init(target, opts) {
    var els = typeof target === 'string'
      ? Array.prototype.slice.call(document.querySelectorAll(target))
      : (target instanceof Element ? [target] : Array.prototype.slice.call(target || []));
    return els.map(function (el) { return bind(el, opts); });
  }

  var ButtonFX = { init: init, burst: function (t, o) { return init(t, Object.assign({}, o, { effect: 'burst' })); } };
  if (typeof module !== 'undefined' && module.exports) module.exports = ButtonFX;
  else root.ButtonFX = ButtonFX;
})(typeof window !== 'undefined' ? window : this);
