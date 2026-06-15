/* ============================================
   AURORA — Flowing northern-lights curtains as a fragment shader string
   Inspired by aurora/borealis shadertoys + The Book of Shaders fBm
   ============================================
   Layered fBm "curtains" that waver and stream over a night sky, pointer-driven
   drift. A WebGL companion to the CSS `backgrounds/aurora.css` — use it for hero
   backgrounds. Body-only: runner.js prepends precision + u_resolution/u_time/
   u_mouse and declares the `uniforms` below.

   Usage:
     ShaderRunner.create('#container', {
       fragmentShader: AuroraShader.fragment,
       uniforms: AuroraShader.defaults
     });

   Available uniforms (override via the second arg to ShaderRunner.create):
     u_c1, u_c2, u_c3 (vec3) — the three curtain colors (green / cyan / violet)
     u_bg (vec3)            — night-sky base color
     u_speed (float)        — drift/flow speed (default 0.3)
     u_intensity (float)    — overall brightness (default 1.1)
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    u_c1: [0.10, 0.95, 0.55],   // green
    u_c2: [0.20, 0.70, 0.95],   // cyan
    u_c3: [0.65, 0.25, 0.95],   // violet
    u_bg: [0.02, 0.03, 0.08],   // night sky
    u_speed: 0.3,
    u_intensity: 1.1
  };

  var fragment = [
    'float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p); vec2 f = fract(p);',
    '  float a = hash(i);',
    '  float b = hash(i + vec2(1.0, 0.0));',
    '  float c = hash(i + vec2(0.0, 1.0));',
    '  float d = hash(i + vec2(1.0, 1.0));',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);',
    '}',
    'float fbm(vec2 p) {',
    '  float v = 0.0; float a = 0.5;',
    '  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }',
    '  return v;',
    '}',
    '// one aurora curtain: a wavering horizontal band with flowing vertical streaks',
    'float curtain(vec2 uv, float t, float seed) {',
    '  float base = 0.45 + 0.22 * fbm(vec2(uv.x * 2.0 + seed, t * 0.3));',
    '  float h = uv.y - base;',
    '  float streak = fbm(vec2(uv.x * 7.0 + seed * 5.0, uv.y * 3.0 - t));',
    '  return max(exp(-h * h * 28.0) * streak, 0.0);',
    '}',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
    '  uv.x *= u_resolution.x / max(u_resolution.y, 1.0);',
    '  uv.x += (u_mouse.x - 0.5) * 0.3;',          // pointer drifts the curtains
    '  float t = u_time * u_speed;',
    '  vec3 col = u_bg;',
    '  col += u_c1 * curtain(uv, t,        0.0)  * 1.0;',
    '  col += u_c2 * curtain(uv, t + 4.0,  11.3) * 0.8;',
    '  col += u_c3 * curtain(uv, t + 9.0,  27.7) * 0.6;',
    '  col *= u_intensity;',
    '  col += u_bg * (1.0 - uv.y) * 0.5;',         // faint horizon glow
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var AuroraShader = { fragment: fragment, defaults: defaults };

  if (typeof module !== 'undefined' && module.exports) module.exports = AuroraShader;
  else root.AuroraShader = AuroraShader;
})(typeof window !== 'undefined' ? window : this);
