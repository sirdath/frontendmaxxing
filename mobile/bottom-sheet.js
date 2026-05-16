/* ============================================
   BOTTOM SHEET — Open/close + drag-to-dismiss controller
   ============================================
   Usage:
     BottomSheet.init('.bsht', {
       snapPoints: [0, 50, 100],   // % from bottom — 0 = closed, 100 = full
       initialSnap: 100,
       backdrop: true,
       onOpen, onClose, onSnap
     });

     instance.open();
     instance.close();
     instance.snapTo(50);
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    snapPoints: [0, 100],
    initialSnap: 100,
    backdrop: true,
    dismissOnBackdrop: true,
    triggerSelector: '.bsht-trigger',
    closeSelector: '.bsht-close',
    onOpen: null,
    onClose: null,
    onSnap: null
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
    var panel = host.querySelector('.bsht-panel');
    var handle = host.querySelector('.bsht-handle');
    var backdrop = host.querySelector('.bsht-backdrop');
    var trigger = host.querySelector(o.triggerSelector);
    var closer = host.querySelector(o.closeSelector);

    if (trigger) trigger.addEventListener('click', open);
    if (closer) closer.addEventListener('click', close);
    if (backdrop && o.dismissOnBackdrop) backdrop.addEventListener('click', close);

    // Drag-to-dismiss on handle
    if (handle) {
      var startY = 0, startTime = 0, dragging = false, panelHeight = 0;
      handle.addEventListener('pointerdown', function (e) {
        dragging = true;
        startY = e.clientY;
        startTime = Date.now();
        panelHeight = panel.offsetHeight;
        try { handle.setPointerCapture(e.pointerId); } catch (_) {}
        panel.style.transition = 'none';
      });
      handle.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var dy = e.clientY - startY;
        if (dy < 0) return;
        var pct = (dy / panelHeight) * 100;
        panel.style.setProperty('--y', pct + '%');
      });
      handle.addEventListener('pointerup', function (e) {
        if (!dragging) return;
        dragging = false;
        var dy = e.clientY - startY;
        var ms = Date.now() - startTime;
        panel.style.transition = '';
        // Velocity-based dismiss
        var velocity = dy / ms;
        if (velocity > 0.6 || dy > panelHeight * 0.4) close();
        else snapTo(o.initialSnap);
      });
    }

    function open() {
      host.classList.add('is-open');
      snapTo(o.initialSnap);
      if (typeof o.onOpen === 'function') o.onOpen();
    }
    function close() {
      host.classList.remove('is-open');
      panel.style.setProperty('--y', '100%');
      if (typeof o.onClose === 'function') o.onClose();
    }
    function snapTo(percentFromBottom) {
      var y = 100 - percentFromBottom;
      panel.style.setProperty('--y', y + '%');
      if (percentFromBottom > 0) host.classList.add('is-open');
      if (typeof o.onSnap === 'function') o.onSnap(percentFromBottom);
    }

    // Esc closes
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && host.classList.contains('is-open')) close();
    });

    return { host: host, open: open, close: close, snapTo: snapTo };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var BottomSheet = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = BottomSheet;
  else root.BottomSheet = BottomSheet;
})(typeof window !== 'undefined' ? window : this);
