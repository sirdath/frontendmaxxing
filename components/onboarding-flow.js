/* ============================================
   ONBOARDING FLOW — State machine for the .obf multi-step flow shell
   Companion to components/onboarding-flow.css
   ============================================
   Usage:
     OnboardingFlow.init('.obf', {
       start: 0,                                   // initial step index
       onStep: function (i, dir) {},               // after every transition (dir: 1 fwd, -1 back)
       validate: function (i, stepEl) {            // sync or async; runs before Next
         return true;                              // true/undefined → advance
         // return false                           // → block silently
         // return 'Message'                       // → block + show in .obf-error
       },
       onSkip: function (i, flow) {},              // Skip pressed (default: completes flow)
       onComplete: function (flow) {}              // Finish pressed on last step
     });

   Methods:  .next() · .back() · .go(i) · .destroy() · .el · .index · .total
   Keyboard: ArrowRight / ArrowLeft navigate (ignored while typing in inputs)
   A11y:     focus moves to the new step's .obf-title; Back disabled on step 0
   Last step: Next label swaps to data-finish-label on .obf (default "Finish")
   Auto-build: empty .obf-progress / .obf-dots get one <i> per step
   ============================================ */
(function (global) {
  'use strict';

  var ENTER_MS = 340; // CSS enter (320ms blessed) + settle buffer

  var defaults = {
    start: 0,
    onStep: null,
    validate: null,
    onSkip: null,
    onComplete: null
  };

  function reducedMotion() {
    return typeof global.matchMedia === 'function' &&
      global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function create(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = (opts && opts[k] !== undefined) ? opts[k] : defaults[k];

    var steps = Array.prototype.slice.call(el.querySelectorAll('.obf-step'));
    var progress = el.querySelector('.obf-progress');
    var dots = el.querySelector('.obf-dots');
    var backBtn = el.querySelector('.obf-back');
    var nextBtn = el.querySelector('.obf-next');
    var skipBtn = el.querySelector('.obf-skip');
    var total = steps.length;
    var index = Math.max(0, Math.min(o.start | 0, total - 1));
    var busy = false;
    var destroyed = false;
    var timer = null;
    var nextLabel = nextBtn ? nextBtn.textContent : 'Next';
    var finishLabel = el.getAttribute('data-finish-label') || 'Finish';

    /* ── build empty indicators: one <i> per step ── */
    function build(box) {
      if (!box || box.children.length) return;
      for (var i = 0; i < total; i++) box.appendChild(document.createElement('i'));
    }
    build(progress);
    build(dots);

    /* ── painters ── */
    function mark(box, done) {
      if (!box) return;
      for (var i = 0; i < box.children.length; i++) {
        var c = box.children[i].classList;
        c.toggle('is-done', done || i < index);
        c.toggle('is-active', !done && i === index);
      }
    }
    function paint(done) {
      mark(progress, done);
      mark(dots, done);
      if (backBtn) backBtn.disabled = index === 0;
      if (nextBtn) nextBtn.textContent = index === total - 1 ? finishLabel : nextLabel;
    }

    /* ── validation error UI ── */
    function clearError(stepEl) {
      var e = stepEl && stepEl.querySelector('.obf-error');
      if (e) e.classList.remove('is-on');
    }
    function showError(stepEl, msg) {
      var e = stepEl.querySelector('.obf-error');
      if (!e) {
        e = document.createElement('p');
        e.className = 'obf-error';
        (stepEl.querySelector('.obf-body') || stepEl).appendChild(e);
      }
      e.textContent = msg;
      e.classList.remove('is-on');
      void e.offsetWidth; /* restart entry animation */
      e.classList.add('is-on');
    }

    /* ── transitions ── */
    function settle() {
      for (var i = 0; i < total; i++) {
        steps[i].classList.remove('is-enter-fwd', 'is-enter-back', 'is-leave-fwd', 'is-leave-back');
        steps[i].classList.toggle('is-active', i === index);
      }
    }
    function focusHeading(stepEl) {
      var h = stepEl.querySelector('.obf-title') || stepEl;
      if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
      try { h.focus({ preventScroll: true }); } catch (err) { h.focus(); }
    }
    function go(i, dir) {
      if (destroyed || typeof i !== 'number' || i < 0 || i >= total || i === index) return api;
      dir = dir || (i > index ? 1 : -1);
      if (timer) { clearTimeout(timer); timer = null; }
      var from = steps[index];
      var to = steps[i];
      index = i;
      settle(); /* clears stale transition classes, activates the new step */
      clearError(to);
      if (!reducedMotion()) {
        from.classList.add(dir > 0 ? 'is-leave-fwd' : 'is-leave-back');
        to.classList.add(dir > 0 ? 'is-enter-fwd' : 'is-enter-back');
        timer = setTimeout(function () { timer = null; settle(); }, ENTER_MS);
      }
      paint();
      focusHeading(to);
      if (typeof o.onStep === 'function') o.onStep(index, dir);
      return api;
    }

    /* ── next / back / skip ── */
    function next() {
      if (destroyed || busy) return api;
      var stepEl = steps[index];
      var finishing = index === total - 1;
      clearError(stepEl);

      function proceed(res) {
        busy = false;
        el.classList.remove('is-busy');
        if (nextBtn) nextBtn.disabled = false;
        if (destroyed || res === false) return;
        if (typeof res === 'string' && res) { showError(stepEl, res); return; }
        if (finishing) {
          el.classList.add('is-complete');
          paint(true); /* fill every segment + dot */
          if (typeof o.onComplete === 'function') o.onComplete(api);
        } else {
          go(index + 1, 1);
        }
      }

      if (typeof o.validate === 'function') {
        busy = true;
        el.classList.add('is-busy');
        if (nextBtn) nextBtn.disabled = true;
        var res;
        try { res = o.validate(index, stepEl); } catch (err) { proceed(false); return api; }
        if (res && typeof res.then === 'function') {
          res.then(proceed, function () { proceed(false); });
        } else {
          proceed(res);
        }
      } else {
        proceed(true);
      }
      return api;
    }
    function back() {
      if (!busy && index > 0) go(index - 1, -1);
      return api;
    }
    function skip() {
      if (destroyed || busy) return;
      if (typeof o.onSkip === 'function') { o.onSkip(index, api); return; }
      el.classList.add('is-complete');
      paint(true);
      if (typeof o.onComplete === 'function') o.onComplete(api);
    }

    /* ── keyboard (skipped while typing) ── */
    function onKey(e) {
      if (e.defaultPrevented || destroyed) return;
      var t = e.target;
      var tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); back(); }
    }

    function onNextClick() { next(); }
    function onBackClick() { back(); }
    function onSkipClick() { skip(); }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      if (nextBtn) nextBtn.removeEventListener('click', onNextClick);
      if (backBtn) backBtn.removeEventListener('click', onBackClick);
      if (skipBtn) skipBtn.removeEventListener('click', onSkipClick);
      settle();
    }

    /* ── boot ── */
    settle();
    paint();
    if (nextBtn) nextBtn.addEventListener('click', onNextClick);
    if (backBtn) backBtn.addEventListener('click', onBackClick);
    if (skipBtn) skipBtn.addEventListener('click', onSkipClick);
    document.addEventListener('keydown', onKey);

    var api = {
      el: el,
      next: next,
      back: back,
      go: function (i) { return go(i); },
      destroy: destroy
    };
    try {
      Object.defineProperty(api, 'index', { get: function () { return index; } });
      Object.defineProperty(api, 'total', { get: function () { return total; } });
    } catch (err) { api.index = index; api.total = total; }
    return api;
  }

  function init(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    return create(el, opts || {});
  }

  var OnboardingFlow = { init: init };

  if (typeof module !== 'undefined' && module.exports) { module.exports = OnboardingFlow; } else { global.OnboardingFlow = OnboardingFlow; }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
