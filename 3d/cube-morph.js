/* ============================================
   CUBE MORPH — Animated morph between box, sphere, torus
   Inspired by three.js morph-targets examples
   ============================================
   Requires THREE + SceneRunner.

   Usage:
     CubeMorph.init('#container');
     CubeMorph.init('#container', {
       segments: 64,
       morphSpeed: 0.4,        // cycles through targets at this rate
       color: '#c084fc',
       wireframe: false
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    segments: 64,
    morphSpeed: 0.35,
    color: '#c084fc',
    wireframe: false,
    autoRotate: 0.3
  };

  function init(target, opts) {
    if (!root.THREE || !root.SceneRunner) {
      console.warn('[CubeMorph] Requires THREE + SceneRunner');
      return null;
    }
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var THREE = root.THREE;

    // Build base geometry as a unit sphere with N vertices.
    // Then for each "target" (cube, sphere, torus) compute the same-count
    // position list. We morph by lerping in shader-free vertex updates.
    var seg = o.segments;
    var baseGeom = new THREE.SphereGeometry(1, seg, seg);
    var n = baseGeom.attributes.position.count;
    var base = baseGeom.attributes.position.array.slice();

    var sphereVerts = new Float32Array(base.length);
    sphereVerts.set(base);

    var cubeVerts = new Float32Array(base.length);
    var torusVerts = new Float32Array(base.length);
    for (var i = 0; i < n; i++) {
      var x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
      // Cube: project a unit sphere to a cube (max abs axis)
      var inv = Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) || 1;
      cubeVerts[i * 3 + 0] = x / inv;
      cubeVerts[i * 3 + 1] = y / inv;
      cubeVerts[i * 3 + 2] = z / inv;
      // Torus: convert sphere position to torus surface using its UV-like angles
      var lon = Math.atan2(z, x);
      var lat = Math.asin(y);
      var R = 0.75, r = 0.35;
      var cx = (R + r * Math.cos(lat * 2)) * Math.cos(lon);
      var cy = r * Math.sin(lat * 2);
      var cz = (R + r * Math.cos(lat * 2)) * Math.sin(lon);
      torusVerts[i * 3 + 0] = cx;
      torusVerts[i * 3 + 1] = cy;
      torusVerts[i * 3 + 2] = cz;
    }

    var positions = baseGeom.attributes.position;
    var mat = new THREE.MeshStandardMaterial({
      color: o.color,
      metalness: 0.4,
      roughness: 0.35,
      wireframe: o.wireframe,
      flatShading: false
    });
    var mesh = new THREE.Mesh(baseGeom, mat);

    var ctx = root.SceneRunner.create(target, {
      cameraPosition: [0, 1.5, 4],
      background: '#050510',
      onTick: function (c, t) {
        var phase = (t * o.morphSpeed) % 3;
        var t01, a, b;
        if (phase < 1) {
          t01 = ease(phase);          a = sphereVerts; b = cubeVerts;
        } else if (phase < 2) {
          t01 = ease(phase - 1);      a = cubeVerts;   b = torusVerts;
        } else {
          t01 = ease(phase - 2);      a = torusVerts;  b = sphereVerts;
        }
        var arr = positions.array;
        for (var i = 0; i < arr.length; i++) {
          arr[i] = a[i] + (b[i] - a[i]) * t01;
        }
        positions.needsUpdate = true;
        baseGeom.computeVertexNormals();
        mesh.rotation.y = t * o.autoRotate;
        mesh.rotation.x = t * o.autoRotate * 0.4;
      }
    });
    if (!ctx) return null;

    function ease(x) {
      return x < 0.5
        ? 4 * x * x * x
        : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    var key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 4, 3);
    ctx.scene.add(key);
    ctx.scene.add(new THREE.AmbientLight(0x9988ff, 0.5));
    ctx.scene.add(mesh);

    return { ctx: ctx, mesh: mesh, destroy: function () { ctx.destroy(); } };
  }

  var CubeMorph = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = CubeMorph;
  else root.CubeMorph = CubeMorph;
})(typeof window !== 'undefined' ? window : this);
