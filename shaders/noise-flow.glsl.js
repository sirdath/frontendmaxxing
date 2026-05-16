/* ============================================
   NOISE FLOW — Animated fBm noise as a fragment shader string
   Inspired by lygia / The Book of Shaders
   ============================================
   Usage:
     ShaderRunner.create('#container', {
       fragmentShader: NoiseFlowShader.fragment,
       uniforms: NoiseFlowShader.defaults
     });

   Available uniforms (override via the second arg to ShaderRunner.create):
     u_color1 (vec3), u_color2 (vec3), u_color3 (vec3) — palette
     u_speed (float)     — animation speed (default 0.15)
     u_zoom  (float)     — fbm zoom (default 1.0)
     u_warp  (float)     — domain warping strength (default 1.5)
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    u_color1: [0.42, 0.10, 0.60],
    u_color2: [0.16, 0.62, 0.98],
    u_color3: [0.96, 0.46, 0.74],
    u_speed: 0.15,
    u_zoom: 1.0,
    u_warp: 1.5
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
    '  float v = 0.0;',
    '  float a = 0.5;',
    '  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }',
    '  return v;',
    '}',
    'void main() {',
    '  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);',
    '  uv *= u_zoom;',
    '  float t = u_time * u_speed;',
    '  vec2 q;',
    '  q.x = fbm(uv + vec2(0.0, t));',
    '  q.y = fbm(uv + vec2(5.2, t * 1.1));',
    '  vec2 r;',
    '  r.x = fbm(uv + u_warp * q + vec2(1.7, 9.2) + t * 0.3);',
    '  r.y = fbm(uv + u_warp * q + vec2(8.3, 2.8) + t * 0.4);',
    '  float v = fbm(uv + u_warp * r);',
    '  vec3 col = mix(u_color1, u_color2, clamp(v * v, 0.0, 1.0));',
    '  col = mix(col, u_color3, clamp(length(r) * 0.5, 0.0, 1.0));',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var NoiseFlowShader = { fragment: fragment, defaults: defaults };

  if (typeof module !== 'undefined' && module.exports) module.exports = NoiseFlowShader;
  else root.NoiseFlowShader = NoiseFlowShader;
})(typeof window !== 'undefined' ? window : this);
