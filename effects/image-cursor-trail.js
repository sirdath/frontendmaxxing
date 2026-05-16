/* ============================================
   IMAGE CURSOR TRAIL — Images spawn along cursor path and fade out
   Inspired by Skiper UI, Fancy Components ImageTrail, Olivier Larose tutorials
   ============================================
   On pointer-move inside the target element, sequential images from a list
   are spawned at the cursor position, scaled in, then fade + scale out.
   Distinctive: not a particle/dot trail — full-size images with momentum.

   Usage:
     ImageCursorTrail.bind('.hero', {
       images: ['/img/1.jpg', '/img/2.jpg', '/img/3.jpg', '/img/4.jpg'],
       distance: 80,            // px between spawns
       lifetime: 1200,          // ms before fully removed
       size: { w: 200, h: 280 },
       rotation: 6,              // ±degrees random tilt
       randomImage: false,      // false = cycle in order
       maxOnScreen: 8
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    images: [],
    distance: 80,
    lifetime: 1200,
    size: { w: 220, h: 290 },
    rotation: 6,
    randomImage: false,
    maxOnScreen: 10,
    fadeIn: 200,
    pinOnPause: true   // keeps the last image visible if cursor stops
  };

  function bind(target, opts) {
    var host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) return null;
    var o = mergeOpts(opts);
    if (!o.images || !o.images.length) {
      console.warn('ImageCursorTrail: no images provided');
      return null;
    }

    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.style.overflow = host.style.overflow || 'hidden';
    host.style.userSelect = 'none';

    var lastX = null, lastY = null;
    var imgIndex = 0;
    var active = [];

    function onMove(e) {
      var r = host.getBoundingClientRect();
      var x = e.clientX - r.left;
      var y = e.clientY - r.top;
      if (lastX == null) { lastX = x; lastY = y; spawn(x, y); return; }
      var dx = x - lastX, dy = y - lastY;
      var d = Math.hypot(dx, dy);
      if (d < o.distance) return;
      lastX = x; lastY = y;
      spawn(x, y);
    }

    function spawn(x, y) {
      var src = o.randomImage
        ? o.images[Math.floor(Math.random() * o.images.length)]
        : o.images[imgIndex++ % o.images.length];

      var img = document.createElement('img');
      img.src = src;
      img.draggable = false;
      img.style.cssText = [
        'position:absolute',
        'pointer-events:none',
        'left:' + (x - o.size.w / 2) + 'px',
        'top:'  + (y - o.size.h / 2) + 'px',
        'width:' + o.size.w + 'px',
        'height:' + o.size.h + 'px',
        'object-fit:cover',
        'border-radius:10px',
        'box-shadow:0 16px 40px -10px rgba(0,0,0,0.4)',
        'opacity:0',
        'transform:scale(0.7) rotate(' + (Math.random() - 0.5) * 2 * o.rotation + 'deg)',
        'will-change:transform,opacity',
        'transition:opacity ' + o.fadeIn + 'ms ease, transform ' + o.fadeIn + 'ms ease',
        'z-index:1'
      ].join(';');
      host.appendChild(img);
      active.push(img);

      requestAnimationFrame(function () {
        img.style.opacity = '1';
        img.style.transform = img.style.transform.replace(/scale\([^)]+\)/, 'scale(1)');
      });

      // Fade-out
      setTimeout(function () {
        img.style.transition = 'opacity ' + (o.lifetime - o.fadeIn) + 'ms ease, transform ' + (o.lifetime - o.fadeIn) + 'ms ease';
        img.style.opacity = '0';
        img.style.transform = img.style.transform.replace(/scale\([^)]+\)/, 'scale(0.85)');
      }, o.fadeIn + 50);

      setTimeout(function () {
        if (img.parentNode) img.parentNode.removeChild(img);
        active = active.filter(function (a) { return a !== img; });
      }, o.lifetime + 100);

      // Enforce max
      while (active.length > o.maxOnScreen) {
        var oldest = active.shift();
        oldest.style.transition = 'opacity 200ms ease';
        oldest.style.opacity = '0';
        setTimeout(function (el) { return function () { if (el.parentNode) el.parentNode.removeChild(el); }; }(oldest), 250);
      }
    }

    host.addEventListener('pointermove', onMove);

    function destroy() {
      host.removeEventListener('pointermove', onMove);
      active.forEach(function (img) { if (img.parentNode) img.parentNode.removeChild(img); });
      active = [];
    }

    return { host: host, destroy: destroy };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var ImageCursorTrail = { bind: bind };
  if (typeof module !== 'undefined' && module.exports) module.exports = ImageCursorTrail;
  else root.ImageCursorTrail = ImageCursorTrail;
})(typeof window !== 'undefined' ? window : this);
