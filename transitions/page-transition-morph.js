/* ============================================
   PAGE TRANSITION MORPH — Shared-element morph between source and destination
   Inspired by Material "shared element transition" / FLIP animations
   ============================================
   Usage:
     PageTransitionMorph.morph('#thumb-1', '#hero-1', {
       duration: 600,
       easing: 'cubic-bezier(0.2, 0.9, 0.25, 1)',
       onDone: function () { … }
     });

     // Or wire it to a click that swaps view:
     PageTransitionMorph.bindOnClick('.thumb', function (src) {
       // expand a card → return the destination element selector
       openDetailFor(src);
       return '#hero-' + src.dataset.id;
     });

   How it works (FLIP):
     1. Snapshot src position/size.
     2. After your view-swap, snapshot dst position/size.
     3. Clone src (or use a transient clone) and animate it from src→dst.
   ============================================ */
(function (root) {
  'use strict';

  function morph(srcSel, dstSel, opts) {
    opts = opts || {};
    var duration = opts.duration || 500;
    var easing = opts.easing || 'cubic-bezier(0.2, 0.9, 0.25, 1)';

    var src = typeof srcSel === 'string' ? document.querySelector(srcSel) : srcSel;
    var dst = typeof dstSel === 'string' ? document.querySelector(dstSel) : dstSel;
    if (!src || !dst) {
      if (typeof opts.onDone === 'function') opts.onDone();
      return;
    }

    var sRect = src.getBoundingClientRect();
    var dRect = dst.getBoundingClientRect();

    // Build clone
    var clone = src.cloneNode(true);
    var s = clone.style;
    s.position = 'fixed';
    s.top = sRect.top + 'px';
    s.left = sRect.left + 'px';
    s.width = sRect.width + 'px';
    s.height = sRect.height + 'px';
    s.margin = '0';
    s.zIndex = 9997;
    s.transformOrigin = 'top left';
    s.transition = 'transform ' + duration + 'ms ' + easing + ', border-radius ' + duration + 'ms ' + easing + ', opacity ' + duration + 'ms ' + easing;
    s.pointerEvents = 'none';
    document.body.appendChild(clone);

    // Hide dst until animation completes
    var dstPrev = dst.style.visibility;
    dst.style.visibility = 'hidden';
    src.style.visibility = 'hidden';

    // Trigger
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var dx = dRect.left - sRect.left;
        var dy = dRect.top  - sRect.top;
        var sx = dRect.width  / sRect.width;
        var sy = dRect.height / sRect.height;
        s.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')';
        s.borderRadius = (window.getComputedStyle(dst).borderRadius) || '0';
      });
    });

    setTimeout(function () {
      dst.style.visibility = dstPrev;
      src.style.visibility = '';
      clone.remove();
      if (typeof opts.onDone === 'function') opts.onDone();
    }, duration + 30);
  }

  function bindOnClick(selector, resolver, opts) {
    function handler(e) {
      var src = e.target.closest(selector);
      if (!src) return;
      e.preventDefault();
      var dstSel = resolver(src);
      // Allow caller to do async work first
      Promise.resolve(dstSel).then(function (resolved) {
        if (!resolved) return;
        morph(src, typeof resolved === 'string' ? document.querySelector(resolved) : resolved, opts);
      });
    }
    document.addEventListener('click', handler);
    return function destroy() { document.removeEventListener('click', handler); };
  }

  var PageTransitionMorph = { morph: morph, bindOnClick: bindOnClick };

  if (typeof module !== 'undefined' && module.exports) module.exports = PageTransitionMorph;
  else root.PageTransitionMorph = PageTransitionMorph;
})(typeof window !== 'undefined' ? window : this);
