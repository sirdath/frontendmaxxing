/* ============================================
   SPLASH INTRO — Orchestrates the .spl boot overlay: progress, then unveil
   Companion CSS: components/splash-intro.css
   ============================================
   Usage:
     var splash = SplashIntro.init('#splash', {
       minDuration: 1200,       // ms the splash stays up at minimum
       unveil: 'curtain',       // 'fade' | 'curtain' | 'iris' | 'split'
       once: null,              // sessionStorage key -> skip on repeat visits
       onDone: function () {}   // fires after the unveil completes
     });
     splash.auto();             // fake-progress eases toward ~90%...
     splash.done();             // ...complete + unveil when the app is ready
     // or drive it yourself: splash.progress(0.42)

   Methods: .progress(0-1), .auto(), .done() · Property: .el
   Notes: prefers-reduced-motion -> instant reveal; once-key hit ->
          overlay removed immediately, onDone still fires.
   ============================================ */
(function (global) {
  'use strict';

  var UNVEILS = ['fade', 'curtain', 'iris', 'split'];
  var UNVEIL_MS = 480; /* matches the CSS unveil transition */
  var SETTLE_MS = 200; /* matches the .spl-bar width transition */

  function now() {
    return (typeof performance !== 'undefined' && performance.now)
      ? performance.now() : Date.now();
  }

  function reducedMotion() {
    return typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function storageGet(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key) {
    try { sessionStorage.setItem(key, '1'); } catch (e) { /* sandboxed */ }
  }

  /* Split .spl-logo--letters text into <span>s (or index existing ones) */
  function splitLetters(el) {
    var logos = el.querySelectorAll('.spl-logo--letters');
    for (var l = 0; l < logos.length; l++) {
      var logo = logos[l];
      var spans = logo.querySelectorAll('span');
      if (!spans.length) {
        var text = logo.textContent;
        logo.textContent = '';
        for (var c = 0; c < text.length; c++) {
          var s = document.createElement('span');
          s.textContent = text[c] === ' ' ? ' ' : text[c];
          logo.appendChild(s);
        }
        spans = logo.querySelectorAll('span');
      }
      for (var i = 0; i < spans.length; i++) {
        spans[i].style.setProperty('--spl-i', String(i));
      }
    }
  }

  function init(target, opts) {
    var el = typeof target === 'string'
      ? (typeof document !== 'undefined' ? document.querySelector(target) : null)
      : target;
    if (!el) return null;
    opts = opts || {};

    var minDuration = opts.minDuration == null ? 1200 : opts.minDuration;
    var onceKey = opts.once || null;
    var onDone = typeof opts.onDone === 'function' ? opts.onDone : null;

    /* resolve unveil variant: option > existing class > 'fade' */
    var current = null;
    for (var i = 0; i < UNVEILS.length; i++) {
      if (el.classList.contains('spl--' + UNVEILS[i])) { current = UNVEILS[i]; break; }
    }
    var unveil = UNVEILS.indexOf(opts.unveil) > -1 ? opts.unveil : (current || 'fade');
    if (current && current !== unveil) el.classList.remove('spl--' + current);
    el.classList.add('spl', 'spl--' + unveil);

    var start = now();
    var p = 0;
    var rafId = 0;
    var doneCalled = false;
    var removed = false;
    var status = el.querySelector('.spl-status');

    function finish() {
      if (removed) return;
      removed = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (el.parentNode) el.parentNode.removeChild(el);
      if (onDone) onDone();
    }

    function setProgress(value) {
      if (removed) return api;
      p = Math.max(0, Math.min(1, +value || 0));
      el.style.setProperty('--spl-progress', String(p));
      if (status && status.hasAttribute('data-spl-percent')) {
        status.textContent = Math.round(p * 100) + '%';
      }
      return api;
    }

    /* fake-progress: ease toward ~92% until .done() lands */
    function auto() {
      if (removed || doneCalled || reducedMotion()) return api;
      if (rafId) cancelAnimationFrame(rafId);
      var last = 0;
      function step(t) {
        if (removed || doneCalled) return;
        var dt = last ? Math.min(t - last, 64) : 16;
        last = t;
        setProgress(p + (0.92 - p) * (1 - Math.exp(-dt / 600)));
        rafId = requestAnimationFrame(step);
      }
      rafId = requestAnimationFrame(step);
      return api;
    }

    function done() {
      if (removed || doneCalled) return api;
      doneCalled = true;
      if (rafId) cancelAnimationFrame(rafId);
      setProgress(1);
      if (onceKey) storageSet(onceKey);
      if (reducedMotion()) { finish(); return api; }
      var remaining = Math.max(0, minDuration - (now() - start));
      setTimeout(function () {
        el.classList.add('is-done');
        setTimeout(finish, UNVEIL_MS + 80);
      }, remaining + SETTLE_MS);
      return api;
    }

    var api = { el: el, progress: setProgress, auto: auto, done: done };

    /* once-key already seen: drop the overlay immediately, still call onDone */
    if (onceKey && storageGet(onceKey)) {
      doneCalled = true;
      removed = true;
      if (el.parentNode) el.parentNode.removeChild(el);
      setTimeout(function () { if (onDone) onDone(); }, 0);
      return api;
    }

    splitLetters(el);
    return api;
  }

  var SplashIntro = { init: init };

  if (typeof module !== 'undefined' && module.exports) { module.exports = SplashIntro; } else { global.SplashIntro = SplashIntro; }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
