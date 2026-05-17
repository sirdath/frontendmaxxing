/* ============================================
   IMAGE GALLERY PRO — Lightbox + keyboard + zoom + pan
   ============================================
   Usage:
     ImageGalleryPro.init('[data-igp]', {
       images: optional array of {src, caption}, otherwise pulls from data-full on .igp-tile
       startIndex: 0, onOpen, onClose, onChange
     });
   ============================================ */
(function (root) {
  'use strict';
  var defaults = { images: null, startIndex: 0, onOpen: null, onClose: null, onChange: null };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(host, opts) {
    var o = mergeOpts(opts);
    var tiles = host.querySelectorAll('.igp-tile');
    var images = o.images || Array.from(tiles).map(function (t, i) {
      return { src: t.dataset.full || t.dataset.src || '', caption: t.dataset.caption || '', tile: t };
    });
    var overlay = host.querySelector('.igp-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'igp-overlay';
      overlay.innerHTML = [
        '<div class="igp-counter"></div>',
        '<button class="igp-close" aria-label="Close">×</button>',
        '<button class="igp-prev" aria-label="Previous">‹</button>',
        '<button class="igp-next" aria-label="Next">›</button>',
        '<div class="igp-stage"><img class="igp-img" alt=""></div>',
        '<div class="igp-zoom"><button class="zin">+</button><button class="zout">−</button><button class="zr">⤓</button></div>',
        '<div class="igp-caption"></div>',
        '<div class="igp-strip"></div>'
      ].join('');
      host.appendChild(overlay);
    }
    var img = overlay.querySelector('.igp-img');
    var capEl = overlay.querySelector('.igp-caption');
    var counterEl = overlay.querySelector('.igp-counter');
    var strip = overlay.querySelector('.igp-strip');
    var closeBtn = overlay.querySelector('.igp-close');
    var prevBtn = overlay.querySelector('.igp-prev');
    var nextBtn = overlay.querySelector('.igp-next');
    var zin = overlay.querySelector('.zin');
    var zout = overlay.querySelector('.zout');
    var zr = overlay.querySelector('.zr');

    // Build strip
    if (strip && !strip.children.length) {
      images.forEach(function (im, i) {
        var t = document.createElement('div');
        t.className = 'igp-strip-thumb';
        if (im.tile && im.tile.style.background) t.style.background = getComputedStyle(im.tile).background;
        t.addEventListener('click', function () { go(i); });
        strip.appendChild(t);
      });
    }

    var idx = 0, scale = 1, ox = 0, oy = 0, dragging = false, sx = 0, sy = 0, last = { ox: 0, oy: 0 };

    function open(at) {
      idx = at || 0; scale = 1; ox = 0; oy = 0;
      host.classList.add('is-open');
      render();
      if (typeof o.onOpen === 'function') o.onOpen(idx);
    }
    function close() {
      host.classList.remove('is-open');
      host.classList.remove('is-zoomed');
      if (typeof o.onClose === 'function') o.onClose();
    }
    function render() {
      var d = images[idx];
      if (!d) return;
      img.src = d.src;
      if (capEl) capEl.textContent = d.caption || '';
      if (counterEl) counterEl.textContent = (idx + 1) + ' / ' + images.length;
      if (strip) strip.querySelectorAll('.igp-strip-thumb').forEach(function (x, i) {
        x.classList.toggle('is-active', i === idx);
        if (i === idx) x.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
      });
      scale = 1; ox = 0; oy = 0; applyTransform();
      host.classList.remove('is-zoomed');
    }
    function go(i) {
      idx = (i + images.length) % images.length;
      render();
      if (typeof o.onChange === 'function') o.onChange(idx);
    }
    function applyTransform() {
      img.style.setProperty('--sc', scale);
      img.style.transform = 'translate(' + ox + 'px,' + oy + 'px) scale(' + scale + ')';
    }
    function zoom(by) {
      scale = Math.max(0.5, Math.min(5, scale * by));
      host.classList.toggle('is-zoomed', scale > 1.01);
      if (scale === 1) { ox = 0; oy = 0; }
      applyTransform();
    }

    // Bind tiles
    tiles.forEach(function (t, i) {
      t.addEventListener('click', function () { open(i); });
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', function () { go(idx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(idx + 1); });
    if (zin) zin.addEventListener('click', function () { zoom(1.4); });
    if (zout) zout.addEventListener('click', function () { zoom(1 / 1.4); });
    if (zr) zr.addEventListener('click', function () { scale = 1; ox = 0; oy = 0; applyTransform(); host.classList.remove('is-zoomed'); });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.classList.contains('igp-stage')) close();
    });

    overlay.addEventListener('wheel', function (e) {
      if (!host.classList.contains('is-open')) return;
      e.preventDefault();
      zoom(e.deltaY < 0 ? 1.1 : 1 / 1.1);
    }, { passive: false });

    img.addEventListener('pointerdown', function (e) {
      if (scale <= 1.01) return;
      dragging = true; sx = e.clientX; sy = e.clientY; last = { ox: ox, oy: oy };
      try { img.setPointerCapture(e.pointerId); } catch (_) {}
    });
    img.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      ox = last.ox + (e.clientX - sx);
      oy = last.oy + (e.clientY - sy);
      applyTransform();
    });
    img.addEventListener('pointerup', function () { dragging = false; });
    img.addEventListener('dblclick', function (e) {
      if (scale > 1.01) { scale = 1; ox = 0; oy = 0; }
      else { scale = 2; }
      applyTransform();
      host.classList.toggle('is-zoomed', scale > 1.01);
    });

    document.addEventListener('keydown', function (e) {
      if (!host.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(idx - 1);
      if (e.key === 'ArrowRight') go(idx + 1);
      if (e.key === '+' || e.key === '=') zoom(1.4);
      if (e.key === '-' || e.key === '_') zoom(1 / 1.4);
      if (e.key === '0') { scale = 1; ox = 0; oy = 0; applyTransform(); host.classList.remove('is-zoomed'); }
    });

    return { el: host, open: open, close: close, go: go, get index() { return idx; } };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var ImageGalleryPro = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = ImageGalleryPro;
  else root.ImageGalleryPro = ImageGalleryPro;
})(typeof window !== 'undefined' ? window : this);
