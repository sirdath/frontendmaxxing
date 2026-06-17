/* ============================================
   lottie-fx.mjs — valid-by-construction game-VFX burst generator (Bodymovin v5)
   ============================================
   Emits crit_strike-style transparent burst effects: a bright core flash,
   expanding shockwave rings, radiating rays, and outward sparks. The whole point
   is that every opacity/scale keyframe PEAKS at a visible value (the bug that
   blanked CRIT's effects was opacity/size stuck at 0) — so output is always
   render-positive. Validate with tools/lottie-check.mjs. Same JSON plays in
   lottie-web AND Flutter's `lottie`.
   ============================================ */
const W = 512, H = 512, FR = 60, CX = 256, CY = 256;

const hex2rgb = (hex) => { const h = hex.replace('#', ''); return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255, 1]; };
const mix = (a, b, t) => a.map((v, i) => i === 3 ? 1 : v + (b[i] - v) * t);
const WHITE = [1, 1, 1, 1];

const EASE = { i: { x: [0.55], y: [1] }, o: { x: [0.45], y: [0] } };
const stat = (v) => ({ a: 0, k: Array.isArray(v) ? v : [v] });
function kf(stops) { // stops: [{t, v}] — v scalar or array; peaks must be > 0
  return { a: 1, k: stops.map((s, i) => { const o = { t: s.t, s: Array.isArray(s.v) ? s.v : [s.v] }; if (i < stops.length - 1) { o.i = EASE.i; o.o = EASE.o; } return o; }) };
}
const fill = (rgb, o = 100) => ({ ty: 'fl', c: stat(rgb), o: stat(o), r: 1, nm: 'fill' });
const stroke = (rgb, w, o = 100) => ({ ty: 'st', c: stat(rgb), o: stat(o), w: stat(w), lc: 2, lj: 2, nm: 'stroke' });
const ellipse = (size, pos = [0, 0]) => ({ ty: 'el', d: 1, s: size, p: stat(pos), nm: 'el' });
const rect = (size, pos = [0, 0], round = 2) => ({ ty: 'rc', d: 1, s: size, p: stat(pos), r: stat(round), nm: 'rc' });
const tr = ({ p = stat([0, 0]), a = stat([0, 0]), s = stat([100, 100]), r = stat(0), o = stat(100) }) =>
  ({ ty: 'tr', p, a, s, r, o, sk: stat(0), sa: stat(0), nm: 'tr' });
const group = (shapes, transform) => ({ ty: 'gr', nm: 'g', it: [...shapes, tr(transform)] });

// --- components (every opacity/scale envelope peaks visibly) ---
const coreFlash = (rgb, peak = 100) => group(
  [ellipse(stat([70, 70])), fill(WHITE, 100)],
  { s: kf([{ t: 0, v: [0, 0] }, { t: 5, v: [200, 200] }, { t: 13, v: [150, 150] }, { t: 34, v: [170, 170] }]),
    o: kf([{ t: 0, v: 0 }, { t: 4, v: peak }, { t: 14, v: peak * 0.5 }, { t: 34, v: 0 }]) });
const coreColor = (rgb) => group(
  [ellipse(stat([48, 48])), fill(mix(rgb, WHITE, 0.4), 100)],
  { s: kf([{ t: 0, v: [10, 10] }, { t: 7, v: [130, 130] }, { t: 40, v: [110, 110] }]),
    o: kf([{ t: 0, v: 0 }, { t: 5, v: 100 }, { t: 18, v: 70 }, { t: 42, v: 0 }]) });
const ring = (rgb, delay, maxScale, w = 6) => group(
  [ellipse(stat([80, 80])), stroke(rgb, w, 100)],
  { s: kf([{ t: delay, v: [12, 12] }, { t: delay + 42, v: [maxScale, maxScale] }]),
    o: kf([{ t: delay, v: 0 }, { t: delay + 4, v: 90 }, { t: delay + 46, v: 0 }]) });
const ray = (rgb, angle, len, width = 5) => group(
  [rect(stat([width, len]), [0, -(len / 2 + 40)]), fill(rgb, 100)],
  { r: stat(angle),
    s: kf([{ t: 0, v: [100, 0] }, { t: 6, v: [100, 125] }, { t: 16, v: [100, 100] }, { t: 32, v: [100, 70] }]),
    o: kf([{ t: 0, v: 0 }, { t: 5, v: 100 }, { t: 18, v: 80 }, { t: 34, v: 0 }]) });
const spark = (rgb, angle, radius, size = 11, delay = 0) => {
  const rad = (angle - 90) * Math.PI / 180, ex = Math.cos(rad) * radius, ey = Math.sin(rad) * radius;
  return group([ellipse(stat([size, size])), fill(mix(rgb, WHITE, 0.3), 100)],
    { p: kf([{ t: delay, v: [0, 0] }, { t: delay + 30, v: [ex, ey] }]),
      s: kf([{ t: delay, v: [140, 140] }, { t: delay + 30, v: [40, 40] }]),
      o: kf([{ t: delay, v: 0 }, { t: delay + 4, v: 100 }, { t: delay + 30, v: 0 }]) });
};

function layer(shapes, op) {
  return { ddd: 0, ind: 1, ty: 4, nm: 'fx', sr: 1,
    ks: { o: stat(100), r: stat(0), p: stat([CX, CY]), a: stat([0, 0]), s: stat([100, 100]) },
    ao: 0, shapes, ip: 0, op, st: 0, bm: 0 };
}
function comp(name, shapes, op) {
  return { v: '5.7.0', fr: FR, ip: 0, op, w: W, h: H, nm: name, ddd: 0, assets: [], layers: [layer(shapes, op)], markers: [] };
}

// rays go OUTSIDE-IN render order so the bright core sits on top
function rays(rgb, n, len, width) { return Array.from({ length: n }, (_, i) => ray(rgb, (360 / n) * i, len, width)); }
function sparks(rgb, n, radius, size) { return Array.from({ length: n }, (_, i) => spark(rgb, (360 / n) * i + 15, radius, size, 2 + (i % 3))); }

// --- effects ---
export function buildSurge(hex, op = 48) {
  const c = hex2rgb(hex);
  return comp('surge', [
    ring(c, 8, 360, 5), ring(c, 2, 250, 7),
    ...rays(c, 12, 150, 5),
    ...sparks(c, 8, 210, 12),
    coreColor(c), coreFlash(c),
  ], op);
}
export function buildCrateBurst(hex, op = 52) {
  const c = hex2rgb(hex);
  // chunky explosion: bright debris flying out fast + double ring + flash + sparks
  const debris = Array.from({ length: 13 }, (_, i) => {
    const ang = (360 / 13) * i + 14, rad = (ang - 90) * Math.PI / 180, R = 200 + (i % 3) * 24;
    return group([rect(stat([26, 26]), [0, 0], 5), fill(mix(c, WHITE, 0.28), 100)],
      { p: kf([{ t: 0, v: [0, 0] }, { t: 22, v: [Math.cos(rad) * R, Math.sin(rad) * R] }]),
        r: kf([{ t: 0, v: 0 }, { t: 30, v: (i % 2 ? 160 : -160) }]),
        s: kf([{ t: 0, v: [50, 50] }, { t: 7, v: [150, 150] }, { t: 40, v: [60, 60] }]),
        o: kf([{ t: 0, v: 0 }, { t: 4, v: 100 }, { t: 28, v: 90 }, { t: 44, v: 0 }]) });
  });
  return comp('crate_burst', [ring(c, 6, 330, 7), ring(c, 0, 220, 10), ...debris, ...sparks(c, 8, 175, 12), coreColor(c), coreFlash(c, 100)], op);
}
export function buildLevelup(hex, op = 60) {
  const c = hex2rgb(hex);
  // upward thrust: vertical beam + up-rays + dense rising sparks + flash
  const rising = Array.from({ length: 13 }, (_, i) => {
    const x = -180 + i * 30;
    return group([ellipse(stat([14, 14])), fill(mix(c, WHITE, 0.35), 100)],
      { p: kf([{ t: 2 + (i % 5) * 2, v: [x, 130] }, { t: 42 + (i % 5) * 3, v: [x, -200] }]),
        s: kf([{ t: 0, v: [130, 130] }, { t: 52, v: [25, 25] }]),
        o: kf([{ t: 2 + (i % 5) * 2, v: 0 }, { t: 12, v: 100 }, { t: 50, v: 0 }]) });
  });
  const beam = group([rect(stat([26, 320]), [0, -110], 12), fill(mix(c, WHITE, 0.5), 100)],
    { s: kf([{ t: 0, v: [100, 0] }, { t: 8, v: [120, 110] }, { t: 30, v: [60, 90] }]),
      o: kf([{ t: 0, v: 0 }, { t: 6, v: 80 }, { t: 16, v: 45 }, { t: 40, v: 0 }]) });
  const upRays = [ray(c, -28, 170, 6), ray(c, -14, 150, 5), ray(c, 0, 200, 8), ray(c, 14, 150, 5), ray(c, 28, 170, 6)];
  return comp('levelup_burst', [ring(c, 4, 300, 6), beam, ...upRays, ...rising, coreColor(c), coreFlash(c, 100)], op);
}

export const EFFECTS = {
  evolution_surge_red: () => buildSurge('#ff3b3b'),
  evolution_surge_cyan: () => buildSurge('#22d3ee'),
  evolution_surge_gold: () => buildSurge('#f5b021'),
  evolution_surge_violet: () => buildSurge('#a855f7'),
  crate_burst: () => buildCrateBurst('#e0a85a'),
  levelup_burst: () => buildLevelup('#34e07a'),
};
