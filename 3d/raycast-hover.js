/* ============================================
   RAYCAST HOVER — Mouse-picking pattern: highlight the mesh under cursor
   Inspired by three.js raycaster examples
   ============================================
   Requires THREE + SceneRunner.

   Usage:
     RaycastHover.init('#container', {
       items: [
         { label: 'A', color: '#c084fc' },
         { label: 'B', color: '#38bdf8' },
         { label: 'C', color: '#f472b6' },
         { label: 'D', color: '#4ade80' },
         { label: 'E', color: '#fbbf24' }
       ],
       layout: 'circle',           // 'circle' | 'line' | 'grid'
       onHover:  function (item, mesh) { console.log('hover', item.label); },
       onSelect: function (item, mesh) { console.log('click', item.label); }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    items: [
      { label: '1', color: '#c084fc' },
      { label: '2', color: '#38bdf8' },
      { label: '3', color: '#f472b6' },
      { label: '4', color: '#4ade80' },
      { label: '5', color: '#fbbf24' }
    ],
    layout: 'circle',
    radius: 2.2,
    size: 0.7,
    onHover: null,
    onSelect: null,
    bobAmplitude: 0.1
  };

  function init(target, opts) {
    if (!root.THREE || !root.SceneRunner) {
      console.warn('[RaycastHover] Requires THREE + SceneRunner');
      return null;
    }
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var THREE = root.THREE;
    var meshes = [];
    var hoveredMesh = null;
    var mouseNDC = new THREE.Vector2(-2, -2);
    var raycaster = new THREE.Raycaster();

    var ctx = root.SceneRunner.create(target, {
      cameraPosition: [0, 1.6, 5],
      background: '#050510',
      onTick: function (c, t) {
        meshes.forEach(function (m, i) {
          var bob = Math.sin(t * 1.6 + i * 0.5) * o.bobAmplitude;
          m.position.y = m.userData.baseY + bob;
        });
        raycaster.setFromCamera(mouseNDC, ctx.camera);
        var hits = raycaster.intersectObjects(meshes, false);
        var hit = hits[0] && hits[0].object;
        if (hit !== hoveredMesh) {
          if (hoveredMesh) {
            hoveredMesh.scale.set(1, 1, 1);
            hoveredMesh.material.emissiveIntensity = 0.0;
          }
          hoveredMesh = hit || null;
          if (hoveredMesh) {
            hoveredMesh.scale.set(1.18, 1.18, 1.18);
            hoveredMesh.material.emissiveIntensity = 0.9;
            ctx.canvas.style.cursor = 'pointer';
            if (typeof o.onHover === 'function') o.onHover(hoveredMesh.userData.item, hoveredMesh);
          } else {
            ctx.canvas.style.cursor = '';
          }
        }
      }
    });
    if (!ctx) return null;

    ctx.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    var key = new THREE.DirectionalLight(0xffffff, 1);
    key.position.set(3, 4, 5);
    ctx.scene.add(key);

    var geom = new THREE.IcosahedronGeometry(o.size * 0.5, 1);

    o.items.forEach(function (it, i) {
      var mat = new THREE.MeshStandardMaterial({
        color: it.color,
        emissive: it.color,
        emissiveIntensity: 0.0,
        metalness: 0.2,
        roughness: 0.4
      });
      var m = new THREE.Mesh(geom, mat);
      var pos = placeFor(i, o.items.length);
      m.position.copy(pos);
      m.userData.baseY = pos.y;
      m.userData.item = it;
      meshes.push(m);
      ctx.scene.add(m);
    });

    function placeFor(i, n) {
      if (o.layout === 'line') {
        return new THREE.Vector3(((i - (n - 1) / 2) * o.size * 1.5), 0, 0);
      } else if (o.layout === 'grid') {
        var cols = Math.ceil(Math.sqrt(n));
        var c = i % cols;
        var r = Math.floor(i / cols);
        return new THREE.Vector3(
          (c - (cols - 1) / 2) * o.size * 1.4,
          0,
          (r - (cols - 1) / 2) * o.size * 1.4
        );
      } else {
        var a = (i / n) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * o.radius, 0, Math.sin(a) * o.radius);
      }
    }

    function onMove(e) {
      var r = ctx.container.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - r.left) / r.width)  * 2 - 1;
      mouseNDC.y = -((e.clientY - r.top)  / r.height) * 2 + 1;
    }
    function onLeave() {
      mouseNDC.x = -2; mouseNDC.y = -2;
    }
    function onClick() {
      if (hoveredMesh && typeof o.onSelect === 'function') {
        o.onSelect(hoveredMesh.userData.item, hoveredMesh);
      }
    }
    ctx.container.addEventListener('pointermove', onMove);
    ctx.container.addEventListener('pointerleave', onLeave);
    ctx.container.addEventListener('click', onClick);

    return {
      ctx: ctx,
      meshes: meshes,
      destroy: function () {
        ctx.container.removeEventListener('pointermove', onMove);
        ctx.container.removeEventListener('pointerleave', onLeave);
        ctx.container.removeEventListener('click', onClick);
        ctx.destroy();
      }
    };
  }

  var RaycastHover = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = RaycastHover;
  else root.RaycastHover = RaycastHover;
})(typeof window !== 'undefined' ? window : this);
