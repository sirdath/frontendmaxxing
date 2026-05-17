/* ============================================
   ONBOARDING PACK — Wizard step navigation + plan picking + next checklist
   ============================================
   Usage:
     OnboardingPack.wizard('[data-onb-wiz]', { steps: 4, onStep, onComplete });
     OnboardingPack.plan('[data-onb-plan]', { onPick });
     OnboardingPack.next('[data-onb-next]', { storageKey, onProgress });
     OnboardingPack.install('[data-onb-install]', { onInstall, onDismiss });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function wizard(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var steps = opts.steps || host.querySelectorAll('.onb-wiz-dots > i').length || 3;
      var cur = 0;
      var dots = host.querySelectorAll('.onb-wiz-dots > i');
      var back = host.querySelector('.onb-wiz-back');
      var next = host.querySelector('.onb-wiz-next');
      var lbl = host.querySelector('.onb-wiz-step-label');

      function render() {
        dots.forEach(function (d, i) {
          d.classList.remove('is-active', 'is-done');
          if (i < cur) d.classList.add('is-done');
          if (i === cur) d.classList.add('is-active');
        });
        if (lbl) lbl.textContent = 'Step ' + (cur + 1) + ' of ' + steps;
        if (next) next.textContent = (cur === steps - 1) ? 'Finish' : 'Continue';
        if (back) back.style.visibility = cur === 0 ? 'hidden' : 'visible';
        if (typeof opts.onStep === 'function') opts.onStep(cur);
      }
      render();

      // Choice picking inside grid
      host.querySelectorAll('.onb-wiz-choice').forEach(function (c) {
        c.addEventListener('click', function () {
          var single = !host.querySelector('.onb-wiz-grid')?.dataset.multi;
          if (single) host.querySelectorAll('.onb-wiz-choice.is-picked').forEach(function (x) { x.classList.remove('is-picked'); });
          c.classList.toggle('is-picked');
        });
      });

      if (next) next.addEventListener('click', function () {
        if (cur === steps - 1) {
          if (typeof opts.onComplete === 'function') opts.onComplete();
          return;
        }
        cur++; render();
      });
      if (back) back.addEventListener('click', function () {
        if (cur === 0) return;
        cur--; render();
      });
    });
  }

  function plan(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      host.querySelectorAll('.onb-plan-card').forEach(function (c) {
        c.addEventListener('click', function () {
          host.querySelectorAll('.onb-plan-card.is-picked').forEach(function (x) { x.classList.remove('is-picked'); });
          c.classList.add('is-picked');
          if (typeof opts.onPick === 'function') opts.onPick(c.dataset.plan || c.querySelector('.onb-plan-name').textContent, c);
        });
      });
    });
  }

  function next(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var items = host.querySelectorAll('.onb-next-item');
      var bar = host.querySelector('.onb-next-bar > i');
      var pctEl = host.querySelector('.onb-next-pct');

      // Restore
      if (opts.storageKey) {
        try {
          var saved = JSON.parse(localStorage.getItem(opts.storageKey) || '[]');
          items.forEach(function (it, i) { if (saved.indexOf(i) !== -1) it.classList.add('is-done'); });
        } catch (_) {}
      }
      update();

      items.forEach(function (it, i) {
        it.addEventListener('click', function () {
          it.classList.toggle('is-done');
          update();
          if (opts.storageKey) {
            var done = [];
            items.forEach(function (x, j) { if (x.classList.contains('is-done')) done.push(j); });
            try { localStorage.setItem(opts.storageKey, JSON.stringify(done)); } catch (_) {}
          }
        });
      });

      function update() {
        var done = host.querySelectorAll('.onb-next-item.is-done').length;
        var total = items.length;
        var pct = total ? (done / total) * 100 : 0;
        if (bar) bar.style.setProperty('--p', pct.toFixed(0) + '%');
        if (pctEl) pctEl.textContent = done + ' / ' + total + ' done';
        if (typeof opts.onProgress === 'function') opts.onProgress(done, total);
      }
    });
  }

  function install(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var cta = host.querySelector('.onb-install-cta');
      var x = host.querySelector('.onb-install-dismiss');
      if (cta) cta.addEventListener('click', function () { if (typeof opts.onInstall === 'function') opts.onInstall(); });
      if (x) x.addEventListener('click', function () {
        host.style.display = 'none';
        if (typeof opts.onDismiss === 'function') opts.onDismiss();
      });
    });
  }

  var OnboardingPack = { wizard: wizard, plan: plan, next: next, install: install };
  if (typeof module !== 'undefined' && module.exports) module.exports = OnboardingPack;
  else root.OnboardingPack = OnboardingPack;
})(typeof window !== 'undefined' ? window : this);
