/* ============================================
   RAYMARCH SDF — Raymarched primitives (sphere/box/torus) with smin blend
   Inspired by Inigo Quilez SDF library, "Modeling with Distance Functions"
   ============================================
   Pure-WebGL raymarcher with a small scene of 3 morphing primitives that
   blend smoothly via polynomial smin. Camera orbits and the scene gently
   rotates so you get a nice "demo" out of the box.

   Usage:
     ShaderRunner.create(target, {
       fragment: RaymarchSDFShader.fragment,
       uniforms: RaymarchSDFShader.defaults
     });

   Uniforms (tunable):
     u_speed       — animation speed
     u_blend       — smin blend radius (0..1)
     u_camDist     — camera distance (2..8)
     u_lightColor  — sun color
     u_baseColor   — material color
     u_ambient     — ambient brightness
     u_glow        — fresnel glow strength
   ============================================ */
(function (root) {
  'use strict';

  var fragment = [
    'precision highp float;',
    'uniform vec2 u_resolution;',
    'uniform float u_time;',
    'uniform vec2 u_mouse;',
    'uniform float u_speed;',
    'uniform float u_blend;',
    'uniform float u_camDist;',
    'uniform vec3 u_lightColor;',
    'uniform vec3 u_baseColor;',
    'uniform vec3 u_bgColor;',
    'uniform float u_ambient;',
    'uniform float u_glow;',
    '',
    '// SDF primitives',
    'float sdSphere(vec3 p, float r) { return length(p) - r; }',
    'float sdBox(vec3 p, vec3 b) {',
    '  vec3 q = abs(p) - b;',
    '  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);',
    '}',
    'float sdTorus(vec3 p, vec2 t) {',
    '  vec2 q = vec2(length(p.xz) - t.x, p.y);',
    '  return length(q) - t.y;',
    '}',
    '',
    '// Polynomial smooth min (IQ)',
    'float smin(float a, float b, float k) {',
    '  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);',
    '  return mix(b, a, h) - k * h * (1.0 - h);',
    '}',
    '',
    'mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }',
    '',
    'float scene(vec3 p) {',
    '  float t = u_time * u_speed;',
    '  // Slow rotate world',
    '  p.xz *= rot(t * 0.3);',
    '  p.xy *= rot(t * 0.2);',
    '  // Three primitives that drift in & out',
    '  vec3 ps = p - vec3(sin(t) * 0.6, 0.0, 0.0);',
    '  vec3 pb = p - vec3(0.0, sin(t * 0.7) * 0.6, 0.0);',
    '  vec3 pt = p - vec3(0.0, 0.0, sin(t * 1.1) * 0.6);',
    '  float s = sdSphere(ps, 0.55);',
    '  float b = sdBox(pb, vec3(0.45));',
    '  float to = sdTorus(pt, vec2(0.55, 0.18));',
    '  float d = smin(s, b, u_blend);',
    '  d = smin(d, to, u_blend);',
    '  return d;',
    '}',
    '',
    'vec3 calcNormal(vec3 p) {',
    '  vec2 e = vec2(0.001, 0.0);',
    '  return normalize(vec3(',
    '    scene(p + e.xyy) - scene(p - e.xyy),',
    '    scene(p + e.yxy) - scene(p - e.yxy),',
    '    scene(p + e.yyx) - scene(p - e.yyx)));',
    '}',
    '',
    'float softShadow(vec3 ro, vec3 rd) {',
    '  float res = 1.0;',
    '  float t = 0.02;',
    '  for (int i = 0; i < 32; i++) {',
    '    float h = scene(ro + rd * t);',
    '    if (h < 0.001) return 0.0;',
    '    res = min(res, 12.0 * h / t);',
    '    t += h;',
    '    if (t > 6.0) break;',
    '  }',
    '  return clamp(res, 0.0, 1.0);',
    '}',
    '',
    'void main() {',
    '  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;',
    '  vec3 ro = vec3(0.0, 0.0, -u_camDist);',
    '  vec3 rd = normalize(vec3(uv, 1.5));',
    '  // Mouse rotate',
    '  vec2 mouse = (u_mouse / u_resolution.xy - 0.5);',
    '  ro.yz *= rot(mouse.y * 1.4);',
    '  rd.yz *= rot(mouse.y * 1.4);',
    '  ro.xz *= rot(-mouse.x * 2.0);',
    '  rd.xz *= rot(-mouse.x * 2.0);',
    '',
    '  float t = 0.0;',
    '  float dist = 0.0;',
    '  vec3 p = vec3(0.0);',
    '  bool hit = false;',
    '  for (int i = 0; i < 96; i++) {',
    '    p = ro + rd * t;',
    '    dist = scene(p);',
    '    if (dist < 0.001) { hit = true; break; }',
    '    if (t > 12.0) break;',
    '    t += dist;',
    '  }',
    '',
    '  vec3 col = u_bgColor;',
    '  if (hit) {',
    '    vec3 n = calcNormal(p);',
    '    vec3 lightDir = normalize(vec3(0.6, 0.8, -0.4));',
    '    float diff = max(dot(n, lightDir), 0.0);',
    '    float spec = pow(max(dot(reflect(rd, n), -lightDir), 0.0), 32.0);',
    '    float sh = softShadow(p + n * 0.01, lightDir);',
    '    float fres = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);',
    '    col = u_baseColor * (u_ambient + diff * sh) + u_lightColor * spec;',
    '    col += u_lightColor * fres * u_glow;',
    '    // Subtle ground fade',
    '    col *= clamp(1.0 - t * 0.04, 0.4, 1.0);',
    '  } else {',
    '    // Gradient background',
    '    float v = 0.5 + 0.5 * rd.y;',
    '    col = mix(u_bgColor, u_bgColor * 1.6, v);',
    '  }',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var defaults = {
    u_speed: 0.6,
    u_blend: 0.4,
    u_camDist: 4.0,
    u_lightColor: [1.0, 0.85, 0.7],
    u_baseColor: [0.55, 0.35, 0.95],
    u_bgColor: [0.04, 0.04, 0.08],
    u_ambient: 0.15,
    u_glow: 0.6
  };

  var palettes = {
    cosmic:    { u_baseColor: [0.55, 0.35, 0.95], u_lightColor: [1.0, 0.5, 0.7],   u_bgColor: [0.03, 0.02, 0.08] },
    gold:      { u_baseColor: [0.95, 0.75, 0.2],  u_lightColor: [1.0, 0.95, 0.6], u_bgColor: [0.1, 0.06, 0.02] },
    chrome:    { u_baseColor: [0.85, 0.88, 0.95], u_lightColor: [1.0, 1.0, 1.0],   u_bgColor: [0.04, 0.05, 0.08] },
    mint:      { u_baseColor: [0.2, 0.85, 0.7],   u_lightColor: [0.6, 1.0, 0.85], u_bgColor: [0.02, 0.05, 0.05] },
    rose:      { u_baseColor: [0.98, 0.45, 0.55], u_lightColor: [1.0, 0.75, 0.8], u_bgColor: [0.07, 0.02, 0.04] },
    noir:      { u_baseColor: [0.15, 0.15, 0.2],  u_lightColor: [0.95, 0.95, 1.0], u_bgColor: [0.02, 0.02, 0.04] }
  };

  var RaymarchSDFShader = { fragment: fragment, defaults: defaults, palettes: palettes };
  if (typeof module !== 'undefined' && module.exports) module.exports = RaymarchSDFShader;
  else root.RaymarchSDFShader = RaymarchSDFShader;
})(typeof window !== 'undefined' ? window : this);
