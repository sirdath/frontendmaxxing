/* ============================================
   SPARKLINE — Inline mini SVG line chart
   Inspired by jQuery sparkline / inline financial UIs
   ============================================
   Usage:
     <span data-sparkline="3,5,4,7,9,8,12,10,14"></span>
     Sparkline.init('[data-sparkline]');

     // Or pass programmatically:
     Sparkline.create('#chart', [1,3,2,5,4,7,6,9,8], {
       width: 200,
       height: 50,
       stroke: '#818cf8',
       fill: 'rgba(129, 140, 248, 0.18)',
       smooth: true,
       dotEnd: true,
       trendColor: true   // green if last > first, red otherwise
     });
   ============================================ */
(function (root) {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';

  var defaults = {
    width: 120,
    height: 32,
    stroke: '#818cf8',
    fill: null,
    strokeWidth: 1.5,
    smooth: true,
    dotEnd: false,
    pad: 2,
    trendColor: false,
    trendUp: '#22c55e',
    trendDown: '#ef4444'
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) {
      var data = (el.getAttribute('data-sparkline') || '').split(',').map(parseFloat).filter(function (n) { return !isNaN(n); });
      if (!data.length) return;
      instances.push(create(el, data, opts));
    });
    return instances.length === 1 ? instances[0] : instances;
  }

  function create(target, data, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el || !data || !data.length) return null;
    el.innerHTML = '';

    var w = parseInt(el.getAttribute('data-spark-w'), 10) || o.width;
    var h = parseInt(el.getAttribute('data-spark-h'), 10) || o.height;

    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.style.display = 'inline-block';
    svg.style.verticalAlign = 'middle';
    el.appendChild(svg);

    var min = Math.min.apply(null, data);
    var max = Math.max.apply(null, data);
    var range = (max - min) || 1;
    var pad = o.pad;

    var points = data.map(function (v, i) {
      var x = pad + (i / (data.length - 1 || 1)) * (w - pad * 2);
      var y = pad + (1 - (v - min) / range) * (h - pad * 2);
      return [x, y];
    });

    var path = '';
    if (o.smooth && points.length > 2) {
      path = 'M' + points[0][0] + ',' + points[0][1];
      for (var i = 1; i < points.length; i++) {
        var p0 = points[i - 1];
        var p1 = points[i];
        var cx = (p0[0] + p1[0]) / 2;
        path += ' Q' + p0[0] + ',' + p0[1] + ' ' + cx + ',' + ((p0[1] + p1[1]) / 2);
      }
      path += ' T' + points[points.length - 1][0] + ',' + points[points.length - 1][1];
    } else {
      path = 'M' + points.map(function (p) { return p[0] + ',' + p[1]; }).join(' L');
    }

    var stroke = o.stroke;
    if (o.trendColor) stroke = data[data.length - 1] >= data[0] ? o.trendUp : o.trendDown;

    if (o.fill) {
      var area = document.createElementNS(SVGNS, 'path');
      var afill = path + ' L' + points[points.length - 1][0] + ',' + (h - pad) + ' L' + points[0][0] + ',' + (h - pad) + ' Z';
      area.setAttribute('d', afill);
      area.setAttribute('fill', o.fill);
      svg.appendChild(area);
    }

    var line = document.createElementNS(SVGNS, 'path');
    line.setAttribute('d', path);
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', stroke);
    line.setAttribute('stroke-width', o.strokeWidth);
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(line);

    if (o.dotEnd) {
      var last = points[points.length - 1];
      var dot = document.createElementNS(SVGNS, 'circle');
      dot.setAttribute('cx', last[0]); dot.setAttribute('cy', last[1]);
      dot.setAttribute('r', o.strokeWidth * 1.6);
      dot.setAttribute('fill', stroke);
      svg.appendChild(dot);
    }

    return { el: el, svg: svg };
  }

  var Sparkline = { init: init, create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = Sparkline;
  else root.Sparkline = Sparkline;
})(typeof window !== 'undefined' ? window : this);
