/* ============================================
   WORLD MAP — Dotted continents (procedurally rendered) + animated arcs
   Inspired by Aceternity UI
   ============================================
   Usage:
     WorldMap.init('[data-world-map]', {
       dots: [
         { from: { lat: 40.71, lng: -74.0 }, to: { lat: 51.5, lng: -0.13 } }
       ],
       lineColor: '#818cf8',
       dotColor: 'rgba(255,255,255,0.22)',
       density: 1   // dot density multiplier
     });

   The dot map is approximated by sampling a coarse continent grid — no
   external image or geo dataset required.
   ============================================ */
(function (root) {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';

  var defaults = {
    dots: [],
    lineColor: null,
    dotColor: null,
    pulseColor: null,
    density: 1
  };

  // Compact bitmap of land (1 = land) in equirectangular projection.
  // Resolution: 72 cols × 36 rows (5° per cell). Hand-tuned approximation.
  // Each row is a 72-char string; '#' = land, '.' = water.
  var LAND_MAP = [
    '........................................................................',
    '........................................................................',
    '....................#######.....##################.....................',
    '.................###########.#####################.....................',
    '...............################################........................',
    '.............###########################.........................######',
    '..........############################..............................###',
    '..........############################....##........................###',
    '..........########################........##.........................##',
    '..........##############..#######..........##........................##',
    '..........###########......#####............##......................###',
    '...........##########......#####..............................######',
    '............#########......#####...............#######.......####.#####',
    '.............########......####..........###############....###########',
    '..............##########..######........##################..###########',
    '...............#################........###################.###########',
    '.................#############..........####################.##########',
    '..................##########.............###################.##########',
    '...................########...............##################..########',
    '....................#######................###############......######',
    '....................######..................############.........#####',
    '....................######...................##########............###',
    '....................######......................#######.............##',
    '....................######.......................######.............##',
    '.....................#####........................#####.............##',
    '......................####.........................####............##.',
    '......................###..........................###.............##.',
    '.......................##............................................#',
    '........................................................................',
    '...........#...........................................................',
    '........................................................................',
    '..........###...........................................................',
    '..........###..............................................###.........',
    '.........................................................########......',
    '........................................................................',
    '........................................................................'
  ];

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function project(lat, lng, w, h) {
    var x = (lng + 180) / 360 * w;
    var y = (90 - lat) / 180 * h;
    return { x: x, y: y };
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    if (o.dotColor)   el.style.setProperty('--wm-dot', o.dotColor);
    if (o.lineColor)  el.style.setProperty('--wm-line', o.lineColor);
    if (o.pulseColor) el.style.setProperty('--wm-pulse', o.pulseColor);

    var existing = el.querySelector('svg.wm-svg');
    if (existing) existing.remove();

    var W = 800, H = 400;
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'wm-svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    el.appendChild(svg);

    // Land dots: iterate the bitmap, place a dot per land cell, jitter slightly
    var rows = LAND_MAP.length;
    var cols = LAND_MAP[0].length;
    var cellW = W / cols;
    var cellH = H / rows;
    var dotR = Math.max(0.8, cellW * 0.18) * o.density;

    var dotsG = document.createElementNS(SVGNS, 'g');
    dotsG.setAttribute('class', 'wm-dots');
    svg.appendChild(dotsG);

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (LAND_MAP[r][c] === '#') {
          var cx = c * cellW + cellW / 2;
          var cy = r * cellH + cellH / 2;
          var d = document.createElementNS(SVGNS, 'circle');
          d.setAttribute('cx', cx.toFixed(1));
          d.setAttribute('cy', cy.toFixed(1));
          d.setAttribute('r', dotR.toFixed(2));
          d.setAttribute('class', 'wm-dot');
          dotsG.appendChild(d);
        }
      }
    }

    // Arcs
    o.dots.forEach(function (pair, i) {
      var from = project(pair.from.lat, pair.from.lng, W, H);
      var to   = project(pair.to.lat,   pair.to.lng,   W, H);
      var midX = (from.x + to.x) / 2;
      var midY = (from.y + to.y) / 2;
      var dx = to.x - from.x;
      var dy = to.y - from.y;
      var len = Math.sqrt(dx * dx + dy * dy);
      // Curve up (negative perpendicular y)
      var arcHeight = Math.min(len * 0.4, 120);
      var ctrlX = midX;
      var ctrlY = midY - arcHeight;

      var path = document.createElementNS(SVGNS, 'path');
      path.setAttribute('class', 'wm-line');
      path.setAttribute('d',
        'M' + from.x + ',' + from.y +
        ' Q' + ctrlX + ',' + ctrlY +
        ' ' + to.x + ',' + to.y
      );
      path.style.animationDelay = (i * 0.3) + 's';
      svg.appendChild(path);

      var pulseR = 5;
      var pf = document.createElementNS(SVGNS, 'circle');
      pf.setAttribute('cx', from.x); pf.setAttribute('cy', from.y);
      pf.setAttribute('r', pulseR); pf.setAttribute('class', 'wm-pulse-from');
      svg.appendChild(pf);

      var pt = document.createElementNS(SVGNS, 'circle');
      pt.setAttribute('cx', to.x); pt.setAttribute('cy', to.y);
      pt.setAttribute('r', pulseR); pt.setAttribute('class', 'wm-pulse-to');
      svg.appendChild(pt);
    });

    function destroy() {
      svg.remove();
    }

    return { el: el, svg: svg, destroy: destroy };
  }

  var WorldMap = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = WorldMap;
  else root.WorldMap = WorldMap;
})(typeof window !== 'undefined' ? window : this);
