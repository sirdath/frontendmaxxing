/* ============================================
   GRADIENT FLOW SHADER — Soft animated multi-color gradient with subtle warp
   Inspired by Linear's hero, Vercel marketing
   Usage:
     ShaderRunner.create(target, {
       fragment: GradientFlowShader.fragment,
       uniforms: GradientFlowShader.defaults
     });
   ============================================ */
(function (root) {
  'use strict';

  var fragment = [
    'precision highp float;',
    'uniform vec2 u_resolution;',
    'uniform float u_time;',
    'uniform vec2 u_mouse;',
    'uniform vec3 u_c1;',
    'uniform vec3 u_c2;',
    'uniform vec3 u_c3;',
    'uniform vec3 u_c4;',
    'uniform float u_speed;',
    'uniform float u_warp;',
    '',
    'float noise(vec2 p) {',
    '  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);',
    '}',
    '',
    'float smoothNoise(vec2 p) {',
    '  vec2 i = floor(p), f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(noise(i), noise(i + vec2(1, 0)), u.x),',
    '             mix(noise(i + vec2(0, 1)), noise(i + vec2(1, 1)), u.x), u.y);',
    '}',
    '',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
    '  float t = u_time * u_speed;',
    '  ',
    '  // Domain warp',
    '  vec2 q = uv;',
    '  q.x += sin(uv.y * 3.0 + t * 0.7) * u_warp;',
    '  q.y += cos(uv.x * 3.0 + t * 0.5) * u_warp;',
    '  ',
    '  // Four-corner mixing weights, slowly cycling',
    '  float w1 = smoothNoise(q * 2.0 + vec2(t, t * 0.3));',
    '  float w2 = smoothNoise(q * 2.0 + vec2(-t * 0.8, t * 0.6) + 5.2);',
    '  float w3 = smoothNoise(q * 2.0 + vec2(t * 0.4, -t * 0.5) + 12.7);',
    '  ',
    '  vec3 col = mix(u_c1, u_c2, w1);',
    '  col = mix(col, u_c3, w2);',
    '  col = mix(col, u_c4, w3 * 0.6);',
    '  ',
    '  // Vignette',
    '  float vig = smoothstep(1.2, 0.4, length(uv - 0.5));',
    '  col *= vig * 0.6 + 0.6;',
    '  ',
    '  // Grain',
    '  col += (noise(gl_FragCoord.xy + u_time * 100.0) - 0.5) * 0.04;',
    '  ',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var defaults = {
    u_c1: [0.66, 0.36, 0.97],   // violet
    u_c2: [0.93, 0.28, 0.6],    // pink
    u_c3: [0.02, 0.71, 0.83],   // cyan
    u_c4: [0.96, 0.62, 0.05],   // amber
    u_speed: 0.12,
    u_warp: 0.08
  };

  // Color presets translated from CSS palette names
  var palettes = {
    aurora:  { u_c1: [0.66, 0.33, 0.97], u_c2: [0.93, 0.28, 0.6],  u_c3: [0.02, 0.71, 0.83], u_c4: [0.96, 0.62, 0.05] },
    sunset:  { u_c1: [0.98, 0.45, 0.09], u_c2: [0.93, 0.28, 0.6],  u_c3: [0.96, 0.62, 0.05], u_c4: [0.94, 0.27, 0.27] },
    cosmic:  { u_c1: [0.43, 0.16, 0.85], u_c2: [0.86, 0.15, 0.47], u_c3: [0.03, 0.57, 0.7],  u_c4: [0.85, 0.47, 0.03] },
    ocean:   { u_c1: [0.05, 0.65, 0.91], u_c2: [0.02, 0.71, 0.83], u_c3: [0.23, 0.51, 0.96], u_c4: [0.08, 0.72, 0.65] },
    cyber:   { u_c1: [0.0, 1.0, 1.0],    u_c2: [1.0, 0.0, 1.0],    u_c3: [0.0, 1.0, 0.5],    u_c4: [1.0, 1.0, 0.0] },
    fire:    { u_c1: [0.98, 0.75, 0.14], u_c2: [0.98, 0.45, 0.09], u_c3: [0.94, 0.27, 0.27], u_c4: [0.86, 0.15, 0.15] },
    pastel:  { u_c1: [0.77, 0.71, 0.99], u_c2: [0.98, 0.81, 0.91], u_c3: [0.65, 0.95, 0.99], u_c4: [0.99, 0.9,  0.55] },
    mint:    { u_c1: [0.2,  0.83, 0.6],  u_c2: [0.13, 0.83, 0.93], u_c3: [0.08, 0.72, 0.65], u_c4: [0.43, 0.91, 0.72] },
    mono:    { u_c1: [0.95, 0.95, 0.97], u_c2: [0.6, 0.6, 0.65],   u_c3: [0.3, 0.3, 0.4],    u_c4: [0.1, 0.1, 0.15] }
  };

  var GradientFlowShader = {
    fragment: fragment,
    defaults: defaults,
    palettes: palettes
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = GradientFlowShader;
  else root.GradientFlowShader = GradientFlowShader;
})(typeof window !== 'undefined' ? window : this);
