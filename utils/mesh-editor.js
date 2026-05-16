/* ============================================
   MESH EDITOR — Interactive mesh gradient builder
   Inspired by mesh.tailwindcss.com, hypercolor.dev, Sketch mesh gradients
   ============================================
   Usage:
     MeshEditor.init(targetEl, {
       width: 600, height: 400,
       stops: 4,
       palette: 'aurora',
       onChange: function (cssBackground) { previewEl.style.background = cssBackground; }
     });

     instance.exportCss();   // returns the current CSS background-image string
     instance.randomize();
     instance.addStop();
     instance.destroy();
   ============================================ */
(function (root) {
  'use strict';

  var palettes = {
    aurora:    ['#a855f7', '#ec4899', '#06b6d4', '#f59e0b'],
    sunset:    ['#f97316', '#ec4899', '#f59e0b', '#ef4444'],
    cosmic:    ['#6d28d9', '#db2777', '#0891b2', '#d97706'],
    cyber:     ['#00ffff', '#ff00ff', '#00ff7f', '#ffff00'],
    ocean:     ['#0ea5e9', '#06b6d4', '#3b82f6', '#14b8a6'],
    fire:      ['#fbbf24', '#f97316', '#ef4444', '#dc2626'],
    pastel:    ['#c4b5fd', '#fbcfe8', '#a5f3fc', '#fde68a'],
    stripe:    ['#9d4edd', '#22d3ee', '#ec4899', '#3b82f6'],
    vercel:    ['#ec4899', '#8b5cf6', '#22d3ee', '#3b82f6'],
    rose:      ['#fb7185', '#f43f5e', '#ec4899', '#c084fc']
  };

  var defaults = {
    width: 600,
    height: 400,
    stops: 4,
    palette: 'aurora',
    onChange: null,
    background: '#0a0a14',
    intensity: 0.55,
    showHandles: true,
    snapshotMode: 'mesh'   // 'mesh' or 'blobs'
  };

  function init(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    return create(el, opts);
  }

  function create(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    el.classList.add('mesh-editor');
    el.style.cssText += ';position:relative;width:' + o.width + 'px;height:' + o.height + 'px;border-radius:16px;overflow:hidden;background:' + o.background + ';cursor:default;';

    var basePalette = palettes[o.palette] || palettes.aurora;
    var stops = [];
    for (var i = 0; i < o.stops; i++) {
      stops.push({
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
        color: basePalette[i % basePalette.length]
      });
    }

    var handleLayer = document.createElement('div');
    handleLayer.style.cssText = 'position:absolute;inset:0;pointer-events:' + (o.showHandles ? 'auto' : 'none') + ';';
    el.appendChild(handleLayer);

    var handles = [];
    var dragging = null;
    var listeners = [];

    function buildHandles() {
      handles.forEach(function (h) { h.remove(); });
      handles = [];
      stops.forEach(function (s, idx) {
        var h = document.createElement('div');
        h.className = 'mesh-handle';
        h.dataset.idx = idx;
        h.style.cssText =
          'position:absolute;width:18px;height:18px;border-radius:50%;' +
          'border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.5),0 0 0 1px rgba(0,0,0,0.4);' +
          'background:' + s.color + ';cursor:grab;' +
          'transform:translate(-50%,-50%);' +
          'left:' + s.x + '%;top:' + s.y + '%;z-index:5;';
        handleLayer.appendChild(h);
        handles.push(h);
      });
    }

    function render() {
      var parts = stops.map(function (s) {
        return 'radial-gradient(at ' + s.x.toFixed(1) + '% ' + s.y.toFixed(1) + '%, ' + hexToRgba(s.color, o.intensity) + ' 0px, transparent 50%)';
      });
      el.style.backgroundImage = parts.join(', ');
      el.style.backgroundSize = '100% 100%';
      el.style.backgroundColor = o.background;
      handles.forEach(function (h, i) {
        h.style.left = stops[i].x + '%';
        h.style.top = stops[i].y + '%';
        h.style.background = stops[i].color;
      });
      if (typeof o.onChange === 'function') o.onChange(exportCss());
    }

    function exportCss() {
      var parts = stops.map(function (s) {
        return 'radial-gradient(at ' + s.x.toFixed(1) + '% ' + s.y.toFixed(1) + '%, ' + hexToRgba(s.color, o.intensity) + ' 0px, transparent 50%)';
      });
      return parts.join(', ') + ', ' + o.background;
    }

    function down(e) {
      var t = e.target.closest('.mesh-handle');
      if (!t) return;
      dragging = +t.dataset.idx;
      t.style.cursor = 'grabbing';
      e.preventDefault();
    }

    function move(e) {
      if (dragging == null) return;
      var rect = el.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      stops[dragging].x = clamp(x, -20, 120);
      stops[dragging].y = clamp(y, -20, 120);
      render();
    }

    function up() {
      if (dragging != null && handles[dragging]) handles[dragging].style.cursor = 'grab';
      dragging = null;
    }

    function dbl(e) {
      var t = e.target.closest('.mesh-handle');
      if (!t) return;
      // Color picker on dblclick
      var idx = +t.dataset.idx;
      var input = document.createElement('input');
      input.type = 'color';
      input.value = stops[idx].color;
      input.style.cssText = 'position:absolute;left:-9999px;';
      el.appendChild(input);
      input.addEventListener('input', function () {
        stops[idx].color = input.value;
        render();
      });
      input.addEventListener('blur', function () { input.remove(); });
      input.click();
    }

    handleLayer.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    handleLayer.addEventListener('dblclick', dbl);
    listeners.push(
      [handleLayer, 'pointerdown', down],
      [window, 'pointermove', move],
      [window, 'pointerup', up],
      [handleLayer, 'dblclick', dbl]
    );

    function randomize() {
      stops.forEach(function (s) {
        s.x = 10 + Math.random() * 80;
        s.y = 10 + Math.random() * 80;
      });
      render();
    }

    function addStop() {
      var p = palettes[o.palette] || palettes.aurora;
      stops.push({
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
        color: p[stops.length % p.length]
      });
      buildHandles();
      render();
    }

    function removeStop() {
      if (stops.length > 2) {
        stops.pop();
        buildHandles();
        render();
      }
    }

    function setPalette(name) {
      if (!palettes[name]) return;
      var p = palettes[name];
      stops.forEach(function (s, i) { s.color = p[i % p.length]; });
      o.palette = name;
      render();
    }

    function destroy() {
      listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2]); });
      handles.forEach(function (h) { h.remove(); });
      el.classList.remove('mesh-editor');
    }

    buildHandles();
    render();

    return {
      el: el,
      stops: stops,
      exportCss: exportCss,
      randomize: randomize,
      addStop: addStop,
      removeStop: removeStop,
      setPalette: setPalette,
      destroy: destroy
    };
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function hexToRgba(hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  var MeshEditor = { init: init, palettes: palettes };
  if (typeof module !== 'undefined' && module.exports) module.exports = MeshEditor;
  else root.MeshEditor = MeshEditor;
})(typeof window !== 'undefined' ? window : this);
