/* ============================================
   SHADER RUNNER — Tiny fullscreen-quad WebGL canvas that runs a fragment shader
   Inspired by Shadertoy / shader.se / The Book of Shaders patterns
   ============================================
   No Three.js required — pure WebGL2 (falls back to WebGL1).

   Usage:
     var fs = "precision highp float; ...";
     ShaderRunner.create('#container', {
       fragmentShader: fs,
       uniforms: { u_color: [1, 0, 1] },   // pre-declared as `uniform vec3 u_color;`
       imageUniforms: { u_tex: 'img.jpg' } // optional sampler2D inputs
     });

   Default uniforms provided automatically:
     uniform vec2  u_resolution;   // canvas px size
     uniform float u_time;         // seconds since init
     uniform vec2  u_mouse;        // (0..1, 0..1) from top-left
   ============================================ */
(function (root) {
  'use strict';

  var DEFAULT_VS =
    'attribute vec2 a_position;' +
    'varying vec2 v_uv;' +
    'void main() {' +
    '  v_uv = a_position * 0.5 + 0.5;' +
    '  gl_Position = vec4(a_position, 0.0, 1.0);' +
    '}';

  var DEFAULT_FS_PREFIX =
    'precision highp float;' +
    'varying vec2 v_uv;' +
    'uniform vec2  u_resolution;' +
    'uniform float u_time;' +
    'uniform vec2  u_mouse;\n';

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:\n' + gl.getShaderInfoLog(s) + '\n--- Source ---\n' + src);
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function program(gl, vsrc, fsrc) {
    var vs = compile(gl, gl.VERTEX_SHADER, vsrc);
    var fs = compile(gl, gl.FRAGMENT_SHADER, fsrc);
    if (!vs || !fs) return null;
    var p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error('Program link error: ' + gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }

  function create(target, opts) {
    opts = opts || {};
    var container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) return null;
    var canvas = container.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      container.appendChild(canvas);
    }
    var gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      console.warn('[ShaderRunner] WebGL not available');
      return null;
    }

    var fsrc = DEFAULT_FS_PREFIX +
      (opts.uniforms ? buildUniformDecls(opts.uniforms) : '') +
      (opts.imageUniforms ? buildSamplerDecls(opts.imageUniforms) : '') +
      '\n' + (opts.fragmentShader || 'void main() { gl_FragColor = vec4(v_uv, 0.5, 1.0); }');

    var prog = program(gl, DEFAULT_VS, fsrc);
    if (!prog) return null;
    gl.useProgram(prog);

    var posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var posLoc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    var uLocs = {};
    function uLoc(name) {
      if (uLocs[name] === undefined) uLocs[name] = gl.getUniformLocation(prog, name);
      return uLocs[name];
    }

    var uniformValues = Object.assign({}, opts.uniforms || {});
    var textures = {};
    var dpr = window.devicePixelRatio || 1;

    function resize() {
      var w = Math.max(1, Math.floor(container.clientWidth  * dpr));
      var h = Math.max(1, Math.floor(container.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
      }
      canvas.style.width  = container.clientWidth  + 'px';
      canvas.style.height = container.clientHeight + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    var mouse = [0, 0];
    function onMove(e) {
      var r = canvas.getBoundingClientRect();
      mouse[0] = (e.clientX - r.left) / r.width;
      mouse[1] = 1 - (e.clientY - r.top)  / r.height;
    }
    container.addEventListener('pointermove', onMove);

    // Load image uniforms
    if (opts.imageUniforms) {
      Object.keys(opts.imageUniforms).forEach(function (name, i) {
        loadTexture(opts.imageUniforms[name], function (tex) {
          textures[name] = { tex: tex, unit: i };
        });
      });
    }

    function loadTexture(src, done) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        done(tex);
      };
      img.src = src;
    }

    function setUniform(name, value) { uniformValues[name] = value; }

    var raf = null;
    var t0 = performance.now();

    function render() {
      resize();
      var t = (performance.now() - t0) / 1000;
      gl.uniform2f(uLoc('u_resolution'), canvas.width, canvas.height);
      gl.uniform1f(uLoc('u_time'), t);
      gl.uniform2f(uLoc('u_mouse'), mouse[0], mouse[1]);

      Object.keys(uniformValues).forEach(function (name) {
        var v = uniformValues[name];
        var loc = uLoc(name);
        if (loc == null) return;
        if (typeof v === 'number') gl.uniform1f(loc, v);
        else if (v.length === 2) gl.uniform2f(loc, v[0], v[1]);
        else if (v.length === 3) gl.uniform3f(loc, v[0], v[1], v[2]);
        else if (v.length === 4) gl.uniform4f(loc, v[0], v[1], v[2], v[3]);
      });

      Object.keys(textures).forEach(function (name) {
        var t = textures[name];
        gl.activeTexture(gl.TEXTURE0 + t.unit);
        gl.bindTexture(gl.TEXTURE_2D, t.tex);
        gl.uniform1i(uLoc(name), t.unit);
      });

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    }

    raf = requestAnimationFrame(render);

    function destroy() {
      if (raf) cancelAnimationFrame(raf);
      container.removeEventListener('pointermove', onMove);
      Object.keys(textures).forEach(function (n) { gl.deleteTexture(textures[n].tex); });
      gl.deleteBuffer(posBuf);
      gl.deleteProgram(prog);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }

    return {
      canvas: canvas,
      gl: gl,
      program: prog,
      setUniform: setUniform,
      destroy: destroy
    };
  }

  function buildUniformDecls(uniforms) {
    return Object.keys(uniforms).map(function (n) {
      var v = uniforms[n];
      if (typeof v === 'number') return 'uniform float ' + n + ';';
      if (v.length === 2) return 'uniform vec2  ' + n + ';';
      if (v.length === 3) return 'uniform vec3  ' + n + ';';
      if (v.length === 4) return 'uniform vec4  ' + n + ';';
      return '';
    }).join('\n') + '\n';
  }

  function buildSamplerDecls(images) {
    return Object.keys(images).map(function (n) {
      return 'uniform sampler2D ' + n + ';';
    }).join('\n') + '\n';
  }

  var ShaderRunner = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = ShaderRunner;
  else root.ShaderRunner = ShaderRunner;
})(typeof window !== 'undefined' ? window : this);
