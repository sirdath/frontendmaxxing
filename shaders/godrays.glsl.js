/* ============================================
   GODRAYS SHADER — Radial volumetric light shafts (Shadertoy-style)
   Inspired by Shadertoy "Nll3zB" + classic radial-blur approaches
   ============================================
   Cinematic shafts of light emanating from a configurable sun position.
   Animated dust particles + slight color fringe for atmospheric look.

   Usage:
     ShaderRunner.create(target, {
       fragment: GodraysShader.fragment,
       uniforms: GodraysShader.defaults
     });

   Uniforms:
     u_sunPos      — sun position in normalized 0..1 space
     u_density     — ray density 0..2
     u_decay       — decay factor 0.9..1
     u_weight      — sample weight 0..0.1
     u_exposure    — final exposure
     u_sunColor    — sun color
     u_bgColor     — base background
     u_speed       — drift speed of dust
   ============================================ */
(function (root) {
  'use strict';

  var fragment = [
    'precision highp float;',
    'uniform vec2 u_resolution;',
    'uniform float u_time;',
    'uniform vec2 u_mouse;',
    'uniform vec2 u_sunPos;',
    'uniform float u_density;',
    'uniform float u_decay;',
    'uniform float u_weight;',
    'uniform float u_exposure;',
    'uniform vec3 u_sunColor;',
    'uniform vec3 u_bgColor;',
    'uniform float u_speed;',
    'uniform float u_dustAmount;',
    '',
    'float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p), f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),',
    '             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);',
    '}',
    'float fbm(vec2 p) {',
    '  float v = 0.0, a = 0.5;',
    '  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }',
    '  return v;',
    '}',
    '',
    '// Silhouette / occluder source — clouds + horizon',
    'float occluder(vec2 uv, float t) {',
    '  // Horizon ground',
    '  float ground = smoothstep(0.32, 0.30, uv.y);',
    '  // Cloud layer',
    '  float clouds = smoothstep(0.55, 0.40, fbm(uv * 3.0 + vec2(t * 0.15, 0.0)));',
    '  return min(1.0 - ground, 1.0 - clouds * 0.6);',
    '}',
    '',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
    '  vec2 sun = u_sunPos;',
    '  // Optional: mouse drives sun position when set',
    '  if (length(u_mouse) > 0.001) sun = u_mouse / u_resolution.xy;',
    '',
    '  vec2 dir = (uv - sun) * (1.0 / float(64)) * u_density;',
    '  vec2 coord = uv;',
    '  float t = u_time * u_speed;',
    '  float color = occluder(coord, t);',
    '  float illum = 1.0;',
    '  // Radial sampling',
    '  for (int i = 0; i < 64; i++) {',
    '    coord -= dir;',
    '    float s = occluder(coord, t);',
    '    s *= illum * u_weight;',
    '    color += s;',
    '    illum *= u_decay;',
    '  }',
    '  color *= u_exposure;',
    '',
    '  // Color tinting',
    '  float sunDist = length(uv - sun);',
    '  float sunGlow = exp(-sunDist * 6.0) * 0.6;',
    '  vec3 col = mix(u_bgColor, u_sunColor, clamp(color, 0.0, 1.0));',
    '  col += u_sunColor * sunGlow;',
    '',
    '  // Floating dust motes',
    '  float dust = step(0.998, hash(floor(gl_FragCoord.xy * 0.3) + floor(t * 0.4)));',
    '  col += vec3(dust) * u_dustAmount;',
    '',
    '  // Slight vignette',
    '  float v = smoothstep(1.2, 0.4, length(uv - 0.5));',
    '  col *= v * 0.6 + 0.5;',
    '',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var defaults = {
    u_sunPos: [0.5, 0.85],
    u_density: 1.0,
    u_decay: 0.97,
    u_weight: 0.03,
    u_exposure: 1.2,
    u_sunColor: [1.0, 0.85, 0.55],
    u_bgColor: [0.05, 0.05, 0.12],
    u_speed: 0.3,
    u_dustAmount: 0.3
  };

  var palettes = {
    cinematic: { u_sunColor: [1.0, 0.85, 0.55], u_bgColor: [0.05, 0.05, 0.12] },
    forest:    { u_sunColor: [0.95, 0.92, 0.5], u_bgColor: [0.02, 0.06, 0.04] },
    cathedral: { u_sunColor: [1.0, 0.95, 0.85], u_bgColor: [0.04, 0.04, 0.08] },
    sunset:    { u_sunColor: [1.0, 0.5, 0.3], u_bgColor: [0.08, 0.04, 0.06] },
    dive:      { u_sunColor: [0.7, 0.95, 1.0], u_bgColor: [0.02, 0.06, 0.12] },
    moonlit:   { u_sunColor: [0.7, 0.8, 1.0], u_bgColor: [0.02, 0.03, 0.08], u_exposure: 0.9 }
  };

  var GodraysShader = { fragment: fragment, defaults: defaults, palettes: palettes };
  if (typeof module !== 'undefined' && module.exports) module.exports = GodraysShader;
  else root.GodraysShader = GodraysShader;
})(typeof window !== 'undefined' ? window : this);
