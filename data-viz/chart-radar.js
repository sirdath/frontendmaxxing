/* ============================================
   CHART RADAR — Polygon radar / spider chart
   Inspired by Recharts / D3 radar examples
   ============================================
   Usage:
     ChartRadar.create('#container', {
       axes: ['Speed','Power','Range','Agility','Cost'],
       series: [
         { name: 'Model A', values: [80, 60, 90, 70, 50], color: '#818cf8' },
         { name: 'Model B', values: [60, 90, 50, 80, 70], color: '#22d3ee' }
       ],
       max: 100,
       size: 320,
       rings: 4
     });
   ============================================ */
(function (root) {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';

  function create(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    opts = opts || {};
    var axes = opts.axes || [];
    var series = opts.series || [];
    var max = opts.max || 100;
    var size = opts.size || 320;
    var rings = opts.rings || 4;
    var pad = 40;
    var cx = size / 2, cy = size / 2;
    var r = size / 2 - pad;

    el.innerHTML = '';
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    el.appendChild(svg);

    var n = axes.length;
    function angleFor(i) { return -Math.PI / 2 + (i / n) * Math.PI * 2; }
    function pointAt(i, t) {
      var a = angleFor(i);
      return [cx + Math.cos(a) * r * t, cy + Math.sin(a) * r * t];
    }

    // Grid rings (as polygons)
    for (var k = 1; k <= rings; k++) {
      var t = k / rings;
      var pts = [];
      for (var i = 0; i < n; i++) {
        var p = pointAt(i, t);
        pts.push(p[0] + ',' + p[1]);
      }
      var poly = document.createElementNS(SVGNS, 'polygon');
      poly.setAttribute('points', pts.join(' '));
      poly.setAttribute('fill', 'none');
      poly.setAttribute('stroke', 'rgba(255,255,255,0.08)');
      svg.appendChild(poly);
    }

    // Spokes + labels
    for (var i2 = 0; i2 < n; i2++) {
      var end = pointAt(i2, 1);
      var l = document.createElementNS(SVGNS, 'line');
      l.setAttribute('x1', cx); l.setAttribute('y1', cy);
      l.setAttribute('x2', end[0]); l.setAttribute('y2', end[1]);
      l.setAttribute('stroke', 'rgba(255,255,255,0.06)');
      svg.appendChild(l);

      var labelP = pointAt(i2, 1.12);
      var t2 = document.createElementNS(SVGNS, 'text');
      t2.setAttribute('x', labelP[0]); t2.setAttribute('y', labelP[1]);
      t2.setAttribute('text-anchor', labelP[0] < cx - 1 ? 'end' : (labelP[0] > cx + 1 ? 'start' : 'middle'));
      t2.setAttribute('dominant-baseline', 'middle');
      t2.setAttribute('font-size', 11);
      t2.setAttribute('fill', 'rgba(255,255,255,0.65)');
      t2.setAttribute('font-family', '-apple-system, sans-serif');
      t2.textContent = axes[i2];
      svg.appendChild(t2);
    }

    // Series
    series.forEach(function (s, si) {
      var color = s.color || ['#818cf8','#22d3ee','#f472b6','#fbbf24'][si % 4];
      var pts = [];
      for (var i = 0; i < n; i++) {
        var t = (s.values[i] || 0) / max;
        var p = pointAt(i, t);
        pts.push(p[0] + ',' + p[1]);
      }
      var poly = document.createElementNS(SVGNS, 'polygon');
      poly.setAttribute('points', pts.join(' '));
      poly.setAttribute('fill', color + '33');
      poly.setAttribute('stroke', color);
      poly.setAttribute('stroke-width', '2');
      poly.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(poly);
    });

    // Legend (top right)
    if (opts.showLegend !== false && series.length) {
      var lg = document.createElement('div');
      lg.style.cssText = 'display:flex; gap:0.85rem; flex-wrap:wrap; margin-top:0.75rem; color:#fff; font-size:0.8rem;';
      series.forEach(function (s, si) {
        var c = s.color || ['#818cf8','#22d3ee','#f472b6','#fbbf24'][si % 4];
        var row = document.createElement('div');
        row.style.cssText = 'display:flex; align-items:center; gap:0.4rem;';
        row.innerHTML = '<span style="width:10px;height:10px;border-radius:3px;background:' + c + ';"></span>' + s.name;
        lg.appendChild(row);
      });
      el.appendChild(lg);
    }

    return { el: el, svg: svg };
  }

  var ChartRadar = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = ChartRadar;
  else root.ChartRadar = ChartRadar;
})(typeof window !== 'undefined' ? window : this);
