/* ============================================
   WALLET AUTH DRAWER — Tab switcher + open/close
   ============================================
   Usage:
     var auth = WalletAuthDrawer.init('[data-wad]', {
       onTab: function (name) {},
       onSubmit: function (data) {},
       onWallet: function (name) {}
     });
     auth.open(); auth.close();
   ============================================ */
(function (root) {
  'use strict';
  var defaults = { onTab: null, onSubmit: null, onWallet: null };

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
    var tabs = host.querySelectorAll('.wad-tab');
    var panels = host.querySelectorAll('.wad-panel');
    var cta = host.querySelector('.wad-cta');
    var input = host.querySelector('.wad-input');
    var close = host.querySelector('.wad-close');

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.classList.remove('is-active'); });
        panels.forEach(function (p) { p.classList.remove('is-active'); });
        t.classList.add('is-active');
        if (panels[i]) panels[i].classList.add('is-active');
        if (typeof o.onTab === 'function') o.onTab(t.textContent.trim());
      });
    });
    if (cta) cta.addEventListener('click', function () {
      var activeTab = host.querySelector('.wad-tab.is-active');
      var name = activeTab ? activeTab.textContent.trim() : '';
      if (typeof o.onSubmit === 'function') o.onSubmit({ type: name, value: input ? input.value : '' });
    });
    host.querySelectorAll('.wad-wallet').forEach(function (b) {
      b.addEventListener('click', function () {
        if (typeof o.onWallet === 'function') o.onWallet(b.textContent.trim());
      });
    });
    if (close) close.addEventListener('click', function () { host.classList.remove('is-open'); });
    host.addEventListener('click', function (e) {
      if (e.target === host) host.classList.remove('is-open');
    });

    return {
      el: host,
      open: function () { host.classList.add('is-open'); },
      close: function () { host.classList.remove('is-open'); }
    };
  }

  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var WalletAuthDrawer = { init: init };
  if (typeof module !== 'undefined' && module.exports) module.exports = WalletAuthDrawer;
  else root.WalletAuthDrawer = WalletAuthDrawer;
})(typeof window !== 'undefined' ? window : this);
