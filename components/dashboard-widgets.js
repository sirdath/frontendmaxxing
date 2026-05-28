/* ============================================
   DASHBOARD WIDGETS — Sparklines, goal rings, count-up, metric tabs
   Inspired by Vercel / Linear / Stripe dashboards
   ============================================
   Optional enhancer for dashboard-widgets.css. All pure-canvas-free (inline
   SVG / CSS vars), zero deps.

   Usage:
     DashboardWidgets.sparkline('.dw-spark', [4,6,5,8,7,9,12]);  // or data-spark="4,6,5,…"
     DashboardWidgets.ring('.dw-ring', 72);                       // or --p set in markup
     DashboardWidgets.countUp('.dw-metric-value');                // animates to its number
     DashboardWidgets.tabs('.dw-tabs', function(i, btn){ … });
     DashboardWidgets.initAll();   // auto-wire everything with data attributes
   ============================================ */
(function (root) {
  'use strict';

  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  // Build an SVG sparkline (line + soft area) into a .dw-spark element
  function sparkline(target, data) {
    var els = typeof target === 'string' ? $all(target) : [target];
    els.forEach(function (el) {
      var pts = data || (el.dataset.spark ? el.dataset.spark.split(',').map(Number) : null);
      if (!pts || pts.length < 2) return;
      var w = 100, h = 36, pad = 3;
      var min = Math.min.apply(null, pts), max = Math.max.apply(null, pts);
      var range = (max - min) || 1;
      var step = (w - pad * 2) / (pts.length - 1);
      var coords = pts.map(function (v, i) {
        var x = pad + i * step;
        var y = h - pad - ((v - min) / range) * (h - pad * 2);
        return [x, Math.round(y * 100) / 100];
      });
      var line = coords.map(function (c, i) { return (i ? 'L' : 'M') + c[0] + ',' + c[1]; }).join('');
      var area = line + 'L' + coords[coords.length - 1][0] + ',' + h + 'L' + coords[0][0] + ',' + h + 'Z';
      el.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">' +
        '<path class="dw-spark-area" d="' + area + '"/><path d="' + line + '"/></svg>';
    });
  }

  function ring(target, pct) {
    var els = typeof target === 'string' ? $all(target) : [target];
    els.forEach(function (el) {
      var p = pct != null ? pct : parseFloat(el.dataset.p || el.style.getPropertyValue('--p') || 0);
      var start = null, from = 0, dur = 800;
      function tick(t) {
        if (!start) start = t;
        var k = Math.min(1, (t - start) / dur);
        var eased = 1 - Math.pow(1 - k, 3);
        el.style.setProperty('--p', (from + (p - from) * eased).toFixed(1));
        if (k < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function countUp(target, opts) {
    opts = opts || {};
    var els = typeof target === 'string' ? $all(target) : [target];
    els.forEach(function (el) {
      var raw = (el.dataset.to || el.textContent).replace(/[^0-9.]/g, '');
      var to = parseFloat(raw); if (isNaN(to)) return;
      var prefix = el.dataset.prefix || (/^[^0-9.-]+/.exec(el.textContent) || [''])[0];
      var suffix = el.dataset.suffix || (/[^0-9.,]+$/.exec(el.textContent) || [''])[0];
      var dur = opts.duration || 900, start = null;
      function tick(t) {
        if (!start) start = t;
        var k = Math.min(1, (t - start) / dur);
        var eased = 1 - Math.pow(1 - k, 3);
        var v = to * eased;
        el.textContent = prefix + (to % 1 ? v.toFixed(1) : Math.round(v)).toLocaleString() + suffix;
        if (k < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function tabs(target, onChange) {
    var els = typeof target === 'string' ? $all(target) : [target];
    els.forEach(function (bar) {
      bar.addEventListener('click', function (e) {
        var b = e.target.closest('.dw-tab'); if (!b) return;
        var btns = $all('.dw-tab', bar);
        btns.forEach(function (x) { x.classList.remove('is-on'); });
        b.classList.add('is-on');
        if (typeof onChange === 'function') onChange(btns.indexOf(b), b);
      });
    });
  }

  function initAll() {
    sparkline('[data-spark]');
    $all('.dw-ring[data-p]').forEach(function (el) { ring(el); });
    $all('[data-countup]').forEach(function (el) { countUp(el); });
    tabs('.dw-tabs');
  }

  var DashboardWidgets = { sparkline: sparkline, ring: ring, countUp: countUp, tabs: tabs, initAll: initAll };
  if (typeof module !== 'undefined' && module.exports) module.exports = DashboardWidgets;
  else root.DashboardWidgets = DashboardWidgets;
})(typeof window !== 'undefined' ? window : this);
