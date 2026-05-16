/* ============================================
   KALEIDOSCOPE SHADER — Sector-folding UV transform over a procedural source
   Inspired by Hydra `kaleid()`, lygia `space/kaleidoscope.glsl`
   ============================================
   Folds UV space into N rotationally symmetric segments. The default source
   inside the kaleidoscope is an animated fBm field, but you can swap it for an
   image texture via the optional `texSrc` macro.

   Usage:
     ShaderRunner.create(target, {
       fragment: KaleidoscopeShader.fragment,
       uniforms: KaleidoscopeShader.defaults
     });

     // With an image as source:
     ShaderRunner.create(target, {
       fragment: KaleidoscopeShader.imageFragment,
       uniforms: KaleidoscopeShader.defaults,
       imageUniforms: { u_tex: 'photo.jpg' }
     });

   Uniforms:
     u_segments  — number of segments (3..32)
     u_zoom      — radial zoom
     u_rotate    — base rotation (radians)
     u_speed     — rotation speed
     u_offset    — center offset
   ============================================ */
(function (root) {
  'use strict';

  var procedural = [
    'precision highp float;',
    'uniform vec2 u_resolution;',
    'uniform float u_time;',
    'uniform float u_segments;',
    'uniform float u_zoom;',
    'uniform float u_rotate;',
    'uniform float u_speed;',
    'uniform vec2 u_offset;',
    'uniform vec3 u_c1;',
    'uniform vec3 u_c2;',
    'uniform vec3 u_c3;',
    '',
    'float rand(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p), f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(rand(i), rand(i + vec2(1, 0)), u.x),',
    '             mix(rand(i + vec2(0, 1)), rand(i + vec2(1, 1)), u.x), u.y);',
    '}',
    'float fbm(vec2 p) {',
    '  float v = 0.0, a = 0.5;',
    '  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }',
    '  return v;',
    '}',
    '',
    'vec2 kaleido(vec2 uv, float seg, float rot) {',
    '  vec2 p = uv;',
    '  float r = length(p);',
    '  float a = atan(p.y, p.x);',
    '  float sector = 6.2831853 / seg;',
    '  a = mod(a + rot, sector);',
    '  a = abs(a - sector * 0.5);',
    '  return vec2(cos(a), sin(a)) * r;',
    '}',
    '',
    'void main() {',
    '  vec2 uv = (gl_FragCoord.xy / u_resolution.xy) - 0.5 - u_offset;',
    '  uv.x *= u_resolution.x / u_resolution.y;',
    '  vec2 k = kaleido(uv * u_zoom, u_segments, u_rotate + u_time * u_speed);',
    '  // Sample procedural source (fbm)',
    '  float t = u_time * 0.3;',
    '  float n = fbm(k * 2.0 + vec2(t, -t));',
    '  float m = fbm(k * 2.0 + vec2(-t, t * 0.7) + 5.2);',
    '  vec3 col = mix(u_c1, u_c2, n);',
    '  col = mix(col, u_c3, m);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var imageFragment = [
    'precision highp float;',
    'uniform vec2 u_resolution;',
    'uniform float u_time;',
    'uniform sampler2D u_tex;',
    'uniform float u_segments;',
    'uniform float u_zoom;',
    'uniform float u_rotate;',
    'uniform float u_speed;',
    'uniform vec2 u_offset;',
    '',
    'vec2 kaleido(vec2 uv, float seg, float rot) {',
    '  vec2 p = uv;',
    '  float r = length(p);',
    '  float a = atan(p.y, p.x);',
    '  float sector = 6.2831853 / seg;',
    '  a = mod(a + rot, sector);',
    '  a = abs(a - sector * 0.5);',
    '  return vec2(cos(a), sin(a)) * r;',
    '}',
    '',
    'void main() {',
    '  vec2 uv = (gl_FragCoord.xy / u_resolution.xy) - 0.5 - u_offset;',
    '  uv.x *= u_resolution.x / u_resolution.y;',
    '  vec2 k = kaleido(uv * u_zoom, u_segments, u_rotate + u_time * u_speed);',
    '  vec2 sampleUV = k * 0.5 + 0.5;',
    '  sampleUV = mod(sampleUV, 1.0);',
    '  gl_FragColor = texture2D(u_tex, sampleUV);',
    '}'
  ].join('\n');

  var defaults = {
    u_segments: 8.0,
    u_zoom: 1.5,
    u_rotate: 0.0,
    u_speed: 0.2,
    u_offset: [0.0, 0.0],
    u_c1: [0.66, 0.33, 0.97],
    u_c2: [0.93, 0.28, 0.6],
    u_c3: [0.02, 0.71, 0.83]
  };

  var palettes = {
    psychedelic: { u_c1: [0.95, 0.1, 0.55], u_c2: [0.1, 0.95, 0.55], u_c3: [0.95, 0.95, 0.1] },
    cosmic:      { u_c1: [0.66, 0.33, 0.97], u_c2: [0.93, 0.28, 0.6], u_c3: [0.02, 0.71, 0.83] },
    fire:        { u_c1: [0.98, 0.75, 0.14], u_c2: [0.94, 0.27, 0.27], u_c3: [0.86, 0.15, 0.15] },
    forest:      { u_c1: [0.13, 0.55, 0.13], u_c2: [0.45, 0.85, 0.4], u_c3: [0.95, 0.85, 0.3] },
    monochrome:  { u_c1: [0.95, 0.95, 0.95], u_c2: [0.3, 0.3, 0.35], u_c3: [0.55, 0.55, 0.6] }
  };

  var KaleidoscopeShader = {
    fragment: procedural,
    proceduralFragment: procedural,
    imageFragment: imageFragment,
    defaults: defaults,
    palettes: palettes
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = KaleidoscopeShader;
  else root.KaleidoscopeShader = KaleidoscopeShader;
})(typeof window !== 'undefined' ? window : this);
