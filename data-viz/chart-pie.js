/* ============================================
   CHART PIE — Pie / donut chart with labels
   Inspired by Recharts / Tremor donut
   ============================================
   Usage:
     ChartPie.create('#container', {
       data: [
         { label: 'Direct',  value: 40, color: '#818cf8' },
         { label: 'Search',  value: 25, color: '#22d3ee' },
         { label: 'Social',  value: 20, color: '#f472b6' },
         { label: 'Other',   value: 15, color: '#fbbf24' }
       ],
       width: 280,
       donut: true,            // hollow center
       donutThickness: 26,
       showLegend: true,
       showLabels: false,      // labels on slices
       centerLabel: '100',     // text in donut center
       centerMeta:  'visits'
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
    var width = opts.width || 240;
    var height = opts.height || width;
    var donut = !!opts.donut;
    var thickness = opts.donutThickness || 26;
    var palette = ['#818cf8', '#22d3ee', '#f472b6', '#fbbf24', '#4ade80', '#fb7185', '#a78bfa'];

    var total = data.reduce(function (s, d) { return s + d.value; }, 0) || 1;

    el.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '1.25rem';
    wrap.style.alignItems = 'center';
    el.appendChild(wrap);

    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    wrap.appendChild(svg);

    var cx = width / 2, cy = height / 2;
    var r  = Math.min(cx, cy) - 6;
    var rInner = donut ? r - thickness : 0;

    var startAngle = -Math.PI / 2; // 12 o'clock
    data.forEach(function (d, i) {
      var color = d.color || palette[i % palette.length];
      var sweep = (d.value / total) * Math.PI * 2;
      var endAngle = startAngle + sweep;
      var pathD = arcPath(cx, cy, r, rInner, startAngle, endAngle);
      var p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('d', pathD);
      p.setAttribute('fill', color);
      svg.appendChild(p);
      if (opts.showLabels && d.value / total > 0.04) {
        var midAngle = startAngle + sweep / 2;
        var lx = cx + Math.cos(midAngle) * (r * 0.65);
        var ly = cy + Math.sin(midAngle) * (r * 0.65);
        var t = document.createElementNS(SVGNS, 'text');
        t.setAttribute('x', lx); t.setAttribute('y', ly);
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('dominant-baseline', 'middle');
        t.setAttribute('font-size', 11);
        t.setAttribute('font-weight', 600);
        t.setAttribute('fill', '#fff');
        t.textContent = Math.round((d.value / total) * 100) + '%';
        svg.appendChild(t);
      }
      startAngle = endAngle;
    });

    if (donut && (opts.centerLabel || opts.centerMeta)) {
      if (opts.centerLabel) {
        var cl = document.createElementNS(SVGNS, 'text');
        cl.setAttribute('x', cx); cl.setAttribute('y', cy - (opts.centerMeta ? 6 : 0));
        cl.setAttribute('text-anchor', 'middle');
        cl.setAttribute('dominant-baseline', 'middle');
        cl.setAttribute('font-size', 22);
        cl.setAttribute('font-weight', 700);
        cl.setAttribute('fill', '#fff');
        cl.textContent = opts.centerLabel;
        svg.appendChild(cl);
      }
      if (opts.centerMeta) {
        var cm = document.createElementNS(SVGNS, 'text');
        cm.setAttribute('x', cx); cm.setAttribute('y', cy + (opts.centerLabel ? 14 : 0));
        cm.setAttribute('text-anchor', 'middle');
        cm.setAttribute('dominant-baseline', 'middle');
        cm.setAttribute('font-size', 11);
        cm.setAttribute('fill', 'rgba(255,255,255,0.6)');
        cm.textContent = opts.centerMeta;
        svg.appendChild(cm);
      }
    }

    // Legend
    if (opts.showLegend !== false) {
      var legend = document.createElement('div');
      legend.style.cssText = 'display:flex; flex-direction:column; gap:0.4rem; font-size:0.85rem; color:#fff;';
      data.forEach(function (d, i) {
        var color = d.color || palette[i % palette.length];
        var row = document.createElement('div');
        row.style.cssText = 'display:flex; align-items:center; gap:0.55rem;';
        row.innerHTML =
          '<span style="width:10px; height:10px; border-radius:3px; background:' + color + ';"></span>' +
          '<span style="flex:1;">' + escape(d.label) + '</span>' +
          '<span style="color:rgba(255,255,255,0.6); font-variant-numeric:tabular-nums;">' + Math.round((d.value / total) * 100) + '%</span>';
        legend.appendChild(row);
      });
      wrap.appendChild(legend);
    }

    function arcPath(cx, cy, rOuter, rInner, a0, a1) {
      var large = (a1 - a0) > Math.PI ? 1 : 0;
      var x0 = cx + Math.cos(a0) * rOuter, y0 = cy + Math.sin(a0) * rOuter;
      var x1 = cx + Math.cos(a1) * rOuter, y1 = cy + Math.sin(a1) * rOuter;
      if (rInner > 0) {
        var ix1 = cx + Math.cos(a1) * rInner, iy1 = cy + Math.sin(a1) * rInner;
        var ix0 = cx + Math.cos(a0) * rInner, iy0 = cy + Math.sin(a0) * rInner;
        return 'M' + x0 + ',' + y0 +
               ' A' + rOuter + ',' + rOuter + ' 0 ' + large + ' 1 ' + x1 + ',' + y1 +
               ' L' + ix1 + ',' + iy1 +
               ' A' + rInner + ',' + rInner + ' 0 ' + large + ' 0 ' + ix0 + ',' + iy0 +
               ' Z';
      }
      return 'M' + cx + ',' + cy + ' L' + x0 + ',' + y0 +
             ' A' + rOuter + ',' + rOuter + ' 0 ' + large + ' 1 ' + x1 + ',' + y1 + ' Z';
    }
    function escape(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    return { el: el, svg: svg };
  }

  var ChartPie = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = ChartPie;
  else root.ChartPie = ChartPie;
})(typeof window !== 'undefined' ? window : this);
