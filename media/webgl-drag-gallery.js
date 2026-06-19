/* ============================================
   WEBGL DRAG GALLERY — infinite, drag/scroll image strip that warps with velocity
   Inspired by Codrops infinite-WebGL-gallery demos · built on OGL (oframe/ogl, MIT)
   ============================================
   The signature "images bend/stretch as they fly past" gallery. Drag (or wheel)
   to fling the strip; it wraps infinitely and the planes bow + RGB-split by
   scroll speed. OGL (zero-dep, self-contained) auto-loads from CDN on first use
   (jsdelivr +esm). Degrades to a plain CSS scroll-snap strip if WebGL/OGL is
   unavailable; bowing is flattened under prefers-reduced-motion (scroll still works).

   Usage:
     DragGallery.init('#stage', {
       images: ['a.jpg', 'b.jpg', 'c.jpg', '…'],
       planeWidth: 7, planeHeight: 5, gap: 1.2, bend: 1, ease: 0.06
     });
     // returns { destroy }.
   ============================================ */
(function (root) {
  'use strict';

  var OGL_CDN = 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm';

  var VERT =
    'precision highp float;' +
    'attribute vec3 position; attribute vec2 uv;' +
    'uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix;' +
    'uniform float uSpeed; uniform float uBend;' +
    'varying vec2 vUv;' +
    'void main(){' +
    '  vUv = uv;' +
    '  vec3 p = position;' +
    '  p.z += sin((p.x + 0.5) * 3.14159265) * uSpeed * uBend * 5.0;' +   // bow by scroll velocity
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);' +
    '}';

  var FRAG =
    'precision highp float;' +
    'uniform sampler2D tMap; uniform vec2 uPlaneSizes; uniform vec2 uImageSizes; uniform float uSpeed;' +
    'varying vec2 vUv;' +
    'void main(){' +
    '  vec2 ratio = vec2(' +                                            // background-cover fit
    '    min((uPlaneSizes.x/uPlaneSizes.y)/(uImageSizes.x/uImageSizes.y), 1.0),' +
    '    min((uPlaneSizes.y/uPlaneSizes.x)/(uImageSizes.y/uImageSizes.x), 1.0));' +
    '  vec2 uv = vec2(vUv.x*ratio.x + (1.0-ratio.x)*0.5, vUv.y*ratio.y + (1.0-ratio.y)*0.5);' +
    '  float a = clamp(abs(uSpeed) * 0.5, 0.0, 0.03);' +                // RGB split scaled by speed
    '  vec3 col;' +
    '  col.r = texture2D(tMap, uv + vec2(a, 0.0)).r;' +
    '  col.g = texture2D(tMap, uv).g;' +
    '  col.b = texture2D(tMap, uv - vec2(a, 0.0)).b;' +
    '  gl_FragColor = vec4(col, 1.0);' +
    '}';

  var defaults = { images: [], planeWidth: 7, planeHeight: 5, gap: 1.2, bend: 1, ease: 0.06 };

  function hasWebGL() {
    try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
    catch (e) { return false; }
  }
  function loadOGL() {
    if (root.__ogl) return Promise.resolve(root.__ogl);
    return import(OGL_CDN).then(function (m) { root.__ogl = m; return m; });
  }

  function degrade(container, o) {
    var strip = document.createElement('div');
    strip.style.cssText = 'display:flex;gap:1rem;overflow-x:auto;scroll-snap-type:x mandatory;height:100%;align-items:center;-webkit-overflow-scrolling:touch;';
    (o.images || []).forEach(function (src) {
      var im = document.createElement('img');
      im.src = src;
      im.style.cssText = 'height:80%;border-radius:12px;scroll-snap-align:center;flex:0 0 auto;object-fit:cover;';
      strip.appendChild(im);
    });
    container.appendChild(strip);
    return { degraded: true, destroy: function () { if (strip.parentNode) strip.parentNode.removeChild(strip); } };
  }

  function init(target, opts) {
    var container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) return null;
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    if (!o.images || !o.images.length) { console.warn('[DragGallery] pass { images: [url, …] }'); return null; }

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasWebGL()) return degrade(container, o);

    var handle = { destroy: function () {} };
    loadOGL()
      .then(function (OGL) { build(OGL, container, o, reduce, handle); })
      .catch(function (e) {
        console.warn('[DragGallery] OGL unavailable — plain scroll fallback.', e && e.message);
        var d = degrade(container, o); handle.destroy = d.destroy;
      });
    return handle;
  }

  function build(OGL, container, o, reduce, handle) {
    var Renderer = OGL.Renderer, Camera = OGL.Camera, Transform = OGL.Transform,
        Plane = OGL.Plane, Mesh = OGL.Mesh, Program = OGL.Program, Texture = OGL.Texture;

    var renderer = new Renderer({ alpha: true, dpr: Math.min(2, window.devicePixelRatio || 1) });
    var gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.cssText = 'width:100%;height:100%;display:block;';
    container.appendChild(gl.canvas);

    var camera = new Camera(gl, { fov: 45 });
    camera.position.z = 12;
    var scene = new Transform();
    var geometry = new Plane(gl, { widthSegments: 24, heightSegments: 1 });

    var unit = o.planeWidth + o.gap;
    var total = unit * o.images.length;

    var medias = o.images.map(function (src, i) {
      var texture = new Texture(gl, { generateMipmaps: false });
      var program = new Program(gl, {
        vertex: VERT, fragment: FRAG, transparent: true,
        uniforms: {
          tMap: { value: texture },
          uPlaneSizes: { value: [o.planeWidth, o.planeHeight] },
          uImageSizes: { value: [1, 1] },
          uSpeed: { value: 0 }, uBend: { value: reduce ? 0 : o.bend }
        }
      });
      var img = new Image(); img.crossOrigin = 'anonymous';
      // needsUpdate is REQUIRED: the render loop already ran (consuming the
      // texture's initial upload) before this async image arrived, so without it
      // OGL never re-uploads and the plane stays blank.
      img.onload = function () { texture.image = img; texture.needsUpdate = true; program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]; };
      img.src = src;
      var mesh = new Mesh(gl, { geometry: geometry, program: program });
      mesh.scale.x = o.planeWidth; mesh.scale.y = o.planeHeight;
      mesh.setParent(scene);
      return { mesh: mesh, program: program, base: i * unit };
    });

    function resize() {
      var w = container.clientWidth, h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.perspective({ aspect: w / h });
    }

    var scroll = { current: 0, target: 0, last: 0 };
    var dragging = false, startX = 0, startScroll = 0;
    function px(e) { return e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX; }
    function onDown(e) { dragging = true; startX = px(e); startScroll = scroll.target; }
    function onMove(e) { if (dragging) scroll.target = startScroll - (px(e) - startX) * 0.03; }
    function onUp() { dragging = false; }
    function onWheel(e) { scroll.target += (e.deltaY || -e.wheelDelta || 0) * 0.003; }

    container.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    container.addEventListener('wheel', onWheel, { passive: true });
    var ro = (typeof ResizeObserver !== 'undefined') ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(container); else window.addEventListener('resize', resize);
    resize();

    var raf = null;
    function update() {
      scroll.current += (scroll.target - scroll.current) * o.ease;
      var speed = scroll.current - scroll.last;
      scroll.last = scroll.current;
      for (var i = 0; i < medias.length; i++) {
        var m = medias[i];
        var x = ((m.base - scroll.current) % total + total) % total;   // infinite wrap
        if (x > total / 2) x -= total;
        m.mesh.position.x = x;
        m.program.uniforms.uSpeed.value = speed;
      }
      renderer.render({ scene: scene, camera: camera });
      raf = requestAnimationFrame(update);
    }
    raf = requestAnimationFrame(update);

    handle.destroy = function () {
      if (raf) cancelAnimationFrame(raf);
      container.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      container.removeEventListener('wheel', onWheel);
      if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
      if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas);
    };
  }

  var DragGallery = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = DragGallery;
  else root.DragGallery = DragGallery;
})(typeof window !== 'undefined' ? window : this);
