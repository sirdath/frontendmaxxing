/* ============================================
   ONBOARDING CHECKLIST — Tick items, recompute progress, persist
   ============================================
   Usage:
     OnboardingChecklist.init('[data-ochk]', {
       storageKey: 'onb-getting-started',
       onComplete: function () {},
       onProgress: function (done, total) {}
     });
   ============================================ */
(function (root) {
  'use strict';
  var defaults = { storageKey: null, onComplete: null, onProgress: null };

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
    var items = host.querySelectorAll('.ochk-item');
    var bar = host.querySelector('.ochk-bar > i');
    var progEl = host.querySelector('.ochk-progress');

    // Restore from storage
    if (o.storageKey) {
      try {
        var saved = JSON.parse(localStorage.getItem(o.storageKey) || '[]');
        items.forEach(function (item, i) {
          if (saved.indexOf(i) !== -1) item.classList.add('is-done');
        });
      } catch (_) {}
    }
    update();

    items.forEach(function (item, i) {
      var tick = item.querySelector('.ochk-tick');
      if (!tick) return;
      tick.addEventListener('click', function () {
        item.classList.toggle('is-done');
        update();
        persist();
      });
    });

    function update() {
      var done = host.querySelectorAll('.ochk-item.is-done').length;
      var total = items.length;
      var pct = total === 0 ? 0 : (done / total) * 100;
      if (bar) bar.style.setProperty('--ochk-pct', pct.toFixed(0) + '%');
      if (progEl) progEl.textContent = done + ' of ' + total;
      if (typeof o.onProgress === 'function') o.onProgress(done, total);
      if (done === total && typeof o.onComplete === 'function') o.onComplete();
    }
    function persist() {
      if (!o.storageKey) return;
      var done = [];
      items.forEach(function (item, i) { if (item.classList.contains('is-done')) done.push(i); });
      try { localStorage.setItem(o.storageKey, JSON.stringify(done)); } catch (_) {}
    }

    return { el: host, refresh: update };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var OnboardingChecklist = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = OnboardingChecklist;
  else root.OnboardingChecklist = OnboardingChecklist;
})(typeof window !== 'undefined' ? window : this);
