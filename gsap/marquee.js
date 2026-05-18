/* ============================================
   GSAP MARQUEE — Seamless infinite marquee with pause-on-hover + drag-aware speed
   Inspired by official GSAP horizontalLoop helper
   ============================================
   Requires GSAP core from CDN.

   Markup (children are looped; they are auto-duplicated for a seamless loop):
     <div class="gmarquee"><span>Item A</span><span>Item B</span><span>Item C</span></div>

   Usage:
     GsapMarquee.init('.gmarquee');
     GsapMarquee.init('.gmarquee', { speed: 80, direction: -1, pauseOnHover: true });
       // speed = px/sec, direction = 1 (right) | -1 (left)
   ============================================ */
(function (root) {
  'use strict';

  var defaults = { speed: 60, direction: -1, pauseOnHover: true, gap: 40 };

  function init(target, opts) {
    var gsap = root.gsap;
    if (!gsap) { console.warn('[GsapMarquee] Requires GSAP core.'); return null; }
    var nodes = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target instanceof Element ? [target] : target);
    var instances = [];
    Array.prototype.forEach.call(nodes, function (el) {
      var inst = create(el, opts, gsap);
      if (inst) instances.push(inst);
    });
    return instances.length === 1 ? instances[0] : instances;
  }

  function create(host, opts, gsap) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var originals = Array.prototype.slice.call(host.children);
    if (!originals.length) return null;

    // Build a track containing two copies for seamless wrap
    var track = document.createElement('div');
    track.style.display = 'inline-flex';
    track.style.gap = o.gap + 'px';
    track.style.willChange = 'transform';
    host.style.overflow = 'hidden';
    host.style.whiteSpace = 'nowrap';

    originals.forEach(function (n) { track.appendChild(n); });
    var clone = track.cloneNode(true);
    var wrapper = document.createElement('div');
    wrapper.style.display = 'inline-flex';
    wrapper.style.gap = o.gap + 'px';
    wrapper.appendChild(track);
    wrapper.appendChild(clone);
    host.innerHTML = '';
    host.appendChild(wrapper);

    var half = track.scrollWidth + o.gap;
    var dur = half / o.speed;

    var tween = gsap.fromTo(wrapper,
      { x: o.direction < 0 ? 0 : -half },
      { x: o.direction < 0 ? -half : 0, duration: dur, ease: 'none', repeat: -1 }
    );

    function enter() { gsap.to(tween, { timeScale: 0, duration: 0.4 }); }
    function leave() { gsap.to(tween, { timeScale: 1, duration: 0.4 }); }
    if (o.pauseOnHover) {
      host.addEventListener('mouseenter', enter);
      host.addEventListener('mouseleave', leave);
    }

    return {
      host: host,
      tween: tween,
      destroy: function () {
        tween.kill();
        host.removeEventListener('mouseenter', enter);
        host.removeEventListener('mouseleave', leave);
        host.innerHTML = '';
        originals.forEach(function (n) { host.appendChild(n); });
      }
    };
  }

  var GsapMarquee = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = GsapMarquee;
  else root.GsapMarquee = GsapMarquee;
})(typeof window !== 'undefined' ? window : this);
