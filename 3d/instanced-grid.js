/* ============================================
   INSTANCED GRID — Thousands of instances on a grid driven by a height function
   Inspired by three.js InstancedMesh examples / Bruno Simon scroll demos
   ============================================
   Requires THREE + SceneRunner.

   Usage:
     InstancedGrid.init('#container');
     InstancedGrid.init('#container', {
       cols: 40, rows: 40,
       spacing: 0.3,
       geometry: 'box',     // 'box' | 'sphere' | 'cylinder'
       size: 0.18,
       color1: '#c084fc',
       color2: '#38bdf8',
       waveSpeed: 1.5,
       waveAmp: 0.6,
       waveFreq: 0.5,
       autoRotate: 0.1
     });

   Hook to scroll: pass `scrollDriven: true` and it maps document scroll
   progress (0..1) onto wave phase via `--scroll-progress` body attribute.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    cols: 36,
    rows: 36,
    spacing: 0.32,
    geometry: 'box',
    size: 0.18,
    color1: '#c084fc',
    color2: '#38bdf8',
    waveSpeed: 1.4,
    waveAmp: 0.6,
    waveFreq: 0.55,
    autoRotate: 0.06,
    scrollDriven: false
  };

  function init(target, opts) {
    if (!root.THREE || !root.SceneRunner) {
      console.warn('[InstancedGrid] Requires THREE + SceneRunner');
      return null;
    }
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var THREE = root.THREE;

    var ctx = root.SceneRunner.create(target, {
      cameraPosition: [0, 6, 9],
      cameraTarget: [0, 0, 0],
      background: '#050510',
      onTick: function (c, t) {
        var scrollPhase = 0;
        if (o.scrollDriven) {
          var sp = parseFloat(document.documentElement.style.getPropertyValue('--scroll-progress') || '0');
          scrollPhase = sp * 4;
        }
        var phase = t * o.waveSpeed + scrollPhase;
        for (var x = 0; x < o.cols; x++) {
          for (var z = 0; z < o.rows; z++) {
            var i = x * o.rows + z;
            var px = (x - (o.cols - 1) / 2) * o.spacing;
            var pz = (z - (o.rows - 1) / 2) * o.spacing;
            var y = Math.sin(px * o.waveFreq + phase) * 0.5 + Math.cos(pz * o.waveFreq + phase * 0.8) * 0.5;
            y *= o.waveAmp;
            dummy.position.set(px, y, pz);
            dummy.scale.set(1, 1 + Math.abs(y) * 1.2, 1);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);

            var k = (y / o.waveAmp + 1) / 2;
            var mixed = colA.clone().lerp(colB, k);
            mesh.setColorAt(i, mixed);
          }
        }
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        mesh.rotation.y = t * o.autoRotate;
      }
    });
    if (!ctx) return null;

    var count = o.cols * o.rows;
    var g;
    if (o.geometry === 'sphere')   g = new THREE.SphereGeometry(o.size * 0.5, 12, 10);
    else if (o.geometry === 'cylinder') g = new THREE.CylinderGeometry(o.size * 0.5, o.size * 0.5, o.size, 12);
    else g = new THREE.BoxGeometry(o.size, o.size, o.size);

    var mat = new THREE.MeshStandardMaterial({ metalness: 0.2, roughness: 0.5 });
    var mesh = new THREE.InstancedMesh(g, mat, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = false;

    var colA = new THREE.Color(o.color1);
    var colB = new THREE.Color(o.color2);
    var dummy = new THREE.Object3D();

    // Lights
    var key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(5, 8, 4);
    ctx.scene.add(key);
    ctx.scene.add(new THREE.AmbientLight(0x8888ff, 0.5));

    ctx.scene.add(mesh);

    return {
      ctx: ctx,
      mesh: mesh,
      destroy: function () { ctx.destroy(); }
    };
  }

  var InstancedGrid = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = InstancedGrid;
  else root.InstancedGrid = InstancedGrid;
})(typeof window !== 'undefined' ? window : this);
