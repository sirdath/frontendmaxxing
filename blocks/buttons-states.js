/* ============================================
   BUTTON STATES — Drives stateful buttons (async, progress, download, hold, slide)
   Inspired by uiverse.io + Stripe submit buttons
   ============================================
   Usage:
     // Async flow — pass a promise-returning task
     ButtonStates.init('.sbtn-async', {
       task: function () { return fetch('/save').then(r => r.ok); },
       successHold: 1600   // ms to show success before reverting
     });

     // Download / progress (drive manually)
     var inst = ButtonStates.init('.sbtn-download')[0] || ButtonStates.init('#dl');
     inst.progress(42);            // 0..100
     inst.setState('success');

     // Hold-to-confirm
     ButtonStates.init('.sbtn-hold', { holdTime: 1200, onConfirm: fn });

     // Slide-to-confirm (expects a .sbtn-knob child)
     ButtonStates.init('.sbtn-slide', { onConfirm: fn });

   Methods on each instance: setState(s), progress(n), reset()
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    task: null, successHold: 1600, holdTime: 1200,
    onConfirm: null, autoReset: true
  };

  function setState(el, s) { el.dataset.state = s; }

  function wireAsync(el, o) {
    el.addEventListener('click', function () {
      if (el.dataset.state === 'loading') return;
      setState(el, 'loading');
      Promise.resolve(o.task ? o.task(el) : delay(1100).then(function () { return true; }))
        .then(function (ok) {
          setState(el, ok === false ? 'error' : 'success');
        })
        .catch(function () { setState(el, 'error'); })
        .then(function () {
          if (o.autoReset) setTimeout(function () { setState(el, 'idle'); }, o.successHold);
        });
    });
  }

  function wireHold(el, o) {
    var raf, start;
    function begin() {
      start = performance.now();
      setState(el, 'loading');
      step();
    }
    function step() {
      var p = Math.min(100, (performance.now() - start) / o.holdTime * 100);
      el.style.setProperty('--p', p.toFixed(1));
      if (p >= 100) {
        setState(el, 'success');
        if (typeof o.onConfirm === 'function') o.onConfirm(el);
        if (o.autoReset) setTimeout(reset, o.successHold);
        return;
      }
      raf = requestAnimationFrame(step);
    }
    function reset() { cancelAnimationFrame(raf); el.style.setProperty('--p', 0); setState(el, 'idle'); }
    function cancel() { if (el.dataset.state === 'success') return; reset(); }
    el.addEventListener('mousedown', begin);
    el.addEventListener('touchstart', function (e) { e.preventDefault(); begin(); }, { passive: false });
    el.addEventListener('mouseup', cancel);
    el.addEventListener('mouseleave', cancel);
    el.addEventListener('touchend', cancel);
    el._reset = reset;
  }

  function wireSlide(el, o) {
    var knob = el.querySelector('.sbtn-knob');
    if (!knob) return;
    var dragging = false, startX = 0, maxX = 0;
    function down(e) {
      dragging = true;
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      maxX = el.clientWidth - knob.offsetWidth - 8;
      knob.style.transition = 'none';
    }
    function move(e) {
      if (!dragging) return;
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
      x = Math.max(0, Math.min(maxX, x));
      knob.style.left = (4 + x) + 'px';
      el.style.setProperty('--p', (x / maxX * 100).toFixed(0));
      if (x >= maxX - 2) finish();
    }
    function up() {
      if (!dragging) return;
      dragging = false;
      knob.style.transition = 'left 0.15s ease';
      if (el.dataset.state !== 'success') { knob.style.left = '4px'; el.style.setProperty('--p', 0); }
    }
    function finish() {
      dragging = false;
      setState(el, 'success');
      knob.style.left = (el.clientWidth - knob.offsetWidth - 4) + 'px';
      if (typeof o.onConfirm === 'function') o.onConfirm(el);
    }
    knob.addEventListener('mousedown', down);
    knob.addEventListener('touchstart', down, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
  }

  function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function create(el, opts) {
    var o = Object.assign({}, defaults, opts || {});
    var cls = el.classList;
    if (cls.contains('sbtn-hold')) wireHold(el, o);
    else if (cls.contains('sbtn-slide')) wireSlide(el, o);
    else if (cls.contains('sbtn-async') || cls.contains('sbtn-progress') || (o.task)) wireAsync(el, o);

    return {
      el: el,
      setState: function (s) { setState(el, s); return this; },
      progress: function (n) { el.style.setProperty('--p', Math.max(0, Math.min(100, n))); return this; },
      reset: function () { el.style.setProperty('--p', 0); setState(el, 'idle'); if (el._reset) el._reset(); return this; }
    };
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return create(nodes[0], opts);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n, opts)); });
      return arr;
    }
    return create(target, opts);
  }

  var ButtonStates = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = ButtonStates;
  else root.ButtonStates = ButtonStates;
})(typeof window !== 'undefined' ? window : this);
