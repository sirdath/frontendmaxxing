/* ============================================
   BLOB CURSOR — Gooey blob trailing the cursor
   Inspired by Codrops / Awwwards portfolios
   ============================================
   Usage:
     BlobCursor.init();
     BlobCursor.init({
       color: '#c084fc',
       dotColor: '#ffffff',
       size: 36,
       trailLerp: 0.18,
       dotLerp:   0.4,
       hoverSelector: 'a, button, [data-cursor-near]'
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    color: '#818cf8',
    dotColor: '#ffffff',
    size: 36,
    trailLerp: 0.18,
    dotLerp: 0.4,
    hoverSelector: 'a, button, [data-cursor-near]'
  };

  var instance = null;

  function ensureGoo() {
    if (document.getElementById('blob-cursor-goo')) return;
    var SVGNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.style.pointerEvents = 'none';
    var filter = document.createElementNS(SVGNS, 'filter');
    filter.setAttribute('id', 'blob-cursor-goo');
    var blur = document.createElementNS(SVGNS, 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic'); blur.setAttribute('stdDeviation', '6');
    filter.appendChild(blur);
    var color = document.createElementNS(SVGNS, 'feColorMatrix');
    color.setAttribute('in', 'SourceGraphic');
    color.setAttribute('type', 'matrix');
    color.setAttribute('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10');
    filter.appendChild(color);
    svg.appendChild(filter);
    document.body.appendChild(svg);
  }

  function init(opts) {
    if (instance) instance.destroy();
    ensureGoo();
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var wrap = document.createElement('div');
    wrap.className = 'blob-cursor-wrap';
    wrap.style.setProperty('--bc-size', o.size + 'px');
    wrap.style.setProperty('--bc-color', o.color);
    wrap.style.setProperty('--bc-dot-color', o.dotColor);

    var blob = document.createElement('div');
    blob.className = 'blob-cursor';
    var dot = document.createElement('div');
    dot.className = 'blob-cursor blob-cursor-dot';

    wrap.appendChild(blob);
    wrap.appendChild(dot);
    document.body.appendChild(wrap);

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var blobX = mouseX, blobY = mouseY;
    var dotX  = mouseX, dotY  = mouseY;
    var raf = null;
    var nearHover = false;
    var pressed = false;

    function tick() {
      blobX += (mouseX - blobX) * o.trailLerp;
      blobY += (mouseY - blobY) * o.trailLerp;
      dotX  += (mouseX - dotX)  * o.dotLerp;
      dotY  += (mouseY - dotY)  * o.dotLerp;
      blob.style.left = blobX + 'px';
      blob.style.top  = blobY + 'px';
      dot.style.left  = dotX  + 'px';
      dot.style.top   = dotY  + 'px';
      raf = requestAnimationFrame(tick);
    }

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      var t = e.target;
      if (t && t.closest && t.closest(o.hoverSelector)) {
        if (!nearHover) { nearHover = true; blob.classList.add('is-near'); }
      } else if (nearHover) {
        nearHover = false; blob.classList.remove('is-near');
      }
    }
    function onDown() { pressed = true; blob.classList.add('is-press'); }
    function onUp()   { pressed = false; blob.classList.remove('is-press'); }

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', onUp);
    raf = requestAnimationFrame(tick);

    instance = {
      destroy: function () {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerdown', onDown);
        document.removeEventListener('pointerup', onUp);
        if (raf) cancelAnimationFrame(raf);
        wrap.remove();
        instance = null;
      }
    };
    return instance;
  }

  function destroy() { if (instance) instance.destroy(); }

  var BlobCursor = { init: init, destroy: destroy };

  if (typeof module !== 'undefined' && module.exports) module.exports = BlobCursor;
  else root.BlobCursor = BlobCursor;
})(typeof window !== 'undefined' ? window : this);
