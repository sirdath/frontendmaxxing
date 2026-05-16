/* ============================================
   SDF TEXT SHADER — Signed-distance field text with outline/glow/extrude
   Inspired by Valve's SDF text paper, MSDF rendering, IQ's SDF tricks
   ============================================
   For demos / hero text. Renders text by sampling a pre-baked SDF texture
   (or built procedurally from a font canvas at runtime).

   Companion `sdf-text.js` (not included here) would build the SDF atlas
   from a text string on a canvas. This shader file exposes the GLSL.

   Usage (with a pre-baked SDF texture as `u_tex`):
     ShaderRunner.create(target, {
       fragment: SDFTextShader.fragment,
       uniforms: SDFTextShader.defaults,
       imageUniforms: { u_tex: 'sdf-atlas.png' }
     });

   Uniforms:
     u_tex          — SDF texture (R channel = distance)
     u_fg           — fill color
     u_outline      — outline color
     u_glow         — glow color
     u_threshold    — SDF cutoff (0.5 is typical)
     u_smoothing    — edge anti-alias amount
     u_outlineWidth — outline thickness (0..0.5)
     u_glowStrength — outer glow intensity
     u_extrude      — 3D-extrude shadow offset (px in UV)
   ============================================ */
(function (root) {
  'use strict';

  var fragment = [
    'precision highp float;',
    'uniform vec2 u_resolution;',
    'uniform float u_time;',
    'uniform sampler2D u_tex;',
    'uniform vec3 u_fg;',
    'uniform vec3 u_outline;',
    'uniform vec3 u_glow;',
    'uniform float u_threshold;',
    'uniform float u_smoothing;',
    'uniform float u_outlineWidth;',
    'uniform float u_glowStrength;',
    'uniform vec2 u_extrude;',
    'uniform float u_animate;',
    '',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
    '  float t = u_time;',
    '',
    '  // Optional extrude shadow — sample SDF offset behind the text',
    '  float shadow = 0.0;',
    '  if (length(u_extrude) > 0.001) {',
    '    float sd = texture2D(u_tex, uv - u_extrude / u_resolution.xy).r;',
    '    shadow = smoothstep(u_threshold - u_smoothing, u_threshold + u_smoothing, sd);',
    '  }',
    '',
    '  // Main SDF sample',
    '  float d = texture2D(u_tex, uv).r;',
    '',
    '  // Optional sine wobble (subtle motion)',
    '  if (u_animate > 0.5) {',
    '    d += sin(uv.x * 30.0 + t * 2.0) * 0.005;',
    '  }',
    '',
    '  // Fill mask',
    '  float fill = smoothstep(u_threshold - u_smoothing, u_threshold + u_smoothing, d);',
    '',
    '  // Outline mask: a band just outside the fill',
    '  float outline = smoothstep(u_threshold - u_outlineWidth - u_smoothing, u_threshold - u_outlineWidth + u_smoothing, d) -',
    '                  smoothstep(u_threshold - u_smoothing, u_threshold + u_smoothing, d);',
    '',
    '  // Glow — soft falloff outside the outline',
    '  float glow = smoothstep(u_threshold - u_outlineWidth - u_glowStrength * 0.3, u_threshold - u_outlineWidth, d);',
    '  glow *= 1.0 - fill;',
    '',
    '  vec3 col = vec3(0.0);',
    '  col = mix(col, u_glow, glow * u_glowStrength);',
    '  col = mix(col, u_outline, outline);',
    '  col = mix(col, u_fg, fill);',
    '',
    '  // Apply extrude shadow underneath (with low alpha)',
    '  float a = max(fill + outline * 0.9, glow * u_glowStrength * 0.7);',
    '  if (shadow > 0.0) {',
    '    col = mix(col * 0.35, col, fill + outline);',
    '    a = max(a, shadow * 0.5);',
    '  }',
    '',
    '  gl_FragColor = vec4(col, a);',
    '}'
  ].join('\n');

  // Procedural variant (no texture needed) — renders a sine-wave wobbling
  // bar of text using a simple character placeholder. Useful for demos
  // without a baked SDF atlas.
  var proceduralFragment = [
    'precision highp float;',
    'uniform vec2 u_resolution;',
    'uniform float u_time;',
    'uniform vec3 u_fg;',
    'uniform vec3 u_outline;',
    'uniform vec3 u_glow;',
    'uniform vec3 u_bg;',
    'uniform float u_outlineWidth;',
    'uniform float u_glowStrength;',
    '',
    '// Simple rounded-rect SDF — placeholder for a real glyph SDF',
    'float sdRoundBox(vec2 p, vec2 b, float r) {',
    '  vec2 q = abs(p) - b + r;',
    '  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;',
    '}',
    '',
    'void main() {',
    '  vec2 uv = (gl_FragCoord.xy / u_resolution.xy - 0.5);',
    '  uv.x *= u_resolution.x / u_resolution.y;',
    '  uv *= 4.0;',
    '  // Wobbly bar',
    '  uv.y += sin(uv.x * 1.5 + u_time) * 0.08;',
    '  float d = sdRoundBox(uv, vec2(1.4, 0.18), 0.06);',
    '  // d < 0 inside, > 0 outside; convert to standard SDF range',
    '  float dist = -d;',
    '  float fill = smoothstep(-0.005, 0.005, dist);',
    '  float outline = smoothstep(-0.005 - u_outlineWidth, 0.005 - u_outlineWidth, dist) - fill;',
    '  float glow = smoothstep(-0.005 - u_glowStrength * 0.4, -0.005 - u_outlineWidth, dist) * (1.0 - fill);',
    '  vec3 col = u_bg;',
    '  col = mix(col, u_glow, glow * u_glowStrength);',
    '  col = mix(col, u_outline, outline);',
    '  col = mix(col, u_fg, fill);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var defaults = {
    u_fg: [1.0, 1.0, 1.0],
    u_outline: [0.55, 0.36, 0.97],
    u_glow: [0.93, 0.28, 0.6],
    u_bg: [0.02, 0.02, 0.06],
    u_threshold: 0.5,
    u_smoothing: 0.04,
    u_outlineWidth: 0.06,
    u_glowStrength: 0.5,
    u_extrude: [0.0, 0.0],
    u_animate: 0.0
  };

  var palettes = {
    neon:    { u_fg: [1, 1, 1],          u_outline: [0.66, 0.33, 0.97], u_glow: [0.93, 0.28, 0.6] },
    chrome:  { u_fg: [0.95, 0.95, 0.98], u_outline: [0.7, 0.7, 0.75],   u_glow: [1, 1, 1] },
    fire:    { u_fg: [1, 0.95, 0.5],     u_outline: [0.98, 0.45, 0.09], u_glow: [0.94, 0.15, 0.0] },
    cyber:   { u_fg: [0.0, 1.0, 1.0],    u_outline: [1.0, 0.0, 1.0],    u_glow: [0.0, 1.0, 0.5] },
    mono:    { u_fg: [1, 1, 1],          u_outline: [0.2, 0.2, 0.2],    u_glow: [0.4, 0.4, 0.4] }
  };

  var SDFTextShader = {
    fragment: fragment,
    proceduralFragment: proceduralFragment,
    defaults: defaults,
    palettes: palettes
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = SDFTextShader;
  else root.SDFTextShader = SDFTextShader;
})(typeof window !== 'undefined' ? window : this);
