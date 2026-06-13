/* ============================================
   HOVER PRO — cursor tracking for hover-pro.css effects
   Inspired by Linear card spotlight, holographic card tilt
   ============================================
   Drives the cursor-aware variants in hover-pro.css by writing CSS custom
   properties (--hvp-mx/--hvp-my for the light position, --hvp-rx/--hvp-ry for
   3D tilt). Pure-CSS variants (hvp-glow/border-run/liquid/depth/holo-sheen)
   need no JS.

   Usage:
     HoverPro.init('[data-hover]');                 // reads data-hover="spotlight|border|glare"
     HoverPro.init('.card', { effect: 'spotlight' });
     HoverPro.spotlight('.card');                   // shorthands
     HoverPro.glare('.card', { max: 12 });          // max tilt degrees

   Methods: init(sel, opts) · spotlight(sel, opts) · border(sel, opts) · glare(sel, opts)
   Each returns an array of instances; call instance.destroy() to detach.
   Respects prefers-reduced-motion (skips 3D tilt; light tracking stays).
   ============================================ */
(function (root) {
  'use strict';

  var REDUCED = typeof window !== 'undefined' && window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var defaults = { effect: 'spotlight', max: 10, glareSize: 240 };

  function bind(el, opts) {
    opts = Object.assign({}, defaults, opts || {});
    var effect = el.getAttribute('data-hover') || opts.effect;
    var raf = 0, rect = null;
    el.classList.add('hvp');
    var variantClass = effect === 'border' ? 'hvp-border-spotlight'
      : effect === 'glare' ? 'hvp-glare' : 'hvp-spotlight';
    if (!el.className.split(/\s+/).some(function (c) { return c.indexOf('hvp-') === 0 && c !== 'hvp'; })) {
      el.classList.add(variantClass);
    }
    if (opts.glareSize) el.style.setProperty('--hvp-size', opts.glareSize + 'px');

    function onEnter() { rect = el.getBoundingClientRect(); }
    function onMove(e) {
      if (!rect) rect = el.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;   // 0..1
      var py = (e.clientY - rect.top) / rect.height;   // 0..1
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        el.style.setProperty('--hvp-mx', (px * 100).toFixed(2) + '%');
        el.style.setProperty('--hvp-my', (py * 100).toFixed(2) + '%');
        if (effect === 'glare' && !REDUCED) {
          var max = opts.max;
          el.style.setProperty('--hvp-ry', ((px - 0.5) * 2 * max).toFixed(2) + 'deg');
          el.style.setProperty('--hvp-rx', ((0.5 - py) * 2 * max).toFixed(2) + 'deg');
        }
      });
    }
    function onLeave() {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      rect = null;
      el.style.setProperty('--hvp-mx', '50%');
      el.style.setProperty('--hvp-my', '50%');
      el.style.removeProperty('--hvp-rx');
      el.style.removeProperty('--hvp-ry');
    }

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return {
      el: el,
      destroy: function () {
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
        onLeave();
      }
    };
  }

  function init(target, opts) {
    var els = typeof target === 'string'
      ? Array.prototype.slice.call(document.querySelectorAll(target))
      : (target instanceof Element ? [target] : Array.prototype.slice.call(target || []));
    return els.map(function (el) { return bind(el, opts); });
  }

  function withEffect(name) {
    return function (target, opts) { return init(target, Object.assign({}, opts, { effect: name })); };
  }

  var HoverPro = {
    init: init,
    spotlight: withEffect('spotlight'),
    border: withEffect('border'),
    glare: withEffect('glare')
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = HoverPro;
  else root.HoverPro = HoverPro;
})(typeof window !== 'undefined' ? window : this);
