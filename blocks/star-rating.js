/* ============================================
   STAR RATING — Click + hover preview rating input
   Inspired by App Store / Trustpilot
   ============================================
   Usage:
     StarRating.init('[data-rating]', {
       value: 3,
       max: 5,
       onChange: function (v) { … }
     });

   Reads initial value from data-rating-value, max from data-rating-max.
   Auto-builds buttons if container is empty.
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    value: 0,
    max: 5,
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

    var max = parseInt(el.getAttribute('data-rating-max'), 10) || o.max;
    var value = parseFloat(el.getAttribute('data-rating-value'));
    if (isNaN(value)) value = o.value;

    if (!el.querySelector('.rate-icon')) {
      for (var i = 1; i <= max; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'rate-icon';
        b.setAttribute('data-rating-v', i);
        b.setAttribute('aria-label', i + ' of ' + max);
        el.appendChild(b);
      }
    }

    var icons = Array.prototype.slice.call(el.querySelectorAll('.rate-icon'));

    function paint(n, hover) {
      icons.forEach(function (ic, i) {
        var v = parseInt(ic.getAttribute('data-rating-v'), 10);
        ic.classList.toggle('is-filled', !hover && v <= n);
        ic.classList.toggle('is-hover', !!hover && v <= n);
      });
    }

    paint(value, false);

    function onClick(e) {
      var b = e.target.closest('.rate-icon');
      if (!b) return;
      value = parseInt(b.getAttribute('data-rating-v'), 10);
      paint(value, false);
      if (typeof o.onChange === 'function') o.onChange(value);
    }
    function onOver(e) {
      var b = e.target.closest('.rate-icon');
      if (!b) return;
      paint(parseInt(b.getAttribute('data-rating-v'), 10), true);
    }
    function onLeave() { paint(value, false); }

    el.addEventListener('click', onClick);
    el.addEventListener('pointerover', onOver);
    el.addEventListener('pointerleave', onLeave);

    function destroy() {
      el.removeEventListener('click', onClick);
      el.removeEventListener('pointerover', onOver);
      el.removeEventListener('pointerleave', onLeave);
    }

    return {
      el: el, destroy: destroy,
      getValue: function () { return value; },
      setValue: function (v) { value = v; paint(v, false); }
    };
  }

  var StarRating = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = StarRating;
  else root.StarRating = StarRating;
})(typeof window !== 'undefined' ? window : this);
