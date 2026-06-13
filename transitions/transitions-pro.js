/* ============================================
   TRANSITIONS PRO — overlay-driven page/view transitions (6 effects)
   Inspired by codrops PageTransitions, swup/barba overlay themes, View Transitions API
   ============================================
   Plays a cover → swap → reveal sequence: a full-screen overlay animates IN to
   cover the screen, your onSwap() runs (change the view / route) while hidden,
   then the overlay animates OUT to reveal the new content. Works in-page (SPA)
   and pairs with the native View Transitions API where supported.

   Usage:
     <link rel="stylesheet" href="transitions/transitions-pro.css">
     <script src="transitions/transitions-pro.js"></script>

     // Animate a view swap with an effect:
     TransitionsPro.run('circle', { onSwap: function () { showPage(2); } });

     // Use the native View Transitions API (falls back to 'fade'):
     TransitionsPro.view(function () { showPage(2); }, { effect: 'curtain' });

     // Intercept same-origin links for real navigation:
     TransitionsPro.bindLinks('a[data-txp]', { effect: 'panels' });

   Effects: fade · circle · curtain · panels · diagonal · glitch
   Options: { onSwap, duration=600, color, container, effect }
   Respects prefers-reduced-motion (swaps instantly, no animation).
   ============================================ */
(function (root) {
  'use strict';

  // Parts + per-effect stagger (ms) — kept in sync with --txp-stagger in CSS.
  var PARTS = { curtain: 2, panels: 5, stripes: 6, rows: 5, blocks: 24, split: 2 };
  var STAGGERS = { panels: 55, stripes: 45, rows: 60, blocks: 16 };

  function reduced() {
    return typeof window !== 'undefined' && window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function elem(cls) { var e = document.createElement('div'); e.className = cls; return e; }

  function run(effect, opts) {
    opts = opts || {};
    effect = effect || 'fade';
    var onSwap = typeof opts.onSwap === 'function' ? opts.onSwap : function () {};
    var dur = opts.duration || 600;
    var container = opts.container || document.body;

    if (reduced()) { try { onSwap(); } catch (e) {} return Promise.resolve(); }

    var ov = elem('txp-overlay txp-' + effect + (opts.scoped ? ' txp-scoped' : ''));
    ov.style.setProperty('--txp-dur', dur + 'ms');
    if (opts.color) ov.style.setProperty('--txp-color', opts.color);
    var n = PARTS[effect] || 0;
    for (var i = 0; i < n; i++) { var p = elem('txp-part'); p.style.setProperty('--i', i); ov.appendChild(p); }
    container.appendChild(ov);
    ov.getBoundingClientRect(); // force reflow so the first phase animates

    var extra = n > 1 ? (n - 1) * (STAGGERS[effect] || 0) : 0;
    var phaseMs = dur + extra + 30;

    return new Promise(function (resolve) {
      ov.setAttribute('data-phase', 'cover');
      setTimeout(function () {
        try { onSwap(); } catch (e) {}
        ov.setAttribute('data-phase', 'reveal');
        setTimeout(function () {
          if (ov.parentNode) ov.parentNode.removeChild(ov);
          resolve();
        }, phaseMs);
      }, phaseMs);
    });
  }

  // Native View Transitions API when available; otherwise an overlay effect.
  function view(onSwap, opts) {
    opts = opts || {};
    if (typeof document !== 'undefined' && document.startViewTransition && !reduced()) {
      try { return document.startViewTransition(onSwap).finished.catch(function () {}); }
      catch (e) { /* fall through */ }
    }
    return run(opts.effect || 'fade', Object.assign({}, opts, { onSwap: onSwap }));
  }

  // Intercept same-origin links and transition before navigating.
  function bindLinks(selector, opts) {
    opts = opts || {};
    function handler(e) {
      var a = e.target.closest && e.target.closest(selector);
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || a.target === '_blank' || a.hasAttribute('download')) return;
      if (a.origin && a.origin !== location.origin) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      e.preventDefault();
      run(a.getAttribute('data-txp') || opts.effect || 'fade', Object.assign({}, opts, {
        onSwap: function () { /* cover done; navigate while hidden */ window.location.href = href; }
      }));
    }
    document.addEventListener('click', handler);
    return { destroy: function () { document.removeEventListener('click', handler); } };
  }

  var TransitionsPro = {
    run: run, view: view, bindLinks: bindLinks,
    effects: ['fade', 'circle', 'curtain', 'panels', 'diagonal', 'glitch', 'slide', 'zoom', 'stripes', 'rows', 'blocks', 'split', 'flip', 'clock']
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = TransitionsPro;
  else root.TransitionsPro = TransitionsPro;
})(typeof window !== 'undefined' ? window : this);
