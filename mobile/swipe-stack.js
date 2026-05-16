/* ============================================
   SWIPE STACK — Tinder-style swipe controller for card stacks
   ============================================
   Usage:
     SwipeStack.init('.swst', {
       threshold: 100,
       velocityThreshold: 0.5,
       rotationFactor: 0.1,
       onSwipe: function (direction, card, allCards) { ... }
     });

     instance.swipe('left');
     instance.reset();
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    threshold: 100,
    velocityThreshold: 0.5,
    rotationFactor: 0.1,
    allowedDirections: ['left', 'right', 'up'],
    onSwipe: null,
    onDragMove: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(stack, opts) {
    var o = mergeOpts(opts);
    var cards = Array.from(stack.querySelectorAll('.swst-card'));
    updatePositions();

    cards.forEach(function (card, idx) {
      bindDrag(card);
    });

    function bindDrag(card) {
      var startX = 0, startY = 0, startTime = 0, dragging = false;
      card.addEventListener('pointerdown', function (e) {
        if (cards.indexOf(card) !== 0) return;
        e.preventDefault();
        dragging = true;
        startX = e.clientX; startY = e.clientY; startTime = Date.now();
        card.classList.add('is-dragging');
        try { card.setPointerCapture(e.pointerId); } catch (_) {}
      });
      card.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        var rot = dx * o.rotationFactor;
        card.style.setProperty('--tx', dx + 'px');
        card.style.setProperty('--ty', dy + 'px');
        card.style.setProperty('--rot', rot + 'deg');
        card.dataset.txSign = dx > 30 ? '1' : (dx < -30 ? '-1' : '0');
        card.dataset.tySign = dy < -30 ? '-1' : (dy > 30 ? '1' : '0');
        if (typeof o.onDragMove === 'function') o.onDragMove(dx, dy, card);
      });
      card.addEventListener('pointerup', function (e) {
        if (!dragging) return;
        dragging = false;
        card.classList.remove('is-dragging');
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        var dt = Math.max(1, Date.now() - startTime);
        var vx = Math.abs(dx) / dt;
        var vy = Math.abs(dy) / dt;
        var dir = null;
        if (Math.abs(dx) > o.threshold || vx > o.velocityThreshold) dir = dx > 0 ? 'right' : 'left';
        else if (-dy > o.threshold || (vy > o.velocityThreshold && dy < 0)) dir = 'up';
        else if (dy > o.threshold) dir = 'down';
        if (dir && o.allowedDirections.indexOf(dir) !== -1) {
          commitSwipe(card, dir);
        } else {
          // Snap back
          card.style.setProperty('--tx', '0px');
          card.style.setProperty('--ty', '0px');
          card.style.setProperty('--rot', '0deg');
          delete card.dataset.txSign;
          delete card.dataset.tySign;
        }
      });
    }

    function commitSwipe(card, dir) {
      card.classList.add('is-out-' + dir);
      card.classList.remove('is-dragging');
      setTimeout(function () {
        cards = cards.filter(function (c) { return c !== card; });
        card.style.display = 'none';
        updatePositions();
      }, 320);
      if (typeof o.onSwipe === 'function') o.onSwipe(dir, card, cards);
    }

    function swipe(dir) {
      if (!cards.length) return;
      commitSwipe(cards[0], dir);
    }

    function reset() {
      stack.querySelectorAll('.swst-card').forEach(function (c) {
        c.classList.remove('is-out-left', 'is-out-right', 'is-out-up', 'is-out-down');
        c.style.display = '';
        c.style.removeProperty('--tx');
        c.style.removeProperty('--ty');
        c.style.removeProperty('--rot');
      });
      cards = Array.from(stack.querySelectorAll('.swst-card'));
      updatePositions();
    }

    function updatePositions() {
      cards.forEach(function (c, i) {
        c.dataset.pos = String(i);
      });
    }

    // Optional action buttons
    stack.parentElement.querySelectorAll('[data-swst-action]').forEach(function (btn) {
      btn.addEventListener('click', function () { swipe(btn.dataset.swstAction); });
    });

    return { stack: stack, swipe: swipe, reset: reset, get cards() { return cards.slice(); } };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var SwipeStack = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = SwipeStack;
  else root.SwipeStack = SwipeStack;
})(typeof window !== 'undefined' ? window : this);
