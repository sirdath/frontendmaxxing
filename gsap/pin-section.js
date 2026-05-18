/* ============================================
   GSAP PIN SECTION — Pin a section and scrub an inner timeline while pinned
   Inspired by official GSAP ScrollTrigger pinning pattern
   ============================================
   Requires GSAP + ScrollTrigger from CDN (see gsap.skill.md).

   Markup:
     <section class="pin-host">
       <div class="pin-stage">
         <h2 data-pin="title">Pinned heading</h2>
         <div data-pin="art"></div>
       </div>
     </section>

   Usage:
     PinSection.init('.pin-host');
     PinSection.init('.pin-host', {
       end: '+=1200',           // scroll distance the section stays pinned
       build: function (tl, el) { // custom scrubbed timeline
         tl.from(el.querySelector('[data-pin=title]'), { yPercent: 60, autoAlpha: 0 })
           .to(el.querySelector('[data-pin=art]'), { scale: 1.3, rotation: 8 }, 0);
       }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    start: 'top top',
    end: '+=1000',
    scrub: 1,
    pin: true,
    anticipatePin: 1,
    build: null
  };

  function init(target, opts) {
    var gsap = root.gsap;
    if (!gsap || !root.ScrollTrigger) {
      console.warn('[PinSection] Requires GSAP + ScrollTrigger.');
      return null;
    }
    gsap.registerPlugin(root.ScrollTrigger);

    var nodes = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target instanceof Element ? [target] : target);
    var instances = [];
    Array.prototype.forEach.call(nodes, function (el) {
      instances.push(create(el, opts, gsap));
    });
    return instances.length === 1 ? instances[0] : instances;
  }

  function create(el, opts, gsap) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: o.start,
        end: o.end,
        scrub: o.scrub,
        pin: o.pin,
        anticipatePin: o.anticipatePin
      }
    });

    if (typeof o.build === 'function') {
      o.build(tl, el);
    } else {
      // Sensible default: fade/slide each [data-pin] child in sequence
      var kids = el.querySelectorAll('[data-pin]');
      if (kids.length) {
        tl.from(kids, { yPercent: 40, autoAlpha: 0, stagger: 0.3, ease: 'none' });
      } else {
        tl.from(el.children, { autoAlpha: 0, y: 50, stagger: 0.2, ease: 'none' });
      }
    }

    return {
      el: el,
      timeline: tl,
      destroy: function () {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
      }
    };
  }

  var PinSection = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = PinSection;
  else root.PinSection = PinSection;
})(typeof window !== 'undefined' ? window : this);
