/* ============================================
   RIVE PLAYER — Vanilla CDN player for Rive (.riv) state-machine animations
   Wraps @rive-app/canvas (MIT runtime). No framework, no build.
   ============================================
   The vault's lottie-rive.skill.md is React-oriented; this is the plain-DOM
   drop-in. Lazy-loads the Rive WASM runtime from the CDN on first use (cached),
   no-ops gracefully if blocked. Drives a named state machine and maps hover/click
   to typed state-machine inputs; renders the idle frame under reduced-motion.

   CDN (auto-loaded): https://unpkg.com/@rive-app/canvas@2.38.1
   Note: the runtime is MIT/free; AUTHORING new .riv files needs a paid Rive editor seat.

   Usage:
     <canvas data-rive="hero.riv" data-rive-sm="Main"
             data-rive-hover="isHover" data-rive-click="onTap"></canvas>
     <script src="media/rive-player.js"></script>
     <script>RivePlayer.init('[data-rive]');</script>

   Inputs: data-rive-hover / data-rive-click name a boolean (toggled) or trigger
   (fired) input. Options: { src, stateMachine, hover, click, autoplay }
   ============================================ */
(function (root) {
  'use strict';

  var CDN = 'https://unpkg.com/@rive-app/canvas@2.38.1';
  var loadPromise = null;
  function loadCore() {
    if (loadPromise) return loadPromise;
    if (root.rive) return (loadPromise = Promise.resolve(root.rive));
    loadPromise = new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = CDN;
      s.async = true;
      s.onload = function () { resolve(root.rive || null); };
      s.onerror = function () { if (root.console) console.warn('[RivePlayer] could not load Rive runtime from CDN — animation skipped.\n  <script src="' + CDN + '"></script>'); resolve(null); };
      document.head.appendChild(s);
    });
    return loadPromise;
  }

  function reducedMotion() {
    return root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function create(canvas, opts) {
    var o = opts || {};
    var src = o.src || canvas.getAttribute('data-rive');
    if (!src) return null;
    var sm = o.stateMachine || canvas.getAttribute('data-rive-sm') || undefined;
    var hoverInput = o.hover || canvas.getAttribute('data-rive-hover');
    var clickInput = o.click || canvas.getAttribute('data-rive-click');
    var reduce = reducedMotion();
    var inst = { canvas: canvas, rive: null, destroy: function () {} };

    loadCore().then(function (rive) {
      if (!rive || !rive.Rive) return;
      var r = new rive.Rive({
        src: src,
        canvas: canvas,
        autoplay: o.autoplay != null ? o.autoplay : !reduce,
        stateMachines: sm,
        onLoad: function () {
          r.resizeDrawingSurfaceToCanvas();
          if (!sm) return;
          var inputs = r.stateMachineInputs(sm) || [];
          var byName = {};
          inputs.forEach(function (i) { byName[i.name] = i; });
          function drive(name, on) {
            var inp = byName[name]; if (!inp) return;
            if (typeof inp.fire === 'function' && inp.value === undefined) inp.fire();
            else inp.value = on;
          }
          if (hoverInput) {
            canvas.addEventListener('pointerenter', function () { drive(hoverInput, true); });
            canvas.addEventListener('pointerleave', function () { drive(hoverInput, false); });
          }
          if (clickInput) canvas.addEventListener('click', function () { drive(clickInput, true); });
        },
      });
      inst.rive = r;
      var onResize = function () { try { r.resizeDrawingSurfaceToCanvas(); } catch (e) {} };
      root.addEventListener('resize', onResize);
      inst.destroy = function () { root.removeEventListener('resize', onResize); try { r.cleanup(); } catch (e) {} };
    });
    return inst;
  }

  function init(target, opts) {
    var sel = target || '[data-rive]';
    var nodes = typeof sel === 'string' ? document.querySelectorAll(sel) : [sel];
    var arr = [];
    Array.prototype.forEach.call(nodes, function (n) { arr.push(create(n, opts)); });
    return arr;
  }

  var RivePlayer = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = RivePlayer;
  else root.RivePlayer = RivePlayer;
})(typeof window !== 'undefined' ? window : this);
