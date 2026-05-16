/* ============================================
   WAVE PLANE — Vertex-displaced plane with flowing sin/cos noise
   Inspired by three.js examples / Awwwards portfolios
   ============================================
   Requires THREE + SceneRunner.

   Usage:
     WavePlane.init('#container');
     WavePlane.init('#container', {
       size: 12,
       segments: 80,
       amplitude: 0.4,
       speed: 0.6,
       color1: '#c084fc',
       color2: '#38bdf8',
       wireframe: false,
       autoRotate: 0.05
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    size: 12,
    segments: 80,
    amplitude: 0.4,
    speed: 0.6,
    color1: '#c084fc',
    color2: '#38bdf8',
    wireframe: false,
    autoRotate: 0.05
  };

  function init(target, opts) {
    if (!root.THREE || !root.SceneRunner) {
      console.warn('[WavePlane] Requires THREE + SceneRunner');
      return null;
    }
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var THREE = root.THREE;

    var ctx = root.SceneRunner.create(target, {
      cameraPosition: [0, 4, 6],
      background: '#050510',
      onTick: function (c, t) {
        updateWave(t);
        mesh.rotation.z = t * o.autoRotate;
      }
    });
    if (!ctx) return null;

    var geom = new THREE.PlaneGeometry(o.size, o.size, o.segments, o.segments);
    geom.rotateX(-Math.PI / 2);

    var positions = geom.attributes.position;
    var basePositions = positions.array.slice();
    var colors = new Float32Array(positions.count * 3);
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var c1 = new THREE.Color(o.color1);
    var c2 = new THREE.Color(o.color2);

    function updateWave(t) {
      var arr = positions.array;
      for (var i = 0; i < arr.length; i += 3) {
        var x = basePositions[i];
        var z = basePositions[i + 2];
        var y =
          Math.sin(x * 0.6 + t * o.speed) * 0.4 * o.amplitude +
          Math.cos(z * 0.5 + t * o.speed * 0.8) * 0.6 * o.amplitude +
          Math.sin((x + z) * 0.3 + t * o.speed * 1.3) * 0.3 * o.amplitude;
        arr[i + 1] = y;
        var k = (y + o.amplitude) / (2 * o.amplitude);
        var mixed = c1.clone().lerp(c2, k);
        colors[i + 0] = mixed.r;
        colors[i + 1] = mixed.g;
        colors[i + 2] = mixed.b;
      }
      positions.needsUpdate = true;
      geom.attributes.color.needsUpdate = true;
    }

    var mat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: o.wireframe,
      side: THREE.DoubleSide
    });

    var mesh = new THREE.Mesh(geom, mat);
    ctx.scene.add(mesh);

    return {
      ctx: ctx,
      mesh: mesh,
      destroy: function () { ctx.destroy(); }
    };
  }

  var WavePlane = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = WavePlane;
  else root.WavePlane = WavePlane;
})(typeof window !== 'undefined' ? window : this);
