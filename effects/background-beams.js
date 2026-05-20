/* ============================================
   BACKGROUND BEAMS — Injects a shared <linearGradient> def so .bb-path can stroke="url(#bb-grad)"
   Inspired by Aceternity UI
   ============================================
   Run once on a page that uses .bb-host. Pure CSS variant works without
   this if you inline the <defs><linearGradient/></defs> yourself.

   Usage:
     BackgroundBeams.init();   // injects once into <body>
   ============================================ */
(function (root) {
  'use strict';

  function init() {
    if (document.getElementById('bb-defs-svg')) return;
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.id = 'bb-defs-svg';
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML =
      '<defs>' +
        '<linearGradient id="bb-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%"   stop-color="var(--bb-c1, #a855f7)" stop-opacity="0"/>' +
          '<stop offset="50%"  stop-color="var(--bb-c1, #a855f7)"/>' +
          '<stop offset="100%" stop-color="var(--bb-c2, #ec4899)" stop-opacity="0"/>' +
        '</linearGradient>' +
      '</defs>';
    document.body.appendChild(svg);
  }

  var BackgroundBeams = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = BackgroundBeams;
  else root.BackgroundBeams = BackgroundBeams;
  // Auto-init on DOMContentLoaded for zero-config usage
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }
})(typeof window !== 'undefined' ? window : this);
