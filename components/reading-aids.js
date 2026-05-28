/* ============================================
   READING AIDS — Drives the reading-progress bar + back-to-top button
   Inspired by Medium / docs themes
   ============================================
   Usage:
     ReadingAids.init();                         // injects both, tracks whole page
     ReadingAids.init({ target: '.article' });   // progress measured over an element
     ReadingAids.init({ bar: false });           // back-to-top only
     ReadingAids.init({ top: false, ring: true });

   Options:
     target     element whose scroll-through = 100% (default: document)
     bar        show progress bar (default true) · barGlow (default false)
     top        show back-to-top button (default true)
     ring       draw progress ring around the button (sets --p on it too)
     showAfter  px scrolled before back-to-top appears (default 400)
     smooth     smooth scroll to top (default true)
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { target: null, bar: true, barGlow: false, top: true, ring: false, showAfter: 400, smooth: true };

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function init(opts) {
    var o = Object.assign({}, defaults, opts || {});
    var target = o.target ? (typeof o.target === 'string' ? document.querySelector(o.target) : o.target) : null;

    var bar = null, fill = null, topBtn = null;

    if (o.bar) {
      bar = document.querySelector('.ra-bar') || (function () {
        var b = document.createElement('div'); b.className = 'ra-bar' + (o.barGlow ? ' ra-bar-glow' : '');
        b.innerHTML = '<i></i>'; document.body.appendChild(b); return b;
      })();
      fill = bar.querySelector('i') || bar;
    }
    if (o.top) {
      topBtn = document.querySelector('.ra-top') || (function () {
        var t = document.createElement('button');
        t.className = 'ra-top' + (o.ring ? ' ra-top-ring' : '');
        t.setAttribute('aria-label', 'Back to top'); t.innerHTML = '↑';
        document.body.appendChild(t); return t;
      })();
      topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: o.smooth ? 'smooth' : 'auto' });
      });
    }

    function progress() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var p;
      if (target) {
        var rect = target.getBoundingClientRect();
        var start = rect.top + scrollTop;                 // doc Y where target begins
        var total = target.offsetHeight - window.innerHeight;
        p = clamp((scrollTop - start) / (total > 0 ? total : 1), 0, 1);
      } else {
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        p = clamp(scrollTop / (docH > 0 ? docH : 1), 0, 1);
      }
      if (fill) fill.style.setProperty('--p', p.toFixed(4));
      if (bar && bar !== fill) bar.style.setProperty('--p', p.toFixed(4));
      if (topBtn) {
        topBtn.classList.toggle('is-on', scrollTop > o.showAfter);
        if (o.ring) topBtn.style.setProperty('--p', p.toFixed(4));
      }
    }

    var ticking = false;
    function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(function () { progress(); ticking = false; }); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    progress();

    return {
      destroy: function () {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        if (bar) bar.remove(); if (topBtn) topBtn.remove();
      }
    };
  }

  var ReadingAids = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = ReadingAids;
  else root.ReadingAids = ReadingAids;
})(typeof window !== 'undefined' ? window : this);
