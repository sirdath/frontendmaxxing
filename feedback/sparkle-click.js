/* ============================================
   SPARKLE CLICK — Burst of sparkles at the click position
   Inspired by Apple-style success effects / Bluesky like-button
   ============================================
   Usage:
     SparkleClick.attach('.like-btn');        // sparkles on click of these
     SparkleClick.attach('.heart', {
       count: 14,
       distance: 60,
       size: 14,
       duration: 700,
       colors: ['#ffd166', '#f472b6', '#22d3ee']
     });

     // Or fire at an arbitrary point:
     SparkleClick.burst(clientX, clientY);
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    count: 12,
    distance: 50,
    size: 12,
    duration: 700,
    colors: ['#ffd166', '#f472b6', '#22d3ee', '#a78bfa']
  };

  function attach(target, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, function (el) {
      el.addEventListener('click', function (e) {
        burst(e.clientX, e.clientY, o);
      });
    });
  }

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function burst(cx, cy, opts) {
    opts = opts || {};
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var n = o.count;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + rand(-0.25, 0.25);
      var d = o.distance * rand(0.55, 1.0);
      var s = document.createElement('span');
      var size = o.size * rand(0.6, 1.1);
      var color = o.colors[Math.floor(Math.random() * o.colors.length)];
      s.style.cssText =
        'position:fixed;left:' + cx + 'px;top:' + cy + 'px;' +
        'width:' + size + 'px;height:' + size + 'px;' +
        'pointer-events:none;z-index:99998;' +
        'background:' + color + ';' +
        'transform:translate(-50%,-50%) rotate(' + rand(0,180) + 'deg);' +
        'clip-path:polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%);' +
        'opacity:1;' +
        'transition:transform ' + o.duration + 'ms cubic-bezier(0.2, 0.9, 0.25, 1), opacity ' + o.duration + 'ms ease;';
      document.body.appendChild(s);

      // Force reflow then set target transform
      void s.offsetWidth;
      var tx = Math.cos(a) * d;
      var ty = Math.sin(a) * d;
      s.style.transform = 'translate(calc(-50% + ' + tx.toFixed(2) + 'px), calc(-50% + ' + ty.toFixed(2) + 'px)) rotate(' + rand(180, 540) + 'deg) scale(0.2)';
      s.style.opacity = '0';

      (function (node) {
        setTimeout(function () { if (node.parentNode) node.remove(); }, o.duration + 30);
      })(s);
    }
  }

  var SparkleClick = { attach: attach, burst: burst };

  if (typeof module !== 'undefined' && module.exports) module.exports = SparkleClick;
  else root.SparkleClick = SparkleClick;
})(typeof window !== 'undefined' ? window : this);
