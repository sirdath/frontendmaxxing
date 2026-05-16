/* ============================================
   MESH GRADIENT WGL — Whatamesh-style flowing mesh gradient (Stripe homepage)
   Inspired by Stripe's whatamesh.js, Stripe.com hero gradient
   ============================================
   Usage:
     ShaderRunner.create(target, {
       fragment: MeshGradientWGLShader.fragment,
       uniforms: MeshGradientWGLShader.defaults
     });
   ============================================ */
(function (root) {
  'use strict';

  // 6-color stratified noise mesh, gives Stripe-like soft flow
  var fragment = [
    'precision highp float;',
    'uniform vec2 u_resolution;',
    'uniform float u_time;',
    'uniform vec2 u_mouse;',
    'uniform vec3 u_c1;',
    'uniform vec3 u_c2;',
    'uniform vec3 u_c3;',
    'uniform vec3 u_c4;',
    'uniform vec3 u_c5;',
    'uniform float u_speed;',
    'uniform float u_amp;',
    'uniform float u_scale;',
    '',
    '// Classic Perlin-style noise (Ashima)',
    'vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }',
    'vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }',
    'vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }',
    '',
    'float snoise(vec2 v) {',
    '  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);',
    '  vec2 i = floor(v + dot(v, C.yy));',
    '  vec2 x0 = v - i + dot(i, C.xx);',
    '  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
    '  vec4 x12 = x0.xyxy + C.xxzz;',
    '  x12.xy -= i1;',
    '  i = mod289(i);',
    '  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));',
    '  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);',
    '  m = m*m; m = m*m;',
    '  vec3 x = 2.0 * fract(p * C.www) - 1.0;',
    '  vec3 h = abs(x) - 0.5;',
    '  vec3 ox = floor(x + 0.5);',
    '  vec3 a0 = x - ox;',
    '  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);',
    '  vec3 g;',
    '  g.x = a0.x * x0.x + h.x * x0.y;',
    '  g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
    '  return 130.0 * dot(m, g);',
    '}',
    '',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / u_resolution.xy;',
    '  float aspect = u_resolution.x / u_resolution.y;',
    '  vec2 p = vec2(uv.x * aspect, uv.y) * u_scale;',
    '  float t = u_time * u_speed;',
    '  ',
    '  // Layered noise drives the position of each color "weight"',
    '  float n1 = snoise(p + vec2(t * 0.5, 0.0));',
    '  float n2 = snoise(p + vec2(-t * 0.4, t * 0.6) + 4.7);',
    '  float n3 = snoise(p * 1.3 + vec2(t * 0.3, t * 0.5) + 9.1);',
    '  float n4 = snoise(p * 0.8 + vec2(-t * 0.6, -t * 0.3) + 12.3);',
    '  ',
    '  // Build weighted mix of 5 colors',
    '  vec3 col = u_c1;',
    '  col = mix(col, u_c2, smoothstep(-0.3, 0.7, n1));',
    '  col = mix(col, u_c3, smoothstep(-0.3, 0.7, n2) * 0.85);',
    '  col = mix(col, u_c4, smoothstep(-0.3, 0.7, n3) * 0.7);',
    '  col = mix(col, u_c5, smoothstep(-0.3, 0.7, n4) * 0.55);',
    '  ',
    '  // Vertical falloff (Stripe homepage trick)',
    '  col *= smoothstep(0.95, 0.4, uv.y) * 0.4 + 0.7;',
    '  ',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var defaults = {
    u_c1: [0.04, 0.02, 0.16],    // base dark indigo
    u_c2: [0.62, 0.36, 0.87],    // violet
    u_c3: [0.13, 0.83, 0.93],    // cyan
    u_c4: [0.93, 0.28, 0.6],     // pink
    u_c5: [0.98, 0.75, 0.14],    // amber
    u_speed: 0.08,
    u_amp: 1.0,
    u_scale: 1.5
  };

  var palettes = {
    stripe: {
      u_c1: [0.04, 0.02, 0.16], u_c2: [0.62, 0.36, 0.87],
      u_c3: [0.13, 0.83, 0.93], u_c4: [0.93, 0.28, 0.6], u_c5: [0.98, 0.75, 0.14]
    },
    vercel: {
      u_c1: [0.0, 0.0, 0.0], u_c2: [0.93, 0.28, 0.6],
      u_c3: [0.55, 0.36, 0.97], u_c4: [0.13, 0.83, 0.93], u_c5: [0.23, 0.51, 0.96]
    },
    aurora: {
      u_c1: [0.02, 0.02, 0.06], u_c2: [0.66, 0.33, 0.97],
      u_c3: [0.93, 0.28, 0.6], u_c4: [0.02, 0.71, 0.83], u_c5: [0.96, 0.62, 0.05]
    },
    ocean: {
      u_c1: [0.01, 0.02, 0.06], u_c2: [0.05, 0.65, 0.91],
      u_c3: [0.02, 0.71, 0.83], u_c4: [0.23, 0.51, 0.96], u_c5: [0.08, 0.72, 0.65]
    },
    sunset: {
      u_c1: [0.1, 0.04, 0.06], u_c2: [0.98, 0.45, 0.09],
      u_c3: [0.93, 0.28, 0.6], u_c4: [0.96, 0.62, 0.05], u_c5: [0.94, 0.27, 0.27]
    },
    cosmic: {
      u_c1: [0.04, 0.01, 0.06], u_c2: [0.43, 0.16, 0.85],
      u_c3: [0.86, 0.15, 0.47], u_c4: [0.03, 0.57, 0.7], u_c5: [0.85, 0.47, 0.03]
    },
    pastel: {
      u_c1: [0.98, 0.98, 1.0], u_c2: [0.77, 0.71, 0.99],
      u_c3: [0.98, 0.81, 0.91], u_c4: [0.65, 0.95, 0.99], u_c5: [0.99, 0.9, 0.55]
    },
    cyber: {
      u_c1: [0.0, 0.0, 0.1], u_c2: [0.0, 1.0, 1.0],
      u_c3: [1.0, 0.0, 1.0], u_c4: [0.0, 1.0, 0.5], u_c5: [1.0, 1.0, 0.0]
    }
  };

  var MeshGradientWGLShader = {
    fragment: fragment,
    defaults: defaults,
    palettes: palettes
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = MeshGradientWGLShader;
  else root.MeshGradientWGLShader = MeshGradientWGLShader;
})(typeof window !== 'undefined' ? window : this);
