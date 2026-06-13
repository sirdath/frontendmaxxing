/* ============================================
   THEME SWITCH — dark/light controller for theme-switch.css
   ============================================
   Flips data-theme on a target element, persists the choice to localStorage,
   and falls back to the OS preference on first load.

   Usage:
     ThemeSwitch.init('.thsw');                                  // target = <html>
     ThemeSwitch.init('.thsw', { target: document.body, onChange: t => {} });
     ThemeSwitch.apply();   // apply the stored/OS theme on load without a button

   Methods: init(sel, opts) · apply(opts) — init returns instances with
   get()/set(theme)/destroy(). Options: target · storageKey · onChange(theme).
   ============================================ */
(function (root) {
  'use strict';

  var KEY = 'fm-theme';
  function stored(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function save(key, v) { try { localStorage.setItem(key, v); } catch (e) {} }
  function osTheme() { return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'; }
  function resolve(key) { var s = stored(key); return (s === 'dark' || s === 'light') ? s : osTheme(); }

  function applyTo(target, theme) { (target || document.documentElement).setAttribute('data-theme', theme); }

  function apply(opts) {
    opts = opts || {};
    var theme = resolve(opts.storageKey || KEY);
    applyTo(opts.target || document.documentElement, theme);
    return theme;
  }

  function bind(el, opts) {
    opts = opts || {};
    var target = opts.target || document.documentElement;
    var key = opts.storageKey || KEY;
    var theme = resolve(key);
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'Toggle theme');

    function render() {
      applyTo(target, theme);
      el.classList.toggle('is-dark', theme === 'dark');
      el.setAttribute('aria-pressed', String(theme === 'dark'));
      if (typeof opts.onChange === 'function') { try { opts.onChange(theme); } catch (e) {} }
    }
    function set(t) { theme = (t === 'dark') ? 'dark' : 'light'; save(key, theme); render(); }
    function onClick() { set(theme === 'dark' ? 'light' : 'dark'); }

    render();
    el.addEventListener('click', onClick);
    return { el: el, get: function () { return theme; }, set: set, destroy: function () { el.removeEventListener('click', onClick); } };
  }

  function init(target, opts) {
    var els = typeof target === 'string'
      ? Array.prototype.slice.call(document.querySelectorAll(target))
      : (target instanceof Element ? [target] : Array.prototype.slice.call(target || []));
    return els.map(function (el) { return bind(el, opts); });
  }

  var ThemeSwitch = { init: init, apply: apply };
  if (typeof module !== 'undefined' && module.exports) module.exports = ThemeSwitch;
  else root.ThemeSwitch = ThemeSwitch;
})(typeof window !== 'undefined' ? window : this);
