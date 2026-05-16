/* ============================================
   HORIZONTAL PIN — Pin section + scroll inner track horizontally with page scroll
   Inspired by GSAP "horizontal scroll on vertical scroll" pattern / Codrops
   ============================================
   Companion to: layout/horizontal-scroll.js (the existing one uses wheel hijack;
   this one pins via sticky and progress-maps to a horizontal track).

   Usage:
     <section class="hpin">
       <div class="hpin-pin">
         <div class="hpin-track">
           <div class="hpin-panel">1</div>
           <div class="hpin-panel">2</div>
           <div class="hpin-panel">3</div>
         </div>
       </div>
     </section>
     HorizontalPin.init('.hpin');
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    pinSelector:   '.hpin-pin',
    trackSelector: '.hpin-track',
    extraDistance: 0   // px past natural end (default: exactly the overflow width)
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var pin   = el.querySelector(o.pinSelector);
    var track = el.querySelector(o.trackSelector);
    if (!pin || !track) return { el: el, destroy: function () {} };

    pin.style.position = 'sticky';
    pin.style.top = '0';
    pin.style.height = '100vh';
    pin.style.overflow = 'hidden';

    track.style.display = 'flex';
    track.style.flexWrap = 'nowrap';
    track.style.height = '100%';
    track.style.willChange = 'transform';

    var sectionH = 0;
    var overflow = 0;

    function recalc() {
      var vh = window.innerHeight;
      // Distance the track needs to slide left so its end is visible
      overflow = Math.max(0, track.scrollWidth - window.innerWidth);
      // Total scrollable distance for the section = viewport height + overflow + extra
      sectionH = vh + overflow + o.extraDistance;
      el.style.position = 'relative';
      el.style.height = sectionH + 'px';
    }

    function update() {
      var r = el.getBoundingClientRect();
      var progress = clamp(-r.top / (sectionH - window.innerHeight), 0, 1);
      var x = -progress * overflow;
      track.style.transform = 'translate3d(' + x.toFixed(2) + 'px, 0, 0)';
      el.style.setProperty('--hpin-progress', progress.toFixed(4));
    }

    function onScroll() { update(); }
    function onResize() { recalc(); update(); }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    recalc(); update();

    function destroy() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      pin.style.position = ''; pin.style.top = ''; pin.style.height = ''; pin.style.overflow = '';
      track.style.transform = ''; track.style.display = ''; track.style.flexWrap = ''; track.style.height = ''; track.style.willChange = '';
      el.style.position = ''; el.style.height = '';
      el.style.removeProperty('--hpin-progress');
    }

    return { el: el, destroy: destroy };
  }

  var HorizontalPin = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = HorizontalPin;
  else root.HorizontalPin = HorizontalPin;
})(typeof window !== 'undefined' ? window : this);
