/* ============================================
   IOS NAV — Collapse large title on scroll
   ============================================
   Usage:
     IosNav.init('[data-ios-nav]');
     // pairs with the next sibling [data-ios-nav-scroll]
   ============================================ */
(function (root) {
  'use strict';

  function init(target, opts) {
    opts = opts || {};
    var nodes = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target instanceof Element ? [target] : target);
    var arr = [];
    Array.prototype.forEach.call(nodes, function (el) {
      var inst = createInstance(el, opts);
      if (inst) arr.push(inst);
    });
    return arr.length === 1 ? arr[0] : arr;
  }

  function createInstance(el, opts) {
    if (el.dataset.iosNavBound) return null;
    el.dataset.iosNavBound = '1';
    var scroller =
      (opts && opts.scroller) ||
      el.parentElement && el.parentElement.querySelector('[data-ios-nav-scroll]') ||
      el.nextElementSibling && el.nextElementSibling.matches('[data-ios-nav-scroll]') && el.nextElementSibling;
    if (!scroller) return null;

    // Ensure an inline-title exists for the collapsed state
    var inline = el.querySelector('.ios-nav-inline-title');
    if (!inline) {
      var large = el.querySelector('.ios-nav-large');
      var text = large ? large.textContent.trim() : '';
      var top = el.querySelector('.ios-nav-top');
      if (top && text) {
        inline = document.createElement('div');
        inline.className = 'ios-nav-inline-title';
        inline.textContent = text;
        top.appendChild(inline);
      }
    }

    var threshold = (opts && opts.threshold) || 24;
    function onScroll() {
      if (scroller.scrollTop > threshold) el.classList.add('is-collapsed');
      else el.classList.remove('is-collapsed');
    }
    scroller.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return {
      el: el,
      scroller: scroller,
      destroy: function () {
        scroller.removeEventListener('scroll', onScroll);
        delete el.dataset.iosNavBound;
      }
    };
  }

  var IosNav = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = IosNav;
  else root.IosNav = IosNav;
})(typeof window !== 'undefined' ? window : this);
