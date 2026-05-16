/* ============================================
   CHART LINE — SVG line / area chart (single + multi-series)
   Inspired by Recharts / Tremor
   ============================================
   Usage:
     ChartLine.create('#container', {
       data: [
         { label: 'Mon', value: 12 },
         { label: 'Tue', value: 18 },
         …
       ],
       color: '#818cf8',
       fill: 'rgba(129, 140, 248, 0.2)',
       smooth: true,
       width: 480, height: 220,
       dots: true,
       showAxis: true,
       showGrid: true
     });

     // Multi-series:
     ChartLine.create('#container', {
       data: [
         { label: 'Mon', values: [12, 8] },
         { label: 'Tue', values: [18, 9] }
       ],
       series: ['A', 'B'],
       colors: ['#818cf8', '#22d3ee']
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
    var height = opts.height || 220;
    var color  = opts.color  || '#818cf8';
    var colors = opts.colors || [color, '#22d3ee', '#f472b6', '#fbbf24', '#4ade80'];
    var fill   = opts.fill   || 'rgba(129, 140, 248, 0.18)';
    var smooth = opts.smooth !== false;
    var dots   = opts.dots !== false;
    var pad = { top: 16, right: 16, bottom: 28, left: 36 };
    var multi = data[0] && data[0].values;

    var seriesCount = multi ? data[0].values.length : 1;
    var maxVal = 0;
    data.forEach(function (d) {
      if (multi) d.values.forEach(function (v) { if (v > maxVal) maxVal = v; });
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

    if (opts.showGrid !== false) {
      var gridSteps = 4;
      for (var i = 0; i <= gridSteps; i++) {
        var y = pad.top + (plotH * i / gridSteps);
        line(pad.left, y, pad.left + plotW, y, 'rgba(255,255,255,0.06)');
        if (opts.showAxis !== false) {
          var labelVal = maxVal * (1 - i / gridSteps);
          text(pad.left - 6, y + 3, format(labelVal, opts), 'end', 10, 'rgba(255,255,255,0.5)');
        }
      }
    }

    for (var s = 0; s < seriesCount; s++) {
      var points = data.map(function (d, i) {
        var v = multi ? d.values[s] : d.value;
        var x = pad.left + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
        var y = pad.top + plotH - (v / maxVal) * plotH;
        return [x, y, v];
      });

      var pathD = '';
      if (smooth && points.length > 2) {
        pathD = 'M' + points[0][0] + ',' + points[0][1];
        for (var p = 1; p < points.length; p++) {
          var p0 = points[p - 1];
          var p1 = points[p];
          var cx = (p0[0] + p1[0]) / 2;
          pathD += ' Q' + p0[0] + ',' + p0[1] + ' ' + cx + ',' + ((p0[1] + p1[1]) / 2);
        }
        pathD += ' T' + points[points.length - 1][0] + ',' + points[points.length - 1][1];
      } else {
        pathD = 'M' + points.map(function (p) { return p[0] + ',' + p[1]; }).join(' L');
      }

      if (s === 0 && opts.fill !== false) {
        var areaD = pathD +
          ' L' + points[points.length - 1][0] + ',' + (pad.top + plotH) +
          ' L' + points[0][0] + ',' + (pad.top + plotH) + ' Z';
        path(areaD, 'none', fill);
      }
      path(pathD, colors[s % colors.length], 'none', 2);

      if (dots) {
        points.forEach(function (pt) {
          circle(pt[0], pt[1], 3.5, colors[s % colors.length]);
        });
      }
    }

    // X-axis labels
    if (opts.showAxis !== false) {
      data.forEach(function (d, i) {
        var x = pad.left + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW);
        text(x, height - pad.bottom + 16, d.label, 'middle', 10, 'rgba(255,255,255,0.55)');
      });
    }

    function line(x1, y1, x2, y2, color) {
      var l = document.createElementNS(SVGNS, 'line');
      l.setAttribute('x1', x1); l.setAttribute('y1', y1);
      l.setAttribute('x2', x2); l.setAttribute('y2', y2);
      l.setAttribute('stroke', color);
      svg.appendChild(l);
    }
    function path(d, stroke, fill, sw) {
      var p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('fill', fill || 'none');
      if (stroke && stroke !== 'none') {
        p.setAttribute('stroke', stroke);
        p.setAttribute('stroke-width', sw || 2);
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('stroke-linejoin', 'round');
      }
      svg.appendChild(p);
    }
    function circle(cx, cy, r, fill) {
      var c = document.createElementNS(SVGNS, 'circle');
      c.setAttribute('cx', cx); c.setAttribute('cy', cy);
      c.setAttribute('r', r); c.setAttribute('fill', fill);
      svg.appendChild(c);
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
    function format(v, opts) {
      if (typeof opts.formatValue === 'function') return opts.formatValue(v);
      return Math.round(v);
    }

    return { el: el, svg: svg };
  }

  var ChartLine = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = ChartLine;
  else root.ChartLine = ChartLine;
})(typeof window !== 'undefined' ? window : this);
