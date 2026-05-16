/* ============================================
   CHART NETWORK — Force-directed network graph (tiny)
   Inspired by D3 force / Obsidian graph view
   ============================================
   Usage:
     ChartNetwork.create('#container', {
       nodes: [{ id: 'a', label: 'A', group: 1 }, { id: 'b' }, …],
       links: [{ source: 'a', target: 'b' }, …],
       width: 600, height: 360
     });
   ============================================ */
(function (root) {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';

  function create(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    opts = opts || {};
    var nodes = (opts.nodes || []).map(function (n) {
      return Object.assign({ vx: 0, vy: 0, x: 0, y: 0 }, n);
    });
    var links = (opts.links || []).slice();
    var width = opts.width || el.clientWidth || 600;
    var height = opts.height || 360;
    var palette = ['#818cf8','#22d3ee','#f472b6','#fbbf24','#4ade80','#fb7185','#a78bfa'];

    el.innerHTML = '';
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', height);
    el.appendChild(svg);

    // Random initial positions
    nodes.forEach(function (n) {
      n.x = Math.random() * width;
      n.y = Math.random() * height;
    });

    // Build edge container + node container
    var edgesG = document.createElementNS(SVGNS, 'g');
    var nodesG = document.createElementNS(SVGNS, 'g');
    svg.appendChild(edgesG);
    svg.appendChild(nodesG);

    var nodeEls = nodes.map(function (n) {
      var g = document.createElementNS(SVGNS, 'g');
      var c = document.createElementNS(SVGNS, 'circle');
      c.setAttribute('r', n.r || 8);
      c.setAttribute('fill', palette[(n.group || 0) % palette.length]);
      c.setAttribute('stroke', 'rgba(255,255,255,0.6)');
      c.setAttribute('stroke-width', '1.5');
      var t = document.createElementNS(SVGNS, 'text');
      t.setAttribute('x', 10);
      t.setAttribute('y', 4);
      t.setAttribute('font-size', 11);
      t.setAttribute('fill', '#fff');
      t.setAttribute('font-family', '-apple-system, sans-serif');
      t.textContent = n.label || n.id;
      g.appendChild(c);
      g.appendChild(t);
      nodesG.appendChild(g);
      n._g = g; n._c = c;
      return g;
    });

    var lineEls = links.map(function (l) {
      var line = document.createElementNS(SVGNS, 'line');
      line.setAttribute('stroke', 'rgba(255,255,255,0.18)');
      line.setAttribute('stroke-width', '1');
      edgesG.appendChild(line);
      return line;
    });

    function idxOf(id) { return nodes.findIndex(function (n) { return n.id === id; }); }

    function tick() {
      // Repel
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var dx = b.x - a.x, dy = b.y - a.y;
          var d2 = dx * dx + dy * dy + 0.01;
          var f = 1200 / d2;
          var fx = dx / Math.sqrt(d2) * f;
          var fy = dy / Math.sqrt(d2) * f;
          a.vx -= fx; a.vy -= fy;
          b.vx += fx; b.vy += fy;
        }
      }
      // Attract along links
      links.forEach(function (l) {
        var ai = typeof l.source === 'string' ? idxOf(l.source) : l.source;
        var bi = typeof l.target === 'string' ? idxOf(l.target) : l.target;
        var a = nodes[ai], b = nodes[bi];
        if (!a || !b) return;
        var dx = b.x - a.x, dy = b.y - a.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var target = 80;
        var f = (dist - target) * 0.01;
        a.vx += (dx / dist) * f;
        a.vy += (dy / dist) * f;
        b.vx -= (dx / dist) * f;
        b.vy -= (dy / dist) * f;
      });
      // Center attraction + damping
      var cx = width / 2, cy = height / 2;
      nodes.forEach(function (n) {
        n.vx += (cx - n.x) * 0.002;
        n.vy += (cy - n.y) * 0.002;
        n.vx *= 0.86; n.vy *= 0.86;
        n.x += n.vx; n.y += n.vy;
        // Boundary
        n.x = Math.max(12, Math.min(width - 12, n.x));
        n.y = Math.max(12, Math.min(height - 12, n.y));
        n._g.setAttribute('transform', 'translate(' + n.x + ',' + n.y + ')');
      });
      links.forEach(function (l, idx) {
        var a = nodes[typeof l.source === 'string' ? idxOf(l.source) : l.source];
        var b = nodes[typeof l.target === 'string' ? idxOf(l.target) : l.target];
        if (!a || !b) return;
        lineEls[idx].setAttribute('x1', a.x);
        lineEls[idx].setAttribute('y1', a.y);
        lineEls[idx].setAttribute('x2', b.x);
        lineEls[idx].setAttribute('y2', b.y);
      });
      raf = requestAnimationFrame(tick);
    }

    var raf = requestAnimationFrame(tick);
    // Stop sim after ~3 seconds
    setTimeout(function () { cancelAnimationFrame(raf); raf = null; }, 3500);

    // Drag
    nodes.forEach(function (n) {
      n._g.style.cursor = 'grab';
      n._g.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        n._g.setPointerCapture(e.pointerId);
        function move(ev) {
          var pt = svg.createSVGPoint();
          pt.x = ev.clientX; pt.y = ev.clientY;
          var ctm = svg.getScreenCTM().inverse();
          var p = pt.matrixTransform(ctm);
          n.x = p.x; n.y = p.y;
          n.vx = 0; n.vy = 0;
          n._g.setAttribute('transform', 'translate(' + n.x + ',' + n.y + ')');
        }
        function up() {
          n._g.removeEventListener('pointermove', move);
          n._g.removeEventListener('pointerup', up);
          if (!raf) raf = requestAnimationFrame(tick);
        }
        n._g.addEventListener('pointermove', move);
        n._g.addEventListener('pointerup', up);
      });
    });

    return { el: el, svg: svg };
  }

  var ChartNetwork = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = ChartNetwork;
  else root.ChartNetwork = ChartNetwork;
})(typeof window !== 'undefined' ? window : this);
