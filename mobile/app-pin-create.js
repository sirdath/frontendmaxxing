/* ============================================
   APP PIN CREATE — Numeric keypad + dot indicator
   ============================================
   Usage:
     AppPin.init('.appin', {
       length: 4,
       onComplete: function (pin) {},
       onChange:   function (partial) {}
     });
   ============================================ */
(function (root) {
  'use strict';

  function init(target, opts) {
    opts = opts || {};
    var nodes = typeof target === 'string' ? document.querySelectorAll(target) : [target];
    Array.prototype.forEach.call(nodes, function (el) { bind(el, opts); });
  }

  function bind(root_el, opts) {
    if (root_el.dataset.apPinBound) return;
    root_el.dataset.apPinBound = '1';
    var dots = root_el.querySelector('[data-app-pin]') || root_el.querySelector('.appin-dots');
    var length = parseInt((dots && dots.dataset.length) || opts.length || 4, 10);
    var pin = '';

    // Ensure dot count matches length
    if (dots) {
      var have = dots.querySelectorAll('.appin-dot').length;
      while (have < length) { var d = document.createElement('span'); d.className = 'appin-dot'; dots.appendChild(d); have++; }
    }

    function render() {
      var dotEls = dots ? dots.querySelectorAll('.appin-dot') : [];
      Array.prototype.forEach.call(dotEls, function (el, i) {
        el.classList.toggle('is-filled', i < pin.length);
      });
      if (typeof opts.onChange === 'function') opts.onChange(pin);
      if (pin.length === length) {
        if (typeof opts.onComplete === 'function') opts.onComplete(pin);
      }
    }

    function press(key) {
      if (key === 'back') {
        pin = pin.slice(0, -1);
      } else if (/^\d$/.test(key) && pin.length < length) {
        pin += key;
      }
      render();
    }

    function shake() {
      if (!dots) return;
      dots.classList.add('is-error');
      setTimeout(function () { dots.classList.remove('is-error'); pin = ''; render(); }, 450);
    }

    root_el.querySelectorAll('.appin-key').forEach(function (k) {
      k.addEventListener('click', function () {
        var key = k.getAttribute('data-key');
        if (key) press(key);
      });
    });

    // Keyboard support
    var onKey = function (e) {
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') press('back');
    };
    root_el.addEventListener('keydown', onKey);
    root_el.tabIndex = 0;

    // Expose shake to caller via stored ref
    root_el._appin = { shake: shake, reset: function () { pin = ''; render(); }, value: function () { return pin; } };
  }

  var AppPin = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = AppPin;
  else root.AppPin = AppPin;
})(typeof window !== 'undefined' ? window : this);
