/* ============================================
   POINTER RIPPLE SHADER — Concentric waves that emanate from the cursor
   Inspired by water-ripple / pointer-reactive WebGL backgrounds
   ============================================
   A fragment shader for shaders/runner.js that consumes the u_mouse uniform the
   runner already feeds (0..1 from top-left) — rings expand from the pointer and
   decay with distance. Pass it via the runner's documented `fragmentShader` key
   so the runner declares u_resolution/u_time/u_mouse + these `uniforms` for you.

   Usage:
     ShaderRunner.create('#bg', {
       fragmentShader: PointerRippleShader.fragment,
       uniforms: PointerRippleShader.defaults
     });

   Tunables (uniforms): u_color · u_bg · u_freq · u_speed · u_falloff
   ============================================ */
(function (root) {
  'use strict';

  // No precision/varying/uniform declarations here — runner.js prepends the
  // prefix (precision, v_uv, u_resolution, u_time, u_mouse) and declares the
  // `uniforms` below. Just main().
  var fragment = [
    'void main() {',
    '  vec2 uv = v_uv;',
    '  vec2 m = vec2(u_mouse.x, 1.0 - u_mouse.y);',          // u_mouse is top-left; v_uv is bottom-left
    '  float aspect = u_resolution.x / max(u_resolution.y, 1.0);',
    '  vec2 p = (uv - m) * vec2(aspect, 1.0);',
    '  float d = length(p);',
    '  float wave = sin(d * u_freq - u_time * u_speed);',
    '  float ring = wave * exp(-d * u_falloff);',
    '  float glow = exp(-d * (u_falloff * 0.6));',
    '  vec3 col = u_bg + u_color * (ring * 0.5 + glow * 0.35);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var defaults = {
    u_color: [0.49, 0.36, 1.0],   // accent (indigo)
    u_bg: [0.04, 0.04, 0.07],     // near-black
    u_freq: 34.0,                 // ring density
    u_speed: 3.0,                 // outward speed
    u_falloff: 3.2                // distance decay
  };

  var PointerRippleShader = { fragment: fragment, defaults: defaults };
  if (typeof module !== 'undefined' && module.exports) module.exports = PointerRippleShader;
  else root.PointerRippleShader = PointerRippleShader;
})(typeof window !== 'undefined' ? window : this);
