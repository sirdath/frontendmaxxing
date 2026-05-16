/* ============================================
   COUNTDOWN — Tick down to a target Date and fire onComplete
   Inspired by launch pages / countdown timers
   ============================================
   Usage:
     Countdown.init('[data-countdown]', {
       to: '2026-12-31T23:59:59',   // or Date instance
       onTick: function (parts) { … },
       onComplete: function () { … }
     });

   Auto-reads `data-cdwn-to`. Updates elements with
   `[data-cdwn-d]`, `[data-cdwn-h]`, `[data-cdwn-m]`, `[data-cdwn-s]`.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    to: null,
    onTick: null,
    onComplete: null,
    pad: true
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var attrTo = el.getAttribute('data-cdwn-to');
    var target = o.to instanceof Date ? o.to : new Date(o.to || attrTo);
    if (isNaN(target.getTime())) return { el: el, destroy: function () {} };

    var dEl = el.querySelector('[data-cdwn-d]');
    var hEl = el.querySelector('[data-cdwn-h]');
    var mEl = el.querySelector('[data-cdwn-m]');
    var sEl = el.querySelector('[data-cdwn-s]');

    var raf = null;
    var done = false;

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function tick() {
      var ms = target.getTime() - Date.now();
      if (ms <= 0) {
        if (!done) {
          done = true;
          if (dEl) dEl.textContent = o.pad ? '00' : '0';
          if (hEl) hEl.textContent = o.pad ? '00' : '0';
          if (mEl) mEl.textContent = o.pad ? '00' : '0';
          if (sEl) sEl.textContent = o.pad ? '00' : '0';
          if (typeof o.onComplete === 'function') o.onComplete();
        }
        return;
      }
      var d = Math.floor(ms / 86400000);
      var h = Math.floor((ms % 86400000) / 3600000);
      var m = Math.floor((ms % 3600000) / 60000);
      var s = Math.floor((ms % 60000) / 1000);
      if (dEl) dEl.textContent = o.pad ? pad(d) : d;
      if (hEl) hEl.textContent = o.pad ? pad(h) : h;
      if (mEl) mEl.textContent = o.pad ? pad(m) : m;
      if (sEl) sEl.textContent = o.pad ? pad(s) : s;
      if (typeof o.onTick === 'function') o.onTick({ d: d, h: h, m: m, s: s, ms: ms });
      raf = setTimeout(tick, 1000 - (Date.now() % 1000));
    }

    tick();

    function destroy() {
      if (raf) clearTimeout(raf);
    }

    return { el: el, destroy: destroy };
  }

  var Countdown = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Countdown;
  else root.Countdown = Countdown;
})(typeof window !== 'undefined' ? window : this);
