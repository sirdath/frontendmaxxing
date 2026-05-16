/* ============================================
   HALFTONE — Dot-pattern halftone over an input image (or animated procedural)
   Inspired by classic shader effects / Adobe halftone filter
   ============================================
   Usage with image:
     ShaderRunner.create('#container', {
       fragmentShader: HalftoneShader.fragment,
       imageUniforms: { u_tex: 'photo.jpg' },
       uniforms: HalftoneShader.defaults
     });

   Procedural (animated radial gradient input):
     ShaderRunner.create('#container', {
       fragmentShader: HalftoneShader.proceduralFragment,
       uniforms: HalftoneShader.defaults
     });

   Uniforms:
     u_dotSize  (float) — half-tone grid cell size in px (default 8.0)
     u_radius   (float) — max dot radius (default 0.45 of cell)
     u_angle    (float) — grid rotation in radians (default 0.0)
     u_inkColor (vec3)  — dot color (default black)
     u_paper    (vec3)  — background color (default white)
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    u_dotSize: 8.0,
    u_radius: 0.45,
    u_angle: 0.0,
    u_inkColor: [0.02, 0.02, 0.08],
    u_paper:    [0.98, 0.96, 0.92]
  };

  var COMMON = [
    'float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }',
    'vec2 rotate(vec2 p, float a) {',
    '  float c = cos(a), s = sin(a);',
    '  return mat2(c, -s, s, c) * p;',
    '}'
  ].join('\n');

  // Variant 1: sample an image and halftone it
  var fragment = [
    COMMON,
    'void main() {',
    '  vec2 fc = gl_FragCoord.xy;',
    '  vec2 uv = fc / u_resolution.xy;',
    '  // Sample source image (un-rotated UV)',
    '  vec3 src = texture2D(u_tex, uv).rgb;',
    '  float l = luma(src);',
    '  // Build half-tone grid in screen pixels (rotated)',
    '  vec2 p = rotate(fc, u_angle);',
    '  vec2 cell = floor(p / u_dotSize);',
    '  vec2 local = (p - (cell + 0.5) * u_dotSize) / u_dotSize;',
    '  float maxR = u_radius;',
    '  float r = maxR * (1.0 - l);',
    '  float d = length(local);',
    '  float dot = smoothstep(r + 0.02, r - 0.02, d);',
    '  vec3 col = mix(u_paper, u_inkColor, dot);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  // Variant 2: no input image. Source is a slowly moving radial gradient.
  var proceduralFragment = [
    COMMON,
    'void main() {',
    '  vec2 fc = gl_FragCoord.xy;',
    '  vec2 uv = fc / u_resolution.xy;',
    '  vec2 c = vec2(0.5 + sin(u_time * 0.3) * 0.2, 0.5 + cos(u_time * 0.25) * 0.18);',
    '  float l = 1.0 - smoothstep(0.0, 0.6, distance(uv, c));',
    '  vec2 p = rotate(fc, u_angle);',
    '  vec2 cell = floor(p / u_dotSize);',
    '  vec2 local = (p - (cell + 0.5) * u_dotSize) / u_dotSize;',
    '  float r = u_radius * (1.0 - l);',
    '  float d = length(local);',
    '  float dot = smoothstep(r + 0.02, r - 0.02, d);',
    '  vec3 col = mix(u_paper, u_inkColor, dot);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var HalftoneShader = {
    fragment: fragment,
    proceduralFragment: proceduralFragment,
    defaults: defaults
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = HalftoneShader;
  else root.HalftoneShader = HalftoneShader;
})(typeof window !== 'undefined' ? window : this);
