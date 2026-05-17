/* ============================================
   3D SCENES PACK — 6 self-contained Three.js scenes
   Inspired by Cursor / Vercel / award-winning sites
   ============================================
   Each scene boots its own scene/camera/renderer into a target element.
   Requires three.js loaded globally (THREE):
     <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>

   Scenes (call ScenesPack.<name>(targetEl, opts)):
     shaderBall(host)        — Centered glossy sphere with rim light + gradient material
     gltfCards(host, items)  — 3D card stack you can drag-rotate
     ascii(host, text)       — Spinning torus knot rendered as ASCII grid
     hologram(host)          — Wireframe icosahedron + scanline overlay
     gradientCubeArray(host) — Grid of cubes with morphing gradient
     ribbonTrail(host)       — Continuous ribbon path that follows mouse / animates

   Each returns { destroy } to tear down.
   ============================================ */
(function (root) {
  'use strict';

  function bootScene(host, opts) {
    opts = opts || {};
    var rect = host.getBoundingClientRect();
    var w = rect.width || 600, h = rect.height || 400;
    var scene = new THREE.Scene();
    if (opts.bg) scene.background = new THREE.Color(opts.bg);
    var camera = new THREE.PerspectiveCamera(opts.fov || 45, w / h, 0.1, 1000);
    camera.position.set(0, 0, opts.z || 6);
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: !opts.bg });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(w, h);
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
    host.appendChild(renderer.domElement);

    var raf;
    function resize() {
      var r = host.getBoundingClientRect();
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      renderer.setSize(r.width, r.height);
    }
    window.addEventListener('resize', resize);

    function destroy() {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      scene.traverse(function (o) {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(function (m) { m.dispose(); });
          else o.material.dispose();
        }
      });
    }

    return { scene: scene, camera: camera, renderer: renderer, resize: resize,
      setRaf: function (id) { raf = id; }, destroy: destroy };
  }

  function shaderBall(host, opts) {
    if (!root.THREE) return null;
    opts = opts || {};
    var ctx = bootScene(host, { z: 4 });

    var geo = new THREE.SphereGeometry(1.2, 96, 96);
    var mat = new THREE.MeshStandardMaterial({
      color: opts.color || 0x8b5cf6,
      roughness: 0.18,
      metalness: 0.7
    });
    var mesh = new THREE.Mesh(geo, mat);
    ctx.scene.add(mesh);

    var key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(5, 5, 5);
    ctx.scene.add(key);
    var rim = new THREE.DirectionalLight(0xec4899, 0.9);
    rim.position.set(-5, -2, -4);
    ctx.scene.add(rim);
    var fill = new THREE.AmbientLight(0xffffff, 0.25);
    ctx.scene.add(fill);

    function loop() {
      mesh.rotation.x += 0.004;
      mesh.rotation.y += 0.006;
      ctx.renderer.render(ctx.scene, ctx.camera);
      ctx.setRaf(requestAnimationFrame(loop));
    }
    loop();
    return { destroy: ctx.destroy, mesh: mesh };
  }

  function gltfCards(host, opts) {
    if (!root.THREE) return null;
    opts = opts || {};
    var ctx = bootScene(host, { z: 5 });

    var items = opts.items || [
      { color: 0x8b5cf6 }, { color: 0xec4899 }, { color: 0x06b6d4 }, { color: 0xf59e0b }, { color: 0x10b981 }
    ];
    var group = new THREE.Group();
    items.forEach(function (it, i) {
      var card = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 2.4, 0.06),
        new THREE.MeshStandardMaterial({ color: it.color, roughness: 0.4 })
      );
      var ang = (i - (items.length - 1) / 2) * 0.22;
      card.position.x = Math.sin(ang) * 1.6;
      card.position.z = -Math.cos(ang) * 0.6;
      card.rotation.y = -ang;
      group.add(card);
    });
    ctx.scene.add(group);

    ctx.scene.add(new THREE.HemisphereLight(0xffffff, 0x222244, 1));
    var dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.set(2, 4, 5);
    ctx.scene.add(dl);

    var targetY = 0, curY = 0, dragging = false, startX = 0, startVal = 0;
    host.addEventListener('pointerdown', function (e) {
      dragging = true; startX = e.clientX; startVal = targetY;
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      targetY = startVal + (e.clientX - startX) * 0.005;
    });
    window.addEventListener('pointerup', function () { dragging = false; });

    function loop() {
      curY += (targetY - curY) * 0.06;
      group.rotation.y = curY;
      group.position.y = Math.sin(performance.now() * 0.001) * 0.05;
      ctx.renderer.render(ctx.scene, ctx.camera);
      ctx.setRaf(requestAnimationFrame(loop));
    }
    loop();
    return { destroy: ctx.destroy, group: group };
  }

  function ascii(host, opts) {
    if (!root.THREE) return null;
    opts = opts || {};
    var ctx = bootScene(host, { z: 4, bg: 0x0a0a14 });
    ctx.renderer.domElement.style.display = 'none';

    // Offscreen render then sample to ASCII grid
    var cols = opts.cols || 60;
    var rows = opts.rows || 32;
    var chars = opts.chars || ' .,:;ox%@#';
    var pre = document.createElement('pre');
    pre.style.cssText = 'margin:0;font-family:ui-monospace,monospace;font-size:10px;line-height:10px;color:#10b981;background:#0a0a14;letter-spacing:0;white-space:pre;padding:1rem;border-radius:8px;height:100%;display:grid;place-items:center;overflow:hidden';
    host.appendChild(pre);

    var off = document.createElement('canvas');
    off.width = cols; off.height = rows;
    var oct = off.getContext('2d', { willReadFrequently: true });

    var geo = new THREE.TorusKnotGeometry(0.9, 0.3, 100, 16);
    var mat = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geo, mat);
    ctx.scene.add(mesh);

    function loop() {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.013;
      ctx.renderer.setSize(cols * 2, rows * 2);
      ctx.renderer.render(ctx.scene, ctx.camera);
      oct.drawImage(ctx.renderer.domElement, 0, 0, cols, rows);
      var data = oct.getImageData(0, 0, cols, rows).data;
      var out = '';
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var i = (y * cols + x) * 4;
          var brightness = (data[i] + data[i + 1] + data[i + 2]) / 3 / 255;
          out += chars[Math.floor(brightness * (chars.length - 1))];
        }
        out += '\n';
      }
      pre.textContent = out;
      ctx.setRaf(requestAnimationFrame(loop));
    }
    loop();
    return { destroy: function () { pre.remove(); ctx.destroy(); } };
  }

  function hologram(host, opts) {
    if (!root.THREE) return null;
    opts = opts || {};
    var ctx = bootScene(host, { z: 4 });

    var geo = new THREE.IcosahedronGeometry(1.4, 1);
    var mat = new THREE.MeshBasicMaterial({
      color: opts.color || 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });
    var mesh = new THREE.Mesh(geo, mat);
    ctx.scene.add(mesh);

    // Scanline overlay via CSS gradient
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent 0,transparent 3px,rgba(6,182,212,0.06) 4px,transparent 5px),radial-gradient(ellipse at center,transparent 60%,rgba(0,0,0,0.5));';
    host.style.position = host.style.position || 'relative';
    host.appendChild(overlay);

    function loop() {
      mesh.rotation.x += 0.004;
      mesh.rotation.y += 0.008;
      mesh.position.y = Math.sin(performance.now() * 0.001) * 0.1;
      ctx.renderer.render(ctx.scene, ctx.camera);
      ctx.setRaf(requestAnimationFrame(loop));
    }
    loop();
    return { destroy: function () { overlay.remove(); ctx.destroy(); }, mesh: mesh };
  }

  function gradientCubeArray(host, opts) {
    if (!root.THREE) return null;
    opts = opts || {};
    var ctx = bootScene(host, { z: 9 });

    var rows = opts.rows || 8, cols = opts.cols || 8;
    var group = new THREE.Group();
    var cubes = [];
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var c = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.4, 0.4),
          new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4 })
        );
        c.position.set(x - cols / 2 + 0.5, y - rows / 2 + 0.5, 0);
        cubes.push(c);
        group.add(c);
      }
    }
    ctx.scene.add(group);

    ctx.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    var d = new THREE.DirectionalLight(0xffffff, 0.9); d.position.set(3, 5, 4); ctx.scene.add(d);

    function loop() {
      var t = performance.now() * 0.001;
      cubes.forEach(function (c, i) {
        var x = i % cols, y = Math.floor(i / cols);
        var wave = Math.sin(t * 1.4 + (x + y) * 0.4);
        c.position.z = wave * 0.7;
        c.scale.setScalar(0.7 + wave * 0.2);
        var hue = (t * 30 + (x + y) * 10) % 360;
        c.material.color.setHSL(hue / 360, 0.7, 0.55);
      });
      group.rotation.x = -0.5;
      group.rotation.y = t * 0.2;
      ctx.renderer.render(ctx.scene, ctx.camera);
      ctx.setRaf(requestAnimationFrame(loop));
    }
    loop();
    return { destroy: ctx.destroy };
  }

  function ribbonTrail(host, opts) {
    if (!root.THREE) return null;
    opts = opts || {};
    var ctx = bootScene(host, { z: 4 });

    var N = opts.points || 240;
    var points = [];
    for (var i = 0; i < N; i++) points.push(new THREE.Vector3(0, 0, 0));

    var curve = new THREE.CatmullRomCurve3(points);
    var geo = new THREE.TubeGeometry(curve, N - 1, 0.06, 8, false);
    var mat = new THREE.MeshBasicMaterial({ color: opts.color || 0xec4899, transparent: true, opacity: 0.92 });
    var mesh = new THREE.Mesh(geo, mat);
    ctx.scene.add(mesh);

    var t = 0;
    function loop() {
      t += 0.02;
      for (var i = 0; i < N; i++) {
        var u = i / N * Math.PI * 4;
        points[i].set(
          Math.cos(u + t) * (1.5 + Math.sin(t * 0.6 + i * 0.05) * 0.5),
          Math.sin(u + t) * 1.2,
          Math.sin(u * 0.5 + t) * 0.8
        );
      }
      curve.points = points;
      mesh.geometry.dispose();
      mesh.geometry = new THREE.TubeGeometry(curve, N - 1, 0.06, 8, false);
      mesh.rotation.y += 0.005;
      ctx.renderer.render(ctx.scene, ctx.camera);
      ctx.setRaf(requestAnimationFrame(loop));
    }
    loop();
    return { destroy: ctx.destroy };
  }

  var ScenesPack = {
    shaderBall: shaderBall,
    gltfCards: gltfCards,
    ascii: ascii,
    hologram: hologram,
    gradientCubeArray: gradientCubeArray,
    ribbonTrail: ribbonTrail
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = ScenesPack;
  else root.ScenesPack = ScenesPack;
})(typeof window !== 'undefined' ? window : this);
