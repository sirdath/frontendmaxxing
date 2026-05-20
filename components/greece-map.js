/* ============================================
   GREECE MAP — Interactive choropleth of Greek regions + prefectures
   Geometry source: Eurostat NUTS 2021 (GISCO), free reuse w/ attribution.
   ============================================
   Requires:
     <script src="components/greece-map-data.js"></script>
     <link  rel="stylesheet" href="components/greece-map.css">

   Usage:
     GreeceMap.init('#map', {
       mode: 'regions',          // 'regions' | 'prefectures'
       data: {EL30: 0.92, EL43: 0.4, ...},  // NUTS_ID → numeric value
       scale: 'coverage',        // 'coverage'|'heat'|'ocean'|'mono'|'traffic'
       valueLabel: '% covered',  // shown in tooltip + legend
       valueFormat: function(v){ return Math.round(v*100) + '%'; },
       title: 'Coverage by region',
       showToggle: true,
       showLegend: true,
       onClick: function(feat, evt){ … },
       onHover: function(feat, evt){ … }
     });

   Instance methods:
     map.setMode('prefectures')
     map.setData({EL30: 0.6, ...})
     map.setScale('heat')
     map.destroy()
   ============================================ */
(function (root) {
  'use strict';

  // ─── Color scales (start → mid → end) ─────────────
  var SCALES = {
    coverage: ['#2a2f3d', '#3a7d44', '#5fda7d'],   // grey → emerald
    heat:     ['#2a2f3d', '#f59e0b', '#ef4444'],   // grey → amber → red
    ocean:    ['#0c1a3a', '#1e60c6', '#7fc7ff'],   // pale → deep blue
    mono:     ['#2a2f3d', '#7a7f8d', '#dde1ec'],   // greys
    traffic:  ['#16a34a', '#facc15', '#dc2626']    // green → yellow → red
  };

  function hexToRgb(h) {
    h = h.replace('#', '');
    return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)];
  }
  function rgbToHex(r,g,b) {
    function p(n){ return Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0'); }
    return '#' + p(r) + p(g) + p(b);
  }
  function lerp(a,b,t){ return a + (b-a)*t; }
  function interpolateScale(scaleArr, t) {
    t = Math.max(0, Math.min(1, t));
    var i = t * (scaleArr.length - 1);
    var lo = Math.floor(i), hi = Math.ceil(i);
    var f  = i - lo;
    var c1 = hexToRgb(scaleArr[lo]);
    var c2 = hexToRgb(scaleArr[hi]);
    return rgbToHex(lerp(c1[0],c2[0],f), lerp(c1[1],c2[1],f), lerp(c1[2],c2[2],f));
  }

  // ─── Defaults ─────────────────────────────────────
  var defaults = {
    mode: 'regions',
    data: {},
    scale: 'coverage',
    valueLabel: 'value',
    valueFormat: function (v) {
      if (v == null) return '—';
      if (v <= 1 && v >= 0) return Math.round(v * 100) + '%';
      return String(v);
    },
    title: '',
    showToggle: true,
    showLegend: true,
    onClick: null,
    onHover: null,
    autoExtent: true,   // compute min/max from data; else uses [0,1]
    min: 0,
    max: 1
  };

  function assign(t /*, …*/) {
    for (var i = 1; i < arguments.length; i++) {
      var s = arguments[i]; if (!s) continue;
      for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) t[k] = s[k];
    }
    return t;
  }

  // ─── Core ─────────────────────────────────────────
  function create(host, opts) {
    var o = assign({}, defaults, opts || {});
    if (typeof host === 'string') host = document.querySelector(host);
    if (!host) throw new Error('GreeceMap: target not found');

    var regions     = root.GREECE_REGIONS     || [];
    var prefectures = root.GREECE_PREFECTURES || [];
    var viewBox     = root.GREECE_MAP_VIEWBOX || '0 0 1000 994';
    if (!regions.length) {
      host.innerHTML = '<div style="padding:1rem;color:#f55;">GreeceMap: data file missing — include greece-map-data.js first.</div>';
      return null;
    }

    host.classList.add('gmap');
    host.innerHTML = '';

    // Header
    var head = document.createElement('div');
    head.className = 'gmap-head';
    if (o.title) {
      var t = document.createElement('div'); t.className = 'gmap-title'; t.textContent = o.title;
      head.appendChild(t);
    } else {
      head.appendChild(document.createElement('div'));
    }
    var toggle = null;
    if (o.showToggle) {
      toggle = document.createElement('div'); toggle.className = 'gmap-toggle';
      var b1 = document.createElement('button'); b1.dataset.mode = 'regions';     b1.textContent = '13 regions';
      var b2 = document.createElement('button'); b2.dataset.mode = 'prefectures'; b2.textContent = '52 prefectures';
      toggle.appendChild(b1); toggle.appendChild(b2);
      head.appendChild(toggle);
    }
    host.appendChild(head);

    // SVG
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Map of Greece');
    host.appendChild(svg);

    // Tooltip
    var tip = document.createElement('div');
    tip.className = 'gmap-tip';
    host.appendChild(tip);

    // Legend
    var legend = null;
    if (o.showLegend) {
      legend = document.createElement('div'); legend.className = 'gmap-legend';
      legend.innerHTML =
        '<span class="gmap-legend-tick gmap-legend-lo">—</span>' +
        '<div class="gmap-legend-bar"></div>' +
        '<span class="gmap-legend-tick gmap-legend-hi">—</span>';
      host.appendChild(legend);
    }

    // ─── State ───
    var state = {
      mode: o.mode,
      data: o.data,
      scale: o.scale,
      features: [],
      pathEls: {}  // NUTS_ID → SVGPathElement
    };

    function currentFeatures() {
      return state.mode === 'prefectures' ? prefectures : regions;
    }

    function extent() {
      if (!o.autoExtent) return [o.min, o.max];
      var lo = Infinity, hi = -Infinity;
      var k, v;
      for (k in state.data) {
        v = +state.data[k];
        if (!isFinite(v)) continue;
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
      if (!isFinite(lo)) return [0, 1];
      if (lo === hi) hi = lo + 1;
      return [lo, hi];
    }

    function colorFor(value, lo, hi) {
      if (value == null || !isFinite(value)) return null;
      var scaleArr = SCALES[state.scale] || SCALES.coverage;
      var t = (value - lo) / (hi - lo);
      return interpolateScale(scaleArr, t);
    }

    function paintLegend(lo, hi) {
      if (!legend) return;
      var scaleArr = SCALES[state.scale] || SCALES.coverage;
      legend.style.setProperty('--gm-fill-empty',
        getComputedStyle(host).getPropertyValue('--gm-fill-empty').trim() || '#2a2f3d');
      legend.style.setProperty('--gm-c1', scaleArr[Math.floor(scaleArr.length/2)]);
      legend.style.setProperty('--gm-c2', scaleArr[scaleArr.length - 1]);
      legend.querySelector('.gmap-legend-lo').textContent = o.valueFormat(lo);
      legend.querySelector('.gmap-legend-hi').textContent = o.valueFormat(hi);
    }

    function render() {
      svg.innerHTML = '';
      state.features = currentFeatures();
      state.pathEls = {};

      var ext = extent();
      var lo = ext[0], hi = ext[1];

      state.features.forEach(function (f) {
        var p = document.createElementNS(svgNS, 'path');
        p.setAttribute('d', f.d);
        p.dataset.id = f.id;
        var v = state.data[f.id];
        var color = colorFor(v, lo, hi);
        if (color) p.setAttribute('fill', color);

        p.addEventListener('mouseenter', function (e) { showTip(f, v, e); });
        p.addEventListener('mousemove',  function (e) { moveTip(e); });
        p.addEventListener('mouseleave', function ()  { hideTip(); });
        p.addEventListener('click', function (e) {
          svg.querySelectorAll('.gmap-active').forEach(function (n) { n.classList.remove('gmap-active'); });
          p.classList.add('gmap-active');
          if (typeof o.onClick === 'function') o.onClick(f, e);
        });

        svg.appendChild(p);
        state.pathEls[f.id] = p;
      });

      paintLegend(lo, hi);
      if (toggle) {
        toggle.querySelectorAll('button').forEach(function (b) {
          b.classList.toggle('is-on', b.dataset.mode === state.mode);
        });
      }
    }

    // Tooltip ──
    function showTip(f, v, e) {
      var html = '<span class="gmap-tip-name">' + escapeHtml(f.el) +
                 '<span class="gmap-tip-name-en">' + escapeHtml(f.en) + '</span></span>';
      if (v == null || !isFinite(v)) {
        html += '<span class="gmap-tip-empty">no data</span>';
      } else {
        html += '<span class="gmap-tip-val">' + escapeHtml(o.valueFormat(v)) + ' · ' + escapeHtml(o.valueLabel) + '</span>';
      }
      tip.innerHTML = html;
      tip.classList.add('is-on');
      moveTip(e);
      if (typeof o.onHover === 'function') o.onHover(f, e);
    }
    function moveTip(e) {
      var rect = host.getBoundingClientRect();
      tip.style.left = (e.clientX - rect.left) + 'px';
      tip.style.top  = (e.clientY - rect.top) + 'px';
    }
    function hideTip() { tip.classList.remove('is-on'); }

    function escapeHtml(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // Toggle wiring ──
    if (toggle) {
      toggle.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-mode]');
        if (!b) return;
        state.mode = b.dataset.mode;
        render();
      });
    }

    render();

    // Public API
    var instance = {
      el: host,
      setMode: function (mode) { state.mode = mode; render(); return instance; },
      setData: function (data) { state.data = data || {}; render(); return instance; },
      setScale: function (scale) { state.scale = scale; render(); return instance; },
      get: function () { return { mode: state.mode, scale: state.scale, features: state.features.slice() }; },
      destroy: function () { host.innerHTML = ''; host.classList.remove('gmap'); }
    };
    return instance;
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return create(nodes[0], opts);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n, opts)); });
      return arr;
    }
    return create(target, opts);
  }

  var GreeceMap = { init: init, create: create, SCALES: SCALES };

  if (typeof module !== 'undefined' && module.exports) module.exports = GreeceMap;
  else root.GreeceMap = GreeceMap;
})(typeof window !== 'undefined' ? window : this);
