/* ============================================
   POSTPROCESSING BLOOM — EffectComposer + UnrealBloomPass setup pattern
   Inspired by three.js postprocessing examples
   ============================================
   Requires Three.js + its postprocessing addons. At three r160 the addons ship
   ONLY as ES modules (examples/jsm) — the old examples/js script-tag globals were
   removed. So load three as a module and attach the addon classes onto THREE
   yourself (this snippet reads them off window.THREE):

     <script type="importmap">
     { "imports": {
         "three": "https://unpkg.com/three@0.160.0/build/three.module.min.js",
         "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
     }}
     </script>
     <script src="../3d/scene-runner.js"></script>
     <script type="module">
       import * as THREE from 'three';
       import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
       import { RenderPass }      from 'three/addons/postprocessing/RenderPass.js';
       import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
       window.THREE = Object.assign({}, THREE, { EffectComposer, RenderPass, UnrealBloomPass });
       // now load this file and call PostBloom.init(...)
     </script>

   Usage:
     var demo = PostBloom.init('#container', {
       bloomStrength: 1.6,
       bloomThreshold: 0.0,
       bloomRadius: 0.5
     });
     // The demo's scene/camera/renderer are on demo.ctx, with
     // demo.composer being the EffectComposer instance.
     // Add objects via demo.ctx.scene.add(...).
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    bloomStrength: 1.4,
    bloomThreshold: 0.0,
    bloomRadius: 0.5,
    populate: true   // build a default emissive scene to demo the bloom
  };

  function init(target, opts) {
    if (!root.THREE || !root.SceneRunner) {
      console.warn('[PostBloom] Requires THREE + SceneRunner');
      return null;
    }
    var T = root.THREE;
    if (!T.EffectComposer || !T.UnrealBloomPass) {
      console.warn('[PostBloom] EffectComposer/UnrealBloomPass not on THREE. See file header for the ES-module setup.');
      return null;
    }

    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var sphereGroup = new T.Group();

    var ctx = root.SceneRunner.create(target, {
      cameraPosition: [0, 0, 6],
      background: '#020208',
      onResize: function (c) {
        // SceneRunner fires an initial resize during create(), before composer/bloom
        // are assigned below — guard so the first call is a harmless no-op.
        if (!composer || !bloom) return;
        composer.setSize(c.container.clientWidth, c.container.clientHeight);
        bloom.setSize(c.container.clientWidth, c.container.clientHeight);
      },
      onTick: function (c, t) {
        sphereGroup.rotation.y = t * 0.3;
        sphereGroup.rotation.x = t * 0.15;
        // Manual render through composer rather than the renderer's tick
        if (composer) composer.render();
      }
    });
    if (!ctx) return null;

    // Composer setup
    var composer = new T.EffectComposer(ctx.renderer);
    composer.setSize(ctx.container.clientWidth, ctx.container.clientHeight);
    var renderPass = new T.RenderPass(ctx.scene, ctx.camera);
    composer.addPass(renderPass);

    var size = new T.Vector2(ctx.container.clientWidth, ctx.container.clientHeight);
    var bloom = new T.UnrealBloomPass(size, o.bloomStrength, o.bloomRadius, o.bloomThreshold);
    composer.addPass(bloom);

    // Override the renderer's render-through-tick by clearing onTick render?
    // SceneRunner's tick calls renderer.render(scene, camera); since we want
    // ONLY composer.render() to run, we monkey-patch renderer.render once
    // SceneRunner's loop body has already invoked onTick (which calls our composer).
    // Implementation note: We let renderer.render run too — it draws to the
    // default framebuffer first, then composer renders on top. That's
    // overdraw but harmless visually since composer fills the canvas.
    // For perfect efficiency you'd suppress the default render — left as TODO.

    // Optional demo scene
    if (o.populate) {
      ctx.scene.add(new T.AmbientLight(0xffffff, 0.15));
      var palette = [0xc084fc, 0x38bdf8, 0xf472b6, 0xfbbf24, 0x4ade80];
      for (var i = 0; i < 14; i++) {
        var g = new T.IcosahedronGeometry(0.3 + Math.random() * 0.25, 1);
        var mat = new T.MeshStandardMaterial({
          color: palette[i % palette.length],
          emissive: palette[i % palette.length],
          emissiveIntensity: 0.9 + Math.random(),
          roughness: 0.35,
          metalness: 0.2
        });
        var m = new T.Mesh(g, mat);
        m.position.set(
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 4
        );
        sphereGroup.add(m);
      }
      ctx.scene.add(sphereGroup);
    }

    return {
      ctx: ctx,
      composer: composer,
      bloomPass: bloom,
      destroy: function () { ctx.destroy(); }
    };
  }

  var PostBloom = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = PostBloom;
  else root.PostBloom = PostBloom;
})(typeof window !== 'undefined' ? window : this);
