/* ============================================
   NAMED TRANSITIONS — Shared-element morph on top of the View Transitions API
   Inspired by Chrome's shared-element view-transition demos
   ============================================
   A concrete morph primitive: pairs a source and destination with the SAME
   view-transition-name only around a DOM swap (assigning at rest throws), runs
   the swap through ViewTransitions.run (so its fallback + data-vt-type hooks
   apply), then clears the names. Builds ON transitions/view-transitions.js — load
   it first. Style the timing with transitions/named-transitions.css.

   Usage:
     NamedTransitions.init('[data-vt-morph]', openDetail);   // declarative click→morph
     // or imperative:
     NamedTransitions.morph('.thumb', '.hero', function () { openDetailView(); });

   Methods: morph(from, to, swap, opts) · init(selector, swapFn)
   ============================================ */
(function (root) {
  'use strict';

  var seq = 0;
  function el(x) { return typeof x === 'string' ? document.querySelector(x) : x; }
  function reducedMotion() { return root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function vtSupported() { return typeof document !== 'undefined' && typeof document.startViewTransition === 'function'; }

  function runSwap(swap, opts) {
    if (root.ViewTransitions && typeof root.ViewTransitions.run === 'function') return root.ViewTransitions.run(swap, opts);
    if (vtSupported()) return document.startViewTransition(swap).finished;
    return Promise.resolve(swap());
  }

  // Morph `from` into `to` across a DOM `swap`. `to` may be created inside swap.
  function morph(fromSel, toSel, swap, opts) {
    swap = swap || function () {};
    var from = el(fromSel);
    // reduced-motion or no VT → just run the swap (cross-fade at most), no morph
    if (reducedMotion() || !vtSupported()) { return Promise.resolve(swap()).then(function () {}); }

    var name = 'vt-morph-' + (++seq);
    if (from) from.style.viewTransitionName = name;

    function doSwap() {
      var r = swap();
      if (from) from.style.viewTransitionName = '';   // free the name before the "new" snapshot
      var to = el(toSel);
      if (to) to.style.viewTransitionName = name;
      return r;
    }

    return runSwap(doSwap, opts).then(function () {
      var to = el(toSel);
      if (to) to.style.viewTransitionName = '';
      if (from) from.style.viewTransitionName = '';
    });
  }

  // Declarative: click an element with [data-vt-morph] to morph it into the
  // element matched by its [data-vt-target] selector, running swapFn for the swap.
  function init(selector, swapFn) {
    var nodes = document.querySelectorAll(selector || '[data-vt-morph]');
    var bound = [];
    Array.prototype.forEach.call(nodes, function (n) {
      var handler = function () { morph(n, n.getAttribute('data-vt-target'), swapFn || function () {}); };
      n.addEventListener('click', handler);
      bound.push({ el: n, destroy: function () { n.removeEventListener('click', handler); } });
    });
    return bound;
  }

  var NamedTransitions = { morph: morph, init: init, supported: vtSupported };
  if (typeof module !== 'undefined' && module.exports) module.exports = NamedTransitions;
  else root.NamedTransitions = NamedTransitions;
})(typeof window !== 'undefined' ? window : this);
