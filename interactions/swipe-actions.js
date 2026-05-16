/* ============================================
   SWIPE ACTIONS — iOS-style swipe-to-reveal actions on list items
   ============================================
   Usage:
     SwipeActions.init('[data-swipe-actions]', {
       snap: true,           // snap to revealed when threshold crossed
       onAction: function (action, el) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    snap: true,
    threshold: 0.4,       // fraction of action width
    onAction: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var content = el.querySelector('.swpa-content');
    var rightAct = el.querySelector('.swpa-actions-right');
    var leftAct  = el.querySelector('.swpa-actions-left');
    if (!content) return { el: el, destroy: function () {} };

    var rightW = rightAct ? rightAct.offsetWidth : 0;
    var leftW  = leftAct  ? leftAct.offsetWidth  : 0;

    var startX = 0, currentX = 0, dragging = false, currentTranslate = 0;

    function set(x) {
      content.style.transform = 'translateX(' + x + 'px)';
      currentTranslate = x;
    }

    function snapTo(x) {
      el.classList.remove('is-swiping');
      set(x);
    }

    function close() { snapTo(0); }

    el.addEventListener('pointerdown', function (e) {
      startX = e.clientX;
      currentX = currentTranslate;
      dragging = true;
      el.classList.add('is-swiping');
      el.setPointerCapture(e.pointerId);
    });

    el.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX + currentX;
      // Constrain to [-rightW, leftW]
      var min = -rightW;
      var max = leftW;
      dx = Math.max(min, Math.min(max, dx));
      set(dx);
    });

    function up() {
      if (!dragging) return;
      dragging = false;
      var t = currentTranslate;
      if (o.snap) {
        // Snap to nearest of {0, -rightW, leftW} based on crossed threshold
        if (t < -rightW * o.threshold)      snapTo(-rightW);
        else if (t >  leftW  * o.threshold) snapTo(leftW);
        else                                 snapTo(0);
      } else {
        el.classList.remove('is-swiping');
      }
    }
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);

    // Action button click
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.swpa-action[data-action]');
      if (!b) return;
      if (typeof o.onAction === 'function') o.onAction(b.getAttribute('data-action'), el);
      close();
    });

    function destroy() {
      // PointerCapture cleanup is implicit when element removed
    }

    return { el: el, open: function (dir) { snapTo(dir > 0 ? leftW : -rightW); }, close: close, destroy: destroy };
  }

  var SwipeActions = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = SwipeActions;
  else root.SwipeActions = SwipeActions;
})(typeof window !== 'undefined' ? window : this);
