/* ============================================
   PRICING TOGGLE — Move pill, update prices via data-ptog-<key> attributes
   Inspired by Stripe / Linear pricing toggles
   ============================================
   Usage:
     PricingToggle.init('[data-ptog]', {
       priceSelector: '.ptog-price',
       onChange: function (key) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    priceSelector: '.ptog-price',
    onChange: null
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

    var buttons = Array.prototype.slice.call(el.querySelectorAll('.ptog-btn'));
    var pill = el.querySelector('.ptog-pill');
    if (!pill) {
      pill = document.createElement('span');
      pill.className = 'ptog-pill';
      el.appendChild(pill);
    }

    var prices = Array.prototype.slice.call(document.querySelectorAll(o.priceSelector));

    function place(btn) {
      var r = btn.getBoundingClientRect();
      var er = el.getBoundingClientRect();
      pill.style.transform = 'translateX(' + (r.left - er.left - 4) + 'px)';
      pill.style.width = r.width + 'px';
    }

    function set(key) {
      var btn = buttons.find(function (b) { return b.getAttribute('data-ptog-key') === key; });
      if (!btn) return;
      buttons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      place(btn);

      // Animate price flip
      prices.forEach(function (p) {
        var val = p.getAttribute('data-ptog-' + key);
        if (val == null) return;
        p.classList.add('is-flipping');
        setTimeout(function () {
          p.textContent = val;
          p.classList.remove('is-flipping');
        }, 200);
      });

      if (typeof o.onChange === 'function') o.onChange(key);
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () { set(b.getAttribute('data-ptog-key')); });
    });

    // Initialize from current .is-active or the first
    var initial = buttons.find(function (b) { return b.classList.contains('is-active'); }) || buttons[0];
    if (initial) requestAnimationFrame(function () { set(initial.getAttribute('data-ptog-key')); });

    var ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(function () {
        var active = el.querySelector('.ptog-btn.is-active');
        if (active) place(active);
      });
      ro.observe(el);
    } else {
      window.addEventListener('resize', function () {
        var active = el.querySelector('.ptog-btn.is-active');
        if (active) place(active);
      });
    }

    function destroy() {
      buttons.forEach(function (b) { b.replaceWith(b.cloneNode(true)); });
      if (ro) ro.disconnect();
    }

    return { el: el, set: set, destroy: destroy };
  }

  var PricingToggle = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = PricingToggle;
  else root.PricingToggle = PricingToggle;
})(typeof window !== 'undefined' ? window : this);
