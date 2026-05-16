/* ============================================
   GRADIENT MESH — Smooth, animated 4-color gradient mesh
   Inspired by stripe.com hero gradient / Mesh Gradient generators
   ============================================
   Usage:
     ShaderRunner.create('#container', {
       fragmentShader: GradientMeshShader.fragment,
       uniforms: GradientMeshShader.defaults
     });

   Uniforms:
     u_c1, u_c2, u_c3, u_c4 (vec3) — corner colors
     u_speed (float) — drift speed (default 0.18)
     u_grain (float) — film grain strength 0..1 (default 0.04)
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    u_c1: [0.40, 0.30, 0.98],   // top-left (indigo)
    u_c2: [0.18, 0.74, 0.97],   // top-right (cyan)
    u_c3: [0.95, 0.46, 0.74],   // bottom-right (pink)
    u_c4: [1.00, 0.82, 0.40],   // bottom-left (amber)
    u_speed: 0.18,
    u_grain: 0.04
  };

  var fragment = [
    'float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
    '  float t = u_time * u_speed;',
    '  // Each color sits near a corner that gently drifts',
    '  vec2 p1 = vec2(0.20 + sin(t * 1.0) * 0.12,         0.15 + cos(t * 0.9) * 0.10);',
    '  vec2 p2 = vec2(0.80 + cos(t * 0.7) * 0.10,         0.20 + sin(t * 0.8) * 0.12);',
    '  vec2 p3 = vec2(0.78 + sin(t * 0.6 + 1.7) * 0.10,   0.82 + cos(t * 0.7 + 0.7) * 0.10);',
    '  vec2 p4 = vec2(0.22 + cos(t * 0.5 + 2.3) * 0.10,   0.78 + sin(t * 0.6 + 1.1) * 0.10);',
    '  float d1 = distance(uv, p1);',
    '  float d2 = distance(uv, p2);',
    '  float d3 = distance(uv, p3);',
    '  float d4 = distance(uv, p4);',
    '  float w1 = 1.0 / (0.0001 + d1 * d1 * 8.0);',
    '  float w2 = 1.0 / (0.0001 + d2 * d2 * 8.0);',
    '  float w3 = 1.0 / (0.0001 + d3 * d3 * 8.0);',
    '  float w4 = 1.0 / (0.0001 + d4 * d4 * 8.0);',
    '  float w = w1 + w2 + w3 + w4;',
    '  vec3 col = (u_c1 * w1 + u_c2 * w2 + u_c3 * w3 + u_c4 * w4) / w;',
    '  // Film grain',
    '  float n = (hash(gl_FragCoord.xy + u_time) - 0.5) * u_grain;',
    '  col += n;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var GradientMeshShader = { fragment: fragment, defaults: defaults };

  if (typeof module !== 'undefined' && module.exports) module.exports = GradientMeshShader;
  else root.GradientMeshShader = GradientMeshShader;
})(typeof window !== 'undefined' ? window : this);
