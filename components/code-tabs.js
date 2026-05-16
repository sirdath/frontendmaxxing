/* ============================================
   CODE TABS — Tab switcher + copy-to-clipboard
   ============================================
   Usage:
     CodeTabs.init('[data-ctabs]', { onChange: function (i, lang) {} });
   ============================================ */
(function (root) {
  'use strict';
  var defaults = { onChange: null };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var insts = [];
    Array.prototype.forEach.call(els, function (el) { insts.push(create(el, opts)); });
    return insts.length === 1 ? insts[0] : insts;
  }

  function create(host, opts) {
    var o = mergeOpts(opts);
    var tabs = host.querySelectorAll('.ctabs-tab');
    var panels = host.querySelectorAll('.ctabs-panel');
    var copy = host.querySelector('.ctabs-copy');

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        panels.forEach(function (p) { p.classList.remove('is-active'); });
        tab.classList.add('is-active');
        if (panels[i]) panels[i].classList.add('is-active');
        if (typeof o.onChange === 'function') o.onChange(i, tab.textContent.trim());
      });
    });

    if (copy) {
      copy.addEventListener('click', function () {
        var active = host.querySelector('.ctabs-panel.is-active');
        if (!active) return;
        var text = active.textContent;
        navigator.clipboard.writeText(text).then(function () {
          host.classList.add('is-copied');
          var original = copy.textContent;
          copy.textContent = '✓';
          setTimeout(function () { host.classList.remove('is-copied'); copy.textContent = original; }, 1400);
        });
      });
    }

    return { el: host };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var CodeTabs = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = CodeTabs;
  else root.CodeTabs = CodeTabs;
})(typeof window !== 'undefined' ? window : this);
