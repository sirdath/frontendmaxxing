/* ============================================
   FLOATING TEXT — 3D text mesh with hover tilt + bobbing
   Inspired by three.js TextGeometry examples
   ============================================
   Requires THREE + SceneRunner. For TextGeometry you also need:
     <script src="https://unpkg.com/three@0.160.0/examples/js/loaders/FontLoader.js"></script>
     <script src="https://unpkg.com/three@0.160.0/examples/js/geometries/TextGeometry.js"></script>

   FALLBACK: if TextGeometry isn't loaded, this snippet creates a stylized
   extruded BoxGeometry-based plate as a placeholder. The hover/bobbing
   behavior works either way.

   Usage:
     FloatingText.init('#container', {
       text: 'HELLO',
       fontUrl: 'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json',
       size: 1.2,
       depth: 0.25,
       color: '#ffffff',
       hoverTilt: 0.5,
       bobAmplitude: 0.12
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    text: 'HELLO',
    fontUrl: 'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json',
    size: 1.2,
    depth: 0.25,
    color: '#ffffff',
    metalness: 0.4,
    roughness: 0.35,
    hoverTilt: 0.6,
    bobAmplitude: 0.1,
    bobSpeed: 1.2
  };

  function init(target, opts) {
    if (!root.THREE || !root.SceneRunner) {
      console.warn('[FloatingText] Requires THREE + SceneRunner');
      return null;
    }
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var THREE = root.THREE;
    var targetTilt = { x: 0, y: 0 };
    var tilt = { x: 0, y: 0 };
    var textGroup = new THREE.Group();

    var ctx = root.SceneRunner.create(target, {
      cameraPosition: [0, 0, 5],
      background: null,
      transparent: true,
      onTick: function (c, t) {
        tilt.x += (targetTilt.x - tilt.x) * 0.08;
        tilt.y += (targetTilt.y - tilt.y) * 0.08;
        textGroup.rotation.x = tilt.x;
        textGroup.rotation.y = tilt.y;
        textGroup.position.y = Math.sin(t * o.bobSpeed) * o.bobAmplitude;
      }
    });
    if (!ctx) return null;

    // Lights
    var key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(2, 3, 4);
    ctx.scene.add(key);
    var fill = new THREE.AmbientLight(0x9988ff, 0.5);
    ctx.scene.add(fill);

    var mat = new THREE.MeshStandardMaterial({
      color: o.color,
      metalness: o.metalness,
      roughness: o.roughness
    });

    function makeMesh(geom) {
      geom.center();
      var mesh = new THREE.Mesh(geom, mat);
      textGroup.add(mesh);
    }

    var hasText = !!THREE.TextGeometry && !!THREE.FontLoader;
    if (hasText) {
      new THREE.FontLoader().load(o.fontUrl, function (font) {
        var g = new THREE.TextGeometry(o.text, {
          font: font, size: o.size, height: o.depth,
          curveSegments: 6, bevelEnabled: true,
          bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 3
        });
        makeMesh(g);
      });
    } else {
      // Fallback: extruded box plate
      var g = new THREE.BoxGeometry(o.text.length * o.size * 0.5, o.size, o.depth);
      makeMesh(g);
    }
    ctx.scene.add(textGroup);

    function onMove(e) {
      var r = ctx.container.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top)  / r.height;
      targetTilt.y = (px - 0.5) * 2 * o.hoverTilt;
      targetTilt.x = -(py - 0.5) * 2 * o.hoverTilt;
    }
    function onLeave() { targetTilt.x = 0; targetTilt.y = 0; }
    ctx.container.addEventListener('pointermove', onMove);
    ctx.container.addEventListener('pointerleave', onLeave);

    return {
      ctx: ctx,
      group: textGroup,
      destroy: function () {
        ctx.container.removeEventListener('pointermove', onMove);
        ctx.container.removeEventListener('pointerleave', onLeave);
        ctx.destroy();
      }
    };
  }

  var FloatingText = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = FloatingText;
  else root.FloatingText = FloatingText;
})(typeof window !== 'undefined' ? window : this);
