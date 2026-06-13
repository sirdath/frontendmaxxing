/* ============================================
   HOVER FX — cursor tracking for hover-fx.css effects
   Inspired by magnetic buttons, parallax cards, ripple ink
   ============================================
   Drives the cursor-aware variants in hover-fx.css. The CSS-only variants
   (hfx-text-flow / hfx-ring / hfx-squash / hfx-slide-swap) need no JS.

   Usage:
     HoverFX.init('[data-hover-fx]');               // reads data-hover-fx="magnetic|ripple|parallax|reveal"
     HoverFX.magnetic('.btn', { strength: 0.4 });   // shorthands
     HoverFX.parallax('.card', { factor: 24 });
     HoverFX.ripple('.tile');
     HoverFX.reveal('.compare', { radius: 150 });

   Methods: init · magnetic · ripple · parallax · reveal — each returns
   instances with destroy(). Respects prefers-reduced-motion (skips magnetic /
   parallax / ripple movement; reveal stays).
   ============================================ */
(function (root) {
  'use strict';

  var REDUCED = typeof window !== 'undefined' && window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var defaults = { effect: 'magnetic', strength: 0.35, factor: 22, radius: 130 };

  function rectOf(el) { return el.getBoundingClientRect(); }

  function bind(el, opts) {
    opts = Object.assign({}, defaults, opts || {});
    var effect = el.getAttribute('data-hover-fx') || opts.effect;
    var raf = 0, rect = null;
    el.classList.add('hfx', 'hfx-' + effect);
    if (effect === 'reveal') el.style.setProperty('--hfx-reveal-r', opts.radius + 'px');

    function onEnter() { rect = rectOf(el); }
    function onMove(e) {
      if (!rect) rect = rectOf(el);
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        if (effect === 'magnetic') {
          if (REDUCED) return;
          el.style.setProperty('--hfx-tx', ((px - 0.5) * rect.width * opts.strength).toFixed(1) + 'px');
          el.style.setProperty('--hfx-ty', ((py - 0.5) * rect.height * opts.strength).toFixed(1) + 'px');
        } else if (effect === 'parallax') {
          if (REDUCED) return;
          var kids = el.querySelectorAll('[data-depth]');
          for (var i = 0; i < kids.length; i++) {
            var d = parseFloat(kids[i].getAttribute('data-depth')) || 0.3;
            kids[i].style.setProperty('--hfx-px', (-(px - 0.5) * opts.factor * d).toFixed(1) + 'px');
            kids[i].style.setProperty('--hfx-py', (-(py - 0.5) * opts.factor * d).toFixed(1) + 'px');
          }
        } else if (effect === 'reveal') {
          el.style.setProperty('--hfx-mx', (px * 100).toFixed(2) + '%');
          el.style.setProperty('--hfx-my', (py * 100).toFixed(2) + '%');
        }
      });
    }
    function spawnRipple(e) {
      if (REDUCED) return;
      var r = rectOf(el);
      var size = Math.max(r.width, r.height) * 1.1;
      var dot = document.createElement('span');
      dot.className = 'hfx-ripple-dot';
      dot.style.width = dot.style.height = size + 'px';
      dot.style.left = (e.clientX - r.left) + 'px';
      dot.style.top = (e.clientY - r.top) + 'px';
      el.appendChild(dot);
      dot.addEventListener('animationend', function () { if (dot.parentNode) dot.parentNode.removeChild(dot); });
    }
    function onLeave() {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      rect = null;
      if (effect === 'magnetic') { el.style.setProperty('--hfx-tx', '0px'); el.style.setProperty('--hfx-ty', '0px'); }
      else if (effect === 'parallax') {
        el.querySelectorAll('[data-depth]').forEach(function (k) { k.style.setProperty('--hfx-px', '0px'); k.style.setProperty('--hfx-py', '0px'); });
      }
    }

    el.addEventListener('pointerenter', onEnter);
    if (effect === 'ripple') { el.addEventListener('pointerdown', spawnRipple); el.addEventListener('pointerenter', spawnRipple); }
    else { el.addEventListener('pointermove', onMove); el.addEventListener('pointerleave', onLeave); }

    return {
      el: el,
      destroy: function () {
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointerdown', spawnRipple);
        el.removeEventListener('pointerenter', spawnRipple);
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

  var HoverFX = {
    init: init,
    magnetic: withEffect('magnetic'),
    ripple: withEffect('ripple'),
    parallax: withEffect('parallax'),
    reveal: withEffect('reveal')
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = HoverFX;
  else root.HoverFX = HoverFX;
})(typeof window !== 'undefined' ? window : this);
