/* ============================================
   CARD SWIPE — iOS-style swipe-to-reveal controller
   Inspired by WatermelonUI card-swipe
   ============================================
   Usage:
     CardSwipe.init('[data-cswipe]', {
       threshold: 60,          // px before snap-open
       maxOverDrag: 24,        // rubber-band past max
       closeOnTapOutside: true,
       onOpen: function (dir, host) {},
       onClose: function (host) {},
       onAction: function (actionEl, host) {}
     });

     instance.open('left'|'right');
     instance.close();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    threshold: 60,
    maxOverDrag: 24,
    closeOnTapOutside: true,
    onOpen: null,
    onClose: null,
    onAction: null
  };

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
    var card = host.querySelector('.cswipe-card');
    var leftActions  = host.querySelector('.cswipe-actions-left');
    var rightActions = host.querySelector('.cswipe-actions-right');
    var leftW  = leftActions  ? leftActions.offsetWidth  : 0;
    var rightW = rightActions ? rightActions.offsetWidth : 0;

    var startX = 0, dx = 0, dragging = false, openDir = null;

    function setX(x) {
      card.style.transform = 'translateX(' + x + 'px)';
    }

    function clampDelta(d) {
      if (d > 0) {
        if (!leftW) return d > 0 ? rubber(d) : d;
        if (d > leftW) return leftW + rubber(d - leftW);
        return d;
      }
      if (d < 0) {
        if (!rightW) return -rubber(-d);
        if (-d > rightW) return -rightW - rubber(-d - rightW);
        return d;
      }
      return 0;
    }
    function rubber(over) {
      return Math.min(o.maxOverDrag, over * 0.32);
    }

    card.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.cswipe-action')) return;
      e.preventDefault();
      dragging = true;
      startX = e.clientX;
      card.classList.add('is-dragging');
      try { card.setPointerCapture(e.pointerId); } catch (_) {}
    });

    card.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dx = clampDelta((e.clientX - startX) + (openDir === 'left' ? leftW : openDir === 'right' ? -rightW : 0));
      setX(dx);
    });

    card.addEventListener('pointerup', function (e) {
      if (!dragging) return;
      dragging = false;
      card.classList.remove('is-dragging');
      try { card.releasePointerCapture(e.pointerId); } catch (_) {}

      if (dx > o.threshold && leftW)  { open('left');  return; }
      if (-dx > o.threshold && rightW){ open('right'); return; }
      close();
    });

    function open(dir) {
      openDir = dir;
      host.classList.remove('is-open-left', 'is-open-right');
      host.classList.add('is-open-' + dir);
      host.style.setProperty('--cs-open-x', (dir === 'left' ? leftW : rightW) + 'px');
      card.style.transform = '';
      if (typeof o.onOpen === 'function') o.onOpen(dir, host);
    }

    function close() {
      openDir = null;
      host.classList.remove('is-open-left', 'is-open-right');
      card.style.transform = '';
      if (typeof o.onClose === 'function') o.onClose(host);
    }

    function wireActions(group) {
      if (!group) return;
      group.addEventListener('click', function (e) {
        var btn = e.target.closest('.cswipe-action');
        if (!btn) return;
        if (typeof o.onAction === 'function') o.onAction(btn, host);
        close();
      });
    }
    wireActions(leftActions);
    wireActions(rightActions);

    if (o.closeOnTapOutside) {
      document.addEventListener('pointerdown', function (e) {
        if (!openDir) return;
        if (!host.contains(e.target)) close();
      }, true);
    }

    return { el: host, open: open, close: close };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var CardSwipe = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = CardSwipe;
  else root.CardSwipe = CardSwipe;
})(typeof window !== 'undefined' ? window : this);
