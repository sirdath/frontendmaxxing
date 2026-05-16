/* ============================================
   CHART BAR — Minimal SVG bar chart (vertical, horizontal, grouped)
   Inspired by Recharts / Tremor / Visx
   ============================================
   Usage:
     ChartBar.create('#container', {
       data: [
         { label: 'Jan', value: 30 },
         { label: 'Feb', value: 45 },
         { label: 'Mar', value: 28 }
       ],
       color: '#818cf8',
       width: 480, height: 240,
       orientation: 'vertical',   // 'vertical' | 'horizontal'
       gap: 8,
       showAxis: true,
       showGrid: true,
       formatValue: function (v) { return '$' + v; }
     });

     // Grouped:
     ChartBar.create('#container', {
       data: [
         { label: 'Jan', values: [30, 12, 18] },
         { label: 'Feb', values: [45, 20, 22] }
       ],
       series: ['Sales', 'Refunds', 'Returns'],
       colors: ['#818cf8', '#22d3ee', '#f472b6']
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
    var width  = opts.width  || el.clientWidth || 480;
    var height = opts.height || 240;
    var color  = opts.color  || '#818cf8';
    var colors = opts.colors || [color, '#22d3ee', '#f472b6', '#fbbf24', '#4ade80'];
    var orientation = opts.orientation || 'vertical';
    var pad = { top: 20, right: 20, bottom: 28, left: 36 };
    var grouped = data[0] && data[0].values;

    // Compute max
    var maxVal = 0;
    data.forEach(function (d) {
      if (grouped) d.values.forEach(function (v) { if (v > maxVal) maxVal = v; });
      else if (d.value > maxVal) maxVal = d.value;
    });
    maxVal = niceMax(maxVal);

    el.innerHTML = '';
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', height);
    el.appendChild(svg);

    var plotW = width - pad.left - pad.right;
    var plotH = height - pad.top - pad.bottom;

    // Grid lines + y-axis
    if (opts.showGrid !== false) {
      var gridSteps = 4;
      for (var i = 0; i <= gridSteps; i++) {
        var y = pad.top + (plotH * i / gridSteps);
        line(pad.left, y, pad.left + plotW, y, 'rgba(255,255,255,0.06)');
        if (opts.showAxis !== false) {
          var labelVal = maxVal * (1 - i / gridSteps);
          text(pad.left - 6, y + 4, formatTick(labelVal, opts), 'end', 10, 'rgba(255,255,255,0.5)');
        }
      }
    }

    if (orientation === 'vertical') {
      var groupCount = grouped ? data[0].values.length : 1;
      var slotW = plotW / data.length;
      var barGap = opts.gap != null ? opts.gap : 4;
      var barW = (slotW - barGap * 2) / groupCount;

      data.forEach(function (d, i) {
        var slotX = pad.left + i * slotW + barGap;
        var values = grouped ? d.values : [d.value];
        values.forEach(function (v, k) {
          var h = (v / maxVal) * plotH;
          var x = slotX + k * barW;
          var y = pad.top + plotH - h;
          rect(x, y, barW - 2, h, colors[k % colors.length]);
        });
        text(slotX + slotW / 2 - barGap, height - pad.bottom + 16, d.label, 'middle', 11, 'rgba(255,255,255,0.65)');
      });
    } else {
      // horizontal
      var slotH = plotH / data.length;
      var barGapH = opts.gap != null ? opts.gap : 4;
      data.forEach(function (d, i) {
        var y = pad.top + i * slotH + barGapH;
        var w = (d.value / maxVal) * plotW;
        rect(pad.left, y, w, slotH - barGapH * 2, color);
        text(pad.left - 6, y + slotH / 2, d.label, 'end', 11, 'rgba(255,255,255,0.65)');
        text(pad.left + w + 6, y + slotH / 2, formatTick(d.value, opts), 'start', 11, 'rgba(255,255,255,0.7)');
      });
    }

    function line(x1, y1, x2, y2, color) {
      var l = document.createElementNS(SVGNS, 'line');
      l.setAttribute('x1', x1); l.setAttribute('y1', y1);
      l.setAttribute('x2', x2); l.setAttribute('y2', y2);
      l.setAttribute('stroke', color);
      svg.appendChild(l);
    }
    function rect(x, y, w, h, fill) {
      var r = document.createElementNS(SVGNS, 'rect');
      r.setAttribute('x', x); r.setAttribute('y', y);
      r.setAttribute('width', Math.max(0, w));
      r.setAttribute('height', Math.max(0, h));
      r.setAttribute('rx', 3);
      r.setAttribute('fill', fill);
      svg.appendChild(r);
    }
    function text(x, y, content, anchor, size, color) {
      var t = document.createElementNS(SVGNS, 'text');
      t.setAttribute('x', x); t.setAttribute('y', y);
      t.setAttribute('text-anchor', anchor || 'start');
      t.setAttribute('font-size', size || 11);
      t.setAttribute('fill', color);
      t.setAttribute('font-family', '-apple-system, sans-serif');
      t.setAttribute('dominant-baseline', 'middle');
      t.textContent = content;
      svg.appendChild(t);
    }
    function niceMax(v) {
      if (v <= 0) return 10;
      var pow = Math.pow(10, Math.floor(Math.log10(v)));
      return Math.ceil(v / pow) * pow;
    }
    function formatTick(v, opts) {
      if (typeof opts.formatValue === 'function') return opts.formatValue(v);
      return Math.round(v);
    }

    return { el: el, svg: svg };
  }

  var ChartBar = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = ChartBar;
  else root.ChartBar = ChartBar;
})(typeof window !== 'undefined' ? window : this);
