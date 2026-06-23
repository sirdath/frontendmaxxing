/* ============================================
   PING-PONG — multi-pass GPU compute (FBO swap) — the primitive ShaderRunner lacks
   Inspired by Gray-Scott reaction-diffusion (nullprogram CC0 / tdhooper MIT)
   ============================================
   No deps. Pure WebGL2. ShaderRunner is single-pass-to-screen; this runs a sim
   shader that reads the PREVIOUS frame's state from a float texture and writes
   the next state to another, swapping each step — the substrate for reaction-
   diffusion, fluid, bloom/tonemap chains, LUT grade, slime-mold. Guards
   EXT_color_buffer_float and DEGRADES to RGBA8 when float render targets are
   absent. Default preset = Gray-Scott reaction-diffusion (organic Turing
   patterns), auto-themed from the container's `--accent` token.

   Usage:
     // out of the box — reaction-diffusion themed from --accent:
     PingPong.init('#stage', { feed: 0.055, kill: 0.062, steps: 8, scale: 0.5 });
     // or a custom multi-pass effect:
     PingPong.init('#stage', { simShader: FS, displayShader: DS, seedShader: SEED,
                               uniforms: { u_foo: 1 }, steps: 1 });
     // returns { canvas, gl, setUniform, reseed, destroy }.
   ============================================ */
(function (root) {
  'use strict';

  var QUAD_VS =
    '#version 300 es\n' +
    'in vec2 a_position; out vec2 v_uv;\n' +
    'void main(){ v_uv = a_position * 0.5 + 0.5; gl_Position = vec4(a_position, 0.0, 1.0); }';

  // ---- Gray-Scott reaction-diffusion preset (canonical multi-pass effect) ----
  var GS_SIM =
    '#version 300 es\nprecision highp float;\n' +
    'uniform sampler2D u_prev; uniform vec2 u_res;\n' +
    'uniform float u_feed, u_kill, u_da, u_db, u_dt;\n' +
    'in vec2 v_uv; out vec4 fragColor;\n' +
    'vec2 st(vec2 uv){ return texture(u_prev, uv).rg; }\n' +
    'void main(){\n' +
    '  vec2 px = 1.0 / u_res; vec2 c = st(v_uv);\n' +
    '  vec2 lap = c * -1.0;\n' +
    '  lap += st(v_uv + vec2(-px.x,0.0))*0.2 + st(v_uv + vec2(px.x,0.0))*0.2;\n' +
    '  lap += st(v_uv + vec2(0.0,-px.y))*0.2 + st(v_uv + vec2(0.0,px.y))*0.2;\n' +
    '  lap += st(v_uv + vec2(-px.x,-px.y))*0.05 + st(v_uv + vec2(px.x,-px.y))*0.05;\n' +
    '  lap += st(v_uv + vec2(-px.x,px.y))*0.05 + st(v_uv + vec2(px.x,px.y))*0.05;\n' +
    '  float A = c.r, B = c.g, reaction = A*B*B;\n' +
    '  float dA = u_da*lap.r - reaction + u_feed*(1.0 - A);\n' +
    '  float dB = u_db*lap.g + reaction - (u_kill + u_feed)*B;\n' +
    '  fragColor = vec4(clamp(c + vec2(dA, dB)*u_dt, 0.0, 1.0), 0.0, 1.0);\n' +
    '}';
  var GS_DISPLAY =
    '#version 300 es\nprecision highp float;\n' +
    'uniform sampler2D u_state; uniform vec3 u_c1, u_c2;\n' +
    'in vec2 v_uv; out vec4 fragColor;\n' +
    'void main(){\n' +
    '  float b = texture(u_state, v_uv).g;\n' +
    '  float v = smoothstep(0.18, 0.42, b);\n' +
    '  fragColor = vec4(mix(u_c1, u_c2, v), 1.0);\n' +
    '}';
  var GS_SEED =
    '#version 300 es\nprecision highp float;\n' +
    'uniform vec2 u_res; uniform float u_seed;\n' +
    'in vec2 v_uv; out vec4 fragColor;\n' +
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\n' +
    'void main(){\n' +
    '  float B = 0.0; vec2 d = v_uv - 0.5;\n' +
    '  if (abs(d.x) < 0.05 && abs(d.y) < 0.05) B = 1.0;\n' +
    '  if (hash(floor(v_uv * 48.0) + u_seed) > 0.984) B = 1.0;\n' +
    '  fragColor = vec4(1.0, B, 0.0, 1.0);\n' +
    '}';

  function compile(gl, type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error('[PingPong] shader: ' + gl.getShaderInfoLog(s)); gl.deleteShader(s); return null; }
    return s;
  }
  function program(gl, fs) {
    var v = compile(gl, gl.VERTEX_SHADER, QUAD_VS), f = compile(gl, gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    var p = gl.createProgram(); gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.error('[PingPong] link: ' + gl.getProgramInfoLog(p)); return null; }
    return p;
  }
  function parseColor(str, fallback) {
    if (!str) return fallback;
    try { var d = document.createElement('div'); d.style.color = String(str).trim(); document.body.appendChild(d);
      var c = getComputedStyle(d).color; document.body.removeChild(d);
      var m = c.match(/[\d.]+/g); return m && m.length >= 3 ? [m[0] / 255, m[1] / 255, m[2] / 255] : fallback;
    } catch (e) { return fallback; }
  }

  var defaults = { feed: 0.055, kill: 0.062, da: 1.0, db: 0.5, dt: 1.0, steps: 8, scale: 0.5, seed: 1 };

  function init(target, opts) {
    var container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) return null;
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%;';
    container.appendChild(canvas);
    var gl = canvas.getContext('webgl2', { antialias: false });
    if (!gl) { console.warn('[PingPong] WebGL2 required — degrading to nothing.'); canvas.remove(); return null; }

    // float render targets if available, else 8-bit (RD still runs, just coarser)
    var floatExt = gl.getExtension('EXT_color_buffer_float');
    var internalFmt = floatExt ? gl.RGBA16F : gl.RGBA8;
    var texType = floatExt ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;

    var dpr = Math.min(1.75, window.devicePixelRatio || 1);
    var dispW = Math.max(2, Math.floor(container.clientWidth * dpr));
    var dispH = Math.max(2, Math.floor(container.clientHeight * dpr));
    var simW = Math.max(2, Math.floor(dispW * o.scale));
    var simH = Math.max(2, Math.floor(dispH * o.scale));
    canvas.width = dispW; canvas.height = dispH;

    function makeState() {
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFmt, simW, simH, 0, gl.RGBA, texType, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      var fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return { tex: tex, fbo: fbo };
    }
    var src = makeState(), dst = makeState();
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      console.warn('[PingPong] framebuffer incomplete — WebGL2 float/8-bit FBO unsupported here.'); canvas.remove(); return null;
    }

    // fullscreen quad
    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    function bindQuad(prog) {
      var loc = gl.getAttribLocation(prog, 'a_position');
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    var simProg = program(gl, o.simShader || GS_SIM);
    var dispProg = program(gl, o.displayShader || GS_DISPLAY);
    var seedProg = program(gl, o.seedShader || GS_SEED);
    if (!simProg || !dispProg || !seedProg) { canvas.remove(); return null; }

    var accent = parseColor(o.accent || (getComputedStyle(container).getPropertyValue('--accent')), [0.45, 0.72, 1.0]);
    var base = parseColor(o.bg || (getComputedStyle(container).getPropertyValue('--bg')), [0.04, 0.05, 0.09]);
    var extra = o.uniforms || {};

    function setU(prog, name, v) {
      var loc = gl.getUniformLocation(prog, name); if (loc == null) return;
      if (typeof v === 'number') gl.uniform1f(loc, v);
      else if (v.length === 2) gl.uniform2f(loc, v[0], v[1]);
      else if (v.length === 3) gl.uniform3f(loc, v[0], v[1], v[2]);
      else if (v.length === 4) gl.uniform4f(loc, v[0], v[1], v[2], v[3]);
    }

    function reseed() {
      gl.useProgram(seedProg); bindQuad(seedProg);
      gl.bindFramebuffer(gl.FRAMEBUFFER, src.fbo); gl.viewport(0, 0, simW, simH);
      setU(seedProg, 'u_res', [simW, simH]); setU(seedProg, 'u_seed', o.seed);
      for (var n in extra) setU(seedProg, n, extra[n]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    reseed();

    var raf = null;
    function frame() {
      // sim steps (read src → write dst, swap)
      gl.useProgram(simProg); bindQuad(simProg);
      gl.viewport(0, 0, simW, simH);
      setU(simProg, 'u_res', [simW, simH]);
      setU(simProg, 'u_feed', o.feed); setU(simProg, 'u_kill', o.kill);
      setU(simProg, 'u_da', o.da); setU(simProg, 'u_db', o.db); setU(simProg, 'u_dt', o.dt);
      for (var nm in extra) setU(simProg, nm, extra[nm]);
      for (var i = 0; i < o.steps; i++) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, src.tex);
        gl.uniform1i(gl.getUniformLocation(simProg, 'u_prev'), 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        var t = src; src = dst; dst = t;
      }
      // display src → screen
      gl.useProgram(dispProg); bindQuad(dispProg);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, dispW, dispH);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, src.tex);
      gl.uniform1i(gl.getUniformLocation(dispProg, 'u_state'), 0);
      setU(dispProg, 'u_c1', base); setU(dispProg, 'u_c2', accent);
      setU(dispProg, 'u_res', [dispW, dispH]);
      for (var nd in extra) setU(dispProg, nd, extra[nd]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return {
      canvas: canvas, gl: gl,
      setUniform: function (name, v) { extra[name] = v; },
      reseed: reseed,
      destroy: function () {
        if (raf) cancelAnimationFrame(raf);
        gl.deleteFramebuffer(src.fbo); gl.deleteFramebuffer(dst.fbo);
        gl.deleteTexture(src.tex); gl.deleteTexture(dst.tex);
        gl.deleteBuffer(quad); gl.deleteProgram(simProg); gl.deleteProgram(dispProg); gl.deleteProgram(seedProg);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }

  var PingPong = { init: init, GRAY_SCOTT: { sim: GS_SIM, display: GS_DISPLAY, seed: GS_SEED } };

  if (typeof module !== 'undefined' && module.exports) module.exports = PingPong;
  else root.PingPong = PingPong;
})(typeof window !== 'undefined' ? window : this);
