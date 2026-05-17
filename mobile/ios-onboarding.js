/* ============================================
   IOS ONBOARDING — Swipe between pages + sync dots + Continue → Done
   ============================================
   Usage:
     IosOnboarding.init('.ios-onb', {
       finalLabel: 'Get Started',
       onDone: function () {}
     });
   ============================================ */
(function (root) {
  'use strict';

  function init(target, opts) {
    opts = opts || {};
    var nodes = typeof target === 'string' ? document.querySelectorAll(target) : [target];
    var arr = [];
    Array.prototype.forEach.call(nodes, function (el) {
      var inst = bind(el, opts);
      if (inst) arr.push(inst);
    });
    return arr.length === 1 ? arr[0] : arr;
  }

  function bind(el, opts) {
    if (el.dataset.iosOnbBound) return null;
    el.dataset.iosOnbBound = '1';

    var pages = el.querySelector('[data-ios-onb-pages], .ios-onb-pages');
    var dots  = el.querySelector('[data-ios-onb-dots],  .ios-onb-dots');
    var cta   = el.querySelector('.ios-onb-cta');
    if (!pages) return null;

    var pageList = Array.prototype.slice.call(pages.children);
    var dotList = dots ? Array.prototype.slice.call(dots.children) : [];

    function update() {
      var w = pages.clientWidth;
      var idx = Math.round(pages.scrollLeft / w);
      if (idx < 0) idx = 0;
      if (idx >= pageList.length) idx = pageList.length - 1;
      dotList.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
      if (cta) {
        cta.textContent = (idx === pageList.length - 1)
          ? (opts.finalLabel || 'Get Started')
          : (opts.label || 'Continue');
      }
    }

    pages.addEventListener('scroll', update, { passive: true });

    if (cta) cta.addEventListener('click', function () {
      var w = pages.clientWidth;
      var idx = Math.round(pages.scrollLeft / w);
      if (idx < pageList.length - 1) {
        pages.scrollTo({ left: (idx + 1) * w, behavior: 'smooth' });
      } else if (typeof opts.onDone === 'function') {
        opts.onDone();
      }
    });

    if (dotList.length) {
      dotList.forEach(function (d, i) {
        d.style.cursor = 'pointer';
        d.addEventListener('click', function () {
          pages.scrollTo({ left: i * pages.clientWidth, behavior: 'smooth' });
        });
      });
    }

    update();

    return {
      el: el,
      goTo: function (i) { pages.scrollTo({ left: i * pages.clientWidth, behavior: 'smooth' }); },
      destroy: function () { delete el.dataset.iosOnbBound; }
    };
  }

  var IosOnboarding = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = IosOnboarding;
  else root.IosOnboarding = IosOnboarding;
})(typeof window !== 'undefined' ? window : this);
