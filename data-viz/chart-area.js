/* ============================================
   CHART AREA — Filled area / stacked-area chart
   Inspired by Recharts / Tremor
   ============================================
   Usage:
     ChartArea.create('#container', {
       data: [{ label: 'Mon', value: 12 }, { label: 'Tue', value: 18 }, …],
       color: '#818cf8'
     });

     // Stacked:
     ChartArea.create('#container', {
       data: [{ label: 'Mon', values: [4, 6, 3] }, …],
       colors: ['#818cf8', '#22d3ee', '#f472b6'],
       stacked: true
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
    var colors = opts.colors || [color, '#22d3ee', '#f472b6', '#fbbf24'];
    var pad = { top: 16, right: 16, bottom: 28, left: 36 };
    var multi   = data[0] && data[0].values;
    var stacked = !!opts.stacked;
    var smooth  = opts.smooth !== false;

    el.innerHTML = '';
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', height);
    el.appendChild(svg);

    var plotW = width - pad.left - pad.right;
    var plotH = height - pad.top - pad.bottom;

    // Compute max
    var maxVal = 0;
    if (multi && stacked) {
      data.forEach(function (d) { var s = d.values.reduce(function (a, b) { return a + b; }, 0); if (s > maxVal) maxVal = s; });
    } else {
      data.forEach(function (d) {
        if (multi) d.values.forEach(function (v) { if (v > maxVal) maxVal = v; });
        else if (d.value > maxVal) maxVal = d.value;
      });
    }
    maxVal = niceMax(maxVal);

    // Grid
    if (opts.showGrid !== false) {
      for (var i = 0; i <= 4; i++) {
        var y = pad.top + plotH * i / 4;
        line(pad.left, y, pad.left + plotW, y, 'rgba(255,255,255,0.06)');
        text(pad.left - 6, y + 3, format(maxVal * (1 - i / 4), opts), 'end', 10, 'rgba(255,255,255,0.5)');
      }
    }

    var seriesCount = multi ? data[0].values.length : 1;
    // Pre-compute stacked baselines if needed
    var stackBase = data.map(function () { return 0; });

    for (var s = 0; s < seriesCount; s++) {
      var pointsHi = [];
      var pointsLo = [];
      data.forEach(function (d, i) {
        var v = multi ? d.values[s] : d.value;
        var lo = stacked ? stackBase[i] : 0;
        var hi = stacked ? (stackBase[i] + v) : v;
        var x = pad.left + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
        var yHi = pad.top + plotH - (hi / maxVal) * plotH;
        var yLo = pad.top + plotH - (lo / maxVal) * plotH;
        pointsHi.push([x, yHi]);
        pointsLo.push([x, yLo]);
        if (stacked) stackBase[i] = hi;
      });
      var c = colors[s % colors.length];
      var dTop = pathFrom(pointsHi, smooth);
      var dBot = pathFrom(pointsLo.slice().reverse(), smooth);
      // Stitch the area
      var dStr = dTop + ' L' + pointsHi[pointsHi.length - 1][0] + ',' + pointsLo[pointsLo.length - 1][1] +
                 ' ' + pointsLo.slice().reverse().map(function (p) { return p[0] + ',' + p[1]; }).join(' L') +
                 ' Z';
      path(dStr, c + '33', 'none');
      path(dTop, 'none', c, 2);
    }

    // X labels
    if (opts.showAxis !== false) {
      data.forEach(function (d, i) {
        var x = pad.left + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
        text(x, height - pad.bottom + 16, d.label, 'middle', 10, 'rgba(255,255,255,0.55)');
      });
    }

    function pathFrom(points, smooth) {
      if (!points.length) return '';
      if (smooth && points.length > 2) {
        var d = 'M' + points[0][0] + ',' + points[0][1];
        for (var p = 1; p < points.length; p++) {
          var p0 = points[p - 1], p1 = points[p];
          var cx = (p0[0] + p1[0]) / 2;
          d += ' Q' + p0[0] + ',' + p0[1] + ' ' + cx + ',' + ((p0[1] + p1[1]) / 2);
        }
        d += ' T' + points[points.length - 1][0] + ',' + points[points.length - 1][1];
        return d;
      }
      return 'M' + points.map(function (p) { return p[0] + ',' + p[1]; }).join(' L');
    }
    function line(x1, y1, x2, y2, color) {
      var l = document.createElementNS(SVGNS, 'line');
      l.setAttribute('x1', x1); l.setAttribute('y1', y1);
      l.setAttribute('x2', x2); l.setAttribute('y2', y2);
      l.setAttribute('stroke', color);
      svg.appendChild(l);
    }
    function path(d, fill, stroke, sw) {
      var p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('fill', fill || 'none');
      if (stroke && stroke !== 'none') {
        p.setAttribute('stroke', stroke);
        p.setAttribute('stroke-width', sw || 1);
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('stroke-linejoin', 'round');
      }
      svg.appendChild(p);
    }
    function text(x, y, content, anchor, size, color) {
      var t = document.createElementNS(SVGNS, 'text');
      t.setAttribute('x', x); t.setAttribute('y', y);
      t.setAttribute('text-anchor', anchor);
      t.setAttribute('font-size', size);
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
    function format(v, o) { return o.formatValue ? o.formatValue(v) : Math.round(v); }

    return { el: el, svg: svg };
  }

  var ChartArea = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = ChartArea;
  else root.ChartArea = ChartArea;
})(typeof window !== 'undefined' ? window : this);
