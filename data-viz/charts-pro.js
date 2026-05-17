/* ============================================
   CHARTS PRO — Render data into pro chart packs
   ============================================
   Usage:
     ChartsPro.heatmap('[data-cp-heat]', { cols: 52, rows: 7, data: array(364) of 0..1 });
     ChartsPro.scatter('[data-cp-scat]', { points: [{x,y,group?}, ...] });
     ChartsPro.candlestick('[data-cp-cdl]', { bars: [{o,h,l,c}, ...] });
     ChartsPro.donut('[data-cp-donut]', { segments: [{value, color}], centerLabel: '$1.2k' });
     ChartsPro.gauge('[data-cp-arc]', { value: 65 });
     ChartsPro.sparkGrid('[data-cp-sgrid]', { cards: [{name, value, bars: [0..1...], dir}] });
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function heatmap(target, opts) {
    opts = opts || {};
    var cols = opts.cols || 52, rows = opts.rows || 7;
    var data = opts.data || Array.from({ length: cols * rows }, function () { return Math.random(); });
    each(target, function (host) {
      var grid = host.querySelector('.cp-heat-grid') || (function () {
        var g = document.createElement('div'); g.className = 'cp-heat-grid'; host.appendChild(g); return g;
      })();
      grid.innerHTML = '';
      grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
      grid.style.gridAutoFlow = 'row';
      for (var i = 0; i < cols * rows; i++) {
        var c = document.createElement('div');
        c.className = 'cp-heat-cell';
        c.style.setProperty('--v', Math.max(0, Math.min(1, data[i] || 0)).toFixed(2));
        grid.appendChild(c);
      }
    });
  }

  function scatter(target, opts) {
    opts = opts || {};
    var pts = opts.points || [];
    each(target, function (host) {
      var axes = host.querySelector('.cp-scat-axes') || (function () {
        var d = document.createElement('div'); d.className = 'cp-scat-axes'; host.appendChild(d); return d;
      })();
      axes.innerHTML = '';
      if (pts.length === 0) return;
      var xs = pts.map(function (p) { return p.x; });
      var ys = pts.map(function (p) { return p.y; });
      var xmin = Math.min.apply(null, xs), xmax = Math.max.apply(null, xs);
      var ymin = Math.min.apply(null, ys), ymax = Math.max.apply(null, ys);
      pts.forEach(function (p) {
        var d = document.createElement('div');
        d.className = 'cp-scat-pt' + (p.group ? ' is-' + p.group : '');
        d.style.left = ((p.x - xmin) / Math.max(0.001, xmax - xmin) * 100) + '%';
        d.style.bottom = ((p.y - ymin) / Math.max(0.001, ymax - ymin) * 100) + '%';
        axes.appendChild(d);
      });
    });
  }

  function candlestick(target, opts) {
    opts = opts || {};
    var bars = opts.bars || [];
    each(target, function (host) {
      host.innerHTML = '';
      if (!bars.length) return;
      var all = bars.flatMap(function (b) { return [b.h, b.l]; });
      var max = Math.max.apply(null, all);
      var min = Math.min.apply(null, all);
      var range = Math.max(0.0001, max - min);
      bars.forEach(function (b) {
        var div = document.createElement('div');
        div.className = 'cp-cdl-bar' + (b.c < b.o ? ' down' : '');
        function p(v) { return ((max - v) / range * 100).toFixed(1) + '%'; }
        div.style.setProperty('--hi', p(b.h));
        div.style.setProperty('--lo', p(b.l));
        div.style.setProperty('--o', p(b.o));
        div.style.setProperty('--c', p(b.c));
        div.innerHTML = '<div class="cp-cdl-wick"></div><div class="cp-cdl-body"></div>';
        host.appendChild(div);
      });
    });
  }

  function donut(target, opts) {
    opts = opts || {};
    var segs = opts.segments || [];
    each(target, function (host) {
      if (segs.length) {
        var sum = segs.reduce(function (a, b) { return a + b.value; }, 0);
        var stops = '';
        var pct = 0;
        segs.forEach(function (s) {
          var v = (s.value / sum) * 100;
          stops += s.color + ' 0 ' + (pct + v).toFixed(2) + '%, ';
          pct += v;
        });
        stops = stops.replace(/, $/, '');
        host.style.background = 'conic-gradient(' + stops + ')';
      }
      if (opts.centerLabel) {
        var lab = host.querySelector('.cp-donut-label') || (function () {
          var d = document.createElement('div'); d.className = 'cp-donut-label'; host.appendChild(d); return d;
        })();
        lab.innerHTML = '<b></b><small></small>';
        lab.querySelector('b').textContent = opts.centerLabel;
        if (opts.centerSub) lab.querySelector('small').textContent = opts.centerSub;
      }
    });
  }

  function gauge(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var v = Math.max(0, Math.min(100, opts.value || 0));
      host.style.setProperty('--pct', v);
      var label = host.querySelector('.cp-arc-val') || (function () {
        var s = document.createElement('div'); s.className = 'cp-arc-val'; host.appendChild(s); return s;
      })();
      label.textContent = v + (opts.suffix || '');
    });
  }

  function sparkGrid(target, opts) {
    opts = opts || {};
    var cards = opts.cards || [];
    each(target, function (host) {
      host.innerHTML = '';
      cards.forEach(function (c) {
        var card = document.createElement('div');
        card.className = 'cp-sgrid-card' + (c.dir ? ' is-' + c.dir : '');
        var bars = (c.bars || []).map(function (h) {
          return '<i style="--h:' + (h * 100).toFixed(0) + '%"></i>';
        }).join('');
        card.innerHTML =
          '<div class="cp-sgrid-name">' + (c.name || '') + '</div>' +
          '<div class="cp-sgrid-val">' + (c.value || '') + '</div>' +
          '<div class="cp-sgrid-bars">' + bars + '</div>';
        host.appendChild(card);
      });
    });
  }

  var ChartsPro = { heatmap: heatmap, scatter: scatter, candlestick: candlestick, donut: donut, gauge: gauge, sparkGrid: sparkGrid };
  if (typeof module !== 'undefined' && module.exports) module.exports = ChartsPro;
  else root.ChartsPro = ChartsPro;
})(typeof window !== 'undefined' ? window : this);
