/* ============================================
   CHART SANKEY — Flow / Sankey diagram for n→n flows
   Inspired by D3 sankey / energy-flow diagrams
   ============================================
   Usage:
     ChartSankey.create('#container', {
       nodes: ['Start', 'Visit', 'Signup', 'Active', 'Churned', 'Paying'],
       links: [
         { from: 0, to: 1, value: 1000 },
         { from: 1, to: 2, value: 320 },
         { from: 1, to: 4, value: 680 },
         { from: 2, to: 3, value: 220 },
         { from: 2, to: 4, value: 100 },
         { from: 3, to: 5, value: 90 }
       ],
       width: 640, height: 320
     });
   ============================================ */
(function (root) {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';

  function create(target, opts) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return null;
    opts = opts || {};
    var nodes = opts.nodes || [];
    var links = opts.links || [];
    var width = opts.width || el.clientWidth || 640;
    var height = opts.height || 320;
    var nodeW = opts.nodeWidth || 12;
    var pad = 12;
    var palette = ['#818cf8','#22d3ee','#f472b6','#fbbf24','#4ade80','#fb7185','#a78bfa'];

    el.innerHTML = '';
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', height);
    el.appendChild(svg);

    // Assign columns via longest-path forward
    var depth = new Array(nodes.length).fill(0);
    for (var step = 0; step < nodes.length; step++) {
      links.forEach(function (l) {
        if (depth[l.to] < depth[l.from] + 1) depth[l.to] = depth[l.from] + 1;
      });
    }
    var maxDepth = Math.max.apply(null, depth);
    var cols = [];
    for (var d = 0; d <= maxDepth; d++) cols.push([]);
    nodes.forEach(function (_, i) { cols[depth[i]].push(i); });

    var colX = cols.map(function (_, i) {
      if (cols.length === 1) return width / 2 - nodeW / 2;
      return pad + i * (width - 2 * pad - nodeW) / Math.max(1, cols.length - 1);
    });

    // Node values = max of in/out totals
    var inSum = new Array(nodes.length).fill(0);
    var outSum = new Array(nodes.length).fill(0);
    links.forEach(function (l) { outSum[l.from] += l.value; inSum[l.to] += l.value; });
    var nodeVal = nodes.map(function (_, i) { return Math.max(inSum[i], outSum[i], 1); });

    // For each column scale heights to fit
    var nodeY = new Array(nodes.length).fill(0);
    var nodeH = new Array(nodes.length).fill(0);
    cols.forEach(function (col) {
      var colTotal = col.reduce(function (s, i) { return s + nodeVal[i]; }, 0);
      var avail = height - 2 * pad - (col.length - 1) * 8;
      var y = pad;
      col.forEach(function (i) {
        var h = (nodeVal[i] / colTotal) * avail;
        nodeY[i] = y;
        nodeH[i] = h;
        y += h + 8;
      });
    });

    // Draw links as cubic bezier ribbons
    var inOffset  = new Array(nodes.length).fill(0);
    var outOffset = new Array(nodes.length).fill(0);
    links.forEach(function (l, idx) {
      var x0 = colX[depth[l.from]] + nodeW;
      var x1 = colX[depth[l.to]];
      var th = (l.value / nodeVal[l.from]) * nodeH[l.from];
      var y0 = nodeY[l.from] + outOffset[l.from];
      var y1 = nodeY[l.to]   + inOffset[l.to];
      outOffset[l.from] += th;
      inOffset[l.to]    += th;

      var path = document.createElementNS(SVGNS, 'path');
      var c1x = x0 + (x1 - x0) * 0.5;
      var c2x = x1 - (x1 - x0) * 0.5;
      path.setAttribute('d',
        'M' + x0 + ',' + y0 +
        ' C' + c1x + ',' + y0 + ' ' + c2x + ',' + y1 + ' ' + x1 + ',' + y1 +
        ' L' + x1 + ',' + (y1 + th) +
        ' C' + c2x + ',' + (y1 + th) + ' ' + c1x + ',' + (y0 + th) + ' ' + x0 + ',' + (y0 + th) +
        ' Z');
      path.setAttribute('fill', palette[idx % palette.length]);
      path.setAttribute('fill-opacity', '0.4');
      svg.appendChild(path);
    });

    // Draw nodes
    nodes.forEach(function (name, i) {
      var x = colX[depth[i]];
      var rect = document.createElementNS(SVGNS, 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', nodeY[i]);
      rect.setAttribute('width', nodeW);
      rect.setAttribute('height', nodeH[i]);
      rect.setAttribute('fill', '#ffffff');
      rect.setAttribute('opacity', '0.85');
      svg.appendChild(rect);

      var text = document.createElementNS(SVGNS, 'text');
      var rightSide = depth[i] >= maxDepth;
      text.setAttribute('x', rightSide ? x - 6 : x + nodeW + 6);
      text.setAttribute('y', nodeY[i] + nodeH[i] / 2);
      text.setAttribute('text-anchor', rightSide ? 'end' : 'start');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-size', 11);
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-family', '-apple-system, sans-serif');
      text.textContent = name + ' (' + Math.round(nodeVal[i]) + ')';
      svg.appendChild(text);
    });

    return { el: el, svg: svg };
  }

  var ChartSankey = { create: create };

  if (typeof module !== 'undefined' && module.exports) module.exports = ChartSankey;
  else root.ChartSankey = ChartSankey;
})(typeof window !== 'undefined' ? window : this);
