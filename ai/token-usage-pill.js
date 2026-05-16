/* ============================================
   TOKEN USAGE PILL — Controller for .tup elements
   ============================================
   Usage:
     // Auto-init: reads data-tup-used / data-tup-max from elements
     TokenUsagePill.init('[data-tup]');

     // Programmatic:
     TokenUsagePill.set('.tup-active', { used: 124000, max: 200000 });
     TokenUsagePill.set(el, { used: 50, max: 100, format: 'percent' });

     // Track via:
     var pill = TokenUsagePill.create('.tup-active');
     pill.update(50000, 200000);

     // Formatters:
     TokenUsagePill.formatTokens(124000) → "124k"
     TokenUsagePill.formatTokens(1500000) → "1.5M"
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    format: 'tokens',     // 'tokens' | 'percent' | 'raw'
    thresholdMid: 0.5,
    thresholdWarn: 0.75,
    thresholdCritical: 0.9,
    showLabel: false,
    label: 'Context'
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target || '[data-tup]')
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) {
      var used = Number(el.dataset.tupUsed || 0);
      var max = Number(el.dataset.tupMax || 100);
      update(el, used, max, mergeOpts(opts));
    });
  }

  function create(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    if (!el.querySelector('.tup-arc')) buildMarkup(el, opts || {});
    var o = mergeOpts(opts);
    return {
      el: el,
      update: function (used, max) { update(el, used, max, o); },
      setMax: function (max) {
        var used = Number(el.dataset.tupUsed || 0);
        update(el, used, max, o);
      },
      destroy: function () { el.innerHTML = ''; }
    };
  }

  function set(target, vals) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var o = mergeOpts(vals);
    Array.prototype.forEach.call(els, function (el) {
      update(el, Number(vals.used) || 0, Number(vals.max) || 100, o);
    });
  }

  function buildMarkup(el, opts) {
    el.classList.add('tup');
    el.innerHTML =
      (opts.showLabel ? '<span class="tup-label">' + escape(opts.label || 'Context') + '</span>' : '') +
      '<svg class="tup-arc" viewBox="0 0 24 24">' +
        '<circle class="tup-track" cx="12" cy="12" r="9"/>' +
        '<circle class="tup-fill" cx="12" cy="12" r="9"/>' +
      '</svg>' +
      '<span class="tup-text">' +
        '<span class="tup-used">0</span>' +
        '<span class="tup-sep">/</span>' +
        '<span class="tup-max">0</span>' +
      '</span>';
  }

  function update(el, used, max, opts) {
    if (!el.querySelector('.tup-arc') && !el.classList.contains('tup-bar')) buildMarkup(el, opts);
    var pct = max > 0 ? used / max : 0;
    pct = Math.max(0, Math.min(1, pct));
    el.style.setProperty('--tup-pct', pct.toFixed(3));
    el.dataset.tupUsed = used;
    el.dataset.tupMax = max;

    el.classList.remove('is-low', 'is-mid', 'is-warn', 'is-critical');
    if (pct < opts.thresholdMid)         el.classList.add('is-low');
    else if (pct < opts.thresholdWarn)    el.classList.add('is-mid');
    else if (pct < opts.thresholdCritical) el.classList.add('is-warn');
    else                                  el.classList.add('is-critical');

    var usedEl = el.querySelector('.tup-used');
    var maxEl = el.querySelector('.tup-max');
    if (usedEl) usedEl.textContent = formatValue(used, opts);
    if (maxEl)  maxEl.textContent = formatValue(max, opts);

    if (opts.format === 'percent' && usedEl) {
      usedEl.textContent = (pct * 100).toFixed(0) + '%';
      if (maxEl) maxEl.parentNode.removeChild(maxEl);
      var sep = el.querySelector('.tup-sep');
      if (sep) sep.parentNode.removeChild(sep);
    }
  }

  function formatValue(n, opts) {
    if (opts.format === 'raw') return String(Math.round(n));
    return formatTokens(n);
  }

  function formatTokens(n) {
    n = Math.round(n);
    if (n < 1000) return String(n);
    if (n < 1000000) return (n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, '') + 'k';
    return (n / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M';
  }

  function escape(s) {
    return String(s == null ? '' : s).replace(/[<>&]/g, function (c) {
      return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]);
    });
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var TokenUsagePill = {
    init: init,
    create: create,
    set: set,
    formatTokens: formatTokens
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = TokenUsagePill;
  else root.TokenUsagePill = TokenUsagePill;
})(typeof window !== 'undefined' ? window : this);
