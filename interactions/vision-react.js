/* ============================================
   VISION REACT — drive CSS vars from the pointer, or (opt-in) the webcam
   Inspired by MediaPipe Tasks Vision (Google, Apache-2.0) — hand landmarks
   ============================================
   Writes normalized (0..1) `--vr-x` / `--vr-y` you style with in CSS. Works
   EVERYWHERE immediately via the pointer (no permission, no deps). Calling
   `.enableCamera()` — only from a user gesture — lazily loads MediaPipe (ESM,
   dynamic import) and switches to live hand tracking (index-fingertip). Anything
   missing (no camera, denied, reduced-motion) keeps the pointer fallback. The
   camera is NEVER started without an explicit call.

   Usage:
     var vr = VisionReact.init('#stage');           // pointer-driven now
     btn.addEventListener('click', function () { vr.enableCamera(); }); // opt-in cam
     // CSS:  .dot { left: calc(var(--vr-x) * 100%); top: calc(var(--vr-y) * 100%); }
     // returns { el, enableCamera, destroy }.
   ============================================ */
(function (root) {
  'use strict';

  var CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/vision_bundle.mjs';
  var WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm';
  var MODEL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

  var defaults = { varX: '--vr-x', varY: '--vr-y', lerp: 0.18 };

  function init(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var tx = 0.5, ty = 0.5, cx = 0.5, cy = 0.5;
    var raf = null, camRaf = null, mode = 'idle', landmarker = null, video = null, stream = null;

    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function loop() {
      cx += (tx - cx) * o.lerp; cy += (ty - cy) * o.lerp;
      el.style.setProperty(o.varX, cx.toFixed(4));
      el.style.setProperty(o.varY, cy.toFixed(4));
      raf = requestAnimationFrame(loop);
    }
    function onPointer(e) {
      var r = el.getBoundingClientRect();
      tx = clamp01((e.clientX - r.left) / r.width);
      ty = clamp01((e.clientY - r.top) / r.height);
    }
    function usePointer() { if (mode === 'pointer') return; mode = 'pointer'; el.addEventListener('pointermove', onPointer); }

    function detect() {
      if (mode !== 'camera' || !landmarker || !video) return;
      try {
        var res = landmarker.detectForVideo(video, performance.now());
        var hand = res && res.landmarks && res.landmarks[0];
        if (hand && hand[8]) { tx = clamp01(1 - hand[8].x); ty = clamp01(hand[8].y); }  // index tip, mirrored
      } catch (e) { /* transient frame error — keep last value */ }
      camRaf = requestAnimationFrame(detect);
    }

    function enableCamera() {
      if (reduce) { usePointer(); return Promise.resolve(false); }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { usePointer(); return Promise.resolve(false); }
      return import(CDN)
        .then(function (mp) {
          return mp.FilesetResolver.forVisionTasks(WASM).then(function (fileset) {
            return mp.HandLandmarker.createFromOptions(fileset, {
              baseOptions: { modelAssetPath: MODEL }, runningMode: 'VIDEO', numHands: 1
            });
          });
        })
        .then(function (lm) { landmarker = lm; return navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } }); })
        .then(function (s) {
          stream = s; video = document.createElement('video');
          video.srcObject = s; video.muted = true; video.playsInline = true;
          return video.play();
        })
        .then(function () {
          if (mode === 'pointer') el.removeEventListener('pointermove', onPointer);
          mode = 'camera'; detect(); return true;
        })
        .catch(function (err) { console.warn('[VisionReact] camera/vision unavailable — pointer fallback.', err && err.message); usePointer(); return false; });
    }

    if (!reduce) { usePointer(); raf = requestAnimationFrame(loop); }   // pointer is the default surface

    return {
      el: el,
      enableCamera: enableCamera,
      destroy: function () {
        if (raf) cancelAnimationFrame(raf);
        if (camRaf) cancelAnimationFrame(camRaf);
        el.removeEventListener('pointermove', onPointer);
        if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
        if (landmarker && landmarker.close) landmarker.close();
      }
    };
  }

  var VisionReact = { init: init, cdn: CDN };

  if (typeof module !== 'undefined' && module.exports) module.exports = VisionReact;
  else root.VisionReact = VisionReact;
})(typeof window !== 'undefined' ? window : this);
