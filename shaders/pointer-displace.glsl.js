/* ============================================
   POINTER DISPLACE SHADER — Lens/warp of an image toward the cursor
   Inspired by hover-distortion image effects (curtains.js / pixi displacement)
   ============================================
   A fragment shader for shaders/runner.js that warps a sampled image's UVs toward
   the pointer (u_mouse) with a soft radial falloff — a magnifier/ripple-pull lens
   that follows the cursor. Needs an image via the runner's `imageUniforms`.

   Usage:
     ShaderRunner.create('#hero', {
       fragmentShader: PointerDisplaceShader.fragment,
       uniforms: PointerDisplaceShader.defaults,
       imageUniforms: { u_tex: 'photo.jpg' }
     });

   Tunables (uniforms): u_radius (falloff) · u_strength (pull) · u_chroma (RGB split)
   ============================================ */
(function (root) {
  'use strict';

  // runner.js prepends the prefix + declares `uniforms` and the `u_tex` sampler.
  var fragment = [
    'void main() {',
    '  vec2 uv = v_uv;',
    '  vec2 m = vec2(u_mouse.x, 1.0 - u_mouse.y);',
    '  vec2 dir = uv - m;',
    '  float d = length(dir);',
    '  float f = exp(-d * u_radius) * u_strength;',
    '  vec2 duv = uv - dir * f;',                            // pull toward cursor
    '  float ca = u_chroma * f;',                            // subtle chromatic aberration in the lens
    '  float r = texture2D(u_tex, duv + vec2(ca, 0.0)).r;',
    '  float g = texture2D(u_tex, duv).g;',
    '  float b = texture2D(u_tex, duv - vec2(ca, 0.0)).b;',
    '  gl_FragColor = vec4(r, g, b, 1.0);',
    '}'
  ].join('\n');

  var defaults = {
    u_radius: 5.0,     // higher = tighter lens
    u_strength: 0.16,  // pull amount
    u_chroma: 0.04     // RGB split inside the lens
  };

  var PointerDisplaceShader = { fragment: fragment, defaults: defaults };
  if (typeof module !== 'undefined' && module.exports) module.exports = PointerDisplaceShader;
  else root.PointerDisplaceShader = PointerDisplaceShader;
})(typeof window !== 'undefined' ? window : this);
