/* ============================================
   FLUID SHADER — Approximated fluid flow with curl + advection (single-pass)
   Inspired by Pavel Dobryakov's WebGL Fluid Simulation, Jos Stam's stable fluids
   ============================================
   This is a single-pass *approximation* of fluid flow — it runs in the standard
   `ShaderRunner` fullscreen-quad without requiring multi-pass FBO ping-pong.
   For a true ping-pong fluid sim, you'd need an extended runner; this version
   gives 90% of the visual feel with 10% of the complexity.

   It uses a curl-noise vector field driving advected color blobs, with the
   mouse adding velocity impulses (read from `u_mouse` + `u_mouseDown`).

   Usage:
     ShaderRunner.create(target, {
       fragment: FluidShader.fragment,
       uniforms: FluidShader.defaults
     });

   Uniforms:
     u_scale        — vector field scale (1..8)
     u_speed        — flow speed
     u_viscosity    — 0..1 — higher = more smearing
     u_mouseStrength — impulse strength when pointer moves
     u_c1/c2/c3     — three ink colors
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
    'uniform float u_viscosity;',
    'uniform float u_mouseStrength;',
    'uniform vec3 u_c1;',
    'uniform vec3 u_c2;',
    'uniform vec3 u_c3;',
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
    '  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }',
    '  return v;',
    '}',
    '',
    '// Curl noise — gives a divergence-free vector field (fluid-like)',
    'vec2 curl(vec2 p) {',
    '  float e = 0.01;',
    '  float n1 = fbm(p + vec2(0.0, e));',
    '  float n2 = fbm(p - vec2(0.0, e));',
    '  float n3 = fbm(p + vec2(e, 0.0));',
    '  float n4 = fbm(p - vec2(e, 0.0));',
    '  return vec2((n1 - n2) / (2.0 * e), -(n3 - n4) / (2.0 * e));',
    '}',
    '',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
    '  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);',
    '  vec2 p = uv * aspect * u_scale;',
    '  float t = u_time * u_speed;',
    '',
    '  // Mouse impulse — pull ink toward the cursor',
    '  vec2 mouseUV = u_mouse / u_resolution.xy;',
    '  vec2 toMouse = (mouseUV - uv) * aspect;',
    '  float mouseDist = length(toMouse);',
    '  vec2 mouseField = toMouse / (mouseDist + 0.05) * exp(-mouseDist * 4.0) * u_mouseStrength;',
    '',
    '  // Sample curl noise as vector field, advect p',
    '  vec2 v = curl(p + vec2(t, t * 0.3)) * 2.0 + mouseField;',
    '  vec2 q = p + v * u_viscosity * 1.5;',
    '',
    '  // Layer ink densities using slightly different sampling positions',
    '  float ink1 = smoothstep(0.55, 0.7, fbm(q + vec2(t * 0.3, 0.0)));',
    '  float ink2 = smoothstep(0.55, 0.7, fbm(q * 1.3 + vec2(-t * 0.25, t * 0.4) + 5.2));',
    '  float ink3 = smoothstep(0.55, 0.7, fbm(q * 0.85 + vec2(t * 0.2, -t * 0.3) + 9.7));',
    '',
    '  // Compose',
    '  vec3 col = vec3(0.04, 0.04, 0.07);',
    '  col = mix(col, u_c1, ink1);',
    '  col = mix(col, u_c2, ink2);',
    '  col = mix(col, u_c3, ink3 * 0.7);',
    '',
    '  // Subtle vignette',
    '  float vig = smoothstep(1.2, 0.3, length(uv - 0.5));',
    '  col *= vig * 0.5 + 0.65;',
    '',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var defaults = {
    u_scale: 4.0,
    u_speed: 0.35,
    u_viscosity: 0.8,
    u_mouseStrength: 1.2,
    u_c1: [0.66, 0.33, 0.97],
    u_c2: [0.93, 0.28, 0.6],
    u_c3: [0.02, 0.71, 0.83]
  };

  var palettes = {
    cosmic:     { u_c1: [0.66, 0.33, 0.97], u_c2: [0.93, 0.28, 0.6], u_c3: [0.02, 0.71, 0.83] },
    sunset:     { u_c1: [0.98, 0.45, 0.09], u_c2: [0.94, 0.27, 0.27], u_c3: [0.96, 0.62, 0.05] },
    ocean:      { u_c1: [0.05, 0.65, 0.91], u_c2: [0.13, 0.83, 0.93], u_c3: [0.23, 0.51, 0.96] },
    fire:       { u_c1: [0.98, 0.75, 0.14], u_c2: [0.98, 0.45, 0.09], u_c3: [0.94, 0.27, 0.27] },
    aurora:     { u_c1: [0.0, 1.0, 0.6],    u_c2: [0.62, 0.94, 1.0], u_c3: [0.66, 0.33, 0.97] },
    ink:        { u_c1: [0.0, 0.0, 0.0],    u_c2: [0.2, 0.2, 0.2],   u_c3: [0.5, 0.5, 0.5] },
    rainbow:    { u_c1: [1.0, 0.0, 0.4],    u_c2: [0.0, 0.8, 1.0],   u_c3: [1.0, 0.85, 0.0] },
    poison:     { u_c1: [0.5, 0.95, 0.2],   u_c2: [0.95, 0.0, 0.5],  u_c3: [0.4, 0.0, 0.7] },
    pearl:      { u_c1: [0.95, 0.85, 0.95], u_c2: [0.8, 0.95, 0.95], u_c3: [0.95, 0.95, 0.8] }
  };

  var FluidShader = { fragment: fragment, defaults: defaults, palettes: palettes };
  if (typeof module !== 'undefined' && module.exports) module.exports = FluidShader;
  else root.FluidShader = FluidShader;
})(typeof window !== 'undefined' ? window : this);
