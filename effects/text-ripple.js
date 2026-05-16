/* ============================================
   TEXT RIPPLE — Wave of color/scale ripple across letters from a click point
   Inspired by skiper-ui / animata text effects
   ============================================
   Usage:
     <h1 data-text-ripple>Click anywhere on me</h1>
     TextRipple.init('[data-text-ripple]');
     TextRipple.init('[data-text-ripple]', {
       speed: 350,            // px per second of wave propagation
       color: '#c084fc',
       scale: 1.4,
       duration: 700,
       on: 'click'            // 'click' or 'hover'
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    speed: 600,
    color: '#c084fc',
    scale: 1.3,
    duration: 700,
    on: 'click'
  };

  function init(target, opts) {
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

    var originalHTML = el.innerHTML;
    // Split into character spans
    var text = el.textContent;
    el.innerHTML = '';
    var chars = [];
    text.split('').forEach(function (ch) {
      if (ch === ' ') {
        el.appendChild(document.createTextNode(' '));
        return;
      }
      var s = document.createElement('span');
      s.textContent = ch;
      s.style.display = 'inline-block';
      s.style.transition =
        'transform ' + o.duration + 'ms cubic-bezier(0.2, 0.9, 0.25, 1), ' +
        'color ' + o.duration + 'ms ease';
      el.appendChild(s);
      chars.push(s);
    });

    function fire(origin) {
      var elRect = el.getBoundingClientRect();
      chars.forEach(function (c) {
        var r = c.getBoundingClientRect();
        var cx = r.left - elRect.left + r.width / 2;
        var cy = r.top  - elRect.top  + r.height / 2;
        var d = Math.hypot(cx - origin.x, cy - origin.y);
        var delay = d / o.speed * 1000;
        setTimeout(function () {
          c.style.transform = 'translateY(-0.2em) scale(' + o.scale + ')';
          c.style.color = o.color;
          setTimeout(function () {
            c.style.transform = '';
            c.style.color = '';
          }, o.duration * 0.7);
        }, delay);
      });
    }

    function onEvent(e) {
      var r = el.getBoundingClientRect();
      fire({ x: e.clientX - r.left, y: e.clientY - r.top });
    }

    el.addEventListener(o.on, onEvent);

    function destroy() {
      el.removeEventListener(o.on, onEvent);
      el.innerHTML = originalHTML;
    }

    return { el: el, fire: fire, destroy: destroy };
  }

  var TextRipple = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = TextRipple;
  else root.TextRipple = TextRipple;
})(typeof window !== 'undefined' ? window : this);
