/* ============================================
   CHART GAUGE — Speedometer / progress gauge
   Inspired by speedometer / Tremor gauge / Apple Watch rings
   ============================================
   Usage:
     ChartGauge.create('#container', {
       value: 72,
       max: 100,
       size: 200,
       label: '72%',
       color: '#22c55e',
       thickness: 16,
       arc: 270,              // total arc in degrees
       startAngle: -135       // -135 for 270° arc starting bottom-left
     });
   ============================================ */
(function (root) {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';

  function create(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    opts = opts || {};
    var size = opts.size || 200;
    var thickness = opts.thickness || 16;
    var color = opts.color || '#22c55e';
    var trackColor = opts.trackColor || 'rgba(255,255,255,0.08)';
    var arc = opts.arc || 270;
    var startAngle = (opts.startAngle != null ? opts.startAngle : -arc / 2 - 90) * Math.PI / 180;
    var max = opts.max || 100;
    var value = Math.max(0, Math.min(max, opts.value || 0));
    var label = opts.label != null ? opts.label : Math.round(value);

    el.innerHTML = '';
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    el.appendChild(svg);

    var cx = size / 2, cy = size / 2;
    var r = size / 2 - thickness / 2 - 4;
    var arcRad = arc * Math.PI / 180;

    // Track
    appendArc(trackColor, 0, arcRad, 'butt');

    // Value
    var t = value / max;
    appendArc(color, 0, arcRad * t, 'round');

    // Label text
    var t1 = document.createElementNS(SVGNS, 'text');
    t1.setAttribute('x', cx); t1.setAttribute('y', cy);
    t1.setAttribute('text-anchor', 'middle');
    t1.setAttribute('dominant-baseline', 'middle');
    t1.setAttribute('font-size', size * 0.22);
    t1.setAttribute('font-weight', '700');
    t1.setAttribute('fill', '#fff');
    t1.setAttribute('font-family', '-apple-system, sans-serif');
    t1.textContent = label;
    svg.appendChild(t1);

    if (opts.subtitle) {
      var t2 = document.createElementNS(SVGNS, 'text');
      t2.setAttribute('x', cx); t2.setAttribute('y', cy + size * 0.14);
      t2.setAttribute('text-anchor', 'middle');
      t2.setAttribute('font-size', size * 0.07);
      t2.setAttribute('fill', 'rgba(255,255,255,0.6)');
      t2.setAttribute('font-family', '-apple-system, sans-serif');
      t2.textContent = opts.subtitle;
      svg.appendChild(t2);
    }

    function appendArc(strokeColor, a0, a1, cap) {
      if (a1 <= 0) return;
      var p = document.createElementNS(SVGNS, 'path');
      var x0 = cx + r * Math.cos(startAngle + a0);
      var y0 = cy + r * Math.sin(startAngle + a0);
      var x1 = cx + r * Math.cos(startAngle + a1);
      var y1 = cy + r * Math.sin(startAngle + a1);
      var large = (a1 - a0) > Math.PI ? 1 : 0;
      p.setAttribute('d', 'M' + x0 + ',' + y0 + ' A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x1 + ',' + y1);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', strokeColor);
      p.setAttribute('stroke-width', thickness);
      p.setAttribute('stroke-linecap', cap);
      svg.appendChild(p);
    }

    return { el: el, svg: svg };
  }

  var ChartGauge = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = ChartGauge;
  else root.ChartGauge = ChartGauge;
})(typeof window !== 'undefined' ? window : this);
