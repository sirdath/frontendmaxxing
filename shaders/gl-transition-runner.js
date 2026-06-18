/* ============================================
   GL TRANSITION — GPU image-to-image transitions (crossfade / warp / ripple …)
   Inspired by gl-transitions (gre/gl-transitions, MIT) · runs on ShaderRunner
   ============================================
   Requires shaders/runner.js (window.ShaderRunner). Zero external deps — the
   transition GLSL bodies are inlined MIT (gl-transitions). Wraps two textures
   (from → to) on a fullscreen quad and animates a single `progress` 0→1 uniform.
   Honors prefers-reduced-motion (snaps to the end state, no tween).

   Usage:
     var t = GLTransition.create('#stage', {
       from: 'a.jpg', to: 'b.jpg',
       name: 'crosswarp',   // crosswarp|fade|directional|pixelize|ripple|wind
       duration: 800,       // ms
       autoplay: true       // play from→to once on create
     });
     // t.play()  → from→to · t.play(true) → reverse · t.set(0..1) · t.destroy()
     // GLTransition.transitions → the available names.
   ============================================ */
(function (root) {
  'use strict';

  // self-contained MIT transition(vec2) bodies (gl-transitions); each may add
  // helper consts/functions, then defines `vec4 transition(vec2 uv)`.
  var TRANSITIONS = {
    fade:
      'vec4 transition(vec2 uv){ return mix(getFromColor(uv), getToColor(uv), progress); }',
    crosswarp:
      'vec4 transition(vec2 p){ float x = progress; x = smoothstep(0.0, 1.0, x*2.0 + p.x - 1.0);' +
      ' return mix(getFromColor((p-0.5)*(1.0-x)+0.5), getToColor((p-0.5)*x+0.5), x); }',
    directional:
      'const vec2 lcDir = vec2(1.0, 0.0);' +
      'vec4 transition(vec2 uv){ vec2 p = uv + progress*sign(lcDir); vec2 f = fract(p);' +
      ' return mix(getToColor(f), getFromColor(f), step(0.0,p.y)*step(p.y,1.0)*step(0.0,p.x)*step(p.x,1.0)); }',
    pixelize:
      'vec4 transition(vec2 uv){ float d = min(progress, 1.0-progress); float dist = ceil(d*50.0)/50.0;' +
      ' vec2 sq = 2.0*dist/vec2(20.0); vec2 p = dist > 0.0 ? (floor(uv/sq)+0.5)*sq : uv;' +
      ' return mix(getFromColor(p), getToColor(p), progress); }',
    ripple:
      'vec4 transition(vec2 uv){ vec2 dir = uv - vec2(0.5); float dist = length(dir);' +
      ' vec2 off = dir*(sin(progress*dist*80.0 - progress*40.0)+0.5)/30.0;' +
      ' return mix(getFromColor(uv+off), getToColor(uv), smoothstep(0.2, 1.0, progress)); }',
    wind:
      'float lcRand(vec2 co){ return fract(sin(dot(co.xy, vec2(12.9898,78.233)))*43758.5453); }' +
      'vec4 transition(vec2 uv){ float s = 0.2; float r = lcRand(vec2(0.0, uv.y));' +
      ' float m = smoothstep(0.0, -s, uv.x*(1.0-s) + s*r - (progress*(1.0+s)));' +
      ' return mix(getFromColor(uv), getToColor(uv), m); }'
  };

  var PREFIX =
    'precision highp float;' +
    'varying vec2 v_uv;' +
    'uniform sampler2D from;' +
    'uniform sampler2D to;' +
    'uniform float progress;' +
    'uniform float ratio;' +
    'vec4 getFromColor(vec2 uv){ return texture2D(from, uv); }' +
    'vec4 getToColor(vec2 uv){ return texture2D(to, uv); }\n';
  var SUFFIX = '\nvoid main(){ gl_FragColor = transition(v_uv); }';

  function easeInOut(t) { return t < 0.5 ? 2.0 * t * t : 1.0 - Math.pow(-2.0 * t + 2.0, 2.0) / 2.0; }

  var defaults = { name: 'crosswarp', duration: 800, autoplay: true, easing: easeInOut };

  function create(target, opts) {
    if (!root.ShaderRunner) {
      console.warn('[GLTransition] Requires shaders/runner.js (window.ShaderRunner).');
      return null;
    }
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) return null;

    var body = TRANSITIONS[o.name] || TRANSITIONS.crosswarp;
    var ratio = (container.clientWidth || 1) / (container.clientHeight || 1);

    var runner = root.ShaderRunner.create(container, {
      fragmentShader: PREFIX + body + SUFFIX,
      imageUniforms: { from: o.from, to: o.to },
      uniforms: { progress: 0, ratio: ratio }
    });
    if (!runner) return null;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var raf = null, cur = 0;

    function set(p) { cur = Math.max(0, Math.min(1, p)); runner.setUniform('progress', cur); }

    function play(reverse) {
      var goal = reverse ? 0 : 1;
      if (reduce) { set(goal); return; }     // no tween under reduced-motion
      if (raf) cancelAnimationFrame(raf);
      var start = performance.now();
      var from = cur;
      (function tick() {
        var t = Math.min(1, (performance.now() - start) / o.duration);
        set(from + (goal - from) * o.easing(t));
        if (t < 1) raf = requestAnimationFrame(tick);
      })();
    }

    if (o.autoplay) requestAnimationFrame(function () { play(false); });

    return {
      runner: runner,
      play: play,
      set: set,
      destroy: function () { if (raf) cancelAnimationFrame(raf); runner.destroy(); }
    };
  }

  var GLTransition = { create: create, transitions: Object.keys(TRANSITIONS) };

  if (typeof module !== 'undefined' && module.exports) module.exports = GLTransition;
  else root.GLTransition = GLTransition;
})(typeof window !== 'undefined' ? window : this);
