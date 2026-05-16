/* ============================================
   CHART FUNNEL — Funnel chart for conversion drop-off
   Inspired by Mixpanel / Amplitude / PostHog funnels
   ============================================
   Usage:
     ChartFunnel.create('#container', {
       data: [
         { label: 'Visits',  value: 1000 },
         { label: 'Signups', value: 320 },
         { label: 'Active',  value: 110 },
         { label: 'Paying',  value: 32 }
       ],
       color: '#818cf8',
       showPercent: true,
       showAbs: true
     });
   ============================================ */
(function (root) {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';

  function create(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    opts = opts || {};
    var data = opts.data || [];
    var width = opts.width || el.clientWidth || 480;
    var rowH = opts.rowHeight || 56;
    var gap = opts.gap || 6;
    var color = opts.color || '#818cf8';
    var height = data.length * (rowH + gap);

    el.innerHTML = '';
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', height);
    el.appendChild(svg);

    var max = Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
    var maxBarW = width * 0.65;

    data.forEach(function (d, i) {
      var y = i * (rowH + gap);
      var w = (d.value / max) * maxBarW;
      var x = (width - maxBarW) / 2 + (maxBarW - w) / 2;

      var rect = document.createElementNS(SVGNS, 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', w);
      rect.setAttribute('height', rowH);
      rect.setAttribute('rx', 6);
      var op = 1 - i * 0.12;
      rect.setAttribute('fill', color);
      rect.setAttribute('opacity', Math.max(0.4, op));
      svg.appendChild(rect);

      // Label inside
      var t = document.createElementNS(SVGNS, 'text');
      t.setAttribute('x', x + w / 2);
      t.setAttribute('y', y + rowH / 2 - 6);
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('dominant-baseline', 'middle');
      t.setAttribute('font-size', 13);
      t.setAttribute('font-weight', '700');
      t.setAttribute('fill', '#fff');
      t.setAttribute('font-family', '-apple-system, sans-serif');
      t.textContent = d.label;
      svg.appendChild(t);

      var t2 = document.createElementNS(SVGNS, 'text');
      t2.setAttribute('x', x + w / 2);
      t2.setAttribute('y', y + rowH / 2 + 12);
      t2.setAttribute('text-anchor', 'middle');
      t2.setAttribute('dominant-baseline', 'middle');
      t2.setAttribute('font-size', 11);
      t2.setAttribute('fill', 'rgba(255,255,255,0.85)');
      t2.setAttribute('font-family', '-apple-system, sans-serif');
      var pct = i === 0 ? 100 : Math.round(d.value / data[0].value * 100);
      var parts = [];
      if (opts.showAbs !== false) parts.push(d.value.toLocaleString());
      if (opts.showPercent !== false) parts.push(pct + '%');
      t2.textContent = parts.join(' · ');
      svg.appendChild(t2);

      // Drop-off arrow between rows
      if (i < data.length - 1) {
        var drop = data[i].value > 0 ? Math.round((1 - data[i + 1].value / data[i].value) * 100) : 0;
        var t3 = document.createElementNS(SVGNS, 'text');
        t3.setAttribute('x', (width + maxBarW) / 2 + 12);
        t3.setAttribute('y', y + rowH + gap / 2);
        t3.setAttribute('text-anchor', 'start');
        t3.setAttribute('dominant-baseline', 'middle');
        t3.setAttribute('font-size', 10);
        t3.setAttribute('fill', 'rgba(248,113,113,0.85)');
        t3.setAttribute('font-family', 'ui-monospace, monospace');
        t3.textContent = '−' + drop + '%';
        svg.appendChild(t3);
      }
    });

    return { el: el, svg: svg };
  }

  var ChartFunnel = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = ChartFunnel;
  else root.ChartFunnel = ChartFunnel;
})(typeof window !== 'undefined' ? window : this);
