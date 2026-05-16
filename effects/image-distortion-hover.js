/* ============================================
   IMAGE DISTORTION HOVER — SVG turbulence + displacement on hover
   Inspired by Codrops hover-distortion demos
   ============================================
   Usage:
     ImageDistortionHover.init('[data-idh]');
     ImageDistortionHover.init('[data-idh]', {
       baseFrequency: 0.013,
       scaleMax: 60,
       attack: 280,        // ms to ramp up scale
       release: 380        // ms to ramp down
     });

   Notes:
     - Injects a single <svg> with <filter id="idh-displacement"> into the body.
     - All targets share that one filter; on hover the filter's baseFrequency
       and scale animate, then ease back on leave.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    baseFrequency: 0.013,
    scaleMax: 50,
    attack: 280,
    release: 380
  };

  var sharedFilter = null;
  var turbulence = null;
  var displacement = null;
  var globalRaf = null;
  var current = 0;     // current displacement scale
  var target = 0;

  function ensureFilter() {
    if (sharedFilter) return;
    var SVGNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.style.pointerEvents = 'none';

    var filter = document.createElementNS(SVGNS, 'filter');
    filter.setAttribute('id', 'idh-displacement');
    filter.setAttribute('x', '-20%');
    filter.setAttribute('y', '-20%');
    filter.setAttribute('width', '140%');
    filter.setAttribute('height', '140%');

    turbulence = document.createElementNS(SVGNS, 'feTurbulence');
    turbulence.setAttribute('type', 'fractalNoise');
    turbulence.setAttribute('baseFrequency', '0.013');
    turbulence.setAttribute('numOctaves', '2');
    turbulence.setAttribute('result', 'turb');
    filter.appendChild(turbulence);

    displacement = document.createElementNS(SVGNS, 'feDisplacementMap');
    displacement.setAttribute('in', 'SourceGraphic');
    displacement.setAttribute('in2', 'turb');
    displacement.setAttribute('scale', '0');
    displacement.setAttribute('xChannelSelector', 'R');
    displacement.setAttribute('yChannelSelector', 'G');
    filter.appendChild(displacement);

    svg.appendChild(filter);
    document.body.appendChild(svg);
    sharedFilter = filter;
  }

  function init(target, opts) {
    ensureFilter();
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    turbulence.setAttribute('baseFrequency', o.baseFrequency);

    var hovering = false;
    var localTarget = 0;
    var localCurrent = 0;
    var raf = null;

    function tick() {
      var step = hovering ? (o.scaleMax - localCurrent) * 0.18 : -localCurrent * 0.18;
      localCurrent += step;
      // The shared filter holds the max active value across hovered cards
      if (Math.abs(localCurrent) > Math.abs(current)) current = localCurrent;
      // But on leave we let the filter settle toward 0
      displacement.setAttribute('scale', Math.max(0, current).toFixed(2));
      if (Math.abs(localCurrent - (hovering ? o.scaleMax : 0)) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
        if (!hovering) {
          // ease global down
          if (current > 0.5) {
            current *= 0.9;
            requestAnimationFrame(function () { displacement.setAttribute('scale', current.toFixed(2)); });
          } else {
            current = 0;
            displacement.setAttribute('scale', '0');
          }
        }
      }
    }

    function onEnter() {
      hovering = true;
      el.classList.add('is-hover');
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function onLeave() {
      hovering = false;
      el.classList.remove('is-hover');
      if (!raf) raf = requestAnimationFrame(tick);
    }

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    function destroy() {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.classList.remove('is-hover');
    }

    return { el: el, destroy: destroy };
  }

  var ImageDistortionHover = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = ImageDistortionHover;
  else root.ImageDistortionHover = ImageDistortionHover;
})(typeof window !== 'undefined' ? window : this);
