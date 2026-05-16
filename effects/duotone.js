/* ============================================
   DUOTONE — SVG-filter-based true duotone for images
   Inspired by Spotify covers, Vox, Apple Music
   ============================================
   Usage:
     Duotone.apply(imgEl, { dark: '#001f4d', light: '#fde047' });
     Duotone.apply('img.cover', { palette: 'cyber' });
     Duotone.init('[data-duotone]');  // reads data-duotone-dark/-light
   ============================================ */
(function (root) {
  'use strict';

  var palettes = {
    cyber:           ['#000033', '#00ffff'],
    sunset:          ['#4a0e3e', '#ffb347'],
    ocean:           ['#001a33', '#66d9ef'],
    cosmic:          ['#1a0033', '#ec4899'],
    rose:            ['#2a0014', '#fb7185'],
    mint:            ['#001f1a', '#34d399'],
    fire:            ['#2a0000', '#fbbf24'],
    noir:            ['#000000', '#ffffff'],
    spotify:         ['#051f0d', '#1ed760'],
    vaporwave:       ['#2a0080', '#ff6ad5'],
    monochrome:      ['#1a1a2a', '#e0e0ec'],
    classic:         ['#001f4d', '#fde047'],
    toxic:           ['#003322', '#84cc16'],
    grape:           ['#1a0033', '#d8b4fe'],
    coral:           ['#4a0a00', '#ff6b6b'],
    sepia:           ['#2a1a0a', '#f4d8b0'],
    blueprint:       ['#001f4d', '#66c2ff'],
    'pink-cream':    ['#4a0a24', '#ffeaa7']
  };

  var defs = null;
  var idCounter = 0;

  function ensureSvg() {
    if (defs) return defs;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);
    document.body.appendChild(svg);
    return defs;
  }

  function hexToRGB(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function makeFilter(dark, light) {
    var id = 'duotone-' + (++idCounter);
    var d = hexToRGB(dark).map(function (x) { return (x / 255).toFixed(3); });
    var l = hexToRGB(light).map(function (x) { return (x / 255).toFixed(3); });

    var ns = 'http://www.w3.org/2000/svg';
    var filter = document.createElementNS(ns, 'filter');
    filter.setAttribute('id', id);
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    var fcm = document.createElementNS(ns, 'feColorMatrix');
    fcm.setAttribute('type', 'matrix');
    fcm.setAttribute('values',
      '0.299 0.587 0.114 0 0 ' +
      '0.299 0.587 0.114 0 0 ' +
      '0.299 0.587 0.114 0 0 ' +
      '0 0 0 1 0');
    filter.appendChild(fcm);

    var fct = document.createElementNS(ns, 'feComponentTransfer');
    ['R', 'G', 'B'].forEach(function (ch, i) {
      var f = document.createElementNS(ns, 'feFunc' + ch);
      f.setAttribute('type', 'table');
      f.setAttribute('tableValues', d[i] + ' ' + l[i]);
      fct.appendChild(f);
    });
    filter.appendChild(fct);

    ensureSvg().appendChild(filter);
    return id;
  }

  function apply(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    opts = opts || {};
    var dark = opts.dark;
    var light = opts.light;
    if (opts.palette && palettes[opts.palette]) {
      dark = dark || palettes[opts.palette][0];
      light = light || palettes[opts.palette][1];
    }
    dark = dark || '#000033';
    light = light || '#00ffff';

    var id = makeFilter(dark, light);
    Array.prototype.forEach.call(els, function (el) {
      el.style.filter = 'url(#' + id + ')';
    });
    return id;
  }

  function init(target) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) {
      var p = el.dataset.duotone;
      var d = el.dataset.duotoneDark;
      var l = el.dataset.duotoneLight;
      apply(el, { palette: p, dark: d, light: l });
    });
  }

  function remove(target) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) { el.style.filter = ''; });
  }

  var Duotone = { apply: apply, init: init, remove: remove, palettes: palettes };
  if (typeof module !== 'undefined' && module.exports) module.exports = Duotone;
  else root.Duotone = Duotone;
})(typeof window !== 'undefined' ? window : this);
