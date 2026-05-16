/* ============================================
   CURSOR ZOOM — Magnifier lens that follows the cursor (CSS transform-based)
   ============================================
   Hovers a circular lens that magnifies the content beneath. Works on any
   container — uses a copy of the inner content scaled inside a clip-path
   circle.

   Usage:
     CursorZoom.bind('.zoomable', {
       size: 180,        // px diameter of lens
       zoom: 2.5,        // magnification
       shape: 'circle',  // 'circle' or 'square'
       border: '2px solid rgba(255,255,255,0.5)',
       offset: { x: 0, y: 0 }
     });

   Method:
     instance.destroy()
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    size: 180,
    zoom: 2.5,
    shape: 'circle',
    border: '2px solid rgba(255,255,255,0.5)',
    shadow: '0 8px 24px -4px rgba(0,0,0,0.5)',
    offset: { x: 0, y: 0 },
    hideRealCursor: true
  };

  function bind(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(host, opts) {
    var o = mergeOpts(opts);

    if (o.hideRealCursor) host.style.cursor = 'none';

    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.style.overflow = host.style.overflow || 'hidden';

    var lens = document.createElement('div');
    lens.className = 'czoom-lens';
    lens.style.cssText = [
      'position: absolute',
      'pointer-events: none',
      'z-index: 100',
      'width: ' + o.size + 'px',
      'height: ' + o.size + 'px',
      'border-radius: ' + (o.shape === 'circle' ? '50%' : '8px'),
      'border: ' + o.border,
      'box-shadow: ' + o.shadow,
      'overflow: hidden',
      'opacity: 0',
      'transition: opacity 0.18s ease',
      'will-change: transform, opacity',
      'transform: translate(-50%, -50%)',
      'background: #0a0a14'
    ].join(';');

    // Inner clone container — visually identical to host, scaled
    var clone = document.createElement('div');
    clone.style.cssText = [
      'position: absolute',
      'inset: 0',
      'transform-origin: 0 0',
      'pointer-events: none'
    ].join(';');
    lens.appendChild(clone);
    host.appendChild(lens);

    function onMove(e) {
      var rect = host.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      lens.style.left = (x + o.offset.x) + 'px';
      lens.style.top = (y + o.offset.y) + 'px';
      lens.style.opacity = '1';

      // Clone host's innerHTML once, then re-position
      if (!clone.dataset.cloned) {
        clone.innerHTML = host.innerHTML.replace(/<div class="czoom-lens"[\s\S]*?<\/div>$/, '');
        clone.dataset.cloned = '1';
        // Remove the duplicated lens from inside the clone if any
        clone.querySelectorAll('.czoom-lens').forEach(function (n) { n.remove(); });
      }
      var cw = rect.width;
      var ch = rect.height;
      clone.style.width = cw + 'px';
      clone.style.height = ch + 'px';
      var tx = -(x * o.zoom) + o.size / 2;
      var ty = -(y * o.zoom) + o.size / 2;
      clone.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + o.zoom + ')';
    }
    function onLeave() {
      lens.style.opacity = '0';
    }

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);

    function destroy() {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      if (lens.parentNode) lens.parentNode.removeChild(lens);
      if (o.hideRealCursor) host.style.cursor = '';
    }

    return { el: host, destroy: destroy };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var CursorZoom = { bind: bind };
  if (typeof module !== 'undefined' && module.exports) module.exports = CursorZoom;
  else root.CursorZoom = CursorZoom;
})(typeof window !== 'undefined' ? window : this);
