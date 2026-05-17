/* ============================================
   IOS MODAL SHEET — Drag-to-snap bottom sheet
   ============================================
   Usage:
     IosModalSheet.init('[data-ios-sheet]');

     // Or programmatic:
     var s = IosModalSheet.open(container, {
       initial: 'medium',           // 'small' | 'medium' | 'large'
       snaps: ['small','medium','large'],
       content: '<h2>Title</h2>',
       onClose: function () {}
     });
   ============================================ */
(function (root) {
  'use strict';

  function bindOverlay(overlay) {
    if (overlay.dataset.iosSheetBound) return;
    overlay.dataset.iosSheetBound = '1';
    var panel = overlay.querySelector('[data-ios-sheet-panel]') || overlay.querySelector('.ios-sheet');
    var handle = overlay.querySelector('[data-ios-sheet-handle]') || overlay.querySelector('.ios-sheet-handle');
    if (!panel) return;

    var snaps = (overlay.dataset.iosSheetSnaps || 'small,medium,large').split(',');
    var snapHeights = snaps.map(function (n) { return getCssPct(panel, '--ios-sheet-snap-' + n.trim()) || 50; });

    var dragStartY = 0, startHeightPx = 0, hostHeight = 0;
    var dragging = false;

    function pointerDown(e) {
      e.preventDefault();
      dragging = true;
      panel.classList.add('is-dragging');
      var rect = overlay.getBoundingClientRect();
      hostHeight = rect.height;
      dragStartY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      startHeightPx = panel.getBoundingClientRect().height;
      handle.setPointerCapture && e.pointerId !== undefined && handle.setPointerCapture(e.pointerId);
    }

    function pointerMove(e) {
      if (!dragging) return;
      var y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      var dy = dragStartY - y; // dragging up → positive
      var newH = Math.max(60, Math.min(hostHeight, startHeightPx + dy));
      panel.style.height = newH + 'px';
    }

    function pointerUp() {
      if (!dragging) return;
      dragging = false;
      panel.classList.remove('is-dragging');
      var curH = panel.getBoundingClientRect().height;
      var curPct = (curH / hostHeight) * 100;
      // close if dragged below the smallest snap by half
      if (curPct < snapHeights[0] / 2) {
        close();
        return;
      }
      // snap to nearest
      var nearest = snaps[0], diff = Infinity;
      snaps.forEach(function (n, i) {
        var d = Math.abs(curPct - snapHeights[i]);
        if (d < diff) { diff = d; nearest = n; }
      });
      setSnap(nearest);
    }

    function setSnap(name) {
      panel.style.height = ''; // let class take over
      panel.classList.remove('is-small', 'is-medium', 'is-large');
      panel.classList.add('is-' + name);
    }

    function close() {
      overlay.classList.add('is-closing');
      setTimeout(function () { overlay.remove(); }, 320);
    }

    if (handle) {
      handle.addEventListener('pointerdown', pointerDown);
      window.addEventListener('pointermove', pointerMove, { passive: false });
      window.addEventListener('pointerup', pointerUp);
      window.addEventListener('pointercancel', pointerUp);
    }
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    overlay._iosSheet = { setSnap: setSnap, close: close };
  }

  function getCssPct(el, varName) {
    var v = getComputedStyle(el).getPropertyValue(varName).trim();
    if (!v) return 0;
    return parseFloat(v);
  }

  function init(target) {
    var nodes = typeof target === 'string' ? document.querySelectorAll(target) : [target];
    Array.prototype.forEach.call(nodes, bindOverlay);
  }

  function open(container, opts) {
    opts = opts || {};
    if (typeof container === 'string') container = document.querySelector(container);
    if (!container) return null;

    var overlay = document.createElement('div');
    overlay.className = 'ios-sheet-overlay';
    overlay.setAttribute('data-ios-sheet', '');
    if (opts.snaps) overlay.setAttribute('data-ios-sheet-snaps', opts.snaps.join(','));

    var panel = document.createElement('div');
    panel.className = 'ios-sheet is-' + (opts.initial || 'medium');
    panel.setAttribute('data-ios-sheet-panel', '');

    var handle = document.createElement('div');
    handle.className = 'ios-sheet-handle';
    handle.setAttribute('data-ios-sheet-handle', '');
    panel.appendChild(handle);

    var content = document.createElement('div');
    content.className = 'ios-sheet-content';
    if (typeof opts.content === 'string') content.innerHTML = opts.content;
    else if (opts.content instanceof Node) content.appendChild(opts.content);
    panel.appendChild(content);

    overlay.appendChild(panel);
    container.appendChild(overlay);
    bindOverlay(overlay);
    return overlay._iosSheet;
  }

  var IosModalSheet = { init: init, open: open };
  if (typeof module !== 'undefined' && module.exports) module.exports = IosModalSheet;
  else root.IosModalSheet = IosModalSheet;
})(typeof window !== 'undefined' ? window : this);
