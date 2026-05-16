/* ============================================
   PLASMA SHADER — Classic demoscene plasma with IQ cosine palette
   Inspired by 80s/90s demoscene effects, Inigo Quilez palettes
   ============================================
   Sum-of-sines field passed through a cosine palette LUT → instantly nostalgic.

   Usage:
     ShaderRunner.create(target, {
       fragment: PlasmaShader.fragment,
       uniforms: PlasmaShader.defaults
     });

     // Switch palette:
     ShaderRunner.create(target, {
       fragment: PlasmaShader.fragment,
       uniforms: Object.assign({}, PlasmaShader.defaults, PlasmaShader.palettes.cosmic)
     });

   Uniforms:
     u_scale     — spatial frequency
     u_speed     — animation speed
     u_warp      — domain warping amount
     u_a/b/c/d   — IQ palette params (offset, amp, freq, phase) — 4× vec3
   ============================================ */
(function (root) {
  'use strict';

  var fragment = [
    'precision highp float;',
    'uniform vec2 u_resolution;',
    'uniform float u_time;',
    'uniform vec2 u_mouse;',
    'uniform float u_scale;',
    'uniform float u_speed;',
    'uniform float u_warp;',
    'uniform vec3 u_a;',
    'uniform vec3 u_b;',
    'uniform vec3 u_c;',
    'uniform vec3 u_d;',
    '',
    '// IQ cosine palette',
    'vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {',
    '  return a + b * cos(6.28318 * (c * t + d));',
    '}',
    '',
    'void main() {',
    '  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;',
    '  uv *= u_scale;',
    '  float t = u_time * u_speed;',
    '  // Domain warp',
    '  vec2 q = uv;',
    '  q.x += sin(uv.y * 1.5 + t) * u_warp;',
    '  q.y += cos(uv.x * 1.7 + t * 0.8) * u_warp;',
    '  // Sum of sines',
    '  float v = 0.0;',
    '  v += sin(q.x * 3.0 + t);',
    '  v += sin(q.y * 4.0 + t * 1.3);',
    '  v += sin((q.x + q.y) * 2.5 + t * 0.7);',
    '  v += sin(length(q) * 5.0 - t * 0.9);',
    '  v *= 0.25;',
    '  // Palette',
    '  vec3 col = palette(v + 0.5, u_a, u_b, u_c, u_d);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var defaults = {
    u_scale: 2.5,
    u_speed: 0.6,
    u_warp: 0.4,
    // IQ default palette — pleasing rainbow
    u_a: [0.5, 0.5, 0.5],
    u_b: [0.5, 0.5, 0.5],
    u_c: [1.0, 1.0, 1.0],
    u_d: [0.0, 0.33, 0.67]
  };

  var palettes = {
    rainbow:    { u_a: [0.5, 0.5, 0.5],  u_b: [0.5, 0.5, 0.5],  u_c: [1.0, 1.0, 1.0],  u_d: [0.0, 0.33, 0.67] },
    cosmic:     { u_a: [0.5, 0.5, 0.5],  u_b: [0.5, 0.5, 0.5],  u_c: [1.0, 1.0, 0.5],  u_d: [0.8, 0.9, 0.3] },
    fire:       { u_a: [0.8, 0.5, 0.4],  u_b: [0.2, 0.4, 0.2],  u_c: [2.0, 1.0, 1.0],  u_d: [0.0, 0.25, 0.25] },
    cyber:      { u_a: [0.5, 0.5, 0.5],  u_b: [0.5, 0.5, 0.5],  u_c: [2.0, 1.0, 0.0],  u_d: [0.5, 0.2, 0.25] },
    ocean:      { u_a: [0.5, 0.5, 0.5],  u_b: [0.5, 0.5, 0.5],  u_c: [0.0, 0.5, 1.0],  u_d: [0.5, 0.5, 0.0] },
    sunset:     { u_a: [0.8, 0.5, 0.4],  u_b: [0.2, 0.4, 0.5],  u_c: [2.0, 1.0, 1.0],  u_d: [0.0, 0.1, 0.5] },
    monochrome: { u_a: [0.5, 0.5, 0.5],  u_b: [0.5, 0.5, 0.5],  u_c: [1.0, 1.0, 1.0],  u_d: [0.5, 0.5, 0.5] },
    pastel:     { u_a: [0.8, 0.8, 0.85], u_b: [0.15, 0.15, 0.15], u_c: [1.0, 1.0, 1.0], u_d: [0.0, 0.33, 0.67] },
    matrix:     { u_a: [0.0, 0.5, 0.0],  u_b: [0.0, 0.5, 0.0],  u_c: [0.0, 1.0, 0.0],  u_d: [0.0, 0.5, 0.0] },
    arcade:     { u_a: [0.5, 0.5, 0.5],  u_b: [0.5, 0.5, 0.5],  u_c: [1.0, 0.7, 0.4],  u_d: [0.0, 0.15, 0.2] }
  };

  var PlasmaShader = { fragment: fragment, defaults: defaults, palettes: palettes };
  if (typeof module !== 'undefined' && module.exports) module.exports = PlasmaShader;
  else root.PlasmaShader = PlasmaShader;
})(typeof window !== 'undefined' ? window : this);
