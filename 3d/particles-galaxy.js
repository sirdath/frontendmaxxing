/* ============================================
   PARTICLES GALAXY — Swirling spiral point cloud
   Inspired by three.js examples / Bruno Simon journey
   ============================================
   Requires:
     <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
     <script src="../3d/scene-runner.js"></script>

   Usage:
     ParticlesGalaxy.init('#container');
     ParticlesGalaxy.init('#container', {
       count: 30000,
       size: 0.02,
       radius: 5,
       branches: 4,
       spin: 1.2,
       randomness: 0.4,
       insideColor: '#ff6030',
       outsideColor: '#1b3984'
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    count: 30000,
    size: 0.018,
    radius: 5,
    branches: 4,
    spin: 1.2,
    randomness: 0.4,
    randomnessPower: 3,
    insideColor: '#ffd166',
    outsideColor: '#3a3aff',
    autoRotate: 0.06
  };

  function init(target, opts) {
    if (!root.THREE || !root.SceneRunner) {
      console.warn('[ParticlesGalaxy] Requires THREE + SceneRunner');
      return null;
    }
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var THREE = root.THREE;
    var ctx = root.SceneRunner.create(target, {
      cameraPosition: [3, 3, 3],
      background: '#050510',
      onTick: function (c, t) {
        points.rotation.y = t * o.autoRotate;
      }
    });
    if (!ctx) return null;

    var positions = new Float32Array(o.count * 3);
    var colors    = new Float32Array(o.count * 3);
    var inside = new THREE.Color(o.insideColor);
    var outside = new THREE.Color(o.outsideColor);

    for (var i = 0; i < o.count; i++) {
      var i3 = i * 3;
      var r = Math.random() * o.radius;
      var branchAngle = ((i % o.branches) / o.branches) * Math.PI * 2;
      var spinAngle = r * o.spin;

      var rx = Math.pow(Math.random(), o.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * o.randomness * r;
      var ry = Math.pow(Math.random(), o.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * o.randomness * r;
      var rz = Math.pow(Math.random(), o.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * o.randomness * r;

      positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * r + rx;
      positions[i3 + 1] = ry;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + rz;

      var mixed = inside.clone().lerp(outside, r / o.radius);
      colors[i3 + 0] = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }

    var geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    var mat = new THREE.PointsMaterial({
      size: o.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    var points = new THREE.Points(geom, mat);
    ctx.scene.add(points);

    return {
      ctx: ctx,
      points: points,
      destroy: function () { ctx.destroy(); }
    };
  }

  var ParticlesGalaxy = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ParticlesGalaxy;
  else root.ParticlesGalaxy = ParticlesGalaxy;
})(typeof window !== 'undefined' ? window : this);
