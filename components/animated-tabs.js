/* ============================================
   ANIMATED TABS — Position the sliding pill to match the active tab
   Inspired by skiper-ui / Linear.app
   ============================================
   Usage:
     AnimatedTabs.init('[data-atabs]', {
       panelsSelector: '.atabs-panels',
       onChange: function (idx, tab) { … }
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    panelsSelector: '.atabs-panels',
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

    var tabs = Array.prototype.slice.call(el.querySelectorAll('.atabs-tab'));
    var pill = el.querySelector('.atabs-pill');
    if (!pill) {
      pill = document.createElement('span');
      pill.className = 'atabs-pill';
      el.appendChild(pill);
    }

    var vertical = el.classList.contains('atabs-vertical');

    var panels = [];
    var panelContainer = el.parentElement && el.parentElement.querySelector(o.panelsSelector);
    if (panelContainer) panels = Array.prototype.slice.call(panelContainer.querySelectorAll('.atabs-panel'));

    function place(tab) {
      var r = tab.getBoundingClientRect();
      var er = el.getBoundingClientRect();
      var pad = parseFloat(getComputedStyle(el).getPropertyValue('--atabs-pad')) || 4;
      if (vertical) {
        pill.style.transform = 'translateY(' + (r.top - er.top - pad) + 'px)';
        pill.style.height = r.height + 'px';
      } else {
        pill.style.transform = 'translateX(' + (r.left - er.left - pad) + 'px)';
        pill.style.width = r.width + 'px';
      }
    }

    function activate(idx) {
      tabs.forEach(function (t, i) { t.classList.toggle('is-active', i === idx); });
      panels.forEach(function (p, i) { p.classList.toggle('is-active', i === idx); });
      place(tabs[idx]);
      if (typeof o.onChange === 'function') o.onChange(idx, tabs[idx]);
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { activate(i); });
    });

    var initialIdx = Math.max(0, tabs.findIndex(function (t) { return t.classList.contains('is-active'); }));
    requestAnimationFrame(function () { activate(initialIdx); });

    var ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(function () {
        var active = el.querySelector('.atabs-tab.is-active');
        if (active) place(active);
      });
      ro.observe(el);
    } else {
      window.addEventListener('resize', function () {
        var active = el.querySelector('.atabs-tab.is-active');
        if (active) place(active);
      });
    }

    function destroy() {
      tabs.forEach(function (t) { t.replaceWith(t.cloneNode(true)); });
      if (ro) ro.disconnect();
    }

    return { el: el, activate: activate, destroy: destroy };
  }

  var AnimatedTabs = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = AnimatedTabs;
  else root.AnimatedTabs = AnimatedTabs;
})(typeof window !== 'undefined' ? window : this);
