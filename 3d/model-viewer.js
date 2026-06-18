/* ============================================
   MODEL VIEWER — declarative 3D: orbitable glTF/GLB with one element (+ AR)
   Inspired by Google <model-viewer> (@google/model-viewer, Apache-2.0)
   ============================================
   The fast, no-shader-code 3D-showcase primitive: lazy-loads the model-viewer
   web component from CDN behind a guard (warns the exact <script> line), then
   mounts a <model-viewer> with tasteful defaults. Degrades to the poster image
   if the module or WebGL is unavailable. Auto-rotate is disabled under
   prefers-reduced-motion. AR (ar / ios-src USDZ) is opt-in.
     <script type="module" src="https://cdn.jsdelivr.net/npm/@google/model-viewer@4.0.0/dist/model-viewer.min.js"></script>

   Usage:
     ModelViewer.init('#stage', {
       src: 'chair.glb',
       poster: 'chair.jpg',     // shown while loading / on failure
       alt: 'A walnut lounge chair',
       autoRotate: true,
       ar: false,               // true → one-tap AR (needs iosSrc USDZ on iOS)
       exposure: 1, shadow: 1, environment: 'neutral'
     });
   ============================================ */
(function (root) {
  'use strict';

  var CDN = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.0.0/dist/model-viewer.min.js';

  var defaults = {
    src: '', poster: '', alt: '3D model',
    autoRotate: true, ar: false, iosSrc: '',
    cameraControls: true, exposure: 1, shadow: 1, environment: 'neutral'
  };

  function ensureModule(cb) {
    if (typeof customElements === 'undefined') { cb(false); return; }
    if (customElements.get('model-viewer')) { cb(true); return; }
    if (!document.querySelector('script[data-model-viewer]')) {
      console.warn('[ModelViewer] loading the model-viewer web component. Add to your page: <script type="module" src="' + CDN + '"></script>');
      var s = document.createElement('script');
      s.type = 'module';
      s.src = CDN;
      s.setAttribute('data-model-viewer', '');
      document.head.appendChild(s);
    }
    customElements.whenDefined('model-viewer').then(function () { cb(true); }, function () { cb(false); });
  }

  function init(target, opts) {
    var container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) return null;
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var el = document.createElement('model-viewer');
    el.setAttribute('src', o.src);
    if (o.poster) el.setAttribute('poster', o.poster);
    el.setAttribute('alt', o.alt);
    if (o.cameraControls) el.setAttribute('camera-controls', '');
    if (o.autoRotate && !reduce) el.setAttribute('auto-rotate', '');   // motion gated
    el.setAttribute('shadow-intensity', String(o.shadow));
    el.setAttribute('exposure', String(o.exposure));
    if (o.environment) el.setAttribute('environment-image', o.environment);
    if (o.ar) {
      el.setAttribute('ar', '');
      el.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
      if (o.iosSrc) el.setAttribute('ios-src', o.iosSrc);
    }
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.display = 'block';

    // Poster fallback that survives a missing module: a plain <img> shows through
    // until/unless the component upgrades and paints over it.
    if (o.poster) {
      var img = document.createElement('img');
      img.setAttribute('slot', 'poster');
      img.src = o.poster;
      img.alt = o.alt;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      el.appendChild(img);
    }

    container.appendChild(el);
    ensureModule(function (ok) {
      if (!ok) console.warn('[ModelViewer] web component unavailable — showing poster fallback.');
    });

    return {
      el: el,
      destroy: function () { if (el.parentNode) el.parentNode.removeChild(el); }
    };
  }

  var ModelViewer = { init: init, cdn: CDN };

  if (typeof module !== 'undefined' && module.exports) module.exports = ModelViewer;
  else root.ModelViewer = ModelViewer;
})(typeof window !== 'undefined' ? window : this);
