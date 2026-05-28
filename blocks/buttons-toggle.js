/* ============================================
   BUTTON TOGGLE — Two-state toggle button driver (like / follow / bookmark …)
   Inspired by X / YouTube / Spotify toggle buttons
   ============================================
   Toggles the .is-on class + aria-pressed, bumps a .tg-count if present,
   and fires onToggle(on, el). Works for every variant in buttons-toggle.css.

   Usage:
     ButtonToggle.init('.tgbtn', { onToggle: function (on, el) { … } });

   Each instance: toggle(), set(on), isOn()
   ============================================ */
(function (root) {
  'use strict';

  function create(el, opts) {
    opts = opts || {};
    var countEl = el.querySelector('.tg-count');
    var baseCount = countEl ? parseInt(countEl.textContent.replace(/[^\d]/g, ''), 10) || 0 : 0;

    function reflectCount(on) {
      if (!countEl) return;
      var n = baseCount + (on ? 1 : 0);
      countEl.textContent = n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : n;
    }

    function set(on) {
      el.classList.toggle('is-on', !!on);
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
      reflectCount(on);
      if (typeof opts.onToggle === 'function') opts.onToggle(!!on, el);
    }

    function toggle() { set(!el.classList.contains('is-on')); }

    el.addEventListener('click', toggle);
    // initialize aria + count from current class
    var initialOn = el.classList.contains('is-on');
    el.setAttribute('aria-pressed', initialOn ? 'true' : 'false');

    return {
      el: el,
      toggle: toggle,
      set: set,
      isOn: function () { return el.classList.contains('is-on'); },
      destroy: function () { el.removeEventListener('click', toggle); }
    };
  }

  function init(target, opts) {
    if (typeof target === 'string') {
      var nodes = document.querySelectorAll(target);
      if (nodes.length === 0) return null;
      if (nodes.length === 1) return create(nodes[0], opts);
      var arr = []; nodes.forEach(function (n) { arr.push(create(n, opts)); });
      return arr;
    }
    return create(target, opts);
  }

  var ButtonToggle = { init: init, create: create };
  if (typeof module !== 'undefined' && module.exports) module.exports = ButtonToggle;
  else root.ButtonToggle = ButtonToggle;
})(typeof window !== 'undefined' ? window : this);
