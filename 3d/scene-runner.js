/* ============================================
   SCENE RUNNER — Tiny three.js bootstrap helper
   Inspired by three.js examples / pmndrs/drei conventions
   ============================================
   Requires Three.js loaded globally (window.THREE), e.g.:
     <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>

   Usage:
     var ctx = SceneRunner.create('#container', {
       cameraFov: 50,
       cameraPosition: [0, 0, 5],
       background: '#050510',
       transparent: false,
       antialias: true,
       onResize: function (ctx) { … },
       onTick:   function (ctx, t, dt) { … }
     });
     // ctx exposes { scene, camera, renderer, canvas, clock, destroy() }
     // You add objects via ctx.scene.add(mesh).
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    cameraFov: 50,
    cameraPosition: [0, 0, 5],
    cameraTarget: [0, 0, 0],
    background: '#050510',
    transparent: false,
    antialias: true,
    pixelRatioMax: 2,
    onResize: null,
    onTick: null
  };

  function need() {
    if (!root.THREE) {
      console.warn('[SceneRunner] window.THREE is not loaded. Add: <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>');
      return false;
    }
    return true;
  }

  function create(target, opts) {
    if (!need()) return null;
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) return null;

    var THREE = root.THREE;

    var scene = new THREE.Scene();
    if (!o.transparent && o.background) {
      scene.background = new THREE.Color(o.background);
    }

    var camera = new THREE.PerspectiveCamera(
      o.cameraFov,
      container.clientWidth / container.clientHeight || 1,
      0.1, 1000
    );
    camera.position.set(o.cameraPosition[0], o.cameraPosition[1], o.cameraPosition[2]);
    camera.lookAt(new THREE.Vector3(o.cameraTarget[0], o.cameraTarget[1], o.cameraTarget[2]));

    var renderer = new THREE.WebGLRenderer({
      antialias: o.antialias,
      alpha: o.transparent
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, o.pixelRatioMax));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    var canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    var clock = new THREE.Clock();

    var ctx = {
      scene: scene,
      camera: camera,
      renderer: renderer,
      canvas: canvas,
      container: container,
      clock: clock,
      destroy: destroy
    };

    function resize() {
      var w = container.clientWidth;
      var h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (typeof o.onResize === 'function') o.onResize(ctx);
    }

    var raf = null;
    var running = true;

    function tick() {
      if (!running) return;
      var dt = clock.getDelta();
      var t  = clock.elapsedTime;
      if (typeof o.onTick === 'function') o.onTick(ctx, t, dt);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }

    var resizeObs = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObs = new ResizeObserver(resize);
      resizeObs.observe(container);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();
    raf = requestAnimationFrame(tick);

    function destroy() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      if (resizeObs) resizeObs.disconnect();
      else window.removeEventListener('resize', resize);
      // Dispose scene objects shallowly
      scene.traverse(function (n) {
        if (n.geometry && typeof n.geometry.dispose === 'function') n.geometry.dispose();
        if (n.material) {
          if (Array.isArray(n.material)) n.material.forEach(function (m) { m.dispose && m.dispose(); });
          else n.material.dispose && n.material.dispose();
        }
      });
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }

    return ctx;
  }

  var SceneRunner = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = SceneRunner;
  else root.SceneRunner = SceneRunner;
})(typeof window !== 'undefined' ? window : this);
