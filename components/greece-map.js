/* ============================================
   GREECE MAP — Interactive choropleth of Greece, 4 layers + pin markers
   ============================================
   Layers (toggleable):
     regions        — 13  περιφέρειες (Eurostat NUTS2)
     prefectures    — 74  περιφερειακές ενότητες (Kallikratis, peterdsp MIT)
     municipalities — 326 δήμοι (geoBoundaries gbOpen ADM3, CC0)
     neighborhoods  — 20  Athens-central neighborhoods (Voronoi over OSM centroids)

   Pins: arbitrary lat/lng markers — survive layer switches, auto-scale.

   Requires:
     <script src="components/greece-map-data.js"></script>
     <link  rel="stylesheet" href="components/greece-map.css">

   Usage:
     var m = GreeceMap.init('#map', {
       mode: 'regions',                                // regions|prefectures|municipalities|neighborhoods
       data: {EL30: 0.92, EL43: 0.4, ...},             // ID → numeric value
       scale: 'coverage',                              // coverage|heat|ocean|mono|traffic
       valueLabel: '% covered',
       valueFormat: function(v){ return Math.round(v*100)+'%'; },
       title: 'Coverage by region',
       showToggle: true,
       showLegend: true,
       modes: ['regions','prefectures','municipalities','neighborhoods'],
       onClick: function(feat, evt){ … },
       onHover: function(feat, evt){ … }
     });

     m.pin({ lat: 37.97, lng: 23.72, label: 'HQ', color: '#ffd166', value: 0.8 });
     m.pin([{ lat:…, lng:…, label:…, color:… }, ...]);   // bulk
     m.clearPins();
     m.setMode('neighborhoods');                       // auto-zooms to Athens
     m.setData({EL30: 0.6, ...});
     m.setScale('heat');
     m.destroy();
   ============================================ */
(function (root) {
  'use strict';

  // ─── Color scales ─────────────────────────────────
  var SCALES = {
    coverage: ['#2a2f3d', '#3a7d44', '#5fda7d'],
    heat:     ['#2a2f3d', '#f59e0b', '#ef4444'],
    ocean:    ['#0c1a3a', '#1e60c6', '#7fc7ff'],
    mono:     ['#2a2f3d', '#7a7f8d', '#dde1ec'],
    traffic:  ['#16a34a', '#facc15', '#dc2626']
  };

  function hexToRgb(h){h=h.replace('#','');return[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
  function pad2(n){return Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');}
  function rgbToHex(r,g,b){return '#'+pad2(r)+pad2(g)+pad2(b);}
  function lerp(a,b,t){return a+(b-a)*t;}
  function interpolateScale(arr,t){
    t = Math.max(0,Math.min(1,t));
    var i = t*(arr.length-1), lo=Math.floor(i), hi=Math.ceil(i), f=i-lo;
    var c1 = hexToRgb(arr[lo]), c2 = hexToRgb(arr[hi]);
    return rgbToHex(lerp(c1[0],c2[0],f),lerp(c1[1],c2[1],f),lerp(c1[2],c2[2],f));
  }

  // ─── Defaults ─────────────────────────────────────
  var defaults = {
    mode: 'regions',
    data: {},
    scale: 'coverage',
    valueLabel: 'value',
    valueFormat: function (v) {
      if (v == null || !isFinite(v)) return '—';
      if (v <= 1 && v >= 0) return Math.round(v * 100) + '%';
      return String(v);
    },
    title: '',
    showToggle: true,
    showLegend: true,
    modes: null,           // null = auto from available data
    onClick: null,
    onHover: null,
    autoExtent: true,
    min: 0,
    max: 1
  };

  function assign(t){for(var i=1;i<arguments.length;i++){var s=arguments[i];if(!s)continue;for(var k in s)if(Object.prototype.hasOwnProperty.call(s,k))t[k]=s[k];}return t;}

  var MODE_META = {
    regions:        { label: '13 regions',        data: 'GREECE_REGIONS',        viewBox: 'GREECE_MAP_VIEWBOX' },
    prefectures:    { label: '74 prefectures',    data: 'GREECE_PREFECTURES',    viewBox: 'GREECE_MAP_VIEWBOX' },
    municipalities: { label: '326 municipalities',data: 'GREECE_MUNICIPALITIES', viewBox: 'GREECE_MAP_VIEWBOX' },
    neighborhoods:  { label: '20 Athens areas',   data: 'GREECE_NEIGHBORHOODS',  viewBox: 'GREECE_MAP_VIEWBOX_NEIGHBORHOODS' }
  };

  // ─── Core ─────────────────────────────────────────
  function create(host, opts) {
    var o = assign({}, defaults, opts || {});
    if (typeof host === 'string') host = document.querySelector(host);
    if (!host) throw new Error('GreeceMap: target not found');

    if (!root.GREECE_REGIONS) {
      host.innerHTML = '<div style="padding:1rem;color:#f55;">GreeceMap: data file missing — include greece-map-data.js first.</div>';
      return null;
    }

    var PROJ = root.GREECE_MAP_PROJECTION || {lngMin:19.30,latMax:41.80,cosLat:0.785,scale:127.32,viewW:1000,viewH:993.5};

    function projectLngLat(lng, lat) {
      return [
        (lng - PROJ.lngMin) * PROJ.cosLat * PROJ.scale,
        (PROJ.latMax - lat) * PROJ.scale
      ];
    }

    // Determine available modes (skip layers whose data is missing)
    var availableModes = (o.modes || ['regions','prefectures','municipalities','neighborhoods']).filter(function(m){
      var meta = MODE_META[m]; if (!meta) return false;
      var d = root[meta.data];
      return Array.isArray(d) && d.length > 0;
    });
    if (availableModes.indexOf(o.mode) === -1) o.mode = availableModes[0];

    host.classList.add('gmap');
    host.innerHTML = '';

    // ─── Header (title + mode toggle) ───
    var head = document.createElement('div');
    head.className = 'gmap-head';
    if (o.title) {
      var t = document.createElement('div'); t.className = 'gmap-title'; t.textContent = o.title;
      head.appendChild(t);
    } else {
      head.appendChild(document.createElement('div'));
    }
    var toggle = null;
    if (o.showToggle && availableModes.length > 1) {
      toggle = document.createElement('div'); toggle.className = 'gmap-toggle';
      availableModes.forEach(function (m) {
        var b = document.createElement('button');
        b.dataset.mode = m;
        b.textContent = MODE_META[m].label;
        toggle.appendChild(b);
      });
      head.appendChild(toggle);
    }
    host.appendChild(head);

    // ─── SVG ───
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Map of Greece');
    var gPaths = document.createElementNS(svgNS, 'g'); gPaths.setAttribute('class', 'gmap-paths');
    var gPins  = document.createElementNS(svgNS, 'g'); gPins.setAttribute('class', 'gmap-pins');
    svg.appendChild(gPaths);
    svg.appendChild(gPins);
    host.appendChild(svg);

    // ─── Tooltip ───
    var tip = document.createElement('div');
    tip.className = 'gmap-tip';
    host.appendChild(tip);

    // ─── Legend ───
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
      pins: [],            // [{lng, lat, label, color, value, _x, _y}]
      pathEls: {}
    };

    function currentFeatures() { return root[MODE_META[state.mode].data] || []; }
    function currentViewBox()  { return root[MODE_META[state.mode].viewBox] || root.GREECE_MAP_VIEWBOX; }
    function currentViewBoxSize() {
      var vb = currentViewBox().split(/\s+/).map(parseFloat);
      return { x: vb[0], y: vb[1], w: vb[2], h: vb[3] };
    }

    function extent() {
      if (!o.autoExtent) return [o.min, o.max];
      var lo = Infinity, hi = -Infinity;
      for (var k in state.data) {
        var v = +state.data[k];
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
      var arr = SCALES[state.scale] || SCALES.coverage;
      return interpolateScale(arr, (value - lo) / (hi - lo));
    }

    function paintLegend(lo, hi) {
      if (!legend) return;
      var arr = SCALES[state.scale] || SCALES.coverage;
      legend.style.setProperty('--gm-c1', arr[Math.floor(arr.length/2)]);
      legend.style.setProperty('--gm-c2', arr[arr.length - 1]);
      legend.querySelector('.gmap-legend-lo').textContent = o.valueFormat(lo);
      legend.querySelector('.gmap-legend-hi').textContent = o.valueFormat(hi);
    }

    function renderPaths() {
      svg.setAttribute('viewBox', currentViewBox());
      gPaths.innerHTML = '';
      state.pathEls = {};
      var ext = extent(), lo = ext[0], hi = ext[1];
      currentFeatures().forEach(function (f) {
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
          gPaths.querySelectorAll('.gmap-active').forEach(function (n) { n.classList.remove('gmap-active'); });
          p.classList.add('gmap-active');
          if (typeof o.onClick === 'function') o.onClick(f, e);
        });

        gPaths.appendChild(p);
        state.pathEls[f.id] = p;
      });
      paintLegend(lo, hi);
      if (toggle) {
        toggle.querySelectorAll('button').forEach(function (b) {
          b.classList.toggle('is-on', b.dataset.mode === state.mode);
        });
      }
    }

    function renderPins() {
      gPins.innerHTML = '';
      if (!state.pins.length) return;
      // Pin radius proportional to current viewBox width so it stays visually constant
      var vbW = currentViewBoxSize().w;
      var r = vbW / 100;          // ~10px at vbW=1000, ~0.18 units at vbW=18
      var strokeW = r * 0.18;
      var fontSize = r * 1.4;

      state.pins.forEach(function (p) {
        var pt = projectLngLat(p.lng, p.lat);
        var x = pt[0], y = pt[1];
        var box = currentViewBoxSize();
        // Skip pins outside the current viewBox (e.g. an Iraklio pin in neighborhoods mode)
        if (x < box.x - r || x > box.x + box.w + r) return;
        if (y < box.y - r || y > box.y + box.h + r) return;

        var g = document.createElementNS(svgNS, 'g');
        g.setAttribute('class', 'gmap-pin');
        g.setAttribute('transform', 'translate(' + x + ',' + y + ')');

        // Pulse halo
        var halo = document.createElementNS(svgNS, 'circle');
        halo.setAttribute('class', 'gmap-pin-halo');
        halo.setAttribute('r', r * 1.7);
        halo.setAttribute('fill', p.color || '#ffd166');
        g.appendChild(halo);

        // Dot
        var dot = document.createElementNS(svgNS, 'circle');
        dot.setAttribute('class', 'gmap-pin-dot');
        dot.setAttribute('r', r);
        dot.setAttribute('fill', p.color || '#ffd166');
        dot.setAttribute('stroke', '#fff');
        dot.setAttribute('stroke-width', strokeW);
        g.appendChild(dot);

        // Label
        if (p.label) {
          var txt = document.createElementNS(svgNS, 'text');
          txt.setAttribute('class', 'gmap-pin-label');
          txt.setAttribute('x', 0);
          txt.setAttribute('y', -r * 2.2);
          txt.setAttribute('text-anchor', 'middle');
          txt.setAttribute('font-size', fontSize);
          txt.textContent = p.label;
          g.appendChild(txt);
        }

        // Hover → tooltip for the pin
        g.addEventListener('mouseenter', function (e) { showPinTip(p, e); });
        g.addEventListener('mousemove',  function (e) { moveTip(e); });
        g.addEventListener('mouseleave', function ()  { hideTip(); });

        gPins.appendChild(g);
      });
    }

    function render() { renderPaths(); renderPins(); }

    // ─── Tooltip ──
    function showTip(f, v, e) {
      var html = '<span class="gmap-tip-name">' + escapeHtml(f.el || f.en) +
                 (f.en && f.en !== f.el ? '<span class="gmap-tip-name-en">' + escapeHtml(f.en) + '</span>' : '') +
                 '</span>';
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
    function showPinTip(p, e) {
      var html = '<span class="gmap-tip-name">' + escapeHtml(p.label || 'Pin') + '</span>';
      if (p.value != null) {
        html += '<span class="gmap-tip-val">' + escapeHtml(o.valueFormat(p.value)) + ' · ' + escapeHtml(o.valueLabel) + '</span>';
      } else {
        html += '<span class="gmap-tip-empty">' + p.lat.toFixed(3) + ', ' + p.lng.toFixed(3) + '</span>';
      }
      tip.innerHTML = html;
      tip.classList.add('is-on');
      moveTip(e);
    }
    function moveTip(e) {
      var rect = host.getBoundingClientRect();
      tip.style.left = (e.clientX - rect.left) + 'px';
      tip.style.top  = (e.clientY - rect.top) + 'px';
    }
    function hideTip() { tip.classList.remove('is-on'); }

    function escapeHtml(s) {
      return String(s == null ? '' : s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    // ─── Toggle wiring ──
    if (toggle) {
      toggle.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-mode]');
        if (!b) return;
        state.mode = b.dataset.mode;
        render();
      });
    }

    render();

    // ─── Public API ──
    var instance = {
      el: host,
      setMode:  function (m) { if (availableModes.indexOf(m) === -1) return instance; state.mode = m; render(); return instance; },
      setData:  function (d) { state.data = d || {}; render(); return instance; },
      setScale: function (s) { state.scale = s; render(); return instance; },
      pin: function (p) {
        if (Array.isArray(p)) p.forEach(function (x) { state.pins.push(x); });
        else state.pins.push(p);
        renderPins();
        return instance;
      },
      clearPins: function () { state.pins = []; renderPins(); return instance; },
      get: function () { return { mode: state.mode, scale: state.scale, pins: state.pins.slice() }; },
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
