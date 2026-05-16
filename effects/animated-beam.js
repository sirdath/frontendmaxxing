/* ============================================
   ANIMATED BEAM — Curved SVG path between two nodes with a flowing gradient
   Inspired by Magic UI
   ============================================
   Usage:
     AnimatedBeam.init('.animated-beam-container', {
       from: '#node-a',
       to:   '#node-b',
       curvature: 75,
       duration: 3,
       reverse: false,
       colorFrom: '#c084fc',
       colorTo: '#38bdf8'
     });

     // Multi-beam (array of pairs):
     AnimatedBeam.init('.container', {
       beams: [
         { from: '#a', to: '#b' },
         { from: '#a', to: '#c', curvature: -60 }
       ]
     });
   ============================================ */
(function (root) {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var defaults = {
    curvature: 50,
    duration: 3,
    reverse: false,
    colorFrom: '#c084fc',
    colorTo: '#38bdf8',
    startXOffset: 0,
    startYOffset: 0,
    endXOffset: 0,
    endYOffset: 0
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(container, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var beams = o.beams && o.beams.length ? o.beams : [{ from: o.from, to: o.to }];

    // Build (or reuse) the SVG
    var svg = container.querySelector('svg.animated-beam-svg');
    if (!svg) {
      svg = document.createElementNS(SVGNS, 'svg');
      svg.setAttribute('class', 'animated-beam-svg');
      svg.setAttribute('fill', 'none');
      container.insertBefore(svg, container.firstChild);
    }
    svg.innerHTML = '';

    // Defs with one gradient per beam
    var defs = document.createElementNS(SVGNS, 'defs');
    svg.appendChild(defs);

    var paths = [];
    beams.forEach(function (b, i) {
      var gradId = 'animated-beam-grad-' + i + '-' + Math.random().toString(36).slice(2, 7);
      var grad = document.createElementNS(SVGNS, 'linearGradient');
      grad.setAttribute('id', gradId);
      grad.setAttribute('gradientUnits', 'userSpaceOnUse');
      ['0', '50', '100'].forEach(function (off, idx) {
        var stop = document.createElementNS(SVGNS, 'stop');
        stop.setAttribute('offset', off + '%');
        stop.setAttribute('stop-color', idx === 1 ? (b.colorMid || o.colorFrom) : (idx === 0 ? 'transparent' : 'transparent'));
        if (idx === 1) stop.setAttribute('stop-color', b.colorFrom || o.colorFrom);
        grad.appendChild(stop);
      });
      // Use a 3-stop transparent→color→transparent
      defs.appendChild(grad);

      // Two stops: from-color and to-color for a sliding flow
      var grad2Id = 'animated-beam-flow-' + i + '-' + Math.random().toString(36).slice(2, 7);
      var grad2 = document.createElementNS(SVGNS, 'linearGradient');
      grad2.setAttribute('id', grad2Id);
      grad2.setAttribute('gradientUnits', 'userSpaceOnUse');
      var s1 = document.createElementNS(SVGNS, 'stop');
      s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', 'transparent');
      var s2 = document.createElementNS(SVGNS, 'stop');
      s2.setAttribute('offset', '40%'); s2.setAttribute('stop-color', b.colorFrom || o.colorFrom);
      var s3 = document.createElementNS(SVGNS, 'stop');
      s3.setAttribute('offset', '60%'); s3.setAttribute('stop-color', b.colorTo || o.colorTo);
      var s4 = document.createElementNS(SVGNS, 'stop');
      s4.setAttribute('offset', '100%'); s4.setAttribute('stop-color', 'transparent');
      grad2.appendChild(s1); grad2.appendChild(s2); grad2.appendChild(s3); grad2.appendChild(s4);
      defs.appendChild(grad2);

      var bgPath = document.createElementNS(SVGNS, 'path');
      bgPath.setAttribute('class', 'beam-bg');
      svg.appendChild(bgPath);

      var flowPath = document.createElementNS(SVGNS, 'path');
      flowPath.setAttribute('class', 'beam-flow');
      flowPath.setAttribute('stroke', 'url(#' + grad2Id + ')');
      svg.appendChild(flowPath);

      paths.push({
        beam: b,
        bg: bgPath,
        flow: flowPath,
        grad: grad2,
        gradFrom: { s1: s1, s2: s2, s3: s3, s4: s4 },
        progress: Math.random()
      });
    });

    function getCoord(node) {
      var el = typeof node === 'string' ? document.querySelector(node) : node;
      if (!el) return null;
      var cRect = container.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      return {
        x: r.left - cRect.left + r.width / 2,
        y: r.top - cRect.top + r.height / 2
      };
    }

    function update() {
      var cRect = container.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + cRect.width + ' ' + cRect.height);
      svg.setAttribute('width', cRect.width);
      svg.setAttribute('height', cRect.height);

      paths.forEach(function (p) {
        var b = p.beam;
        var from = getCoord(b.from);
        var to = getCoord(b.to);
        if (!from || !to) return;

        from.x += (b.startXOffset != null ? b.startXOffset : o.startXOffset);
        from.y += (b.startYOffset != null ? b.startYOffset : o.startYOffset);
        to.x   += (b.endXOffset   != null ? b.endXOffset   : o.endXOffset);
        to.y   += (b.endYOffset   != null ? b.endYOffset   : o.endYOffset);

        var curv = (b.curvature != null ? b.curvature : o.curvature);
        // Quadratic bezier with control point offset perpendicular
        var midX = (from.x + to.x) / 2;
        var midY = (from.y + to.y) / 2;
        var dx = to.x - from.x;
        var dy = to.y - from.y;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        // perpendicular unit vector
        var px = -dy / len;
        var py = dx / len;
        var ctrlX = midX + px * curv;
        var ctrlY = midY + py * curv;

        var d = 'M' + from.x + ',' + from.y +
                ' Q' + ctrlX + ',' + ctrlY +
                ' ' + to.x + ',' + to.y;
        p.bg.setAttribute('d', d);
        p.flow.setAttribute('d', d);

        // Update gradient endpoints to follow the line
        p.grad.setAttribute('x1', from.x);
        p.grad.setAttribute('y1', from.y);
        p.grad.setAttribute('x2', to.x);
        p.grad.setAttribute('y2', to.y);
      });
    }

    var startTime = performance.now();
    var raf = null;
    function tick(now) {
      var elapsed = (now - startTime) / 1000;
      paths.forEach(function (p) {
        var dur = (p.beam.duration != null ? p.beam.duration : o.duration);
        var rev = (p.beam.reverse != null ? p.beam.reverse : o.reverse);
        var t = (elapsed % dur) / dur;
        if (rev) t = 1 - t;
        // Shift the inner color stops left to right
        // Map t from [0,1] to offset positions: window of width 40% sliding from -40% to 100%
        var leadFrom = (t * 140 - 40);          // -40 → 100
        var lead1 = leadFrom + 20;
        var lead2 = leadFrom + 30;
        var lead3 = leadFrom + 40;
        p.gradFrom.s1.setAttribute('offset', Math.max(0, Math.min(100, leadFrom)) + '%');
        p.gradFrom.s2.setAttribute('offset', Math.max(0, Math.min(100, lead1))   + '%');
        p.gradFrom.s3.setAttribute('offset', Math.max(0, Math.min(100, lead2))   + '%');
        p.gradFrom.s4.setAttribute('offset', Math.max(0, Math.min(100, lead3))   + '%');
      });
      raf = requestAnimationFrame(tick);
    }

    update();
    raf = requestAnimationFrame(tick);

    var resizeObs = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObs = new ResizeObserver(update);
      resizeObs.observe(container);
    } else {
      window.addEventListener('resize', update);
    }

    function destroy() {
      if (raf) cancelAnimationFrame(raf);
      if (resizeObs) resizeObs.disconnect();
      else window.removeEventListener('resize', update);
      if (svg.parentNode) svg.parentNode.removeChild(svg);
    }

    return { el: container, svg: svg, update: update, destroy: destroy };
  }

  var AnimatedBeam = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = AnimatedBeam;
  else root.AnimatedBeam = AnimatedBeam;
})(typeof window !== 'undefined' ? window : this);
