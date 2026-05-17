/* ============================================
   SCROLL FX PACK — IntersectionObserver + scroll-position helpers
   ============================================
   Usage:
     ScrollFx.reveal('.sfx-stk-item, .sfx-rev', { threshold: 0.15, once: true });
     ScrollFx.opacity('[data-sfx-fades]', { fadeIn: 0.2, fadeOut: 0.8 });
     ScrollFx.zoom('[data-sfx-tz]', { from: 0.3, to: 1.5 });
     ScrollFx.parallax('[data-sfx-bg]'); // adds parallax-on-mouse
   ============================================ */
(function (root) {
  'use strict';

  function each(target, fn) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    Array.prototype.forEach.call(els, fn);
  }

  function reveal(target, opts) {
    opts = opts || {};
    var thresh = opts.threshold || 0.1;
    var once = opts.once !== false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-shown');
          if (once) io.unobserve(e.target);
        } else if (!once) {
          e.target.classList.remove('is-shown');
        }
      });
    }, { threshold: thresh });
    each(target, function (el, i) {
      if (opts.stagger) el.style.setProperty('--d', (i * opts.stagger) + 'ms');
      io.observe(el);
    });
    return { destroy: function () { io.disconnect(); } };
  }

  function opacity(target, opts) {
    opts = opts || {};
    each(target, function (host) {
      var sticky = host.querySelector('.sfx-fades-sticky') || host;
      function onScroll() {
        var r = host.getBoundingClientRect();
        var h = host.offsetHeight - window.innerHeight;
        var progress = h > 0 ? Math.max(0, Math.min(1, -r.top / h)) : 0;
        var op = 1;
        if (progress < (opts.fadeIn || 0.2)) op = progress / (opts.fadeIn || 0.2);
        else if (progress > (opts.fadeOut || 0.8)) op = 1 - (progress - (opts.fadeOut || 0.8)) / (1 - (opts.fadeOut || 0.8));
        sticky.style.setProperty('--sfx-opacity', op.toFixed(2));
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    });
  }

  function zoom(target, opts) {
    opts = opts || {};
    var from = opts.from || 0.3;
    var to = opts.to || 1.5;
    each(target, function (host) {
      var sticky = host.querySelector('.sfx-tz-sticky') || host;
      function onScroll() {
        var r = host.getBoundingClientRect();
        var h = host.offsetHeight - window.innerHeight;
        var p = h > 0 ? Math.max(0, Math.min(1, -r.top / h)) : 0;
        var scale = from + (to - from) * p;
        sticky.style.setProperty('--scale', scale.toFixed(3));
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    });
  }

  function parallax(target) {
    each(target, function (host) {
      host.addEventListener('mousemove', function (e) {
        var r = host.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        host.querySelectorAll('.sfx-bg-layer').forEach(function (l, i) {
          var f = (i + 1) * 8;
          l.style.transform = 'translateZ(' + (-(i + 1) * 4) + 'px) scale(' + (1 + (i + 1) * 0.5) + ') translate(' + (x * f) + 'px, ' + (y * f) + 'px)';
        });
      });
    });
  }

  var ScrollFx = { reveal: reveal, opacity: opacity, zoom: zoom, parallax: parallax };
  if (typeof module !== 'undefined' && module.exports) module.exports = ScrollFx;
  else root.ScrollFx = ScrollFx;
})(typeof window !== 'undefined' ? window : this);
