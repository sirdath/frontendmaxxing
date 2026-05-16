/* ============================================
   CURSOR TEXT — Text that follows the cursor (label / tooltip / role indicator)
   ============================================
   Renders a label that rides next to the cursor — used to show what the user
   is "about to do" (e.g. "View" on a clickable card, "Drag to reorder" on a
   list, "Click for source" on a code block).

   Usage:
     <a class="ctxt-host" data-ctxt="View →">image card</a>
     <div class="ctxt-host" data-ctxt="Drag" data-ctxt-icon="✥">drag me</div>

     CursorText.init('[data-ctxt]', {
       offset: { x: 18, y: 18 },
       blendMode: 'difference',
       lerp: 0.22
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    selector: '[data-ctxt]',
    offset: { x: 18, y: 18 },
    blendMode: 'difference',
    lerp: 0.22,
    fontSize: 12,
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.72)',
    border: '1px solid rgba(255, 255, 255, 0.15)'
  };

  var state = { label: null, active: null, tx: 0, ty: 0, cx: 0, cy: 0, rafId: null };

  function init(target, opts) {
    var o = mergeOpts(opts);
    state.opts = o;

    // Build single shared label
    if (!state.label) {
      state.label = document.createElement('div');
      state.label.className = 'ctxt-label';
      state.label.style.cssText = [
        'position: fixed',
        'top: 0',
        'left: 0',
        'pointer-events: none',
        'z-index: 99997',
        'padding: 0.35rem 0.6rem',
        'background: ' + o.background,
        'border: ' + o.border,
        'color: ' + o.color,
        'border-radius: 6px',
        'font-size: ' + o.fontSize + 'px',
        'font-weight: 600',
        'font-family: -apple-system, system-ui, sans-serif',
        'letter-spacing: 0.02em',
        'white-space: nowrap',
        'mix-blend-mode: ' + o.blendMode,
        'opacity: 0',
        'transition: opacity 0.18s ease',
        'will-change: transform, opacity',
        'transform: translate(-100px, -100px)',
        'backdrop-filter: blur(8px)',
        '-webkit-backdrop-filter: blur(8px)'
      ].join(';');
      document.body.appendChild(state.label);
    }

    var els = typeof target === 'string'
      ? document.querySelectorAll(target || o.selector)
      : (target.length ? target : [target]);

    Array.prototype.forEach.call(els, function (el) {
      el.addEventListener('pointerenter', function () {
        state.active = el;
        var text = el.dataset.ctxt || '';
        var icon = el.dataset.ctxtIcon || '';
        state.label.innerHTML = (icon ? '<span style="margin-right:0.3rem;">' + escape(icon) + '</span>' : '') + escape(text);
        state.label.style.opacity = '1';
        // Position immediately at current mouse
        state.cx = state.tx;
        state.cy = state.ty;
      });
      el.addEventListener('pointerleave', function () {
        if (state.active === el) {
          state.active = null;
          state.label.style.opacity = '0';
        }
      });
    });

    if (!state.bound) {
      window.addEventListener('pointermove', onMove);
      state.bound = true;
      tick();
    }
  }

  function onMove(e) {
    state.tx = e.clientX + state.opts.offset.x;
    state.ty = e.clientY + state.opts.offset.y;
  }

  function tick() {
    if (state.active) {
      state.cx += (state.tx - state.cx) * state.opts.lerp;
      state.cy += (state.ty - state.cy) * state.opts.lerp;
      state.label.style.transform = 'translate(' + state.cx.toFixed(1) + 'px,' + state.cy.toFixed(1) + 'px)';
    }
    state.rafId = requestAnimationFrame(tick);
  }

  function escape(s) {
    return String(s == null ? '' : s).replace(/[<>&]/g, function (c) { return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]); });
  }

  function destroy() {
    if (state.label && state.label.parentNode) state.label.parentNode.removeChild(state.label);
    state.label = null;
    if (state.rafId) cancelAnimationFrame(state.rafId);
    window.removeEventListener('pointermove', onMove);
    state.bound = false;
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var CursorText = { init: init, destroy: destroy };
  if (typeof module !== 'undefined' && module.exports) module.exports = CursorText;
  else root.CursorText = CursorText;
})(typeof window !== 'undefined' ? window : this);
