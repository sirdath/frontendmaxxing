/* ============================================
   VORONOI SHADER — Worley cell pattern with F1/F2 distance modes
   Inspired by The Book of Shaders chapter 12, lygia/generative/voronoi
   ============================================
   Usage:
     ShaderRunner.create(target, {
       fragment: VoronoiShader.fragment,
       uniforms: VoronoiShader.defaults
     });

     // Or with a palette preset:
     var u = Object.assign({}, VoronoiShader.defaults, VoronoiShader.palettes.cosmic);
     ShaderRunner.create(target, { fragment: VoronoiShader.fragment, uniforms: u });

   Modes (u_mode):
     0 = F1 (distance to nearest cell, classic cell pattern)
     1 = F2 - F1 (edge highlighting — looks like cracked glass)
     2 = ID (random color per cell)
     3 = cell index (smooth color per cell from palette)
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
    'uniform int u_mode;',
    'uniform vec3 u_c1;',
    'uniform vec3 u_c2;',
    'uniform vec3 u_c3;',
    'uniform float u_edgeWidth;',
    '',
    'vec2 hash2(vec2 p) {',
    '  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));',
    '  return fract(sin(p) * 43758.5453);',
    '}',
    '',
    'vec3 voronoi(vec2 p, float t) {',
    '  vec2 i = floor(p);',
    '  vec2 f = fract(p);',
    '  float f1 = 8.0, f2 = 8.0;',
    '  vec2 cellId = vec2(0.0);',
    '  for (int y = -1; y <= 1; y++) {',
    '    for (int x = -1; x <= 1; x++) {',
    '      vec2 g = vec2(float(x), float(y));',
    '      vec2 h = hash2(i + g);',
    '      // Animate cell points',
    '      h = 0.5 + 0.5 * sin(t + 6.2831 * h);',
    '      vec2 r = g + h - f;',
    '      float d = dot(r, r);',
    '      if (d < f1) { f2 = f1; f1 = d; cellId = i + g; }',
    '      else if (d < f2) { f2 = d; }',
    '    }',
    '  }',
    '  return vec3(sqrt(f1), sqrt(f2), cellId.x * 0.7 + cellId.y * 0.3);',
    '}',
    '',
    'void main() {',
    '  vec2 uv = (gl_FragCoord.xy / u_resolution.xy) - 0.5;',
    '  uv.x *= u_resolution.x / u_resolution.y;',
    '  vec2 p = uv * u_scale;',
    '  float t = u_time * u_speed;',
    '  vec3 v = voronoi(p + vec2(t * 0.3, 0.0), t);',
    '  float f1 = v.x;',
    '  float f2 = v.y;',
    '  float id = v.z;',
    '  vec3 col;',
    '  if (u_mode == 0) {',
    '    col = mix(u_c1, u_c2, smoothstep(0.0, 1.0, f1));',
    '  } else if (u_mode == 1) {',
    '    // F2 - F1: cell edges highlighted',
    '    float edge = smoothstep(u_edgeWidth, u_edgeWidth + 0.04, f2 - f1);',
    '    col = mix(u_c3, u_c1, edge);',
    '  } else if (u_mode == 2) {',
    '    // ID — random per cell',
    '    float h = fract(sin(id * 12.9898) * 43758.5453);',
    '    col = mix(u_c1, u_c2, h);',
    '    col = mix(col, u_c3, fract(h * 7.0));',
    '  } else {',
    '    // Cell index → mix across palette',
    '    float h = fract(id);',
    '    col = mix(u_c1, u_c2, smoothstep(0.0, 0.5, h));',
    '    col = mix(col, u_c3, smoothstep(0.5, 1.0, h));',
    '  }',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var defaults = {
    u_scale: 6.0,
    u_speed: 0.4,
    u_mode: 1,
    u_edgeWidth: 0.02,
    u_c1: [0.66, 0.33, 0.97],
    u_c2: [0.02, 0.71, 0.83],
    u_c3: [0.04, 0.04, 0.1]
  };

  var palettes = {
    cosmic:    { u_c1: [0.66, 0.33, 0.97], u_c2: [0.93, 0.28, 0.6], u_c3: [0.04, 0.04, 0.1] },
    cyber:     { u_c1: [0.0, 1.0, 1.0],    u_c2: [1.0, 0.0, 1.0],   u_c3: [0.0, 0.0, 0.06] },
    ocean:     { u_c1: [0.13, 0.83, 0.93], u_c2: [0.23, 0.51, 0.96], u_c3: [0.02, 0.03, 0.08] },
    fire:      { u_c1: [0.98, 0.75, 0.14], u_c2: [0.94, 0.27, 0.27], u_c3: [0.05, 0.0, 0.0] },
    forest:    { u_c1: [0.13, 0.55, 0.13], u_c2: [0.95, 0.9, 0.4],   u_c3: [0.02, 0.04, 0.02] },
    cracked:   { u_c1: [0.95, 0.95, 0.95], u_c2: [0.7, 0.7, 0.75],   u_c3: [0.02, 0.02, 0.04] },
    leather:   { u_c1: [0.45, 0.25, 0.1],  u_c2: [0.65, 0.4, 0.2],   u_c3: [0.15, 0.07, 0.02] },
    plasma:    { u_c1: [0.86, 0.15, 0.47], u_c2: [0.03, 0.57, 0.7],  u_c3: [0.04, 0.0, 0.06] }
  };

  var VoronoiShader = { fragment: fragment, defaults: defaults, palettes: palettes };
  if (typeof module !== 'undefined' && module.exports) module.exports = VoronoiShader;
  else root.VoronoiShader = VoronoiShader;
})(typeof window !== 'undefined' ? window : this);
