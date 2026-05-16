/* ============================================
   COMBOBOX — Autocomplete with keyboard nav, fuzzy filter
   Inspired by Radix Combobox / shadcn
   ============================================
   Usage:
     Combobox.init('[data-combobox]', {
       options: [
         { value: 'react',  label: 'React',  meta: 'JS' },
         { value: 'vue',    label: 'Vue.js', meta: 'JS' }
       ],
       freeText: false,           // allow custom value not in list
       minChars: 0,               // open after N chars
       onSelect: function (item) { … },
       onChange: function (val)   { … }   // every keystroke
     });
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    options: [],
    freeText: false,
    minChars: 0,
    placeholder: 'Search…',
    onSelect: null,
    onChange: null,
    emptyText: 'No matches'
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function escape(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var input = el.querySelector('.cmb-input');
    var menu  = el.querySelector('.cmb-menu');
    if (!input) {
      el.innerHTML =
        '<input class="cmb-input" placeholder="' + escape(o.placeholder) + '" autocomplete="off">' +
        '<div class="cmb-menu" role="listbox"></div>';
      input = el.querySelector('.cmb-input');
      menu  = el.querySelector('.cmb-menu');
    }
    input.placeholder = o.placeholder;

    function render(filter) {
      var q = (filter || '').toLowerCase().trim();
      var matches = o.options.filter(function (it) {
        if (!q) return true;
        return it.label.toLowerCase().indexOf(q) !== -1 ||
               String(it.value).toLowerCase().indexOf(q) !== -1;
      });
      if (!matches.length) {
        menu.innerHTML = '<div class="cmb-empty">' + escape(o.emptyText) + '</div>';
        return;
      }
      menu.innerHTML = matches.map(function (it, i) {
        return '<div class="cmb-option' + (i === 0 ? ' is-focused' : '') + '" data-value="' + escape(it.value) + '">' +
          escape(it.label) +
          (it.meta ? '<span class="cmb-option-meta">' + escape(it.meta) + '</span>' : '') +
          '<span class="cmb-option-hint">↵</span>' +
        '</div>';
      }).join('');
    }

    function open() {
      if (input.value.length < o.minChars) return;
      el.classList.add('is-open');
      render(input.value);
    }
    function close() { el.classList.remove('is-open'); }

    function focused() { return menu.querySelector('.cmb-option.is-focused'); }
    function moveFocus(dir) {
      var opts = Array.prototype.slice.call(menu.querySelectorAll('.cmb-option'));
      if (!opts.length) return;
      var idx = opts.indexOf(focused());
      if (idx === -1) idx = 0;
      idx = Math.max(0, Math.min(opts.length - 1, idx + dir));
      opts.forEach(function (o) { o.classList.remove('is-focused'); });
      opts[idx].classList.add('is-focused');
      opts[idx].scrollIntoView({ block: 'nearest' });
    }

    function pick(item) {
      input.value = item.label;
      close();
      if (typeof o.onSelect === 'function') o.onSelect(item);
    }

    function onInput() {
      if (typeof o.onChange === 'function') o.onChange(input.value);
      open();
    }
    function onFocus() { open(); }
    function onMenuClick(e) {
      var op = e.target.closest('.cmb-option');
      if (!op) return;
      var item = o.options.find(function (it) { return it.value === op.getAttribute('data-value'); });
      if (item) pick(item);
    }
    function onKey(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (!el.classList.contains('is-open')) open(); moveFocus(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveFocus(-1); }
      else if (e.key === 'Enter') {
        var f = focused();
        if (f) {
          e.preventDefault();
          var item = o.options.find(function (it) { return it.value === f.getAttribute('data-value'); });
          if (item) pick(item);
        } else if (o.freeText && input.value.trim()) {
          pick({ value: input.value, label: input.value });
        }
      }
      else if (e.key === 'Escape') { close(); }
    }
    function onOutside(e) {
      if (!el.contains(e.target)) close();
    }

    input.addEventListener('input', onInput);
    input.addEventListener('focus', onFocus);
    el.addEventListener('keydown', onKey);
    menu.addEventListener('click', onMenuClick);
    document.addEventListener('click', onOutside);

    function destroy() {
      input.removeEventListener('input', onInput);
      input.removeEventListener('focus', onFocus);
      el.removeEventListener('keydown', onKey);
      menu.removeEventListener('click', onMenuClick);
      document.removeEventListener('click', onOutside);
    }

    return {
      el: el, open: open, close: close, destroy: destroy,
      setOptions: function (a) { o.options = a; if (el.classList.contains('is-open')) render(input.value); }
    };
  }

  var Combobox = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = Combobox;
  else root.Combobox = Combobox;
})(typeof window !== 'undefined' ? window : this);
