/* ============================================
   LOTTIE PLAYER — Vanilla CDN player for Lottie / dotLottie animations
   Wraps @lottiefiles/dotlottie-web (MIT). No framework, no build.
   ============================================
   The vault's lottie-rive.skill.md is React-oriented; this is the plain-DOM
   drop-in. Lazy-loads the dotLottie ESM core from the CDN on first use (cached),
   no-ops gracefully if offline/blocked. Supports load / scroll-seek / hover
   triggers and a reduced-motion static fallback.

   CDN (auto-loaded): https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.74.0/+esm

   Usage:
     <canvas data-lottie="hero.lottie" data-lottie-trigger="scroll"></canvas>
     <script src="media/lottie-player.js"></script>
     <script>LottiePlayer.init('[data-lottie]');</script>

   Triggers (data-lottie-trigger): load (default, autoplay) · scroll (frame-seek to
   scroll progress) · hover (play on pointerenter). Options: { src, trigger, loop, speed }
   ============================================ */
(function (root) {
  'use strict';

  var CDN = 'https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.74.0/+esm';
  var modPromise = null;
  function loadCore() {
    if (modPromise) return modPromise;
    // dynamic ESM import works from a classic script in modern browsers
    modPromise = import(CDN).catch(function (e) {
      if (root.console) console.warn('[LottiePlayer] could not load dotLottie from CDN — animation skipped.\n  <script type="module" src="' + CDN + '"></script>', e);
      return null;
    });
    return modPromise;
  }

  function reducedMotion() {
    return root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function create(canvas, opts) {
    var o = opts || {};
    var src = o.src || canvas.getAttribute('data-lottie');
    if (!src) return null;
    var trigger = o.trigger || canvas.getAttribute('data-lottie-trigger') || 'load';
    var loop = o.loop != null ? o.loop : (canvas.getAttribute('data-lottie-loop') !== 'false');
    var reduce = reducedMotion();
    var inst = { canvas: canvas, dl: null, destroy: function () {} };

    loadCore().then(function (mod) {
      if (!mod || !mod.DotLottie) return;
      var autoplay = trigger === 'load' && !reduce;
      var dl = new mod.DotLottie({
        canvas: canvas,
        src: src,
        autoplay: autoplay,
        loop: trigger === 'scroll' ? false : loop,
        speed: o.speed || 1,
        renderConfig: { autoResize: true, devicePixelRatio: root.devicePixelRatio || 1 },
      });
      inst.dl = dl;

      if (trigger === 'scroll') {
        var total = 0;
        dl.addEventListener('load', function () { total = dl.totalFrames; seek(); });
        var raf = null;
        function progress() {
          var r = canvas.getBoundingClientRect(), vh = root.innerHeight || 1;
          return Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
        }
        function seek() { if (total) dl.setFrame(progress() * (total - 1)); }
        function onScroll() { if (raf) return; raf = requestAnimationFrame(function () { raf = null; seek(); }); }
        if (!reduce) root.addEventListener('scroll', onScroll, { passive: true });
        inst.destroy = function () { root.removeEventListener('scroll', onScroll); dl.destroy(); };
      } else if (trigger === 'hover') {
        var host = canvas.closest('[data-lottie]') || canvas;
        var onEnter = function () { if (!reduce) dl.play(); };
        var onLeave = function () { dl.pause(); };
        host.addEventListener('pointerenter', onEnter);
        host.addEventListener('pointerleave', onLeave);
        inst.destroy = function () { host.removeEventListener('pointerenter', onEnter); host.removeEventListener('pointerleave', onLeave); dl.destroy(); };
      } else {
        if (reduce) dl.addEventListener('load', function () { dl.setFrame(0); }); // static poster frame
        inst.destroy = function () { dl.destroy(); };
      }
    });
    return inst;
  }

  function init(target, opts) {
    var sel = target || '[data-lottie]';
    var nodes = typeof sel === 'string' ? document.querySelectorAll(sel) : [sel];
    var arr = [];
    Array.prototype.forEach.call(nodes, function (n) { var c = n.tagName === 'CANVAS' ? n : (n.querySelector('canvas') || n.appendChild(document.createElement('canvas'))); if (n !== c && n.getAttribute('data-lottie') && !c.getAttribute('data-lottie')) c.setAttribute('data-lottie', n.getAttribute('data-lottie')); arr.push(create(c, opts)); });
    return arr;
  }

  var LottiePlayer = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = LottiePlayer;
  else root.LottiePlayer = LottiePlayer;
})(typeof window !== 'undefined' ? window : this);
