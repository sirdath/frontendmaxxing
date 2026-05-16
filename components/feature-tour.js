/* ============================================
   FEATURE TOUR — Carousel walkthrough modal
   ============================================
   Usage:
     var tour = FeatureTour.init('[data-ftour]', {
       autoOpen: true,
       onStep: function (i) {},
       onComplete: function () {},
       onSkip: function () {}
     });
     tour.open(); tour.close(); tour.next(); tour.prev(); tour.go(2);
   ============================================ */
(function (root) {
  'use strict';
  var defaults = { autoOpen: false, onStep: null, onComplete: null, onSkip: null };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(host, opts) {
    var o = mergeOpts(opts);
    var steps = host.querySelectorAll('.ftour-step');
    var dots = host.querySelectorAll('.ftour-dots > i');
    var nextBtn = host.querySelector('.ftour-next');
    var skipBtn = host.querySelector('.ftour-skip');
    var cur = 0;

    function open() { host.classList.add('is-open'); show(0); }
    function close() { host.classList.remove('is-open'); }
    function show(i) {
      i = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach(function (s, j) {
        s.classList.remove('is-active', 'is-leaving');
        if (j < i) s.classList.add('is-leaving');
        if (j === i) s.classList.add('is-active');
      });
      dots.forEach(function (d, j) { d.classList.toggle('is-active', j === i); });
      cur = i;
      if (nextBtn) nextBtn.textContent = (i === steps.length - 1) ? 'Get started' : 'Next';
      if (typeof o.onStep === 'function') o.onStep(i);
    }
    function next() {
      if (cur === steps.length - 1) {
        close();
        if (typeof o.onComplete === 'function') o.onComplete();
      } else { show(cur + 1); }
    }
    function prev() { show(cur - 1); }
    function go(i) { show(i); }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (skipBtn) skipBtn.addEventListener('click', function () { close(); if (typeof o.onSkip === 'function') o.onSkip(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); }); });
    host.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') close();
    });
    host.tabIndex = -1;

    if (o.autoOpen) open();

    return { el: host, open: open, close: close, next: next, prev: prev, go: go };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var FeatureTour = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = FeatureTour;
  else root.FeatureTour = FeatureTour;
})(typeof window !== 'undefined' ? window : this);
