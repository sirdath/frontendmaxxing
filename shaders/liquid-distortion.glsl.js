/* ============================================
   LIQUID DISTORTION — Fluid-like UV warp over an input texture (or pattern)
   Inspired by akella WebGL distortion tutorials / Codrops liquid demos
   ============================================
   Usage with image:
     ShaderRunner.create('#container', {
       fragmentShader: LiquidDistortionShader.fragment,
       imageUniforms: { u_tex: 'photo.jpg' },
       uniforms: LiquidDistortionShader.defaults
     });

   Usage without image (procedural pattern):
     ShaderRunner.create('#container', {
       fragmentShader: LiquidDistortionShader.proceduralFragment,
       uniforms: LiquidDistortionShader.defaults
     });

   Uniforms:
     u_strength (float)   — distortion strength (default 0.15)
     u_speed (float)      — flow speed (default 0.5)
     u_freq (float)       — wave frequency (default 4.0)
     u_mouseInfluence (f) — mouse warp factor (default 0.7)
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    u_strength: 0.12,
    u_speed: 0.5,
    u_freq: 4.0,
    u_mouseInfluence: 0.7
  };

  var DISTORT_FN = [
    'vec2 distort(vec2 uv) {',
    '  vec2 p = uv * u_freq;',
    '  vec2 dir = uv - u_mouse;',
    '  float r = length(dir);',
    '  float mouseWarp = exp(-r * 3.0) * u_mouseInfluence;',
    '  uv.x += (sin(p.y * 2.3 + u_time * u_speed)        * 0.6 +',
    '           sin(p.x * 1.7 + u_time * u_speed * 1.3)  * 0.4) * u_strength;',
    '  uv.y += (cos(p.x * 2.1 + u_time * u_speed * 0.9)  * 0.5 +',
    '           cos(p.y * 1.8 + u_time * u_speed * 1.2)  * 0.5) * u_strength;',
    '  uv += dir * mouseWarp;',
    '  return uv;',
    '}'
  ].join('\n');

  var fragment = [
    DISTORT_FN,
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
    '  vec2 d  = distort(uv);',
    '  vec3 col = texture2D(u_tex, d).rgb;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var proceduralFragment = [
    DISTORT_FN,
    'vec3 pattern(vec2 uv) {',
    '  float a = sin(uv.x * 28.0) * 0.5 + 0.5;',
    '  float b = sin(uv.y * 28.0) * 0.5 + 0.5;',
    '  float c = a * b;',
    '  return mix(vec3(0.12, 0.10, 0.30), vec3(0.95, 0.75, 0.45), c);',
    '}',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
    '  vec2 d  = distort(uv);',
    '  gl_FragColor = vec4(pattern(d), 1.0);',
    '}'
  ].join('\n');

  var LiquidDistortionShader = {
    fragment: fragment,
    proceduralFragment: proceduralFragment,
    defaults: defaults
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = LiquidDistortionShader;
  else root.LiquidDistortionShader = LiquidDistortionShader;
})(typeof window !== 'undefined' ? window : this);
