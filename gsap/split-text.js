/* ============================================
   GSAP SPLIT TEXT — Char / word / line reveal (zero-plugin manual split)
   Inspired by official GSAP SplitText reveal pattern (re-implemented dependency-free
   so it works with just gsap.min.js — no SplitText plugin required)
   ============================================
   Requires GSAP core from CDN. (ScrollTrigger optional, for scroll-triggered reveal.)

   Usage:
     SplitReveal.init('.headline');
     SplitReveal.init('.headline', {
       type: 'chars',          // 'chars' | 'words'
       from: { yPercent: 110, autoAlpha: 0, rotateX: -40 },
       duration: 0.8, stagger: 0.025, ease: 'power3.out',
       scroll: true            // reveal when scrolled into view
     });
     // .revert() restores original markup.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    type: 'chars',
    from: { yPercent: 110, autoAlpha: 0 },
    duration: 0.8,
    stagger: 0.03,
    ease: 'power3.out',
    scroll: false,
    start: 'top 85%'
  };

  function init(target, opts) {
    var gsap = root.gsap;
    if (!gsap) { console.warn('[SplitReveal] Requires GSAP core.'); return null; }
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var nodes = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target instanceof Element ? [target] : target);
    var instances = [];
    Array.prototype.forEach.call(nodes, function (el) { instances.push(create(el, o, gsap)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function create(el, o, gsap) {
    var original = el.innerHTML;
    var text = el.textContent;
    var pieces = o.type === 'words' ? text.split(/(\s+)/) : text.split('');
    el.setAttribute('aria-label', text);
    el.innerHTML = '';
    var spans = [];
    pieces.forEach(function (p) {
      if (/^\s+$/.test(p)) { el.appendChild(document.createTextNode(p)); return; }
      var wrap = document.createElement('span');
      wrap.style.display = 'inline-block';
      wrap.style.overflow = 'hidden';
      wrap.style.verticalAlign = 'top';
      var inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = p;
      inner.setAttribute('aria-hidden', 'true');
      wrap.appendChild(inner);
      el.appendChild(wrap);
      spans.push(inner);
    });

    var animateIn = function () {
      gsap.to(spans, {
        yPercent: 0, autoAlpha: 1, rotateX: 0,
        duration: o.duration, stagger: o.stagger, ease: o.ease, overwrite: true
      });
    };

    gsap.set(spans, o.from);

    var st = null;
    if (o.scroll && root.ScrollTrigger) {
      gsap.registerPlugin(root.ScrollTrigger);
      st = root.ScrollTrigger.create({ trigger: el, start: o.start, once: true, onEnter: animateIn });
    } else {
      animateIn();
    }

    return {
      el: el,
      spans: spans,
      replay: animateIn,
      revert: function () {
        if (st) st.kill();
        el.innerHTML = original;
        el.removeAttribute('aria-label');
      }
    };
  }

  var SplitReveal = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = SplitReveal;
  else root.SplitReveal = SplitReveal;
})(typeof window !== 'undefined' ? window : this);
