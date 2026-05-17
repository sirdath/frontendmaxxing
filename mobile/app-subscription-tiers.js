/* ============================================
   APP SUBSCRIPTION TIERS — Toggle monthly/yearly + card selection
   ============================================
   Usage:
     AppSubTiers.init('.aptiers', { onChange: function (period, plan) {} });
   ============================================ */
(function (root) {
  'use strict';

  function init(target, opts) {
    opts = opts || {};
    var nodes = typeof target === 'string' ? document.querySelectorAll(target) : [target];
    Array.prototype.forEach.call(nodes, function (el) { bind(el, opts); });
  }

  function bind(root, opts) {
    if (root.dataset.aptBound) return;
    root.dataset.aptBound = '1';

    var toggle = root.querySelector('[data-aptiers-toggle], .aptiers-toggle');
    var opts_btns = toggle ? toggle.querySelectorAll('.aptiers-toggle-opt') : [];
    var cards = root.querySelectorAll('.aptiers-card');
    var cta = root.querySelector('.aptiers-cta');

    var period = (toggle && toggle.getAttribute('data-period')) || 'monthly';

    function setPeriod(p) {
      period = p;
      if (toggle) toggle.setAttribute('data-period', p);
      opts_btns.forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-period') === p);
      });
      // Update prices
      cards.forEach(function (c) {
        var priceEl = c.querySelector('.aptiers-card-price');
        if (!priceEl) return;
        var val = priceEl.getAttribute('data-' + p);
        if (val) {
          priceEl.firstChild && (priceEl.firstChild.nodeValue = val);
          // re-append the span if first child was overwritten
          if (!priceEl.querySelector('span')) {
            var span = document.createElement('span');
            span.textContent = '/mo';
            priceEl.appendChild(span);
          }
        }
      });
      if (typeof opts.onChange === 'function') opts.onChange(period, getActivePlan());
    }

    function getActivePlan() {
      var active = root.querySelector('.aptiers-card.is-active');
      return active ? active.querySelector('.aptiers-card-name').textContent.trim() : null;
    }

    opts_btns.forEach(function (b) {
      b.addEventListener('click', function () { setPeriod(b.getAttribute('data-period')); });
    });

    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        cards.forEach(function (x) { x.classList.remove('is-active'); });
        c.classList.add('is-active');
        if (cta) {
          var name = c.querySelector('.aptiers-card-name');
          cta.textContent = 'Continue with ' + (name ? name.textContent.trim() : 'plan');
        }
        if (typeof opts.onChange === 'function') opts.onChange(period, getActivePlan());
      });
    });
  }

  var AppSubTiers = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = AppSubTiers;
  else root.AppSubTiers = AppSubTiers;
})(typeof window !== 'undefined' ? window : this);
